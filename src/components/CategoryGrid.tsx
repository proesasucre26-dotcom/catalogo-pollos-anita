import React from 'react';
import { CATEGORIES } from '../data/menuData';
import { Category } from '../types';
import { ChevronRight, ArrowDownCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CategoryGridProps {
  onSelectCategory: (category: Category) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const { activeCategoryId, setActiveCategoryId } = useCart();

  const leftCategories = CATEGORIES.filter((c) => c.column === 'left');
  const rightCategories = CATEGORIES.filter((c) => c.column === 'right');

  const handleCategoryClick = (category: Category) => {
    setActiveCategoryId(category.id);
    onSelectCategory(category);

    // Smooth scroll down to dishes section
    const el = document.getElementById('submenu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderCategoryCard = (cat: Category) => {
    const isActive = activeCategoryId === cat.id;

    return (
      <button
        key={cat.id}
        onClick={() => handleCategoryClick(cat)}
        className={`group relative w-full text-left bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-600 ${
          isActive
            ? 'ring-2 ring-red-600 border-red-500 bg-red-50/20'
            : 'border-stone-200/80 hover:border-amber-400'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch h-full">
          {/* Appetizing image container */}
          <div className="relative w-full sm:w-2/5 h-36 sm:h-auto min-h-[140px] overflow-hidden bg-stone-100 shrink-0">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/50 sm:from-transparent to-transparent pointer-events-none" />

            {/* Icon badge */}
            <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-stone-900 rounded-lg p-1.5 shadow-sm border border-stone-200 flex items-center justify-center">
              <span className="text-lg leading-none">{cat.icon}</span>
            </div>

            {/* Active check pill */}
            {isActive && (
              <div className="absolute top-2.5 right-2.5 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Activo</span>
              </div>
            )}
          </div>

          {/* Content details */}
          <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 group-hover:text-red-700 transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                {cat.shortDesc}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-400 tabular-nums">
                {cat.itemCount} variedades
              </span>

              <div
                className={`flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-1 ${
                  isActive ? 'text-red-600' : 'text-amber-600 group-hover:text-red-600'
                }`}
              >
                <span>Ver platos</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <section className="py-6 sm:py-10 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <span className="text-xs font-black uppercase tracking-wider text-red-600">
          Catálogo Interactivo de Especialidades
        </span>
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-stone-900 mt-1">
          Nuestras Categorías Principales
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
          Elige una categoría para desplegar el submenú y armar tu combo favorito
        </p>
      </div>

      {/* 2-Column Grid (3 categories left / 3 categories right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Columna Izquierda: Brasa, Broaster, Salchipapas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold uppercase tracking-wide text-stone-700">
              Especialidades de la Casa (Columna 1)
            </span>
          </div>
          {leftCategories.map(renderCategoryCard)}
        </div>

        {/* Columna Derecha: Guarniciones, Bebidas, Postres */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold uppercase tracking-wide text-stone-700">
              Acompañamientos & Bebidas (Columna 2)
            </span>
          </div>
          {rightCategories.map(renderCategoryCard)}
        </div>
      </div>
    </section>
  );
};
