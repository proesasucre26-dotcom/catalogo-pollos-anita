import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';
import { Flame, Sparkles, Utensils, ShieldCheck, Bike } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background with gastronomic hero image */}
      <div className="absolute inset-0 z-0">
        <img
          src={RESTAURANT_INFO.heroBanner}
          alt="Pollos Anita Banquete"
          className="w-full h-full object-cover object-center opacity-30 md:opacity-35 scale-105 transform hover:scale-100 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Gradients to guarantee legibility and brand warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/60" />
        <div className="absolute inset-0 bg-radial-gradient from-red-950/40 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16 text-center flex flex-col items-center">
        {/* Prominent centered official logo */}
        <div className="relative mb-4 sm:mb-6 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-red-500 to-amber-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-white p-1.5 sm:p-2 rounded-full shadow-2xl ring-4 ring-amber-400/90 overflow-hidden">
            <img
              src={RESTAURANT_INFO.logo}
              alt="Logotipo Oficial Pollos Anita"
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Brand highlight pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/90 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-lg mb-3">
          <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>Pollería Tradicional & Broastería</span>
        </div>

        {/* Main Catchy Headline */}
        <h1 className="font-display font-black text-2xl sm:text-3xl md:text-5xl text-white tracking-tight leading-tight max-w-3xl drop-shadow-md">
          {RESTAURANT_INFO.tagline}
        </h1>

        {/* Supporting description */}
        <p className="mt-3 text-stone-200 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed drop-shadow-xs">
          Pollo marinado con nuestra receta de la casa, horneado lentamente a las brasas,
          servido con papas doradas crujientes, ensalada fresca y cremas artesanales ilimitadas.
        </p>

        {/* Value pills / highlights */}
        <div className="mt-6 flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/80 text-stone-200">
            <Bike className="w-4 h-4 text-amber-400" />
            <span>Delivery rápido: <strong className="text-white">30-45 min</strong></span>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/80 text-stone-200">
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>Salsas secretas de la casa</span>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700/80 text-stone-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Empaque 100% térmico y sellado</span>
          </div>
        </div>
      </div>
    </section>
  );
};
