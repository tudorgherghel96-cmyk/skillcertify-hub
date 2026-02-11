import { useState } from "react";
import { Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { lessonMedia } from "@/data/mediaMap";

interface LessonMediaProps {
  moduleId: number;
  lessonId: number;
  videoDesc: string;
}

function MediaImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full rounded-xl my-4 bg-muted flex items-center justify-center aspect-video">
        <p className="text-sm text-muted-foreground px-4 text-center">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-xl my-4 shadow-sm"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function LessonHeroMedia({ moduleId, lessonId, videoDesc }: LessonMediaProps) {
  const key = `${moduleId}.${lessonId}`;
  const media = lessonMedia[key];
  const [videoError, setVideoError] = useState(false);

  if (media?.video && !videoError) {
    return (
      <AspectRatio ratio={16 / 9} className="bg-secondary rounded-xl overflow-hidden">
        <video
          src={media.video}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
          onError={() => setVideoError(true)}
        >
          <track kind="captions" />
        </video>
      </AspectRatio>
    );
  }

  if (media?.images?.[0]) {
    return (
      <AspectRatio ratio={16 / 9} className="bg-secondary rounded-xl overflow-hidden">
        <MediaImage src={media.images[0].src} alt={media.images[0].alt} />
      </AspectRatio>
    );
  }

  // Fallback placeholder
  return (
    <AspectRatio ratio={16 / 9} className="bg-secondary rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
          <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
        </div>
        <p className="text-sm font-medium text-secondary-foreground/80 px-4 text-center">{videoDesc}</p>
      </div>
    </AspectRatio>
  );
}

/** Returns remaining images (skipping first if used as hero) to distribute in content */
export function getDistributedImages(moduleId: number, lessonId: number) {
  const key = `${moduleId}.${lessonId}`;
  const media = lessonMedia[key];
  if (!media?.images) return [];
  // If no video, first image was used as hero — skip it
  const startIndex = media.video ? 0 : 1;
  return media.images.slice(startIndex);
}

export { MediaImage };
