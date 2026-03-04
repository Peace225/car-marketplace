import React from 'react';
import { Link } from 'react-router-dom';
import { carsData } from '../data/cars';

export default function Catalog() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">
            Notre <span className="text-[#fb201e]">Catalogue</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de véhicules de prestige, disponibles à la vente ou à la location.
          </p>
        </div>
        
        {/* Grille des voitures */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {carsData.map((car) => (
            <div 
              key={car.id} 
              className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-[#fb201e]/50 hover:shadow-[0_0_30px_rgba(251,32,30,0.15)] transition-all duration-300 group flex flex-col"
            >
              {/* Conteneur de l'image */}
              <div className="h-64 overflow-hidden relative">
                <img 
                    src={car.image} 
                    alt={car.model}
                    loading="lazy" // Ajoute ceci pour la performance
                    className="w-full h-full object-cover ..."
                    />
                
                {/* Badge Vente ou Location */}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">
                  <span className={car.type === "Vente" ? "text-white" : "text-[#fb201e]"}>
                    {car.type}
                  </span>
                </div>
              </div>

              {/* Conteneur des informations */}
              <div className="p-6 flex flex-col flex-grow gap-4">
                <div>
                  <h3 className="text-2xl font-black italic uppercase text-white">{car.brand}</h3>
                  <p className="text-lg text-white/70 font-medium">{car.model}</p>
                </div>
                
                <p className="text-sm text-white/50 line-clamp-2 flex-grow">
                  {car.description}
                </p>

                <div className="text-xl font-black text-[#fb201e] mt-2 border-t border-white/10 pt-4">
                  {car.price}
                </div>

                {/* Bouton Voir les détails avec le lien dynamique React Router */}
                <Link 
                  to={`/voiture/${car.id}`}
                  className="mt-4 w-full bg-white text-black text-center py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#fb201e] hover:text-white transition-colors duration-300"
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}