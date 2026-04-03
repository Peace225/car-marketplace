import React from 'react';
import { 
  LayoutDashboard, Car, Truck, Settings, LogOut, Shield
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Véhicules', icon: Car },
    { id: 'engins', label: 'Engins Lourds', icon: Truck },
    { id: 'settings', label: 'Profil Admin', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-black border-r border-white/5 flex flex-col p-8 shrink-0 h-screen">
      
      {/* LOGO PERSONNALISÉ */}
      <div className="flex items-center gap-4 mb-16 px-2">
        <div className="relative">
          <div className="bg-[#fb201e] p-2.5 rounded-2xl rotate-3 shadow-[0_0_15px_rgba(251,32,30,0.4)]">
            <Shield size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-black rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-black uppercase italic tracking-tighter text-xl leading-none">
            Auto<span className="text-[#fb201e]">Life</span>
          </span>
          <span className="text-[8px] font-black uppercase tracking-[3px] text-white/20">Control Center</span>
        </div>
      </div>

      {/* NAVIGATION PRINCIPALE */}
      <nav className="flex flex-col gap-3">
        <p className="text-[9px] font-black uppercase text-white/10 tracking-[4px] mb-2 px-4">Menu Principal</p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                isActive 
                  ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)] scale-[1.02]' 
                  : 'hover:bg-white/5 text-white/40 hover:text-white'
              }`}
            >
              {/* Barre active rouge sur le côté */}
              {isActive && (
                <div className="absolute left-0 w-1.5 h-5 bg-[#fb201e] rounded-r-full"></div>
              )}
              
              <Icon size={18} className={`${isActive ? 'text-[#fb201e]' : 'group-hover:text-white'} transition-colors`} />
              <span className="italic">{item.label}</span>
            </button>
          );
        })}

        {/* SÉPARATEUR */}
        <div className="h-px w-full bg-white/5 my-4 mx-auto"></div>

        {/* BOUTON LOGOUT (REMONTÉ ICI) */}
        <button 
          onClick={onLogout}
          className="group flex items-center gap-4 px-5 py-4 text-white/20 hover:text-[#fb201e] text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#fb201e]/5 rounded-2xl"
        >
          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#fb201e]/10 transition-colors">
            <LogOut size={16} />
          </div>
          <span className="italic">Déconnexion</span>
        </button>
      </nav>

      {/* FOOTER SIDEBAR (Optionnel, pour combler le vide en bas) */}
      <div className="mt-auto pt-10">
        <div className="bg-[#111] p-5 rounded-[2rem] border border-white/5">
           <p className="text-[8px] font-black uppercase text-white/20 mb-1">Version</p>
           <p className="text-[10px] font-black text-white/60">2.0.4 Enterprise</p>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;