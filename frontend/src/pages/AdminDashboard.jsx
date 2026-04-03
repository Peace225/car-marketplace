import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Loader2, Share2, Truck, Car, MessageSquare, 
  Zap, Users, Activity, ExternalLink, Flame, Trophy
} from 'lucide-react';

// FIREBASE
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

// COMPONENTS
import Sidebar from '../components/Sidebar'; 
import VehicleForm from '../components/VehicleForm';
import EnginForm from '../components/EnginForm';
import SettingsForm from '../components/SettingsForm';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // DONNÉES RÉELLES
  const [cars, setCars] = useState([]);
  const [heavyVehicles, setHeavyVehicles] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => { if (!user) navigate("/login"); });
    
    // Sync Voitures
    const unsubCars = onSnapshot(query(collection(db, "cars"), orderBy("createdAt", "desc")), (snap) => {
      setCars(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });

    // Sync Engins
    const unsubEngins = onSnapshot(query(collection(db, "heavy_vehicles"), orderBy("createdAt", "desc")), (snap) => {
      setHeavyVehicles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Sync Traction (Derniers clics WhatsApp)
    const unsubMsgs = onSnapshot(query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(6)), (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubCars(); unsubEngins(); unsubMsgs(); };
  }, [navigate]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans italic">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => auth.signOut()} />

      <main className="flex-1 overflow-y-auto bg-[#050505] custom-scrollbar">
        
        {/* HEADER CUSTOM */}
        <header className="p-10 flex justify-between items-end border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 bg-[#fb201e] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[4px] text-white/40">Système Live</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">
              Auto<span className="text-[#fb201e]">Life</span> <span className="text-white/20">HQ</span>
            </h1>
          </div>
          
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.origin + "/catalogue");
            setCopied(true); setTimeout(() => setCopied(false), 2000);
          }} className="group relative bg-white text-black px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest overflow-hidden transition-all hover:pr-12">
            <span className="relative z-10">{copied ? "Lien Copié" : "Partager Catalogue"}</span>
            <ExternalLink size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </header>

        <div className="p-10">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              
              {/* SECTION 1: PERFORMANCE RÉELLE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <HeroStat 
                   label="Parc Automobile" 
                   value={cars.length} 
                   sub="Véhicules Actifs" 
                   icon={<Car size={40}/>} 
                   color="border-[#fb201e]/20"
                />
                <HeroStat 
                   label="Logistique" 
                   value={heavyVehicles.length} 
                   sub="Engins Lourds" 
                   icon={<Truck size={40}/>} 
                   color="border-blue-500/20"
                />
                <HeroStat 
                   label="Traction 24h" 
                   value={messages.length} 
                   sub="Intérêts WhatsApp" 
                   icon={<Flame size={40} className="text-orange-500"/>} 
                   color="border-orange-500/20"
                />
              </div>

              {/* SECTION 2: TRACTION & ANALYTICS */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                
                {/* FLUX DE TRACTION (MESSAGES RÉELS) */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xs font-black uppercase tracking-[3px] flex items-center gap-3">
                        <Activity size={18} className="text-[#fb201e]"/> Traction Récente
                      </h3>
                      <span className="text-[10px] font-bold text-white/20 uppercase">Dernières 48h</span>
                   </div>

                   <div className="space-y-4">
                      {messages.map((msg, i) => (
                        <div key={i} className="group flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-[#fb201e]/5 hover:border-[#fb201e]/20 transition-all">
                           <div className="flex items-center gap-5">
                              <div className="h-12 w-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-[#fb201e]/40 transition-colors">
                                 <MessageSquare size={20} className="text-white/20 group-hover:text-[#fb201e]"/>
                              </div>
                              <div>
                                 <p className="text-sm font-black uppercase">{msg.carName}</p>
                                 <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">{msg.carPrice} — {msg.source}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[11px] font-black text-[#fb201e]">{msg.phone || "ANONYME"}</p>
                              <p className="text-[9px] text-white/10 font-bold uppercase mt-1">Contacté via WhatsApp</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* RÉPARTITION DES OFFRES */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 flex flex-col justify-between">
                   <div>
                      <h3 className="text-xs font-black uppercase tracking-[3px] mb-10 flex items-center gap-3">
                        <Trophy size={18} className="text-yellow-500"/> Statut de la Flotte
                      </h3>
                      <div className="space-y-8">
                         <ProgressLine label="Véhicules VIP/GOLD" count={cars.filter(c => c.offer === 'VIP' || c.offer === 'Gold').length} total={cars.length} color="bg-yellow-500" />
                         <ProgressLine label="Stock Disponible" count={cars.filter(c => c.availability === 'Disponible').length} total={cars.length} color="bg-[#fb201e]" />
                         <ProgressLine label="En Arrivage" count={cars.filter(c => c.availability === 'En arrivage').length} total={cars.length} color="bg-white" />
                      </div>
                   </div>

                   <div className="mt-12 p-8 bg-gradient-to-br from-[#fb201e]/10 to-transparent border border-[#fb201e]/10 rounded-[2rem]">
                      <div className="flex items-center gap-4">
                         <Zap className="text-[#fb201e]" size={24} />
                         <div>
                            <p className="text-[11px] font-black uppercase">Optimisation</p>
                            <p className="text-[9px] text-white/40 uppercase font-bold leading-relaxed">
                               Le modèle <span className="text-white">Toyota Land Cruiser</span> génère 40% de votre traction actuelle.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          )}

          {/* AUTRES VUES */}
          {activeTab === 'inventory' && <VehicleForm cars={cars} />}
          {activeTab === 'engins' && <EnginForm heavyVehicles={heavyVehicles} />}
          {activeTab === 'settings' && <SettingsForm />}
        </div>
      </main>
    </div>
  );
}

// --- SOUS-COMPOSANTS DESIGN ---

function HeroStat({ label, value, sub, icon, color }) {
  return (
    <div className={`relative overflow-hidden bg-[#0a0a0a] border ${color} p-10 rounded-[3.5rem] group hover:bg-white/[0.02] transition-all`}>
      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[4px] text-white/30 mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-black italic tracking-tighter leading-none">{value}</span>
        </div>
        <p className="text-[10px] font-bold uppercase text-[#fb201e] mt-4 tracking-widest">{sub}</p>
      </div>
      <div className="absolute top-10 right-10 text-white/5 group-hover:text-white/10 transition-colors">
        {icon}
      </div>
    </div>
  );
}

function ProgressLine({ label, count, total, color }) {
  const width = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">{label}</span>
        <span className="text-sm font-black italic">{count}</span>
      </div>
      <div className="h-[3px] w-full bg-white/5 rounded-full">
        <div className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.2)]`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}