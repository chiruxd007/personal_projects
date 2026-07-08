CREATE DATABASE IF NOT EXISTS fx_wallet;
USE fx_wallet;

CREATE TABLE IF NOT EXISTS customers (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  status ENUM('ACTIVE', 'REVIEW_REQUIRED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  customer_id CHAR(36) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS wallets (
  id CHAR(36) PRIMARY KEY,
  customer_id CHAR(36) NOT NULL,
  currency CHAR(3) NOT NULL,
  status ENUM('ACTIVE', 'FROZEN', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_customer_currency (customer_id, currency),
  INDEX idx_wallet_customer_currency (customer_id, currency),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
  id CHAR(36) PRIMARY KEY,
  wallet_id CHAR(36) NOT NULL,
  direction ENUM('CREDIT', 'DEBIT') NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  currency CHAR(3) NOT NULL,
  reference_type VARCHAR(40) NOT NULL,
  reference_id CHAR(36) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ledger_wallet_created (wallet_id, created_at),
  INDEX idx_ledger_reference (reference_type, reference_id),
  FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

CREATE TABLE IF NOT EXISTS fx_quotes (
  id CHAR(36) PRIMARY KEY,
  customer_id CHAR(36) NOT NULL,
  from_currency CHAR(3) NOT NULL,
  to_currency CHAR(3) NOT NULL,
  source_amount DECIMAL(18, 2) NOT NULL,
  rate DECIMAL(18, 6) NOT NULL,
  fee_amount DECIMAL(18, 2) NOT NULL,
  converted_amount DECIMAL(18, 2) NOT NULL,
  status ENUM('PENDING', 'CONFIRMED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_quote_customer_status (customer_id, status),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS transfer_requests (
  id CHAR(36) PRIMARY KEY,
  quote_id CHAR(36) NOT NULL,
  customer_id CHAR(36) NOT NULL,
  status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  provider_reference VARCHAR(80),
  failure_reason VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_transfer_customer_status (customer_id, status),
  FOREIGN KEY (quote_id) REFERENCES fx_quotes(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  action VARCHAR(80) NOT NULL,
  entity_type VARCHAR(80) NOT NULL,
  entity_id VARCHAR(80) NOT NULL,
  payload_json JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_created (created_at),
  INDEX idx_audit_entity (entity_type, entity_id)
);
