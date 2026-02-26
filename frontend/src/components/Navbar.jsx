import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // --- BLOQUER LE SCROLL QUAND LE MENU EST OUVERT ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuLinks = [
    { name: "Accueil", to: "/" },
    { name: "Vente", to: "/vente" },
    { name: "Location", to: "/location" },
  ];

  return (
    <nav className="bg-black py-4 px-6 flex justify-between items-center border-b border-white/5 sticky top-0 z-[100]">
      
      {/* --- LOGO --- */}
      <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-4 group relative z-[110]">
        <div className="transition-transform duration-300 group-hover:scale-105">
          <img 
            src="/images/logo-life.png" 
            alt="AutoLife Logo" 
            className="w-16 h-16 object-contain" 
          />
        </div>
        <h1 className="font-black text-2xl text-white italic tracking-tighter uppercase leading-none">
          Auto<span className="text-[#fb201e]">Life</span>
        </h1>
      </Link>

      {/* --- MENU DESKTOP --- */}
      <div className="hidden md:flex gap-6 items-center">
        {menuLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#fb201e] transition-colors duration-300"
          >
            {link.name}
          </Link>
        ))}
        <div className="h-4 w-[1px] bg-white/20 mx-2"></div>
        
        {/* BOUTON CONNECTÉ AU REGISTER */}
        <Link 
          to="/register" 
          className="bg-white text-black px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#fb201e] hover:text-white transition-all duration-300 text-center"
        >
          S'identifier
        </Link>
      </div>

      {/* --- BOUTON BURGER MOBILE --- */}
      <button 
        className="md:hidden text-white relative z-[110] p-2 hover:text-[#fb201e] transition-colors duration-300" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* --- MENU MOBILE (Plein écran) --- */}
      <div 
        className={`fixed inset-0 bg-black z-[100] flex flex-col p-8 md:hidden transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible delay-300" 
        }`}
      >
        <div className="mt-32 flex flex-col gap-10 overflow-y-auto">
          {menuLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsOpen(false)}
              // Délai progressif pour l'animation en cascade
              style={{ transitionDelay: `${isOpen ? 100 + index * 100 : 0}ms` }}
              className={`text-4xl font-black uppercase italic text-white flex justify-between items-center group transition-all duration-500 transform ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              {/* Le texte se décale au survol */}
              <span className="group-hover:text-[#fb201e] group-hover:translate-x-3 transition-all duration-300 ease-out">
                {link.name}
              </span>
              {/* Le chevron réagit au survol */}
              <ChevronRight className="text-white/10 group-hover:text-[#fb201e] group-hover:-translate-x-2 transition-all duration-300" size={36} />
            </Link>
          ))}
          
          {/* Ligne de séparation qui s'étire */}
          <div 
            style={{ transitionDelay: `${isOpen ? 400 : 0}ms` }}
            className={`h-[1px] w-full bg-white/10 my-2 origin-left transition-all duration-700 ${
              isOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
          ></div>
          
          {/* BOUTON MOBILE CONNECTÉ AU REGISTER */}
          <Link 
            to="/register"
            onClick={() => setIsOpen(false)}
            style={{ transitionDelay: `${isOpen ? 500 : 0}ms` }}
            className={`w-full bg-[#fb201e] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 active:scale-95 transition-all duration-500 text-center transform ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            S'identifier
          </Link>
        </div>
      </div>
    </nav>
  );
}