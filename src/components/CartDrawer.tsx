import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { DeliveryFormData } from '../types';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Bike,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  MapPin,
  User,
  Phone,
  FileText,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    openSuccessModal,
  } = useCart();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // Delivery Form State
  const [formData, setFormData] = useState<DeliveryFormData>({
    fullName: '',
    phone: '',
    address: '',
    reference: '',
    zone: 'Zona Central',
    paymentMethod: 'efectivo',
    cashAmount: '',
    specialInstructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  // Calculate delivery fee
  const isFreeDelivery = subtotal >= RESTAURANT_INFO.freeDeliveryThreshold;
  const deliveryFee = totalItems === 0 ? 0 : isFreeDelivery ? 0 : RESTAURANT_INFO.deliveryFee;
  const grandTotal = subtotal + deliveryFee;
  const amountToFreeDelivery = Math.max(0, RESTAURANT_INFO.freeDeliveryThreshold - subtotal);

  const handleInputChange = (field: keyof DeliveryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Ingresa tu nombre completo';
    if (!formData.phone.trim()) newErrors.phone = 'Ingresa tu número de WhatsApp';
    if (!formData.address.trim()) newErrors.address = 'Ingresa la dirección exacta';
    if (!formData.reference.trim()) newErrors.reference = 'Ingresa una referencia de tu ubicación';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setStep('checkout');
  };

  const handleConfirmOrder = () => {
    if (!validateForm()) return;

    // Generate WhatsApp Comanda Formatted String
    const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const orderId = `PA-${Math.floor(1000 + Math.random() * 9000)}`;

    let itemsText = '';
    items.forEach((item, index) => {
      itemsText += `\n*${index + 1}. ${item.quantity}x ${item.name}* — Bs. ${item.totalPrice.toFixed(2)}`;
      if (item.selectedOptions.length > 0) {
        itemsText += `\n   ↳ ${item.selectedOptions.map((o) => `${o.optionName}: ${o.choice}`).join(' | ')}`;
      }
      if (item.notes) {
        itemsText += `\n   ↳ 📝 Nota: ${item.notes}`;
      }
    });

    const paymentInfo =
      formData.paymentMethod === 'efectivo'
        ? `💵 Efectivo${formData.cashAmount ? ` (Paga con Bs. ${formData.cashAmount})` : ' (Monto exacto)'}`
        : '📱 Pago Simple QR (Transferencia)';

    const comanda = `🍗 *NUEVO PEDIDO A DOMICILIO - POLLOS ANITA* 🍗
*Pedido Nro:* #${orderId} (${dateStr})
-----------------------------------------
👤 *Cliente:* ${formData.fullName}
📱 *WhatsApp:* ${formData.phone}
🏘️ *Zona:* ${formData.zone}
📍 *Dirección:* ${formData.address}
🗺️ *Referencia:* ${formData.reference}
${formData.specialInstructions ? `💬 *Instrucciones:* ${formData.specialInstructions}\n` : ''}-----------------------------------------
📋 *DETALLE DEL PEDIDO:*${itemsText}
-----------------------------------------
💵 *Subtotal:* Bs. ${subtotal.toFixed(2)}
🛵 *Costo de Envío:* ${deliveryFee === 0 ? 'GRATIS (Promoción)' : `Bs. ${deliveryFee.toFixed(2)}`}
💰 *TOTAL A PAGAR:* Bs. ${grandTotal.toFixed(2)}
💳 *Forma de Pago:* ${paymentInfo}
-----------------------------------------
🍗 ¡Por favor confirmar recepción y tiempo de envío estimado!`;

    const encodedText = encodeURIComponent(comanda);
    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodedText}`;

    // Close drawer and open visual confirmation modal
    closeCart();
    openSuccessModal(comanda, whatsappUrl);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600 rounded-lg text-white font-bold text-xs">
              {step === 'cart' ? '🛒' : '🛵'}
            </span>
            <div>
              <h2 className="font-display font-bold text-base text-white">
                {step === 'cart' ? 'Tu Pedido a Domicilio' : 'Datos para la Entrega'}
              </h2>
              <p className="text-[11px] text-stone-300">
                {step === 'cart'
                  ? `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} seleccionados`
                  : 'Completa tu dirección para enviar por WhatsApp'}
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-900 mb-1">
            <div className="flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-amber-600" />
              <span>
                {isFreeDelivery
                  ? '¡Felicidades! Tienes ENVÍO GRATIS 🛵'
                  : `Agrega Bs. ${amountToFreeDelivery.toFixed(2)} más para Envío Gratis`}
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-700">
              {Math.min(100, Math.round((subtotal / RESTAURANT_INFO.freeDeliveryThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  (subtotal / RESTAURANT_INFO.freeDeliveryThreshold) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center text-3xl">
                🍗
              </div>
              <h3 className="font-display font-bold text-lg text-stone-800">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-stone-500 mt-1 mb-6">
                Descubre nuestros deliciosos combos de pollo a la brasa, broaster y salchipapas.
              </p>
              <button
                onClick={closeCart}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Explorar el Menú
              </button>
            </div>
          ) : step === 'cart' ? (
            /* STEP 1: ITEMS REVIEW */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-600 uppercase">Productos</span>
                <button
                  onClick={clearCart}
                  className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                >
                  Vaciar carrito
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-stone-200 p-3 shadow-2xs flex gap-3 items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-stone-100"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 truncate">
                      {item.name}
                    </h4>

                    {item.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {item.selectedOptions.map((o) => `${o.choice}`).join(' • ')}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-[10px] text-amber-700 italic truncate mt-0.5">
                        Nota: {item.notes}
                      </p>
                    )}

                    <div className="mt-1 font-extrabold text-xs text-amber-600 tabular-nums">
                      Bs. {item.totalPrice.toFixed(2)}
                    </div>
                  </div>

                  {/* Stepper & remove */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* STEP 2: CHECKOUT FORM */
            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-3 border border-red-200 text-xs text-red-900 flex items-center gap-2">
                <Bike className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  Enviaremos tu pedido directamente a la cocina para despacho express.
                </span>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Nombre Completo *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Carlos Pérez"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full p-2.5 text-xs bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    errors.fullName ? 'border-red-500' : 'border-stone-200'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Teléfono WhatsApp *</span>
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 76543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full p-2.5 text-xs bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    errors.phone ? 'border-red-500' : 'border-stone-200'
                  }`}
                />
                {errors.phone && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Zone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Zona / Barrio</span>
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => handleInputChange('zone', e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="Zona Central">Zona Central</option>
                  <option value="Miraflores / Estadio">Miraflores / Estadio</option>
                  <option value="San Roque / Colina">San Roque / Colina</option>
                  <option value="Surapata / Parque Bolivar">Surapata / Parque Bolívar</option>
                  <option value="Garcilazo / Rumi Rumi">Garcilazo / Rumi Rumi</option>
                  <option value="Otra Zona">Otra Zona (especificar abajo)</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>Dirección Exacta (Calle, Nro, Piso) *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Calle Arenales #340, Depto 2B"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full p-2.5 text-xs bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    errors.address ? 'border-red-500' : 'border-stone-200'
                  }`}
                />
                {errors.address && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.address}</p>
                )}
              </div>

              {/* Reference */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  <span>Referencias de Ubicación *</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Portón café frente a la farmacia"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  className={`w-full p-2.5 text-xs bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    errors.reference ? 'border-red-500' : 'border-stone-200'
                  }`}
                />
                {errors.reference && (
                  <p className="text-[10px] text-red-600 mt-1">{errors.reference}</p>
                )}
              </div>

              {/* Payment Method */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('paymentMethod', 'efectivo')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'efectivo'
                        ? 'border-red-600 bg-red-50 text-red-950 ring-1 ring-red-600 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInputChange('paymentMethod', 'qr')}
                    className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                      formData.paymentMethod === 'qr'
                        ? 'border-red-600 bg-red-50 text-red-950 ring-1 ring-red-600 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Transferencia QR</span>
                  </button>
                </div>

                {formData.paymentMethod === 'efectivo' && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      placeholder="¿Con cuánto pagarás? Ej: Bs. 100 (para tu cambio)"
                      value={formData.cashAmount || ''}
                      onChange={(e) => handleInputChange('cashAmount', e.target.value)}
                      className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Notas adicionales para el delivery
                </label>
                <input
                  type="text"
                  placeholder="Ej: Tocar timbre 2B, entregar en recepción..."
                  value={formData.specialInstructions || ''}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Bottom Action Section */}
        {items.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold tabular-nums">Bs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Envío a Domicilio</span>
                  {isFreeDelivery && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-sm">
                      GRATIS
                    </span>
                  )}
                </span>
                <span className="font-semibold tabular-nums">
                  {deliveryFee === 0 ? 'Bs. 0.00' : `Bs. ${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-900">
                <span>Total a Pagar</span>
                <span className="text-red-700 font-display text-lg tabular-nums">
                  Bs. {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step navigation / CTA */}
            {step === 'cart' ? (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <span>Continuar a Entrega</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Atrás
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
                >
                  <span>Enviar Pedido a WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
