import React, { useState, useRef } from "react";
import { Car, Tag, Key, MapPin, Calendar, Clock, Search, ChevronDown, ChevronRight } from "lucide-react";

import DetailVehicule from "../components/DetailVehicule";
import Offres from "../components/Offres";
import SectionPopulaires from "../components/SectionPopulaires";
import ListeOffreVehicules from "../components/ListeOffreVehicules";
import ExitPopup from "../components/ExitPopup"; 
import WhatsAppChat from "../components/WhatsAppChat";

const mockCars = [
  { id: 1, marque: "BMW", modele: "Série 3", annee: 2023, kilometrage: 15000, energie: "Essence", localisation: "Abidjan", prix: "45 000 FCFA", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800" },
  { id: 2, marque: "Tesla", modele: "Model 3", annee: 2024, kilometrage: 8000, energie: "Électrique", localisation: "Bassam", prix: "42 900 FCFA", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800" },
  { id: 3, marque: "Toyota", modele: "Land Cruiser", annee: 2022, kilometrage: 25000, energie: "Diesel", localisation: "Abidjan", prix: "65 000 FCFA", image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800" }
];

export default function Accueil() {
  const [activeTab, setActiveTab] = useState("Voitures neuves");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const resultsRef = useRef(null);

  const [selections, setSelections] = useState({ Marques: "", Modèles: "", Localisation: "", Energie: "" });
  const [year, setYear] = useState(2026);
  const [budget, setBudget] = useState(50000000);

  const [rentalLocation, setRentalLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [passengerCount, setPassengerCount] = useState("5");
  const [withDriver, setWithDriver] = useState("Sans chauffeur");
  const [quantity, setQuantity] = useState(1);
  const [zone, setZone] = useState("Abidjan");

  const isRental = activeTab === "A louer";

  const dropdownData = {
    Marques: ["BMW", "Audi", "Mercedes", "Porsche", "Tesla", "Toyota", "Peugeot"],
    Modèles: ["Série 3", "A4", "Classe C", "Model 3", "Land Cruiser", "208"],
    Localisation: ["Abidjan", "Bouake", "San Pedro", "Yamoussoukro", "Bassam", "Assinie"],
    Energie: ["Essence", "Diesel", "Électrique", "Hybride"]
  };

  const handleSearch = () => {
    const results = mockCars.filter(car => {
      let match = true;
      if (selections.Marques && car.marque !== selections.Marques) match = false;
      if (selections.Localisation && car.localisation !== selections.Localisation) match = false;
      return match;
    });
    setSearchResults(results);
    setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  };

  const CarCard = ({ car }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img src={car.image} alt={car.modele} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-black text-black uppercase">{car.localisation}</div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-sm font-black uppercase leading-tight">{car.marque} {car.modele}</h3>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{car.energie}</p>
            </div>
            <div className="text-sm font-black text-[#ff4d00]">{car.prix}</div>
          </div>
        </div>
        <button onClick={() => { setSelectedCar(car); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full bg-gray-50 hover:bg-black text-black hover:text-white border border-gray-200 font-black text-[9px] py-2 rounded-lg transition-all uppercase flex items-center justify-center gap-1.5 mt-2">
          Voir détails <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );

  const InteractiveSlider = ({ label, min, max, step, value, onChange, formatValue }) => (
    <div className="flex flex-col justify-center px-2.5 py-1.5 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-black text-black">{formatValue(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-full appearance-none accent-[#ff4d00] cursor-pointer" />
    </div>
  );

  if (selectedCar) return <DetailVehicule car={selectedCar} onBack={() => setSelectedCar(null)} />;
  if (selectedOffre) return <ListeOffreVehicules offre={selectedOffre} onBack={() => setSelectedOffre(null)} allCars={mockCars} CarCard={CarCard} />;

  return (
    <div className="w-full font-sans bg-white antialiased min-h-screen">
      
      {/* Hero Section
        Ajout de 'animate-drive' pour faire bouger le background
      */}
      <div 
        className="relative flex flex-col items-center px-4 min-h-[500px] pt-24 bg-no-repeat bg-[length:110%_auto] animate-drive"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center mb-6 text-white">
          <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter leading-none drop-shadow-2xl">
            L'EXCELLENCE <br/><span className="text-[#ff4d00]">À CHAQUE VIRAGE</span>
          </h1>
        </div>

        {/* Formulaire Réduit 
          Passage de max-w-[850px] à max-w-[650px]
          Réduction des padding (p-5 -> p-4)
        */}
        <div className="relative z-20 w-full max-w-[650px] bg-white rounded-xl shadow-2xl p-4 mb-10">
          
          <div className="flex flex-wrap gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit mx-auto sm:mx-0">
            {["Voitures neuves", "Voitures d'occasion", "A louer"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setSearchResults(null); }}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all ${activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {!isRental ? (
            <div className="space-y-3 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                {['Marques', 'Modèles', 'Localisation', 'Energie'].map((filter) => (
                  <div key={filter} className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === filter ? null : filter)}
                      className="w-full bg-gray-50 rounded-md py-2 px-2 flex justify-between items-center text-[8px] font-black border border-transparent hover:border-gray-200"
                    >
                      <span className="truncate">{selections[filter] || filter}</span>
                      <ChevronDown size={10} />
                    </button>
                    {activeDropdown === filter && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border shadow-xl rounded-lg z-50 max-h-40 overflow-y-auto">
                        {dropdownData[filter].map(item => (
                          <button key={item} onClick={() => { setSelections({...selections, [filter]: item}); setActiveDropdown(null); }} className="w-full text-left px-3 py-1.5 text-[9px] font-bold hover:bg-[#ff4d00] hover:text-white">
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <InteractiveSlider label="Année Min." min={2010} max={2026} step={1} value={year} onChange={setYear} formatValue={v => v} />
                <InteractiveSlider label="Budget Max" min={5} max={150} step={5} value={budget/1000000} onChange={v => setBudget(v*1000000)} formatValue={v => `${v}M FCFA`} />
              </div>
              <button onClick={handleSearch} className="w-full bg-black hover:bg-[#ff4d00] text-white font-black py-2.5 rounded-lg text-[10px] flex items-center justify-center gap-1.5 uppercase tracking-widest mt-1">
                <Search size={12} /> Afficher
              </button>
            </div>
          ) : (
            <div className="space-y-2 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50/50">
                  <MapPin className="text-[#ff4d00]" size={14} />
                  <div className="flex-1">
                    <label className="block text-[6px] font-black text-gray-400 uppercase">Prise en charge</label>
                    <input type="text" value={rentalLocation} onChange={(e) => setRentalLocation(e.target.value)} placeholder="Ville..." className="w-full outline-none font-bold bg-transparent text-[9px]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50/50">
                  <div className="flex-1">
                    <label className="block text-[6px] font-black text-gray-400 uppercase">Zone</label>
                    <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full bg-transparent outline-none font-bold text-[9px]">
                      <option value="Abidjan">Abidjan uniquement</option>
                      <option value="Hors Abidjan">Hors Abidjan</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                <div className="flex gap-1">
                  <div className="flex-1 p-2 bg-gray-50 border rounded-md">
                    <label className="block text-[6px] font-black text-gray-400 uppercase">Départ</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent outline-none w-full text-[9px] font-bold" />
                  </div>
                  <div className="w-20 p-2 bg-gray-50 border rounded-md">
                    <label className="block text-[6px] font-black text-gray-400 uppercase">Heure</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-transparent outline-none w-full text-[9px] font-bold" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="flex-1 p-2 bg-gray-50 border rounded-md">
                    <label className="block text-[6px] font-black text-gray-400 uppercase">Retour</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent outline-none w-full text-[9px] font-bold" />
                  </div>
                  <div className="w-20 p-2 bg-gray-50 border rounded-md">
                    <label className="block text-[6px] font-black text-gray-400 uppercase">Heure</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-transparent outline-none w-full text-[9px] font-bold" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5">
                <div className="p-2 bg-gray-50 border rounded-md">
                  <label className="block text-[6px] font-black text-gray-400 uppercase">Service</label>
                  <select value={withDriver} onChange={e => setWithDriver(e.target.value)} className="bg-transparent outline-none w-full text-[9px] font-bold">
                    <option value="Sans chauffeur">Sans chauffeur</option>
                    <option value="Avec chauffeur">Avec chauffeur</option>
                  </select>
                </div>
                <div className="p-2 bg-gray-50 border rounded-md">
                  <label className="block text-[6px] font-black text-gray-400 uppercase">Places</label>
                  <select value={passengerCount} onChange={e => setPassengerCount(e.target.value)} className="bg-transparent outline-none w-full text-[9px] font-bold">
                    <option value="5">5 Places</option>
                    <option value="7">7 Places</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                  <label className="text-[6px] font-black text-gray-400 uppercase">Qté</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-sm font-black">-</button>
                    <span className="text-[10px] font-black">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-sm font-black">+</button>
                  </div>
                </div>
              </div>

              <button onClick={handleSearch} className="w-full bg-[#ff4d00] hover:bg-black text-white font-black rounded-lg py-2.5 text-[10px] flex items-center justify-center gap-1.5 uppercase mt-1">
                <Search size={12} /> Dispos
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={resultsRef} className="bg-gray-50 pb-20">
        {searchResults ? (
          <div className="max-w-6xl mx-auto px-4 pt-10">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Véhicules <span className="text-[#ff4d00]">Trouvés</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {searchResults.length > 0 ? (
                searchResults.map(car => <CarCard key={car.id} car={car} />)
              ) : (
                <p className="col-span-full text-gray-400 font-bold text-xs">Aucun véhicule ne correspond à vos critères.</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <Offres onSelect={(offre) => setSelectedOffre(offre)} />
            <SectionPopulaires cars={mockCars.slice(0, 3)} CarCard={CarCard} />
          </>
        )}
      </div>

      <ExitPopup />
      <WhatsAppChat />
    </div>
  );
}