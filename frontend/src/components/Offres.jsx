import React from "react";
import { Star, Award, Crown, CheckCircle, Car, ArrowRight } from "lucide-react";

// Ajout de la prop onSelect ici
export default function Offres({ onSelect }) {
  const offres = [
    {
      id: "gold",
      name: "Gold",
      icon: <Star size={20} className="text-yellow-500" />,
      iconBg: "bg-yellow-50",
      budget: "5 - 6,5 Millions",
      taxText: "Hors Taxes",
      description: "L'essentiel pour un véhicule fiable au quotidien.",
      cardStyle: "bg-white border border-gray-100 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/10 text-gray-900",
      buttonStyle: "bg-gray-100 text-black hover:bg-yellow-400 hover:text-white",
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
      icon: <Award size={20} className="text-[#ff4d00]" />,
      iconBg: "bg-[#ff4d00]/10",
      budget: "7 - 10 Millions",
      taxText: "Hors Taxes",
      description: "Le compromis parfait alliant confort et standing.",
      cardStyle: "bg-white border-2 border-[#ff4d00] shadow-2xl shadow-[#ff4d00]/20 md:scale-105 z-10 text-gray-900",
      buttonStyle: "bg-[#ff4d00] text-white hover:bg-black",
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
      icon: <Crown size={20} className="text-white" />,
      iconBg: "bg-white/10",
      budget: "11+ Millions",
      taxText: "Hors Taxes",
      description: "L'excellence absolue, sans aucun compromis.",
      cardStyle: "bg-gradient-to-b from-gray-900 to-black border border-gray-800 shadow-2xl shadow-black/50 text-white",
      buttonStyle: "bg-white text-black hover:bg-[#ff4d00] hover:text-white hover:border-[#ff4d00] border border-transparent",
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
        
        <div className="text-center mb-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-none mb-3 text-white drop-shadow-lg">
            Nos Formules <span className="text-[#ff4d00]">Sur Mesure</span>
          </h2>
          <p className="text-xs font-bold text-gray-300 max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Choisissez l'accompagnement qui correspond à votre budget et exigences. 
            Nous trouvons le véhicule parfait.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {offres.map((offre) => {
            const isVIP = offre.id === "vip";
            const isPremium = offre.id === "premium";

            return (
              <div 
                key={offre.id} 
                className={`relative flex flex-col rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-2 group ${offre.cardStyle}`}
              >
                {offre.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    {offre.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-2.5 rounded-xl flex items-center justify-center ${offre.iconBg}`}>
                    {offre.icon}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">
                    {offre.name}
                  </h3>
                </div>

                <div className="mb-4">
                  <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${isVIP ? 'text-gray-400' : 'text-gray-400'}`}>
                    Budget estimé
                  </p>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl lg:text-3xl font-black leading-none tracking-tighter ${isPremium ? 'text-[#ff4d00]' : ''}`}>
                      {offre.budget}
                    </span>
                  </div>
                  <p className={`text-[8px] font-black uppercase tracking-widest mt-1 ${isVIP ? 'text-gray-500' : 'text-gray-400'}`}>
                    {offre.taxText}
                  </p>
                </div>

                <p className={`text-[11px] font-bold mb-5 pb-5 border-b ${isVIP ? 'text-gray-400 border-gray-800' : 'text-gray-500 border-gray-100'}`}>
                  {offre.description}
                </p>

                <div className="space-y-3 mb-6 flex-1">
                  {offre.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle 
                        size={14} 
                        className={`shrink-0 mt-0.5 ${isVIP ? 'text-[#ff4d00]' : isPremium ? 'text-[#ff4d00]' : 'text-gray-300'}`} 
                      />
                      <span className={`text-[10px] md:text-[11px] font-bold leading-snug ${isVIP ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Ajout du onClick ici */}
                <button 
                  onClick={() => onSelect(offre)}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${offre.buttonStyle}`}
                >
                  <Car size={14} /> 
                  <span>Sélectionner</span>
                  <ArrowRight size={14} className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}