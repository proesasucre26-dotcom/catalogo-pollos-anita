import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Check, Flame, MessageSquare } from 'lucide-react';

export const DishDetailModal: React.FC = () => {
  const { selectedDetailItem, closeDetail, addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedRadioOptions, setSelectedRadioOptions] = useState<Record<string, string>>({});
  const [selectedCheckboxOptions, setSelectedCheckboxOptions] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedDetailItem) {
      setQuantity(1);
      setNotes('');

      // Set defaults for options
      const initialRadios: Record<string, string> = {};
      const initialChecks: Record<string, string[]> = {};

      selectedDetailItem.options?.forEach((opt) => {
        if (opt.type === 'radio') {
          initialRadios[opt.id] = opt.defaultChoice || opt.choices[0]?.name || '';
        } else if (opt.type === 'checkbox') {
          initialChecks[opt.id] = [];
        }
      });

      setSelectedRadioOptions(initialRadios);
      setSelectedCheckboxOptions(initialChecks);
    }
  }, [selectedDetailItem]);

  if (!selectedDetailItem) return null;

  const handleRadioSelect = (optionId: string, choiceName: string) => {
    setSelectedRadioOptions((prev) => ({ ...prev, [optionId]: choiceName }));
  };

  const handleCheckboxToggle = (optionId: string, choiceName: string) => {
    setSelectedCheckboxOptions((prev) => {
      const current = prev[optionId] || [];
      if (current.includes(choiceName)) {
        return { ...prev, [optionId]: current.filter((c) => c !== choiceName) };
      } else {
        return { ...prev, [optionId]: [...current, choiceName] };
      }
    });
  };

  // Calculate extra prices if any
  let extraPriceTotal = 0;
  const selectionsList: { optionName: string; choice: string; extraPrice: number }[] = [];

  selectedDetailItem.options?.forEach((opt) => {
    if (opt.type === 'radio') {
      const selected = selectedRadioOptions[opt.id];
      if (selected) {
        const choiceObj = opt.choices.find((c) => c.name === selected);
        const extra = choiceObj?.extraPrice || 0;
        extraPriceTotal += extra;
        selectionsList.push({
          optionName: opt.name,
          choice: selected,
          extraPrice: extra,
        });
      }
    } else if (opt.type === 'checkbox') {
      const selectedArr = selectedCheckboxOptions[opt.id] || [];
      selectedArr.forEach((name) => {
        const choiceObj = opt.choices.find((c) => c.name === name);
        const extra = choiceObj?.extraPrice || 0;
        extraPriceTotal += extra;
        selectionsList.push({
          optionName: opt.name,
          choice: name,
          extraPrice: extra,
        });
      });
    }
  });

  const unitTotal = selectedDetailItem.price + extraPriceTotal;
  const finalTotal = unitTotal * quantity;

  const handleConfirmAddToCart = () => {
    addToCart(selectedDetailItem, selectionsList, quantity, notes);
    closeDetail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={closeDetail} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header with photo */}
        <div className="relative h-56 sm:h-64 w-full bg-stone-900 shrink-0">
          <img
            src={selectedDetailItem.image}
            alt={selectedDetailItem.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={closeDetail}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          {selectedDetailItem.badge && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
              {selectedDetailItem.badge}
            </div>
          )}

          {/* Title on image */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <h2 className="font-display font-black text-xl sm:text-2xl leading-tight">
              {selectedDetailItem.name}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-amber-400 text-stone-950 font-black text-sm px-2 py-0.5 rounded-lg tabular-nums">
                Bs. {selectedDetailItem.price.toFixed(2)}
              </span>
              {selectedDetailItem.portionInfo && (
                <span className="text-xs text-stone-200">
                  {selectedDetailItem.portionInfo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
              Detalle & Acompañamientos
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {selectedDetailItem.description}
            </p>
          </div>

          {/* Options */}
          {selectedDetailItem.options?.map((opt) => (
            <div key={opt.id} className="pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-stone-900">{opt.name}</span>
                <span className="text-xs text-stone-400">
                  {opt.type === 'radio' ? 'Elige 1 opción' : 'Opcional'}
                </span>
              </div>

              <div className="space-y-1.5">
                {opt.choices.map((choice) => {
                  const isSelected =
                    opt.type === 'radio'
                      ? selectedRadioOptions[opt.id] === choice.name
                      : (selectedCheckboxOptions[opt.id] || []).includes(choice.name);

                  return (
                    <button
                      key={choice.name}
                      type="button"
                      onClick={() =>
                        opt.type === 'radio'
                          ? handleRadioSelect(opt.id, choice.name)
                          : handleCheckboxToggle(opt.id, choice.name)
                      }
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-50 text-red-950 ring-1 ring-red-600'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-${
                            opt.type === 'radio' ? 'full' : 'md'
                          } flex items-center justify-center border ${
                            isSelected
                              ? 'border-red-600 bg-red-600 text-white'
                              : 'border-stone-300 bg-stone-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{choice.name}</span>
                      </div>
                      {choice.extraPrice ? (
                        <span className="text-xs font-bold text-amber-600">
                          +Bs. {choice.extraPrice.toFixed(2)}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special notes */}
          <div className="pt-3 border-t border-stone-100">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
              <span>Instrucciones Especiales o Preferencias</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Pollo bien dorado, piel extra crujiente, sin ensalada rusa, salsas bien selladas..."
              rows={2}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 text-stone-800"
            />
          </div>
        </div>

        {/* Modal Bottom Footer: Quantity and Add CTA */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          {/* Quantity stepper */}
          <div className="flex items-center border border-stone-200 bg-white rounded-xl shadow-xs overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2.5 text-stone-600 hover:bg-stone-100 active:bg-stone-200 transition-colors cursor-pointer"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3.5 text-sm font-extrabold tabular-nums text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2.5 text-stone-600 hover:bg-stone-100 active:bg-stone-200 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to order CTA */}
          <button
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-between text-xs sm:text-sm transition-all cursor-pointer"
          >
            <span>Añadir al Pedido</span>
            <span className="bg-red-800/60 px-2.5 py-0.5 rounded-lg text-amber-300 font-black tabular-nums">
              Bs. {finalTotal.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
