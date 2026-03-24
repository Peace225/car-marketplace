import React, { useState } from "react";
import { ArrowLeft, Calendar, Gauge, Settings, Car, CheckCircle, MapPin, MessageCircle, Mail } from "lucide-react";
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

// Optimisation Cloudinary
const getOptimizedImage = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('upload/');
  if (parts.length === 2) {
    return `${parts[0]}upload/w_1200,h_800,c_fill,f_auto,q_auto/${parts[1]}`;
  }
  return url;
};

export default function DetailVehicule({ car, onBack }) {
  // L'image principale affichée en grand (par défaut : front)
  const defaultImage = car.images?.front || car.image;
  const [activeImage, setActiveImage] = useState(defaultImage);

  if (!car) return null;

  // --- LOGIQUE DE CONTACT WHATSAPP ---
  const handleContactWhatsApp = async () => {
    try {
      // 1. Sauvegarde du lead dans Firebase
      await addDoc(collection(db, "messages"), {
        carId: car.id,
        carName: `${car.brand || car.marque} ${car.model || car.modele}`,
        carPrice: car.price || car.prix,
        status: "Nouveau (Depuis Page Détails)",
        timestamp: serverTimestamp() 
      });

      // 2. Redirection WhatsApp
      const adminWhatsApp = "2250151104839"; 
      const message = `Bonjour AutoLife, je souhaite finaliser l'achat de la ${car.brand || car.marque} ${car.model || car.modele} affichée à ${car.price || car.prix}.`;
      
      window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');

    } catch (error) {
      console.error("Erreur tracking:", error);
      const adminWhatsApp = "2250151104839"; 
      window.open(`https://wa.me/${adminWhatsApp}`, '_blank');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans pb-20 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header simple avec bouton Retour */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#ff4d00] transition-colors"
          >
            <ArrowLeft size={16} /> Retour au catalogue
          </button>
          <span className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
            AutoLife <span className="text-[#ff4d00]">Market</span>
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne de gauche : Image & Détails */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* GALERIE D'IMAGES */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
                <img 
                  src={getOptimizedImage(activeImage)} 
                  alt={car.modele || car.model} 
                  className="w-full h-full object-cover transition-all duration-500" 
                />
              </div>

              {/* Les 3 miniatures */}
              {car.images && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {[
                    { key: 'front', label: 'Face Avant' },
                    { key: 'back', label: 'Arrière' },
                    { key: 'interior', label: 'Intérieur' }
                  ].map((view) => (
                    car.images[view.key] && (
                      <button 
                        key={view.key}
                        onMouseEnter={() => setActiveImage(car.images[view.key])}
                        onClick={() => setActiveImage(car.images[view.key])}
                        className={`relative w-32 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                          activeImage === car.images[view.key] 
                          ? 'border-[#ff4d00] scale-105 shadow-xl shadow-orange-500/20' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <img 
                          src={getOptimizedImage(car.images[view.key])} 
                          className="w-full h-full object-cover" 
                          alt={view.label} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-2">
                          <span className="text-white text-[8px] font-black uppercase tracking-widest drop-shadow-md">
                            {view.label}
                          </span>
                        </div>
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Titre et Tags */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-[#ff4d00] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/30">
                  {car.offer || 'Formule Gold'}
                </span>
                <span className="bg-[#111] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Véhicule Inspecté
                </span>
                {car.availability && (
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    car.availability === 'Disponible' ? 'bg-green-100 text-green-700' :
                    car.availability === 'En arrivage' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {car.availability}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-1">
                {car.brand || car.marque} <span className="text-[#ff4d00]">{car.model || car.modele}</span>
              </h1>
              <p className="text-sm font-bold text-gray-500 mt-4 leading-relaxed">
                {car.description || "Aucune description technique détaillée pour ce véhicule."}
              </p>
            </div>

            {/* Grille des caractéristiques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-gray-300 transition-colors">
                <Calendar className="text-[#ff4d00] mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Année</span>
                <span className="text-sm font-black text-gray-900 mt-1">{car.year || car.annee}</span>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-gray-300 transition-colors">
                <Gauge className="text-[#ff4d00] mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kilométrage</span>
                <span className="text-sm font-black text-gray-900 mt-1">{car.kilometrage ? car.kilometrage.toLocaleString('fr-FR') : '0'} km</span>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-gray-300 transition-colors">
                <Settings className="text-[#ff4d00] mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Boîte</span>
                <span className="text-sm font-black text-gray-900 mt-1">{car.transmission}</span>
              </div>
              <div className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col items-center text-center hover:border-gray-300 transition-colors">
                <Car className="text-[#ff4d00] mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Énergie</span>
                <span className="text-sm font-black text-gray-900 mt-1">{car.energy || car.energie}</span>
              </div>
            </div>

            {/* Équipements standards */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Équipements & Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Climatisation automatique', 'Caméra de recul', 'Système de Navigation', 'Bluetooth & Multimédia', 'Jantes Alliage', 'Direction assistée'].map((equip) => (
                  <div key={equip} className="flex items-center gap-3">
                    <CheckCircle className="text-[#ff4d00]" size={18} />
                    <span className="text-sm font-bold text-gray-600">{equip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne de droite : Prix et Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl sticky top-24">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix de vente</p>
              <div className="text-4xl md:text-5xl font-black text-[#ff4d00] mb-8 leading-none tracking-tighter">{car.price || car.prix}</div>
              
              <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[1.5rem] mb-8 border border-gray-100">
                <div className="bg-white p-3 rounded-full shadow-sm"><MapPin className="text-[#ff4d00]" size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localisation</p>
                  <p className="text-sm font-black text-gray-800 mt-0.5">{car.location || car.localisation}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleContactWhatsApp}
                  className="w-full bg-[#ff4d00] hover:bg-black text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex justify-center items-center gap-3 shadow-xl shadow-orange-500/30 active:scale-95"
                >
                  <MessageCircle size={20} /> Réserver sur WhatsApp
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-black border-2 border-gray-200 hover:border-black py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex justify-center items-center gap-3">
                  <Mail size={18} /> Contacter par email
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Car size={12} /> Ref AutoLife : {(car.brand || car.marque).substring(0,3).toUpperCase()}{car.id.slice(0,4)}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}