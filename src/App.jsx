import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "https://chronos-history-app.onrender.com/api/topics";

// --- NAVIGATION BAR (MODERN GLASSMORPHISM) ---
function Navbar({ isAdmin, setIsAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span className="text-slate-950 font-bold font-serif text-xl">T</span>
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-slate-100 group-hover:text-amber-400 transition">
              AL-TARIKH
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-amber-500/80">
              Digital Archive
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-slate-300 hover:text-amber-400 transition">
            Utama
          </Link>

          {isAdmin ? (
            <>
              <Link to="/admin" className="text-slate-300 hover:text-amber-400 transition">
                Panel Admin
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 px-4 py-1.5 rounded-full transition text-xs font-semibold"
              >
                Log Keluar
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-full transition shadow-lg shadow-amber-500/10 text-xs"
            >
              Log Masuk Pentadbir
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// --- HALAMAN UTAMA (MODERN HERO & GRID) ---
function HomePage() {
  const [topics, setTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTopics(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTopics = topics.filter(
    (t) =>
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.period?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.region?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <header className="relative py-24 px-4 text-center overflow-hidden border-b border-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-mono font-medium tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 rounded-full">
            Gerbang Arkib Sejarah Dunia
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-100 mb-6">
            Menerokai <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Peradaban</span> Lalu.
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Himpunan naratif sejarah, peristiwa penting, dan khazanah tamadun manusia yang membentuk dunia hari ini.
          </p>

          {/* Input Carian Modern */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Cari kata kunci, peristiwa, atau wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 shadow-2xl transition"
            />
          </div>
        </div>
      </header>

      {/* Grid Rekod Sejarah */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-wide text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Koleksi Peristiwa
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {filteredTopics.length} Rekod Diperolehi
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 font-mono">Memuatkan data arkib...</div>
        ) : filteredTopics.length === 0 ? (
          <div className="py-20 text-center text-slate-600">Tiada rekod sejarah dijumpai.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTopics.map((topic) => (
              <article
                key={topic.id}
                className="group relative bg-slate-900/50 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col"
              >
                {topic.image && (
                  <div className="h-52 w-full overflow-hidden bg-slate-950">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {topic.period || "Zaman Unknown"}
                      </span>
                      {topic.region && (
                        <span className="text-[11px] text-slate-400 font-mono">• {topic.region}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-amber-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                      {topic.short_description}
                    </p>
                  </div>
                  <Link
                    to={`/topic/${topic.id}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 tracking-wider uppercase"
                  >
                    Baca Ulasan <span>&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// --- HALAMAN DETAIL ---
function DetailPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => setTopic(data));
  }, [id]);

  if (!topic) return <div className="p-20 text-center text-slate-500 font-mono">Memuatkan peristiwa...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-100">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-amber-400 mb-8 transition">
        &larr; Kembali ke Utama
      </Link>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {topic.period}
        </span>
        <span className="text-xs font-mono text-slate-400">{topic.region}</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-6 leading-tight">{topic.title}</h1>
      
      {topic.image && (
        <img src={topic.image} alt={topic.title} className="w-full h-96 object-cover rounded-2xl mb-8 border border-slate-800" />
      )}
      
      <p className="text-lg text-slate-300 mb-8 bg-slate-900/60 p-6 rounded-2xl border-l-4 border-amber-500 italic">
        "{topic.short_description}"
      </p>

      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-base">
        {topic.content}
      </div>
    </div>
  );
}

// --- HALAMAN LOGIN ---
function LoginPage({ setIsAdmin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "admin" && pass === "chronos123") {
      setIsAdmin(true);
      navigate("/admin");
    } else {
      alert("Pengenalan Pentadbir Salah!");
    }
  };

  return (
    <div className="max-w-md mx-auto my-24 px-4">
      <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center">Akses Pentadbir</h2>
        <p className="text-xs text-slate-500 text-center mb-8">Sila masukkan kelayakan anda untuk mengurus arkib Al-Tarikh.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Nama Pengguna</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500/50"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Kata Laluan</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500/50"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 font-bold rounded-xl text-slate-950 transition shadow-lg shadow-amber-500/10 mt-4">
            Log Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

// --- HALAMAN ADMIN ---
function AdminPage({ isAdmin }) {
  const [form, setForm] = useState({ title: "", period: "", region: "", short_description: "", content: "", image: "" });
  const navigate = useNavigate();

  if (!isAdmin) return <div className="p-20 text-center text-rose-500 font-mono">Akses Ditolak. Sila log masuk dahulu.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Peristiwa sejarah berjaya ditambah!");
    navigate("/");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">Tambah Peristiwa Sejarah Baru</h1>
      <p className="text-xs text-slate-500 mb-8 font-mono">Bina rekod digital baharu ke dalam pangkalan data Al-Tarikh.</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/60 p-8 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Tajuk Peristiwa</label>
          <input
            placeholder="cth: Pembentukan Persekutuan Malaysia 1963"
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Zaman / Abad</label>
            <input
              placeholder="cth: Abad ke-20"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Wilayah / Negara</label>
            <input
              placeholder="cth: Asia Tenggara"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">URL Gambar</label>
          <input
            placeholder="https://..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500/50"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Ringkasan Ringkas</label>
          <textarea
            placeholder="Ringkasan 1-2 ayat..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white h-24 focus:outline-none focus:border-amber-500/50"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Kandungan Ulasan Sejarah</label>
          <textarea
            placeholder="Tulis ulasan penuh peristiwa..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white h-48 focus:outline-none focus:border-amber-500/50"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 font-bold rounded-xl text-slate-950 transition shadow-lg shadow-amber-500/10">
          Simpan & Terbitkan Rekod
        </button>
      </form>
    </div>
  );
}

// --- APP UTAMA ---
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:id" element={<DetailPage />} />
          <Route path="/admin" element={<AdminPage isAdmin={isAdmin} />} />
          <Route path="/login" element={<LoginPage setIsAdmin={setIsAdmin} />} />
        </Routes>
      </div>
    </Router>
  );
}