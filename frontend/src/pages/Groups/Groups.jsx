import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../../services/groupService";
import CreateGroupModal from "../../components/groups/CreateGroupModal";
import JoinGroupModal from "../../components/groups/JoinGroupModal";
import { Users, Plus, LogIn, BookOpen, ChevronRight, Search } from "lucide-react";

const CATEGORY_STYLES = {
  General:    { bg: "bg-slate-100",   text: "text-slate-600",   dot: "bg-slate-400"   },
  Math:       { bg: "bg-blue-50",     text: "text-blue-600",    dot: "bg-blue-400"    },
  Science:    { bg: "bg-emerald-50",  text: "text-emerald-600", dot: "bg-emerald-400" },
  Language:   { bg: "bg-amber-50",    text: "text-amber-600",   dot: "bg-amber-400"   },
  History:    { bg: "bg-orange-50",   text: "text-orange-600",  dot: "bg-orange-400"  },
  Technology: { bg: "bg-violet-50",   text: "text-violet-600",  dot: "bg-violet-400"  },
  "AI/ML":    { bg: "bg-pink-50",     text: "text-pink-600",    dot: "bg-pink-400"    },
};

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
];

function GroupCard({ group, onClick }) {
  const cat = CATEGORY_STYLES[group.category] || CATEGORY_STYLES.General;
  const memberCount = group.members?.length ?? 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:shadow-violet-100 hover:border-violet-200 transition-all duration-200 cursor-pointer flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
          {group.category || "General"}
        </span>
        <ChevronRight
          size={16}
          className="text-gray-300 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all mt-0.5"
        />
      </div>

      {/* Name & description */}
      <div>
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-1 mb-1">
          {group.name}
        </h3>
        {group.description ? (
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {group.description}
          </p>
        ) : (
          <p className="text-sm text-gray-300 italic">No description</p>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        {/* Member avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {(group.members || []).slice(0, 3).map((m, i) => (
              <div
                key={m._id || i}
                className={`w-6 h-6 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white`}
              >
                {(m.name?.[0] || "?").toUpperCase()}
              </div>
            ))}
            {memberCount > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-[10px] font-bold ring-2 ring-white">
                +{memberCount - 3}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </span>
        </div>
        <span className="text-xs font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
          Open →
        </span>
      </div>
    </div>
  );
}

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const navigate = useNavigate();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGroups(); }, []);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 px-6 pt-10 pb-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-violet-300 text-sm font-medium mb-1 tracking-wide uppercase">
                StudySync
              </p>
              <h1 className="text-3xl font-bold text-white mb-1">Study Groups</h1>
              <p className="text-violet-200 text-sm">
                {groups.length > 0
                  ? `${groups.length} active group${groups.length !== 1 ? "s" : ""} · collaborate and grow together`
                  : "Create your first group and invite your friends"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowJoin(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-medium transition backdrop-blur-sm"
              >
                <LogIn size={15} />
                Join via Invite
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-violet-700 rounded-xl text-sm font-semibold hover:bg-violet-50 transition shadow-sm"
              >
                <Plus size={15} />
                Create Group
              </button>
            </div>
          </div>

          {/* Search — overlaps into content area */}
          <div className="relative mt-8">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups by name or topic…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-6 pb-12">

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-5 bg-gray-100 rounded-full w-20 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-5" />
                <div className="h-px bg-gray-100 mb-3" />
                <div className="flex gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full" />
                  <div className="w-6 h-6 bg-gray-100 rounded-full" />
                  <div className="h-3 bg-gray-100 rounded w-16 my-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <p className="text-red-500 font-medium mb-3">{error}</p>
            <button onClick={fetchGroups} className="text-violet-600 text-sm underline">
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="text-violet-500" size={26} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {search ? "No groups match your search" : "No groups yet"}
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              {search
                ? "Try different keywords or clear your search."
                : "Start by creating a group — invite your classmates with a single link."}
            </p>
            {!search && (
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition"
              >
                <Plus size={15} />
                Create your first group
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {search && (
              <p className="text-sm text-gray-400 mb-4">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((group) => (
                <GroupCard
                  key={group._id}
                  group={group}
                  onClick={() => navigate(`/groups/${group._id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={(newGroup) => {
            setGroups((prev) => [newGroup, ...prev]);
            setShowCreate(false);
            navigate(`/groups/${newGroup._id}`);
          }}
        />
      )}

      {showJoin && (
        <JoinGroupModal
          onClose={() => setShowJoin(false)}
          onJoined={(groupId) => {
            setShowJoin(false);
            navigate(`/groups/${groupId}`);
          }}
        />
      )}
    </div>
  );
}