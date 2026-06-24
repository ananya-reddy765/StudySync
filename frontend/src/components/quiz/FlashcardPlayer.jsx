// src/components/quiz/FlashcardPlayer.jsx
import { useState } from "react";

export default function FlashcardPlayer({ questions, onFinish }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]); // indices marked "got it"

  const q = questions[index];
  const total = questions.length;
  const progress = ((index) / total) * 100;

  const next = (didKnow) => {
    if (didKnow) setKnown((prev) => [...prev, index]);
    setFlipped(false);
    setTimeout(() => {
      if (index + 1 >= total) onFinish?.({ known: known.length + (didKnow ? 1 : 0), total });
      else setIndex((i) => i + 1);
    }, 150);
  };

  return (
    <div style={styles.wrap}>
      {/* progress bar */}
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <p style={styles.counter}>
        {index + 1} <span style={{ color: "#9ca3af" }}>/ {total}</span>
      </p>

      {/* Card */}
      <div style={styles.scene} onClick={() => setFlipped((f) => !f)}>
        <div style={{ ...styles.card, ...(flipped ? styles.cardFlipped : {}) }}>
          <div style={styles.cardFront}>
            <span style={styles.cardSide}>QUESTION</span>
            <p style={styles.cardText}>{q.front}</p>
            <span style={styles.tapHint}>Tap to reveal answer →</span>
          </div>
          <div style={styles.cardBack}>
            <span style={{ ...styles.cardSide, color: "#a78bfa" }}>ANSWER</span>
            <p style={styles.cardText}>{q.back}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {flipped && (
        <div style={styles.actions}>
          <button style={styles.noBtn} onClick={() => next(false)}>
            <span>✗</span> Still learning
          </button>
          <button style={styles.yesBtn} onClick={() => next(true)}>
            <span>✓</span> Got it!
          </button>
        </div>
      )}
      {!flipped && (
        <p style={styles.flipHint}>Click the card to flip it</p>
      )}
    </div>
  );
}

const flip = `
@keyframes cardFlip {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(180deg); }
}`;
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = flip;
  document.head.appendChild(s);
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px" },
  progressBar: {
    width: "100%", maxWidth: 560, height: 6, background: "#ede9fe",
    borderRadius: 99, marginBottom: 16, overflow: "hidden",
  },
  progressFill: {
    height: "100%", background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
    borderRadius: 99, transition: "width .4s ease",
  },
  counter: { fontSize: 22, fontWeight: 700, color: "#1e1b4b", marginBottom: 28 },
  scene: {
    perspective: 1000, width: "min(560px, 90vw)", height: 280,
    cursor: "pointer", marginBottom: 28,
  },
  card: {
    width: "100%", height: "100%", position: "relative",
    transformStyle: "preserve-3d", transition: "transform .5s ease",
    borderRadius: 20,
  },
  cardFlipped: { transform: "rotateY(180deg)" },
  cardFront: {
    position: "absolute", inset: 0,
    background: "linear-gradient(135deg,#6d28d9 0%,#7c3aed 60%,#8b5cf6 100%)",
    borderRadius: 20, backfaceVisibility: "hidden",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: 32, gap: 12,
    boxShadow: "0 12px 40px rgba(109,40,217,.35)",
  },
  cardBack: {
    position: "absolute", inset: 0,
    background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)",
    borderRadius: 20, backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: 32, gap: 12,
    boxShadow: "0 12px 40px rgba(30,27,75,.4)",
  },
  cardSide: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#c4b5fd" },
  cardText: { fontSize: 22, fontWeight: 600, color: "#fff", textAlign: "center", margin: 0 },
  tapHint: { fontSize: 12, color: "#c4b5fd", marginTop: 8 },
  actions: { display: "flex", gap: 16 },
  noBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "12px 28px", background: "#fff", border: "2px solid #fca5a5",
    color: "#ef4444", borderRadius: 12, cursor: "pointer",
    fontSize: 15, fontWeight: 700, transition: "background .2s",
  },
  yesBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "12px 28px", background: "#7c3aed", border: "none",
    color: "#fff", borderRadius: 12, cursor: "pointer",
    fontSize: 15, fontWeight: 700, boxShadow: "0 4px 14px rgba(109,40,217,.3)",
  },
  flipHint: { fontSize: 13, color: "#9ca3af" },
};