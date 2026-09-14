import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider } from './context/StoreContext';
import { TopBar } from './components/layout/TopBar';
import { Header } from './components/layout/Header';
import { MegaMenu } from './components/layout/MegaMenu';
import { Footer } from './components/layout/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { ProductGrid } from './components/catalog/ProductGrid';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistDrawer } from './components/cart/WishlistDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderTracker } from './components/cart/OrderTracker';
import { ToastContainer } from './components/ui/ToastContainer';

function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-liban-grey flex flex-col">
        <TopBar />
        <Header />
        <MegaMenu />
        <main className="flex-1">
          <HeroBanner />
          <ProductGrid />
        </main>
        <Footer />
        <ProductDetailModal />
        <AnimatePresence><CartDrawer /></AnimatePresence>
        <AnimatePresence><WishlistDrawer /></AnimatePresence>
        <CheckoutModal />
        <OrderTracker />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}

export default App;
