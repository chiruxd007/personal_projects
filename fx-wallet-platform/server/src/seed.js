import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { pool } from './db.js';

const customerId = '11111111-1111-1111-1111-111111111111';
const adminUserId = '22222222-2222-2222-2222-222222222222';

const wallets = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', currency: 'AUD', balance: 12500 },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', currency: 'USD', balance: 2400 },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', currency: 'EUR', balance: 1500 },
  { id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', currency: 'GBP', balance: 800 },
  { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', currency: 'INR', balance: 350000 }
];

async function seed() {
  const passwordHash = await bcrypt.hash('demo123', 10);

  await pool.execute(
    `INSERT INTO customers (id, name, email, status)
     VALUES (?, 'Chirantan Demo Customer', 'chirantan@example.com', 'ACTIVE')
     ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status)`,
    [customerId]
  );

  await pool.execute(
    `INSERT INTO users (id, customer_id, email, password_hash, role)
     VALUES (?, ?, 'chirantan@example.com', ?, 'ADMIN')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role)`,
    [adminUserId, customerId, passwordHash]
  );

  for (const wallet of wallets) {
    await pool.execute(
      `INSERT INTO wallets (id, customer_id, currency, status)
       VALUES (?, ?, ?, 'ACTIVE')
       ON DUPLICATE KEY UPDATE status = VALUES(status)`,
      [wallet.id, customerId, wallet.currency]
    );

    const referenceId = randomUUID();
    const [existing] = await pool.execute(
      'SELECT id FROM ledger_entries WHERE wallet_id = ? AND reference_type = ? LIMIT 1',
      [wallet.id, 'SEED_BALANCE']
    );

    if (existing.length === 0) {
      await pool.execute(
        `INSERT INTO ledger_entries (id, wallet_id, direction, amount, currency, reference_type, reference_id, description)
         VALUES (?, ?, 'CREDIT', ?, ?, 'SEED_BALANCE', ?, 'Initial demo balance')`,
        [randomUUID(), wallet.id, wallet.balance.toFixed(2), wallet.currency, referenceId]
      );
    }
  }

  await pool.execute(
    `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, payload_json)
     VALUES (?, 'DEMO_DATA_SEEDED', 'system', 'seed', JSON_OBJECT('wallets', ?))`,
    [adminUserId, wallets.length]
  );

  console.log('Seed complete. Login with chirantan@example.com / demo123');
  await pool.end();
}

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
