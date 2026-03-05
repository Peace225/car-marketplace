import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Check, MessageCircle, Loader2 } from 'lucide-react';

// Firebase Imports
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const docRef = doc(db, "cars", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCar({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Erreur de récupération :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // --- FONCTION DE CONTACT & ENREGISTREMENT LEAD ---
  const handleContactWhatsApp = async () => {
    if (!car) return;

    setIsSending(true);
    // ⚠️ Remplace par ton vrai numéro ou récupère-le depuis les paramètres Firebase
    const phoneNumber = "2250151104839";
    const messageText = `Bonjour AutoLife ! 🚘\nJe suis intéressé par la ${car.brand} ${car.model} affichée à ${car.price}.\nPouvez-vous me donner plus d'infos ?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;

    try {
      // 1. On crée une trace "Lead" dans Firebase pour l'Admin
      await addDoc(collection(db, "messages"), {
        carId: id,
        carName: `${car.brand} ${car.model}`,
        carPrice: car.price,
        status: "Nouveau",
        timestamp: serverTimestamp(), // Heure du serveur Firebase
      });

      // 2. On redirige vers WhatsApp
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Erreur lors de l'envoi du signal :", error);
      // En cas d'erreur réseau, on ouvre quand même WhatsApp pour ne pas perdre le client
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#fb201e] mb-4" size={48} />
        <p className="text-white/20 uppercase font-black text-[10px] tracking-[0.3em]">Chargement des détails...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-black italic uppercase mb-6 tracking-tighter">Véhicule <span className="text-[#fb201e]">Vendu</span> ou Inexistant</h2>
        <Link to="/catalogue" className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#fb201e] hover:text-white transition-all">
          Retour au stock
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <Link to="/catalogue" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-10 text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> Revenir au catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Galerie / Image */}
          <div className="relative group">
            <div className="aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden border border-white/5 bg-[#111] shadow-2xl">
              <img 
                src={car.image} 
                alt={car.model} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 shadow-lg">
              <span className={`text-[10px] font-black uppercase tracking-widest ${car.type === 'Vente' ? 'text-white' : 'text-[#fb201e]'}`}>
                {car.type}
              </span>
            </div>
          </div>

          {/* Informations Techniques */}
          <div className="flex flex-col h-full justify-center animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
                {car.brand}
              </h1>
              <h2 className="text-3xl md:text-4xl font-light text-white/40 tracking-tight">
                {car.model}
              </h2>
            </div>

            <div className="w-20 h-1.5 bg-[#fb201e] mb-10 shadow-[0_0_15px_rgba(251,32,30,0.5)]"></div>

            <p className="text-lg text-white/60 leading-relaxed mb-10 font-medium">
              {car.description}
            </p>

            {/* --- NOUVEAU : Grille des caractéristiques --- */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Année</span>
                <span className="text-white font-bold text-sm uppercase">{car.year || 'N/A'}</span>
              </div>
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Localisation</span>
                <span className="text-white font-bold text-sm uppercase">{car.location || 'N/A'}</span>
              </div>
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Énergie</span>
                <span className="text-white font-bold text-sm uppercase">{car.energy || 'N/A'}</span>
              </div>
              <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">Boîte</span>
                <span className="text-white font-bold text-sm uppercase">{car.transmission || 'N/A'}</span>
              </div>
            </div>

            <div className="mb-12">
              <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Prix de vente conseillé</span>
              <span className="text-5xl md:text-6xl font-black italic text-white tracking-tighter">
                {car.price}
              </span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleContactWhatsApp}
                disabled={isSending}
                className="bg-[#25D366] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all shadow-xl shadow-green-600/10 active:scale-95 disabled:opacity-50 border border-transparent hover:border-white/20"
              >
                {isSending ? <Loader2 className="animate-spin" size={18} /> : <MessageCircle size={18} />}
                Négocier sur WhatsApp
              </button>

              <button 
                onClick={handleCopyLink}
                className={`py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 border transition-all active:scale-95 ${
                  copied ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-white hover:bg-white hover:text-black'
                }`}
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                {copied ? "Lien Copié" : "Partager Fiche"}
              </button>
            </div>
            
            <p className="mt-6 text-[9px] font-bold text-white/20 uppercase tracking-widest text-center sm:text-left">
              Référence véhicule : <span className="text-white/40">{car.id.toUpperCase()}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}