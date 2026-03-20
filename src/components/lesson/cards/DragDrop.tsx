import { useState, useRef, useCallback, useMemo } from "react";

function SafetySignIcon({ icon }: { icon: string }) {
  const size = 28;
  switch (icon) {
    case "prohibition":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="18" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          <line x1="10" y1="10" x2="30" y2="30" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "warning":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <polygon points="20,4 38,36 2,36" fill="#eab308" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
          <text x="20" y="31" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#1a1a1a">!</text>
        </svg>
      );
    case "mandatory":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
          <circle cx="20" cy="20" r="6" fill="white" />
        </svg>
      );
    case "safe_condition":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <rect x="2" y="8" width="36" height="24" rx="3" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
          <text x="20" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">+</text>
        </svg>
      );
    default:
      return null;
  }
}

interface DragItem {
  id: string;
  text: string;
  icon?: string;
}
interface DropTarget {
  id: string;
  text: string;
}

interface DragDropProps {
  items: DragItem[];
  targets: DropTarget[];
  correct_pairs: Record<string, string>;
  xp_value: number;
  onComplete?: () => void;
}

export default function DragDrop({ items, targets, correct_pairs, xp_value, onComplete }: DragDropProps) {
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [wrong, setWrong] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const shuffledItems = useMemo(() => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [items]);

  const allMatched = Object.keys(correct_pairs).every((itemId) =>
    Object.values(matched).includes(itemId)
  );

  const handleDrop = useCallback((clientX: number, clientY: number, dragItemId: string, currentMatched: Record<string, string>) => {
    let droppedOnTarget: string | null = null;
    for (const [targetId, el] of Object.entries(targetRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        droppedOnTarget = targetId;
        break;
      }
    }

    if (droppedOnTarget) {
      const correctItemForTarget = Object.entries(correct_pairs).find(
        ([, tid]) => tid === droppedOnTarget
      )?.[0];

      if (correctItemForTarget === dragItemId && !currentMatched[droppedOnTarget]) {
        const newMatched = { ...currentMatched, [droppedOnTarget]: dragItemId };
        setMatched(newMatched);
        if (navigator.vibrate) navigator.vibrate(50);
        const allDone = Object.keys(correct_pairs).every((id) => Object.values(newMatched).includes(id));
        if (allDone) setTimeout(() => onComplete?.(), 500);
      } else {
        setWrong(dragItemId);
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        setTimeout(() => setWrong(null), 600);
      }
    }

    setDragging(null);
  }, [correct_pairs, onComplete]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent, itemId: string) => {
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
    handleDrop(touch.clientX, touch.clientY, dragging, matched);
  }, [dragging, matched, handleDrop]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, itemId: string) => {
    if (Object.values(matched).includes(itemId)) return;
    e.preventDefault();
    setDragging(itemId);
    setDragPos({ x: e.clientX, y: e.clientY });
  }, [matched]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    e.preventDefault();
    setDragPos({ x: e.clientX, y: e.clientY });
  }, [dragging]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    handleDrop(e.clientX, e.clientY, dragging, matched);
  }, [dragging, matched, handleDrop]);

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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ touchAction: "none", userSelect: "none" }}
    >
      <p style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px 0" }}>
        Match the pairs
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <p style={{ color: "#f59e0b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px 0", fontWeight: 700 }}>
            MATCH
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shuffledItems.map((item) => {
              const isMatched = matchedItemIds.has(item.id);
              const isWrong = wrong === item.id;
              return (
                <div
                  key={item.id}
                  onTouchStart={(e) => handleTouchStart(e, item.id)}
                  onMouseDown={(e) => handleMouseDown(e, item.id)}
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
