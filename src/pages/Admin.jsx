import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTopics, saveTopic, deleteTopic, uploadImage } from "../services/api";
import { Plus, Trash2, Edit3, ArrowLeft, Upload, LogOut } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ 
    id: "", 
    title: "", 
    period: "", 
    region: "", 
    shortDescription: "", 
    content: "", 
    image: "" 
  });

  // Semak status Authentication
  useEffect(() => {
    const isAuth = localStorage.getItem("chronos_admin_auth");
    if (!isAuth) {
      navigate("/login");
    } else {
      refreshData();
    }
  }, [navigate]);

  const refreshData = async () => {
    const data = await getTopics();
    setTopics(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("chronos_admin_auth");
    navigate("/");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadedUrl = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: uploadedUrl }));
    } catch (err) {
      alert("Gagal memuat naik gambar. Sila cuba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return alert("Sila masukkan tajuk!");
    await saveTopic(form);
    setForm({ id: "", title: "", period: "", region: "", shortDescription: "", content: "", image: "" });
    refreshData();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      title: item.title,
      period: item.period || "",
      region: item.region || "",
      shortDescription: item.short_description || "",
      content: item.content || "",
      image: item.image || "",
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Adakah anda pasti mahu memadam topik ini dari MySQL?")) {
      await deleteTopic(id);
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 pt-10 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            <ArrowLeft size={16} /> Kembali ke Homepage
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-amber-400">CHRONOS — Admin Control Panel</h1>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* FORM ADD / EDIT */}
          <div className="lg:col-span-1 bg-zinc-900 border border-white/10 p-6 rounded-3xl h-fit">
            <h2 className="text-xl font-bold mb-4">{form.id ? "Edit Topik Sejarah" : "Tambah Topik Sejarah Baru"}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Tajuk (cth: Ancient Egypt)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Zaman / Period (cth: 3100 BCE – 30 BCE)"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Kawasan / Region (cth: North Africa)"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
              />

              {/* INPUT GAMBAR */}
              <div className="flex flex-col gap-2 rounded-xl border border-white/10 p-3 bg-zinc-950">
                <label className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                  <Upload size={14} className="text-amber-400" /> Gambar Cover (Upload / Link)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-amber-400 hover:file:bg-zinc-700 cursor-pointer"
                />
                {uploading && <span className="text-xs text-amber-400">Sedang memuat naik gambar...</span>}
                <input
                  type="text"
                  placeholder="Atau masukkan URL Gambar (https://...)"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="bg-zinc-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-amber-400"
                />
                {form.image && (
                  <img src={form.image} alt="Preview" className="h-24 w-full object-cover rounded-lg mt-1 border border-white/10" />
                )}
              </div>

              <textarea
                placeholder="Penerangan Ringkas (Short Description)"
                rows={2}
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
              />
              <textarea
                placeholder="Kandungan Sejarah (Content)"
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400"
              />
              <button type="submit" className="flex items-center justify-center gap-2 bg-amber-400 text-zinc-950 font-semibold py-3 rounded-xl hover:bg-amber-300">
                {form.id ? <Edit3 size={18} /> : <Plus size={18} />}
                {form.id ? "Kemaskini Topik" : "Simpan Topik"}
              </button>
            </form>
          </div>

          {/* LIST TOPICS */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Senarai Topik dalam MySQL ({topics.length})</h2>
            {topics.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-white/10 rounded-2xl">
                <div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.period} • {item.region}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2.5 bg-zinc-800 rounded-lg hover:text-amber-400">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-zinc-800 rounded-lg hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}