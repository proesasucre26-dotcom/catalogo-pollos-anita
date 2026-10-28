import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartButton: React.FC = () => {
  const { totalItems, subtotal, openCart, isCartOpen } = useCart();

  if (totalItems === 0 || isCartOpen) return null;

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 px-4 max-w-lg mx-auto pointer-events-none">
      <button
        onClick={openCart}
        className="pointer-events-auto w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-2xl shadow-xl border border-red-500/50 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold transition-all transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
        aria-label="Ver pedido actual"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative bg-red-800/80 p-2 rounded-xl text-white">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <span className="font-display font-extrabold text-sm sm:text-base">
            Ver Pedido ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-display font-black text-amber-300 text-sm sm:text-base tabular-nums bg-red-950/40 px-2.5 py-1 rounded-xl">
            Bs. {subtotal.toFixed(2)}
          </span>
          <div className="bg-white/20 p-1.5 rounded-lg">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </button>
    </div>
  );
};
