import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = 'http://localhost:4200/api';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState({ email: 'customer@example.com', password: 'demo123' });
  const [profile, setProfile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [decision, setDecision] = useState({ customerId: '', status: 'APPROVED', note: '' });

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
    if (!response.ok) throw new Error(data.error || JSON.stringify(data.errors || {}) || 'Request failed');
    return data;
  }

  async function submitLogin(event) {
    event.preventDefault();
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(login)
      });
      setToken(data.token);
      setUser(data.user);
      setMessage(`Logged in as ${data.user.role}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadData() {
    if (!token || !user) return;
    try {
      if (user.role === 'CUSTOMER') {
        setProfile(await request('/profile'));
      } else {
        const query = filter ? `?status=${filter}` : '';
        setCustomers(await request(`/admin/customers${query}`));
      }
      setAudit(await request('/audit'));
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, [token, user, filter]);

  async function saveProfile(event) {
    event.preventDefault();
    try {
      const updated = await request('/profile', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
      setProfile(updated);
      setMessage('Profile submitted for review');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitDecision(event) {
    event.preventDefault();
    if (!decision.customerId) return setMessage('Select a customer first');
    try {
      await request(`/admin/customers/${decision.customerId}/decision`, {
        method: 'POST',
        body: JSON.stringify({ status: decision.status, note: decision.note })
      });
      setDecision({ customerId: '', status: 'APPROVED', note: '' });
      setMessage('Admin decision saved');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function switchDemo(role) {
    if (role === 'ADMIN') setLogin({ email: 'admin@example.com', password: 'admin123' });
    else setLogin({ email: 'customer@example.com', password: 'demo123' });
  }

  if (!token) {
    return (
      <main className="auth-page">
        <section className="login-card">
          <p className="eyebrow">Customer Platform</p>
          <h1>Secure Onboarding Portal</h1>
          <p className="muted">A React + Node.js project for profile updates, validation, review states and admin decisions.</p>
          <div className="demo-buttons">
            <button type="button" onClick={() => switchDemo('CUSTOMER')}>Use customer demo</button>
            <button type="button" className="secondary" onClick={() => switchDemo('ADMIN')}>Use admin demo</button>
          </div>
          <form onSubmit={submitLogin} className="stack">
            <input value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
            <input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <button>Login</button>
          </form>
          {message && <p className="message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Onboarding Workflow</p>
          <h1>Customer Profile Review Portal</h1>
          <span>Logged in as {user.email} ({user.role})</span>
        </div>
        <button className="secondary" onClick={() => { setToken(''); setUser(null); }}>Logout</button>
      </header>

      {message && <div className="message">{message}</div>}

      {user.role === 'CUSTOMER' && profile && (
        <section className="panel">
          <div className="status-row">
            <h2>My Profile</h2>
            <span className={`status ${profile.status.toLowerCase()}`}>{profile.status}</span>
          </div>
          <form onSubmit={saveProfile} className="profile-grid">
            <label>Name<input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
            <label>Email<input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label>
            <label>Phone<input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></label>
            <label>Business Type<input value={profile.businessType} onChange={(e) => setProfile({ ...profile, businessType: e.target.value })} /></label>
            <label className="full">Address<input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} /></label>
            <label className="full">Expected Use<textarea value={profile.expectedUse} onChange={(e) => setProfile({ ...profile, expectedUse: e.target.value })} /></label>
            <button>Save and submit for review</button>
          </form>
          <p className="muted">Support note: {profile.supportNote}</p>
        </section>
      )}

      {user.role === 'ADMIN' && (
        <section className="panel">
          <div className="split-heading">
            <h2>Admin Review Queue</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option>SUBMITTED</option>
              <option>REVIEW_REQUIRED</option>
              <option>APPROVED</option>
              <option>REJECTED</option>
            </select>
          </div>
          <div className="cards">
            {customers.map((customer) => (
              <article key={customer.id} className={decision.customerId === customer.id ? 'customer-card active' : 'customer-card'} onClick={() => setDecision({ ...decision, customerId: customer.id })}>
                <div className="status-row">
                  <strong>{customer.name}</strong>
                  <span className={`status ${customer.status.toLowerCase()}`}>{customer.status}</span>
                </div>
                <p>{customer.email}</p>
                <p>{customer.expectedUse}</p>
                <small>{customer.supportNote}</small>
              </article>
            ))}
          </div>
          <form onSubmit={submitDecision} className="decision-form">
            <select value={decision.status} onChange={(e) => setDecision({ ...decision, status: e.target.value })}>
              <option>APPROVED</option>
              <option>REJECTED</option>
              <option>REVIEW_REQUIRED</option>
            </select>
            <input placeholder="Decision note" value={decision.note} onChange={(e) => setDecision({ ...decision, note: e.target.value })} />
            <button>Save decision</button>
          </form>
        </section>
      )}

      <section className="panel">
        <h2>Status History</h2>
        <ul className="audit-list">
          {audit.map((event) => (
            <li key={event.id}><strong>{event.action}</strong> — {event.customerId} — {event.note}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
