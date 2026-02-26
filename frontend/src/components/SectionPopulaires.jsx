import React from "react";
import { ShieldCheck, Banknote, Clock } from "lucide-react";

export default function SectionPopulaires({ cars, CarCard }) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-8">
      
      {/* Avantages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <ShieldCheck className="mx-auto mb-3 text-[#ff4d00]" size={28} />
          <h3 className="font-black uppercase text-sm mb-1">Réservation Sécurisée</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Assurance tous risques incluse</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Banknote className="mx-auto mb-3 text-[#ff4d00]" size={28} />
          <h3 className="font-black uppercase text-sm mb-1">Annulation Gratuite</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Jusqu'à 48h avant le départ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <Clock className="mx-auto mb-3 text-[#ff4d00]" size={28} />
          <h3 className="font-black uppercase text-sm mb-1">Disponibilité Immédiate</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Votre clé en moins de 24h</p>
        </div>
      </div>

      {/* Titre Véhicules Populaires */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
          Véhicules <span className="text-[#ff4d00]">Populaires</span>
        </h2>
        <p className="text-xs font-bold text-gray-400 mt-2">Découvrez les modèles les plus recherchés en ce moment.</p>
      </div>

      {/* Grille des véhicules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {/* Bouton de retour en haut */}
      <div className="mt-10 text-center">
        <button 
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="bg-black text-white hover:bg-[#ff4d00] px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-colors"
        >
          Effectuer une nouvelle recherche
        </button>
      </div>

    </div>
  );
}