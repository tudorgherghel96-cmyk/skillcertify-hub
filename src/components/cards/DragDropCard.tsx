import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import XpBadge from "./shared/XpBadge";
import { triggerHaptic } from "@/lib/haptics";

interface DragItem {
  id: string;
  label: string;
}
interface DropTarget {
  id: string;
  label: string;
  acceptsItemId: string; // the item that belongs here
}

interface DragDropCardProps {
  items: DragItem[];
  targets: DropTarget[];
  xpValue?: number;
  dir?: "ltr" | "rtl";
  onComplete?: (bonus: number) => void;
}

export default function DragDropCard({
  items,
  targets,
  xpValue = 5,
  dir = "ltr",
  onComplete,
}: DragDropCardProps) {
  // placed: targetId → itemId
  const [placed, setPlaced] = useState<Record<string, string>>({});
  // correctness per target
  const [result, setResult] = useState<Record<string, boolean | null>>({});
  // dragging state
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [showXp, setShowXp] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const placedItemIds = Object.values(placed);

  const handleDrop = useCallback((targetId: string) => {
    if (!dragging) return;
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    const isCorrect = target.acceptsItemId === dragging;
    setDragOver(null);
    setDragging(null);

    setPlaced(prev => ({ ...prev, [targetId]: dragging }));
    setResult(prev => ({ ...prev, [targetId]: isCorrect }));

    if (isCorrect) {
      triggerHaptic("success");
      setTotalXp(prev => {
        const next = prev + xpValue;
        setShowXp(true);
        return next;
      });

      // Check all correct
      setResult(prev => {
        const nextResult = { ...prev, [targetId]: true };
        const allDone = targets.every(t => nextResult[t.id] === true);
        if (allDone) {
          setTimeout(() => {
            triggerHaptic("success");
            setAllCorrect(true);
            onComplete?.(20);
          }, 300);
        }
        return nextResult;
      });
    } else {
      triggerHaptic("error");
      // Bounce back after animation
      setTimeout(() => {
        setPlaced(prev => {
          const n = { ...prev };
          delete n[targetId];
          return n;
        });
        setResult(prev => {
          const n = { ...prev };
          delete n[targetId];
          return n;
        });
      }, 600);
    }
  }, [dragging, targets, xpValue, onComplete]);

  return (
    <div dir={dir} className="relative w-full rounded-2xl bg-card shadow-sm border border-border overflow-hidden">
      {/* Cyan accent top */}
      <div className="h-1 w-full" style={{ background: "#00ACC1" }} />

      <div className="p-5 space-y-4">
        <XpBadge xp={totalXp} show={showXp} position={dir === "rtl" ? "top-left" : "top-right"} />
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: "#00ACC1" }}>
          🔗 Match It Up
        </p>

        {/* All correct banner */}
        <AnimatePresence>
          {allCorrect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl py-2 px-4 text-center text-sm font-bold"
              style={{ background: "#E8F5E9", color: "#1B5E20" }}
            >
              🎉 Perfect! +20 XP bonus
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4">
          {/* Draggable items (left / right in RTL) */}
          <div className="flex-1 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Drag</p>
            {items.map(item => {
              const isPlaced = placedItemIds.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  draggable={!isPlaced}
                  onDragStart={() => setDragging(item.id)}
                  onDragEnd={() => setDragging(null)}
                  animate={isPlaced ? { opacity: 0.35 } : { opacity: 1 }}
                  className="min-h-[48px] flex items-center px-3 py-2 rounded-xl border-2 text-sm font-medium cursor-grab active:cursor-grabbing select-none"
                  style={{
                    borderColor: "#00ACC1",
                    background: isPlaced ? "hsl(var(--muted))" : "white",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  {item.label}
                </motion.div>
              );
            })}
          </div>

          {/* Drop targets */}
          <div className="flex-1 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Drop here</p>
            {targets.map(target => {
              const placedItem = items.find(it => it.id === placed[target.id]);
              const res = result[target.id];
              return (
                <div
                  key={target.id}
                  onDragOver={e => { e.preventDefault(); setDragOver(target.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(target.id)}
                  className="min-h-[48px] flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm transition-colors"
                  style={{
                    borderColor: dragOver === target.id
                      ? "#00ACC1"
                      : res === true
                      ? "#4CAF50"
                      : res === false
                      ? "#F44336"
                      : "hsl(var(--border))",
                    background: res === true
                      ? "#E8F5E9"
                      : res === false
                      ? "#FFEBEE"
                      : dragOver === target.id
                      ? "rgba(0,172,193,0.07)"
                      : "hsl(var(--muted)/0.3)",
                  }}
                >
                  {res === true && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#4CAF50" }} />}
                  {res === false && <XCircle className="h-4 w-4 shrink-0" style={{ color: "#F44336" }} />}
                  <span className="font-medium text-foreground">
                    {placedItem ? placedItem.label : <span className="text-muted-foreground/40">{target.label}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
