import React from "react";
import { Link } from "react-router-dom";

export default function CarCard({ car }) {
  return (
    <div className="border rounded-lg p-3 shadow hover:shadow-lg transition w-64">
      <img src={car.image} alt={car.name} className="rounded w-full h-40 object-cover" />
      <h2 className="font-bold mt-2">{car.name}</h2>
      <p className="text-orange-500 font-semibold">{car.price}</p>
      <Link to={`/detail/${car.id}`} className="text-blue-500 hover:underline mt-2 block">
        Voir détails
      </Link>
    </div>
  );
}