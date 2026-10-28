/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { DishList } from './components/DishList';
import { DishDetailModal } from './components/DishDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { StoreInfoModal } from './components/StoreInfoModal';
import { FloatingCartButton } from './components/FloatingCartButton';
import { Footer } from './components/Footer';

function MainApp() {
  const submenuRef = useRef<HTMLDivElement>(null);

  const handleSelectCategory = () => {
    if (submenuRef.current) {
      submenuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#212121] flex flex-col selection:bg-red-200 selection:text-red-900">
      {/* 1. Encabezado superior con info oficial, contacto y estado activo */}
      <Header />

      <main className="flex-1">
        {/* 2. Banner Hero Principal con logotipo oficial centrado y titular */}
        <HeroBanner />

        {/* 3. Menú de Categorías (2 Columnas con 3 categorías por lado = 6 categorías) */}
        <CategoryGrid onSelectCategory={handleSelectCategory} />

        {/* 4. Submenús desplegables y detalle de platos */}
        <div ref={submenuRef}>
          <DishList />
        </div>
      </main>

      {/* 5. Carrito flotante permanente (Mobile-first respetando límite del 15% sticky) */}
      <FloatingCartButton />

      {/* Modales y Drawer */}
      <DishDetailModal />
      <CartDrawer />
      <OrderSuccessModal />
      <StoreInfoModal />

      {/* Pie de página oficial */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
