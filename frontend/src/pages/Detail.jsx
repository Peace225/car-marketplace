import React from "react";
import { useParams } from "react-router-dom";

const cars = [
  { id: "1", name: "Toyota Corolla", price: "5 000 000 FCFA", description: "Voiture fiable et économique.", image: "https://picsum.photos/400/250?1" },
  { id: "2", name: "BMW X5", price: "15 000 000 FCFA", description: "SUV luxueux et puissant.", image: "https://picsum.photos/400/250?2" },
  { id: "3", name: "Mercedes C200", price: "12 000 000 FCFA", description: "Berline élégante et confortable.", image: "https://picsum.photos/400/250?3" },
  { id: "4", name: "Hyundai Tucson", price: "20 000 FCFA / Jour", description: "SUV pratique pour location.", image: "https://picsum.photos/400/250?4" },
  { id: "5", name: "Mercedes GLA", price: "50 000 FCFA / Jour", description: "SUV compact premium.", image: "https://picsum.photos/400/250?5" },
];

export default function Detail() {
  const { id } = useParams();
  const car = cars.find((c) => c.id === id);

  if (!car) return <div className="p-10 text-red-500">Voiture non trouvée</div>;

  return (
    <div className="p-10 flex flex-col items-center">
      <img src={car.image} alt={car.name} className="w-96 h-60 object-cover rounded-lg shadow mb-5" />
      <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
      <p className="text-orange-500 font-semibold mb-4">{car.price}</p>
      <p className="text-gray-700">{car.description}</p>
    </div>
  );
}