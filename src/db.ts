import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import path from 'path';

let db: Database | null = null;

export async function getDb() {
  if (db) return db;

  const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join(process.cwd(), 'adiba.sqlite') 
    : path.join(process.cwd(), 'adiba-dev.sqlite');

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      unit TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      image TEXT,
      updated_by TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending',
      order_status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS login_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      ip TEXT,
      device TEXT,
      location TEXT,
      status TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      old_value TEXT,
      new_value TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(admin_id) REFERENCES users(id)
    );
  `);

  // Seed default admin
  const admin = await db.get(`SELECT id FROM users WHERE role = 'superadmin'`);
  if (!admin) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Admin@12345', salt);
    
    await db.run(`
      INSERT INTO users (id, name, company, email, phone, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      crypto.randomUUID(),
      'Super Admin',
      'Adiba',
      'admin@adiba.com',
      '08000000000',
      passwordHash,
      'superadmin',
      'active'
    ]);
    console.log('✅ Default admin created: admin@adiba.com / Admin@12345');
  }

  return db;
}
