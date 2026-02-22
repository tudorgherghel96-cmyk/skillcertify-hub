import { useState, useRef, useCallback } from "react";

interface DragItem {
  id: string;
  text: string;
}
interface DropTarget {
  id: string;
  text: string;
}

interface DragDropProps {
  items: DragItem[];
  targets: DropTarget[];
  correct_pairs: Record<string, string>; // item.id -> target.id
  xp_value: number;
  onComplete?: () => void;
}

export default function DragDrop({ items, targets, correct_pairs, xp_value, onComplete }: DragDropProps) {
  const [matched, setMatched] = useState<Record<string, string>>({}); // targetId -> itemId
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [wrong, setWrong] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allMatched = Object.keys(correct_pairs).every((itemId) => {
    return Object.values(matched).includes(itemId);
  });

  const handleTouchStart = useCallback((e: React.TouchEvent, itemId: string) => {
    // Don't drag already matched items
    if (Object.values(matched).includes(itemId)) return;
    e.preventDefault();
    const touch = e.touches[0];
    setDragging(itemId);
    setDragPos({ x: touch.clientX, y: touch.clientY });
  }, [matched]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    setDragPos({ x: touch.clientX, y: touch.clientY });
  }, [dragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!dragging) return;
    const touch = e.changedTouches[0];

    // Find which target the touch is over
    let droppedOnTarget: string | null = null;
    for (const [targetId, el] of Object.entries(targetRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        droppedOnTarget = targetId;
        break;
      }
    }

    if (droppedOnTarget) {
      const correctItemForTarget = Object.entries(correct_pairs).find(
        ([, tid]) => tid === droppedOnTarget
      )?.[0];

      if (correctItemForTarget === dragging && !matched[droppedOnTarget]) {
        // Correct match
        setMatched((prev) => ({ ...prev, [droppedOnTarget]: dragging }));
        if (navigator.vibrate) navigator.vibrate(50);
        const newMatched = { ...matched, [droppedOnTarget]: dragging };
        const allDone = Object.keys(correct_pairs).every((id) => Object.values(newMatched).includes(id));
        if (allDone) setTimeout(() => onComplete?.(), 500);
      } else {
        // Wrong
        setWrong(dragging);
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        setTimeout(() => setWrong(null), 600);
      }
    }

    setDragging(null);
  }, [dragging, matched, correct_pairs, onComplete]);

  const matchedItemIds = new Set(Object.values(matched));

  if (!items?.length || !targets?.length) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
        <p>No matching pairs available for this card.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px 0" }}>
        Match the pairs
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Items column */}
        <div>
          <p style={{ color: "#f59e0b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0", fontWeight: 700 }}>
            MATCH
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((item) => {
              const isMatched = matchedItemIds.has(item.id);
              const isWrong = wrong === item.id;
              return (
                <div
                  key={item.id}
                  onTouchStart={(e) => handleTouchStart(e, item.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    color: isMatched ? "#10b981" : "white",
                    background: isMatched ? "rgba(16,185,129,0.15)" : isWrong ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
                    border: `2px solid ${isMatched ? "#10b981" : isWrong ? "#ef4444" : "rgba(255,255,255,0.15)"}`,
                    cursor: isMatched ? "default" : "grab",
                    animation: isWrong ? "shake 300ms ease" : undefined,
                    touchAction: "none",
                  }}
                >
                  {isMatched && "✓ "}{item.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Targets column */}
        <div>
          <p style={{ color: "#f59e0b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0", fontWeight: 700 }}>
            WITH
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {targets.map((target) => {
              const isMatched = !!matched[target.id];
              return (
                <div
                  key={target.id}
                  ref={(el) => { targetRefs.current[target.id] = el; }}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 12,
                    minHeight: 48,
                    fontSize: 14,
                    fontWeight: 600,
                    color: isMatched ? "#10b981" : "rgba(255,255,255,0.6)",
                    background: isMatched ? "rgba(16,185,129,0.15)" : "transparent",
                    border: `2px dashed ${isMatched ? "#10b981" : "rgba(255,255,255,0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  {target.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating drag ghost */}
      {dragging && (
        <div
          style={{
            position: "fixed",
            left: dragPos.x - 60,
            top: dragPos.y - 25,
            pointerEvents: "none",
            zIndex: 9999,
            padding: "14px 20px",
            borderRadius: 12,
            background: "rgba(59,130,246,0.9)",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            transform: "scale(1.05)",
          }}
        >
          {items.find((i) => i.id === dragging)?.text}
        </div>
      )}

      {allMatched && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <p style={{ color: "#10b981", fontSize: 18, fontWeight: 700, margin: "0 0 4px 0" }}>All matched! ✓</p>
          <p style={{ color: "#f59e0b", fontSize: 16, fontWeight: 700, margin: 0 }}>+{xp_value} XP</p>
        </div>
      )}

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
      `}</style>
    </div>
  );
}
