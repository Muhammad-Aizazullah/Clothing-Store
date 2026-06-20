// 20/06/2026
import React, { useState } from 'react';
import { isAdminLoggedIn, verifyAdmin, loginAdmin, logoutAdmin } from '@/lib/adminAuth';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminSettings from '@/components/admin/AdminSettings';
import { Package, ShoppingBag, Star, Settings, LogOut } from 'lucide-react';

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminLoggedIn());
  const [tab, setTab] = useState('products');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (verifyAdmin(email, password)) {
      loginAdmin();
      setAuthed(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl tracking-[0.15em] uppercase text-center mb-2">
            Admin Access
          </h1>
          <p className="text-xs text-muted-foreground text-center mb-8 tracking-wide">Mythic Store Dashboard</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-border bg-transparent px-4 py-3.5 text-sm outline-none focus:border-foreground transition-colors"
            />
            {error && <p className="text-xs text-destructive tracking-wide">{error}</p>}
            <button
              type="submit"
              className="w-full bg-foreground text-background py-3.5 text-xs tracking-[0.25em] uppercase font-medium hover:opacity-90"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'products', label: 'Products', icon: Package },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-[120rem] mx-auto px-[5vw] py-6 md:py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Dashboard</p>
          <h1 className="font-display text-2xl tracking-[0.15em] uppercase">Mythic Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8 gap-0 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs tracking-[0.15em] uppercase border-b-2 transition-all whitespace-nowrap ${
              tab === t.key
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'products' && <AdminProducts />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'reviews' && <AdminReviews />}
      {tab === 'settings' && <AdminSettings />}
    </div>
  );
}