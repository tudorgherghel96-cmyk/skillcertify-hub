

# PWA Install Gate — Full Implementation Plan

## Overview
Create a full-screen install gate component that blocks mobile browser users from accessing the app until they install it as a PWA. Desktop users and already-installed PWA users pass through normally.

## Changes

### 1. Update `index.html` meta tags (lines 10-16)
Replace existing PWA meta block with the specified meta tags. Update `theme-color` to `#1e3a5f`, `apple-mobile-web-app-status-bar-style` to `default`, keep `apple-touch-icon` pointing to existing `pwa-192x192.png`, add `mobile-web-app-capable` meta. Keep the existing manifest link (Vite PWA plugin generates it).

### 2. Update `vite.config.ts` manifest section
Update the PWA manifest values: `theme_color` → `#1e3a5f`, `background_color` → `#ffffff`, `start_url` → `/`, add `orientation: "portrait-primary"`. Keep existing icons pointing to `pwa-192x192.png` and `pwa-512x512.png`.

### 3. Create `src/components/PWAInstallGate.tsx`
Single self-contained component (~350 lines). All logic in one file.

**Detection logic:**
- `isStandalone`: checks `display-mode: standalone` media query + `navigator.standalone` for iOS
- `isIOS`: UA check for iPhone/iPad + Mac with touch (iPad)
- `isAndroid`: UA check
- `isInAppBrowser`: UA check for FBAN, FBAV, Instagram, LinkedIn
- `isIOSNotSafari`: iOS but Chrome/Firefox/in-app browser
- `isDesktop`: not iOS and not Android
- Re-check on `visibilitychange` to catch post-install returns

**State management:**
- `showGate`: derived from platform + standalone + dismissed timestamp
- `deferredPrompt`: stored from `beforeinstallprompt` event
- 24-hour dismiss logic via `localStorage` key `pwa-install-dismissed`

**Rendering (platform-specific):**
- Full-screen fixed overlay, white background, z-99999, fade-in 300ms
- Top: "SkillCertify" bold title + "Install the app for the best experience" + "It only takes 10 seconds"
- **Android**: Big navy "Install SkillCertify" button triggering stored prompt. Fallback to manual 3-dot menu instructions if no prompt available. Auto-dismiss on `appinstalled`.
- **iOS Safari**: 3-step vertical stepper with inline SVG icons (share icon, add-to-home-screen icon), pulsing animation on current step, large numbered circles (48px, navy bg)
- **iOS non-Safari**: "Open this page in Safari" message + "Copy Link" button
- **In-app browser**: "Tap ⋯ then Open in Browser" message
- Bottom: "Continue in browser" muted link

**Design tokens:**
- Primary: `#1e3a5f`
- All inline styles (no Tailwind dependency for the gate itself, though can use Tailwind classes)
- Step circles: 48px, navy bg, white text
- Step text: 18px, font-weight 500
- Install button: full-width, 56px tall, rounded-xl, download icon SVG

### 4. Update `src/App.tsx`
Wrap the entire app content (everything inside QueryClientProvider) with `<PWAInstallGate>...</PWAInstallGate>`. Import the new component.

## Files to create/modify
- `index.html` — update meta tags
- `vite.config.ts` — update manifest values
- `src/components/PWAInstallGate.tsx` — new file (single component, all logic)
- `src/App.tsx` — wrap with PWAInstallGate

## Technical details

```text
Render flow:
  App.tsx
    └─ PWAInstallGate
         ├─ isDesktop OR isStandalone → render {children}
         ├─ dismissed < 24h ago → render {children}
         └─ mobile browser → render overlay + {children hidden behind it}

Platform detection:
  iOS Safari     → 3-step visual guide
  iOS non-Safari → "Open in Safari" + copy link
  In-app browser → "Open in Browser" instructions
  Android        → beforeinstallprompt button / manual fallback
  Desktop        → no gate, pass through
```

