import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Calendar, Gauge, Settings, Car, CheckCircle, 
  MapPin, MessageCircle, Mail, Share2, ShieldCheck, Info 
} from "lucide-react";
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

const getOptimizedImage = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('upload/');
  return parts.length === 2 ? `${parts[0]}upload/w_1200,h_800,c_fill,f_auto,q_auto/${parts[1]}` : url;
};

const formatPrice = (price) => {
  if (typeof price === 'string' && price.includes('FCFA')) return price;
  const num = parseInt(price);
  return isNaN(num) ? price : new Intl.NumberFormat('fr-FR').format(num) + " FCFA";
};

export default function DetailVehicule({ car, onBack }) {
  const defaultImage = car.images?.front || car.image;
  const [activeImage, setActiveImage] = useState(defaultImage);

  useEffect(() => { window.scrollTo(0, 0); }, [car]);

  if (!car) return null;

  const carTitle = `${car.brand || car.marque} ${car.model || car.modele}`;
  const carPriceFormatted = formatPrice(car.price || car.prix);

  const handleContactWhatsApp = async () => {
    try {
      await addDoc(collection(db, "messages"), {
        carId: car.id,
        carName: carTitle,
        carPrice: carPriceFormatted,
        source: "Mobile Details",
        timestamp: serverTimestamp() 
      });
      window.open(`https://wa.me/2250151104839?text=${encodeURIComponent(`Bonjour AutoLife, je suis intéressé par la ${carTitle} (${carPriceFormatted}).`)}`, '_blank');
    } catch (error) {
      window.open(`https://wa.me/2250151104839`, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: carTitle, text: `Découvrez cette ${carTitle}`, url: window.location.href });
      } catch (err) { console.log(err); }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfc] font-sans pb-32 lg:pb-24 animate-in fade-in duration-500">
      
      {/* HEADER : Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <ArrowLeft size={18} /> <span className="hidden sm:inline">Retour</span>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="p-2 bg-gray-50 rounded-full sm:hidden"><Share2 size={18}/></button>
            <span className="font-black text-[11px] uppercase tracking-tighter">AutoLife<span className="text-[#ff4d00]"> Market</span></span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-4 md:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* GAUCHE: VISUELS ET INFOS */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* GALERIE PHOTO : Taille adaptée mobile */}
            <div className="relative group">
              <div className="w-full h-[280px] sm:h-[400px] md:h-[550px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-xl bg-gray-200">
                <img 
                  key={activeImage}
                  src={getOptimizedImage(activeImage)} 
                  alt={carTitle}
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"; }}
                />
              </div>
              
              {/* Miniatures horizontales scrollables sur mobile */}
              {car.images && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar lg:absolute lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 lg:bg-white/20 lg:backdrop-blur-lg lg:p-2 lg:rounded-3xl lg:border lg:border-white/30">
                   {['front', 'back', 'interior'].map((key) => car.images[key] && (
                     <button 
                       key={key}
                       onClick={() => setActiveImage(car.images[key])}
                       className={`w-20 h-14 md:w-16 md:h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === car.images[key] ? 'border-[#ff4d00] scale-105' : 'border-transparent opacity-60'}`}
                     >
                       <img src={getOptimizedImage(car.images[key])} className="w-full h-full object-cover" />
                     </button>
                   ))}
                </div>
              )}
            </div>

            {/* EN-TÊTE INFOS : Hiérarchie visuelle mobile */}
            <div className="flex flex-col gap-2 md:gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#ff4d00]/10 text-[#ff4d00] px-3 py-1 rounded-full text-[9px] font-black uppercase italic border border-[#ff4d00]/20">Exclusivité</span>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-green-100">Disponible</span>
              </div>
              <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-tight">
                {car.brand || car.marque} <span className="text-[#ff4d00]">{car.model || car.modele}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 py-3 border-y border-gray-100">
                 <div className="flex items-center gap-1.5"><MapPin size={14}/> <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{car.location || car.localisation}</span></div>
                 <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-blue-500"/> <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Garantie incluse</span></div>
              </div>
            </div>

            {/* GRILLE TECHNIQUE : 2 colonnes sur mobile */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                { icon: <Calendar size={20}/>, label: "Année", val: car.year || car.annee },
                { icon: <Gauge size={20}/>, label: "Kilométrage", val: `${(car.kilometrage || 0).toLocaleString()} km` },
                { icon: <Settings size={20}/>, label: "Boîte", val: car.transmission || "Auto" },
                { icon: <Car size={20}/>, label: "Énergie", val: car.energy || car.energie }
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 md:p-6 rounded-[1.2rem] md:rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="text-[#ff4d00] mb-2">{item.icon}</div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                  <p className="text-xs md:text-sm font-black text-black mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
               <h3 className="text-md font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                 <Info size={18} className="text-[#ff4d00]"/> Note technique
               </h3>
               <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                 {car.description || "Véhicule d'exception rigoureusement sélectionné. État mécanique irréprochable et suivi d'entretien complet."}
               </p>
            </div>
          </div>

          {/* DROITE: PRIX ET ACTION (Masqué ou adapté sur mobile) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-4 md:space-y-6">
              {/* Bloc Prix principal (Visible sur Desktop, allégé sur mobile) */}
              <div className="bg-black p-6 md:p-8 rounded-[1.5rem] md:rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Prix de vente</p>
                <div className="text-3xl md:text-5xl font-black text-[#ff4d00] mb-6 md:mb-8 tracking-tighter">
                  {carPriceFormatted}
                </div>

                <div className="hidden lg:flex flex-col gap-4">
                  <button onClick={handleContactWhatsApp} className="w-full bg-[#ff4d00] py-5 rounded-2xl text-xs font-black uppercase flex justify-center items-center gap-3 shadow-xl shadow-orange-500/20">
                    <MessageCircle size={20} /> Réserver maintenant
                  </button>
                  <button className="w-full bg-white/10 py-5 rounded-2xl text-xs font-black uppercase border border-white/10">
                    <Mail size={18} /> Demander un essai
                  </button>
                </div>
              </div>

              {/* Simulation financement mobile-friendly */}
              <div className="bg-gray-100 p-5 rounded-[1.2rem] md:rounded-[2rem] border border-gray-200/50">
                 <p className="text-[9px] font-black uppercase tracking-widest mb-2 text-gray-400 text-center">Estimation Crédit</p>
                 <p className="text-xl md:text-2xl font-black text-gray-800 text-center">~ 250 000 <span className="text-[10px]">FCFA/mois</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* BARRE DE CONTACT MOBILE FIXE (UX Optimisée) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-4 z-[100] flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        <a href="tel:2250151104839" className="w-14 h-14 bg-gray-100 text-black flex items-center justify-center rounded-2xl active:scale-90 transition-transform">
          <Mail size={22}/>
        </a>
        <button onClick={handleContactWhatsApp} className="flex-1 bg-[#ff4d00] text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-95 transition-transform">
          <MessageCircle size={20}/> Discuter sur WhatsApp
        </button>
      </div>

    </div>
  );
}