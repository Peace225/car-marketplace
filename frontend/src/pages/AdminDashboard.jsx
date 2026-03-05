import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Car, Settings, LogOut, 
  MessageSquare, Trash2, Share2, 
  Check, Loader2, Image as ImageIcon, Users, Bell,
  MapPin, Calendar, TrendingUp
} from 'lucide-react';

// Import Recharts pour le graphique
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Imports Firebase
import { auth, db, storage } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  collection, addDoc, doc, deleteDoc, getDoc,
  query, orderBy, onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // --- ÉTATS DE NAVIGATION & UI ---
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // --- ÉTATS DES DONNÉES ---
  const [cars, setCars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin", // Valeur par défaut
    whatsapp: "+225 0151 10 48 39"
  });

  // --- ÉTAT DU FORMULAIRE AJOUT ---
  const [formData, setFormData] = useState({
    brand: '', model: '', price: '', location: '', energy: 'Essence', 
    year: new Date().getFullYear().toString(), transmission: 'Automatique',
    type: 'Vente', description: '', image: null,
  });

  // --- LOGIQUE DU GRAPHIQUE (Calcul des leads par jour) ---
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return { date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }), leads: 0 };
    }).reverse();

    messages.forEach(msg => {
      if (msg.timestamp) {
        const date = msg.timestamp.toDate().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        const dayMatch = last7Days.find(d => d.date === date);
        if (dayMatch) dayMatch.leads += 1;
      }
    });
    return last7Days;
  }, [messages]);

  // 1. CHARGEMENT & SÉCURITÉ
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        // --- NOUVEAU : Récupération du profil spécifique à l'admin connecté ---
        try {
          const adminDocRef = doc(db, "admins", user.uid);
          const adminSnap = await getDoc(adminDocRef);
          
          if (adminSnap.exists() && adminSnap.data().name) {
            setAdminProfile(prev => ({...prev, name: adminSnap.data().name}));
          } else {
            // Si pas de nom défini, on utilise le début de son email
            const emailName = user.email ? user.email.split('@')[0] : "Admin";
            setAdminProfile(prev => ({...prev, name: emailName}));
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du profil admin:", error);
        }
      }
    });

    const qCars = query(collection(db, "cars"), orderBy("createdAt", "desc"));
    const unsubCars = onSnapshot(qCars, (snap) => {
      setCars(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setIsLoading(false);
    });

    const qMsgs = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const unsubMsgs = onSnapshot(qMsgs, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubscribeAuth(); unsubCars(); unsubMsgs(); };
  }, [navigate]);

  // 2. FONCTIONS ACTIONS
  const handleLogout = () => signOut(auth).then(() => navigate("/login"));

  const copyCatalogLink = () => {
    const url = `${window.location.origin}/catalogue`;
    navigator.clipboard.writeText(`Bonjour ! Voici notre catalogue AutoLife : ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Photo requise");
    setIsSubmitting(true);
    try {
      const imgRef = ref(storage, `cars/${Date.now()}_${formData.image.name}`);
      await uploadBytes(imgRef, formData.image);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, "cars"), {
        ...formData, image: url, createdAt: new Date()
      });
      setFormData({ 
        brand: '', model: '', price: '', location: '', energy: 'Essence', 
        year: new Date().getFullYear().toString(), transmission: 'Automatique', 
        type: 'Vente', description: '', image: null 
      });
      setImagePreview(null);
      setActiveTab('inventory'); 
    } catch (e) { alert("Erreur d'envoi"); }
    finally { setIsSubmitting(false); }
  };

  if (isLoading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-[#fb201e]" size={48} /></div>;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#111] border-r border-white/5 flex flex-col p-6 shrink-0 z-10">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-[#fb201e] p-2 rounded-lg shadow-lg shadow-red-600/20"><Car size={20} /></div>
          <span className="font-black uppercase italic tracking-tighter text-xl">AutoLife</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === 'dashboard' ? 'bg-[#fb201e] text-white shadow-lg shadow-red-600/20' : 'text-white/40 hover:bg-white/5'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === 'inventory' ? 'bg-[#fb201e] text-white shadow-lg shadow-red-600/20' : 'text-white/40 hover:bg-white/5'}`}>
            <Car size={18} /> Véhicules
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === 'settings' ? 'bg-[#fb201e] text-white shadow-lg shadow-red-600/20' : 'text-white/40 hover:bg-white/5'}`}>
            <Settings size={18} /> Paramètres
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl text-[11px] font-black uppercase transition-colors"><LogOut size={18} /> Quitter</button>
      </aside>

      {/* --- CONTENT --- */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a] flex flex-col">
        
        {/* --- HEADER FIXE (Message de Bienvenue) --- */}
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 p-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
              Salut, <span className="text-[#fb201e]">{adminProfile.name}</span>
            </h1>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold mt-2">
              Bienvenue dans ton centre de contrôle
            </p>
          </div>
          
          <button onClick={copyCatalogLink} className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all shadow-xl ${copied ? 'bg-green-600 shadow-green-600/20' : 'bg-white text-black hover:bg-[#fb201e] hover:text-white shadow-white/10 hover:shadow-red-600/20'}`}>
            {copied ? <Check size={14} /> : <Share2 size={14} />} 
            <span className="hidden md:inline">{copied ? "Copié !" : "Partager Catalogue"}</span>
          </button>
        </header>

        {/* --- VUES (Le contenu défile en dessous du header) --- */}
        <div className="p-8">
          
          {/* VUE : DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-colors">
                  <Users className="text-blue-500 mb-4" size={28} />
                  <p className="text-5xl font-black italic">{cars.length}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase mt-2 tracking-widest">Annonces Actives</p>
                </div>
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-colors">
                  <MessageSquare className="text-green-500 mb-4" size={28} />
                  <p className="text-5xl font-black italic">{messages.length}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase mt-2 tracking-widest">Total Leads WhatsApp</p>
                </div>
                <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl hover:border-white/10 transition-colors relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 bg-[#fb201e]/10 w-24 h-24 rounded-full blur-2xl"></div>
                  <TrendingUp className="text-[#fb201e] mb-4 relative z-10" size={28} />
                  <p className="text-5xl font-black italic relative z-10">{messages.filter(m => {
                     const today = new Date().toLocaleDateString('fr-FR');
                     return m.timestamp?.toDate().toLocaleDateString('fr-FR') === today;
                  }).length}</p>
                  <p className="text-[10px] font-bold text-white/30 uppercase mt-2 tracking-widest relative z-10">Leads Aujourd'hui</p>
                </div>
              </div>

              {/* GRAPHIQUE DES LEADS */}
              <div className="bg-[#111] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
                  <TrendingUp className="text-[#fb201e]" size={20}/> Performance des 7 derniers jours
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fb201e" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#fb201e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis dataKey="date" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} dx={-10} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }} 
                        itemStyle={{ color: '#fb201e', fontWeight: '900', fontSize: '14px' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase' }}
                      />
                      <Area type="monotone" dataKey="leads" name="Prospects" stroke="#fb201e" strokeWidth={4} fill="url(#colorLeads)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* VUE : INVENTORY (STOCK & FORMULAIRE) */}
          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               
               {/* Formulaire */}
               <form onSubmit={handleSubmitCar} className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 h-fit space-y-5 shadow-2xl">
                  <h3 className="text-xl font-black uppercase italic mb-6">Publier un véhicule</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/30 ml-2">Marque</label>
                      <input type="text" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/30 ml-2">Modèle</label>
                      <input type="text" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/30 ml-2">Localisation</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                        <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black border border-white/10 p-4 pl-10 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/30 ml-2">Année</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                        <input type="number" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-black border border-white/10 p-4 pl-10 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-colors" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/30 ml-2">Énergie</label>
                      <select value={formData.energy} onChange={e => setFormData({...formData, energy: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none appearance-none font-bold uppercase focus:border-[#fb201e] transition-colors">
                        <option value="Essence">Essence</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybride">Hybride</option>
                        <option value="Électrique">Électrique</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-white/30 ml-2">Boîte de vitesse</label>
                      <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none appearance-none font-bold uppercase focus:border-[#fb201e] transition-colors">
                        <option value="Automatique">Automatique</option>
                        <option value="Manuelle">Manuelle</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-white/30 ml-2">Prix (ex: 7 500 000 FCFA)</label>
                    <input type="text" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-colors text-[#fb201e] font-black" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-white/30 ml-2">Description technique</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs h-28 outline-none focus:border-[#fb201e] transition-colors resize-none"></textarea>
                  </div>

                  <div className="relative h-40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center bg-black overflow-hidden cursor-pointer hover:border-[#fb201e]/50 transition-colors group">
                    {imagePreview ? (
                      <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/20 group-hover:text-[#fb201e] transition-colors">
                        <ImageIcon size={32} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Uploader la photo</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; setFormData({...formData, image: file}); setImagePreview(URL.createObjectURL(file)); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {imagePreview && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"><span className="bg-[#fb201e] text-white text-[10px] font-black px-4 py-2 rounded-full uppercase">Changer l'image</span></div>}
                  </div>

                  <button disabled={isSubmitting} className="w-full bg-[#fb201e] py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 mt-4">
                    {isSubmitting ? "Publication en cours..." : "Valider le Stock"}
                  </button>
              </form>

              {/* Liste de Stock */}
              <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col max-h-[900px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black uppercase italic">Stock Actuel</h3>
                  <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase">{cars.length} Véhicules</span>
                </div>
                
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {cars.map(car => (
                    <div key={car.id} className="bg-black p-4 rounded-3xl border border-white/5 flex items-center gap-5 group hover:border-white/20 transition-all">
                      <img src={car.image} className="w-28 h-20 object-cover rounded-2xl shadow-xl" alt={car.model} />
                      <div className="flex-grow">
                        <p className="font-black text-sm uppercase text-white leading-none mb-1">{car.brand} {car.model}</p>
                        <div className="flex gap-2 text-[9px] text-white/40 font-bold uppercase tracking-wider mb-2">
                          <span className="bg-white/5 px-2 py-0.5 rounded">{car.year}</span>
                          <span className="bg-white/5 px-2 py-0.5 rounded">{car.transmission}</span>
                        </div>
                        <p className="text-[#fb201e] text-[11px] font-black">{car.price}</p>
                      </div>
                      <button onClick={() => deleteDoc(doc(db, "cars", car.id))} className="text-white/20 hover:text-red-500 hover:bg-red-500/10 p-3 rounded-xl transition-all mr-2">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {cars.length === 0 && (
                    <div className="text-center py-20 text-white/20 text-sm font-bold uppercase tracking-widest">
                      Votre garage est vide.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VUE : SETTINGS */}
          {activeTab === 'settings' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 space-y-8 shadow-2xl">
                  
                  <div>
                    <h3 className="text-2xl font-black uppercase italic mb-2 flex items-center gap-3">
                      <Settings className="text-[#fb201e]" size={24}/> Paramètres du Profil
                    </h3>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Configurez vos informations de contact public.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2 tracking-widest">Nom d'affichage Administrateur</label>
                      <input 
                        type="text" 
                        value={adminProfile.name} 
                        onChange={e => setAdminProfile({...adminProfile, name: e.target.value})} 
                        className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#fb201e] transition-colors" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase ml-2 tracking-widest">Numéro WhatsApp Réception (Format International)</label>
                      <input 
                        type="text" 
                        value={adminProfile.whatsapp} 
                        onChange={e => setAdminProfile({...adminProfile, whatsapp: e.target.value})} 
                        className="w-full bg-black border border-white/10 p-5 rounded-2xl text-sm outline-none focus:border-[#fb201e] transition-colors" 
                        placeholder="ex: 2250151104839"
                      />
                      <p className="text-[8px] text-white/30 uppercase ml-2 mt-1">N'incluez pas le symbole "+", uniquement les chiffres.</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={async () => {
                        try {
                          await setDoc(doc(db, "admins", auth.currentUser.uid), { name: adminProfile.name }, { merge: true });
                          alert('Modifications sauvegardées avec succès !');
                        } catch (error) {
                          alert('Erreur lors de la sauvegarde.');
                        }
                      }} 
                      className="bg-[#fb201e] text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase hover:bg-white hover:text-black transition-all shadow-xl shadow-red-600/20"
                    >
                      Sauvegarder les modifications
                    </button>
                  </div>

                </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
}