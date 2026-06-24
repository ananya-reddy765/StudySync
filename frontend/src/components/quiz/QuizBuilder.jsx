// src/components/quiz/QuizBuilder.jsx
import { useState } from "react";
import { createQuiz } from "../../api/quizApi";

const EMPTY_FLASHCARD = { type: "flashcard", front: "", back: "" };
const EMPTY_MCQ = {
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
};

export default function QuizBuilder({ groupId, onCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ ...EMPTY_FLASHCARD }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ── helpers ────────────────────────────────────────────────
  const addQuestion = (type) =>
    setQuestions((prev) => [
      ...prev,
      type === "mcq" ? { ...EMPTY_MCQ, options: ["", "", "", ""] } : { ...EMPTY_FLASHCARD },
    ]);

  const removeQuestion = (i) =>
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const updateQuestion = (i, patch) =>
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q))
    );

  const updateOption = (qi, oi, val) =>
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== qi) return q;
        const options = [...q.options];
        options[oi] = val;
        return { ...q, options };
      })
    );

  // ── submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim()) return setError("Quiz title is required.");
    if (questions.some((q) => !q.front && !q.question))
      return setError("All questions must have content.");
    setSaving(true);
    setError("");
    try {
      const res = await createQuiz(groupId, { title, description, questions });
      onCreated?.(res.data);
    } catch {
      setError("Failed to save quiz. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>STUDYSYNC · QUIZ BUILDER</p>
            <h2 style={styles.modalTitle}>Create a New Quiz</h2>
          </div>
          <button style={styles.closeBtn} onClick={onCancel}>✕</button>
        </div>

        {/* Meta */}
        <div style={styles.body}>
          <div style={styles.field}>
            <label style={styles.label}>Quiz Title</label>
            <input
              style={styles.input}
              placeholder="e.g. Chapter 3 Flashcards"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Description (optional)</label>
            <input
              style={styles.input}
              placeholder="What is this quiz about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Questions */}
          <div style={styles.questionsHeader}>
            <span style={styles.label}>Questions ({questions.length})</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.addBtn} onClick={() => addQuestion("flashcard")}>
                + Flashcard
              </button>
              <button style={{ ...styles.addBtn, background: "#7c3aed", color: "#fff" }} onClick={() => addQuestion("mcq")}>
                + MCQ
              </button>
            </div>
          </div>

          <div style={styles.questionList}>
            {questions.map((q, i) => (
              <div key={i} style={styles.questionCard}>
                <div style={styles.qHeader}>
                  <span style={q.type === "mcq" ? styles.badgeMCQ : styles.badgeFlash}>
                    {q.type === "mcq" ? "Multiple Choice" : "Flashcard"}
                  </span>
                  <span style={styles.qNum}>Q{i + 1}</span>
                  {questions.length > 1 && (
                    <button style={styles.removeBtn} onClick={() => removeQuestion(i)}>✕</button>
                  )}
                </div>

                {q.type === "flashcard" ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.smallLabel}>Front (Question)</label>
                      <textarea
                        style={styles.textarea}
                        placeholder="Term or question…"
                        value={q.front}
                        onChange={(e) => updateQuestion(i, { front: e.target.value })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={styles.smallLabel}>Back (Answer)</label>
                      <textarea
                        style={styles.textarea}
                        placeholder="Definition or answer…"
                        value={q.back}
                        onChange={(e) => updateQuestion(i, { back: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={styles.smallLabel}>Question</label>
                    <textarea
                      style={{ ...styles.textarea, marginBottom: 10 }}
                      placeholder="Type your question…"
                      value={q.question}
                      onChange={(e) => updateQuestion(i, { question: e.target.value })}
                    />
                    <label style={styles.smallLabel}>Options (click radio to mark correct)</label>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={styles.optionRow}>
                        <input
                          type="radio"
                          name={`correct-${i}`}
                          checked={q.correctIndex === oi}
                          onChange={() => updateQuestion(i, { correctIndex: oi })}
                          style={{ accentColor: "#7c3aed", marginRight: 8 }}
                        />
                        <input
                          style={styles.optionInput}
                          placeholder={`Option ${oi + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(i, oi, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.footer}>
            <button style={styles.cancelBtn} onClick={onCancel}>Cancel</button>
            <button style={styles.saveBtn} onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving…" : "Create Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── styles ─────────────────────────────────────────────────
const styles = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modal: {
    background: "#fff", borderRadius: 16, width: "min(760px, 95vw)",
    maxHeight: "90vh", display: "flex", flexDirection: "column",
    boxShadow: "0 20px 60px rgba(109,40,217,0.18)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    padding: "24px 28px 16px", borderBottom: "1px solid #ede9fe",
  },
  eyebrow: { fontSize: 11, letterSpacing: 1.5, color: "#7c3aed", fontWeight: 700, marginBottom: 4 },
  modalTitle: { fontSize: 22, fontWeight: 700, color: "#1e1b4b", margin: 0 },
  closeBtn: {
    background: "none", border: "none", fontSize: 18, color: "#6b7280",
    cursor: "pointer", padding: 4, lineHeight: 1,
  },
  body: { padding: "20px 28px 24px", overflowY: "auto" },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
  smallLabel: { display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 },
  // FIX 1: explicit color + background so body { color: white } doesn't bleed in
  input: {
    width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
    transition: "border-color .2s",
    color: "#1e1b4b",
    background: "#fff",
  },
  textarea: {
    width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
    resize: "vertical", minHeight: 72, fontFamily: "inherit",
    color: "#1e1b4b",
    background: "#fff",
  },
  optionInput: {
    flex: 1, padding: "8px 12px", border: "1.5px solid #e5e7eb",
    borderRadius: 8, fontSize: 14, outline: "none",
    color: "#1e1b4b",
    background: "#fff",
  },
  questionsHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 12, marginTop: 4,
  },
  addBtn: {
    padding: "7px 14px", background: "#ede9fe", color: "#7c3aed",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
  },
  questionList: { display: "flex", flexDirection: "column", gap: 14 },
  questionCard: {
    border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "16px",
    background: "#fafafa",
  },
  qHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 },
  qNum: { fontSize: 12, fontWeight: 700, color: "#9ca3af", marginLeft: "auto" },
  badgeFlash: {
    fontSize: 11, fontWeight: 700, padding: "3px 10px",
    background: "#ede9fe", color: "#7c3aed", borderRadius: 20,
  },
  badgeMCQ: {
    fontSize: 11, fontWeight: 700, padding: "3px 10px",
    background: "#ddd6fe", color: "#4c1d95", borderRadius: 20,
  },
  removeBtn: {
    background: "none", border: "none", color: "#ef4444",
    cursor: "pointer", fontSize: 14, padding: "0 4px",
  },
  optionRow: { display: "flex", alignItems: "center", marginBottom: 8 },
  error: { color: "#ef4444", fontSize: 13, marginTop: 12 },
  footer: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 },
  cancelBtn: {
    padding: "10px 22px", border: "1.5px solid #e5e7eb", background: "#fff",
    borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#374151",
  },
  saveBtn: {
    padding: "10px 24px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
    color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
    fontSize: 14, fontWeight: 700, boxShadow: "0 4px 14px rgba(109,40,217,.3)",
  },
};