// src/components/quiz/QuizResults.jsx
export default function QuizResults({ score, total, type, onRetry, onBack }) {
  const pct = Math.round((score / total) * 100);
  const grade =
    pct >= 90 ? { label: "Excellent! 🏆", color: "#059669" }
    : pct >= 70 ? { label: "Great job! 🎉", color: "#7c3aed" }
    : pct >= 50 ? { label: "Good effort! 💪", color: "#f59e0b" }
    : { label: "Keep practicing! 📚", color: "#ef4444" };

  const arc = (r, pct) => {
    const angle = (pct / 100) * 2 * Math.PI;
    const x = 60 + r * Math.sin(angle);
    const y = 60 - r * Math.cos(angle);
    return `M 60 ${60 - r} A ${r} ${r} 0 ${pct > 50 ? 1 : 0} 1 ${x} ${y}`;
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>QUIZ COMPLETE</p>
        <h2 style={styles.grade}>{grade.label}</h2>

        {/* Ring chart */}
        <div style={styles.ring}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#ede9fe" strokeWidth="12" />
            {pct > 0 && (
              <path
                d={arc(48, pct)}
                fill="none"
                stroke={grade.color}
                strokeWidth="12"
                strokeLinecap="round"
              />
            )}
            <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1e1b4b">
              {pct}%
            </text>
            <text x="60" y="74" textAnchor="middle" fontSize="11" fill="#6b7280">
              score
            </text>
          </svg>
        </div>

        <p style={styles.detail}>
          You got <strong style={{ color: grade.color }}>{score}</strong> out of{" "}
          <strong>{total}</strong> {type === "flashcard" ? "cards" : "questions"} right.
        </p>

        <div style={styles.actions}>
          <button style={styles.retryBtn} onClick={onRetry}>Try Again</button>
          <button style={styles.backBtn} onClick={onBack}>Back to Quizzes</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", justifyContent: "center", padding: "40px 20px" },
  card: {
    background: "#fff", borderRadius: 20, padding: "36px 40px",
    textAlign: "center", maxWidth: 400, width: "100%",
    boxShadow: "0 8px 32px rgba(109,40,217,.12)",
    border: "1.5px solid #ede9fe",
  },
  eyebrow: { fontSize: 11, letterSpacing: 2, color: "#7c3aed", fontWeight: 700, marginBottom: 6 },
  grade: { fontSize: 26, fontWeight: 800, color: "#1e1b4b", marginBottom: 24 },
  ring: { display: "flex", justifyContent: "center", marginBottom: 20 },
  detail: { fontSize: 16, color: "#4b5563", marginBottom: 28 },
  actions: { display: "flex", gap: 12, justifyContent: "center" },
  retryBtn: {
    padding: "11px 24px", background: "#ede9fe", color: "#7c3aed",
    border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700,
  },
  backBtn: {
    padding: "11px 24px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
    color: "#fff", border: "none", borderRadius: 10, cursor: "pointer",
    fontSize: 14, fontWeight: 700, boxShadow: "0 4px 14px rgba(109,40,217,.25)",
  },
};