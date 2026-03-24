import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, MessageCircle } from "lucide-react";

// --- OPTIMISATION CLOUDINARY ---
const getOptimizedImage = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('upload/');
  if (parts.length === 2) {
    return `${parts[0]}upload/w_800,h_600,c_fill,f_auto,q_auto/${parts[1]}`;
  }
  return url;
};

export default function CarCard({ car, handleContactAdmin }) {
  // 1. Définir l'image principale (face avant ou ancienne image)
  const defaultImage = car.images?.front || car.image;
  const [activeImage, setActiveImage] = useState(defaultImage);

  // 2. Mettre à jour si la voiture change
  useEffect(() => {
    setActiveImage(car.images?.front || car.image);
  }, [car]);

  // 3. Empêcher les clics sur les miniatures de déclencher d'autres liens
  const handleImageSelect = (e, imgUrl) => {
    e.preventDefault(); 
    e.stopPropagation();
    setActiveImage(imgUrl);
  };

  // Nom sécurisé (au cas où tu utilises 'name' au lieu de 'brand' + 'model')
  const carName = car.name || `${car.brand} ${car.model}`;

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#ff4d00]/40 transition-all group relative flex flex-col">
      
      {/* BADGE DISPONIBILITÉ */}
      {car.availability && (
        <div className={`absolute top-4 right-4 z-20 text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border ${
          car.availability === 'Disponible' ? 'bg-[#22c55e]/90 text-white border-green-400 animate-pulse' : 
          car.availability === 'En arrivage' ? 'bg-blue-500/80 text-white border-blue-400' : 
          'bg-red-500/80 text-white border-red-400'
        }`}>
          {car.availability === 'Disponible' ? '✅ Dispo de suite' : car.availability}
        </div>
      )}

      {/* --- ZONE D'IMAGE AVEC GALERIE --- */}
      <div className="h-72 overflow-hidden relative">
        <img 
          src={getOptimizedImage(activeImage)} 
          alt={carName} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700" 
        />
        
        {/* Badge Marque */}
        {car.brand && (
          <div className="absolute bottom-4 left-4 flex gap-2 z-10">
            <span className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase border border-white/10">
              {car.brand}
            </span>
          </div>
        )}

        {/* --- LES 3 MINIATURES INTERACTIVES --- */}
        {car.images && (car.images.front || car.images.back || car.images.interior) && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-20">
            {[
              { key: 'front', label: 'AV' },
              { key: 'back', label: 'AR' },
              { key: 'interior', label: 'INT' }
            ].map((view) => {
              if (!car.images[view.key]) return null;

              return (
                <button 
                  key={view.key}
                  type="button"
                  onMouseEnter={(e) => handleImageSelect(e, car.images[view.key])}
                  onClick={(e) => handleImageSelect(e, car.images[view.key])}
                  className={`relative w-12 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === car.images[view.key] 
                    ? 'border-[#ff4d00] scale-110 shadow-lg shadow-orange-500/50' 
                    : 'border-white/40 opacity-70 hover:opacity-100 hover:scale-105 hover:border-white'
                  }`}
                >
                  <img 
                    src={getOptimizedImage(car.images[view.key])} 
                    className="w-full h-full object-cover" 
                    alt={view.label} 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-[7px] font-black text-white">{view.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* --- INFORMATIONS DU VÉHICULE --- */}
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-black italic uppercase leading-tight text-white mb-2">{carName}</h3>
          {car.id && (
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Référence: {car.id.slice(0,6)}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Prix TTC</span>
            <span className="text-[#ff4d00] text-xl font-black italic">{car.price}</span>
          </div>
          
          <div className="flex gap-2">
            {/* Bouton WhatsApp (Si la fonction existe) */}
            {handleContactAdmin && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleContactAdmin(car);
                }}
                title="Contacter sur WhatsApp"
                className="bg-[#111] border border-white/5 text-green-500 h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] shadow-lg transition-all duration-300"
              >
                <MessageCircle size={20} />
              </button>
            )}

            {/* Bouton Détails (Adapté à ton routage original) */}
            <Link 
              to={`/detail/${car.id}`} 
              title="Voir les détails"
              className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#ff4d00] hover:text-white transition-all duration-300 shadow-lg"
            >
              <LayoutGrid size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}