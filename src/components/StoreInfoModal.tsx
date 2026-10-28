import React from 'react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { X, MapPin, Clock, Phone, Bike, ShieldCheck, QrCode, Banknote } from 'lucide-react';

export const StoreInfoModal: React.FC = () => {
  const { isStoreInfoOpen, closeStoreInfo } = useCart();

  if (!isStoreInfoOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={closeStoreInfo} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <img
              src={RESTAURANT_INFO.logo}
              alt="Pollos Anita"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400"
            />
            <div>
              <h2 className="font-display font-bold text-base text-white">
                {RESTAURANT_INFO.name}
              </h2>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {RESTAURANT_INFO.statusText}
              </span>
            </div>
          </div>

          <button
            onClick={closeStoreInfo}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Location */}
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                Dirección Oficial
              </h4>
              <p className="text-stone-600 mt-0.5">{RESTAURANT_INFO.address}</p>
              <p className="text-[11px] text-amber-700 mt-1 font-medium">
                Atención para consumo en salón, para llevar y servicio de entrega a domicilio.
              </p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                Horario de Atención
              </h4>
              <p className="text-stone-600 mt-0.5">{RESTAURANT_INFO.hours}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Cocina activa y hornos a la brasa listos durante todo el día.
              </p>
            </div>
          </div>

          {/* Delivery Policy */}
          <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide">
                Políticas de Delivery
              </h4>
              <p className="text-stone-600 mt-0.5">
                Tiempo promedio: <strong>{RESTAURANT_INFO.deliveryTimeEstimate}</strong>
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Costo base de envío: Bs. {RESTAURANT_INFO.deliveryFee}.00. <br />
                <strong className="text-emerald-700">¡ENVÍO GRATIS en compras desde Bs. {RESTAURANT_INFO.freeDeliveryThreshold}.00!</strong>
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wide mb-2">
              Formas de Pago Aceptadas
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>Efectivo contra entrega</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-stone-200">
                <QrCode className="w-4 h-4 text-red-600" />
                <span>Pago QR Instantáneo</span>
              </div>
            </div>
          </div>

          {/* Quality Guarantee */}
          <div className="flex items-center gap-2.5 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Certificación de inocuidad alimentaria, empaque sellado inviolable y salsas frescas del día.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <a
            href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Contactar por WhatsApp: {RESTAURANT_INFO.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
