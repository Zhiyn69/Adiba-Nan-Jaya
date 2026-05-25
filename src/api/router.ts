import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import xss from 'xss';
import rateLimit from 'express-rate-limit';
import { getDb } from '../database/db';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'adiba-customer-jwt-secret-fixed-2025';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'adiba-refresh-jwt-secret-fixed-2025';
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'adiba-admin-jwt-secret-fixed-2025';

const sanitizeInput = (input: any) => {
  if (typeof input === "string") return xss(input.trim());
  return input;
};

// Rate limiter for admin login
const adminAuthLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 3, // 3 failed attempts
  message: { error: "Terlalu banyak percobaan masuk. Akun terkunci selama 30 menit." },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: "Terlalu banyak percobaan masuk, silakan coba lagi setelah 15 menit" },
});

// Middleware for Admin checks
export const adminMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as any;
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    // Check if still active
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);
    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: "Akun dinonaktifkan" });
    }
    
    (req as any).admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware for SuperAdmin checks
export const superAdminMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const admin = (req as any).admin;
  if (!admin || admin.role !== 'superadmin') {
    return res.status(403).json({ error: "Superadmin only" });
  }
  next();
};

export const customerMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    if (!user || user.status !== 'active' || user.role !== 'customer') {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Utility to log admin actions
export const logAdminAction = async (adminId: string, action: string, target: string, oldValue: string, newValue: string) => {
  const db = await getDb();
  await db.run(
    'INSERT INTO admin_logs (id, admin_id, action, target, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?)',
    [crypto.randomUUID(), adminId, action, target, oldValue, newValue]
  );
};


// ----------------------------------------------------
// AUTH ROUTES
// ----------------------------------------------------

router.post("/auth/register", async (req, res) => {
  try {
    const { fullName, companyName, phone, email, password } = req.body;
    
    const sEmail = sanitizeInput(email).toLowerCase();
    const sFullName = sanitizeInput(fullName);
    const sCompanyName = sanitizeInput(companyName);
    const sPhone = sanitizeInput(phone);
    
    if (!sEmail || !password || !sFullName || !sPhone) {
      return res.status(400).json({ error: "Semua fild yang wajib harus diisi" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password minimal 8 karakter" });
    }

    const db = await getDb();
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [sEmail]);
    if (existing) {
      return res.status(400).json({ error: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const userId = crypto.randomUUID();
    
    await db.run(
      'INSERT INTO users (id, name, company, email, phone, password_hash, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, sFullName, sCompanyName, sEmail, sPhone, passwordHash, 'customer', 'active']
    );

    return res.status(201).json({ message: "Registrasi berhasil, silakan login" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;
    const sIdentifier = sanitizeInput(identifier).toLowerCase();

    const db = await getDb();
    const user = await db.get(
      'SELECT * FROM users WHERE email = ? OR phone = ? AND role = "customer"',
      [sIdentifier, sIdentifier]
    );

    if (!user || user.role !== 'customer') {
      return res.status(401).json({ error: "Email/Nomor HP atau password salah" });
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({ error: "Akun dinonaktifkan" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Email/Nomor HP atau password salah" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshExpiresIn = rememberMe ? "7d" : "1d";
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: refreshExpiresIn }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.json({
      message: "Login berhasil",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        company: user.company,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.json({ message: "Logout berhasil" });
});

router.post("/auth/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).json({ error: "Sesi telah berakhir" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [decoded.id]);
    
    if (!user || user.status !== 'active') {
      res.clearCookie("refreshToken");
      return res.status(403).json({ error: "User tidak ditemukan atau dinonaktifkan" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (err) {
    res.clearCookie("refreshToken");
    return res.status(403).json({ error: "Refresh token invalid atau expired" });
  }
});

router.get("/auth/me", customerMiddleware, async (req, res) => {
  const userId = (req as any).user.id;
  const db = await getDb();
  const user = await db.get('SELECT id, name, company, email, phone, role FROM users WHERE id = ?', [userId]);
  res.json({ user });
});

// ----------------------------------------------------
// ADMIN ROUTES
// ----------------------------------------------------

router.post("/admin/login", adminAuthLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const sEmail = sanitizeInput(email).toLowerCase();

    const db = await getDb();
    const user = await db.get(
      'SELECT * FROM users WHERE email = ? AND (role = "admin" OR role = "superadmin")',
      [sEmail]
    );

    if (!user) {
      return res.status(401).json({ error: "Kredensial tidak valid" });
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({ error: "Akun dinonaktifkan" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    
    // Log attempt
    await db.run(
      'INSERT INTO login_logs (id, user_id, ip, device, status) VALUES (?, ?, ?, ?, ?)',
      [crypto.randomUUID(), user.id, req.ip, req.headers['user-agent'] || '', isValid ? 'success' : 'failed']
    );

    if (!isValid) {
      return res.status(401).json({ error: "Kredensial tidak valid" });
    }

    // Admin token expires in 8 hours, no refresh token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      ADMIN_JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000
    });

    res.json({
      message: "Login admin berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.post("/admin/logout", (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logout admin berhasil" });
});

router.get("/admin/me", adminMiddleware, async (req, res) => {
  const userId = (req as any).admin.id;
  const db = await getDb();
  const user = await db.get('SELECT id, name, company, email, phone, role FROM users WHERE id = ?', [userId]);
  res.json({ user });
});

// Admin Dashboard stats
router.get("/admin/dashboard", adminMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    
    const today = new Date().toISOString().split('T')[0];
    
    const totalOrders = await db.get("SELECT COUNT(*) as count FROM orders WHERE date(created_at) = ?", [today]);
    const pendingPayments = await db.get("SELECT COUNT(*) as count FROM orders WHERE payment_status = 'pending'");
    const newCustomers = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'customer' AND date(created_at) = ?", [today]);
    const totalRevenue = await db.get("SELECT SUM(total) as revenue FROM orders WHERE payment_status = 'confirmed'");

    res.json({
      totalOrdersToday: totalOrders?.count || 0,
      pendingPayments: pendingPayments?.count || 0,
      newCustomersToday: newCustomers?.count || 0,
      totalRevenue: totalRevenue?.revenue || 0
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Orders management
router.get("/admin/orders", adminMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const orders = await db.all("SELECT orders.*, users.name as customer_name, users.email as customer_email FROM orders LEFT JOIN users ON orders.user_id = users.id ORDER BY orders.created_at DESC");
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/admin/orders/:id/status", adminMiddleware, async (req, res) => {
  try {
    const { order_status } = req.body;
    const db = await getDb();
    
    const order = await db.get("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    await db.run("UPDATE orders SET order_status = ? WHERE id = ?", [order_status, req.params.id]);
    await logAdminAction((req as any).admin.id, 'update_order_status', req.params.id, order.order_status, order_status);
    
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Customers management
router.get("/admin/customers", adminMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const customers = await db.all("SELECT id, name, company, email, phone, status, created_at FROM users WHERE role = 'customer' ORDER BY created_at DESC");
    res.json({ customers });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/admin/customers/:id/status", adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const db = await getDb();
    
    const user = await db.get("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role === 'superadmin') return res.status(403).json({ error: "Cannot modify superadmin" });
    
    await db.run("UPDATE users SET status = ? WHERE id = ?", [status, req.params.id]);
    await logAdminAction((req as any).admin.id, 'update_customer_status', req.params.id, user.status, status);
    
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin logs
router.get("/admin/audit-logs", adminMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const logs = await db.all("SELECT admin_logs.*, users.name as admin_name FROM admin_logs LEFT JOIN users ON admin_logs.admin_id = users.id ORDER BY admin_logs.timestamp DESC");
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/admin/login-logs", adminMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const logs = await db.all("SELECT login_logs.*, users.name, users.email FROM login_logs LEFT JOIN users ON login_logs.user_id = users.id ORDER BY login_logs.timestamp DESC LIMIT 100");
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
