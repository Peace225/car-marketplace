import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carsData } from '../data/cars';
// import { ArrowLeft, Share2, Check, MessageCircle } from 'lucide-react'; // Change 'Phone' par 'MessageCircle' si tu as lucide-react

export default function CarDetails() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  
  // Recherche de la voiture correspondante
  const car = carsData.find((c) => c.id === id);

  // --- CONFIGURATION WHATSAPP ---
  // Remplace par ton vrai numéro de téléphone (au format international, sans le '+')
  // Exemple pour la Côte d'Ivoire : "2250102030405"
  const phoneNumber = "2250000000000"; 
  
  // Le message pré-rempli qui inclut les détails de la voiture
  const whatsappMessage = `Bonjour l'équipe AutoLife ! 🚘\n\nJe suis intéressé par ce véhicule que j'ai vu sur votre catalogue :\n\n▪️ Marque : ${car?.brand}\n▪️ Modèle : ${car?.model}\n▪️ Offre : ${car?.type}\n▪️ Prix : ${car?.price}\n\nPouvez-vous me donner plus de détails ?`;
  
  // On encode le message pour qu'il soit compatible avec une URL (remplace les espaces par %20, etc.)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // Fonction pour copier le lien actuel dans le presse-papier
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-4xl font-black italic uppercase mb-6">Véhicule <span className="text-[#fb201e]">Introuvable</span></h2>
        <Link 
          to="/catalogue" 
          className="bg-white text-black px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#fb201e] hover:text-white transition-all duration-300"
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Bouton Retour */}
        <Link 
          to="/catalogue" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-[#fb201e] transition-colors duration-300 mb-8 font-bold uppercase tracking-widest text-xs"
        >
          {/* <ArrowLeft size={16} /> */} ← Retour au catalogue
        </Link>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne Gauche : Image */}
          <div className="relative h-[400px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 group">
            <img 
              src={car.image} 
              alt={`${car.brand} ${car.model}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs font-black uppercase tracking-widest py-2 px-6 rounded-full">
              <span className={car.type === "Vente" ? "text-white" : "text-[#fb201e]"}>
                {car.type}
              </span>
            </div>
          </div>

          {/* Colonne Droite : Informations */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-2">
                {car.brand}
              </h1>
              <h2 className="text-3xl md:text-4xl font-light text-white/70">
                {car.model}
              </h2>
            </div>

            <div className="w-24 h-1 bg-[#fb201e]"></div>

            <p className="text-lg text-white/60 leading-relaxed">
              {car.description}
            </p>

            <div className="text-4xl md:text-5xl font-black text-[#fb201e] my-4">
              {car.price}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              
              {/* NOUVEAU BOUTON WHATSAPP */}
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] hover:bg-[#128C7E] transition-colors duration-300 flex justify-center items-center gap-2"
              >
                {/* <MessageCircle size={18} /> */} Contacter sur WhatsApp
              </a>
              
              <button 
                onClick={handleCopyLink}
                className={`flex-1 py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 flex justify-center items-center gap-2 border ${
                  copied 
                    ? "bg-green-600 border-green-600 text-white" 
                    : "bg-transparent border-white/20 text-white hover:bg-white hover:text-black"
                }`}
              >
                {copied ? (
                  <>
                    {/* <Check size={18} /> */} Lien Copié !
                  </>
                ) : (
                  <>
                    {/* <Share2 size={18} /> */} Partager
                  </>
                )}
              </button>
            </div>

            <p className="text-center sm:text-left text-xs text-white/30 mt-2">
              Envoyez ce lien directement à vos clients pour qu'ils accèdent à cette fiche.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}