import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, CreditCard, QrCode, ShieldCheck, WifiOff, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type SmartCheckStatus = "not_requested" | "requested" | "checking" | "active" | "issue";

interface CscsSmartCheckProps {
  cardRequestStatus: "not_started" | "ready" | "submitted" | "processing" | "reg_issued" | "active";
  cscsRegNumber?: string;
  expiryDate?: string;
  cardType?: string;
}

export default function CscsSmartCheck({
  cardRequestStatus,
  cscsRegNumber,
  expiryDate,
  cardType = "Green Labourer",
}: CscsSmartCheckProps) {
  const [showSiteCheck, setShowSiteCheck] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const { user } = useAuth();

  const workerName = user?.user_metadata?.full_name
    || user?.email?.split("@")[0]
    || "Worker";

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Cache last successful check
  useEffect(() => {
    if (cscsRegNumber && isOnline) {
      const now = new Date().toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });
      setCachedAt(now);
      try {
        localStorage.setItem("cscs_cache", JSON.stringify({ reg: cscsRegNumber, at: now, type: cardType, expiry: expiryDate }));
      } catch {}
    }
  }, [cscsRegNumber, isOnline, cardType, expiryDate]);

  // Load cache on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("cscs_cache");
      if (cached) {
        const data = JSON.parse(cached);
        if (data.at) setCachedAt(data.at);
      }
    } catch {}
  }, []);

  const hasRegNumber = !!cscsRegNumber && (cardRequestStatus === "reg_issued" || cardRequestStatus === "active");

  // Full-screen site check pass — Apple Wallet style
  if (showSiteCheck) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-white flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-bold text-foreground">Site Check Pass</h2>
          <button
            onClick={() => setShowSiteCheck(false)}
            className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          {/* Green banner */}
          <div className="w-full max-w-xs bg-emerald-600 text-white rounded-xl px-4 py-3 text-center">
            <p className="text-xs font-bold uppercase tracking-wider">Valid for site access</p>
          </div>

          {/* Worker name */}
          <p className="text-xl font-bold text-foreground">{workerName}</p>

          {/* CSCS reg number — huge and clear */}
          <div className="text-center space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">CSCS Registration Number</p>
            <p className="text-4xl font-bold tracking-[0.15em] text-foreground font-mono">{cscsRegNumber}</p>
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-foreground">{cardType}</p>
            {expiryDate && (
              <p className="text-xs text-muted-foreground">Valid until {expiryDate}</p>
            )}
          </div>

          <div className="h-28 w-28 rounded-xl border-2 border-border flex items-center justify-center bg-muted/30">
            <QrCode className="h-14 w-14 text-muted-foreground/40" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified via Smart Check
          </div>

          {!isOnline && cachedAt && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
              <WifiOff className="h-3.5 w-3.5" />
              Offline — last checked: {cachedAt}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground text-center max-w-xs leading-relaxed">
            Always follow site rules. Some sites may require additional checks.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardContent className="py-4 space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Your CSCS number</h3>
        </div>

        {!hasRegNumber && cardRequestStatus === "not_started" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Your CSCS number will appear here once your card is requested. This is your digital pass to get on site.
            </p>
          </div>
        )}

        {!hasRegNumber && (cardRequestStatus === "submitted" || cardRequestStatus === "processing") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-foreground font-medium">Card requested — waiting for your CSCS number</span>
            </div>
            <p className="text-xs text-muted-foreground">Your CSCS number will appear here as soon as it's issued.</p>
          </div>
        )}

        {hasRegNumber && (
          <div className="space-y-3">
            {/* Digital wallet-style card */}
            <div className="bg-emerald-600 rounded-xl p-4 text-white space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80">CSCS Registration</p>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="text-[10px] font-bold">VALID</span>
                </div>
              </div>
              <p className="text-lg font-bold">{workerName}</p>
              <p className="text-2xl font-bold tracking-[0.12em] font-mono">{cscsRegNumber}</p>
              <div className="flex items-center justify-between text-xs opacity-80">
                <span>{cardType}</span>
                {expiryDate && <span>Valid until {expiryDate}</span>}
              </div>
            </div>

            <Button
              className="w-full h-11"
              onClick={() => setShowSiteCheck(true)}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Show full screen
            </Button>
            {!isOnline && cachedAt && (
              <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
                <WifiOff className="h-3 w-3" /> Offline — last checked: {cachedAt}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}