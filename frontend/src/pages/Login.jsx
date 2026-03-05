import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // --- CONNEXION STRICTE (EMAIL/MOT DE PASSE) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      // On reste volontairement vague sur l'erreur exacte par sécurité
      // (Ne pas dire si c'est l'email ou le mot de passe qui est faux)
      setError("Accès refusé. Identifiants incorrects.");
    } finally {
      setIsLoading(false);
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

      {/* Carte de Connexion Sécurisée */}
      <div className="relative z-10 w-full max-w-[400px] px-6">
        <div className="bg-[#1a1a1a] border border-[#fb201e]/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(251,32,30,0.1)] backdrop-blur-sm">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#fb201e]/10 border border-[#fb201e]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#fb201e]" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
              Accès <span className="text-[#fb201e]">Admin</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
              Espace restreint et sécurisé
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Identifiant Admin</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#fb201e] transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="admin@autolife.com"
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
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#fb201e] transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white font-bold text-xs outline-none focus:border-[#fb201e] focus:bg-white/10 transition-all"
                  required
                />
                {/* Bouton afficher/masquer le mot de passe */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Affichage des erreurs */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 animate-in fade-in zoom-in-95 duration-300">
                <AlertCircle className="text-red-500 min-w-[16px]" size={16} />
                <p className="text-[10px] font-bold text-red-500 uppercase">{error}</p>
              </div>
            )}

            {/* Bouton de connexion */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#fb201e] text-white font-black text-xs py-4 rounded-xl shadow-lg shadow-red-600/20 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group active:scale-[0.98] mt-6 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">Vérification...</span>
              ) : (
                <>Accéder au Dashboard <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Petit lien discret en cas d'oubli */}
          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-[9px] font-black text-gray-600 uppercase tracking-widest hover:text-[#fb201e] transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}