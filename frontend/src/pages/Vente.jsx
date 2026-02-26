import React from "react";
import CarCard from "../components/CarCard";

const cars = [
  { id: 1, name: "Toyota Corolla", price: "5 000 000 FCFA", image: "https://picsum.photos/200/150?1" },
  { id: 2, name: "BMW X5", price: "15 000 000 FCFA", image: "https://picsum.photos/200/150?2" },
  { id: 3, name: "Mercedes C200", price: "12 000 000 FCFA", image: "https://picsum.photos/200/150?3" },
];

export default function Vente() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">Voitures en vente</h1>
      <div className="flex flex-wrap gap-6">
        {cars.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    </div>
  );
}