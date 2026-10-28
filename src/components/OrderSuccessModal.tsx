import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { CheckCircle2, MessageCircle, Copy, Check, QrCode, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { isSuccessModalOpen, closeSuccessModal, lastOrderComanda, lastWhatsappUrl, clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'qr'>('whatsapp');

  if (!isSuccessModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(lastOrderComanda);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFinish = () => {
    clearCart();
    closeSuccessModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 text-white p-5 text-center shrink-0">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-2.5">
            <CheckCircle2 className="w-8 h-8 text-amber-300 stroke-[2.5]" />
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl">
            ¡Comanda Generada con Éxito!
          </h2>
          <p className="text-xs text-red-100 mt-1">
            Tu pedido está listo para ser despachado por el equipo de Pollos Anita.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-3 shrink-0">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 pb-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Envío WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 pb-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <QrCode className="w-4 h-4 text-amber-600" />
            <span>Pago Simple QR</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'whatsapp' ? (
            <>
              {/* Highlight card */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <div className="p-2 bg-emerald-600 rounded-xl text-white shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                    Paso Final: Enviar comanda por WhatsApp
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    Al hacer clic en el botón verde, se abrirá WhatsApp con todos los detalles de tu pedido ya redactados para que la cocina empiece a prepararlo de inmediato.
                  </p>
                </div>
              </div>

              {/* Primary Action Button */}
              <a
                href={lastWhatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all transform hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Abrir WhatsApp y Enviar Pedido</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
              </a>

              {/* Comanda preview with copy */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                    Resumen de la Comanda:
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar texto</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 bg-stone-900 text-stone-200 rounded-xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto border border-stone-800">
                  {lastOrderComanda}
                </pre>
              </div>
            </>
          ) : (
            /* QR PAYMENT TAB */
            <div className="text-center space-y-3 py-2">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 inline-block">
                {/* Visual SVG QR Representation */}
                <div className="w-44 h-44 mx-auto bg-white p-3 rounded-xl shadow-md border border-stone-200 flex flex-col items-center justify-center relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                    {/* QR data matrix noise pattern */}
                    <rect x="35" y="5" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="15" width="15" height="10" fill="currentColor" />
                    <rect x="35" y="25" width="25" height="10" fill="currentColor" />
                    <rect x="10" y="40" width="15" height="10" fill="currentColor" />
                    <rect x="35" y="40" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="45" width="20" height="15" fill="currentColor" />
                    <rect x="80" y="40" width="15" height="10" fill="currentColor" />
                    <rect x="35" y="60" width="15" height="15" fill="currentColor" />
                    <rect x="60" y="65" width="10" height="10" fill="currentColor" />
                    <rect x="40" y="80" width="20" height="15" fill="currentColor" />
                    <rect x="70" y="75" width="25" height="15" fill="currentColor" />

                    {/* Center Chick Mascot Logo */}
                    <circle cx="50" cy="50" r="10" fill="#D32F2F" />
                    <circle cx="50" cy="50" r="8" fill="#FFB300" />
                  </svg>
                  <span className="text-[10px] font-bold text-stone-700 mt-1 uppercase tracking-wider">
                    Pago Simple QR
                  </span>
                </div>
              </div>

              <div className="text-left bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Banco:</span>
                  <span className="font-bold text-stone-900">Banco Unión / BCP Bolivia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Titular:</span>
                  <span className="font-bold text-stone-900">Pollos Anita S.R.L.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tipo:</span>
                  <span className="font-bold text-stone-900">Cuenta Corriente</span>
                </div>
              </div>

              <p className="text-[11px] text-stone-500 leading-tight">
                Escanea el código QR desde tu app bancaria (Banco Unión, BCP, BNB, BancoSol, Ganadero, etc.) y adjunta el comprobante en tu chat de WhatsApp.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={handleFinish}
            className="w-full py-2.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Finalizar y Volver al Menú
          </button>
        </div>
      </div>
    </div>
  );
};
