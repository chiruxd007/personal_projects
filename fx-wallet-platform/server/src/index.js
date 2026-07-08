import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import Decimal from 'decimal.js';
import { pool } from './db.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const QUOTE_TTL_MINUTES = 10;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const FX_RATES = {
  AUD: { USD: 0.67, EUR: 0.61, GBP: 0.52, INR: 56.1, NZD: 1.09 },
  USD: { AUD: 1.49, EUR: 0.91, GBP: 0.78, INR: 83.7, NZD: 1.63 },
  EUR: { AUD: 1.64, USD: 1.09, GBP: 0.86, INR: 91.8, NZD: 1.78 },
  GBP: { AUD: 1.92, USD: 1.28, EUR: 1.16, INR: 106.5, NZD: 2.07 },
  INR: { AUD: 0.0178, USD: 0.0119, EUR: 0.0109, GBP: 0.0094, NZD: 0.0194 },
  NZD: { AUD: 0.92, USD: 0.61, EUR: 0.56, GBP: 0.48, INR: 51.6 }
};

function asMoney(value, places = 2) {
  return new Decimal(value).toDecimalPlaces(places, Decimal.ROUND_HALF_UP).toFixed(places);
}

function calculateQuote(fromCurrency, toCurrency, amount) {
  const rate = fromCurrency === toCurrency ? 1 : FX_RATES[fromCurrency]?.[toCurrency];
  if (!rate) throw new Error(`Unsupported currency pair ${fromCurrency}/${toCurrency}`);

  const sourceAmount = new Decimal(amount);
  if (!sourceAmount.isPositive()) throw new Error('Amount must be greater than zero');

  const fee = Decimal.max(sourceAmount.mul(0.008), new Decimal(3));
  const netAmount = sourceAmount.minus(fee);
  if (!netAmount.isPositive()) throw new Error('Amount is too small after fees');

  return {
    rate: asMoney(rate, 6),
    fee: asMoney(fee),
    convertedAmount: asMoney(netAmount.mul(rate))
  };
}

async function audit(userId, action, entityType, entityId, payload = {}) {
  await pool.execute(
    'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, payload_json) VALUES (?, ?, ?, ?, ?)',
    [userId, action, entityType, entityId, JSON.stringify(payload)]
  );
}

async function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'fx-wallet-platform' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.execute(
    `SELECT users.*, customers.name AS customer_name
     FROM users JOIN customers ON users.customer_id = customers.id
     WHERE users.email = ?`,
    [email]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid login details' });
  }

  const token = jwt.sign(
    { userId: user.id, customerId: user.customer_id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, user: { email: user.email, role: user.role, customerName: user.customer_name } });
});

app.get('/api/wallets', auth, async (req, res) => {
  const [wallets] = await pool.execute(
    `SELECT w.id, w.currency, w.status, w.created_at,
      COALESCE(SUM(CASE WHEN le.direction = 'CREDIT' THEN le.amount ELSE -le.amount END), 0) AS balance
     FROM wallets w
     LEFT JOIN ledger_entries le ON le.wallet_id = w.id
     WHERE w.customer_id = ?
     GROUP BY w.id
     ORDER BY w.currency`,
    [req.user.customerId]
  );
  res.json(wallets);
});

app.post('/api/wallets', auth, async (req, res) => {
  const { currency } = req.body;
  if (!FX_RATES[currency]) return res.status(400).json({ error: 'Unsupported currency' });
  const id = randomUUID();
  await pool.execute(
    'INSERT INTO wallets (id, customer_id, currency, status) VALUES (?, ?, ?, ?)',
    [id, req.user.customerId, currency, 'ACTIVE']
  );
  await audit(req.user.userId, 'WALLET_CREATED', 'wallet', id, { currency });
  res.status(201).json({ id, currency, status: 'ACTIVE', balance: '0.00' });
});

app.post('/api/wallets/:id/fund', auth, async (req, res) => {
  const { amount, description = 'Demo funding credit' } = req.body;
  const [walletRows] = await pool.execute(
    'SELECT * FROM wallets WHERE id = ? AND customer_id = ?',
    [req.params.id, req.user.customerId]
  );
  const wallet = walletRows[0];
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const amountDecimal = new Decimal(amount || 0);
  if (!amountDecimal.isPositive()) return res.status(400).json({ error: 'Amount must be greater than zero' });

  const id = randomUUID();
  await pool.execute(
    `INSERT INTO ledger_entries (id, wallet_id, direction, amount, currency, reference_type, reference_id, description)
     VALUES (?, ?, 'CREDIT', ?, ?, 'MANUAL_FUNDING', ?, ?)`,
    [id, wallet.id, asMoney(amount), wallet.currency, id, description]
  );
  await audit(req.user.userId, 'WALLET_FUNDED', 'ledger_entry', id, { walletId: wallet.id, amount });
  res.status(201).json({ id, walletId: wallet.id, amount: asMoney(amount), currency: wallet.currency });
});

