import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, CreditCard, QrCode, ShieldCheck, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  if (showSiteCheck) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-background flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-bold text-foreground">Site Check Pass</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowSiteCheck(false)}>
            Close
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">CSCS Registration Number</p>
            <p className="text-4xl font-bold tracking-wider text-foreground">{cscsRegNumber}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-foreground">{cardType}</p>
            {expiryDate && (
              <p className="text-xs text-muted-foreground">Valid until {expiryDate}</p>
            )}
          </div>
          <div className="h-32 w-32 rounded-xl border-2 border-border flex items-center justify-center bg-muted/30">
            <QrCode className="h-16 w-16 text-muted-foreground/40" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified via Smart Check
          </div>
          {!isOnline && cachedAt && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
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
            <p className="text-xs text-muted-foreground">Request your card to get your CSCS number.</p>
            <Button size="sm" className="w-full h-9" disabled>
              Request my card
            </Button>
          </div>
        )}

        {!hasRegNumber && (cardRequestStatus === "submitted" || cardRequestStatus === "processing") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-foreground font-medium">Card requested — waiting for CSCS number</span>
            </div>
            <p className="text-xs text-muted-foreground">Your CSCS number will appear here as soon as it's issued.</p>
          </div>
        )}

        {hasRegNumber && (
          <div className="space-y-3">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Registration Number</p>
              <p className="text-2xl font-bold tracking-wider text-foreground">{cscsRegNumber}</p>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-primary font-medium">
                  {cardRequestStatus === "active" ? "Active" : "Issued"}
                </span>
                {expiryDate && (
                  <span className="text-xs text-muted-foreground">• Valid until {expiryDate}</span>
                )}
              </div>
            </div>
            <Button
              className="w-full h-11"
              onClick={() => setShowSiteCheck(true)}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Show for site check
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
