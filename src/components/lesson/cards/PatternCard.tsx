import { useState } from "react";

interface PatternItem {
  id: string;
  text: string;
}

interface PatternCardProps {
  hazards: PatternItem[];
  diseases: PatternItem[];
  correct_pairs: Record<string, string>; // hazard.id -> disease.id
  xp_value: number;
  onComplete?: () => void;
}

export default function PatternCard({ hazards, diseases, correct_pairs, xp_value, onComplete }: PatternCardProps) {
  const [selectedHazard, setSelectedHazard] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({}); // hazardId -> diseaseId
  const [wrong, setWrong] = useState<string | null>(null);

  const matchedHazards = new Set(Object.keys(matched));
  const matchedDiseases = new Set(Object.values(matched));
  const allMatched = matchedHazards.size === hazards.length;

  const handleHazard = (id: string) => {
    if (matchedHazards.has(id)) return;
    setSelectedHazard(id === selectedHazard ? null : id);
  };

  const handleDisease = (diseaseId: string) => {
    if (!selectedHazard || matchedDiseases.has(diseaseId)) return;
    const isCorrect = correct_pairs[selectedHazard] === diseaseId;
    if (isCorrect) {
      const newMatched = { ...matched, [selectedHazard]: diseaseId };
      setMatched(newMatched);
      setSelectedHazard(null);
      if (navigator.vibrate) navigator.vibrate(50);
      if (Object.keys(newMatched).length === hazards.length) {
        setTimeout(() => onComplete?.(), 600);
      }
    } else {
      setWrong(selectedHazard);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      setTimeout(() => { setWrong(null); setSelectedHazard(null); }, 600);
    }
  };

  return (
    <div>
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px 0" }}>
        Match Pairs
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Hazards */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0", fontWeight: 600 }}>
            Hazard
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {hazards.map((h) => {
              const isMatched = matchedHazards.has(h.id);
              const isSelected = selectedHazard === h.id;
              const isWrong = wrong === h.id;
              return (
                <button
                  key={h.id}
                  onClick={(e) => { e.stopPropagation(); handleHazard(h.id); }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isMatched ? "#10b981" : "white",
                    background: isMatched ? "rgba(16,185,129,0.15)" : isWrong ? "rgba(239,68,68,0.15)" : isSelected ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)",
                    border: `2px solid ${isMatched ? "#10b981" : isWrong ? "#ef4444" : isSelected ? "#3b82f6" : "rgba(255,255,255,0.1)"}`,
                    cursor: isMatched ? "default" : "pointer",
                    textAlign: "left",
                    animation: isWrong ? "shake 300ms ease" : undefined,
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  {isMatched ? "✓ " : ""}{h.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diseases */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0", fontWeight: 600 }}>
            Disease
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {diseases.map((d) => {
              const isMatched = matchedDiseases.has(d.id);
              return (
                <button
                  key={d.id}
                  onClick={(e) => { e.stopPropagation(); handleDisease(d.id); }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 600,
                    color: isMatched ? "#10b981" : "white",
                    background: isMatched ? "rgba(16,185,129,0.15)" : selectedHazard && !isMatched ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)",
                    border: `2px solid ${isMatched ? "#10b981" : selectedHazard && !isMatched ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                    cursor: isMatched ? "default" : "pointer",
                    textAlign: "left",
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  }}
                >
                  {isMatched ? "✓ " : ""}{d.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {allMatched && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: "#10b981", fontSize: 18, fontWeight: 700, margin: "0 0 4px 0" }}>All matched! 🎉</p>
          <p style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, margin: 0 }}>+{xp_value} XP</p>
        </div>
      )}

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
      `}</style>
    </div>
  );
}
