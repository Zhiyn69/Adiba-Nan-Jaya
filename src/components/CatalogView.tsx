import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Beaker, 
  Cpu, 
  Wrench, 
  ArrowLeft,
  ShoppingCart,
  ChevronRight,
  Info,
  Plus,
  Minus,
  MessageCircle,
  CreditCard,
  Building,
  Upload,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';

type CatalogItem = {
  id: string;
  name: string;
  price: string;
  priceValue: number | null;
  spec: string;
  detailedSpec: string;
  moq: string;
  category: 'chemical' | 'heavy' | 'accessory';
  imageUrl: string;
};

const DUMMY_CATALOG: CatalogItem[] = [
  // Chemical
  { id: 'c1', name: 'Industrial Degreaser Pro Max', price: 'Rp 450.000 / Pail', priceValue: 450000, spec: '20L, pH 13, Removes heavy oil and grease, non-flammable', detailedSpec: 'Dirancang khusus untuk menghancurkan minyak berat, gemuk, dan kotoran membandel pada mesin industri, lantai pabrik, dan suku cadang. Formula alkali tinggi dengan aditif pelarut khusus memastikan pembersihan mendalam tanpa merusak permukaan logam jika diencerkan dengan benar.', moq: '10 Pail', category: 'chemical', imageUrl: 'https://images.unsplash.com/photo-1585250422238-d7620ed76810?auto=format&fit=crop&q=80&w=600' },
  { id: 'c2', name: 'Alkaline Foaming Cleaner', price: 'Rp 320.000 / Pail', priceValue: 320000, spec: '20L, Food-grade safe, High foaming formula for vertical surfaces', detailedSpec: 'Pembersih berbusa tinggi yang diformulasikan untuk industri makanan dan minuman. Busa yang stabil dan melekat kuat pada permukaan vertikal dan miring, memaksimalkan waktu kontak untuk melarutkan protein, lemak, dan noda organik.', moq: '5 Pail', category: 'chemical', imageUrl: 'https://images.unsplash.com/photo-1620645607318-6b8015975db3?auto=format&fit=crop&q=80&w=600' },
  { id: 'c3', name: 'Boiler Water Treatment', price: 'Rp 850.000 / Drum', priceValue: 850000, spec: '200L, Anti-scale, oxygen scavenger, corrosion inhibitor', detailedSpec: 'Bahan kimia all-in-one untuk perawatan air boiler tekanan rendah hingga menengah. Mencegah pembentukan kerak isolator panas, mengikat oksigen terlarut untuk mencegah pitting corrosion, dan menetralkan asam untuk menjaga pH optimal.', moq: '2 Drum', category: 'chemical', imageUrl: 'https://images.unsplash.com/photo-1574627196010-85f20f01de9c?auto=format&fit=crop&q=80&w=600' },
  { id: 'c4', name: 'Heavy Duty Floor Stripper', price: 'Rp 210.000 / Galon', priceValue: 210000, spec: '5L, Fast-acting wax & finish remover, low odor', detailedSpec: 'Cairan pengupas (stripper) sangat kuat yang dirancang untuk melisiskan penumpukan lapisan pelindung lantai (wax/finish) yang tebal dan membandel. Bekerja cepat menembus polimer silang tanpa perlu penggosokan berlebihan.', moq: '10 Galon', category: 'chemical', imageUrl: 'https://images.unsplash.com/photo-1584820927498-cafe2c1c8a17?auto=format&fit=crop&q=80&w=600' },
  
  // Heavy Electronic Equipment
  { id: 'h1', name: 'Industrial Generator 50kVA', price: 'Mulai dari Rp 85.000.000', priceValue: 85000000, spec: 'Diesel, Silent type, 3-Phase 380V, Auto Transfer Switch', detailedSpec: 'Generator set diesel dengan kapasitas standby 50kVA. Dilengkapi dengan kanopi peredam suara tangguh yang cocok untuk penggunaan luar ruangan. Modul kontrol digital terintegrasi memastikan pemantauan presisi terhadap voltase, frekuensi, dan status mesin.', moq: '1 Unit', category: 'heavy', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600' },
  { id: 'h2', name: 'Robotic Welding Arm 6-Axis', price: 'Hubungi Kami', priceValue: null, spec: '12kg payload, 1.5m reach, integrated vision sensor', detailedSpec: 'Lengan robot 6-sumbu berkecepatan tinggi yang dirancang untuk otomasi pengelasan presisi. Menampilkan algoritma kontrol lintasan canggih dan sensor penglihatan 3D terpadu untuk mendeteksi sambungan secara akurat dan mengoreksi offset secara otomatis.', moq: '1 Unit', category: 'heavy', imageUrl: 'https://images.unsplash.com/photo-1613998634842-8923a19fc162?auto=format&fit=crop&q=80&w=600' },
  { id: 'h3', name: 'VFD Motor Controller 75kW', price: 'Rp 18.500.000 / Unit', priceValue: 18500000, spec: '3-Phase, IP55 enclosure, Modbus RTU, Built-in chokes', detailedSpec: 'Variable Frequency Drive (VFD) hemat energi untuk mengontrol kecepatan motor induksi AC 3-fase. Enclosures IP55 tahan terhadap debu dan cipratan air tingkat industri. Dilengkapi input choke DC untuk mengurangi harmonisa beban dan keausan motor.', moq: '1 Unit', category: 'heavy', imageUrl: 'https://images.unsplash.com/photo-1558237580-0a591e1d08bf?auto=format&fit=crop&q=80&w=600' },
  { id: 'h4', name: 'Industrial HVAC Chiller', price: 'Hubungi Kami', priceValue: null, spec: 'Water-cooled, 100 TR capacity, R134a refrigerant', detailedSpec: 'Pendingin air sentrifugal berkinerja tinggi untuk menjaga stabilitas suhu di fasilitas manufaktur atau pusat data yang menuntut. Menggunakan refrigeran R134a dan dilengkapi dengan sistem kontrol mikrokontroler pintar guna mengoptimalkan siklus kompresi.', moq: '1 Unit', category: 'heavy', imageUrl: 'https://images.unsplash.com/photo-1621831411516-72dcd44a4947?auto=format&fit=crop&q=80&w=600' },

  // Accessory Equipment
  { id: 'a1', name: 'Heavy Duty Caster Wheels', price: 'Rp 150.000 / Pcs', priceValue: 150000, spec: '8 inch, Polyurethane, 500kg load capacity per wheel, double ball bearing', detailedSpec: 'Roda kastor putar kelas heavy-duty yang dilengkapi dengan tapak polyurethane tebal untuk operasi halus dan tanpa jejak pada lantai pabrik. Sistem bantalan peluru ganda (double ball bearing) menjamin transisi rotasi minimal gaya terlepas dari beban berat.', moq: '20 Pcs', category: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1622384795240-a35201889fc6?auto=format&fit=crop&q=80&w=600' },
  { id: 'a2', name: 'Industrial Safety Gloves V-Cut', price: 'Rp 45.000 / Pasang', priceValue: 45000, spec: 'Cut resistant Level 5, Nitrile coated, Breathable back', detailedSpec: 'Sarung tangan keselamatan berperingkat Tahan Potong (Cut Resistant) Level 5, terajut dari serat UHMWPE berkekuatan tinggi. Telapak tangan dan jari dilapisi busa nitril untuk cengkeraman anti-selip superior dalam kondisi berminyak maupun basah.', moq: '50 Pasang', category: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1544320498-75c1eeed50fa?auto=format&fit=crop&q=80&w=600' },
  { id: 'a3', name: 'Safety Helmet Class E', price: 'Rp 120.000 / Pcs', priceValue: 120000, spec: 'HDPE material, 4-point suspension, 20kV electrical resistance', detailedSpec: 'Helm keselamatan industri dengan perlindungan insulasi Kelas E terhadap benturan dan tegangan tinggi (tahan hingga 20.000 volt). Sistem suspensi ratchet 4 titik memberikan penyesuaian yang aman dan nyaman.', moq: '30 Pcs', category: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1555523164-1e0f0bdac7d3?auto=format&fit=crop&q=80&w=600' },
  { id: 'a4', name: 'Reflective Safety Vest', price: 'Rp 35.000 / Pcs', priceValue: 35000, spec: 'Polyester mesh, 2-inch high visibility reflective tape, zipper front', detailedSpec: 'Rompi keselamatan visibilitas tinggi dengan warna neon bersertifikat ANSI. Dirancang menggunakan kain jala polyester bersirkulasi udara yang lapang. Pita memantulkan cahaya selebar 2 inci memastikan pengenalan visual dari jarak hingga 300 meter untuk shift malam.', moq: '100 Pcs', category: 'accessory', imageUrl: 'https://images.unsplash.com/photo-1601633519894-311894dbe1f8?auto=format&fit=crop&q=80&w=600' },
];

type CartItem = {
  product: CatalogItem;
  quantity: number;
};

const CATEGORIES = [
  { id: 'all', label: 'Semua Kategori', icon: Search },
  { id: 'chemical', label: 'Chemical', icon: Beaker },
  { id: 'heavy', label: 'Heavy Electronic Eq.', icon: Cpu },
  { id: 'accessory', label: 'Accessory Eq.', icon: Wrench },
] as const;

type CatalogViewProps = {
  isDark: boolean;
  onClose: () => void;
};

export default function CatalogView({ isDark, onClose }: CatalogViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'term' | 'cod'>('transfer');
  
  const [cartStep, setCartStep] = useState<'cart' | 'payment_process' | 'success'>('cart');
  const [transferProof, setTransferProof] = useState<string | null>(null);
  const [topDuration, setTopDuration] = useState<number>(30);
  const [codSubMethod, setCodSubMethod] = useState<'cia' | 'cod'>('cia');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout, logoutAll } = useAuth();

  const filteredItems = DUMMY_CATALOG.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.spec.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotalElements = cart.reduce((acc, current) => acc + current.quantity, 0);

  const cartTotalPrice = useMemo(() => {
    let total = 0;
    let hasCustomPrice = false;
    cart.forEach(item => {
      if (item.product.priceValue !== null) {
        total += item.product.priceValue * item.quantity;
      } else {
        hasCustomPrice = true;
      }
    });
    return { total, hasCustomPrice };
  }, [cart]);

  const addToCart = (product: CatalogItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, increment: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;
      
      const newQuantity = existing.quantity + increment;
      if (newQuantity <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const handleCheckoutWhatsApp = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setCartStep('payment_process');
    }
  };

  const handleFinalConfirm = () => {
    // This completes the order and goes to success screen
    setCartStep('success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTransferProof(imageUrl);
    }
  };

  const renderPaymentProcess = () => {
    if (paymentMethod === 'transfer') {
      return (
        <div className="space-y-6">
          <div className={`p-4 rounded border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-4">Informasi Rekening</h4>
            <div className="space-y-3">
              <div>
                <p className={`text-[12px] font-[600] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bank</p>
                <p className="text-[15px] font-[700]">Bank Central Asia (BCA)</p>
              </div>
              <div>
                <p className={`text-[12px] font-[600] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nomor Rekening</p>
                <p className="text-[15px] font-[700] tracking-wider text-emerald-600 dark:text-emerald-400">123 456 7890</p>
              </div>
              <div>
                <p className={`text-[12px] font-[600] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Atas Nama</p>
                <p className="text-[15px] font-[700]">PT Adiba General Supplier</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className={`text-[13px] font-[600] mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total yang harus ditransfer:</p>
            <p className="text-[24px] font-[800] text-emerald-600 dark:text-emerald-400 leadng-none">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cartTotalPrice.total)}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-2">Upload Bukti Transfer</h4>
            {!transferProof ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-8 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer transition-colors ${isDark ? 'border-slate-700 hover:border-emerald-500 bg-slate-800/30 hover:bg-slate-800/80' : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50'}`}
              >
                <Upload className={`w-8 h-8 mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className={`text-[13px] font-[600] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Klik untuk unggah gambar (.jpg, .png)</span>
              </div>
            ) : (
              <div className="relative">
                <img src={transferProof} alt="Bukti Transfer" className="w-full h-48 object-cover rounded border border-slate-200 dark:border-slate-700" />
                <button 
                  onClick={() => setTransferProof(null)}
                  className="absolute top-2 right-2 p-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>

          <button 
            disabled={!transferProof}
            onClick={handleFinalConfirm}
            className="w-full flex items-center justify-center py-4 rounded bg-emerald-500 disabled:bg-slate-400 disabled:cursor-not-allowed hover:bg-emerald-600 text-white font-[700] text-[14px] uppercase tracking-wider transition-all"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      );
    }

    if (paymentMethod === 'term') {
      const orderDate = new Date();
      const dueDate = new Date(orderDate);
      dueDate.setDate(dueDate.getDate() + topDuration);

      return (
        <div className="space-y-6">
          <div className={`p-4 rounded border flex items-start gap-3 ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
            <AlertCircle className="w-5 h-5 mt-0.5 text-orange-500 shrink-0" />
            <p className={`text-[13px] leading-[1.5] ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
              <span className="font-[700] uppercase block mb-1">Perhatian</span>
              Metode Term of Payment (TOP) memerlukan persetujuan limit kredit pelanggan terlebih dahulu oleh tim finance kami. Jika belum disetujui, pesanan akan ditahan sementara.
            </p>
          </div>

          <div>
            <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-2">Pilih Durasi TOP</h4>
            <div className="grid grid-cols-2 gap-2">
              {[7, 14, 30, 60].map(days => (
                <button
                  key={days}
                  onClick={() => setTopDuration(days)}
                  className={`py-3 rounded border text-[14px] font-[700] uppercase transition-all ${
                    topDuration === days 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : `border-transparent ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`
                  }`}
                >
                  NET {days}
                </button>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-4">Total & Jatuh Tempo</h4>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[13px] font-[600] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Tagihan</span>
              <span className="text-[16px] font-[800] text-emerald-600 dark:text-emerald-400">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cartTotalPrice.total)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className={`flex items-center gap-1.5 text-[13px] font-[600] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Calendar className="w-4 h-4" />
                Tanggal Jatuh Tempo
              </span>
              <span className={`text-[14px] font-[700] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <button 
            onClick={handleFinalConfirm}
            className="w-full flex items-center justify-center py-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-[700] text-[14px] uppercase tracking-wider transition-all"
          >
            Ajukan Pesanan TOP
          </button>
        </div>
      );
    }

    if (paymentMethod === 'cod') {
      return (
        <div className="space-y-6">
          <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-2">Pilih Mekanisme COD</h4>
          <div className="space-y-3">
            <div 
              onClick={() => setCodSubMethod('cia')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                codSubMethod === 'cia'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                  : `border-transparent ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${codSubMethod === 'cia' ? 'border-emerald-500' : 'border-slate-400'}`}>
                  {codSubMethod === 'cia' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <h5 className={`text-[14px] font-[700] ${codSubMethod === 'cia' ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>Cash in Advance (CIA)</h5>
              </div>
              <p className={`text-[13px] pl-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pembayaran penuh harus dilakukan melalui transfer bank sebelum barang dikirim.
              </p>
            </div>
            
            <div 
              onClick={() => setCodSubMethod('cod')}
              className={`p-4 rounded border cursor-pointer transition-all ${
                codSubMethod === 'cod'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                  : `border-transparent ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${codSubMethod === 'cod' ? 'border-emerald-500' : 'border-slate-400'}`}>
                  {codSubMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <h5 className={`text-[14px] font-[700] ${codSubMethod === 'cod' ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>Cash on Delivery (COD)</h5>
              </div>
              <p className={`text-[13px] pl-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pembayaran dilakukan secara tunai ke kurir saat barang diterima.
              </p>
            </div>
          </div>

          <div className={`p-4 rounded border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            {codSubMethod === 'cia' ? (
               <div className="space-y-2">
                 <h4 className="text-[13px] font-[700] uppercase tracking-wider mb-2">Instruksi Transfer</h4>
                 <p className={`text-[13px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Transfer total tagihan sebesar <strong className={isDark ? 'text-white' : 'text-black'}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cartTotalPrice.total)}</strong> ke rekening <strong>BCA 123 456 7890 (PT Adiba General Supplier)</strong> sebelum kami memproses pengiriman.</p>
               </div>
            ) : (
               <div className="space-y-2">
                 <h4 className="text-[13px] font-[700] uppercase tracking-wider mb-2">Estimasi Pengiriman</h4>
                 <p className={`text-[13px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pesanan Anda akan dikirimkan dalam waktu 1-3 hari kerja. Siapkan pembayaran tunai sebesar <strong className={isDark ? 'text-white' : 'text-black'}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cartTotalPrice.total)}</strong> untuk kurir.</p>
               </div>
            )}
          </div>

          <button 
            onClick={handleFinalConfirm}
            className="w-full flex items-center justify-center py-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-[700] text-[14px] uppercase tracking-wider transition-all"
          >
            Konfirmasi Pesanan
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed inset-0 z-[100] flex flex-col ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-[20px] font-[800] uppercase tracking-tight">Katalog Online</h2>
            <p className={`text-[12px] font-[600] uppercase tracking-[0.1em] ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>PT Adiba General Supplier</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          {user ? (
            <div>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`relative group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${showProfileMenu ? (isDark ? 'border-emerald-500 bg-slate-800' : 'border-emerald-500 bg-slate-50') : (isDark ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300')}`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className={`text-[12px] font-[600] max-w-[80px] truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{user.fullName}</span>
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full right-24 mt-2 w-72 rounded shadow-2xl border z-50 overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                  >
                    <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <h4 className="text-[14px] font-[800] uppercase tracking-tight">{user.fullName}</h4>
                      <p className={`text-[12px] font-[500] truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                      
                      <div className={`mt-3 p-3 rounded text-[11px] font-[600] leading-[1.5] ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                        <div className="flex justify-between mb-1">
                          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Perusahaan</span>
                          <span>{user.companyName || '-'}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Session Terakhir</span>
                          <span>Sekarang</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Perangkat Aktif</span>
                          <span>Desktop Browser</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <button 
                        onClick={() => { logout(); setShowProfileMenu(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-[12px] font-[700] uppercase tracking-wider transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" /> 
                          Keluar Sesi Ini
                        </span>
                      </button>
                      <button 
                        onClick={() => { logoutAll(); setShowProfileMenu(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-[12px] font-[700] uppercase tracking-wider transition-colors group ${isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                      >
                        <span className="flex items-center gap-2 group-hover:text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          Keluar Semua Perangkat
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-[700] uppercase tracking-wider transition-colors ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
              <User className="w-4 h-4" />
              Masuk
            </button>
          )}

          <button 
            onClick={() => setIsCartOpen(true)}
            className={`relative p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartTotalElements > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900">
                {cartTotalElements}
              </span>
            )}
          </button>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar Categories */}
        <div className={`w-full md:w-64 border-r md:flex-shrink-0 flex flex-col ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-4 border-b md:border-b-0 md:pb-0 border-slate-200 dark:border-slate-800">
            <div className={`relative flex items-center w-full h-10 rounded border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
              <Search className={`absolute left-3 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-10 pr-4 bg-transparent outline-none text-[13px] font-[500]"
              />
            </div>
          </div>
          
          <div className="p-4 flex gap-2 md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded whitespace-nowrap md:whitespace-normal text-[14px] font-[600] transition-all capitalize ${
                  activeCategory === cat.id 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : isDark 
                      ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-white' : ''}`} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h3 className="text-[24px] font-[800] uppercase tracking-tight mb-2">
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h3>
              <p className={`text-[14px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Menampilkan {filteredItems.length} produk di katalog.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`flex flex-col sm:flex-row border rounded shadow-sm overflow-hidden transition-colors cursor-pointer ${
                      isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Image Area */}
                    <div className={`sm:w-40 h-40 sm:h-auto overflow-hidden flex-shrink-0 flex items-center justify-center relative ${
                      isDark ? 'bg-slate-950' : 'bg-slate-50'
                    }`}>
                      <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-[16px] font-[700] uppercase leading-[1.3] pr-4">{item.name}</h4>
                          <span className={`text-[10px] font-[700] uppercase tracking-wider px-2 py-1 rounded bg-opacity-10 whitespace-nowrap ${
                            item.category === 'chemical' ? 'bg-blue-500 text-blue-600 dark:text-blue-400' :
                            item.category === 'heavy' ? 'bg-purple-500 text-purple-600 dark:text-purple-400' :
                            'bg-orange-500 text-orange-600 dark:text-orange-400'
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        
                        <div className="mb-4 space-y-1">
                          <p className={`text-[13px] leading-[1.5] flex items-start gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <Info className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                            <span><span className="font-[600]">Specs:</span> {item.spec}</span>
                          </p>
                          <p className={`text-[13px] leading-[1.5] flex items-start gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            <ShoppingCart className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                            <span><span className="font-[600]">MOQ:</span> {item.moq}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="font-[800] text-[16px] text-emerald-600 dark:text-emerald-400">
                          {item.price}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 font-[600] text-[13px] uppercase rounded transition-colors z-10 ${
                            isDark 
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' 
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                          Keranjang
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredItems.length === 0 && (
                <div className={`col-span-full py-12 text-center text-[15px] font-[500] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Tidak ada produk yang sesuai dengan pencarian Anda.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[110] flex ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/40'} backdrop-blur-sm justify-end`}
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md h-full flex flex-col shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
            >
              <div className={`flex items-center justify-between p-6 border-b flex-shrink-0 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  {cartStep === 'cart' ? (
                    <>
                      <ShoppingCart className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <h2 className="text-[18px] font-[800] uppercase tracking-tight">Keranjang ({cartTotalElements})</h2>
                    </>
                  ) : cartStep === 'payment_process' ? (
                    <>
                      <button 
                        onClick={() => setCartStep('cart')}
                        className={`p-1.5 -ml-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <h2 className="text-[18px] font-[800] uppercase tracking-tight">Proses Pembayaran</h2>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <h2 className="text-[18px] font-[800] uppercase tracking-tight">Sukses</h2>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartStep === 'cart' ? (
                  cart.length === 0 ? (
                    <div className={`text-center py-10 text-[14px] font-[500] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Keranjang belanja Anda masih kosong.
                    </div>
                  ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.product.id} className={`flex gap-4 pb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                          <div className={`w-16 h-16 rounded flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                            {item.product.category === 'chemical' && <Beaker className="w-6 h-6 text-emerald-500 opacity-50" />}
                            {item.product.category === 'heavy' && <Cpu className="w-6 h-6 text-emerald-500 opacity-50" />}
                            {item.product.category === 'accessory' && <Wrench className="w-6 h-6 text-emerald-500 opacity-50" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[14px] font-[700] uppercase leading-[1.3] mb-1">{item.product.name}</h4>
                            <p className="text-[13px] font-[600] text-emerald-600 dark:text-emerald-400 mb-2">{item.product.price}</p>
                            
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, -1)}
                                className={`w-8 h-8 rounded flex items-center justify-center transition-colors flex-shrink-0 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input 
                                type="number" 
                                inputMode="numeric" 
                                pattern="[0-9]*" 
                                value={item.quantity || ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  setCart(prev => prev.map(cartItem => 
                                    cartItem.product.id === item.product.id 
                                      ? { ...cartItem, quantity: isNaN(val) ? 0 : val } 
                                      : cartItem
                                  ));
                                }}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (isNaN(val) || val <= 0) {
                                    setCart(prev => prev.filter(cartItem => cartItem.product.id !== item.product.id));
                                  }
                                }}
                                className={`w-10 h-8 text-center text-[14px] font-[700] bg-transparent outline-none border-b-2 border-transparent focus:border-emerald-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                style={{ MozAppearance: 'textfield' }}
                              />
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, 1)}
                                className={`w-8 h-8 rounded flex items-center justify-center transition-colors flex-shrink-0 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-2">
                      <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-2">Metode Pembayaran</h4>
                      <div className="space-y-2">
                        {[
                          { id: 'transfer', label: 'Transfer Bank Cepat', icon: Building },
                          { id: 'term', label: 'Term of Payment (TOP)', icon: CreditCard },
                          { id: 'cod', label: 'Cash in Advance / COD', icon: ShoppingCart },
                        ].map((method) => (
                          <div 
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`flex items-center gap-3 p-3 rounded cursor-pointer border-2 transition-all ${
                              paymentMethod === method.id 
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                                : `border-transparent ${isDark ? 'bg-slate-800 hover:bg-slate-800/80' : 'bg-slate-50 hover:bg-slate-100'}`
                            }`}
                          >
                            <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-emerald-600 dark:text-emerald-400' : (isDark ? 'text-slate-400' : 'text-slate-500')}`} />
                            <span className={`text-[13px] font-[600] ${paymentMethod === method.id ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                              {method.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  )
                ) : cartStep === 'payment_process' ? (
                  renderPaymentProcess()
                ) : cartStep === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                      {paymentMethod === 'transfer' ? (
                        <Clock className="w-10 h-10 text-emerald-500" />
                      ) : (
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      )}
                    </div>
                    <h3 className="text-[20px] font-[800] uppercase tracking-tight mb-3">
                      {paymentMethod === 'transfer' ? 'Menunggu Konfirmasi' : 'Pesanan Berhasil Disubmit'}
                    </h3>
                    <p className={`text-[14px] leading-[1.6] mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {paymentMethod === 'transfer' ? 'Terima kasih, bukti transfer Anda telah kami terima dan sedang dalam pengecekan oleh tim kami.' : 
                       paymentMethod === 'term' ? 'Pesanan TOP Anda telah dicatat dan menunggu proses persetujuan limit kredit dari tim finance.' : 
                       'Pesanan Anda telah kami terima dan akan segera diproses sesuai jadwal pengiriman.'}
                    </p>
                    <button 
                      onClick={() => {
                        setCart([]);
                        setCartStep('cart');
                        setTransferProof(null);
                        setIsCartOpen(false);
                      }}
                      className={`px-8 py-3 rounded font-[700] text-[13px] uppercase tracking-wider transition-all border-2 ${isDark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-900'}`}
                    >
                      Tutup Keranjang
                    </button>
                  </motion.div>
                ) : null}
              </div>

              {cart.length > 0 && cartStep === 'cart' && (
                <div className={`p-6 border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-end justify-between">
                      <span className={`text-[14px] font-[600] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Pembayaran</span>
                      <div className="text-right">
                        <span className="block text-[24px] font-[800] text-emerald-600 dark:text-emerald-400 leading-none">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cartTotalPrice.total)}
                        </span>
                        {cartTotalPrice.hasCustomPrice && (
                          <span className={`text-[12px] font-[600] mt-1 inline-block ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
                            + Produk dgn Harga Kustom
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckoutWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-[700] text-[14px] uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/30"
                  >
                    Lanjutkan ke Pembayaran
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-[120] flex items-center justify-center p-4 md:p-8 ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/60'} backdrop-blur-sm`}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl max-h-full overflow-y-auto rounded shadow-2xl ${isDark ? 'bg-slate-900' : 'bg-white'}`}
            >
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t to-transparent ${isDark ? 'from-slate-900' : 'from-white'} opacity-90`}></div>
                
                <button 
                  onClick={() => setSelectedItem(null)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-colors ${isDark ? 'bg-slate-900/50 hover:bg-slate-800' : 'bg-white/50 hover:bg-white'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 pt-0 -mt-20 relative">
                <span className={`inline-block mb-3 text-[11px] font-[800] uppercase tracking-wider px-3 py-1.5 rounded shadow-sm ${
                  selectedItem.category === 'chemical' ? 'bg-blue-500 text-white' :
                  selectedItem.category === 'heavy' ? 'bg-purple-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>
                  {selectedItem.category}
                </span>

                <h3 className="text-[28px] md:text-[32px] font-[800] uppercase tracking-tight leading-[1.1] mb-2">{selectedItem.name}</h3>
                
                <div className="font-[800] text-[20px] md:text-[24px] text-emerald-600 dark:text-emerald-400 mb-6">
                  {selectedItem.price}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-2">Spesifikasi Singkat</h4>
                    <p className={`text-[14px] leading-[1.6] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedItem.spec}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-[14px] font-[800] uppercase tracking-wider mb-2">Detail Produk</h4>
                    <p className={`text-[14px] leading-[1.6] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{selectedItem.detailedSpec}</p>
                  </div>

                  <div className={`p-4 rounded border flex items-start gap-3 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <ShoppingCart className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <div>
                      <h4 className="text-[13px] font-[700] uppercase leading-[1.2]">Minimum Order Quantity (MOQ)</h4>
                      <p className={`text-[13px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedItem.moq}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => {
                      addToCart(selectedItem);
                      setSelectedItem(null);
                      setIsCartOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 font-[700] text-[15px] uppercase tracking-wider rounded text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
                  >
                    <Plus className="w-5 h-5" />
                    Tambahkan ke Keranjang
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            isDark={isDark} 
            onClose={() => setShowAuthModal(false)} 
            onSuccess={() => {
              setShowAuthModal(false);
              if (isCartOpen) setCartStep('payment_process');
            }} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
