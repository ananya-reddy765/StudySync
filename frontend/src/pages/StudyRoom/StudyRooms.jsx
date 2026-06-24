// src/pages/StudyRooms/StudyRooms.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus, X, BookOpen, Users, Loader2,
  Clock, ChevronRight, Search,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SUBJECTS = ["General", "Mathematics", "Science", "History", "English",
                  "Computer Science", "Physics", "Chemistry", "Biology", "Art"];

const StudyRooms = () => {
  const navigate = useNavigate();

  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");

  // Create form
  const [showForm,    setShowForm]    = useState(false);
  const [formData,    setFormData]    = useState({ roomName: "", subject: "General", description: "" });
  const [creating,    setCreating]    = useState(false);
  const [createError, setCreateError] = useState("");

  const token = () => localStorage.getItem("token");
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  // ── Fetch rooms ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API}/api/study-rooms`, { headers: headers() });
        setRooms(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load rooms.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // ── Create room ─────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    setCreateError("");
    if (!formData.roomName.trim()) return setCreateError("Room name is required.");
    setCreating(true);
    try {
      const { data } = await axios.post(`${API}/api/study-rooms`, formData, { headers: headers() });
      setRooms((prev) => [data, ...prev]);
      setShowForm(false);
      setFormData({ roomName: "", subject: "General", description: "" });
      navigate(`/study-rooms/${data._id}`);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create room.");
    } finally {
      setCreating(false);
    }
  };

  const filtered = rooms.filter((r) =>
    r.roomName?.toLowerCase().includes(search.toLowerCase()) ||
    r.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Study Rooms</h1>
            <p className="text-slate-400 text-sm mt-1">
              Join a room or create your own collaborative space
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setCreateError(""); }}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2.5 rounded-xl transition shadow-lg shadow-purple-900/30"
          >
            <Plus size={16} /> New Room
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/60 transition"
            placeholder="Search by name or subject…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Create form overlay */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-slate-100">Create a New Room</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-200">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">
                    Room Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="w-full bg-slate-700/60 border border-slate-600/40 text-slate-100 placeholder-slate-500 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/60 transition"
                    placeholder="e.g. Physics Finals Prep"
                    value={formData.roomName}
                    onChange={(e) => setFormData((f) => ({ ...f, roomName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">Subject</label>
                  <select
                    className="w-full bg-slate-700/60 border border-slate-600/40 text-slate-100 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/60 transition"
                    value={formData.subject}
                    onChange={(e) => setFormData((f) => ({ ...f, subject: e.target.value }))}
                  >
                    {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1 block">
                    Description <span className="text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-700/60 border border-slate-600/40 text-slate-100 placeholder-slate-500 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-purple-500/60 transition resize-none"
                    placeholder="What will you be studying?"
                    value={formData.description}
                    onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>

                {createError && (
                  <p className="text-red-400 text-xs">{createError}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition"
                  >
                    {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                    {creating ? "Creating…" : "Create Room"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-600/60 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-purple-400" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-3">
            <BookOpen size={40} className="text-slate-700" />
            <p className="text-slate-400 font-medium">
              {search ? "No rooms match your search" : "No study rooms yet"}
            </p>
            <p className="text-slate-600 text-sm">
              {search ? "Try a different term" : "Be the first to create one!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((room) => (
              <button
                key={room._id}
                onClick={() => navigate(`/study-rooms/${room._id}`)}
                className="group text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/40 rounded-2xl p-5 transition shadow-sm hover:shadow-purple-900/20 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center">
                    <BookOpen size={18} className="text-purple-400" />
                  </div>
                  <span className="text-[11px] bg-slate-700/60 text-slate-400 border border-slate-600/40 px-2 py-0.5 rounded-full">
                    {room.subject || "General"}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-100 text-sm mb-1 group-hover:text-purple-300 transition">
                  {room.roomName}
                </h3>
                {room.description && (
                  <p className="text-slate-500 text-xs line-clamp-2 mb-3">{room.description}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/40">
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock size={11} />
                    {fmt(room.createdAt)}
                  </div>
                  <div className="flex items-center gap-1 text-purple-400 text-xs group-hover:gap-2 transition-all">
                    Join <ChevronRight size={13} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyRooms;