import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4200;

app.use(cors());
app.use(express.json());

const sessions = new Map();
const users = [
  { id: 'USR-1', email: 'customer@example.com', password: 'demo123', role: 'CUSTOMER', customerId: 'CUS-1001' },
  { id: 'USR-2', email: 'admin@example.com', password: 'admin123', role: 'ADMIN', customerId: null }
];

const customers = [
  {
    id: 'CUS-1001',
    name: 'Aisha Patel',
    email: 'customer@example.com',
    phone: '0400 111 222',
    address: '120 Collins Street, Melbourne VIC',
    businessType: 'Individual',
    expectedUse: 'International tuition and family transfers',
    status: 'SUBMITTED',
    supportNote: 'Profile submitted for review',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'CUS-1002',
    name: 'Rural Exports Co',
    email: 'ops@ruralexports.example',
    phone: '0400 333 444',
    address: '55 Market Road, Geelong VIC',
    businessType: 'Business',
    expectedUse: 'Supplier payments and export receipts',
    status: 'REVIEW_REQUIRED',
    supportNote: 'Need clearer expected-use description',
    updatedAt: new Date().toISOString()
  }
];

const auditEvents = [
  { id: 1, actor: 'system', action: 'CUSTOMER_CREATED', customerId: 'CUS-1001', note: 'Initial customer record created', createdAt: new Date().toISOString() },
  { id: 2, actor: 'admin@example.com', action: 'STATUS_REVIEW_REQUIRED', customerId: 'CUS-1002', note: 'Requested clearer account-use details', createdAt: new Date().toISOString() }
];

function makeToken(user) {
  const token = `demo-token-${user.id}-${Date.now()}`;
  sessions.set(token, user);
  return token;
}

function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = sessions.get(token);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
}

function validateProfile(data) {
  const errors = {};
  if (!data.name || data.name.trim().length < 2) errors.name = 'Name is required';
  if (!data.email || !data.email.includes('@')) errors.email = 'Valid email is required';
  if (!data.phone || data.phone.trim().length < 8) errors.phone = 'Phone number is required';
  if (!data.address || data.address.trim().length < 8) errors.address = 'Address is required';
  if (!data.expectedUse || data.expectedUse.trim().length < 12) errors.expectedUse = 'Explain expected account use in more detail';
  return errors;
}

function recordAudit(actor, action, customerId, note) {
  auditEvents.unshift({
    id: auditEvents.length + 1,
    actor,
    action,
    customerId,
    note,
    createdAt: new Date().toISOString()
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'customer-onboarding-portal' });
});

app.post('/api/auth/login', (req, res) => {
  const user = users.find((item) => item.email === req.body.email && item.password === req.body.password);
  if (!user) return res.status(401).json({ error: 'Invalid login' });
  const token = makeToken(user);
  res.json({ token, user: { email: user.email, role: user.role, customerId: user.customerId } });
});

app.get('/api/profile', auth, (req, res) => {
  if (req.user.role === 'ADMIN') return res.status(400).json({ error: 'Admins should use the review queue' });
  const profile = customers.find((customer) => customer.id === req.user.customerId);
  res.json(profile);
});

app.put('/api/profile', auth, (req, res) => {
  if (req.user.role !== 'CUSTOMER') return res.status(403).json({ error: 'Customer access required' });
  const profile = customers.find((customer) => customer.id === req.user.customerId);
  const errors = validateProfile(req.body);
  if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

  Object.assign(profile, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    businessType: req.body.businessType,
    expectedUse: req.body.expectedUse,
    status: 'SUBMITTED',
    supportNote: 'Profile submitted for admin review',
    updatedAt: new Date().toISOString()
  });
  recordAudit(req.user.email, 'PROFILE_SUBMITTED', profile.id, 'Customer updated and submitted profile');
  res.json(profile);
});

app.get('/api/admin/customers', auth, requireAdmin, (req, res) => {
  const { status = '' } = req.query;
  const data = status ? customers.filter((customer) => customer.status === status) : customers;
  res.json(data);
});

app.post('/api/admin/customers/:id/decision', auth, requireAdmin, (req, res) => {
  const customer = customers.find((item) => item.id === req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  if (!['APPROVED', 'REJECTED', 'REVIEW_REQUIRED'].includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid decision status' });
  }
  customer.status = req.body.status;
  customer.supportNote = req.body.note || '';
  customer.updatedAt = new Date().toISOString();
  recordAudit(req.user.email, `STATUS_${req.body.status}`, customer.id, req.body.note || 'Admin decision recorded');
  res.json(customer);
});

app.get('/api/audit', auth, (req, res) => {
  if (req.user.role === 'ADMIN') return res.json(auditEvents);
  res.json(auditEvents.filter((event) => event.customerId === req.user.customerId));
});

app.listen(PORT, () => {
  console.log(`Customer onboarding API running on http://localhost:${PORT}`);
});
