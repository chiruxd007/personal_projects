import { useEffect, useMemo, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const CURRENCIES = ['AUD', 'USD', 'EUR', 'GBP', 'INR', 'NZD'];

function money(value, currency) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('fx_token') || '');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('fx_user') || 'null'));
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reconciliation, setReconciliation] = useState(null);
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState('');
  const [loginForm, setLoginForm] = useState({ email: 'chirantan@example.com', password: 'demo123' });
  const [walletCurrency, setWalletCurrency] = useState('NZD');
  const [fundForm, setFundForm] = useState({ walletId: '', amount: '500' });
  const [quoteForm, setQuoteForm] = useState({ fromCurrency: 'AUD', toCurrency: 'USD', amount: '1000' });

  const walletByCurrency = useMemo(() => {
    return wallets.reduce((map, wallet) => ({ ...map, [wallet.currency]: wallet }), {});
  }, [wallets]);

  async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function loadDashboard() {
    if (!token) return;
    try {
      const [walletData, transactionData] = await Promise.all([
        request('/wallets'),
        request('/transactions')
      ]);
      setWallets(walletData);
      setTransactions(transactionData);

      if (user?.role === 'ADMIN') {
        const adminData = await request('/admin/reconciliation');
        setReconciliation(adminData);
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [token]);

  async function login(event) {
    event.preventDefault();
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });
      localStorage.setItem('fx_token', data.token);
      localStorage.setItem('fx_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage(`Logged in as ${data.user.email}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem('fx_token');
    localStorage.removeItem('fx_user');
    setToken('');
    setUser(null);
    setWallets([]);
    setTransactions([]);
    setReconciliation(null);
    setQuote(null);
  }

  async function createWallet(event) {
    event.preventDefault();
    try {
      await request('/wallets', {
        method: 'POST',
        body: JSON.stringify({ currency: walletCurrency })
      });
      setMessage(`${walletCurrency} wallet created`);
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function fundWallet(event) {
    event.preventDefault();
    try {
      await request(`/wallets/${fundForm.walletId}/fund`, {
        method: 'POST',
        body: JSON.stringify({ amount: fundForm.amount })
      });
      setMessage('Wallet funded with demo credit');
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function generateQuote(event) {
    event.preventDefault();
    try {
      const data = await request('/quotes', {
        method: 'POST',
        body: JSON.stringify(quoteForm)
      });
      setQuote(data);
      setMessage('Quote generated. Confirm it before expiry.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function confirmQuote() {
    try {
      const data = await request(`/quotes/${quote.id}/confirm`, { method: 'POST' });
      setMessage(`Transfer ${data.status}: ${data.transferId}`);
      setQuote(null);
      await loadDashboard();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!token) {
    return (
      <main className="auth-page">
        <section className="login-card">
          <p className="eyebrow">Fintech Portfolio Project</p>
          <h1>FX Multi-Currency Wallet</h1>
          <p className="muted">
            React + Node.js + MySQL application for wallets, FX quotes, ledger entries,
            audit logs and admin reconciliation workflows.
          </p>
          <form onSubmit={login} className="stack">
            <label>
              Email
              <input value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
            </label>
            <label>
              Password
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            </label>
            <button type="submit">Login to demo wallet</button>
          </form>
          {message && <p className="message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">FX Operations Dashboard</p>
          <h1>Multi-Currency Wallet Platform</h1>
          <p className="muted">
            Logged in as {user?.email} ({user?.role}). Wallet balances are calculated from immutable debit/credit ledger entries.
          </p>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </header>

      {message && <div className="message">{message}</div>}

      <section className="grid cards">
        {wallets.map((wallet) => (
          <article className="wallet-card" key={wallet.id}>
            <span>{wallet.currency}</span>
            <strong>{money(wallet.balance, wallet.currency)}</strong>
            <small>{wallet.status}</small>
          </article>
        ))}
      </section>

      <section className="two-column">
        <article className="panel">
          <h2>Create Wallet</h2>
          <form onSubmit={createWallet} className="stack compact">
            <label>
              Currency
              <select value={walletCurrency} onChange={(e) => setWalletCurrency(e.target.value)}>
                {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
              </select>
            </label>
            <button>Create wallet</button>
          </form>
        </article>

        <article className="panel">
          <h2>Demo Funding</h2>
          <form onSubmit={fundWallet} className="stack compact">
            <label>
              Wallet
              <select value={fundForm.walletId} onChange={(e) => setFundForm({ ...fundForm, walletId: e.target.value })}>
                <option value="">Select wallet</option>
                {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.currency}</option>)}
              </select>
            </label>
            <label>
              Amount
              <input value={fundForm.amount} onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })} />
            </label>
            <button>Add demo funds</button>
          </form>
        </article>
      </section>

      <section className="panel quote-panel">
        <div>
          <h2>Generate FX Quote</h2>
          <p className="muted">Quotes include fees, rate, destination amount and expiry before confirmation.</p>
        </div>
        <form onSubmit={generateQuote} className="quote-form">
          <select value={quoteForm.fromCurrency} onChange={(e) => setQuoteForm({ ...quoteForm, fromCurrency: e.target.value })}>
            {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
          </select>
          <select value={quoteForm.toCurrency} onChange={(e) => setQuoteForm({ ...quoteForm, toCurrency: e.target.value })}>
            {CURRENCIES.map((currency) => <option key={currency}>{currency}</option>)}
          </select>
          <input value={quoteForm.amount} onChange={(e) => setQuoteForm({ ...quoteForm, amount: e.target.value })} />
          <button>Get quote</button>
        </form>

        {quote && (
          <div className="quote-result">
            <div>
              <span>Source</span>
              <strong>{money(quote.sourceAmount, quote.fromCurrency)}</strong>
            </div>
            <div>
              <span>Rate</span>
              <strong>{quote.rate}</strong>
            </div>
            <div>
              <span>Fee</span>
              <strong>{money(quote.fee, quote.fromCurrency)}</strong>
            </div>
            <div>
              <span>Converted</span>
              <strong>{money(quote.convertedAmount, quote.toCurrency)}</strong>
            </div>
            <button onClick={confirmQuote}>Confirm quote</button>
          </div>
        )}
      </section>

      {reconciliation && (
        <section className="panel">
          <h2>Admin Reconciliation</h2>
          <div className="grid cards small-cards">
            <article><span>Total quotes</span><strong>{reconciliation.summary.total_quotes}</strong></article>
            <article><span>Active quotes</span><strong>{reconciliation.summary.active_quotes}</strong></article>
            <article><span>Completed transfers</span><strong>{reconciliation.summary.completed_transfers}</strong></article>
            <article><span>FX ledger entries</span><strong>{reconciliation.summary.fx_ledger_entries}</strong></article>
          </div>
          <p className="muted">Exceptions found: {reconciliation.exceptions.length}</p>
        </section>
      )}

      <section className="panel">
        <h2>Ledger Transactions</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Direction</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td><span className={`pill ${tx.direction.toLowerCase()}`}>{tx.direction}</span></td>
                  <td>{money(tx.amount, tx.currency)}</td>
                  <td>{tx.reference_type}</td>
                  <td>{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel explain">
        <h2>Technical Design Notes</h2>
        <ul>
          <li>Balances are calculated from ledger entries rather than stored as mutable wallet numbers.</li>
          <li>Quote confirmation uses a database transaction to keep source debit and destination credit consistent.</li>
          <li>Admin-only routes expose reconciliation and audit-log data for operations/support workflows.</li>
          <li>The provider-adapter style makes the simulated FX engine replaceable with a real provider API later.</li>
        </ul>
      </section>
    </main>
  );
}
