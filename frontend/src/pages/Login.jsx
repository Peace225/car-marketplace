import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- CONNEXION CLASSIQUE ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Identifiants incorrects.");
      } else {
        setError("Erreur de connexion. Veuillez réessayer.");
      }
    }
  };

  // --- CONNEXION GOOGLE ---
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      setError("La connexion avec Google a échoué.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Background Image avec Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-0"></div>

      {/* Carte de Connexion */}
      <div className="relative z-10 w-full max-w-[400px] px-6">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#fb201e]/10 border border-[#fb201e]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-[#fb201e]" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
              Bon de <span className="text-[#fb201e]">Retour</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
              Heureux de vous revoir
            </p>
          </div>

          {/* BOUTON GOOGLE */}
          <button 
            onClick={handleGoogleSignIn}
            type="button"
            className="w-full bg-white text-black font-black text-[10px] py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all uppercase tracking-widest mb-6 border border-gray-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Connexion Google
          </button>

          {/* SÉPARATEUR */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">OU</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Identifiant Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#fb201e] transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-bold text-xs outline-none focus:border-[#fb201e] focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <Link to="/forgot-password" size={16} className="text-[8px] font-black text-[#fb201e] uppercase tracking-tighter hover:underline">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#fb201e] transition-colors" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-bold text-xs outline-none focus:border-[#fb201e] focus:bg-white/10 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                <AlertCircle className="text-red-500" size={16} />
                <p className="text-[10px] font-bold text-red-500 uppercase">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#fb201e] text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-red-600/20 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group active:scale-[0.98] mt-6 uppercase tracking-widest"
            >
              Lancer la Session <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer de la carte */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Pas de compte ?{" "}
              <Link to="/register" className="text-white hover:text-[#fb201e] transition-colors ml-1">
                Créer un profil
              </Link>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
}