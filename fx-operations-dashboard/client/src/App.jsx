import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = 'http://localhost:4100/api';

function money(value, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency }).format(Number(value));
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [reconciliation, setReconciliation] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', currencyPair: '', riskFlag: '' });
  const [note, setNote] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [message, setMessage] = useState('');

  async function fetchJson(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  async function loadData() {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)).toString();
    const [txData, recData] = await Promise.all([
      fetchJson(`/transactions${query ? `?${query}` : ''}`),
      fetchJson('/reconciliation')
    ]);
    setTransactions(txData);
    setReconciliation(recData);
  }

  useEffect(() => {
    loadData().catch((error) => setMessage(error.message));
  }, []);

  const currencyPairs = useMemo(() => {
    return [...new Set(transactions.map((tx) => `${tx.fromCurrency}/${tx.toCurrency}`))];
  }, [transactions]);

  async function applyFilters(event) {
    event.preventDefault();
    await loadData();
  }

  async function addNote(event) {
    event.preventDefault();
    if (!selectedId) return setMessage('Select a transaction first');
    try {
      await fetchJson(`/transactions/${selectedId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note })
      });
      setNote('');
      setMessage('Support note added');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="shell">
      <header className="hero">
        <p>Payments Operations</p>
        <h1>FX Operations Dashboard</h1>
        <span>Search, reconcile and review simulated FX transactions.</span>
      </header>

      {message && <div className="message">{message}</div>}

      {reconciliation && (
        <section className="stats">
          {Object.entries(reconciliation.summary).map(([key, value]) => (
            <article key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </section>
      )}

      <section className="panel">
        <h2>Transaction Filters</h2>
        <form className="filters" onSubmit={applyFilters}>
          <input placeholder="Search customer or transaction ID" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            <option>COMPLETED</option>
            <option>PENDING</option>
            <option>FAILED</option>
            <option>REVIEW_REQUIRED</option>
          </select>
          <select value={filters.currencyPair} onChange={(e) => setFilters({ ...filters, currencyPair: e.target.value })}>
            <option value="">All pairs</option>
            {currencyPairs.map((pair) => <option key={pair}>{pair}</option>)}
          </select>
          <select value={filters.riskFlag} onChange={(e) => setFilters({ ...filters, riskFlag: e.target.value })}>
            <option value="">All risk flags</option>
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
          <button>Apply</button>
        </form>
      </section>

      <section className="panel">
        <div className="split-heading">
          <h2>Operations Review Queue</h2>
          <a href="http://localhost:4100/api/export/transactions.csv">Export CSV</a>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Pair</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Exception</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} onClick={() => setSelectedId(tx.id)} className={selectedId === tx.id ? 'selected' : ''}>
                  <td>{tx.id}</td>
                  <td>{tx.customer}</td>
                  <td>{tx.fromCurrency}/{tx.toCurrency}</td>
                  <td>{money(tx.sourceAmount, tx.fromCurrency)}</td>
                  <td>{money(tx.destinationAmount, tx.toCurrency)}</td>
                  <td><span className={`pill ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                  <td>{tx.riskFlag}</td>
                  <td>{tx.exceptionReason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel two-col">
        <div>
          <h2>Support Note</h2>
          <p className="muted">Selected transaction: {selectedId || 'none'}</p>
          <form onSubmit={addNote} className="note-form">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add investigation note..." />
            <button>Add note</button>
          </form>
        </div>
        <div>
          <h2>Exception Report</h2>
          <ul className="exceptions">
            {reconciliation?.exceptions.map((tx) => (
              <li key={tx.id}>
                <strong>{tx.id}</strong> — {tx.exceptionReason || `${tx.status} / ${tx.riskFlag}`} ({tx.ledgerEntries} ledger entries)
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
