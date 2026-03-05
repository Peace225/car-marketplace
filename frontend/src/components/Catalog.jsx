import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
// AJOUT : importation de addDoc et serverTimestamp pour le tracking
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'; 
// AJOUT : importation de MessageCircle pour l'icône WhatsApp
import { LayoutGrid, Star, Crown, Diamond, Loader2, MessageCircle } from 'lucide-react';

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setCars(carsData);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // --- LOGIQUE DE FILTRAGE ---
  const getNumericPrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  };

  const filteredCars = cars.filter(car => {
    const price = getNumericPrice(car.price);
    if (activeFilter === "Tous") return true;
    if (activeFilter === "Gold") return price >= 5000000 && price <= 6500000;
    if (activeFilter === "Premium") return price > 6500000 && price <= 10000000;
    if (activeFilter === "VIP") return price > 10000000;
    return true;
  });

  const filters = [
    { name: "Tous", icon: <LayoutGrid size={16} />, desc: "Tout le stock" },
    { name: "Gold", icon: <Star size={16} />, desc: "5 - 6.5M" },
    { name: "Premium", icon: <Crown size={16} />, desc: "7 - 10M" },
    { name: "VIP", icon: <Diamond size={16} />, desc: "11M et +" },
  ];

  // --- LOGIQUE DE TRACKING & WHATSAPP ---
  const handleContactAdmin = async (car) => {
    try {
      // 1. Enregistrement silencieux du Lead dans Firebase
      await addDoc(collection(db, "messages"), {
        carId: car.id,
        carName: `${car.brand} ${car.model}`,
        carPrice: car.price,
        status: "Nouveau",
        timestamp: serverTimestamp() // Heure exacte du clic
      });

      // 2. Redirection vers WhatsApp
      const adminWhatsApp = "2250151104839"; 
      const message = `Bonjour AutoLife, je suis très intéressé par la ${car.brand} ${car.model} affichée à ${car.price}. Est-elle toujours disponible ?`;
      
      const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error("Erreur de tracking du lead:", error);
      // En cas d'erreur de connexion, on redirige quand même le client !
      const adminWhatsApp = "2250151104839"; 
      window.open(`https://wa.me/${adminWhatsApp}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#fb201e] mb-4" size={48} />
        <p className="text-white/20 uppercase font-black text-xs tracking-widest">Chargement du parc...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Titre */}
        <div className="flex flex-col items-center text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
            Nos <span className="text-[#fb201e]">Catalogues</span>
          </h2>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] md:text-[12px] font-black">
            Sélectionnez votre niveau de privilège
          </p>
          <div className="w-16 h-1 bg-[#fb201e] mt-6 rounded-full shadow-[0_0_20px_rgba(251,32,30,0.6)]"></div>
        </div>

        {/* --- BARRE DE FILTRES --- */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-16">
          {filters.map((f) => (
            <button
              key={f.name}
              onClick={() => setActiveFilter(f.name)}
              className={`flex flex-col items-center min-w-[100px] md:min-w-[140px] p-4 rounded-2xl border transition-all duration-300 ${
                activeFilter === f.name 
                ? "bg-[#fb201e] border-[#fb201e] shadow-[0_0_25px_rgba(251,32,30,0.3)] scale-105" 
                : "bg-[#111] border-white/5 hover:border-white/20"
              }`}
            >
              <span className={`mb-2 ${activeFilter === f.name ? "text-white" : "text-[#fb201e]"}`}>
                {f.icon}
              </span>
              <span className="text-[12px] font-black uppercase tracking-widest leading-none">{f.name}</span>
              <span className={`text-[8px] font-bold mt-1 uppercase ${activeFilter === f.name ? "text-white/70" : "text-white/30"}`}>
                {f.desc}
              </span>
            </button>
          ))}
        </div>

        {/* --- GRILLE DE VOITURES --- */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#fb201e]/40 transition-all group">
                {/* Image */}
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={car.image} 
                    alt={car.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase border border-white/10">
                      {car.brand}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black italic uppercase leading-none">{car.model}</h3>
                      <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Référence: {car.id.slice(0,6)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-white/30 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Prix TTC</span>
                      <span className="text-[#fb201e] text-xl font-black italic">{car.price}</span>
                    </div>
                    
                    {/* BOUTONS D'ACTION */}
                    <div className="flex gap-2">
                      {/* Nouveau Bouton WhatsApp/Tracking */}
                      <button 
                        onClick={() => handleContactAdmin(car)}
                        title="Contacter sur WhatsApp"
                        className="bg-[#111] border border-white/5 text-green-500 h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] shadow-lg transition-all duration-300"
                      >
                        <MessageCircle size={20} />
                      </button>

                      {/* Bouton Détails Existant */}
                      <Link 
                        to={`/voiture/${car.id}`} 
                        title="Voir les détails"
                        className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#fb201e] hover:text-white transition-all duration-300 shadow-lg"
                      >
                        <LayoutGrid size={20} />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-[#0a0a0a] rounded-[3rem] border border-white/5">
            <p className="text-white/20 font-black italic uppercase tracking-tighter text-2xl">
              Aucun véhicule <span className="text-[#fb201e]">{activeFilter}</span> disponible
            </p>
          </div>
        )}

      </div>
    </div>
  );
}