import { motion, AnimatePresence } from "framer-motion";
import { getSocialProofMessage } from "@/contexts/GamificationContext";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function SocialProofNudge() {
  const [message, setMessage] = useState(getSocialProofMessage());

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(getSocialProofMessage());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2.5 rounded-xl bg-primary/5 border border-primary/10 px-4 py-2.5"
      >
        <Users className="h-4 w-4 text-primary shrink-0" />
        <p className="text-xs text-foreground font-medium">{message}</p>
      </motion.div>
    </AnimatePresence>
  );
}
