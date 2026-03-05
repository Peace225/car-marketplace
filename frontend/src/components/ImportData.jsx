import React, { useState } from 'react';
// Importe ta base de données Firebase
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
// Importe ton fichier de données local
import { carsData } from '../data/cars'; 

export default function ImportData() {
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    setIsImporting(true);
    setMessage("Importation en cours... Ne ferme pas la page !");

    try {
      // On cible la collection "cars" dans Firestore
      const carsCollectionRef = collection(db, "cars");

      // On boucle sur toutes tes voitures du fichier local
      for (const car of carsData) {
        // On ajoute chaque voiture dans Firebase
        await addDoc(carsCollectionRef, {
          brand: car.brand,
          model: car.model,
          price: car.price,
          type: car.type,
          description: car.description,
          image: car.image, // Ça gardera le lien "/images/x.jpg" pour l'instant
          createdAt: new Date()
        });
      }

      setMessage("✅ Importation terminée avec succès ! Va vérifier sur Firebase.");
    } catch (error) {
      console.error("Erreur lors de l'import :", error);
      setMessage("❌ Erreur de permission. As-tu bien mis les règles en mode test ?");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-black text-white">
      <h2 className="text-2xl font-bold mb-6">Outil de migration vers Firebase</h2>
      <button 
        onClick={handleImport} 
        disabled={isImporting}
        className="bg-[#fb201e] px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition disabled:opacity-50"
      >
        {isImporting ? "Envoi en cours..." : "Importer mes 31 voitures dans Firebase"}
      </button>
      {message && <p className="mt-6 text-lg">{message}</p>}
    </div>
  );
}