import { useState, useRef } from "react";
import { joinGroup, getGroups } from "../../services/groupService";
import { X, LogIn } from "lucide-react";

export default function JoinGroupModal({ onClose, onJoined }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleInput = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (val.length <= 6) setCode(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) { setError("Please enter an invite code."); return; }
    if (trimmed.length !== 6) { setError("Invite codes are exactly 6 characters."); return; }

    try {
      setLoading(true);
      setError("");
      const data = await joinGroup(trimmed);
      onJoined(data.groupId);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired invite code.";
      if (msg === "You are already a member") {
        try {
          const groups = await getGroups();
          const match = groups.find((g) => g.inviteCode === trimmed.toUpperCase());
          if (match) { onJoined(match._id); return; }
        } catch (_) {}
        setError("You are already a member of this group. Opening it now...");
        setTimeout(onClose, 2000);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <LogIn size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Join a Group</h2>
              <p className="text-violet-200 text-xs">Enter the code shared by your group admin</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
              <span className="font-bold">!</span> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              6-Character Invite Code
            </label>

            <div className="flex justify-center gap-2 cursor-text" onClick={() => inputRef.current?.focus()}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-2xl transition-all select-none ${
                    code[i]
                      ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                      : i === code.length
                      ? "border-violet-400 bg-violet-50/50"
                      : "border-gray-200 bg-gray-50 text-gray-300"
                  }`}
                >
                  {code[i] ?? (i === code.length
                    ? <span className="w-px h-6 bg-violet-500 animate-pulse inline-block" />
                    : <span className="text-gray-300 text-lg">·</span>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              {code.length}/6 · click boxes and type
            </p>

            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleInput}
              maxLength={6}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
              aria-label="Invite code input"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="flex-1 px-4 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Joining...</>
              ) : (
                <><LogIn size={15} /> Join Group</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
