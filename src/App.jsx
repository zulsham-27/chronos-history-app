import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Crown, Search, Clock3, ChevronRight, ShieldCheck } from "lucide-react";
import { getTopics } from "./services/api";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import TopicDetail from "./pages/TopicDetail";

function Home() {
  const [search, setSearch] = useState("");
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    getTopics().then((data) => setTopics(data));
  }, []);

  const filteredTopics = topics.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-zinc-950">
              <Crown size={22} />
            </div>
            <div>
              <div className="text-lg font-bold tracking-[0.25em]">CHRONOS</div>
              <div className="text-[9px] uppercase tracking-[0.35em] text-zinc-500">History Archive</div>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <a href="#civilizations" className="text-sm text-zinc-300 hover:text-white">Civilizations</a>
            <Link to="/admin" className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 text-sm font-semibold text-amber-400 border border-amber-500/20 hover:bg-amber-500/20">
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-[70vh] items-center pt-24 overflow-hidden">
        <div className="relative mx-auto w-full max-w-7xl px-6 py-12">
          <div className="max-w-4xl">
            <div className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-amber-400">
              <Clock3 size={16} /> Explore Human History
            </div>
            <h1 className="text-5xl font-black leading-tight sm:text-7xl">
              THE STORIES THAT SHAPED <span className="text-amber-400">OUR WORLD.</span>
            </h1>
            <div className="mt-8 max-w-2xl">
              <div className="flex items-center rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
                <Search className="ml-3 text-zinc-400" size={22} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search civilizations, rulers or events..."
                  className="w-full bg-transparent px-4 py-3 outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CIVILIZATIONS */}
      <section id="civilizations" className="bg-zinc-950 py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-4xl font-bold mb-8">Great Civilizations</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredTopics.map((item) => (
              <article key={item.id} className="group relative min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
                {item.image && (
                  <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <div className="mb-2 text-sm font-semibold text-amber-400">{item.period}</div>
                  <h3 className="text-3xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-zinc-300 line-clamp-2">{item.short_description}</p>
                  <Link to={`/topic/${item.id}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-amber-400 hover:text-amber-300">
                    Read Detail <ChevronRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/topic/:id" element={<TopicDetail />} />
      </Routes>
    </Router>
  );
}