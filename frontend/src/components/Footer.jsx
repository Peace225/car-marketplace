import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-12 pb-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Colonne 1 : Branding */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/logo-life.png" alt="AutoLife" className="w-8 h-8 object-contain" />
              <span className="font-black text-lg italic uppercase tracking-tighter">
                Auto<span className="text-[#fb201e]">Life</span>
              </span>
            </Link>
            <p className="text-gray-500 text-[9px] font-bold leading-relaxed uppercase tracking-widest max-w-[200px]">
              L'excellence automobile. Vente, location et expertise.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-7 h-7 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#fb201e] transition-all group">
                  <Icon size={12} className="text-gray-500 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2 : Liens (Police réduite à text-[9px]) */}
          <div>
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-[#fb201e] mb-5">Navigation</h4>
            <ul className="space-y-3">
              {["Accueil", "Vente", "Location", "Expertise"].map((item) => (
                <li key={item}>
                  <Link to={`/${item.toLowerCase()}`} className="text-[9px] font-bold text-gray-500 hover:text-white flex items-center gap-2 group uppercase tracking-widest transition-colors">
                    <ChevronSmallRight className="group-hover:translate-x-0.5 transition-transform" /> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Support */}
          <div>
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-[#fb201e] mb-5">Légal</h4>
            <ul className="space-y-3">
              {["Contact", "FAQ", "Mentions", "Confidentialité"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-[9px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Contact (Police réduite) */}
          <div>
            <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-[#fb201e] mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                <MapPin size={12} className="text-[#fb201e]" /> Abidjan, CI
              </li>
              <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                <Phone size={12} className="text-[#fb201e]" /> +225 07 00 00 00
              </li>
              <li className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest underline decoration-[#fb201e]/30">
                <Mail size={12} className="text-[#fb201e]" /> contact@autolife.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bas du Footer (Ultra discret) */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[7px] font-black text-gray-700 uppercase tracking-[0.4em]">
            © {currentYear} AutoLife — Excellence Automobile.
          </p>
          <div className="flex gap-4 opacity-10 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function ChevronSmallRight({ className }) {
  return (
    <svg className={className} width="4" height="6" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}