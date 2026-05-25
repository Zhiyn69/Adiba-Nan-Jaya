/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  CreditCard, 
  Droplets, 
  Download, 
  Menu, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
  Layers
} from 'lucide-react';
import CatalogView from '../components/CatalogView';

import { AuthProvider } from '../components/AuthContext';

export default function CustomerApp() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);

  const navigation = [
    { name: 'Beranda', href: '#beranda' },
    { name: 'Tentang Kami', href: '#tentang-kami' },
    { name: 'Layanan', href: '#layanan' },
    { name: 'Kontak', href: '#kontak' },
  ];

  return (
    <AuthProvider>
      <title>PT Adiba | General Supplier & Payment Handling</title>
      <meta name="description" content="PT Adiba adalah solusi pengadaan umum dan layanan pengelolaan pembayaran B2B yang profesional, terpercaya, dan terintegrasi untuk pertumbuhan bisnis Anda." />
      <meta property="og:title" content="PT Adiba | General Supplier & Payment Handling" />
      <meta property="og:description" content="PT Adiba adalah solusi pengadaan umum dan layanan pengelolaan pembayaran B2B yang profesional, terpercaya, dan terintegrasi untuk pertumbuhan bisnis Anda." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="PT Adiba | General Supplier & Payment Handling" />
      <meta name="twitter:description" content="PT Adiba adalah solusi pengadaan umum dan layanan pengelolaan pembayaran B2B yang profesional." />
      
      <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-emerald-500 selection:text-white pb-0 ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Sticky Navbar */}
      <nav className={`fixed w-full z-50 border-b h-[70px] flex items-center transition-all bg-opacity-95 backdrop-blur-sm ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-full max-w-[960px] mx-auto px-5 relative z-50">
          <div className="flex justify-between items-center w-full">
            {/* Logo area */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className={`font-[900] text-[24px] tracking-[-1px] uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                PT ADIBA<span className="text-emerald-500">.</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-[14px] font-[600] uppercase tracking-[0.05em] transition-colors ${isDark ? 'text-slate-300 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'}`}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center gap-4 border-l border-slate-300 dark:border-slate-700 pl-4">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
                  aria-label="Toggle Dark Mode"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setShowCatalog(true)}
                  className="relative overflow-hidden px-[24px] py-[12px] rounded font-[700] text-[14px] uppercase inline-flex items-center text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Katalog Online
                  </span>
                </button>
                <a
                  href="#kontak"
                  className={`border-2 px-[24px] py-[12px] rounded font-[700] text-[14px] uppercase inline-flex items-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isDark ? 'border-white text-white hover:bg-white hover:text-slate-900' : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}
                >
                  Hubungi Kami
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full transition-colors ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                 {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`absolute top-[70px] left-0 w-full md:hidden border-b shadow-xl overflow-hidden z-40 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-[14px] font-[700] uppercase tracking-[0.05em] rounded-md transition-colors ${isDark ? 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800' : 'text-slate-700 hover:text-emerald-600 hover:bg-slate-50'}`}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-3 pb-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowCatalog(true);
                  }}
                  className="relative overflow-hidden w-full px-6 py-3 flex items-center justify-center rounded font-[700] uppercase text-[14px] text-white shadow-lg transition-all duration-300 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Katalog Online
                  </span>
                </button>
                <a
                  href="#kontak"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-center border-2 px-6 py-3 rounded font-[700] uppercase text-[14px] relative z-50 pointer-events-auto transition-colors ${isDark ? 'border-white text-white hover:bg-slate-800' : 'border-slate-900 text-slate-900 hover:bg-slate-50'}`}
                >
                  Hubungi Kami Sekarang
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section 
        id="beranda" 
        className={`relative pt-[120px] pb-10 lg:pt-[140px] lg:pb-20 transition-colors duration-500 ${isDark ? 'bg-slate-950 bg-[radial-gradient(circle_at_90%_10%,_#1e293b_0%,_transparent_40%)]' : 'bg-white bg-[radial-gradient(circle_at_90%_10%,_#f1f5f9_0%,_transparent_40%)]'}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-[960px] mx-auto px-5 relative z-10 text-left">
          
          <div className="inline-block mb-6 pt-10">
            <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-emerald-500 block">
              <ShieldCheck className="w-4 h-4 inline mr-2 -mt-1" />
              Official General Supplier & B2B Partner
            </span>
          </div>
          
          <h1 className={`text-[40px] md:text-[62px] font-[800] tracking-[-0.04em] leading-[0.85] uppercase max-w-4xl mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Solusi Pengadaan Umum & <br className="hidden lg:block"/>
            Layanan Pembayaran Terintegrasi
          </h1>
          
          <p className={`text-[16px] leading-[1.6] border-l-4 border-emerald-500 pl-5 mb-10 max-w-2xl text-left transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Meningkatkan efisiensi korporat melalui pengelolaan rantai pasok kimia industri, alat umum, serta dukungan finansial handling system yang profesional dan terverifikasi.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start justify-start gap-4 text-left">
            <a
              href="#kontak"
              className="w-full sm:w-auto inline-flex items-center justify-center px-[28px] py-[14px] text-[14px] font-[700] rounded text-white bg-emerald-500 uppercase transition-all duration-300 hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30"
            >
              Hubungi Kami
              <ChevronRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="#layanan"
              className={`w-full sm:w-auto inline-flex items-center justify-center border-2 px-[24px] py-[12px] text-[14px] font-[700] rounded uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark ? 'border-white text-white hover:bg-white hover:text-slate-900' : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'}`}
            >
              Pelajari Layanan
            </a>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section 
        id="tentang-kami" 
        className={`py-[64px] transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-white'}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-[960px] mx-auto px-5">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div>
              <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-emerald-500 mb-4 block">Tentang PT Adiba</span>
              <h3 className={`text-[40px] font-[800] uppercase tracking-[-0.03em] leading-[0.9] mb-6 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Mitra Strategis Anda untuk Skala Bisnis yang Lebih Besar.
              </h3>
              <div className="border-l-4 border-emerald-500 pl-5 mb-8">
                <p className={`text-[16px] leading-[1.6] mb-4 transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Sebagai entitas usaha yang berfokus pada efisiensi korporasi B2B, PT Adiba berevolusi dari penyedia spesifik produk kimia industri menjadi General Supplier komprehensif.
                </p>
                <p className={`text-[16px] leading-[1.6] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Komitmen kami adalah membantu perusahaan memastikan kepastian pasokan logistik sekaligus menyediakan ekosistem pendukung operasional melalui Payment Handling System yang transparan dan aman.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  "Legalitas Usaha Valid", 
                  "Infrastruktur Pembayaran",
                  "Jaringan Suplai Luas",
                  "Solusi Kustom B2B"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className={`font-[600] text-[14px] uppercase transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual representation placeholder */}
            <div className="relative mt-8 lg:mt-0">
              <div className={`border-2 aspect-[4/3] flex items-center justify-center p-8 rounded transition-colors duration-500 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-900 bg-slate-50'}`}>
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto rounded shadow-sm border flex items-center justify-center mb-6 transition-colors duration-500 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-900'}`}>
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h4 className={`text-[20px] font-[700] mb-2 uppercase transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>Terverifikasi</h4>
                  <p className={`text-[13px] leading-[1.5] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Mendukung ekosistem tender dan integrasi gateway pembayaran pihak ketiga.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        id="layanan" 
        className="py-[64px] bg-slate-900 text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-[960px] mx-auto px-5">
          <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-emerald-500 mb-4 block">Pilar Utama</span>
          <div className="mb-12">
            <h3 className="text-[40px] font-[800] uppercase tracking-[-0.03em] leading-[0.9]">Spesialisasi Sektor Layanan</h3>
            <p className="mt-4 text-[16px] text-slate-400 leading-[1.6] max-w-2xl border-l-4 border-emerald-500 pl-5">Solusi end-to-end kami dirancang untuk memastikan kesinambungan dan keamanan operasional bisnis Anda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Service 1 */}
            <div className="border border-white/20 p-6 flex flex-col justify-between hover:bg-white/5 transition-colors min-h-[220px] rounded">
              <span className="text-[14px] font-[700] opacity-40">01</span>
              <div>
                <Droplets className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="text-[20px] font-[700] mb-3 leading-[1.2]">Industrial Chemical & Cleaning Supplies</h4>
                <p className="text-[13px] opacity-70 leading-[1.6]">
                  Penyediaan material bahan kimia industri (sabun komersial, disinfektan, bahan aditif) berstandar tinggi yang menunjang operasional pabrik, fasilitas umum, maupun institusi B2B.
                </p>
              </div>
            </div>

            {/* Service 2 */}
            <div className="border border-white/20 p-6 flex flex-col justify-between hover:bg-white/5 transition-colors min-h-[220px] rounded">
              <span className="text-[14px] font-[700] opacity-40">02</span>
              <div>
                <Building className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="text-[20px] font-[700] mb-3 leading-[1.2]">General Industrial Supply</h4>
                <p className="text-[13px] opacity-70 leading-[1.6]">
                  Memfasilitasi kebutuhan pengadaan logistik umum perusahaan, mulai dari kebutuhan esensial perkantoran hingga perangkat operasional pendukung dengan jajaran manufaktur tepercaya.
                </p>
              </div>
            </div>

            {/* Service 3 */}
            <div className="border border-emerald-500 p-6 flex flex-col justify-between bg-white/5 hover:bg-white/10 transition-colors min-h-[220px] rounded relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CreditCard className="w-24 h-24" />
              </div>
              <span className="text-[14px] font-[700] text-emerald-400">03</span>
              <div className="relative z-10">
                <CreditCard className="w-6 h-6 text-emerald-400 mb-3" />
                <h4 className="text-[20px] font-[700] mb-3 leading-[1.2]">Integrated Payment Handling</h4>
                <p className="text-[13px] opacity-70 leading-[1.6]">
                  Menyediakan infrastruktur penerimaan dan penanganan transaksi B2B volume tinggi yang aman, memudahkan klien dan korporasi dalam hal administrasi pembayaran antar instansi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Catalog Teaser / CTA Section */}
      <motion.section 
        className={`py-[64px] border-b transition-colors duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-[960px] mx-auto px-5 text-left">
          <div className={`rounded p-10 md:p-14 border shadow-sm transition-colors duration-500 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            <span className="text-[12px] font-[700] uppercase tracking-[0.2em] text-emerald-500 block mb-4">Download Center</span>
            <h3 className={`text-[20px] md:text-[24px] font-[800] uppercase mb-4 tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>Jelajahi Solusi Kami Secara Lengkap</h3>
            <p className={`mb-8 max-w-2xl text-[14px] leading-[1.6] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Kami mendistribusikan lebih dari 55 varian solusi pembersih kelas industri dan supply umum yang spesifik disesuaikan dengan infrastruktur komersial Anda.
            </p>
            <div className="flex flex-col items-start gap-6">
              <div className="w-full flex flex-col sm:flex-row items-center justify-start gap-4">
                <button 
                  onClick={() => setShowCatalog(true)}
                  className="relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-[28px] py-[13px] text-[14px] font-[700] rounded text-white uppercase shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/40"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center">
                    <Layers className="w-5 h-5 mr-3 animate-pulse" />
                    Lihat Katalog Online
                  </span>
                </button>
                <button className={`w-full sm:w-auto inline-flex items-center justify-center border-2 px-[24px] py-[13px] text-[14px] font-[700] rounded uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isDark ? 'border-slate-600 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                  <Download className="w-5 h-5 mr-3" />
                  Unduh Katalog PDF
                </button>
              </div>
              <p className={`text-[13px] font-[600] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Update 2024: Spesifikasi teknis dan SDS bahan.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer / Kontak */}
      <footer id="kontak" className={`py-[64px] transition-colors duration-500 ${isDark ? 'bg-slate-950 border-t border-slate-900' : 'bg-white'}`}>
        <div className="w-full max-w-[960px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10">
            
            {/* Brand Info */}
            <div>
              <div className={`font-[900] text-[18px] tracking-[-1px] uppercase mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                PT ADIBA<span className="text-emerald-500">.</span>
              </div>
              <p className={`text-[13px] leading-[1.6] max-w-[300px] mb-6 transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                General Supplier & Payment Handling Specialist. Membantu perusahaan dalam verifikasi tender dan efisiensi pengadaan.
              </p>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className={`text-[14px] font-[700] mb-4 uppercase transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>Hubungi</h4>
              <div className={`mb-2 text-[13px] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><span className={`font-[700] inline-block w-[60px] transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Email:</span> inquiry@pt-adiba.com</div>
              <div className={`mb-2 text-[13px] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><span className={`font-[700] inline-block w-[60px] transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>WA:</span> +62 (Hubungi Kami)</div>
              <div className={`mb-2 text-[13px] flex items-start mt-3 transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span className={`font-[700] inline-block w-[60px] shrink-0 transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Lokasi:</span> 
                <span className="leading-[1.5]">Kawasan Perkantoran Niaga Terpadu,<br />Jakarta, Indonesia</span>
              </div>
            </div>

            {/* Operasional */}
            <div>
              <h4 className={`text-[14px] font-[700] mb-4 uppercase transition-colors duration-500 ${isDark ? 'text-white' : 'text-slate-900'}`}>Operasional</h4>
              <div className={`mb-2 text-[13px] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><span className={`font-[700] mr-2 transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Senin - Jumat:</span> 08:00 - 17:00</div>
              <div className={`mb-2 text-[13px] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><span className={`font-[700] mr-2 transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Sabtu:</span> 09:00 - 14:00</div>
              <div className={`mb-2 text-[13px] transition-colors duration-500 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><span className={`font-[700] mr-2 transition-colors duration-500 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Minggu:</span> Corporate Hanya</div>
            </div>
            
          </div>
          
          <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-[12px] text-slate-500 font-[600] gap-4 transition-colors duration-500 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <p>&copy; {new Date().getFullYear()} PT Adiba. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/index-legal.html" className="hover:text-emerald-500 transition-colors uppercase">Kebijakan Privasi</a>
              <a href="/index-legal.html" className="hover:text-emerald-500 transition-colors uppercase">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
      
      <AnimatePresence>
        {showCatalog && (
          <CatalogView 
            isDark={isDark} 
            onClose={() => setShowCatalog(false)} 
          />
        )}
      </AnimatePresence>
    </div>
    </AuthProvider>
  );
}
