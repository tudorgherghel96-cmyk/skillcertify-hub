import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AuditEntry {
  event: string;
  timestamp: string;
  actor: "system" | "assessor" | "learner";
  reference?: string;
}

interface AuditLogViewerProps {
  onBack: () => void;
  entries?: AuditEntry[];
}

const MOCK_ENTRIES: AuditEntry[] = [
  { event: "Account created", timestamp: "2025-01-15 09:30", actor: "system", reference: "ACC-001" },
  { event: "Module 1 lessons completed", timestamp: "2025-01-20 14:12", actor: "learner" },
  { event: "Module 1 practice quiz passed (85%)", timestamp: "2025-01-21 10:05", actor: "learner" },
  { event: "GQA Module 1 assessment submitted", timestamp: "2025-01-22 11:30", actor: "learner", reference: "GQA-M1-001" },
  { event: "GQA Module 1 verified", timestamp: "2025-01-23 09:00", actor: "assessor", reference: "GQA-M1-001" },
];

const actorColors = {
  system: "bg-muted text-muted-foreground",
  assessor: "bg-primary/10 text-primary",
  learner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export default function AuditLogViewer({ onBack, entries = MOCK_ENTRIES }: AuditLogViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="font-bold text-sm text-foreground">Audit Trail</h3>
          <p className="text-[10px] text-muted-foreground">Read-only compliance log</p>
        </div>
      </div>

      <Card>
        <CardContent className="py-3 space-y-0">
          {entries.map((entry, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-border/50 last:border-0">
              <div className="flex flex-col items-center pt-1">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                {i < entries.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{entry.event}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{entry.timestamp}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full badge-sm ${actorColors[entry.actor]}`}>
                    {entry.actor}
                  </span>
                </div>
                {entry.reference && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Ref: {entry.reference}
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-[10px] text-muted-foreground text-center">
        This log is read-only and maintained for compliance purposes.
      </p>
    </motion.div>
  );
}
