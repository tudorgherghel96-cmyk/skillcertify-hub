import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface MotivationalBannerProps {
  message: string | null;
}

const MotivationalBanner = ({ message }: MotivationalBannerProps) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3"
    >
      <Sparkles className="h-5 w-5 text-primary shrink-0" />
      <p className="text-sm font-semibold text-foreground">{message}</p>
    </motion.div>
  );
};

export default MotivationalBanner;
