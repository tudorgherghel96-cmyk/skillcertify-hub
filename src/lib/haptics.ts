export function triggerHaptic(type: "success" | "error" | "tap") {
  if (!("vibrate" in navigator)) return;
  try {
    if (type === "success") navigator.vibrate([20, 10, 20]);
    else if (type === "error") navigator.vibrate([60]);
    else navigator.vibrate([10]);
  } catch {
    // Silently fail on unsupported browsers
  }
}
