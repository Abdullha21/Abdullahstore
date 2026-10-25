import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  ShoppingCart,
  User,
  Shield,
  Zap,
  Headphones,
  Check,
  ChevronRight,
  ExternalLink,
  Printer,
  Copy,
  X,
  Plus,
  Minus,
  Trash2,
  Lock,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Send,
  MessageCircle,
  Tag,
  CreditCard,
  QrCode,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  LogOut
} from 'lucide-react';

// Currency Symbols and Conversion Rates
const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0 },
  { code: 'NGN', symbol: '₦', rate: 1500.0 },
  { code: 'USDT', symbol: '₮', rate: 1.0 },
  { code: 'BTC', symbol: '₿', rate: 0.000015 },
  { code: 'ETH', symbol: 'Ξ', rate: 0.00035 }
];

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  isFeatured: boolean;
  stockStatus: 'AVAILABLE' | 'SOLDOUT';
  deliveryInfo: string;
  prices: {
    USD: number;
    NGN: number;
    USDT: number;
    BTC: number;
    ETH: number;
  };
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'x-premium',
    title: 'X Premium (Twitter Blue) Verified Account',
    category: 'Social Media',
    description: 'Get the blue verification badge, 50% fewer ads, edit post features, prioritized rankings in conversations, and 25,000 character tweets.',
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80',
    isFeatured: true,
    stockStatus: 'AVAILABLE',
    deliveryInfo: 'Automated credentials dispatched to Email & WhatsApp within 5 mins.',
    prices: { USD: 8.0, NGN: 12000, USDT: 8.0, BTC: 0.00012, ETH: 0.0028 }
  },
  {
    id: 'x-premium-plus',
    title: 'X Premium Plus Full Access Subscription',
    category: 'Social Media',
    description: '100% ad-free experience in For You & Following feeds, maximum reply boost, write Articles, and full Grok AI assistant integration.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
    isFeatured: true,
    stockStatus: 'AVAILABLE',
    deliveryInfo: 'Instant credentials delivery with full duration replacement warranty.',
    prices: { USD: 16.0, NGN: 24000, USDT: 16.0, BTC: 0.00024, ETH: 0.0055 }
  },
  {
    id: 'chatgpt-plus',
    title: 'OpenAI ChatGPT Plus Account (Private)',
    category: 'AI Tools',
    description: 'Access GPT-4o, DALL-E 3 image generation, Advanced Voice Mode, Custom GPTs, and web browsing with highest priority bandwidth.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    isFeatured: true,
    stockStatus: 'AVAILABLE',
    deliveryInfo: 'Private login credentials. 30 days full warranty guaranteed.',
    prices: { USD: 20.0, NGN: 30000, USDT: 20.0, BTC: 0.0003, ETH: 0.007 }
  },
  {
    id: 'youtube-premium',
    title: 'YouTube Premium & Music Family Slot',
    category: 'Streaming',
    description: 'Completely ad-free YouTube videos, uninterrupted background playback on iOS & Android, offline downloads, and YouTube Music included.',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80',
    isFeatured: true,
    stockStatus: 'AVAILABLE',
    deliveryInfo: 'Direct email invitation sent to your personal Google account.',
    prices: { USD: 4.5, NGN: 6800, USDT: 4.5, BTC: 0.00007, ETH: 0.0016 }
  },
  {
    id: 'canva-pro',
    title: 'Canva Pro Lifetime / EDU Unlimited Access',
    category: 'Design Tools',
    description: '100M+ premium stock photos, graphics, audio and video tracks, Magic Studio AI tools, transparent background remover, and 1TB cloud storage.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
    isFeatured: true,
    stockStatus: 'AVAILABLE',
    deliveryInfo: 'Team invitation link sent via WhatsApp and invoice immediately.',
    prices: { USD: 5.0, NGN: 7500, USDT: 5.0, BTC: 0.00008, ETH: 0.0017 }
  },
  {
    id: 'nordvpn-complete',
    title: 'NordVPN Complete 1-Year Ultra Protection',
    category: 'VPN',
    description: 'Ultra-fast VPN with 6,000+ servers globally, Threat Protection malware blocker, cross-platform password manager, and encrypted cloud storage.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    isFeatured: true,
    stockStatus: 'AVAILABLE',
    deliveryInfo: 'Dedicated login credentials with active 12-month validity.',
    prices: { USD: 15.0, NGN: 22500, USDT: 15.0, BTC: 0.00022, ETH: 0.0052 }
  },
  {
    id: 'cloud-storage-2tb',
    title: 'Google One 2TB Cloud Storage Upgrade',
    category: 'Cloud Storage',
    description: '2,000 GB shared across Google Drive, Gmail, and Google Photos with enhanced backup and Google Workspace editing perks.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    isFeatured: false,
    stockStatus: 'AVAILABLE',
    deliveryInfo: 'Family share invitation attached directly to your personal Gmail.',
    prices: { USD: 10.0, NGN: 15000, USDT: 10.0, BTC: 0.00015, ETH: 0.0035 }
  },
  {
    id: 'spotify-premium',
    title: 'Spotify Premium Individual 12-Month Plan',
    category: 'Streaming',
    description: 'Ad-free high-fidelity music streaming, unlimited skips, offline playlist downloads, and group listening sessions.',
    image: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=800&q=80',
    isFeatured: false,
    stockStatus: 'SOLDOUT',
    deliveryInfo: 'Currently sold out. Restock arriving soon.',
    prices: { USD: 9.0, NGN: 13500, USDT: 9.0, BTC: 0.00014, ETH: 0.0031 }
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  orderNumber: string;
  invoiceNo: string;
  shareToken: string;
  customer: {
    name: string;
    email: string;
    whatsapp: string;
    deliveryInfo: string;
  };
  items: {
    id: string;
    title: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  promoCode: string | null;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: 'COMPLETED' | 'PROCESSING' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'orders' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentCurrency, setCurrentCurrency] = useState('USD');

  // Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('as_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('as_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('as_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'crypto_usdt' | 'crypto_btc' | 'bank_wire'>('crypto_usdt');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; pct: number } | null>(null);
  const [promoMessage, setPromoMessage] = useState('');

  // Orders & Invoice State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('as_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeInvoice, setActiveInvoice] = useState<Order | null>(null);

  // Product Details Modal
  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save cart & products to local storage
  useEffect(() => {
    localStorage.setItem('as_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('as_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('as_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Currency Formatter
  const formatPrice = (amountInUSD: number) => {
    const curr = CURRENCIES.find((c) => c.code === currentCurrency) || CURRENCIES[0];
    const converted = amountInUSD * curr.rate;
    if (curr.code === 'BTC' || curr.code === 'ETH') {
      return `${curr.symbol} ${converted.toFixed(5)}`;
    }
    return `${curr.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getProductPrice = (p: Product) => {
    return p.prices[currentCurrency as keyof typeof p.prices] ?? p.prices.USD;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockStatus === 'SOLDOUT') {
      showToast('This product is currently sold out!');
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.title}" to cart`);
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i))
      );
    }
  };

  const cartSubtotalUSD = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.prices.USD * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Login check for checkout
  // Requirement: "Customer order korte hole login korte Hobe"
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    if (!currentUser) {
      setAuthNotice('Customer order korte hole login korte Hobe (Login required to place order)');
      setIsAuthModalOpen(true);
      return;
    }
    // Pre-fill user data
    setCustomerName(currentUser.name);
    setCustomerEmail(currentUser.email);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Buy Now direct action
  const handleBuyNow = (product: Product) => {
    if (product.stockStatus === 'SOLDOUT') {
      showToast('This product is sold out');
      return;
    }
    addToCart(product, 1);
    if (!currentUser) {
      setAuthNotice('Customer order korte hole login korte Hobe (Login required to place order)');
      setIsAuthModalOpen(true);
      return;
    }
    setCustomerName(currentUser.name);
    setCustomerEmail(currentUser.email);
    setInspectProduct(null);
    setIsCheckoutOpen(true);
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    const user = {
      name: authName.trim() || authEmail.split('@')[0],
      email: authEmail.trim()
    };
    setCurrentUser(user);
    localStorage.setItem('as_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${user.name}!`);
    if (cart.length > 0) {
      setIsCheckoutOpen(true);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('as_user');
    showToast('Logged out of customer session');
  };

  // Promo code validation
  const applyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'ABDULLAH10') {
      setAppliedPromo({ code, pct: 10 });
      setPromoMessage('Coupon applied: 10% discount granted!');
      showToast('10% Promo discount applied!');
    } else if (code === 'VIP20') {
      setAppliedPromo({ code, pct: 20 });
      setPromoMessage('VIP discount applied: 20% discount granted!');
      showToast('20% VIP Promo discount applied!');
    } else {
      setAppliedPromo(null);
      setPromoMessage('Invalid or expired coupon code');
      showToast('Invalid coupon code');
    }
  };

  // Complete Order
  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerWhatsapp) {
      showToast('Please fill in all customer details');
      return;
    }

    const discountUSD = appliedPromo ? (cartSubtotalUSD * appliedPromo.pct) / 100 : 0;
    const finalTotalUSD = Math.max(0, cartSubtotalUSD - discountUSD);

    const orderNumber = `AS-${Date.now().toString().slice(-6)}`;
    const invoiceNo = `INV-${Math.floor(10000 + Math.random() * 90000)}`;
    const shareToken = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newOrder: Order = {
      orderNumber,
      invoiceNo,
      shareToken,
      customer: {
        name: customerName,
        email: customerEmail,
        whatsapp: customerWhatsapp,
        deliveryInfo: customerNotes
      },
      items: cart.map((i) => ({
        id: i.product.id,
        title: i.product.title,
        unitPrice: i.product.prices.USD,
        quantity: i.quantity,
        lineTotal: i.product.prices.USD * i.quantity
      })),
      subtotal: cartSubtotalUSD,
      discount: discountUSD,
      total: finalTotalUSD,
      currency: currentCurrency,
      promoCode: appliedPromo ? appliedPromo.code : null,
      paymentMethod:
        paymentMethod === 'crypto_usdt'
          ? 'USDT (TRC-20)'
          : paymentMethod === 'crypto_btc'
          ? 'Bitcoin (BTC)'
          : 'Bank Wire Transfer',
      paymentStatus: 'PENDING',
      orderStatus: 'PROCESSING',
      createdAt: new Date().toISOString()
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCheckoutOpen(false);
    setActiveInvoice(newOrder);
    showToast(`Order #${orderNumber} placed successfully!`);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#030817] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1D3A] border-l-4 border-[#22D3EE] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-[#22D3EE]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Website Header */}
      <header className="sticky top-0 z-40 bg-[#07142C]/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00B7FF] to-[#6366F1] flex items-center justify-center font-black text-slate-950 text-lg shadow-[0_0_16px_rgba(0,183,255,0.4)] group-hover:scale-105 transition-transform">
              AS
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-cyan-200 to-indigo-300 bg-clip-text text-transparent">
                ABDULLAH STORE
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Your Premium Digital Store
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-cyan-400 transition-colors ${activeTab === 'home' ? 'text-cyan-400 font-bold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`hover:text-cyan-400 transition-colors ${activeTab === 'products' ? 'text-cyan-400 font-bold' : ''}`}
            >
              All Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`hover:text-cyan-400 transition-colors ${activeTab === 'orders' ? 'text-cyan-400 font-bold' : ''}`}
            >
              My Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 transition-all ${activeTab === 'admin' ? 'border-cyan-400 text-cyan-300' : ''}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currentCurrency}
                onChange={(e) => setCurrentCurrency(e.target.value)}
                className="bg-[#0B1D3A] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-cyan-300 cursor-pointer focus:outline-none focus:border-cyan-400"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#07142C] text-white">
                    {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 text-slate-200 transition-all"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#6366F1] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/50">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-slate-950 font-bold text-xs"
                  title={`Signed in as ${currentUser.name}`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex text-xs text-rose-400 hover:text-rose-300"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthNotice('');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                <User className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Top Search Field */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search premium accounts, VPN, AI tools, Canva..."
                className="w-full bg-[#07142C]/80 border border-indigo-500/30 focus:border-cyan-400 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 shadow-xl focus:outline-none transition-all"
              />
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07142C] via-[#0F172A] to-[#161C40] border border-indigo-500/30 p-6 sm:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.6)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Hero Left Text */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-wide uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Verified Genuine Subscriptions
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    Premium Accounts At <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Unbeatable Prices</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                    Get genuine private accounts, licensed software, VPN, and AI tools with instant automated delivery and replacement warranty.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('products')}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory('AI Tools');
                        setActiveTab('products');
                      }}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-sm transition-all"
                    >
                      AI Tools
                    </button>
                  </div>
                </div>

                {/* Hero Right Floating Tiles Illustration */}
                <div className="lg:col-span-5 grid grid-cols-3 gap-3">
                  {[
                    { name: 'X Premium', tag: 'Verified', bg: 'from-slate-700 to-slate-900', cat: 'Social Media', icon: '𝕏' },
                    { name: 'ChatGPT+', tag: 'GPT-4o', bg: 'from-emerald-900 to-emerald-950', cat: 'AI Tools', icon: '🤖' },
                    { name: 'YouTube', tag: 'Ad-Free', bg: 'from-rose-900 to-rose-950', cat: 'Streaming', icon: '▶' },
                    { name: 'Canva Pro', tag: 'Magic AI', bg: 'from-cyan-900 to-cyan-950', cat: 'Design Tools', icon: '🎨' },
                    { name: 'NordVPN', tag: '10 Gbps', bg: 'from-indigo-900 to-indigo-950', cat: 'VPN', icon: '🛡' },
                    { name: 'Cloud 2TB', tag: 'Backup', bg: 'from-amber-900 to-amber-950', cat: 'Cloud Storage', icon: '☁' }
                  ].map((tile, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedCategory(tile.cat);
                        setActiveTab('products');
                      }}
                      className={`p-3 rounded-2xl bg-gradient-to-b ${tile.bg} border border-white/10 hover:border-cyan-400 hover:scale-105 transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 shadow-md`}
                    >
                      <span className="text-xl">{tile.icon}</span>
                      <span className="text-xs font-bold text-white line-clamp-1">{tile.name}</span>
                      <span className="text-[10px] text-cyan-300 font-medium">{tile.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Category Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'Social Media', 'AI Tools', 'Streaming', 'VPN', 'Design Tools', 'Cloud Storage'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border border-cyan-400 shadow-[0_0_16px_rgba(99,102,241,0.4)]'
                      : 'bg-[#07142C]/70 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Glowing Promo Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-slate-950 border border-purple-500/40 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(139,92,246,0.2)]">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs uppercase font-extrabold text-cyan-300 tracking-wider">
                  Limited Time Discount
                </span>
                <h4 className="text-lg font-bold text-white">Get 10% OFF on all Subscriptions</h4>
                <p className="text-xs text-purple-200">
                  Use coupon code at checkout to claim instant discounts on your order.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('ABDULLAH10');
                    showToast('Copied coupon: ABDULLAH10');
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-900/60 border border-dashed border-cyan-400 font-mono font-black text-cyan-300 text-sm hover:scale-105 transition-transform"
                >
                  ABDULLAH10 📋
                </button>
              </div>
            </div>

            {/* Featured Products Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Featured Digital Products
                </h2>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  View All ({products.length}) &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const isAvailable = product.stockStatus === 'AVAILABLE';
                  const price = getProductPrice(product);

                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl bg-[#07142C]/80 border border-white/10 hover:border-indigo-500/50 p-3.5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
                    >
                      {/* Image */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isAvailable ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isAvailable ? 'In Stock' : 'Sold Out'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h3
                          onClick={() => setInspectProduct(product)}
                          className="text-sm font-bold text-white group-hover:text-cyan-300 cursor-pointer line-clamp-1 transition-colors"
                        >
                          {product.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing and Action */}
                      <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-white">
                            {formatPrice(product.prices.USD)}
                          </span>
                          <p className="text-[10px] text-slate-500">Instant Delivery</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setInspectProduct(product)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            disabled={!isAvailable}
                            onClick={() => addToCart(product, 1)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                              isAvailable
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{isAvailable ? 'Add' : 'Sold'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Service Highlights */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-[#07142C]/60 border border-white/5 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Instant Delivery</h5>
                  <p className="text-xs text-slate-400">Automated credentials delivered in &lt; 5 mins</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#07142C]/60 border border-white/5 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Full Warranty</h5>
                  <p className="text-xs text-slate-400">100% replacement guarantee during subscription</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#07142C]/60 border border-white/5 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">24/7 Priority Support</h5>
                  <p className="text-xs text-slate-400">WhatsApp & Telegram agents on standby</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: ALL PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Full Digital Catalog</h1>
                <p className="text-xs text-slate-400">Browse verified premium accounts and software licenses</p>
              </div>
              {/* Search */}
              <div className="w-full sm:w-72 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter catalog..."
                  className="w-full bg-[#07142C] border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'Social Media', 'AI Tools', 'Streaming', 'VPN', 'Design Tools', 'Cloud Storage'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const isAvailable = product.stockStatus === 'AVAILABLE';
                return (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-[#07142C]/80 border border-white/10 p-3.5 flex flex-col justify-between"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {isAvailable ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase">{product.category}</span>
                      <h3
                        onClick={() => setInspectProduct(product)}
                        className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer"
                      >
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-base font-extrabold text-white">{formatPrice(product.prices.USD)}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setInspectProduct(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                        >
                          Details
                        </button>
                        <button
                          disabled={!isAvailable}
                          onClick={() => addToCart(product, 1)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold text-white"
                        >
                          {isAvailable ? 'Add' : 'Sold'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Customer Orders</h1>
                <p className="text-xs text-slate-400">Track and download verifiable invoices for your purchases</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#07142C]/50 border border-dashed border-white/10 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
                <p className="text-xs text-slate-400">Select an item from our catalog and check out securely.</p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.orderNumber}
                    className="p-5 rounded-2xl bg-[#07142C]/80 border border-white/10 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-xs font-bold text-cyan-400">Order #{ord.orderNumber}</span>
                        <p className="text-[11px] text-slate-400">Invoice: #{ord.invoiceNo}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {ord.orderStatus}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          Payment: {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {it.quantity}x {it.title}
                          </span>
                          <span className="font-bold text-white">{formatPrice(it.lineTotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <div>
                        <span className="text-xs text-slate-400">Total Paid/Due: </span>
                        <span className="font-extrabold text-cyan-300">{formatPrice(ord.total)}</span>
                      </div>
                      <button
                        onClick={() => setActiveInvoice(ord)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Official Invoice</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: ADMIN CONSOLE */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-cyan-400" />
                  Store Admin Console
                </h1>
                <p className="text-xs text-slate-400">Manage orders, update stock status, and view sales performance</p>
              </div>
              <button
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                &larr; Exit Admin
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#07142C] border border-white/10">
                <span className="text-xs text-slate-400">Total Orders</span>
                <h4 className="text-2xl font-extrabold text-white mt-1">{orders.length}</h4>
                <p className="text-[10px] text-slate-500">All-time customer requests</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#07142C] border border-emerald-500/30">
                <span className="text-xs text-emerald-400">Settled Revenue (USD)</span>
                <h4 className="text-2xl font-extrabold text-white mt-1">
                  ${orders.filter((o) => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                </h4>
                <p className="text-[10px] text-slate-500">Verified receipts</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#07142C] border border-amber-500/30">
                <span className="text-xs text-amber-400">Pending Orders</span>
                <h4 className="text-2xl font-extrabold text-white mt-1">
                  {orders.filter((o) => o.orderStatus === 'PROCESSING' || o.orderStatus === 'PENDING').length}
                </h4>
                <p className="text-[10px] text-slate-500">Awaiting verification</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#07142C] border border-cyan-500/30">
                <span className="text-xs text-cyan-400">Sold Out Products</span>
                <h4 className="text-2xl font-extrabold text-white mt-1">
                  {products.filter((p) => p.stockStatus === 'SOLDOUT').length}
                </h4>
                <p className="text-[10px] text-slate-500">Needs inventory restock</p>
              </div>
            </div>

            {/* Product Stock Manager */}
            <div className="p-5 rounded-2xl bg-[#07142C] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white">Live Product Stock Toggles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-white line-clamp-1">{p.title}</h5>
                      <span className="text-[10px] text-slate-400">{formatPrice(p.prices.USD)}</span>
                    </div>
                    <button
                      onClick={() => {
                        const newStatus = p.stockStatus === 'AVAILABLE' ? 'SOLDOUT' : 'AVAILABLE';
                        setProducts((prev) =>
                          prev.map((item) => (item.id === p.id ? { ...item, stockStatus: newStatus } : item))
                        );
                        showToast(`Updated ${p.title} to ${newStatus}`);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                        p.stockStatus === 'AVAILABLE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {p.stockStatus}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders Management Table */}
            <div className="p-5 rounded-2xl bg-[#07142C] border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white">Customer Orders & Statuses</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold">
                      <th className="py-2.5">Order #</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status Action</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord.orderNumber} className="hover:bg-white/5">
                        <td className="py-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                        <td>
                          <div className="font-bold text-slate-200">{ord.customer.name}</div>
                          <div className="text-[10px] text-slate-400">{ord.customer.whatsapp}</div>
                        </td>
                        <td className="font-bold text-cyan-300">{formatPrice(ord.total)}</td>
                        <td>
                          <button
                            onClick={() => {
                              const nextStatus = ord.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
                              setOrders((prev) =>
                                prev.map((o) =>
                                  o.orderNumber === ord.orderNumber ? { ...o, paymentStatus: nextStatus } : o
                                )
                              );
                              showToast(`Order #${ord.orderNumber} payment marked as ${nextStatus}`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.paymentStatus === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {ord.paymentStatus} (Click to toggle)
                          </button>
                        </td>
                        <td>
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => {
                              const val = e.target.value as Order['orderStatus'];
                              setOrders((prev) =>
                                prev.map((o) =>
                                  o.orderNumber === ord.orderNumber ? { ...o, orderStatus: val } : o
                                )
                              );
                              showToast(`Order status set to ${val}`);
                            }}
                            className="bg-[#0B1D3A] border border-white/10 rounded px-2 py-1 text-[11px] text-white"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => setActiveInvoice(ord)}
                            className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
                          >
                            Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Contact Buttons */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        <a
          href="https://wa.me/message/example"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="WhatsApp Support"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href="https://t.me/abdullahstore"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Telegram Support"
        >
          <Send className="w-5 h-5 -translate-x-0.5" />
        </a>
      </div>

      {/* Slide-out Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#07142C] h-full flex flex-col border-l border-white/10 p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-lg text-white">Your Shopping Cart</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                  <ShoppingCart className="w-12 h-12 opacity-30" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveTab('products');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-[#0B1D3A]/60 border border-white/5 flex gap-3 items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                      <p className="text-xs font-extrabold text-cyan-300 mt-0.5">
                        {formatPrice(item.product.prices.USD)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => updateCartQty(item.product.id, 0)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-extrabold text-lg text-white">{formatPrice(cartSubtotalUSD)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-emerald-400">
                  <span>Delivery:</span>
                  <span>FREE (Instant Automated)</span>
                </div>

                {/* Important notice indicating login check */}
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-[11px] text-slate-300 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>Customer login is strictly required before checkout for warranty binding.</span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal (Mandatory Login to Order) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#07142C] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in zoom-in-95">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 mx-auto flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-cyan-500/30 mb-2">
                AS
              </div>
              <h3 className="text-xl font-extrabold text-white">Customer Authentication</h3>
              <p className="text-xs text-slate-400">
                Log in to place orders, download credentials, and activate replacement warranties.
              </p>
            </div>

            {authNotice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authNotice}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#0B1D3A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="customer@domain.com"
                  className="w-full bg-[#0B1D3A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 transition-all"
              >
                Continue to Secure Store
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Protected by 256-bit SSL encryption &bull; ABDULLAH STORE
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#07142C] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 space-y-6">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Order Verification</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">Secure Checkout</h2>
            </div>

            <form onSubmit={handleCompleteOrder} className="space-y-6">
              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyan-400" />
                  1. Delivery Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#0B1D3A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">WhatsApp Phone (for backup key) *</label>
                    <input
                      type="tel"
                      required
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full bg-[#0B1D3A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Delivery Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#0B1D3A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Activation Notes / Existing Username</label>
                  <input
                    type="text"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Optional notes for account assignment..."
                    className="w-full bg-[#0B1D3A] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  2. Choose Payment Method
                </h4>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto_usdt')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'crypto_usdt'
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : 'bg-[#0B1D3A] border-white/10 text-slate-400'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">₮</span>
                    <span className="text-[11px] font-bold block">USDT TRC-20</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto_btc')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'crypto_btc'
                        ? 'bg-amber-500/10 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-[#0B1D3A] border-white/10 text-slate-400'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">₿</span>
                    <span className="text-[11px] font-bold block">Bitcoin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_wire')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      paymentMethod === 'bank_wire'
                        ? 'bg-indigo-500/10 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'bg-[#0B1D3A] border-white/10 text-slate-400'
                    }`}
                  >
                    <span className="text-lg block mb-0.5">🏦</span>
                    <span className="text-[11px] font-bold block">Bank Wire</span>
                  </button>
                </div>

                {/* Payment Detail Box */}
                <div className="p-4 rounded-2xl bg-[#030817] border border-white/10 space-y-2 text-xs">
                  {paymentMethod === 'crypto_usdt' && (
                    <>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-bold text-cyan-300">USDT (TRC-20) Destination Address:</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxnSE');
                            showToast('USDT TRC-20 address copied!');
                          }}
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <code className="block p-2 rounded bg-black/40 text-cyan-200 font-mono text-[11px] break-all border border-white/5">
                        TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxnSE
                      </code>
                    </>
                  )}
                  {paymentMethod === 'crypto_btc' && (
                    <>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="font-bold text-amber-300">BTC Destination Address:</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
                            showToast('BTC address copied!');
                          }}
                          className="text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <code className="block p-2 rounded bg-black/40 text-amber-200 font-mono text-[11px] break-all border border-white/5">
                        bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                      </code>
                    </>
                  )}
                  {paymentMethod === 'bank_wire' && (
                    <div className="space-y-1 text-slate-300">
                      <p><strong className="text-white">Bank:</strong> ABDULLAH GLOBAL COMMERCE</p>
                      <p><strong className="text-white">Account Name:</strong> MD ABDULLAH DIGITAL STORE</p>
                      <p><strong className="text-white">Account Number:</strong> 0192837465</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Promo code box */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Enter Coupon / Promo Code (e.g. ABDULLAH10)"
                    className="flex-1 bg-[#0B1D3A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-[11px] ${appliedPromo ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              {/* Totals Summary */}
              <div className="p-4 rounded-2xl bg-[#0B1D3A]/60 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Items Subtotal:</span>
                  <span>{formatPrice(cartSubtotalUSD)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-cyan-300">
                    <span>Discount ({appliedPromo.pct}%):</span>
                    <span>-{formatPrice((cartSubtotalUSD * appliedPromo.pct) / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Payable Total:</span>
                  <span className="text-lg text-cyan-300">
                    {formatPrice(
                      appliedPromo ? cartSubtotalUSD - (cartSubtotalUSD * appliedPromo.pct) / 100 : cartSubtotalUSD
                    )}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-indigo-600 hover:opacity-95 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <span>Confirm Payment & Generate Invoice</span>
                <Check className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Shareable Invoice Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#07142C] border border-cyan-400/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative my-8 space-y-6">
            <button
              onClick={() => setActiveInvoice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Printable Area */}
            <div id="official-invoice" className="space-y-6 text-slate-200">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-slate-950 text-base">
                      AS
                    </div>
                    <span className="text-xl font-black text-white">ABDULLAH STORE</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Your Premium Digital Store</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black uppercase text-cyan-400 tracking-wider">OFFICIAL INVOICE</span>
                  <h4 className="text-base font-mono font-bold text-white">#{activeInvoice.invoiceNo}</h4>
                  <p className="text-xs text-slate-400">Order: #{activeInvoice.orderNumber}</p>
                </div>
              </div>

              {/* Customer & Status Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Billed To:</span>
                  <p className="font-bold text-white text-sm mt-0.5">{activeInvoice.customer.name}</p>
                  <p className="text-slate-300">{activeInvoice.customer.email}</p>
                  <p className="text-slate-300">WhatsApp: {activeInvoice.customer.whatsapp}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Payment & Status:</span>
                  <p className="mt-0.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      {activeInvoice.paymentStatus}
                    </span>
                  </p>
                  <p className="text-slate-400 mt-1">Method: {activeInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#0B1D3A] text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="text-center px-3">Qty</th>
                      <th className="text-right py-2.5 px-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {activeInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3">
                          <span className="font-bold text-white">{it.title}</span>
                          <p className="text-[10px] text-slate-400">Automated credentials delivery</p>
                        </td>
                        <td className="text-center px-3 font-bold text-cyan-300">{it.quantity}</td>
                        <td className="text-right py-3 px-3 font-bold text-white">{formatPrice(it.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="ml-auto w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>{formatPrice(activeInvoice.subtotal)}</span>
                </div>
                {activeInvoice.discount > 0 && (
                  <div className="flex justify-between text-cyan-400 font-bold">
                    <span>Discount:</span>
                    <span>-{formatPrice(activeInvoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Final Total:</span>
                  <span className="text-cyan-300">{formatPrice(activeInvoice.total)}</span>
                </div>
              </div>

              {/* Locked System Credit */}
              <div className="pt-6 border-t border-white/10 text-center space-y-1">
                <p className="text-[11px] text-slate-400">
                  Thank you for purchasing at ABDULLAH STORE. For warranty claims, provide this invoice number.
                </p>
                <p className="text-xs font-bold text-cyan-300 tracking-wide">
                  Developed by MD ABDULLAH
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/invoice.html?token=${activeInvoice.shareToken}`);
                  showToast('Shareable invoice link copied!');
                }}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Shareable Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {inspectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#07142C] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8 space-y-5">
            <button
              onClick={() => setInspectProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950">
              <img src={inspectProduct.image} alt={inspectProduct.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase">{inspectProduct.category}</span>
                <span className="text-xl font-black text-white">{formatPrice(inspectProduct.prices.USD)}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{inspectProduct.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{inspectProduct.description}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1D3A]/60 border border-white/5 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-white block">Delivery & Warranty:</span>
              <p>{inspectProduct.deliveryInfo}</p>
              <p className="text-emerald-400 font-semibold">✓ 100% genuine guaranteed with replacement warranty.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                disabled={inspectProduct.stockStatus === 'SOLDOUT'}
                onClick={() => {
                  addToCart(inspectProduct, 1);
                  setInspectProduct(null);
                }}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
              >
                Add to Cart
              </button>
              <button
                disabled={inspectProduct.stockStatus === 'SOLDOUT'}
                onClick={() => handleBuyNow(inspectProduct)}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#07142C]/80 backdrop-blur-sm py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-xs text-slate-400">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-slate-950 text-sm">
                  AS
                </div>
                <span className="text-base font-extrabold text-white">ABDULLAH STORE</span>
              </div>
              <p className="leading-relaxed">
                Your trusted digital marketplace for genuine subscriptions, software keys, and AI platform access.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-white text-sm mb-3">Quick Navigation</h5>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('home')} className="hover:text-cyan-400">Store Home</button></li>
                <li><button onClick={() => setActiveTab('products')} className="hover:text-cyan-400">Catalog</button></li>
                <li><button onClick={() => setActiveTab('orders')} className="hover:text-cyan-400">My Orders</button></li>
                <li><button onClick={() => setActiveTab('admin')} className="hover:text-cyan-400">Staff Console</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white text-sm mb-3">Support & Security</h5>
              <p className="leading-relaxed mb-3">
                Need immediate help with credentials or warranty claims? Message our direct channels on WhatsApp & Telegram.
              </p>
              <span className="text-emerald-400 font-bold block">✓ 256-Bit SSL Encrypted Transactions</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} ABDULLAH STORE. All rights reserved.</span>
            <span className="font-bold text-cyan-400 tracking-wide">
              Developed by MD ABDULLAH
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
