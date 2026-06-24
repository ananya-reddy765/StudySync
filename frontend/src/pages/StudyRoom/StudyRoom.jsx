// src/pages/StudyRoom/StudyRoom.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "peerjs";
import axios from "axios";
import socket from "../../lib/socket";

import LiveChat   from "../../components/studyroom/LiveChat";
import Whiteboard from "../../components/studyroom/Whiteboard";
import VideoCall  from "../../components/studyroom/VideoCall";
import { ArrowLeft, Loader2, Users, BookOpen } from "lucide-react";

function getCurrentUserName() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "Anonymous";
    return JSON.parse(atob(token.split(".")[1])).name || "Anonymous";
  } catch {
    return "Anonymous";
  }
}

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const StudyRoom = () => {
  const { roomId }  = useParams();
  const navigate    = useNavigate();
  const userName    = getCurrentUserName();

  const [room,    setRoom]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [peer,    setPeer]    = useState(null);
  const [users,   setUsers]   = useState([]);

  // ── Fetch room details ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/api/study-rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoom(data);
      } catch (err) {
        setError(err.response?.data?.message || "Room not found or access denied.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  // ── PeerJS + Socket join ────────────────────────────────────────────────────
  useEffect(() => {
    if (!room) return;

    const p = new Peer(undefined, {
      host: "0.peerjs.com",
      port: 443,
      secure: true,
    });

    p.on("open", (id) => {
      socket.emit("join-room", { roomId, userName, peerId: id });
    });

    p.on("error", (err) => console.error("PeerJS:", err));
    setPeer(p);

    // Track room users
    socket.on("room-users", setUsers);

    return () => {
      socket.emit("leave-room", { roomId });
      socket.off("room-users", setUsers);
      p.destroy();
    };
  }, [room, roomId, userName]);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => navigate("/study-rooms")}
          className="text-purple-400 text-sm underline"
        >
          ← Back to Study Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate("/study-rooms")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-sm transition"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex items-center gap-2 ml-2">
          <BookOpen size={16} className="text-purple-400" />
          <h1 className="font-bold text-slate-100 text-base">{room?.roomName}</h1>
          {room?.subject && (
            <span className="text-[11px] bg-purple-600/20 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
              {room.subject}
            </span>
          )}
        </div>

        {/* Online users */}
        <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Users size={13} />
          <span>{users.length || 1} online</span>
          {users.slice(0, 4).map((u) => (
            <span
              key={u.socketId}
              className="w-6 h-6 rounded-full bg-purple-600/40 border border-purple-500/30 flex items-center justify-center text-[10px] font-bold text-purple-300"
              title={u.userName}
            >
              {u.userName?.[0]?.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Whiteboard — takes most of the space */}
        <div className="flex-1 p-4 min-w-0">
          <Whiteboard roomId={roomId} />
        </div>

        {/* Right sidebar — Video + Chat */}
        <div className="w-[340px] shrink-0 flex flex-col gap-3 p-4 border-l border-slate-800 overflow-y-auto">
          <VideoCall peer={peer} roomId={roomId} userName={userName} />
          <LiveChat  roomId={roomId} userName={userName} />
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;