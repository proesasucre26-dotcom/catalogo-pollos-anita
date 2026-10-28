import React from 'react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { MapPin, Phone, Clock, ShoppingBag, Search, Sparkles, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { totalItems, subtotal, openCart, openStoreInfo, searchQuery, setSearchQuery } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-red-700 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={openStoreInfo}
              className="flex items-center gap-1.5 hover:underline cursor-pointer transition-opacity"
              title="Ver ubicación oficial"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-none">{RESTAURANT_INFO.address}</span>
            </button>
            <span className="hidden md:inline text-red-300">|</span>
            <a
              href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 hover:text-amber-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{RESTAURANT_INFO.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <span className="hidden lg:flex items-center gap-1 text-red-100">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{RESTAURANT_INFO.hours}</span>
            </span>
            <button
              onClick={openStoreInfo}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-[11px] font-semibold hover:bg-emerald-600 cursor-pointer shadow-xs transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>{RESTAURANT_INFO.statusText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <img
            src={RESTAURANT_INFO.logo}
            alt="Pollos Anita Logo"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm ring-2 ring-amber-400"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xl sm:text-2xl text-red-700 tracking-tight leading-none">
                Pollos Anita
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium tracking-tight">
              Sabor Tradicional a la Brasa & Broaster
            </p>
          </div>
        </div>

        {/* Search input (visible on sm+) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar combos, broaster, salchipapas, bebidas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white transition-all text-stone-800 placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right action zone: Store info link & cart button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openStoreInfo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-red-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Horarios & Envíos</span>
          </button>

          {/* Cart Header Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            aria-label="Ver carrito de compras"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] font-normal text-red-100">Tu Pedido</span>
              <span className="font-bold tabular-nums">
                {totalItems > 0 ? `Bs. ${subtotal.toFixed(2)}` : 'Vacío'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar platos, porciones, postres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-white text-stone-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
