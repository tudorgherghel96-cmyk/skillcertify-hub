import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getLessonVideoUrl } from "@/lib/media";

export default function WelcomeVideo() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && !loading) {
      videoRef.current.play().catch(() => {});
    }
  }, [loading]);

  const videoUrl = getLessonVideoUrl("welcome");

  if (error) return null;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="text-sm font-semibold text-muted-foreground px-1">Your Journey Starts Here</h2>
      <div className="rounded-xl overflow-hidden relative" style={{ backgroundColor: "hsl(var(--secondary))" }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          className={`w-full h-auto rounded-xl transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
          onError={() => setError(true)}
          onLoadedMetadata={() => setLoading(false)}
        />
      </div>
    </motion.div>
  );
}
