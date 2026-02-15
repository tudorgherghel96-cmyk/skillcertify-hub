import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader2, VolumeX, Volume2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VideoPlayerProps {
  /** Direct URL (legacy) */
  videoUrl?: string;
  /** Language-keyed URLs: { en: "url", ro: "url" } */
  videos?: Record<string, string>;
  /** Poster/thumbnail image */
  posterImage?: string;
  /** Auto-play muted when active (TikTok-style) */
  autoPlay?: boolean;
  /** Whether this slide/player is currently active/visible */
  isActive?: boolean;
  /** Called when user watches >80% of the video */
  onWatched?: () => void;
}

export default function VideoPlayer({
  videoUrl,
  videos,
  posterImage,
  autoPlay = true,
  isActive = false,
  onWatched,
}: VideoPlayerProps) {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [watched, setWatched] = useState(false);
  const watchedRef = useRef(false);

  // Timeout: if video doesn't load in 5s, show placeholder
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && !playing) {
        setError(true);
        setLoading(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [loading, playing]);

  // Resolve the correct video URL
  const resolvedUrl = (() => {
    if (videos) {
      // Try user's language first, fall back to English
      return videos[language.code] || videos.en || Object.values(videos)[0];
    }
    return videoUrl || "";
  })();

  // Track 80% completion
  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || watchedRef.current || !v.duration) return;
    if (v.currentTime / v.duration >= 0.8) {
      watchedRef.current = true;
      setWatched(true);
      onWatched?.();
    }
  }, [onWatched]);

  // Auto-play/pause based on isActive
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isActive && autoPlay && !error) {
      v.muted = true;
      setMuted(true);
      v.play().then(() => {
        setPlaying(true);
        setShowPlayOverlay(false);
      }).catch(() => {
        // Autoplay blocked — show play button
        setShowPlayOverlay(true);
      });
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [isActive, autoPlay, error, loading]);

  const handlePlayTap = () => {
    const v = videoRef.current;
    if (!v) return;

    if (playing) {
      // Toggle mute on tap while playing
      const newMuted = !muted;
      v.muted = newMuted;
      setMuted(newMuted);
    } else {
      // Start playing
      v.muted = true;
      setMuted(true);
      v.play().then(() => {
        setPlaying(true);
        setShowPlayOverlay(false);
      }).catch(() => {});
    }
  };

  const handleVideoClick = () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play().then(() => {
        setPlaying(true);
        setShowPlayOverlay(false);
      }).catch(() => {});
    } else {
      // Toggle mute
      const newMuted = !muted;
      v.muted = newMuted;
      setMuted(newMuted);
    }
  };

  if (error) {
    return <VideoPlaceholder />;
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
      {/* Loading spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/50"
          >
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play button overlay (before first play) */}
      <AnimatePresence>
        {showPlayOverlay && !loading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handlePlayTap}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/30"
          >
            <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
              <Play className="h-7 w-7 text-primary-foreground ml-1" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mute indicator */}
      <AnimatePresence>
        {playing && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleVideoClick}
            className="absolute bottom-4 right-4 z-20 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            {muted ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Video element */}
      <video
        ref={videoRef}
        src={resolvedUrl}
        poster={posterImage}
        playsInline
        muted={muted}
        loop
        preload="metadata"
        className={`w-full h-full object-contain transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}
        onError={() => setError(true)}
        onLoadedMetadata={() => setLoading(false)}
        onTimeUpdate={handleTimeUpdate}
        onClick={handleVideoClick}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
}

/* ─── Styled placeholder for missing videos ─── */
export function VideoPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden relative bg-gradient-to-br from-[hsl(var(--primary)/0.15)] via-[hsl(var(--secondary)/0.1)] to-[hsl(var(--primary)/0.05)] border border-border/50">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-6">
          <div className="h-14 w-14 rounded-full bg-muted/80 flex items-center justify-center">
            <Play className="h-6 w-6 text-muted-foreground/50 ml-0.5" />
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-sm font-semibold text-foreground/70">Video lesson coming soon</p>
            <p className="text-xs text-muted-foreground/60 max-w-[240px]">
              Read through the cards below to learn this topic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
