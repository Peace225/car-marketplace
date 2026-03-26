import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppChat() {
  const phoneNumber = "2250151104839"; // Ton vrai numéro (format international sans +)
  
  // Message par défaut (optionnel) pré-rempli quand l'utilisateur arrive sur WhatsApp
  const defaultMessage = "Bonjour Auto Life Services, je vous contacte depuis votre site web et j'aimerais avoir plus d'informations.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[998]">
      
      {/* NOUVEAU : Tooltip/Message incitatif au survol (Optionnel mais recommandé) */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-white text-black px-4 py-2 rounded-2xl shadow-xl border border-gray-100 opacity-0 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4">
        <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          Discutons sur WhatsApp
        </p>
      </div>

      {/* Bouton Flottant Principal */}
      <button 
        onClick={handleWhatsAppClick}
        title="Nous contacter sur WhatsApp"
        className="group relative p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center bg-[#25D366] text-white hover:scale-110 hover:shadow-[#25D366]/40 active:scale-95 z-10"
      >
        <MessageCircle size={28} />
        
        {/* Pastille de notification (pour attirer l'oeil) */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] font-black items-center justify-center shadow-sm">1</span>
        </span>
      </button>

    </div>
  );
}