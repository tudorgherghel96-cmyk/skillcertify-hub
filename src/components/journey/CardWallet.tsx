import { motion } from "framer-motion";
import { Lock, ChevronRight } from "lucide-react";
import greenCard from "@/assets/cscs-green-card.webp";
import blueCard from "@/assets/cscs-blue-card.webp";
import goldCard from "@/assets/cscs-gold-card.webp";
import blackCard from "@/assets/cscs-black-card.webp";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CardWalletProps {
  currentTarget?: "green" | "blue" | "gold" | "black";
}

const cards = [
  {
    id: "green" as const,
    label: "Green Labourer",
    image: greenCard,
    level: "Level 1",
    unlocked: true,
    prereqs: "Level 1 H&S Qualification + CSCS Test",
  },
  {
    id: "blue" as const,
    label: "Blue Skilled Worker",
    image: blueCard,
    level: "NVQ Level 2",
    unlocked: false,
    prereqs: "NVQ Level 2 in your trade + CSCS Test. Requires on-site experience.",
  },
  {
    id: "gold" as const,
    label: "Gold Supervisor",
    image: goldCard,
    level: "NVQ Level 3",
    unlocked: false,
    prereqs: "NVQ Level 3 + Supervisory experience. Management-level qualification required.",
  },
  {
    id: "black" as const,
    label: "Black Manager",
    image: blackCard,
    level: "NVQ Level 6",
    unlocked: false,
    prereqs: "NVQ Level 6 or 7 in Construction Management.",
  },
];

export default function CardWallet({ currentTarget = "green" }: CardWalletProps) {
  const [selectedLocked, setSelectedLocked] = useState<(typeof cards)[number] | null>(null);

  return (
    <>
      <div className="space-y-3">
        {/* Primary active card — no "YOUR TARGET" label */}
        {cards
          .filter((c) => c.id === currentTarget)
          .map((card) => (
            <motion.div
              key={card.id}
              className="relative rounded-2xl overflow-hidden border-2 border-primary shadow-lg shadow-primary/10"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-full aspect-[1.586/1] object-cover"
                loading="eager"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
                <p className="text-sm font-bold text-white">{card.label}</p>
                <p className="text-xs text-white/80">{card.level}</p>
              </div>
            </motion.div>
          ))}

        {/* Locked future cards */}
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          {cards
            .filter((c) => c.id !== currentTarget)
            .map((card, i) => (
              <motion.button
                key={card.id}
                className="relative flex-shrink-0 w-[130px] rounded-xl overflow-hidden border border-border opacity-50 hover:opacity-70 transition-opacity"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedLocked(card)}
              >
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full aspect-[1.586/1] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                  <p className="text-[9px] font-semibold text-white truncate">{card.label}</p>
                </div>
              </motion.button>
            ))}
        </div>
      </div>

      {/* Unlock info dialog */}
      <Dialog open={!!selectedLocked} onOpenChange={() => setSelectedLocked(null)}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              {selectedLocked?.label}
            </DialogTitle>
            <DialogDescription>
              How to unlock this card
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border opacity-60">
              {selectedLocked && (
                <img
                  src={selectedLocked.image}
                  alt={selectedLocked.label}
                  className="w-full aspect-[1.586/1] object-cover"
                />
              )}
            </div>
            <div className="space-y-2">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs font-semibold text-foreground">What you need</p>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedLocked?.prereqs}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium">Coming soon — upgrade available later</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}