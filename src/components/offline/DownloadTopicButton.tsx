import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lessonMedia } from "@/data/mediaMap";
import { getLessonVideoUrl } from "@/lib/media";
import { MODULES } from "@/data/courseData";
import { cacheMediaUrls, markTopicDownloaded, isTopicDownloaded } from "@/lib/offlineStorage";

interface DownloadTopicButtonProps {
  moduleId: number;
}

export default function DownloadTopicButton({ moduleId }: DownloadTopicButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(() => isTopicDownloaded(moduleId));
  const [error, setError] = useState(false);

  const handleDownload = useCallback(async () => {
    if (downloading || downloaded) return;
    if (!navigator.onLine) {
      setError(true);
      setTimeout(() => setError(false), 3000);
      return;
    }

    setDownloading(true);
    setProgress(0);
    setError(false);

    try {
      // Gather all media URLs for this module's lessons
      const mod = MODULES.find((m) => m.id === moduleId);
      if (!mod) return;

      const urls: string[] = [];

      for (const lesson of mod.lessons) {
        const key = `${moduleId}.${lesson.id}`;
        const media = lessonMedia[key];

        // Images
        if (media?.images) {
          for (const img of media.images) {
            urls.push(img.src);
          }
        }

        // Video
        const videoUrl = getLessonVideoUrl(key);
        if (videoUrl) urls.push(videoUrl);
      }

      await cacheMediaUrls(urls, (done, total) => {
        setProgress(Math.round((done / total) * 100));
      });

      markTopicDownloaded(moduleId);
      setDownloaded(true);
    } catch {
      setError(true);
    } finally {
      setDownloading(false);
    }
  }, [moduleId, downloading, downloaded]);

  if (downloaded) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-xs font-medium">Available offline</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={downloading}
        className="w-full gap-2"
        aria-label="Download this topic for offline use"
      >
        {downloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : error ? (
          <WifiOff className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {downloading
          ? `Downloading... ${progress}%`
          : error
          ? "Connect to WiFi first"
          : "Download for offline"}
      </Button>

      <AnimatePresence>
        {downloading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
