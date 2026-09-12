import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Crown, Lock, ArrowLeft } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Default credential untuk Admin
    if (username === "admin" && password === "chronos123") {
      localStorage.setItem("chronos_admin_auth", "true");
      navigate("/admin");
    } else {
      setError("Username atau Password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 rounded-3xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft size={16} /> Kembali ke Utamapage
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-zinc-950">
            <Crown size={22} />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-zinc-400 block mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 bg-amber-400 text-zinc-950 font-semibold py-3 rounded-xl hover:bg-amber-300 transition"
          >
            <Lock size={18} /> Log Masuk Admin
          </button>
        </form>

        <p className="mt-4 text-xs text-zinc-500 text-center">
          Default: Username `admin` | Password `chronos123`
        </p>
      </div>
    </div>
  );
}