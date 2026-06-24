import { useState } from "react";
import { createNote, deleteNote } from "../../services/dashboardService";

const QuickNotes = ({ notes = [], refresh }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      await createNote({ title: "Quick Note", content });
      setContent("");
      if (refresh) await refresh();
    } catch (err) {
      console.error("Create Note Error:", err);
      alert("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      if (refresh) await refresh();
    } catch (err) {
      console.error("Delete Note Error:", err);
      alert("Failed to delete note.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Notes</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a quick note..."
        className="w-full border rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        onClick={handleAdd}
        disabled={loading}
        className="mt-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl"
      >
        {loading ? "Saving..." : "Save Note"}
      </button>

      <div className="mt-5 space-y-3">
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-slate-50 p-3 rounded-xl flex justify-between items-start"
            >
              <p className="text-sm">{note.content}</p>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-red-500 text-xs ml-4 shrink-0 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuickNotes;