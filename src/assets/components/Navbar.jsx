import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isAdmin, setIsAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Penjenamaan Utama */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-serif font-bold tracking-wider text-amber-500 group-hover:text-amber-400 transition">
            AL-TARIKH
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans">
            ARKIB SEJARAH
          </span>
        </Link>

        {/* Menu Pautan */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-amber-400 transition">
            Utama
          </Link>

          {isAdmin ? (
            <>
              <Link to="/admin" className="hover:text-amber-400 transition">
                Panel Pengurusan
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded transition"
              >
                Log Keluar
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded transition shadow-md"
            >
              Log Masuk Pentadbir
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}