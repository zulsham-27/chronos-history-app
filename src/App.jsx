import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

// API URL Backend
const API_URL = "https://chronos-history-app.onrender.com/api/topics";

// --- KOMPONEN NAVBAR ---
function Navbar({ isAdmin, setIsAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-serif font-bold tracking-wider text-amber-500 group-hover:text-amber-400 transition">
            AL-TARIKH
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-sans">
            ARKIB SEJARAH
          </span>
        </Link>

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

// --- HALAMAN UTAMA (HOME) ---
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
      <header className="relative py-16 px-4 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-500 mb-4 tracking-tight">
            AL-TARIKH
          </h1>
          <p className="text-lg text-slate-400 font-serif italic mb-8 max-w-2xl mx-auto">
            "Menelusuri Khazanah Peristiwa & Tamadun Yang Membentuk Peradaban Dunia."
          </p>

          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Cari peristiwa, zaman, atau wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-lg"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif font-bold text-slate-200 mb-6 border-l-4 border-amber-500 pl-3">
          Koleksi Peristiwa Sejarah
        </h2>

        {loading ? (
          <p className="text-slate-400 italic">Memuatkan arkib...</p>
        ) : filteredTopics.length === 0 ? (
          <p className="text-slate-500 italic">Tiada rekod sejarah dijumpai.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <article
                key={topic.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition flex flex-col"
              >
                {topic.image && (
                  <img src={topic.image} alt={topic.title} className="h-48 w-full object-cover" />
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold mb-2">
                      <span>{topic.period || "Zaman"}</span>
                      {topic.region && <span>• {topic.region}</span>}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-slate-100 mb-2">{topic.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3 mb-4">{topic.short_description}</p>
                  </div>
                  <Link
                    to={`/topic/${topic.id}`}
                    className="inline-flex items-center text-sm font-semibold text-amber-400 hover:text-amber-300"
                  >
                    Baca Ulasan Penuh &rarr;
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

  if (!topic) return <div className="p-8 text-center text-slate-400">Memuatkan peristiwa...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-100">
      <Link to="/" className="text-amber-500 hover:underline mb-6 inline-block">&larr; Kembali ke Utama</Link>
      <h1 className="text-4xl font-serif font-bold text-amber-500 mb-2">{topic.title}</h1>
      <p className="text-sm text-slate-400 mb-6">{topic.period} | {topic.region}</p>
      {topic.image && <img src={topic.image} alt={topic.title} className="w-full h-80 object-cover rounded-xl mb-6" />}
      <p className="text-lg font-serif italic text-slate-300 mb-6 bg-slate-900 p-4 rounded-lg border-l-4 border-amber-500">
        {topic.short_description}
      </p>
      <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed whitespace-pre-line">
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
    <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-xl">
      <h2 className="text-2xl font-serif font-bold text-amber-500 mb-6 text-center">Log Masuk Pentadbir Al-Tarikh</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Nama Pengguna</label>
          <input
            type="text"
            className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 text-white"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Kata Laluan</label>
          <input
            type="password"
            className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 text-white"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-500 font-bold rounded text-white transition">
          Log Masuk
        </button>
      </form>
    </div>
  );
}

// --- HALAMAN ADMIN ---
function AdminPage({ isAdmin }) {
  const [form, setForm] = useState({ title: "", period: "", region: "", short_description: "", content: "", image: "" });
  const navigate = useNavigate();

  if (!isAdmin) return <div className="p-8 text-center text-rose-500">Akses Ditolak. Sila log masuk dahulu.</div>;

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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold text-amber-500 mb-6">Tambah Peristiwa Sejarah Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
        <input
          placeholder="Tajuk Peristiwa"
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Zaman (cth: Zaman Kesultanan Melayu Melaka)"
            className="p-3 bg-slate-800 border border-slate-700 rounded text-white"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
          />
          <input
            placeholder="Wilayah / Negara (cth: Tanah Melayu)"
            className="p-3 bg-slate-800 border border-slate-700 rounded text-white"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />
        </div>
        <input
          placeholder="URL Gambar (http://...)"
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <textarea
          placeholder="Ringkasan Peristiwa"
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white h-20"
          value={form.short_description}
          onChange={(e) => setForm({ ...form, short_description: e.target.value })}
        />
        <textarea
          placeholder="Ulasan Sejarah Penuh (Kandungan)"
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded text-white h-40"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button type="submit" className="px-6 py-3 bg-amber-600 hover:bg-amber-500 font-bold rounded text-white">
          Simpan Rekod Sejarah
        </button>
      </form>
    </div>
  );
}

// --- UTAMA APP ---
export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
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