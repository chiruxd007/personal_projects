import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4100;

app.use(cors());
app.use(express.json());

const transactions = [
  {
    id: 'TRX-1001',
    customer: 'Melbourne Sports Club',
    fromCurrency: 'AUD',
    toCurrency: 'USD',
    sourceAmount: 24000,
    destinationAmount: 16080,
    status: 'COMPLETED',
    riskFlag: 'LOW',
    exceptionReason: '',
    ledgerEntries: 2,
    quoteStatus: 'CONFIRMED',
    notes: ['Settled normally'],
    createdAt: '2026-07-01T10:15:00Z'
  },
  {
    id: 'TRX-1002',
    customer: 'Agri Export Co',
    fromCurrency: 'AUD',
    toCurrency: 'INR',
    sourceAmount: 18500,
    destinationAmount: 1037850,
    status: 'REVIEW_REQUIRED',
    riskFlag: 'MEDIUM',
    exceptionReason: 'Beneficiary details need review',
    ledgerEntries: 0,
    quoteStatus: 'PENDING',
    notes: ['Waiting for updated beneficiary address'],
    createdAt: '2026-07-02T03:20:00Z'
  },
  {
    id: 'TRX-1003',
    customer: 'Student Payment Group',
    fromCurrency: 'AUD',
    toCurrency: 'GBP',
    sourceAmount: 7200,
    destinationAmount: 3744,
    status: 'FAILED',
    riskFlag: 'HIGH',
    exceptionReason: 'Provider rejected transfer instruction',
    ledgerEntries: 1,
    quoteStatus: 'CONFIRMED',
    notes: ['Needs reversal review because only one ledger entry exists'],
    createdAt: '2026-07-03T05:45:00Z'
  },
  {
    id: 'TRX-1004',
    customer: 'Elite Football Academy',
    fromCurrency: 'USD',
    toCurrency: 'AUD',
    sourceAmount: 9500,
    destinationAmount: 14155,
    status: 'PENDING',
    riskFlag: 'LOW',
    exceptionReason: '',
    ledgerEntries: 0,
    quoteStatus: 'CONFIRMED',
    notes: ['Awaiting provider settlement response'],
    createdAt: '2026-07-04T09:00:00Z'
  },
  {
    id: 'TRX-1005',
    customer: 'Rural Equipment Imports',
    fromCurrency: 'AUD',
    toCurrency: 'EUR',
    sourceAmount: 31200,
    destinationAmount: 19032,
    status: 'COMPLETED',
    riskFlag: 'LOW',
    exceptionReason: '',
    ledgerEntries: 2,
    quoteStatus: 'CONFIRMED',
    notes: ['Completed with expected ledger count'],
    createdAt: '2026-07-05T13:35:00Z'
  }
];

function filterTransactions(query) {
  return transactions.filter((tx) => {
    const matchesSearch = !query.search || `${tx.id} ${tx.customer}`.toLowerCase().includes(query.search.toLowerCase());
    const matchesStatus = !query.status || tx.status === query.status;
    const pair = `${tx.fromCurrency}/${tx.toCurrency}`;
    const matchesPair = !query.currencyPair || pair === query.currencyPair;
    const matchesRisk = !query.riskFlag || tx.riskFlag === query.riskFlag;
    return matchesSearch && matchesStatus && matchesPair && matchesRisk;
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'fx-operations-dashboard' });
});

app.get('/api/transactions', (req, res) => {
  res.json(filterTransactions(req.query));
});

app.get('/api/reconciliation', (_req, res) => {
  const completed = transactions.filter((tx) => tx.status === 'COMPLETED').length;
  const pending = transactions.filter((tx) => tx.status === 'PENDING').length;
  const failed = transactions.filter((tx) => tx.status === 'FAILED').length;
  const reviewRequired = transactions.filter((tx) => tx.status === 'REVIEW_REQUIRED').length;
  const flagged = transactions.filter((tx) => tx.riskFlag !== 'LOW').length;
  const exceptions = transactions.filter((tx) => tx.status !== 'COMPLETED' || tx.ledgerEntries !== 2 || tx.riskFlag !== 'LOW');

  res.json({
    summary: { completed, pending, failed, reviewRequired, flagged, total: transactions.length },
    exceptions
  });
});

app.post('/api/transactions/:id/notes', (req, res) => {
  const tx = transactions.find((item) => item.id === req.params.id);
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });
  if (!req.body.note) return res.status(400).json({ error: 'Note is required' });
  tx.notes.push(req.body.note);
  res.json(tx);
});

app.get('/api/export/transactions.csv', (_req, res) => {
  const header = 'id,customer,pair,sourceAmount,destinationAmount,status,riskFlag,exceptionReason';
  const rows = transactions.map((tx) => [
    tx.id,
    tx.customer,
    `${tx.fromCurrency}/${tx.toCurrency}`,
    tx.sourceAmount,
    tx.destinationAmount,
    tx.status,
    tx.riskFlag,
    tx.exceptionReason
  ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','));

  res.setHeader('Content-Type', 'text/csv');
  res.send([header, ...rows].join('\n'));
});

app.listen(PORT, () => {
  console.log(`FX Operations API running on http://localhost:${PORT}`);
});
