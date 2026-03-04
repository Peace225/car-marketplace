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
    { name: "Catalogue", to: "/catalogue" }, 
    { name: "Contact", to: "/contact" },
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
        <h1 className="font-black text-2xl md:text-3xl text-white italic tracking-tighter uppercase leading-none">
          Auto<span className="text-[#fb201e]">Life</span>
        </h1>
      </Link>

      {/* --- MENU DESKTOP --- */}
      <div className="hidden md:flex gap-8 items-center">
        {menuLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="text-[13px] font-black uppercase tracking-[0.2em] text-white hover:text-[#fb201e] transition-colors duration-300"
          >
            {link.name}
          </Link>
        ))}
        <div className="h-5 w-[1px] bg-white/20 mx-2"></div>
        
        <Link 
          to="/register" 
          className="bg-white text-black px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#fb201e] hover:text-white transition-all duration-300 text-center"
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
        {isOpen ? <X size={40} /> : <Menu size={40} />}
      </button>

      {/* --- MENU MOBILE (Plein écran) --- */}
      <div 
        className={`fixed inset-0 bg-black z-[100] flex flex-col p-8 md:hidden transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible delay-300" 
        }`}
      >
        <div className="mt-32 flex flex-col gap-14 overflow-y-auto">
          {menuLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: `${isOpen ? 100 + index * 100 : 0}ms` }}
              className={`text-6xl font-black uppercase italic text-white flex justify-between items-center group transition-all duration-500 transform ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
              }`}
            >
              <span className="group-hover:text-[#fb201e] group-hover:translate-x-3 transition-all duration-300 ease-out">
                {link.name}
              </span>
              <ChevronRight className="text-white/20 group-hover:text-[#fb201e] group-hover:-translate-x-2 transition-all duration-300" size={56} />
            </Link>
          ))}
          
          <div 
            style={{ transitionDelay: `${isOpen ? 400 : 0}ms` }}
            className={`h-[2px] w-full bg-white/10 my-6 origin-left transition-all duration-700 ${
              isOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
          ></div>
          
          <Link 
            to="/register"
            onClick={() => setIsOpen(false)}
            style={{ transitionDelay: `${isOpen ? 500 : 0}ms` }}
            className={`w-full bg-[#fb201e] text-white py-8 rounded-2xl text-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/30 active:scale-95 transition-all duration-500 text-center transform ${
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