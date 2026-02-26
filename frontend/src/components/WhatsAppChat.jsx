import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "2250102030405"; // Remplace par ton vrai numéro (format international sans +)

  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      setMessage("");
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[998] flex flex-col items-end">
      
      {/* Bulle de discussion */}
      {isOpen && (
        <div className="mb-4 w-[280px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#25D366] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black">CM</div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#25D366] rounded-full"></div>
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-tighter">Support Car Market</p>
                <p className="text-[9px] opacity-90 font-bold uppercase">En ligne</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
              <X size={18} />
            </button>
          </div>

          {/* Corps du chat */}
          <div className="p-4 bg-gray-50 h-32 overflow-y-auto">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 mb-2">
              <p className="text-[10px] font-bold text-gray-600 leading-relaxed">
                Bonjour ! 👋 <br/> 
                Je suis prêt à vous aider à trouver votre prochain véhicule. Quel est votre projet ?
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white flex gap-2">
            <input 
              type="text" 
              placeholder="Écrivez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:bg-gray-50 border border-transparent focus:border-[#25D366] transition-all"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-[#25D366] text-white p-2 rounded-xl hover:scale-110 active:scale-90 transition-all shadow-md shadow-green-500/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bouton Flottant Principal */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-black text-white' : 'bg-[#25D366] text-white'
        }`}
      >
        <MessageCircle size={28} className={isOpen ? 'rotate-90 transition-transform' : ''} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] font-black items-center justify-center">1</span>
          </span>
        )}
      </button>
    </div>
  );
}