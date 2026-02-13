import { useState, useCallback } from "react";
import { Play, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { lessonMedia } from "@/data/mediaMap";
import { getLessonVideoUrl } from "@/lib/media";
import VideoPlayer, { VideoPlaceholder } from "./VideoPlayer";

interface LessonMediaProps {
  moduleId: number;
  lessonId: number;
  videoDesc: string;
}

function MediaImage({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean; variant?: "hero" | "content" }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div className="w-full rounded-xl my-4 bg-muted flex items-center justify-center aspect-video overflow-hidden">
        <img src="/fallback.webp" alt={alt} className="w-full h-full object-cover opacity-40" />
      </div>
    );
  }

  return (
    <div className="relative w-full my-4">
      {!loaded && (
        <Skeleton className="w-full aspect-video rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-auto rounded-xl shadow-sm transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        // @ts-ignore
        fetchpriority={eager ? "high" : "auto"}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function LessonVideo({ lessonKey }: { lessonKey: string }) {
  const url = getLessonVideoUrl(lessonKey);

  return (
    <div className="rounded-xl overflow-hidden aspect-video">
      <VideoPlayer videoUrl={url} autoPlay={false} isActive />
    </div>
  );
}

export function LessonHeroMedia({ moduleId, lessonId, videoDesc }: LessonMediaProps) {
  const key = `${moduleId}.${lessonId}`;
  const media = lessonMedia[key];

  // Show hero image
  const heroImage = media?.images?.[0];

  return (
    <div className="space-y-4">
      {/* Hero Image — natural aspect ratio, no cropping */}
      {heroImage ? (
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "hsl(var(--secondary))" }}>
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            className="w-full h-auto rounded-xl shadow-sm"
            loading="eager"
            decoding="sync"
            // @ts-ignore
            fetchpriority="high"
            onError={(e) => { e.currentTarget.src = "/fallback.webp"; }}
          />
        </div>
      ) : (
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground px-4 text-center">{videoDesc}</p>
          </div>
        </AspectRatio>
      )}

      {/* Video Player */}
      <LessonVideo lessonKey={key} />
    </div>
  );
}

/** Returns remaining images (skipping first used as hero) to distribute in content */
export function getDistributedImages(moduleId: number, lessonId: number) {
  const key = `${moduleId}.${lessonId}`;
  const media = lessonMedia[key];
  if (!media?.images) return [];
  // First image is always used as hero — skip it
  return media.images.slice(1);
}

export { MediaImage };
