import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Vente from "./pages/Vente";
import Location from "./pages/Location";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Catalog from './components/Catalog';
import CarDetails from './components/CarDetails';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-[80vh]">
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/vente" element={<Vente />} />
          <Route path="/location" element={<Location />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalogue" element={<Catalog />} />
            {/* La route dynamique magique : ":id" capture le numéro de la voiture */}
          <Route path="/voiture/:id" element={<CarDetails />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}