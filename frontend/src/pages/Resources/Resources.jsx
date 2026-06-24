import { useState, useEffect, useRef } from "react";
import { getGroups, getResources, uploadResource, deleteResource } from "../../services/groupService";
import {
  BookOpen, Upload, Trash2, FileText, Image,
  File, X, Search, FolderOpen, ExternalLink, Plus,
} from "lucide-react";

const FILE_ICONS = {
  pdf:   <FileText size={16} className="text-red-500" />,
  image: <Image size={16} className="text-blue-500" />,
  doc:   <FileText size={16} className="text-blue-600" />,
  other: <File size={16} className="text-gray-500" />,
};

const FILE_BG = {
  pdf:   "bg-red-50 border-red-100",
  image: "bg-blue-50 border-blue-100",
  doc:   "bg-blue-50 border-blue-100",
  other: "bg-gray-50 border-gray-200",
};

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const currentUserId = (() => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch { return null; }
})();

export default function Resources() {
  const fileInputRef = useRef(null);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingRes, setLoadingRes] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Load groups the user is a member of
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const data = await getGroups();
        // Only groups where user is a member
        const mine = data.filter((g) =>
          g.members?.some((m) => (m._id || m) === currentUserId)
        );
        setGroups(mine);
        if (mine.length > 0) setSelectedGroup(mine[0]);
      } catch { /* ignore */ }
      finally { setLoadingGroups(false); }
    };
    fetchGroups();
  }, []);

  // Load resources when group changes
  useEffect(() => {
    if (!selectedGroup) return;
    const fetchResources = async () => {
      try {
        setLoadingRes(true);
        setResources([]);
        const data = await getResources(selectedGroup._id);
        setResources(data);
      } catch { setResources([]); }
      finally { setLoadingRes(false); }
    };
    fetchResources();
  }, [selectedGroup]);

  const handleUpload = async (file) => {
    if (!file || !selectedGroup) return;
    setUploadError("");
    setUploadSuccess("");
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large. Max 10MB.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      const newRes = await uploadResource(selectedGroup._id, formData);
      setResources((prev) => [newRes, ...prev]);
      setUploadSuccess(`"${file.name}" uploaded successfully.`);
      setTimeout(() => setUploadSuccess(""), 3000);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed.");
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

  const handleDelete = async (resource) => {
    try {
      setDeletingId(resource._id);
      await deleteResource(selectedGroup._id, resource._id);
      setResources((prev) => prev.filter((r) => r._id !== resource._id));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (resource) => {
    const uploaderId = (resource.uploadedBy?._id || resource.uploadedBy)?.toString();
    const creatorId = (selectedGroup?.createdBy?._id || selectedGroup?.createdBy)?.toString();
    return currentUserId === uploaderId || currentUserId === creatorId;
  };

  const filtered = resources.filter((r) => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.fileType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 px-6 pt-10 pb-14">
        <div className="max-w-6xl mx-auto">
          <p className="text-violet-300 text-sm font-medium mb-1 tracking-wide uppercase">StudySync</p>
          <h1 className="text-3xl font-bold text-white mb-1">Resource Repository</h1>
          <p className="text-violet-200 text-sm">Shared file drive for your study groups</p>

          {/* Search */}
          <div className="relative mt-6">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm text-gray-700 placeholder-gray-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* Sidebar — Group selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">My Groups</p>
              </div>
              <div className="p-2">
                {loadingGroups ? (
                  <div className="space-y-2 p-2">
                    {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : groups.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No groups yet</p>
                  </div>
                ) : (
                  groups.map((g) => (
                    <button
                      key={g._id}
                      onClick={() => { setSelectedGroup(g); setSearch(""); setFilter("all"); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition flex items-center gap-2 ${
                        selectedGroup?._id === g._id
                          ? "bg-violet-600 text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedGroup?._id === g._id ? "bg-white" : "bg-violet-400"}`} />
                      <span className="truncate">{g.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main — Resources */}
          <div className="lg:col-span-3 space-y-4">

            {/* Upload area */}
            {selectedGroup && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">{selectedGroup.name}</h2>
                    <p className="text-xs text-gray-400">{resources.length} file{resources.length !== 1 ? "s" : ""}</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  >
                    {uploading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <Plus size={15} />
                    }
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

                {/* Alerts */}
                {uploadError && (
                  <div className="flex items-center justify-between bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-3">
                    <span>{uploadError}</span>
                    <button onClick={() => setUploadError("")}><X size={14} /></button>
                  </div>
                )}
                {uploadSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-3">
                    ✓ {uploadSuccess}
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                    dragOver
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
                  }`}
                >
                  <Upload size={22} className={`mx-auto mb-2 ${dragOver ? "text-violet-500" : "text-gray-300"}`} />
                  <p className="text-sm text-gray-400">
                    <span className="text-violet-600 font-medium">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-gray-300 mt-1">PDF, Images, Docs — up to 10MB</p>
                </div>
              </div>
            )}

            {/* Filter tabs */}
            {resources.length > 0 && (
              <div className="flex gap-2">
                {["all", "pdf", "image", "doc", "other"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize ${
                      filter === f
                        ? "bg-violet-600 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {f === "all" ? "All Files" : f.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* File list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {!selectedGroup ? (
                <div className="text-center py-20">
                  <FolderOpen size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium">Select a group to view resources</p>
                </div>
              ) : loadingRes ? (
                <div className="p-5 space-y-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                      <div className="flex-1">
                        <div className="h-3.5 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen size={28} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium">
                    {search || filter !== "all" ? "No files match your search" : "No files uploaded yet"}
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    {!search && filter === "all" && "Upload your first file above"}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filtered.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition group"
                    >
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${FILE_BG[r.fileType] || FILE_BG.other}`}>
                        {FILE_ICONS[r.fileType] || FILE_ICONS.other}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {r.fileType?.toUpperCase() || "FILE"}
                          {r.size ? ` · ${formatSize(r.size)}` : ""}
                          {r.uploadedBy?.name ? ` · Uploaded by ${r.uploadedBy.name}` : ""}
                          {r.createdAt ? ` · ${new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-600 rounded-lg text-xs font-semibold transition"
                        >
                          Open <ExternalLink size={11} />
                        </a>
                        {canDelete(r) && (
                          <button
                            onClick={() => handleDelete(r)}
                            disabled={deletingId === r._id}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            {deletingId === r._id
                              ? <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin inline-block" />
                              : <Trash2 size={15} />
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
      </div>
    </div>
  );
}