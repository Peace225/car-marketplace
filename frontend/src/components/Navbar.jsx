import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronRight, Phone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

  // Suppression du lien Contact
  const menuLinks = [
    { name: "Catalogue", to: "/catalogue" },
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
        <h1 className="font-black text-2xl md:text-4xl text-white italic tracking-tighter uppercase leading-none">
          Auto<span className="text-[#fb201e]">Life</span>
        </h1>
      </Link>

      {/* --- MENU DESKTOP --- */}
      <div className="hidden md:flex gap-8 items-center">
        {menuLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="text-[14px] font-black uppercase tracking-[0.2em] text-white hover:text-[#fb201e] transition-colors duration-300"
          >
            {link.name}
          </Link>
        ))}
        <div className="h-5 w-[1px] bg-white/20 mx-2"></div>
        
        {/* Remplacement de S'identifier par Service Client */}
        <a 
          href="tel:+2250104" 
          className="bg-white text-black px-10 py-4 rounded-full text-[14px] font-black uppercase tracking-widest hover:bg-[#fb201e] hover:text-white transition-all duration-300 text-center flex items-center gap-2"
        >
          <Phone size={16} />
         +225 0151 10 48 39
        </a>
      </div>

      {/* --- BOUTON BURGER --- */}
      <button 
        className="md:hidden text-white relative z-[110] p-2" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={48} /> : <Menu size={48} />}
      </button>

      {/* --- MENU MOBILE PLEIN ÉCRAN --- */}
      <div 
        className={`fixed inset-0 bg-black z-[100] flex flex-col p-6 md:hidden transition-all duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible" 
        }`}
      >
        <div className="mt-32 flex flex-col gap-8">
          {menuLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${isOpen ? 100 + index * 100 : 0}ms` }}
              className={`text-[18vw] font-black uppercase italic text-white flex justify-between items-center group transition-all duration-500 transform ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <span className="leading-[0.9] tracking-tighter">
                {link.name}
              </span>
              <ChevronRight size={70} className="text-[#fb201e] opacity-90" />
            </Link>
          ))}
          
          <div className="h-[3px] w-full bg-white/10 my-6"></div>
          
          {/* Bouton Appel Mobile XL */}
          <a 
            href="tel:+2250104"
            onClick={() => setIsOpen(false)}
            style={{ transitionDelay: `${isOpen ? 400 : 0}ms` }}
            className={`w-full bg-[#fb201e] text-white py-10 rounded-2xl text-4xl font-black uppercase italic tracking-tighter shadow-2xl shadow-red-600/50 transition-all duration-500 text-center flex items-center justify-center gap-4 transform ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
            }`}
          >
            <Phone size={40} />
            +225 0151 10 48 39
          </a>
        </div>
      </div>
    </nav>
  );
}