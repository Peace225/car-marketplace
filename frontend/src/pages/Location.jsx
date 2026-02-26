import React from "react";
import CarCard from "../components/CarCard";

const cars = [
  { id: 4, name: "Hyundai Tucson", price: "20 000 FCFA / Jour", image: "https://picsum.photos/200/150?4" },
  { id: 5, name: "Mercedes GLA", price: "50 000 FCFA / Jour", image: "https://picsum.photos/200/150?5" },
];

export default function Location() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">Voitures en location</h1>
      <div className="flex flex-wrap gap-6">
        {cars.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    </div>
  );
}