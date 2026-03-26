import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Crown, CheckCircle, Car, ArrowRight, ShieldAlert } from "lucide-react";

export default function Offres({ onSelect }) {
  const navigate = useNavigate();

  const offres = [
    {
      id: "gold",
      name: "Gold",
      icon: <Star size={20} className="text-yellow-500" fill="currentColor" />,
      iconBg: "bg-yellow-50",
      budget: "5 - 6,5 Millions",
      taxText: "Hors Taxes",
      douaneValue: "3,5 à 4,5 Millions",
      description: "L'essentiel pour un véhicule fiable au quotidien.",
      cardStyle: "bg-white border border-gray-100 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/10 text-gray-900",
      buttonStyle: "bg-gray-100 text-black hover:bg-yellow-400 hover:text-white",
      taxBadgeStyle: "bg-yellow-400 text-black shadow-sm", 
      features: [
        "Catégorie : Berlines & SUV",
        "Recherche personnalisée",
        "Inspection mécanique",
        "Assistance à l'achat"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      icon: (
        <div className="flex gap-1">
          <Star size={20} className="text-[#ff4d00]" fill="currentColor" />
          <Star size={20} className="text-[#ff4d00]" fill="currentColor" />
        </div>
      ),
      iconBg: "bg-[#ff4d00]/10",
      budget: "7 - 10 Millions",
      taxText: "Hors Taxes",
      douaneValue: "4,5 à 6,5 Millions",
      description: "Le compromis parfait alliant confort et standing.",
      cardStyle: "bg-white border-2 border-[#ff4d00] shadow-2xl shadow-[#ff4d00]/20 md:scale-105 z-10 text-gray-900",
      buttonStyle: "bg-[#ff4d00] text-white hover:bg-black",
      taxBadgeStyle: "bg-[#ff4d00] text-white shadow-lg shadow-[#ff4d00]/30", 
      badge: "Le choix N°1",
      features: [
        "Catégorie : Berlines & SUV",
        "Catégorie : Moyen - Supérieur",
        "Rapport complet détaillé",
        "Priorité sur le dossier"
      ]
    },
    {
      id: "vip",
      name: "VIP",
      icon: (
        <div className="flex gap-1">
          <Star size={20} className="text-black" fill="currentColor" />
          <Star size={20} className="text-black" fill="currentColor" />
          <Star size={20} className="text-black" fill="currentColor" />
        </div>
      ),
      iconBg: "bg-gray-100", 
      budget: "11+ Millions",
      taxText: "Hors Taxes",
      douaneValue: "7 Millions et +",
      description: "L'excellence absolue, sans aucun compromis.",
      cardStyle: "bg-white border border-gray-200 shadow-xl hover:shadow-2xl hover:border-black transition-all text-gray-900",
      buttonStyle: "bg-black text-white hover:bg-[#ff4d00] hover:text-white hover:border-[#ff4d00] border border-transparent",
      taxBadgeStyle: "bg-black text-white font-black shadow-md", 
      features: [
        "Catégorie : Berlines & SUV",
        "Catégorie : Supérieur - Ultra",
        "Conciergerie dédiée 24/7",
        "Démarches incluses",
        "Livraison à domicile"
      ]
    }
  ];

  return (
    <div 
      className="relative w-full py-20 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=2069')" }}
    >
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-none mb-3 text-white">
            Nos Formules <span className="text-[#ff4d00]">Sur Mesure</span>
          </h2>
          <p className="text-xs font-bold text-gray-400 max-w-xl mx-auto leading-relaxed">
            Choisissez l'accompagnement qui correspond à votre budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {offres.map((offre) => {
            const isVIP = offre.id === "vip";
            const isPremium = offre.id === "premium";

            return (
              <div 
                key={offre.id} 
                className={`relative flex flex-col rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 group ${offre.cardStyle}`}
              >
                {offre.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-xl z-20">
                    {offre.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl flex items-center justify-center ${offre.iconBg}`}>
                    {offre.icon}
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">
                    {offre.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Budget estimé
                  </p>
                  <div className="flex flex-col items-start gap-2">
                    <span className={`text-3xl lg:text-4xl font-black leading-none tracking-tighter ${isPremium ? 'text-[#ff4d00]' : ''}`}>
                      {offre.budget}
                    </span>
                    
                    <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center ${offre.taxBadgeStyle}`}>
                      {offre.taxText}
                    </div>
                  </div>
                  
                  <div className={`mt-5 border rounded-2xl p-4 flex items-start gap-3 transition-colors ${
                    isVIP ? 'bg-gray-100 border-gray-200' : 
                    isPremium ? 'bg-[#ff4d00]/5 border-[#ff4d00]/20' : 
                    'bg-yellow-50 border-yellow-200'
                  }`}>
                    <ShieldAlert size={18} className={`shrink-0 mt-0.5 ${
                      isVIP ? 'text-black' : 
                      isPremium ? 'text-[#ff4d00]' : 
                      'text-yellow-500'
                    }`} />
                    <p className="leading-tight flex flex-col">
                      <span className={`text-[8px] font-black uppercase tracking-widest mb-1 ${
                        isVIP ? 'text-gray-500' : 
                        isPremium ? 'text-[#ff4d00]/80' : 
                        'text-yellow-600'
                      }`}>
                        Douane à prévoir
                      </span>
                      <span className={`text-sm font-black ${
                        isVIP ? 'text-black' : 
                        isPremium ? 'text-[#ff4d00]' : 
                        'text-yellow-600'
                      }`}>
                        {offre.douaneValue}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-[12px] font-bold mb-6 pb-6 border-b text-gray-500 border-gray-100">
                  {offre.description}
                </p>

                <div className="space-y-4 mb-8 flex-1">
                  {offre.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle 
                        size={16} 
                        className={`shrink-0 mt-0.5 ${isVIP ? 'text-black' : isPremium ? 'text-[#ff4d00]' : 'text-yellow-500'}`} 
                      />
                      <span className="text-[11px] md:text-[12px] font-bold leading-snug text-gray-700">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* BOUTON DE REDIRECTION */}
                <button 
                  onClick={() => {
                    if (onSelect) onSelect(offre);
                    // Redirige vers la page catalogue avec le paramètre de la catégorie choisie
                    navigate(`/catalogue?categorie=${offre.id}`); 
                  }}
                  className={`w-full mt-auto py-5 rounded-[1.2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${offre.buttonStyle}`}
                >
                  <Car size={16} /> 
                  <span>Sélectionner</span>
                  <ArrowRight size={16} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}