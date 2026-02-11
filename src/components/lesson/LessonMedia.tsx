import { useState, useCallback } from "react";
import { Play, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { lessonMedia } from "@/data/mediaMap";

interface LessonMediaProps {
  moduleId: number;
  lessonId: number;
  videoDesc: string;
}

function MediaImage({ src, alt, eager = false, variant = "content" }: { src: string; alt: string; eager?: boolean; variant?: "hero" | "content" }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div className="w-full rounded-xl my-4 bg-muted flex items-center justify-center aspect-video">
        <p className="text-sm text-muted-foreground px-4 text-center">{alt}</p>
      </div>
    );
  }

  const isHero = variant === "hero";

  return (
    <div className={`relative w-full ${isHero ? "" : "my-4"}`}>
      {!loaded && (
        <Skeleton className={`w-full ${isHero ? "h-full absolute inset-0" : "aspect-video"} rounded-xl`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full rounded-xl shadow-sm transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${isHero ? "h-full object-contain" : "max-w-full h-auto object-contain"}`}
        loading={eager ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function LessonVideo({ src, fallbackDesc }: { src: string; fallbackDesc: string }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-14 w-14 rounded-full bg-muted-foreground/10 flex items-center justify-center">
            <Play className="h-6 w-6 text-muted-foreground ml-0.5" />
          </div>
          <p className="text-sm font-medium text-muted-foreground px-4 text-center">Video lesson coming soon</p>
        </div>
      </AspectRatio>
    );
  }

  return (
    <AspectRatio ratio={16 / 9} className="bg-secondary rounded-xl overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}
      <video
        src={src}
        controls
        preload="metadata"
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
        onError={() => setError(true)}
        onLoadedMetadata={() => setLoading(false)}
      >
        <track kind="captions" />
      </video>
    </AspectRatio>
  );
}

export function LessonHeroMedia({ moduleId, lessonId, videoDesc }: LessonMediaProps) {
  const key = `${moduleId}.${lessonId}`;
  const media = lessonMedia[key];

  // Show hero image
  const heroImage = media?.images?.[0];

  return (
    <div className="space-y-4">
      {/* Hero Image */}
      {heroImage ? (
        <AspectRatio ratio={16 / 9} className="rounded-xl overflow-hidden" style={{ backgroundColor: "hsl(var(--secondary))" }}>
          <MediaImage src={heroImage.src} alt={heroImage.alt} eager variant="hero" />
        </AspectRatio>
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

      {/* Video Player (below hero, above key terms) */}
      {media?.video && (
        <LessonVideo src={media.video} fallbackDesc={videoDesc} />
      )}
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
