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
              Arkib Sejarah
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-slate-300 hover:text-amber-400 transition-colors">
            Utama
          </Link>

          {isAdmin ? (
            <>
              <Link to="/admin" className="text-slate-300 hover:text-amber-400 transition-colors">
                Panel Pengurusan
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 px-3.5 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold"
              >
                Log Keluar
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm text-xs tracking-wide"
            >
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
            Gerbang Arkib Sejarah Dunia
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-50 mb-4">
            AL-TARIKH
          </h1>
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
          <h2 className="text-lg font-bold tracking-tight text-slate-100 border-l-2 border-amber-500 pl-3">
            Koleksi Peristiwa Sejarah
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {filteredTopics.length} Rekod
          </span>
        </div>

        {loading ? (
          <p className="text-slate-500 italic text-sm">Memuatkan arkib...</p>
        ) : filteredTopics.length === 0 ? (
          <p className="text-slate-500 italic text-sm">Tiada rekod sejarah dijumpai.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <article
                key={topic.id}
                className="group bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden hover:border-slate-700 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {topic.image && (
                    <div className="h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={topic.image}
                        alt={topic.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium mb-2.5">
                      <span>{topic.period || "Zaman"}</span>
                      {topic.region && <span className="text-slate-600">• {topic.region}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 mb-2 leading-snug group-hover:text-amber-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                      {topic.short_description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/topic/${topic.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
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

  if (!topic) return <div className="p-12 text-center text-slate-500 text-sm">Memuatkan peristiwa...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-slate-100">
      <Link to="/" className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-amber-400 mb-8 transition-colors">
        &larr; Kembali ke Utama
      </Link>

      <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-3">
        <span>{topic.period}</span>
        {topic.region && <span className="text-slate-600">• {topic.region}</span>}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6 leading-tight">{topic.title}</h1>

      {topic.image && (
        <img src={topic.image} alt={topic.title} className="w-full h-80 object-cover rounded-xl mb-6 border border-slate-800" />
      )}

      <p className="text-base text-slate-300 mb-8 bg-slate-900/80 p-5 rounded-xl border-l-2 border-amber-500 italic leading-relaxed">
        {topic.short_description}
      </p>

      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
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
    <div className="max-w-md mx-auto my-16 px-6">
      <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold text-slate-100 mb-1 text-center">Log Masuk Pentadbir</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Sila masukkan maklumat laluan Al-Tarikh.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Nama Pengguna</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50 text-sm"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Kata Laluan</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500/50 text-sm"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
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
    <div
      className={`fixed top-20 right-6 z-[60] max-w-sm px-4 py-3 rounded-lg border shadow-xl text-sm font-medium flex items-center justify-between gap-3 ${
        isError
          ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{isError ? "⚠" : "✓"}</span>
        <span>{toast.message}</span>
      </div>
      <button onClick={onClose} className="text-xs opacity-60 hover:opacity-100">✕</button>
    </div>
  );
}

// --- KAD STATISTIK ---
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
  const emptyForm = { title: "", period: "", region: "", short_description: "", content: "", image: "" };

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
    if (isAdmin) {
      fetchTopics();
    }
  }, [isAdmin, fetchTopics]);

  const filteredTopics = useMemo(
    () =>
      topics.filter(
        (t) =>
          t.title?.toLowerCase().includes(adminSearch.toLowerCase()) ||
          t.period?.toLowerCase().includes(adminSearch.toLowerCase()) ||
          t.region?.toLowerCase().includes(adminSearch.toLowerCase())
      ),
    [topics, adminSearch]
  );

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-24 text-center px-6">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl">
          !
        </div>
        <h2 className="text-lg font-bold text-slate-100 mb-1.5">Akses Ditolak</h2>
        <p className="text-sm text-slate-400">Sila log masuk sebagai pentadbir untuk mengakses panel ini.</p>
        <Link
          to="/login"
          className="inline-block mt-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition"
        >
          Ke Halaman Log Masuk
        </Link>
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
        notify("success", "Peristiwa sejarah berjaya dikemaskini.");
        setEditingId(null);
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        notify("success", "Peristiwa sejarah berjaya ditambah.");
      }
      setForm(emptyForm);
      fetchTopics();
    } catch (err) {
      notify("error", "Operasi gagal. Sila cuba sekali lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      period: item.period || "",
      region: item.region || "",
      short_description: item.short_description || "",
      content: item.content || "",
      image: item.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Adakah anda pasti mahu memadam rekod ini? Tindakan ini tidak boleh dibatalkan.")) return;
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      notify("success", "Rekod berjaya dipadam.");
      if (editingId === id) handleCancelEdit();
      fetchTopics();
    } catch (err) {
      notify("error", "Gagal memadam rekod.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="border-b border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-950">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-xs font-mono font-medium tracking-wide text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full">
            Ruang Pentadbir
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1.5">Panel Pengurusan</h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Tambah, sunting, atau padam rekod peristiwa sejarah dalam pangkalan data Al-Tarikh.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 max-w-xl">
            <StatCard label="Jumlah Rekod" value={topics.length} accent="text-amber-400" />
            <StatCard label="Dipaparkan" value={filteredTopics.length} />
            <StatCard label="Status" value={editingId ? "Menyunting" : "Sedia"} accent={editingId ? "text-amber-400" : "text-emerald-400"} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 lg:sticky lg:top-24 space-y-5 bg-slate-900/80 p-6 rounded-xl border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {editingId ? "Kemaskini Peristiwa" : "Tambah Peristiwa Baru"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingId ? "Ubah maklumat rekod yang dipilih." : "Isi butiran di bawah untuk rekod baharu."}
              </p>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-slate-400 hover:text-slate-200 underline shrink-0 ml-3"
              >
                Batal
              </button>
            )}
          </div>

          <div className="h-px bg-slate-800" />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Tajuk Peristiwa <span className="text-amber-500">*</span>
            </label>
            <input
              placeholder="cth: Kejatuhan Kesultanan Melaka"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-sm transition"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Zaman</label>
              <input
                placeholder="cth: Kesultanan Melayu Melaka"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-sm transition"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Wilayah / Negara</label>
              <input
                placeholder="cth: Tanah Melayu"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-sm transition"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">URL Gambar</label>
            <input
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-sm transition"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            {form.image && (
              <div className="mt-2.5 h-28 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={form.image}
                  alt="Pratonton"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-300">Ringkasan Ringkas</label>
              <span className="text-[10px] font-mono text-slate-600">{form.short_description.length} aksara</span>
            </div>
            <textarea
              placeholder="Ringkasan pendek yang muncul pada kad senarai..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-sm h-20 resize-none transition"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Kandungan Ulasan Sejarah <span className="text-amber-500">*</span>
            </label>
            <textarea
              placeholder="Ulasan sejarah penuh untuk halaman detail..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-sm h-40 resize-none transition"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || saving}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed font-semibold rounded-lg text-slate-950 transition text-sm shadow-sm"
          >
            {saving ? "Menyimpan..." : editingId ? "Kemaskini Rekod" : "Simpan Rekod Baharu"}
          </button>
        </form>

        <div className="lg:col-span-3 bg-slate-900/80 p-6 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-base font-bold text-slate-100">
              Senarai Rekod <span className="text-slate-500 font-normal">({filteredTopics.length})</span>
            </h2>
            <input
              type="text"
              placeholder="Cari dalam senarai..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full sm:w-56 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-amber-500/50 transition"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-slate-800/40 animate-pulse" />
              ))}
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm italic">
                {adminSearch ? "Tiada rekod sepadan dengan carian." : "Tiada rekod disimpan lagi."}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredTopics.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-4 p-4 bg-slate-950 border rounded-lg transition ${
                    editingId === item.id ? "border-amber-500/50 ring-1 ring-amber-500/20" : "border-slate-800/80"
                  }`}
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-100 text-sm truncate">{item.title}</h3>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-x-2 mt-1">
                      {item.period && <span>{item.period}</span>}
                      {item.region && <span>• {item.region}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                      Sunting
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                    >
                      {deletingId === item.id ? "..." : "Padam"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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