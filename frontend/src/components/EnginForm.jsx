import React, { useState } from 'react';
import { Truck, ImageIcon, Trash2, Loader2, MapPin, Weight } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

// Config des alertes stylées
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#111',
  color: '#fff',
  iconColor: '#fb201e',
});

export default function EnginForm({ heavyVehicles }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Tracteur',
    location: 'Abidjan',
    tonnage: '',
    description: '',
    image: null
  });

  // Logique d'upload Cloudinary
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "autolife_preset");
    data.append("cloud_name", "dpje4d7xa");
    data.append("folder", "autolife_engins");
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/dpje4d7xa/image/upload`, { 
      method: "POST", 
      body: data 
    });
    const resData = await res.json();
    return resData.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return Toast.fire({ icon: 'error', title: 'Image requise !' });

    setIsSubmitting(true);
    try {
      // 1. Upload de l'image
      const imageUrl = await uploadToCloudinary(formData.image);

      // 2. Enregistrement Firestore
      await addDoc(collection(db, "heavy_vehicles"), {
        name: formData.name,
        category: formData.category,
        location: formData.location,
        tonnage: formData.tonnage,
        description: formData.description,
        imageUrl: imageUrl,
        createdAt: new Date()
      });

      Toast.fire({ icon: 'success', title: 'Engin ajouté avec succès !' });

      // Reset du formulaire
      setFormData({ name: '', category: 'Tracteur', location: 'Abidjan', tonnage: '', description: '', image: null });
      setPreview(null);
    } catch (error) {
      console.error(error);
      Toast.fire({ icon: 'error', title: 'Erreur lors de l\'ajout' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* FORMULAIRE D'AJOUT */}
      <form onSubmit={handleSubmit} className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-5 h-fit">
        <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
          <Truck className="text-[#fb201e]"/> Nouvel Engin Lourd
        </h3>

        <div className="space-y-4">
          <input 
            type="text" required placeholder="Désignation (ex: Caterpillar D8T)" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#fb201e] transition-all" 
          />

          <div className="grid grid-cols-2 gap-4">
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})} 
              className="bg-black border border-white/10 p-4 rounded-2xl text-xs font-black uppercase text-[#fb201e] outline-none"
            >
              <option value="Tracteur">🚜 Tracteur</option>
              <option value="Benne">🚚 Benne</option>
              <option value="Grue">🏗️ Grue</option>
              <option value="Bulldozer">🚧 Bulldozer</option>
              <option value="Citerne">⛽ Citerne</option>
              <option value="Élévateur">📦 Élévateur</option>
            </select>
            
            <div className="relative">
               <Weight className="absolute left-4 top-4 text-white/20" size={16}/>
               <input 
                 type="text" placeholder="Tonnage (ex: 40T)" 
                 value={formData.tonnage} 
                 onChange={e => setFormData({...formData, tonnage: e.target.value})} 
                 className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl text-xs outline-none" 
               />
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-white/20" size={16}/>
            <input 
              type="text" placeholder="Lieu (ex: Abidjan, Port-Bouët)" 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
              className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl text-xs outline-none" 
            />
          </div>

          <textarea 
            placeholder="Description technique (optionnel)" 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none h-24 resize-none"
          ></textarea>
        </div>

        {/* UPLOAD ZONE */}
        <div className="relative h-44 bg-black border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center overflow-hidden group">
          {preview ? (
            <>
              <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity" />
              <p className="relative z-10 text-[8px] font-black uppercase bg-black/50 px-3 py-1 rounded-full">Changer la photo</p>
            </>
          ) : (
            <div className="text-center">
              <ImageIcon size={32} className="text-white/10 mx-auto mb-2" />
              <p className="text-[9px] font-black uppercase text-white/20">Cliquer pour uploader l'engin</p>
            </div>
          )}
          <input 
            type="file" accept="image/*"
            onChange={e => {
              const file = e.target.files[0];
              if(file) {
                setFormData({...formData, image: file});
                setPreview(URL.createObjectURL(file));
              }
            }} 
            className="absolute inset-0 opacity-0 cursor-pointer" 
          />
        </div>

        <button 
          disabled={isSubmitting} 
          className="w-full bg-[#fb201e] py-5 rounded-2xl font-black uppercase text-[11px] disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-[#fb201e]/10"
        >
          {isSubmitting ? (
            <><Loader2 className="animate-spin" size={18}/> Synchronisation...</>
          ) : (
            "Publier l'engin lourd"
          )}
        </button>
      </form>

      {/* LISTE DES ENGINS EXISTANTS */}
      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 h-[700px] flex flex-col">
        <h3 className="text-xl font-black uppercase italic mb-6">Parc Engins ({heavyVehicles.length})</h3>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {heavyVehicles.length === 0 ? (
            <div className="text-center py-20 text-white/10">Aucun engin enregistré.</div>
          ) : (
            heavyVehicles.map(item => (
              <div key={item.id} className="bg-black/50 p-4 rounded-3xl border border-white/5 flex items-center gap-5 hover:border-white/20 transition-all">
                <img src={item.imageUrl} className="w-24 h-20 object-cover rounded-2xl" alt={item.name} />
                <div className="flex-grow">
                  <p className="font-black text-sm uppercase tracking-tight">{item.name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[8px] bg-[#fb201e]/10 text-[#fb201e] font-black px-2 py-0.5 rounded uppercase">{item.category}</span>
                    <span className="text-[8px] bg-white/5 text-white/40 font-black px-2 py-0.5 rounded uppercase">{item.tonnage}</span>
                  </div>
                  <p className="text-[10px] text-white/20 mt-2 flex items-center gap-1">
                    <MapPin size={10}/> {item.location}
                  </p>
                </div>
                <button 
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: 'Supprimer cet engin ?',
                      text: "Cette action est définitive.",
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#fb201e',
                      cancelButtonColor: '#333',
                      confirmButtonText: 'Oui, supprimer',
                      background: '#111',
                      color: '#fff'
                    });
                    if(result.isConfirmed) {
                      await deleteDoc(doc(db, "heavy_vehicles", item.id));
                      Toast.fire({ icon: 'success', title: 'Engin supprimé' });
                    }
                  }} 
                  className="p-3 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                >
                  <Trash2 size={20}/>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}