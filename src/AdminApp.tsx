import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, LogOut, Package } from 'lucide-react';

const AdminLogin = ({ setToken }: { setToken: (token: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-lg border border-slate-800 w-full max-w-md shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Admin Access</h2>
        </div>
        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-emerald-500" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-2 focus:outline-none focus:border-emerald-500" 
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded transition-colors uppercase text-sm tracking-wider mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard').then(r => r.json()).then(setStats);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold uppercase mb-6 text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Orders Today', value: stats?.totalOrdersToday || 0 },
          { label: 'Pending Payments', value: stats?.pendingPayments || 0 },
          { label: 'New Customers', value: stats?.newCustomersToday || 0 },
          { label: 'Total Revenue', value: `Rp ${(stats?.totalRevenue || 0).toLocaleString()}` }
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 p-6 rounded shadow-lg">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{s.label}</div>
            <div className="text-3xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged in 
    const checkAuth = async () => {
      const res = await fetch('/api/admin/me');
      if (res.ok) {
        setToken("authenticated"); // we just use httpOnly cookies mostly
      }
    };
    checkAuth();
  }, []);

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin setToken={setToken} />} />
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setToken(null);
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-[70px] flex items-center px-6 border-b border-slate-800">
           <span className="font-[900] text-[20px] tracking-[-1px] uppercase text-white">
             PT ADIBA<span className="text-emerald-500">.</span>
             <span className="ml-2 text-xs text-slate-500 tracking-wider">ADMIN</span>
           </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#/admin/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded bg-slate-800 text-white font-medium">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="#/admin/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded text-slate-400 font-medium">
            <ShoppingCart size={18} /> Orders
          </a>
          <a href="#/admin/customers" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded text-slate-400 font-medium">
            <Users size={18} /> Customers
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded w-full text-left text-red-400 font-medium tracking-wide">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}
