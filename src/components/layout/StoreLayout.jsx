// 20/06/2026
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CartDrawer />
      <main className="flex-1 pt-[calc(2rem+4rem)] md:pt-[calc(2rem+5rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}