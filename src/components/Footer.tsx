import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { MapPin, Phone, Clock, Flame, Heart, ShoppingBag } from 'lucide-react';

export const Footer: React.FC = () => {
  const { openStoreInfo, openCart } = useCart();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-12 pb-20 sm:pb-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={RESTAURANT_INFO.logo}
                alt="Pollos Anita"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400"
              />
              <div>
                <span className="font-display font-black text-xl text-white">
                  Pollos Anita
                </span>
                <p className="text-xs text-amber-400 font-medium">
                  El Verdadero Sabor Tradicional
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Especialistas en pollo a la brasa dorado a fuego lento, pollo broaster extra crocante,
              salchipapas supremas y nuestra chicha morada artesanal. Preparado con los mejores
              ingredientes y la tradición de nuestra sazón única.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-stone-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Envíos a domicilio activos en toda la ciudad</span>
            </div>
          </div>

          {/* Quick links & contact */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Contacto & Pedidos
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{RESTAURANT_INFO.shortAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a
                  href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}`}
                  className="hover:text-white transition-colors"
                >
                  {RESTAURANT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>11:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Customer service & actions */}
          <div className="space-y-2.5">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Servicio al Cliente
            </h4>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={openStoreInfo}
                className="text-left text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                • Cobertura y Horarios de Entrega
              </button>
              <button
                onClick={openCart}
                className="text-left text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                • Ver Carrito de Pedido
              </button>
              <a
                href={`https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=Hola%20Pollos%20Anita,%20deseo%20hacer%20una%20consulta`}
                target="_blank"
                rel="noreferrer"
                className="text-left text-stone-400 hover:text-white transition-colors"
              >
                • Atención Personalizada por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Pollos Anita. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>para los amantes del buen pollo</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
