import { motion } from "framer-motion";
import { Shield, CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuditLogViewer from "./AuditLogViewer";

export interface EvidenceItem {
  id: string;
  label: string;
  status: "pending" | "complete" | "not_started";
  timestamp?: string;
  reference?: string;
}

interface EvidenceSectionProps {
  items: EvidenceItem[];
}

const statusIcon = {
  complete: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  not_started: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
};

const statusLabel = {
  complete: "Complete",
  pending: "Pending",
  not_started: "Not started",
};

export default function EvidenceSection({ items }: EvidenceSectionProps) {
  const [showAudit, setShowAudit] = useState(false);

  if (showAudit) {
    return <AuditLogViewer onBack={() => setShowAudit(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Evidence & Verification</h3>
          </div>

          <div className="space-y-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {statusIcon[item.status]}
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{item.label}</p>
                    {item.timestamp && (
                      <p className="text-[10px] text-muted-foreground">{item.timestamp}</p>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full badge-sm ${
                    item.status === "complete"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : item.status === "pending"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {statusLabel[item.status]}
                </span>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs"
            onClick={() => setShowAudit(true)}
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Audit Trail
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
