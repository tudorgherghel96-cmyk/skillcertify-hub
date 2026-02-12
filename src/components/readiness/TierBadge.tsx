import { motion } from "framer-motion";

export default function TierBadge({ tier }: { tier: string }) {
  const styles: Record<string, string> = {
    Beginner: "bg-muted text-muted-foreground",
    Developing: "bg-accent text-accent-foreground",
    Competent: "bg-secondary/20 text-secondary-foreground",
    Proficient: "bg-primary/15 text-primary",
    Expert: "bg-primary text-primary-foreground shadow-lg",
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        styles[tier] || styles.Beginner
      }`}
    >
      {tier}
    </motion.div>
  );
}
