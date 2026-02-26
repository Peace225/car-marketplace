import React from "react";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  User, 
  Car, 
  Heart, 
  Settings, 
  LayoutDashboard, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  const stats = [
    { label: "Annonces", value: "3", icon: <Car size={20} />, color: "bg-blue-500" },
    { label: "Favoris", value: "12", icon: <Heart size={20} />, color: "bg-[#fb201e]" },
    { label: "Vérifications", value: "1", icon: <ShieldCheck size={20} />, color: "bg-green-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col md:flex-row">
      
      {/* Sidebar (Menu latéral) */}
      <aside className="w-full md:w-64 bg-[#1a1a1a] border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-[#fb201e] rounded-lg flex items-center justify-center font-black">AL</div>
            <span className="font-black italic uppercase tracking-tighter text-xl">Auto<span className="text-[#fb201e]">Life</span></span>
          </div>
          
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#fb201e]/10 text-[#fb201e] rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
              <Car size={18} /> Mes Véhicules
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
              <Settings size={18} /> Paramètres
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all mt-10"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        {/* Header du Dashboard */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-1">
              Salut, <span className="text-[#fb201e]">{user?.email?.split('@')[0] || "Pilote"}</span>
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Bienvenue dans votre centre de contrôle personnel.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[#1a1a1a] p-2 pr-4 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-white leading-none mb-1">Statut Compte</p>
              <p className="text-[9px] font-bold text-[#fb201e] uppercase tracking-tighter">Membre Premium</p>
            </div>
          </div>
        </header>

        {/* Grille de Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-[#fb201e]/30 transition-all">
              <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black italic tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <TrendingUp size={40} className="absolute -bottom-2 -right-2 text-white/5 group-hover:text-[#fb201e]/10 transition-colors" />
            </div>
          ))}
        </div>

        {/* Section Activité Récente (Placeholder) */}
        <div className="bg-[#1a1a1a] rounded-[2.5rem] border border-white/5 p-8">
          <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-3">
            <div className="w-2 h-6 bg-[#fb201e] rounded-full"></div>
            Activité Récente
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <LayoutDashboard size={32} className="text-gray-700" />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aucune activité récente à afficher pour le moment.</p>
          </div>
        </div>

      </main>
    </div>
  );
}