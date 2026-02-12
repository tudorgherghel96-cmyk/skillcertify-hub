import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import greenCard from "@/assets/cscs-green-card.webp";
import blueCard from "@/assets/cscs-blue-card.webp";
import goldCard from "@/assets/cscs-gold-card.webp";
import blackCard from "@/assets/cscs-black-card.webp";

interface CardWalletProps {
  currentTarget?: "green" | "blue" | "gold" | "black";
}

const cards = [
  { id: "green", label: "Green Labourer", image: greenCard, level: "Level 1", unlocked: true },
  { id: "blue", label: "Blue Skilled Worker", image: blueCard, level: "NVQ Level 2", unlocked: false },
  { id: "gold", label: "Gold Supervisor", image: goldCard, level: "NVQ Level 3", unlocked: false },
  { id: "black", label: "Black Manager", image: blackCard, level: "NVQ Level 6", unlocked: false },
];

export default function CardWallet({ currentTarget = "green" }: CardWalletProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">Card Wallet</h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {cards.map((card, i) => {
          const isTarget = card.id === currentTarget;
          const isLocked = !card.unlocked && card.id !== currentTarget;

          return (
            <motion.div
              key={card.id}
              className={`relative flex-shrink-0 w-[200px] rounded-xl overflow-hidden border-2 transition-all ${
                isTarget
                  ? "border-primary shadow-lg shadow-primary/20"
                  : isLocked
                  ? "border-border opacity-40"
                  : "border-border"
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isLocked ? 0.4 : 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={card.image}
                alt={card.label}
                className="w-full aspect-[1.586/1] object-cover"
                loading="lazy"
              />
              {isLocked && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <Lock className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              {isTarget && (
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    YOUR TARGET
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-[10px] font-semibold text-white">{card.label}</p>
                <p className="text-[9px] text-white/70">{card.level}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
