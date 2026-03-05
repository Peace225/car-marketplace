import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Vente from "./pages/Vente";
import Location from "./pages/Location";
import Detail from "./pages/Detail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Catalog from './components/Catalog';
import CarDetails from './components/CarDetails';

// NOUVEAU : Importe le composant que l'on vient de créer
import ImportData from './components/ImportData'; 

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
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/catalogue" element={<Catalog />} />
          <Route path="/voiture/:id" element={<CarDetails />} />
          
          {/* NOUVEAU : La route temporaire pour importer tes voitures */}
          <Route path="/import" element={<ImportData />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}