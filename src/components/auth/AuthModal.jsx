import React, { useState } from "react";
import { X, User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, register, onAuthSuccess } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState({ username: "", password: "", email: "", first_name: "", last_name: "" });

  if (!authModalOpen) return null;

  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    if (!fields.username || !fields.password) { setError("Username and password are required."); return; }
    setLoading(true);
    try {
      if (authModalTab === "login") {
        await login(fields.username, fields.password);
      } else {
        if (!fields.email) { setError("Email is required."); setLoading(false); return; }
        await register(fields);
      }
      onAuthSuccess();
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setAuthModalOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded shadow-2xl z-10 overflow-hidden">

        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-liban-dark text-white">
          <h2 className="font-bold text-sm">My Account</h2>
          <button onClick={() => setAuthModalOpen(false)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          {["login", "register"].map((tab) => (
            <button key={tab} onClick={() => { setAuthModalTab(tab); setError(""); }}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors cursor-pointer ${authModalTab === tab ? "text-brand-red border-b-2 border-brand-red" : "text-gray-500 hover:text-gray-700"}`}>
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {authModalTab === "register" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">First Name</label>
                <input value={fields.first_name} onChange={set("first_name")} placeholder="John"
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Last Name</label>
                <input value={fields.last_name} onChange={set("last_name")} placeholder="Doe"
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={fields.username} onChange={set("username")} placeholder="your_username"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red" />
            </div>
          </div>

          {authModalTab === "register" && (
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={fields.email} onChange={set("email")} placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type={showPassword ? "text" : "password"} value={fields.password} onChange={set("password")} placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand-red" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-brand-red bg-red-50 px-3 py-2 rounded">{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-brand-red text-white py-2.5 rounded font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer">
            {loading ? "Please wait..." : authModalTab === "login" ? "Sign In" : "Create Account"}
          </button>

          <p className="text-xs text-center text-gray-500">
            {authModalTab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setAuthModalTab(authModalTab === "login" ? "register" : "login"); setError(""); }}
              className="text-brand-red font-semibold cursor-pointer hover:underline">
              {authModalTab === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
