import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "https://chronos-history-app.onrender.com/api/topics";

// --- NAVIGATION BAR ---
function Navbar({ isAdmin, setIsAdmin }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsAdmin(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500/20 transition-all duration-200">
            <span className="text-amber-400 font-bold font-serif text-lg">T</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-100 group-hover:text-amber-400 transition-colors">
              AL-TARIKH
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Sejarah Dunia
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-slate-300 hover:text-amber-400 transition-colors">Utama</Link>
          {isAdmin ? (
            <>
              <Link to="/admin" className="text-slate-300 hover:text-amber-400 transition-colors">Panel Pengurusan</Link>
              <button onClick={handleLogout} className="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 px-3.5 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold">
                Log Keluar
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm text-xs tracking-wide">
              Log Masuk Pentadbir
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// --- HALAMAN UTAMA ---
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
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <header className="relative border-b border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-950 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 text-xs font-mono font-medium tracking-wide text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
            QAIM FAIZ ARRIDHA BEKAS PELAJAR PROF SOLEHAH
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-50 mb-4">AL-TARIKH</h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-serif italic leading-relaxed">
            "Menelusuri Khazanah Peristiwa & Tamadun Yang Membentuk Peradaban Dunia."
          </p>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Cari peristiwa, zaman, atau wilayah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition shadow-sm"
            />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold tracking-tight text-slate-100 border-l-2 border-amber-500 pl-3">Koleksi Peristiwa Sejarah</h2>
          <span className="text-xs font-mono text-slate-500">{filteredTopics.length} Rekod</span>
        </div>
        {loading ? (
          <p className="text-slate-500 italic text-sm">Memuatkan arkib...</p>
        ) : filteredTopics.length === 0 ? (
          <p className="text-slate-500 italic text-sm">Tiada rekod sejarah dijumpai.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const topicId = topic.id || topic._id;
              return (
                <article key={topicId} className="group bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 transition duration-200 flex flex-col justify-between">
                  <div>
                    {topic.image && (
                      <div className="h-48 w-full overflow-hidden bg-slate-950">
                        <img src={topic.image} alt={topic.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium mb-2.5">
                        <span>{topic.period || "Zaman"}</span>
                        {topic.region && <span className="text-slate-600">- {topic.region}</span>}
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mb-2 leading-snug group-hover:text-amber-400 transition-colors">{topic.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">{topic.short_description}</p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex justify-between items-center">
                    <Link to={`/topic/${topicId}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                      Baca Ulasan Penuh &rarr;
                    </Link>
                  </div>
                </article>
              );
            })}
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
      .then((data) => setTopic(data))
      .catch((err) => console.error("Error fetching detail:", err));
  }, [id]);

  if (!topic) return <div className="p-12 text-center text-slate-500 text-sm">Memuatkan peristiwa...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-slate-100">
      <Link to="/" className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-amber-400 mb-8 transition-colors">
        &larr; Kembali ke Utama
      </Link>
      <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-3">
        <span>{topic.period}</span>
        {topic.region && <span className="text-slate-600">- {topic.region}</span>}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6 leading-tight">{topic.title}</h1>
      {topic.image && <img src={topic.image} alt={topic.title} className="w-full h-80 object-cover rounded-xl mb-6 border border-slate-800" />}
      <p className="text-base text-slate-300 mb-8 bg-slate-900/80 p-5 rounded-xl border-l-2 border-amber-500 italic leading-relaxed">
        {topic.short_description}
      </p>
      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base mb-10">
        {topic.content}
      </div>
      
      {topic.source && (
        <div className="mt-8 pt-6 border-t border-slate-800/60 bg-slate-900/40 p-4 rounded-lg">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Rujukan / Sumber Sejarah:</h3>
          {topic.source.startsWith("http") ? (
            <a href={topic.source} target="_blank" rel="noopener noreferrer" className="text-amber-400 text-sm hover:underline break-all">
              {topic.source}
            </a>
          ) : (
            <p className="text-slate-300 text-sm">{topic.source}</p>
          )}
        </div>
      )}
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
    <div className="max-w-md mx-auto my-16 px-6">
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold text-slate-100 mb-1 text-center">Log Masuk Pentadbir</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Sila masukkan maklumat laluan Al-Tarikh.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Nama Pengguna</label>
            <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50 text-sm" value={user} onChange={(e) => setUser(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Laluan</label>
            <input type="password" className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50 text-sm" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <button type="submit" className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 font-semibold rounded-lg text-slate-950 transition text-sm shadow-sm mt-2">
            Log Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

// --- NOTIFIKASI TOAST ---
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className={`fixed top-20 right-6 z-[60] max-w-sm px-4 py-3 rounded-lg border shadow-xl text-sm font-medium flex items-center justify-between gap-3 ${isError ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"}`}>
      <div className="flex items-center gap-2"><span>{isError ? "⚠" : "✓"}</span><span>{toast.message}</span></div>
      <button onClick={onClose} className="text-xs opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-5 py-4">
      <p className="text-[11px] uppercase tracking-wide font-mono text-slate-500 mb-1.5">{label}</p>
      <p className={`text-2xl font-bold ${accent || "text-slate-100"}`}>{value}</p>
    </div>
  );
}

// --- HALAMAN ADMIN ---
function AdminPage({ isAdmin }) {
  const emptyForm = { title: "", period: "", region: "", short_description: "", content: "", image: "", source: "" };

  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [adminSearch, setAdminSearch] = useState("");
  const [toast, setToast] = useState(null);

  const notify = (type, message) => setToast({ type, message });

  const fetchTopics = React.useCallback(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setTopics(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        notify("error", "Gagal memuatkan senarai rekod.");
      });
  }, []);

  useEffect(() => {
    if (isAdmin) fetchTopics();
  }, [isAdmin, fetchTopics]);

  const filteredTopics = useMemo(
    () =>
      topics.filter(
        (t) =>
          t.title?.toLowerCase().includes(adminSearch.toLowerCase()) ||
          t.period?.toLowerCase().includes(adminSearch.toLowerCase())
      ),
    [topics, adminSearch]
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 600; 
        const scaleSize = MAX_WIDTH / img.width;
        
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.5);
        setForm((prev) => ({ ...prev, image: compressedBase64 }));
      };
    };
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-24 text-center px-6">
        <h2 className="text-lg font-bold text-slate-100 mb-1.5">Akses Ditolak</h2>
        <Link to="/login" className="inline-block mt-6 bg-amber-500 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm">Ke Log Masuk</Link>
      </div>
    );
  }

  const isFormValid = form.title.trim() && form.content.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        notify("success", "Peristiwa berjaya dikemaskini.");
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        notify("success", "Peristiwa berjaya ditambah.");
      }
      setForm(