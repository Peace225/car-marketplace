import React from "react";

export default function SectionPopulaires({ cars, CarCard }) {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-8">
      
      {/* Titre Véhicules Disponibles */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
          Véhicules <span className="text-[#ff4d00]">Disponibles</span>
        </h2>
        <p className="text-xs font-bold text-gray-400 mt-2">Explorez notre sélection de véhicules prêts pour vous.</p>
      </div>

      {/* Grille des véhicules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cars.map((car) => (
          // On passe l'objet car à CarCard qui gère l'affichage et le clic
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