export default function SafetySignIcon({ icon, size = 28 }: { icon: string; size?: number }) {
  switch (icon) {
    case "prohibition":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="18" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          <line x1="10" y1="10" x2="30" y2="30" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "warning":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <polygon points="20,4 38,36 2,36" fill="#eab308" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
          <text x="20" y="31" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#1a1a1a">!</text>
        </svg>
      );
    case "mandatory":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
          <circle cx="20" cy="20" r="6" fill="white" />
        </svg>
      );
    case "safe_condition":
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
          <rect x="2" y="8" width="36" height="24" rx="3" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
          <text x="20" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">+</text>
        </svg>
      );
    default:
      return null;
  }
}
