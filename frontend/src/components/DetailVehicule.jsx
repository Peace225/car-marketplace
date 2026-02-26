import React from "react";
import { ArrowLeft, Calendar, Gauge, Settings, Car, CheckCircle, MapPin, Phone, Mail } from "lucide-react";

export default function DetailVehicule({ car, onBack }) {
  if (!car) return null;

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans pb-20 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header simple avec bouton Retour */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Retour aux résultats
          </button>
          <span className="font-black text-xs uppercase tracking-widest">CAR MARKET</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne de gauche : Image & Détails */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image principale */}
            <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-lg border border-gray-100">
              <img src={car.image} alt={car.modele} className="w-full h-full object-cover" />
            </div>

            {/* Titre et Tags */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="bg-[#ff4d00]/10 text-[#ff4d00] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Véhicule Inspecté</span>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Garantie 12 mois</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-1">
                {car.marque} <span className="text-[#ff4d00]">{car.modele}</span>
              </h1>
            </div>

            {/* Grille des caractéristiques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <Calendar className="text-gray-400 mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Année</span>
                <span className="text-sm font-black">{car.annee}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <Gauge className="text-gray-400 mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kilométrage</span>
                <span className="text-sm font-black">{car.kilometrage.toLocaleString('fr-FR')} km</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <Settings className="text-gray-400 mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Boîte</span>
                <span className="text-sm font-black">{car.transmission}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <Car className="text-gray-400 mb-2" size={24} />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Énergie</span>
                <span className="text-sm font-black">{car.energie}</span>
              </div>
            </div>

            {/* Équipements */}
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Équipements & Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['GPS Navigation', 'Caméra de recul', 'Sièges chauffants', 'Bluetooth', 'Régulateur adaptatif', 'Jantes alliage', 'Phares LED', 'Climatisation auto'].map((equip) => (
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
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl sticky top-24">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix TTC</p>
              <div className="text-4xl md:text-5xl font-black text-[#ff4d00] mb-6 leading-none">{car.prix}</div>
              
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
                <MapPin className="text-gray-400" size={24} />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localisation</p>
                  <p className="text-sm font-black">{car.localisation}, France</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#ff4d00] hover:bg-black text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-lg shadow-orange-500/30">
                  <Phone size={16} /> Appeler le vendeur
                </button>
                <button className="w-full bg-white hover:bg-gray-50 text-black border-2 border-gray-200 hover:border-black py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2">
                  <Mail size={16} /> Envoyer un message
                </button>
              </div>
              
              <p className="text-center text-[9px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
                Référence : {car.marque.substring(0,3).toUpperCase()}{car.id}2026
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}