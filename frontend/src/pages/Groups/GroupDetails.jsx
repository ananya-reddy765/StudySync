// src/pages/Groups/GroupDetails.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getGroupById, getResources, uploadResource, deleteResource } from "../../services/groupService";
import {
  Users, Copy, Check, ArrowLeft, Crown,
  Link2, BookOpen, Calendar, Hash, ExternalLink,
  Upload, Trash2, FileText, Image, File, X, Plus, Video,
} from "lucide-react";

const avatarColors = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
];

const CATEGORY_STYLES = {
  General:    "bg-slate-100 text-slate-600",
  Math:       "bg-blue-50 text-blue-600",
  Science:    "bg-emerald-50 text-emerald-600",
  Language:   "bg-amber-50 text-amber-600",
  History:    "bg-orange-50 text-orange-600",
  Technology: "bg-violet-50 text-violet-600",
  "AI/ML":    "bg-pink-50 text-pink-600",
};

const FILE_ICONS = {
  pdf:   <FileText size={16} className="text-red-500" />,
  image: <Image size={16} className="text-blue-500" />,
  doc:   <FileText size={16} className="text-blue-600" />,
  other: <File size={16} className="text-gray-500" />,
};

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Resources state
  const [resources, setResources] = useState([]);
  const [resLoading, setResLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Study Rooms state
  const [groupRooms, setGroupRooms] = useState([]);

  // Current user id from token
  const currentUserId = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch { return null; }
  })();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const data = await getGroupById(id);
        setGroup(data);
        // Remember the last visited group so sidebar Quest Arena link works
        localStorage.setItem("lastGroupId", id);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load group.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchResources = async () => {
      try {
        setResLoading(true);
        const data = await getResources(id);
        setResources(data);
      } catch { /* member check will fail gracefully */ }
      finally { setResLoading(false); }
    };
    fetchResources();
  }, [id]);

  // Fetch study rooms for this group
  useEffect(() => {
    if (!id) return;
    const fetchGroupRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/study-rooms/group/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroupRooms(data);
      } catch { /* no rooms yet, that's fine */ }
    };
    fetchGroupRooms();
  }, [id]);

  const inviteLink = group?.inviteCode
    ? `${window.location.origin}/join/${group.inviteCode}`
    : "";

  const copyToClipboard = async (text, setter) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploadError("");
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File too large. Maximum size is 10MB.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      const newResource = await uploadResource(id, formData);
      setResources((prev) => [newResource, ...prev]);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (resourceId) => {
    try {
      setDeletingId(resourceId);
      await deleteResource(id, resourceId);
      setResources((prev) => prev.filter((r) => r._id !== resourceId));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (resource) => {
    const uploaderId = resource.uploadedBy?._id || resource.uploadedBy;
    const creatorId = group?.createdBy?._id || group?.createdBy;
    return currentUserId === uploaderId?.toString() || currentUserId === creatorId?.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-violet-600 to-purple-800 h-40" />
        <div className="max-w-5xl mx-auto px-6 -mt-6 animate-pulse">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
            <div className="h-7 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-red-500 font-medium mb-3">{error}</p>
        <button onClick={() => navigate("/groups")} className="text-violet-600 text-sm underline">
          Back to Groups
        </button>
      </div>
    );
  }

  const catStyle = CATEGORY_STYLES[group.category] || CATEGORY_STYLES.General;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 px-6 pt-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/groups")}
            className="flex items-center gap-2 text-violet-200 hover:text-white text-sm mb-6 transition"
          >
            <ArrowLeft size={15} />
            Back to Groups
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${catStyle}`}>
                {group.category || "General"}
              </span>
              <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
              {group.description && (
                <p className="text-violet-200 text-sm max-w-xl leading-relaxed">{group.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-violet-300 text-xs">
                <span className="flex items-center gap-1.5">
                  <Users size={13} />
                  {group.members?.length} {group.members?.length === 1 ? "member" : "members"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  Created {new Date(group.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* FIX 3: Quest Arena button uses groupId (same as :id param) in the URL */}
            <button
              onClick={() => navigate(`/groups/${id}/quest-arena`)}
              className="flex items-center gap-2 px-5 py-3 bg-white text-violet-700 font-bold text-sm rounded-xl shadow-md hover:bg-violet-50 transition self-start sm:self-auto"
            >
              🧠 Quest Arena
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Invite card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100 px-5 py-4 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Link2 size={14} className="text-violet-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">Invite Link</h2>
                  <p className="text-xs text-gray-400">Share to let anyone join this group</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 min-w-0">
                    <ExternalLink size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate font-mono text-xs">
                      {inviteLink || "Invite link not available"}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inviteLink, setCopied)}
                    disabled={!inviteLink}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition flex-shrink-0 ${
                      copied ? "bg-emerald-500 text-white" : "bg-violet-600 hover:bg-violet-700 text-white"
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">Invite Code</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold tracking-[0.2em] text-violet-700 bg-violet-50 px-3 py-1 rounded-lg border border-violet-100">
                      {group.inviteCode || "——"}
                    </span>
                    <button
                      onClick={() => copyToClipboard(group.inviteCode, setCodeCopied)}
                      className="text-gray-400 hover:text-violet-600 transition"
                    >
                      {codeCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Rooms card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Video size={14} className="text-purple-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-800">Study Rooms</h2>
                  {groupRooms.length > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-600 font-medium px-2 py-0.5 rounded-full">
                      {groupRooms.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate("/study-rooms")}
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  <Plus size={13} />
                  Request a Room
                </button>
              </div>

              <div className="p-5">
                {groupRooms.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Video size={18} className="text-purple-300" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">No study rooms yet</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Request a room — your group admin will approve it
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {groupRooms.map((room) => (
                      <div
                        key={room._id}
                        onClick={() => navigate(`/study-rooms/${room._id}`)}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 rounded-xl transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Video size={14} className="text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{room.roomName}</p>
                            {room.description && (
                              <p className="text-xs text-gray-400 truncate">{room.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-purple-600 opacity-0 group-hover:opacity-100 transition flex-shrink-0 ml-3">
                          Join →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resources card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                    <BookOpen size={14} className="text-violet-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-800">Resources</h2>
                  {resources.length > 0 && (
                    <span className="text-xs bg-violet-100 text-violet-600 font-medium px-2 py-0.5 rounded-full">
                      {resources.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus size={13} />
                  )}
                  {uploading ? "Uploading…" : "Upload File"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="p-5">
                {uploadError && (
                  <div className="flex items-center justify-between bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                    <span>{uploadError}</span>
                    <button onClick={() => setUploadError("")}><X size={14} /></button>
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition mb-4 ${
                    dragOver
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
                  }`}
                >
                  <Upload size={20} className={`mx-auto mb-2 ${dragOver ? "text-violet-500" : "text-gray-300"}`} />
                  <p className="text-sm text-gray-400">
                    <span className="text-violet-600 font-medium">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-300 mt-1">PDF, Images, Docs up to 10MB</p>
                </div>

                {/* Resource list */}
                {resLoading ? (
                  <div className="space-y-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400 font-medium">No resources yet</p>
                    <p className="text-xs text-gray-300 mt-1">Upload your first file above</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resources.map((r) => (
                      <div
                        key={r._id}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-violet-50 rounded-xl transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            {FILE_ICONS[r.fileType] || FILE_ICONS.other}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                            <p className="text-xs text-gray-400">
                              {r.fileType?.toUpperCase() || "FILE"}
                              {r.size ? ` · ${formatSize(r.size)}` : ""}
                              {r.uploadedBy?.name ? ` · ${r.uploadedBy.name}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open <ExternalLink size={11} />
                          </a>
                          {canDelete(r) && (
                            <button
                              onClick={() => handleDelete(r._id)}
                              disabled={deletingId === r._id}
                              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                              title="Delete file"
                            >
                              {deletingId === r._id
                                ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin inline-block" />
                                : <Trash2 size={14} />
                              }
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Members */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Users size={14} className="text-violet-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">Members</h2>
                <span className="text-xs bg-violet-100 text-violet-600 font-medium px-2 py-0.5 rounded-full ml-auto">
                  {group.members?.length}
                </span>
              </div>
              <div className="p-4 space-y-1">
                {group.members?.map((member, i) => {
                  const isCreator =
                    group.createdBy?._id === member._id ||
                    group.createdBy === member._id;
                  return (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                      >
                        {(member.name?.[0] || "?").toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate leading-tight">{member.name}</p>
                        {member.email && (
                          <p className="text-xs text-gray-400 truncate">{member.email}</p>
                        )}
                      </div>
                      {isCreator && (
                        <div title="Group creator">
                          <Crown size={13} className="text-amber-400 flex-shrink-0" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}