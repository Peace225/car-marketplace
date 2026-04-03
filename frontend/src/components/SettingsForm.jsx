import React, { useState, useEffect, useCallback } from 'react';
import { Save, Lock, Phone, User, ShieldCheck, Loader2, CloudCheck } from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import Swal from 'sweetalert2';

export default function SettingsForm() {
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const [profile, setProfile] = useState({
    agencyName: '',
    whatsapp: '',
    email: auth.currentUser?.email || ''
  });

  // 1. Chargement initial
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(doc(db, "settings", "admin_profile"));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // 2. LOGIQUE TEMPS RÉEL (Debounce)
  useEffect(() => {
    if (loading) return; // Ne pas sauvegarder pendant le chargement initial

    const timer = setTimeout(async () => {
      setIsSyncing(true);
      try {
        await setDoc(doc(db, "settings", "admin_profile"), {
          agencyName: profile.agencyName,
          whatsapp: profile.whatsapp,
          updatedAt: new Date()
        }, { merge: true });
        
        // Petit délai visuel pour montrer que c'est enregistré
        setTimeout(() => setIsSyncing(false), 1000);
      } catch (error) {
        console.error("Erreur synchro temps réel:", error);
        setIsSyncing(false);
      }
    }, 800); // Attendre 800ms après la dernière frappe

    return () => clearTimeout(timer);
  }, [profile.agencyName, profile.whatsapp, loading]);

  // 3. Changement de mot de passe (Reste manuel pour sécurité)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return Swal.fire({ icon: 'warning', title: '6 caractères min.', background: '#111', color: '#fff' });

    setIsSyncing(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      Swal.fire({ icon: 'success', title: 'Mot de passe mis à jour', toast: true, position: 'top-end', timer: 3000, showConfirmButton: false });
      setNewPassword('');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Veuillez vous reconnecter pour modifier le mot de passe', background: '#111', color: '#fff' });
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#fb201e]" /></div>;

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* INDICATEUR DE SYNCHRO TEMPS RÉEL */}
      <div className="flex items-center gap-2 mb-6 px-4">
        {isSyncing ? (
          <div className="flex items-center gap-2 text-[#fb201e] text-[10px] font-black uppercase tracking-widest animate-pulse">
            <Loader2 size={12} className="animate-spin" /> Synchronisation en cours...
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
            <CloudCheck size={14} /> Toutes les modifications sont enregistrées
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECTION : INFOS AGENCE */}
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#fb201e]/10 rounded-lg text-[#fb201e]">
              <User size={20} />
            </div>
            <h3 className="text-xl font-black uppercase italic">Infos Agence</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase text-white/30 ml-2">Nom de l'enseigne</label>
              <div className="relative mt-1">
                <ShieldCheck className="absolute left-4 top-4 text-white/20" size={16} />
                <input 
                  type="text" 
                  value={profile.agencyName}
                  onChange={e => setProfile({...profile, agencyName: e.target.value})}
                  className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-white/30 ml-2">Numéro WhatsApp</label>
              <div className="relative mt-1">
                <Phone className="absolute left-4 top-4 text-white/20" size={16} />
                <input 
                  type="text" 
                  value={profile.whatsapp}
                  onChange={e => setProfile({...profile, whatsapp: e.target.value})}
                  placeholder="225XXXXXXXXXX"
                  className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-all"
                />
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-white/10 italic text-center uppercase tracking-tighter">
            Modifiez les champs ci-dessus, la sauvegarde est automatique.
          </p>
        </div>

        {/* SECTION : SÉCURITÉ */}
        <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Lock size={20} />
            </div>
            <h3 className="text-xl font-black uppercase italic">Sécurité</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-white/30 ml-2">Nouveau mot de passe</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-blue-500 mt-1"
              />
            </div>

            <button 
              type="submit"
              disabled={isSyncing}
              className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/10"
            >
              <Lock size={16} /> Appliquer le mot de passe
            </button>
          </form>

          <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
            <p className="text-[9px] text-yellow-500 leading-relaxed font-medium">
              ⚠️ Le changement de mot de passe est la seule action nécessitant une validation manuelle pour des raisons de sécurité.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}