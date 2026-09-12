import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTopicById } from "../services/api";
import { ArrowLeft } from "lucide-react";

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    getTopicById(id).then((data) => setTopic(data));
  }, [id]);

  if (!topic) {
    return (
      <div className="mx-auto max-w-7xl px-6 pt-32 text-center text-zinc-100">
        <h2 className="text-3xl font-bold">Topik Tidak Dijumpai...</h2>
        <Link to="/" className="mt-4 inline-block text-amber-400">Kembali ke Homepage</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-24">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft size={16} /> Kembali ke History Archive
        </Link>
        <div className="text-sm font-semibold uppercase tracking-widest text-amber-400">{topic.period} • {topic.region}</div>
        <h1 className="mt-2 text-5xl font-black">{topic.title}</h1>

        {topic.image && (
          <img src={topic.image} alt={topic.title} className="mt-8 h-96 w-full rounded-3xl object-cover border border-white/10" />
        )}

        <div className="mt-8 text-lg leading-relaxed text-zinc-300 whitespace-pre-line">
          {topic.content}
        </div>
      </div>
    </div>
  );
}