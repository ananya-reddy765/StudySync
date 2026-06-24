// src/components/quiz/MCQPlayer.jsx
import { useState, useEffect } from "react";

export default function MCQPlayer({ questions, onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // {qi, chosen, correct}
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const q = questions[index];
  const total = questions.length;

  // Countdown timer
  useEffect(() => {
    if (revealed) return;
    if (timeLeft <= 0) { handleReveal(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, revealed]);

  const handleSelect = (oi) => {
    if (revealed) return;
    setSelected(oi);
  };

  const handleReveal = () => {
    setRevealed(true);
    const isCorrect = selected === q.correctIndex;
    setAnswers((prev) => [
      ...prev,
      { qi: index, chosen: selected, correct: q.correctIndex, isCorrect },
    ]);
  };

  const handleNext = () => {
    setRevealed(false);
    setSelected(null);
    setTimeLeft(30);
    if (index + 1 >= total) {
      const score = answers.filter((a) => a.isCorrect).length +
        (answers[answers.length - 1]?.isCorrect ? 0 : 0); // already counted
      onFinish?.({ answers, score: answers.filter((a) => a.isCorrect).length, total });
    } else {
      setIndex((i) => i + 1);
    }
  };

  const optionStyle = (oi) => {
    const base = { ...styles.option };
    if (!revealed) {
      return selected === oi
        ? { ...base, borderColor: "#7c3aed", background: "#ede9fe", color: "#5b21b6" }
        : base;
    }
    if (oi === q.correctIndex)
      return { ...base, borderColor: "#10b981", background: "#d1fae5", color: "#065f46" };
    if (oi === selected && selected !== q.correctIndex)
      return { ...base, borderColor: "#ef4444", background: "#fee2e2", color: "#991b1b" };
    return { ...base, opacity: 0.5 };
  };

  const timerColor = timeLeft > 15 ? "#7c3aed" : timeLeft > 7 ? "#f59e0b" : "#ef4444";

  return (
    <div style={styles.wrap}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <span style={styles.progress}>{index + 1} / {total}</span>
        <div style={styles.timerWrap}>
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke={timerColor} strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - timeLeft / 30)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear, stroke .3s" }}
              transform="rotate(-90 22 22)"
            />
            <text x="22" y="27" textAnchor="middle" fontSize="13" fontWeight="700" fill={timerColor}>
              {timeLeft}
            </text>
          </svg>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.bar}>
        <div style={{ ...styles.fill, width: `${(index / total) * 100}%` }} />
      </div>

      {/* Question */}
      <div style={styles.questionBox}>
        <p style={styles.questionText}>{q.question}</p>
      </div>

      {/* Options */}
      <div style={styles.options}>
        {q.options.map((opt, oi) => (
          <button key={oi} style={optionStyle(oi)} onClick={() => handleSelect(oi)}>
            <span style={styles.optLabel}>
              {["A", "B", "C", "D"][oi]}
            </span>
            <span style={styles.optText}>{opt}</span>
            {revealed && oi === q.correctIndex && (
              <span style={styles.tick}>✓</span>
            )}
            {revealed && oi === selected && selected !== q.correctIndex && (
              <span style={styles.cross}>✗</span>
            )}
          </button>
        ))}
      </div>

      {/* CTA */}
      {!revealed ? (
        <button
          style={{ ...styles.actionBtn, opacity: selected === null ? 0.5 : 1 }}
          onClick={handleReveal}
          disabled={selected === null}
        >
          Confirm Answer
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontWeight: 700, fontSize: 16, marginBottom: 16,
            color: answers[answers.length - 1]?.isCorrect ? "#059669" : "#dc2626",
          }}>
            {answers[answers.length - 1]?.isCorrect ? "🎉 Correct!" : "❌ Incorrect"}
          </p>
          <button style={styles.actionBtn} onClick={handleNext}>
            {index + 1 >= total ? "See Results" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", padding: "20px 24px", maxWidth: 640, margin: "0 auto" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  progress: { fontSize: 14, fontWeight: 700, color: "#6b7280" },
  timerWrap: { lineHeight: 0 },
  bar: { height: 6, background: "#ede9fe", borderRadius: 99, marginBottom: 28, overflow: "hidden" },
  fill: { height: "100%", background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 99, transition: "width .4s" },
  questionBox: {
    background: "linear-gradient(135deg,#6d28d9,#7c3aed)",
    borderRadius: 16, padding: "28px 24px", marginBottom: 20,
    boxShadow: "0 8px 24px rgba(109,40,217,.25)",
  },
  questionText: { color: "#fff", fontSize: 18, fontWeight: 600, margin: 0, lineHeight: 1.5 },
  options: { display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 },
  option: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "14px 18px", border: "2px solid #e5e7eb",
    borderRadius: 12, background: "#fff", cursor: "pointer",
    fontSize: 15, fontWeight: 500, textAlign: "left",
    transition: "all .15s", color: "#374151",
  },
  optLabel: {
    width: 28, height: 28, borderRadius: "50%",
    background: "#ede9fe", color: "#7c3aed",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 800, flexShrink: 0,
  },
  optText: { flex: 1 },
  tick: { color: "#10b981", fontWeight: 700, fontSize: 18 },
  cross: { color: "#ef4444", fontWeight: 700, fontSize: 18 },
  actionBtn: {
    display: "block", margin: "0 auto",
    padding: "12px 36px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
    color: "#fff", border: "none", borderRadius: 12,
    cursor: "pointer", fontSize: 15, fontWeight: 700,
    boxShadow: "0 4px 14px rgba(109,40,217,.3)", transition: "opacity .2s",
  },
};