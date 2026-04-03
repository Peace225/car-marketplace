import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; 
import { LayoutGrid, Star, Crown, Diamond, Loader2, MessageCircle, Zap, Truck, MapPin } from 'lucide-react';

const getOptimizedImage = (url) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  const parts = url.split('upload/');
  if (parts.length === 2) {
    return `${parts[0]}upload/w_800,h_600,c_fill,f_auto,q_auto/${parts[1]}`;
  }
  return url;
};

// --- SOUS-COMPOSANT : Carte interactive (Gère Voitures et Engins) ---
const CarCard = ({ item, handleContactAdmin, isEngin = false }) => {
  // Pour les voitures on prend images.front, pour les engins on prend imageUrl
  const displayImage = isEngin ? item.imageUrl : (item.images?.front || item.image);
  
  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#fb201e]/40 transition-all group relative h-full flex flex-col">
      
      {/* Badge Disponibilité (Uniquement pour voitures) */}
      {!isEngin && item.availability && (
        <div className={`absolute top-4 right-4 z-10 text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border ${
          item.availability === 'Disponible' ? 'bg-[#22c55e]/90 text-white border-green-400 animate-pulse' : 
          item.availability === 'En arrivage' ? 'bg-blue-500/80 text-white border-blue-400' : 
          'bg-red-500/80 text-white border-red-400'
        }`}>
          {item.availability === 'Disponible' ? '✅ Dispo de suite' : item.availability}
        </div>
      )}

      {/* Badge Catégorie (Pour les Engins) */}
      {isEngin && (
        <div className="absolute top-4 right-4 z-10 text-[9px] font-black uppercase px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border bg-[#fb201e] text-white border-red-400">
          {item.category}
        </div>
      )}

      <div className="h-72 overflow-hidden relative flex-shrink-0">
        <img 
          src={getOptimizedImage(displayImage)} 
          alt={item.model || item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="bg-black/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1 rounded-full uppercase border border-white/10">
            {isEngin ? item.tonnage : item.brand}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-2xl font-black italic uppercase">{isEngin ? item.name : item.model}</h3>
          <p className="text-white/30 text-[10px] font-bold uppercase flex items-center gap-1">
            {isEngin ? <><MapPin size={10}/> {item.location}</> : `Réf: ${item.id.slice(0,6)}`}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-white/30 text-[8px] font-black uppercase">{isEngin ? "Localisation" : "Prix TTC"}</span>
            <span className="text-[#fb201e] text-xl font-black italic">
               {isEngin ? item.location : (item.price || "Sur Devis")}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleContactAdmin(item, isEngin)} className="bg-[#111] border border-white/5 text-green-500 h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all">
              <MessageCircle size={20} />
            </button>
            {!isEngin && (
              <Link to={`/voiture/${item.id}`} className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center hover:bg-[#fb201e] hover:text-white transition-all">
                <LayoutGrid size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [heavyVehicles, setHeavyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('categorie');
  
  const [activeFilter, setActiveFilter] = useState(categoryFromUrl ? (categoryFromUrl.toUpperCase()) : "Tous");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Voitures
        const carsSnap = await getDocs(collection(db, "cars"));
        setCars(carsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        // Fetch Engins
        const enginsSnap = await getDocs(query(collection(db, "heavy_vehicles"), orderBy("createdAt", "desc")));
        setHeavyVehicles(enginsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) { 
        console.error("Erreur Fetch:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  // --- LOGIQUE SLIDER : Uniquement Voitures Disponibles ---
  const availableCars = useMemo(() => cars.filter(c => c.availability === 'Disponible').slice(0, 8), [cars]);

  useEffect(() => {
    if (availableCars.length === 0) return;
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        else sliderRef.current.scrollBy({ left: 380, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [availableCars]);

  const getNumericPrice = (p) => p ? parseInt(p.replace(/[^0-9]/g, ''), 10) : 0;

  // --- LOGIQUE FILTRAGE DYNAMIQUE ---
  const filteredItems = useMemo(() => {
    if (activeFilter === "ENGIN") return heavyVehicles;
    
    if (activeFilter === "Tous") return cars;

    return cars.filter(car => {
      const price = getNumericPrice(car.price);
      if (activeFilter === "GOLD") return price >= 5000000 && price <= 6500000 || car.offer === "Gold";
      if (activeFilter === "PREMIUM") return price > 6500000 && price <= 10000000 || car.offer === "Premium";
      if (activeFilter === "VIP") return price > 10000000 || car.offer === "VIP";
      return false;
    });
  }, [cars, heavyVehicles, activeFilter]);

  const filters = [
    { name: "Tous", icon: <LayoutGrid size={16} />, desc: "Tout le stock" },
    { name: "GOLD", icon: <Star size={16} fill="currentColor" />, desc: "Budget Moyen" },
    { name: "PREMIUM", icon: <Crown size={16} fill="currentColor" />, desc: "Haut de gamme" },
    { name: "VIP", icon: <Diamond size={16} fill="currentColor" />, desc: "Luxe & Prestige" },
    { name: "ENGIN", icon: <Truck size={16} />, desc: "Poids Lourds" },
  ];

  const handleContactAdmin = (item, isEngin) => {
    const adminWhatsApp = "2250151104839";
    const name = isEngin ? item.name : `${item.brand} ${item.model}`;
    const price = isEngin ? `(Tonnage: ${item.tonnage})` : `(${item.price})`;
    const msg = `Bonjour AutoLife, je souhaiterais des informations sur cet engin/véhicule : ${name} ${price}.`;
    window.open(`https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      <Loader2 className="animate-spin text-[#fb201e] mb-4" size={48} />
      <p className="text-white/20 font-black text-xs uppercase tracking-widest">Initialisation du catalogue...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">
            Nos <span className="text-[#fb201e]">Catalogues</span>
          </h2>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">AutoLife Services • Côte d'Ivoire</p>
        </div>

        {/* SECTION SLIDER : VEHICULES DISPONIBLES */}
        {availableCars.length > 0 && (
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="text-[#22c55e]" size={28} />
              <h3 className="text-2xl font-black italic uppercase">Véhicules <span className="text-[#22c55e]">Disponibles</span></h3>
            </div>
            <div ref={sliderRef} className="flex overflow-x-auto gap-6 pb-8 scroll-smooth no-scrollbar">
              {availableCars.map((car) => (
                <div key={`dispo-${car.id}`} className="min-w-[85vw] sm:min-w-[400px] lg:min-w-[380px] flex-shrink-0">
                  <CarCard item={car} handleContactAdmin={handleContactAdmin} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BARRE DE FILTRES */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-16">
          {filters.map((f) => (
            <button
              key={f.name}
              onClick={() => setActiveFilter(f.name)}
              className={`flex flex-col items-center flex-1 min-w-[110px] max-w-[160px] p-5 rounded-3xl border transition-all duration-300 ${
                activeFilter === f.name 
                ? "bg-[#fb201e] border-[#fb201e] shadow-[0_10px_30px_rgba(251,32,30,0.3)] scale-105" 
                : "bg-[#111] border-white/5 hover:border-white/20"
              }`}
            >
              <span className={`mb-2 ${activeFilter === f.name ? "text-white" : "text-[#fb201e]"}`}>{f.icon}</span>
              <span className="text-[11px] font-black uppercase tracking-widest">{f.name}</span>
              <span className={`text-[8px] font-bold mt-1 uppercase ${activeFilter === f.name ? "text-white/70" : "text-white/30"}`}>{f.desc}</span>
            </button>
          ))}
        </div>

        {/* GRILLE DE RESULTATS */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {filteredItems.map((item) => (
              <CarCard 
                key={item.id} 
                item={item} 
                handleContactAdmin={handleContactAdmin} 
                isEngin={activeFilter === "ENGIN"} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#0a0a0a] rounded-[3rem] border border-white/5">
            <p className="text-white/20 font-black italic text-2xl uppercase">Rien en stock pour <span className="text-[#fb201e]">{activeFilter}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}