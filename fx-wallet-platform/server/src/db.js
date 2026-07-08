import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'fx_user',
  password: process.env.DB_PASSWORD || 'fx_password',
  database: process.env.DB_NAME || 'fx_wallet',
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: false
});
