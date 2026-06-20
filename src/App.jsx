// 20/06/2026
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/cartContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import StoreLayout from '@/components/layout/StoreLayout';
import Home from '@/pages/Home';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import Account from '@/pages/Account';
import Admin from '@/pages/Admin';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import ScrollToTop from './components/ScrollToTop';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <AuthenticatedApp />
            </Router>
          </CartProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;