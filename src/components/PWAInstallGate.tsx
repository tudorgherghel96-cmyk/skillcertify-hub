import React, { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return true;
  if ((navigator as any).standalone === true) return true;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return false;
}

function getPlatform() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isFBBrowser = /FBAN|FBAV/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isLinkedIn = /LinkedInApp/i.test(ua);
  const isInAppBrowser = isFBBrowser || isInstagram || isLinkedIn;
  const isCriOS = /CriOS/.test(ua);
  const isFxiOS = /FxiOS/.test(ua);
  const isIOSNotSafari = isIOS && (isCriOS || isFxiOS || isInAppBrowser);
  const isDesktop = !isIOS && !isAndroid;

  return { isIOS, isAndroid, isInAppBrowser, isIOSNotSafari, isDesktop };
}

function isDismissedRecently(): boolean {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < DISMISS_DURATION;
  } catch {
    return false;
  }
}

// Inline SVGs
const ShareIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const AddIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PWAInstallGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStandalone, setIsStandalone] = useState(() => getIsStandalone());
  const [showGate, setShowGate] = useState(false);
  const [visible, setVisible] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [hasPrompt, setHasPrompt] = useState(false);
  const platform = useRef(getPlatform());

  // Determine if gate should show
  useEffect(() => {
    const { isDesktop } = platform.current;
    if (isDesktop || isStandalone || isDismissedRecently()) {
      setShowGate(false);
      return;
    }
    setShowGate(true);
    requestAnimationFrame(() => setVisible(true));
  }, [isStandalone]);

  // Listen for beforeinstallprompt (Android)
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setHasPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Listen for appinstalled
  useEffect(() => {
    const handler = () => {
      setShowGate(false);
      setIsStandalone(true);
    };
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  // Re-check standalone on visibility change
  useEffect(() => {
    const handler = () => {
      if (!document.hidden && getIsStandalone()) {
        setIsStandalone(true);
        setShowGate(false);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const handleDismiss = useCallback(() => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setVisible(false);
    setTimeout(() => setShowGate(false), 300);
  }, []);

  const handleInstallAndroid = useCallback(async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowGate(false);
    }
    deferredPromptRef.current = null;
    setHasPrompt(false);
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href);
  }, []);

  if (!showGate) return <>{children}</>;

  const { isIOS, isAndroid, isInAppBrowser, isIOSNotSafari } = platform.current;

  const renderContent = () => {
    // In-app browser (Facebook, Instagram, LinkedIn)
    if (isInAppBrowser) {
      return (
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 12 }}>
            Open in your browser
          </p>
          <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.5 }}>
            Tap <strong>⋯</strong> then <strong>"Open in Browser"</strong> to install the app
          </p>
        </div>
      );
    }

    // iOS but not Safari
    if (isIOSNotSafari) {
      return (
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: 20, fontWeight: 600, color: '#1e3a5f', marginBottom: 12 }}>
            Open in Safari to install
          </p>
          <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.5, marginBottom: 24 }}>
            This app needs to be installed from Safari
          </p>
          <button
            onClick={handleCopyLink}
            style={{
              width: '100%',
              height: 56,
              backgroundColor: '#1e3a5f',
              color: 'white',
              border: 'none',
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            Copy Link
          </button>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 12 }}>
            Then paste it in Safari
          </p>
        </div>
      );
    }

    // iOS Safari — 3-step guide
    if (isIOS) {
      const steps = [
        {
          icon: <ShareIcon />,
          text: 'Tap the Share button at the bottom of your screen',
        },
        {
          icon: <AddIcon />,
          text: "Scroll down and tap 'Add to Home Screen'",
        },
        {
          icon: <CheckIcon />,
          text: "Tap 'Add' in the top corner and you're done!",
        },
      ];

      return (
        <div style={{ padding: '0 24px' }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                marginBottom: i < steps.length - 1 ? 28 : 0,
                animation: 'pwaStepPulse 2s ease-in-out infinite',
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ marginBottom: 6 }}>{step.icon}</div>
                <p style={{ fontSize: 18, fontWeight: 500, color: '#1e3a5f', lineHeight: 1.4, margin: 0 }}>
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Android
    if (isAndroid) {
      if (hasPrompt) {
        return (
          <div style={{ padding: '0 24px' }}>
            <button
              onClick={handleInstallAndroid}
              style={{
                width: '100%',
                height: 56,
                backgroundColor: '#1e3a5f',
                color: 'white',
                border: 'none',
                borderRadius: 16,
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <DownloadIcon />
              Install SkillCertify
            </button>
          </div>
        );
      }

      // Manual fallback
      return (
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: 18, fontWeight: 500, color: '#1e3a5f', marginBottom: 16 }}>
            To install the app:
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left', marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#1e3a5f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>1</div>
            <p style={{ fontSize: 18, fontWeight: 500, color: '#1e3a5f', margin: 0, paddingTop: 10 }}>Tap the <strong>⋮</strong> menu button in Chrome</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, textAlign: 'left' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#1e3a5f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>2</div>
            <p style={{ fontSize: 18, fontWeight: 500, color: '#1e3a5f', margin: 0, paddingTop: 10 }}>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {children}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease-in',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style>{`
          @keyframes pwaStepPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>

        <div style={{ width: '100%', maxWidth: 400, padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {/* Header */}
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1e3a5f', margin: 0, letterSpacing: '-0.02em' }}>
            SkillCertify
          </h1>
          <p style={{ fontSize: 18, fontWeight: 500, color: '#334155', margin: '8px 0 0', textAlign: 'center' }}>
            Install the app for the best experience
          </p>
          <p style={{ fontSize: 15, color: '#94a3b8', margin: '4px 0 32px', textAlign: 'center' }}>
            It only takes 10 seconds
          </p>

          {/* Platform-specific content */}
          {renderContent()}

          {/* Dismiss link */}
          <button
            onClick={handleDismiss}
            style={{
              marginTop: 40,
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: 14,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 8,
            }}
          >
            Continue in browser
          </button>
        </div>
      </div>
    </>
  );
};

export default PWAInstallGate;
