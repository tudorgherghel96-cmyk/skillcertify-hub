import { WifiOff, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfflineFallbackProps {
  moduleId?: number;
  message?: string;
}

/**
 * Shown when content hasn't been cached and user is offline.
 * Never shows a blank/error screen.
 */
export default function OfflineFallback({ moduleId, message }: OfflineFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
        <WifiOff className="h-10 w-10 text-muted-foreground/50" />
      </div>

      <div className="space-y-2 max-w-xs">
        <h2 className="text-lg font-bold text-foreground">No connection</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message || "Download this topic on WiFi to learn offline. Your cached content is still available."}
        </p>
      </div>

      {moduleId && (
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            // Navigate back when online
            if (navigator.onLine) {
              window.location.reload();
            }
          }}
          aria-label="Retry loading content"
        >
          <Download className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
