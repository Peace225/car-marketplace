import React from "react";
import { ArrowLeft, CheckCircle, Info } from "lucide-react";

export default function ListeOffreVehicules({ offre, onBack, CarCard, allCars }) {
  // Simulation de filtrage par catégorie selon l'offre
  const getFilteredCars = () => {
    if (offre.id === "gold") return allCars.filter(c => ["Peugeot", "Toyota"].includes(c.marque));
    if (offre.id === "premium") return allCars.filter(c => ["BMW", "Audi", "Tesla"].includes(c.marque));
    return allCars.filter(c => ["Porsche", "BMW", "Tesla"].includes(c.marque));
  };

  const filteredCars = getFilteredCars();

  return (
    <div className="w-full min-h-screen bg-gray-50 pb-20 animate-in fade-in duration-500">
      {/* Header spécifique */}
      <div className="bg-black text-white py-6 px-4 sticky top-0 z-50 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-[#ff4d00] transition-colors">
            <ArrowLeft size={16} /> Retour aux offres
          </button>
          <div className="text-right">
            <h2 className="text-xl font-black uppercase italic leading-none">Offre {offre.name}</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{offre.budget} HT</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-10">
        <div className="bg-[#ff4d00] text-white p-4 rounded-2xl mb-10 flex items-center gap-4 shadow-lg shadow-orange-500/20">
          <Info size={24} />
          <p className="text-xs font-bold uppercase tracking-tight">
            Voici les types de véhicules disponibles pour votre budget {offre.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}