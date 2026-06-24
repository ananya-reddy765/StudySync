// src/components/studyroom/LiveChat.jsx
import { useEffect, useRef, useState } from "react";
import socket from "../../lib/socket";
import { Send, MessageCircle } from "lucide-react";

const LiveChat = ({ roomId, userName }) => {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [typing, setTyping]       = useState("");
  const bottomRef                 = useRef(null);
  const typingTimer               = useRef(null);

  // ── Socket listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const onMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    const onTyping = (name) => {
      if (name === userName) return;
      setTyping(`${name} is typing…`);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTyping(""), 2000);
    };

    socket.on("receive-message", onMessage);
    socket.on("typing", onTyping);

    return () => {
      socket.off("receive-message", onMessage);
      socket.off("typing", onTyping);
    };
  }, [userName]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    socket.emit("send-message", { roomId, sender: userName, message: text });
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      socket.emit("typing", { roomId, userName });
    }
  };

  // ── Time formatter ──────────────────────────────────────────────────────────
  const fmt = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-[420px] bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60 bg-slate-800/80">
        <MessageCircle size={16} className="text-purple-400" />
        <span className="text-sm font-semibold text-slate-200">Live Chat</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <p className="text-center text-slate-500 text-xs mt-8">
            No messages yet — say hello! 👋
          </p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender === userName;
          return (
            <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && (
                <span className="text-[10px] text-purple-400 font-medium mb-1 px-1">
                  {msg.sender}
                </span>
              )}
              <div
                className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "bg-purple-600 text-white rounded-br-sm"
                    : "bg-slate-700 text-slate-100 rounded-bl-sm"
                }`}
              >
                {msg.message}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {fmt(msg.createdAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator */}
      {typing && (
        <div className="px-4 pb-1">
          <span className="text-[11px] text-slate-500 italic">{typing}</span>
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-slate-700/60 bg-slate-800/80 flex gap-2">
        <input
          className="flex-1 bg-slate-700/60 text-slate-100 placeholder-slate-500 text-sm px-3 py-2 rounded-xl border border-slate-600/40 focus:outline-none focus:border-purple-500/60 transition"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 rounded-xl transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default LiveChat;