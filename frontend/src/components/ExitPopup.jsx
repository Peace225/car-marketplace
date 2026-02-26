import React, { useState, useEffect } from "react";
import { X, Gift, ArrowRight, CheckCircle } from "lucide-react";

export default function ExitPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY < 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [hasShown]);

  const handleConfirm = () => {
    if (email.trim().length > 3) {
      setIsSubmitted(true);
      setTimeout(() => setIsVisible(false), 2500);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
      {/* Conteneur Principal Dark */}
      <div className="relative w-full max-w-[320px] bg-[#1a1a1a] rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Bouton Fermer Light */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-20"
        >
          <X size={16} />
        </button>

        <div className="p-8 text-center">
          {/* Icône Cadeau Circulaire */}
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="text-[#ff4d00]" size={28} />
          </div>

          {!isSubmitted ? (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-black text-white italic tracking-tighter leading-none mb-4">
                Remise <span className="text-[#ff4d00]">Exclusive</span>
              </h2>
              
              <p className="text-[11px] font-medium text-gray-400 leading-relaxed mb-6">
                Recevez <span className="text-white font-bold">150 000 FCFA</span> sur votre <br/>
                première transaction.
              </p>

              <div className="space-y-3">
                <div className="text-left pl-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">S'abonner ?</label>
                </div>
                <input 
                  type="text" 
                  placeholder="WhatsApp ou Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white rounded-lg py-3 px-4 outline-none font-bold text-xs text-black transition-all"
                />

                <div className="flex gap-2">
                    <button 
                    onClick={handleConfirm}
                    className="flex-1 bg-[#ff4d00] text-white font-bold text-xs py-3 rounded-lg hover:bg-[#e64500] transition-all flex items-center justify-center gap-2 group"
                    >
                    Valider l'offre <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>

              <button 
                onClick={() => setIsVisible(false)}
                className="mt-6 text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
              >
                Non, merci
              </button>
            </div>
          ) : (
            <div className="py-6 animate-in zoom-in-90 duration-500 text-center">
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">Offre Activée !</h3>
            </div>
          )}
        </div>

        {/* Barre de finition en bas */}
        <div className="h-4 w-full bg-gradient-to-r from-gray-800 via-white/20 to-gray-800"></div>
      </div>
    </div>
  );
}