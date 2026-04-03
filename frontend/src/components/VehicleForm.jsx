import React, { useState } from 'react';
import { Zap, ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

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

export default function VehicleForm({ cars }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({ front: null, back: null, interior: null });
  const [formData, setFormData] = useState({
    brand: '', model: '', price: '', location: '',
    category: 'Disponible',
    offer: 'Gold',
    images: { front: null, back: null, interior: null }
  });

  const uploadToCloudinary = async (file, folder) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "autolife_preset");
    data.append("cloud_name", "dpje4d7xa");
    data.append("folder", folder);
    const res = await fetch(`https://api.cloudinary.com/v1_1/dpje4d7xa/image/upload`, { method: "POST", body: data });
    const resData = await res.json();
    return resData.secure_url;
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    if (!formData.images.front) return Toast.fire({ icon: 'error', title: 'Photo principale requise !' });
    
    setIsSubmitting(true);
    try {
      const [front, back, interior] = await Promise.all([
        uploadToCloudinary(formData.images.front, "autolife_cars"),
        formData.images.back ? uploadToCloudinary(formData.images.back, "autolife_cars") : null,
        formData.images.interior ? uploadToCloudinary(formData.images.interior, "autolife_cars") : null
      ]);

      await addDoc(collection(db, "cars"), {
        brand: formData.brand,
        model: formData.model,
        price: formData.price,
        location: formData.location || "Abidjan",
        category: formData.category,
        offer: formData.category === 'Offre' ? formData.offer : null,
        availability: formData.category === 'Disponible' ? 'Disponible' : 'Sur Commande',
        images: { front, back, interior },
        createdAt: new Date()
      });

      Toast.fire({ icon: 'success', title: 'Véhicule ajouté !' });
      
      // Reset
      setFormData({ brand: '', model: '', price: '', location: '', category: 'Disponible', offer: 'Gold', images: { front: null, back: null, interior: null } });
      setImagePreviews({ front: null, back: null, interior: null });
    } catch (err) {
      Toast.fire({ icon: 'error', title: 'Erreur lors de l\'envoi' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* FORMULAIRE */}
      <form onSubmit={handleSubmitCar} className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 space-y-5 h-fit">
        <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
          <Zap className="text-[#fb201e]"/> Ajouter un Véhicule
        </h3>
        
        <div className="flex bg-black p-1 rounded-2xl border border-white/5">
          <button type="button" onClick={() => setFormData({...formData, category: 'Disponible'})} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.category === 'Disponible' ? 'bg-[#22c55e] text-white' : 'text-white/20'}`}>
            En Stock
          </button>
          <button type="button" onClick={() => setFormData({...formData, category: 'Offre'})} 
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.category === 'Offre' ? 'bg-[#fb201e] text-white' : 'text-white/20'}`}>
            Offre Catalogue
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" required placeholder="Marque" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#fb201e]" />
          <input type="text" required placeholder="Modèle" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#fb201e]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Prix (ex: 6.5M)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-black border border-white/10 p-4 rounded-2xl text-xs outline-none focus:border-[#fb201e]" />
          <select disabled={formData.category === 'Disponible'} value={formData.offer} onChange={e => setFormData({...formData, offer: e.target.value})} 
            className={`bg-black border border-white/10 p-4 rounded-2xl text-xs font-black uppercase outline-none ${formData.category === 'Disponible' ? 'opacity-20' : 'text-[#fb201e]'}`}>
            <option value="Gold">🌟 Gold (5-6.5M)</option>
            <option value="Premium">🏆 Premium (7-10M)</option>
            <option value="VIP">👑 VIP (11M+)</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['front', 'back', 'interior'].map(type => (
            <div key={type} className="relative h-24 bg-black border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
              {imagePreviews[type] ? <img src={imagePreviews[type]} className="absolute inset-0 w-full h-full object-cover" /> : <ImageIcon className="text-white/10" size={18}/>}
              <input type="file" onChange={(e) => {
                const file = e.target.files[0];
                if(file) {
                  setFormData(prev => ({...prev, images: {...prev.images, [type]: file}}));
                  setImagePreviews(prev => ({...prev, [type]: URL.createObjectURL(file)}));
                }
              }} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          ))}
        </div>

        <button disabled={isSubmitting} className="w-full bg-[#fb201e] py-5 rounded-2xl font-black uppercase text-[11px] disabled:opacity-50 flex justify-center items-center gap-2">
          {isSubmitting ? <><Loader2 className="animate-spin" size={14}/> Publication...</> : "Ajouter au Stock"}
        </button>
      </form>

      {/* LISTE DES VÉHICULES */}
      <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 h-[700px] overflow-y-auto custom-scrollbar">
        <h3 className="text-xl font-black uppercase italic mb-6">Stock Actuel ({cars.length})</h3>
        <div className="space-y-4">
          {cars.map(car => (
            <div key={car.id} className="bg-black p-4 rounded-3xl border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-all">
              <img src={car.images?.front} className="w-16 h-12 object-cover rounded-lg" />
              <div className="flex-grow">
                <p className="font-black text-[11px] uppercase">{car.brand} {car.model}</p>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${car.category === 'Disponible' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {car.category} {car.offer && `• ${car.offer}`}
                </span>
              </div>
              <button onClick={async () => {
                const res = await Swal.fire({ title: 'Supprimer?', text: "Irréversible!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#fb201e', background: '#111', color: '#fff' });
                if(res.isConfirmed) await deleteDoc(doc(db, "cars", car.id));
              }} className="p-2 text-white/10 hover:text-red-500 transition-colors">
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}