import React from "react";
import { motion } from "framer-motion";

const cars = [
  {
    name: "BMW Série 3",
    image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
    price: "25 000 €",
  },
  {
    name: "Audi A4",
    image: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    price: "28 500 €",
  },
  {
    name: "Mercedes C-Class",
    image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg",
    price: "30 000 €",
  },
];

export default function CarSlider() {
  return (
    <div className="py-16 px-6 md:px-16">
      <h2 className="text-3xl font-bold text-center mb-8">Nos voitures en promo</h2>
      <div className="flex overflow-x-scroll gap-6 scrollbar-hide">
        {cars.map((car, index) => (
          <motion.div
            key={index}
            className="min-w-[250px] bg-white rounded-lg shadow-lg p-4"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={car.image}
              alt={car.name}
              className="rounded-lg mb-4 h-40 w-full object-cover"
            />
            <h3 className="text-xl font-semibold">{car.name}</h3>
            <p className="text-orange-500 font-bold">{car.price}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}