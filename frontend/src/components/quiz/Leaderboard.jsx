// src/components/quiz/Leaderboard.jsx
import { useEffect, useState } from "react";
import { getGroupLeaderboard } from "../../api/quizApi";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ groupId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    getGroupLeaderboard(groupId)
      .then((res) => setEntries(res.data || []))
      .catch(() => setError("Could not load leaderboard."))
      .finally(() => setLoading(false));
  }, [groupId]);

  if (loading) return <div style={styles.loading}>Loading leaderboard…</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!entries.length)
    return (
      <div style={styles.empty}>
        <p>🏆</p>
        <p style={{ color: "#6b7280", fontSize: 14 }}>No scores yet. Take a quiz to appear here!</p>
      </div>
    );

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div style={styles.wrap}>
      <p style={styles.eyebrow}>STUDYSYNC · GROUP LEADERBOARD</p>
      <h3 style={styles.title}>Top Performers</h3>

      {/* Podium */}
      <div style={styles.podium}>
        {/* 2nd */}
        {top3[1] && (
          <div style={{ ...styles.podiumItem, order: 1 }}>
            <div style={{ ...styles.avatar, background: "#c0c0c0" }}>
              {top3[1].avatar || top3[1].name?.[0]?.toUpperCase()}
            </div>
            <p style={styles.podiumName}>{top3[1].name}</p>
            <div style={{ ...styles.podiumBlock, height: 64, background: "#c0c0c0" }}>
              🥈 {top3[1].totalScore}
            </div>
          </div>
        )}
        {/* 1st */}
        {top3[0] && (
          <div style={{ ...styles.podiumItem, order: 0 }}>
            <div style={styles.crown}>👑</div>
            <div style={{ ...styles.avatar, background: "#f59e0b", width: 52, height: 52, fontSize: 20 }}>
              {top3[0].avatar || top3[0].name?.[0]?.toUpperCase()}
            </div>
            <p style={styles.podiumName}>{top3[0].name}</p>
            <div style={{ ...styles.podiumBlock, height: 88, background: "#f59e0b" }}>
              🥇 {top3[0].totalScore}
            </div>
          </div>
        )}
        {/* 3rd */}
        {top3[2] && (
          <div style={{ ...styles.podiumItem, order: 2 }}>
            <div style={{ ...styles.avatar, background: "#cd7f32" }}>
              {top3[2].avatar || top3[2].name?.[0]?.toUpperCase()}
            </div>
            <p style={styles.podiumName}>{top3[2].name}</p>
            <div style={{ ...styles.podiumBlock, height: 48, background: "#cd7f32" }}>
              🥉 {top3[2].totalScore}
            </div>
          </div>
        )}
      </div>

      {/* Ranked list */}
      {rest.length > 0 && (
        <div style={styles.list}>
          {rest.map((entry, i) => (
            <div key={entry.userId || i} style={styles.row}>
              <span style={styles.rank}>#{i + 4}</span>
              <div style={{ ...styles.avatar, width: 36, height: 36, fontSize: 14 }}>
                {entry.avatar || entry.name?.[0]?.toUpperCase()}
              </div>
              <span style={styles.name}>{entry.name}</span>
              <span style={styles.quizzes}>{entry.quizzesTaken} quizzes</span>
              <span style={styles.score}>{entry.totalScore} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { padding: "20px 0" },
  loading: { padding: 32, textAlign: "center", color: "#6b7280" },
  error: { padding: 16, color: "#ef4444", textAlign: "center" },
  empty: { textAlign: "center", padding: "40px 20px", fontSize: 32 },
  eyebrow: { fontSize: 11, letterSpacing: 2, color: "#7c3aed", fontWeight: 700, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 800, color: "#1e1b4b", marginBottom: 24 },
  podium: {
    display: "flex", justifyContent: "center", alignItems: "flex-end",
    gap: 16, marginBottom: 28,
  },
  podiumItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  crown: { fontSize: 20 },
  avatar: {
    width: 44, height: 44, borderRadius: "50%",
    background: "#7c3aed", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 800,
  },
  podiumName: { fontSize: 12, fontWeight: 700, color: "#374151", textAlign: "center", maxWidth: 72 },
  podiumBlock: {
    width: 72, borderRadius: "8px 8px 0 0",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, gap: 2,
  },
  list: {
    border: "1.5px solid #ede9fe", borderRadius: 12, overflow: "hidden",
  },
  row: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 16px", borderBottom: "1px solid #f3f4f6",
    background: "#fff", transition: "background .15s",
  },
  rank: { fontSize: 13, fontWeight: 700, color: "#9ca3af", width: 28 },
  name: { flex: 1, fontSize: 14, fontWeight: 600, color: "#1e1b4b" },
  quizzes: { fontSize: 12, color: "#9ca3af" },
  score: {
    fontSize: 14, fontWeight: 800, color: "#7c3aed",
    background: "#ede9fe", padding: "4px 10px", borderRadius: 20,
  },
};