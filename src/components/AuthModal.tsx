import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Phone, User, Building, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

type AuthModalProps = {
  isDark: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({ isDark, onClose, onSuccess }: AuthModalProps) {
  const { login, fetchCsrfToken } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength computation
  let strength = 'Lemah';
  let strengthColor = 'text-red-500';
  let strengthWidth = 'w-1/3';
  if (password.length >= 8) {
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      strength = 'Kuat';
      strengthColor = 'text-emerald-500';
      strengthWidth = 'w-full';
    } else {
      strength = 'Sedang';
      strengthColor = 'text-orange-500';
      strengthWidth = 'w-2/3';
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const csrfToken = await fetchCsrfToken();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ identifier: email, password, rememberMe })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || res.statusText || 'Gagal login');
      }
      
      login(data.accessToken, data.user);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Anda harus menyetujui syarat & ketentuan');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const csrfToken = await fetchCsrfToken();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ fullName, companyName, phone, email, password })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || res.statusText || 'Gagal register');
      }
      
      setSuccessMsg('Registrasi berhasil! Link verifikasi telah dikirim ke email Anda. Silakan login (Simulasi).');
      setActiveTab('login');
      // pre-fill email
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/60'}`} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md overflow-hidden rounded shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
      >
        <div className="flex">
          <button 
            onClick={() => { setActiveTab('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-4 text-[14px] font-[700] uppercase tracking-wider transition-colors ${
              activeTab === 'login' 
                ? (isDark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-50 text-emerald-600') 
                : (isDark ? 'bg-slate-900 text-slate-500 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900')
            } border-b-2 ${activeTab === 'login' ? 'border-emerald-500' : 'border-transparent'}`}
          >
            Masuk
          </button>
          <button 
            onClick={() => { setActiveTab('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-4 text-[14px] font-[700] uppercase tracking-wider transition-colors ${
              activeTab === 'register' 
                ? (isDark ? 'bg-slate-800 text-emerald-400' : 'bg-slate-50 text-emerald-600') 
                : (isDark ? 'bg-slate-900 text-slate-500 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-900')
            } border-b-2 ${activeTab === 'register' ? 'border-emerald-500' : 'border-transparent'}`}
          >
            Daftar
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-[800] uppercase tracking-tight">
              {activeTab === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h2>
            <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4">
                <div className={`p-3 rounded flex items-start gap-2 text-[13px] font-[500] ${isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4">
                <div className={`p-3 rounded flex items-start gap-2 text-[13px] font-[500] ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  {successMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-[12px] font-[700] uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email / No WhatsApp</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input 
                      type="text" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded text-[14px] outline-none transition-all ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'} border-2 border-transparent focus:border-emerald-500`}
                      placeholder="nama@perusahaan.com / 081..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`block text-[12px] font-[700] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Password / OTP</label>
                  {/^[0-9]+$/.test(email) && email.length >= 10 && (
                    <button 
                      type="button" 
                      onClick={() => setSuccessMsg("Kode OTP telah dikirim ke WhatsApp Anda! (Simulasi: ketik password Anda)")}
                      className="text-[11px] font-[700] text-emerald-500 hover:underline cursor-pointer"
                    >
                      Kirim OTP
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded text-[14px] outline-none transition-all ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'} border-2 border-transparent focus:border-emerald-500`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-emerald-500 border-emerald-500' : (isDark ? 'border-slate-600 group-hover:border-slate-500' : 'border-slate-300 group-hover:border-slate-400')}`}>
                    {rememberMe && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                  <span className={`text-[12px] font-[600] ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-900'}`}>Ingat Saya (30 hari)</span>
                </label>
                
                <button type="button" onClick={() => setSuccessMsg("Link reset password telah dikirim ke email Anda. (Simulasi)")} className={`text-[12px] font-[600] transition-colors ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'}`}>
                  Lupa Password?
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-[700] text-[14px] uppercase tracking-wider transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Masuk Sekarang'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[12px] font-[700] uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Nama Lengkap</label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input 
                      type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required
                      className={`w-full pl-9 pr-3 py-2.5 rounded text-[13px] outline-none transition-all ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'} border-2 border-transparent focus:border-emerald-500`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-[12px] font-[700] uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Perusahaan</label>
                  <div className="relative">
                    <Building className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input 
                      type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded text-[13px] outline-none transition-all ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'} border-2 border-transparent focus:border-emerald-500`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[12px] font-[700] uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>WhatsApp</label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input 
                      type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                      className={`w-full pl-9 pr-3 py-2.5 rounded text-[13px] outline-none transition-all ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'} border-2 border-transparent focus:border-emerald-500`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-[12px] font-[700] uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className={`w-full pl-9 pr-3 py-2.5 rounded text-[13px] outline-none transition-all ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'} border-2 border-transparent focus:border-emerald-500`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-[12px] font-[700] uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input 
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className={`w-full pl-9 pr-3 py-2.5 rounded text-[13px] outline-none transition-all ${isDark ? 'bg-slate-800 text-white placeholder-slate-500 focus:bg-slate-700' : 'bg-slate-100 text-slate-900 placeholder-slate-400 focus:bg-slate-200'} border-2 border-transparent focus:border-emerald-500`}
                  />
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-[700] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kekuatan Password:</span>
                      <span className={`text-[11px] font-[800] uppercase ${strengthColor}`}>{strength}</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
                      <div className={`h-full ${strengthWidth} transition-all duration-300 ${password.length < 8 ? 'bg-red-500' : (strength === 'Kuat' ? 'bg-emerald-500' : 'bg-orange-500')}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 shrink-0 mt-0.5 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-emerald-500 border-emerald-500' : (isDark ? 'border-slate-600 group-hover:border-slate-500' : 'border-slate-300 group-hover:border-slate-400')}`}>
                    {termsAccepted && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                  <span className={`text-[12px] leading-[1.5] font-[500] ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    Saya menyetujui Syarat & Ketentuan serta menyetujui penggunaan data registrasi sesuai Kebijakan Privasi platform.
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-2 py-3 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-[700] text-[14px] uppercase tracking-wider transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Buat Akun'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
