// src/components/studyroom/VideoCall.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../../lib/socket";
import {
  Video, VideoOff, Mic, MicOff, PhoneOff,
  Monitor, MonitorOff, Users, Maximize2,
} from "lucide-react";

const VideoCall = ({ peer, roomId, userName }) => {
  const localVideoRef  = useRef(null);
  const localStream    = useRef(null);
  const screenStream   = useRef(null);
  const peers          = useRef({});     // peerId → MediaConnection

  const [remoteStreams, setRemoteStreams] = useState([]); // [{peerId, stream, name}]
  const [inCall,        setInCall]        = useState(false);
  const [videoOn,       setVideoOn]       = useState(true);
  const [audioOn,       setAudioOn]       = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [expanded,      setExpanded]      = useState(null); // peerId of expanded tile

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const addRemoteStream = useCallback((peerId, stream, name = "Peer") => {
    setRemoteStreams((prev) => {
      if (prev.find((s) => s.peerId === peerId)) return prev;
      return [...prev, { peerId, stream, name }];
    });
  }, []);

  const removeRemoteStream = useCallback((peerId) => {
    setRemoteStreams((prev) => prev.filter((s) => s.peerId !== peerId));
    if (peers.current[peerId]) {
      peers.current[peerId].close();
      delete peers.current[peerId];
    }
  }, []);

  // ── Answer incoming calls once peer + stream ready ──────────────────────────
  useEffect(() => {
    if (!peer || !inCall) return;

    const handleCall = (call) => {
      call.answer(localStream.current);
      call.on("stream", (remoteStream) => {
        addRemoteStream(call.peer, remoteStream, call.metadata?.userName || "Peer");
      });
      call.on("close", () => removeRemoteStream(call.peer));
      peers.current[call.peer] = call;
    };

    peer.on("call", handleCall);
    return () => peer.off("call", handleCall);
  }, [peer, inCall, addRemoteStream, removeRemoteStream]);

  // ── Socket: new peer joined → call them ─────────────────────────────────────
  useEffect(() => {
    if (!peer || !inCall) return;

    const handlePeerJoined = ({ peerId: remotePeerId, userName: remoteName }) => {
      if (!localStream.current || !remotePeerId) return;
      const call = peer.call(remotePeerId, localStream.current, {
        metadata: { userName },
      });
      call.on("stream", (remoteStream) => {
        addRemoteStream(remotePeerId, remoteStream, remoteName);
      });
      call.on("close", () => removeRemoteStream(remotePeerId));
      peers.current[remotePeerId] = call;
    };

    const handlePeerLeft = ({ peerId: remotePeerId }) => {
      removeRemoteStream(remotePeerId);
    };

    socket.on("peer-connected",    handlePeerJoined);
    socket.on("peer-disconnected", handlePeerLeft);
    socket.on("user-left",         ({ socketId }) => {
      // find by socketId isn't possible here, but peer-disconnected covers it
    });

    return () => {
      socket.off("peer-connected",    handlePeerJoined);
      socket.off("peer-disconnected", handlePeerLeft);
    };
  }, [peer, inCall, userName, addRemoteStream, removeRemoteStream]);

  // ── Join call ───────────────────────────────────────────────────────────────
  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      localStream.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setInCall(true);
      setVideoOn(true);
      setAudioOn(true);

      // Tell others in the room we're here
      if (peer?.id) {
        socket.emit("peer-connected", { roomId, peerId: peer.id, userName });
      }
    } catch (err) {
      console.error("Camera/mic error:", err);
      alert("Could not access camera/microphone. Please check permissions.");
    }
  };

  // ── Leave call ──────────────────────────────────────────────────────────────
  const leaveCall = () => {
    localStream.current?.getTracks().forEach((t) => t.stop());
    screenStream.current?.getTracks().forEach((t) => t.stop());
    Object.values(peers.current).forEach((c) => c.close());
    peers.current = {};
    localStream.current  = null;
    screenStream.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setInCall(false);
    setRemoteStreams([]);
    setScreenSharing(false);
    socket.emit("peer-disconnected", { roomId, peerId: peer?.id });
  };

  // ── Toggle video ────────────────────────────────────────────────────────────
  const toggleVideo = () => {
    localStream.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setVideoOn((v) => !v);
  };

  // ── Toggle audio ────────────────────────────────────────────────────────────
  const toggleAudio = () => {
    localStream.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setAudioOn((v) => !v);
  };

  // ── Screen share ────────────────────────────────────────────────────────────
  const toggleScreenShare = async () => {
    if (screenSharing) {
      // Revert to camera
      screenStream.current?.getTracks().forEach((t) => t.stop());
      const camTrack = localStream.current?.getVideoTracks()[0];
      Object.values(peers.current).forEach((call) => {
        const sender = call.peerConnection
          ?.getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender && camTrack) sender.replaceTrack(camTrack);
      });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream.current;
      setScreenSharing(false);
      socket.emit("screen-share-stopped", { roomId });
    } else {
      try {
        const ss = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStream.current = ss;
        const screenTrack = ss.getVideoTracks()[0];
        Object.values(peers.current).forEach((call) => {
          const sender = call.peerConnection
            ?.getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = ss;
        setScreenSharing(true);
        socket.emit("screen-share-started", { roomId, userName });
        screenTrack.onended = () => toggleScreenShare();
      } catch (err) {
        console.error("Screen share failed:", err);
      }
    }
  };

  // ── Remote video tile ───────────────────────────────────────────────────────
  const RemoteTile = ({ peerId, stream, name }) => {
    const ref = useRef(null);
    useEffect(() => {
      if (ref.current) ref.current.srcObject = stream;
    }, [stream]);

    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 group cursor-pointer ${
          expanded === peerId ? "col-span-2 row-span-2" : ""
        }`}
        onClick={() => setExpanded((v) => (v === peerId ? null : peerId))}
      >
        <video
          ref={ref}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1 opacity-0 group-hover:opacity-100 transition">
          <span className="text-white text-xs font-medium">{name}</span>
        </div>
        <Maximize2 size={12} className="absolute top-2 right-2 text-white/50 group-hover:text-white/80 transition" />
      </div>
    );
  };

  // ── Pre-call UI ─────────────────────────────────────────────────────────────
  if (!inCall) {
    return (
      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
          <Video size={28} className="text-purple-400" />
        </div>
        <div className="text-center">
          <p className="text-slate-200 font-semibold text-sm">Video Call</p>
          <p className="text-slate-500 text-xs mt-1">Join to collaborate face-to-face</p>
        </div>
        <button
          onClick={joinCall}
          className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition shadow-lg shadow-purple-900/30"
        >
          Join Video Call
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/60 bg-slate-800/80">
        <Video size={15} className="text-purple-400" />
        <span className="text-sm font-semibold text-slate-200">Video Call</span>
        <span className="ml-2 text-xs text-slate-500 flex items-center gap-1">
          <Users size={11} /> {remoteStreams.length + 1} in call
        </span>
        {screenSharing && (
          <span className="ml-auto text-[10px] bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full animate-pulse">
            Sharing screen
          </span>
        )}
      </div>

      {/* Video grid */}
      <div className={`grid gap-1.5 p-2 bg-slate-900 ${
        remoteStreams.length === 0 ? "grid-cols-1" :
        remoteStreams.length === 1 ? "grid-cols-2" :
        "grid-cols-2"
      }`}>
        {/* Local */}
        <div className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 aspect-video">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!videoOn && !screenSharing ? "invisible" : ""}`}
          />
          {!videoOn && !screenSharing && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center">
                <span className="text-purple-400 font-bold text-lg">
                  {userName[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-1.5 left-2">
            <span className="text-white text-[10px] font-medium bg-black/50 px-1.5 py-0.5 rounded-md">
              You {!audioOn && "🔇"}
            </span>
          </div>
        </div>

        {/* Remotes */}
        {remoteStreams.map(({ peerId, stream, name }) => (
          <RemoteTile key={peerId} peerId={peerId} stream={stream} name={name} />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 py-3 px-4 bg-slate-800/80 border-t border-slate-700/60">
        <button
          onClick={toggleAudio}
          title={audioOn ? "Mute" : "Unmute"}
          className={`p-2.5 rounded-xl transition ${
            audioOn
              ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
              : "bg-red-600/80 hover:bg-red-500 text-white"
          }`}
        >
          {audioOn ? <Mic size={16} /> : <MicOff size={16} />}
        </button>

        <button
          onClick={toggleVideo}
          title={videoOn ? "Turn off camera" : "Turn on camera"}
          className={`p-2.5 rounded-xl transition ${
            videoOn
              ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
              : "bg-red-600/80 hover:bg-red-500 text-white"
          }`}
        >
          {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
        </button>

        <button
          onClick={toggleScreenShare}
          title={screenSharing ? "Stop sharing" : "Share screen"}
          className={`p-2.5 rounded-xl transition ${
            screenSharing
              ? "bg-green-600/80 hover:bg-green-500 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-slate-200"
          }`}
        >
          {screenSharing ? <MonitorOff size={16} /> : <Monitor size={16} />}
        </button>

        <button
          onClick={leaveCall}
          title="Leave call"
          className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition ml-2"
        >
          <PhoneOff size={16} />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;