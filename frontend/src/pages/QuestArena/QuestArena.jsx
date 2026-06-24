// src/pages/QuestArena/QuestArena.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGroupQuizzes, submitQuizAttempt } from "../../api/quizApi";
import QuizBuilder from "../../components/quiz/QuizBuilder";
import FlashcardPlayer from "../../components/quiz/FlashcardPlayer";
import MCQPlayer from "../../components/quiz/MCQPlayer";
import QuizResults from "../../components/quiz/QuizResults";
import Leaderboard from "../../components/quiz/Leaderboard";

const TABS = ["Quizzes", "Leaderboard"];

export default function QuestArena() {
  // groupId can come from URL param or props — adjust to your router setup
  const { groupId } = useParams();

  const [tab, setTab] = useState("Quizzes");
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);

  // Playing state
  const [activeQuiz, setActiveQuiz] = useState(null); // quiz object
  const [phase, setPhase] = useState("idle"); // idle | playing | results
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!groupId) return;
    fetchQuizzes();
  }, [groupId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await getGroupQuizzes(groupId);
      setQuizzes(res.data || []);
    } catch {
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setPhase("playing");
    setResults(null);
  };

  const handleFinish = async (result) => {
    setResults(result);
    setPhase("results");
    // Submit score to backend
    try {
      await submitQuizAttempt(activeQuiz._id, result.answers || []);
    } catch { /* non-fatal */ }
  };

  const handleRetry = () => {
    setPhase("playing");
    setResults(null);
  };

  const handleBack = () => {
    setActiveQuiz(null);
    setPhase("idle");
    setResults(null);
  };

  // ── render quiz playing ──
  if (phase === "playing" && activeQuiz) {
    const flashcards = activeQuiz.questions.filter((q) => q.type === "flashcard");
    const mcqs = activeQuiz.questions.filter((q) => q.type === "mcq");

    return (
      <div style={styles.page}>
        <div style={styles.playHeader}>
          <button style={styles.backLink} onClick={handleBack}>← Back</button>
          <div>
            <p style={styles.eyebrow}>STUDYSYNC · QUEST ARENA</p>
            <h1 style={styles.playTitle}>{activeQuiz.title}</h1>
          </div>
        </div>

        {flashcards.length > 0 && mcqs.length === 0 && (
          <FlashcardPlayer questions={flashcards} onFinish={handleFinish} />
        )}
        {mcqs.length > 0 && flashcards.length === 0 && (
          <MCQPlayer questions={mcqs} onFinish={handleFinish} />
        )}
        {flashcards.length > 0 && mcqs.length > 0 && (
          <MixedPlayer
            flashcards={flashcards}
            mcqs={mcqs}
            onFinish={handleFinish}
          />
        )}
      </div>
    );
  }

  if (phase === "results" && results) {
    const type = activeQuiz.questions[0]?.type || "mcq";
    return (
      <div style={styles.page}>
        <div style={styles.playHeader}>
          <button style={styles.backLink} onClick={handleBack}>← Back</button>
          <div>
            <p style={styles.eyebrow}>STUDYSYNC · QUEST ARENA</p>
            <h1 style={styles.playTitle}>Results</h1>
          </div>
        </div>
        <QuizResults
          score={results.score ?? results.known}
          total={results.total}
          type={type}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      </div>
    );
  }

  // ── main list view ──
  return (
    <div style={styles.page}>
      {/* Header banner */}
      <div style={styles.banner}>
        <div>
          <p style={styles.eyebrow}>STUDYSYNC</p>
          <h1 style={styles.bannerTitle}>Quest Arena</h1>
          <p style={styles.bannerSub}>Test your knowledge, challenge your group</p>
        </div>
        <button style={styles.createBtn} onClick={() => setShowBuilder(true)}>
          + Create Quiz
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {tab === "Quizzes" && (
          loading ? (
            <div style={styles.loading}>Loading quizzes…</div>
          ) : quizzes.length === 0 ? (
            <EmptyState onCreate={() => setShowBuilder(true)} />
          ) : (
            <div style={styles.grid}>
              {quizzes.map((quiz) => (
                <QuizCard key={quiz._id} quiz={quiz} onStart={() => startQuiz(quiz)} />
              ))}
            </div>
          )
        )}
        {tab === "Leaderboard" && <Leaderboard groupId={groupId} />}
      </div>

      {/* Builder modal */}
      {showBuilder && (
        <QuizBuilder
          groupId={groupId}
          onCreated={(newQuiz) => {
            setQuizzes((prev) => [newQuiz, ...prev]);
            setShowBuilder(false);
          }}
          onCancel={() => setShowBuilder(false)}
        />
      )}
    </div>
  );
}

