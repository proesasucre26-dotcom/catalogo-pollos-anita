import React, { useState } from 'react';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { MenuItem, ProductOption } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Check, Flame, SlidersHorizontal, Info, Sparkles } from 'lucide-react';

export const DishList: React.FC = () => {
  const {
    activeCategoryId,
    setActiveCategoryId,
    addToCart,
    items: cartItems,
    updateQuantity,
    openDetail,
    searchQuery,
  } = useCart();

  // Local state for options selected directly on card (e.g., choice of presa or salad)
  const [cardSelectedOptions, setCardSelectedOptions] = useState<Record<string, Record<string, string>>>({});

  // Filter items based on active category and search query
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery) {
      return matchesSearch;
    }

    if (activeCategoryId === 'todos') {
      return true;
    }

    return item.categoryId === activeCategoryId;
  });

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId);

  const handleOptionChange = (itemId: string, optionId: string, choiceName: string) => {
    setCardSelectedOptions((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [optionId]: choiceName,
      },
    }));
  };

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Prepare options from default or user selection
    const selectedOptionsList = (item.options || []).map((opt) => {
      const userChoice = cardSelectedOptions[item.id]?.[opt.id] || opt.defaultChoice || opt.choices[0]?.name;
      const foundChoice = opt.choices.find((c) => c.name === userChoice);
      return {
        optionName: opt.name,
        choice: userChoice,
        extraPrice: foundChoice?.extraPrice || 0,
      };
    });

    addToCart(item, selectedOptionsList, 1, '');
  };

  // Find how many instances of this product exist in the cart
  const getItemCartQuantity = (productId: string) => {
    return cartItems
      .filter((i) => i.productId === productId)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  return (
    <section id="submenu-section" className="scroll-mt-24 py-8 px-4 max-w-6xl mx-auto">
      {/* Category Navigation Bar / Tabs */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 border border-stone-200/80 shadow-xs mb-8">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveCategoryId('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryId === 'todos' && !searchQuery
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            📋 Todo el Menú ({MENU_ITEMS.length})
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = activeCategoryId === cat.id && !searchQuery;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-red-800 text-amber-300' : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submenu Header Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>
              {searchQuery
                ? `Resultados de búsqueda: "${searchQuery}"`
                : activeCategory
                ? `Submenú Desplegado: ${activeCategory.name}`
                : 'Menú Completo Pollos Anita'}
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-0.5">
            {searchQuery
              ? `Platos encontrados (${filteredItems.length})`
              : activeCategory?.name || 'Todos los Platillos'}
          </h2>
          {activeCategory && !searchQuery && (
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              {activeCategory.shortDesc}
            </p>
          )}
        </div>

        <span className="text-xs text-stone-400 font-medium">
          Mostrando {filteredItems.length} opciones listas para delivery
        </span>
      </div>

      {/* Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 max-w-md mx-auto">
          <p className="text-4xl mb-3">🍗❓</p>
          <h3 className="font-display font-bold text-lg text-stone-800">
            No encontramos platos que coincidan
          </h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Prueba buscando con palabras como "pollo", "papas", "chicha" o "salchipapa".
          </p>
          <button
            onClick={() => {
              setActiveCategoryId('todos');
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Ver Todo el Menú
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item) => {
            const inCartQty = getItemCartQuantity(item.id);
            const hasOptions = !!item.options && item.options.length > 0;

            return (
              <div
                key={item.id}
                onClick={() => openDetail(item)}
                className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Dish Image Slot */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Badge */}
                    {item.badge && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md tracking-tight flex items-center gap-1">
                        <span>{item.badge}</span>
                      </div>
                    )}

                    {/* Portion pill */}
                    {item.portionInfo && (
                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                        {item.portionInfo}
                      </div>
                    )}

                    {/* Price tag in Golden Amber */}
                    <div className="absolute top-3 right-3 bg-amber-400 text-stone-950 font-black text-sm sm:text-base px-2.5 py-1 rounded-xl shadow-md border border-amber-300 tabular-nums">
                      Bs. {item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 group-hover:text-red-700 transition-colors leading-snug">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-stone-500 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {/* Option Selector Pill / Radio if applicable (e.g. Presa / Ensalada) */}
                    {hasOptions && (
                      <div
                        className="mt-3.5 pt-3 border-t border-stone-100 space-y-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.options?.slice(0, 1).map((opt) => (
                          <div key={opt.id}>
                            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                              {opt.name}:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {opt.choices.map((choice) => {
                                const isSelected =
                                  (cardSelectedOptions[item.id]?.[opt.id] ||
                                    opt.defaultChoice) === choice.name;

                                return (
                                  <button
                                    key={choice.name}
                                    type="button"
                                    onClick={() => handleOptionChange(item.id, opt.id, choice.name)}
                                    className={`px-2.5 py-1.5 text-left rounded-lg text-[11px] font-medium border transition-colors cursor-pointer truncate ${
                                      isSelected
                                        ? 'bg-amber-50 text-amber-900 border-amber-400 font-bold ring-1 ring-amber-400'
                                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300'
                                    }`}
                                  >
                                    {choice.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 pt-2 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-stone-400">Precio</span>
                    <span className="font-display font-black text-lg text-amber-600 tabular-nums">
                      Bs. {item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Detail trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetail(item);
                      }}
                      className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                      title="Personalizar detalles"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Quick Add CTA in Fire Red */}
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(item, e)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir al Pedido</span>
                      {inCartQty > 0 && (
                        <span className="ml-1 bg-amber-400 text-stone-900 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                          {inCartQty}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
