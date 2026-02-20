import { Volume2, VolumeX } from "lucide-react";

interface MuteToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export default function MuteToggle({ muted, onToggle }: MuteToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? "Unmute" : "Mute"}
      style={{
        position: "absolute",
        bottom: 24,
        left: 16,
        zIndex: 20,
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "pointer",
      }}
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
