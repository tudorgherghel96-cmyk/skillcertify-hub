import { motion } from "framer-motion";

interface Props {
  value: number; // 0-100
}

export default function RadialGauge({ value }: Props) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;

  const getColor = () => {
    if (value < 60) return "hsl(var(--destructive))";
    if (value < 80) return "hsl(45 93% 47%)";
    if (value < 90) return "hsl(217 91% 60%)";
    return "hsl(var(--primary))";
  };

  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg width="180" height="180" className="rotate-[-90deg]">
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth="14"
          fill="transparent"
        />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          strokeWidth="14"
          fill="transparent"
          stroke={getColor()}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-foreground">{value}%</span>
        <span className="text-sm text-muted-foreground">Readiness</span>
      </div>
    </div>
  );
}