app.post('/api/quotes', auth, async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const quote = calculateQuote(fromCurrency, toCurrency, amount);
    const id = randomUUID();
    const expiresAt = new Date(Date.now() + QUOTE_TTL_MINUTES * 60 * 1000);

    await pool.execute(
      `INSERT INTO fx_quotes
       (id, customer_id, from_currency, to_currency, source_amount, rate, fee_amount, converted_amount, status, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
      [id, req.user.customerId, fromCurrency, toCurrency, asMoney(amount), quote.rate, quote.fee, quote.convertedAmount, expiresAt]
    );
    await audit(req.user.userId, 'QUOTE_CREATED', 'fx_quote', id, { fromCurrency, toCurrency, amount, ...quote });
    res.status(201).json({ id, fromCurrency, toCurrency, sourceAmount: asMoney(amount), ...quote, expiresAt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/quotes/:id/confirm', auth, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[quote]] = await connection.execute(
      'SELECT * FROM fx_quotes WHERE id = ? AND customer_id = ? FOR UPDATE',
      [req.params.id, req.user.customerId]
    );
    if (!quote) throw new Error('Quote not found');
    if (quote.status !== 'PENDING') throw new Error(`Quote is already ${quote.status}`);
    if (new Date(quote.expires_at).getTime() < Date.now()) throw new Error('Quote has expired');

    const [[sourceWallet]] = await connection.execute(
      'SELECT * FROM wallets WHERE customer_id = ? AND currency = ? AND status = "ACTIVE" FOR UPDATE',
      [req.user.customerId, quote.from_currency]
    );
    const [[destinationWallet]] = await connection.execute(
      'SELECT * FROM wallets WHERE customer_id = ? AND currency = ? AND status = "ACTIVE" FOR UPDATE',
      [req.user.customerId, quote.to_currency]
    );
    if (!sourceWallet || !destinationWallet) throw new Error('Source or destination wallet does not exist');

    const [[balanceRow]] = await connection.execute(
      `SELECT COALESCE(SUM(CASE WHEN direction = 'CREDIT' THEN amount ELSE -amount END), 0) AS balance
       FROM ledger_entries WHERE wallet_id = ?`,
      [sourceWallet.id]
    );
    if (new Decimal(balanceRow.balance).lessThan(quote.source_amount)) throw new Error('Insufficient source wallet balance');

    const transferId = randomUUID();
    await connection.execute(
      `INSERT INTO transfer_requests (id, quote_id, customer_id, status, provider_reference, failure_reason)
       VALUES (?, ?, ?, 'COMPLETED', ?, NULL)`,
      [transferId, quote.id, req.user.customerId, `SIM-${transferId.slice(0, 8).toUpperCase()}`]
    );

    await connection.execute(
      `INSERT INTO ledger_entries (id, wallet_id, direction, amount, currency, reference_type, reference_id, description)
       VALUES (?, ?, 'DEBIT', ?, ?, 'FX_TRANSFER', ?, ?)`,
      [randomUUID(), sourceWallet.id, quote.source_amount, quote.from_currency, transferId, `FX conversion ${quote.from_currency}/${quote.to_currency}`]
    );
    await connection.execute(
      `INSERT INTO ledger_entries (id, wallet_id, direction, amount, currency, reference_type, reference_id, description)
       VALUES (?, ?, 'CREDIT', ?, ?, 'FX_TRANSFER', ?, ?)`,
      [randomUUID(), destinationWallet.id, quote.converted_amount, quote.to_currency, transferId, `FX conversion ${quote.from_currency}/${quote.to_currency}`]
    );
    await connection.execute('UPDATE fx_quotes SET status = "CONFIRMED" WHERE id = ?', [quote.id]);
    await connection.commit();

    await audit(req.user.userId, 'QUOTE_CONFIRMED', 'transfer_request', transferId, { quoteId: quote.id });
    res.json({ transferId, status: 'COMPLETED' });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/transactions', auth, async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT le.id, le.direction, le.amount, le.currency, le.reference_type, le.reference_id, le.description, le.created_at,
            w.currency AS wallet_currency
     FROM ledger_entries le
     JOIN wallets w ON w.id = le.wallet_id
     WHERE w.customer_id = ?
     ORDER BY le.created_at DESC
     LIMIT 100`,
    [req.user.customerId]
  );
  res.json(rows);
});

app.get('/api/admin/reconciliation', auth, requireAdmin, async (_req, res) => {
  const [[summary]] = await pool.execute(
    `SELECT
      (SELECT COUNT(*) FROM fx_quotes) AS total_quotes,
      (SELECT COUNT(*) FROM fx_quotes WHERE status = 'PENDING' AND expires_at > NOW()) AS active_quotes,
      (SELECT COUNT(*) FROM transfer_requests WHERE status = 'COMPLETED') AS completed_transfers,
      (SELECT COUNT(*) FROM ledger_entries WHERE reference_type = 'FX_TRANSFER') AS fx_ledger_entries`
  );
  const [exceptions] = await pool.execute(
    `SELECT q.id AS quote_id, q.status, q.from_currency, q.to_currency, q.source_amount, q.converted_amount, tr.status AS transfer_status,
            COUNT(le.id) AS ledger_entry_count
     FROM fx_quotes q
     LEFT JOIN transfer_requests tr ON tr.quote_id = q.id
     LEFT JOIN ledger_entries le ON le.reference_id = tr.id
     GROUP BY q.id, tr.status
     HAVING q.status = 'CONFIRMED' AND ledger_entry_count <> 2
     ORDER BY q.created_at DESC`
  );
  const [recentAudit] = await pool.execute('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 15');
  res.json({ summary, exceptions, recentAudit });
});

app.get('/api/admin/audit', auth, requireAdmin, async (_req, res) => {
  const [rows] = await pool.execute('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
  res.json(rows);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`FX Wallet API running on http://localhost:${PORT}`);
});