// ── Quiz Card ─────────────────────────────────────────────
function QuizCard({ quiz, onStart }) {
  const flashCount = quiz.questions.filter((q) => q.type === "flashcard").length;
  const mcqCount = quiz.questions.filter((q) => q.type === "mcq").length;

  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.top}>
        <div>
          <h3 style={cardStyles.title}>{quiz.title}</h3>
          {quiz.description && <p style={cardStyles.desc}>{quiz.description}</p>}
        </div>
      </div>
      <div style={cardStyles.meta}>
        {flashCount > 0 && (
          <span style={cardStyles.badge}>{flashCount} flashcard{flashCount !== 1 ? "s" : ""}</span>
        )}
        {mcqCount > 0 && (
          <span style={{ ...cardStyles.badge, background: "#ddd6fe", color: "#4c1d95" }}>
            {mcqCount} MCQ{mcqCount !== 1 ? "s" : ""}
          </span>
        )}
        {quiz.createdBy && (
          <span style={cardStyles.author}>by {quiz.createdBy.name || "Unknown"}</span>
        )}
      </div>
      <button style={cardStyles.startBtn} onClick={onStart}>
        Start Quiz →
      </button>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────
function EmptyState({ onCreate }) {
  return (
    <div style={emptyStyles.wrap}>
      <div style={emptyStyles.icon}>🧠</div>
      <h3 style={emptyStyles.title}>No quizzes yet</h3>
      <p style={emptyStyles.sub}>Create the first quiz for your group to get everyone learning!</p>
      <button style={emptyStyles.btn} onClick={onCreate}>+ Create First Quiz</button>
    </div>
  );
}

// ── Mixed Player (flashcards first, then MCQ) ─────────────
function MixedPlayer({ flashcards, mcqs, onFinish }) {
  const [phase, setPhase] = useState("flash"); // flash | mcq
  const [flashResult, setFlashResult] = useState(null);

  if (phase === "flash") {
    return (
      <FlashcardPlayer
        questions={flashcards}
        onFinish={(r) => {
          setFlashResult(r);
          setPhase("mcq");
        }}
      />
    );
  }
  return (
    <MCQPlayer
      questions={mcqs}
      onFinish={(r) => {
        onFinish({
          score: (flashResult?.known || 0) + (r.score || 0),
          total: (flashResult?.total || 0) + (r.total || 0),
          answers: r.answers,
        });
      }}
    />
  );
}

// ── styles ─────────────────────────────────────────────────
const styles = {
  page: { background: "#f9fafb", minHeight: "100vh" },
  banner: {
    background: "linear-gradient(135deg,#6d28d9 0%,#7c3aed 60%,#8b5cf6 100%)",
    padding: "32px 32px 28px", color: "#fff",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  eyebrow: { fontSize: 11, letterSpacing: 2, color: "#c4b5fd", fontWeight: 700, marginBottom: 6 },
  bannerTitle: { fontSize: 30, fontWeight: 800, margin: 0 },
  bannerSub: { fontSize: 14, color: "#ddd6fe", marginTop: 4 },
  createBtn: {
    padding: "12px 22px", background: "#fff", color: "#7c3aed",
    border: "none", borderRadius: 10, cursor: "pointer",
    fontSize: 14, fontWeight: 700, boxShadow: "0 4px 14px rgba(0,0,0,.15)",
  },
  tabs: {
    display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb",
    padding: "0 32px", background: "#fff",
  },
  tab: {
    padding: "14px 20px", border: "none", background: "none",
    cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#6b7280",
    borderBottom: "3px solid transparent", marginBottom: -2, transition: "all .2s",
  },
  tabActive: { color: "#7c3aed", borderBottomColor: "#7c3aed" },
  content: { padding: "28px 32px" },
  loading: { textAlign: "center", padding: 48, color: "#6b7280", fontSize: 15 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  playHeader: {
    background: "#fff", borderBottom: "1px solid #e5e7eb",
    padding: "16px 28px", display: "flex", alignItems: "center", gap: 16,
  },
  backLink: {
    background: "none", border: "none", color: "#7c3aed",
    fontSize: 14, fontWeight: 700, cursor: "pointer", padding: 0,
  },
  playTitle: { fontSize: 20, fontWeight: 800, color: "#1e1b4b", margin: 0 },
};

const cardStyles = {
  card: {
    background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 16,
    padding: "22px 22px 18px", display: "flex", flexDirection: "column",
    gap: 12, transition: "box-shadow .2s, transform .2s",
    cursor: "default",
    ":hover": { boxShadow: "0 8px 24px rgba(109,40,217,.12)", transform: "translateY(-2px)" },
  },
  top: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0 },
  desc: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  meta: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" },
  badge: {
    fontSize: 11, fontWeight: 700, padding: "3px 10px",
    background: "#ede9fe", color: "#7c3aed", borderRadius: 20,
  },
  author: { fontSize: 12, color: "#9ca3af", marginLeft: "auto" },
  startBtn: {
    marginTop: 4, padding: "10px 0",
    background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
    color: "#fff", border: "none", borderRadius: 10,
    cursor: "pointer", fontSize: 14, fontWeight: 700,
    boxShadow: "0 4px 12px rgba(109,40,217,.25)",
  },
};

const emptyStyles = {
  wrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "64px 20px", textAlign: "center",
  },
  icon: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 800, color: "#1e1b4b", marginBottom: 8 },
  sub: { fontSize: 14, color: "#6b7280", maxWidth: 340, marginBottom: 24 },
  btn: {
    padding: "12px 28px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
    color: "#fff", border: "none", borderRadius: 10,
    cursor: "pointer", fontSize: 14, fontWeight: 700,
    boxShadow: "0 4px 14px rgba(109,40,217,.3)",
  },
};