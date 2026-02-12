import { motion } from "framer-motion";
import { Award, Download, Share2, FileText, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type CertState = "awaiting" | "verified" | "downloadable";

interface CertificatePackCardProps {
  state: CertState;
  candidateName?: string;
  regNumber?: string;
  qualificationTitle?: string;
  issuedDate?: string;
  expiryDate?: string;
  reference?: string;
  onBack?: () => void;
}

export default function CertificatePackCard({
  state,
  candidateName = "Learner",
  regNumber = "SC-00000",
  qualificationTitle = "Level 1 Award in Health & Safety in a Construction Environment",
  issuedDate,
  expiryDate,
  reference,
  onBack,
}: CertificatePackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="h-9 -ml-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      )}

      <div className="text-center space-y-1">
        <Award className="h-8 w-8 mx-auto text-primary" />
        <h2 className="text-base font-bold text-foreground">Qualification Certificate</h2>
        <p className="text-xs text-muted-foreground">
          Issued after verification. Keep your documents safe.
        </p>
      </div>

      {state === "awaiting" && (
        <Card>
          <CardContent className="py-5 text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-sm">Awaiting Verification</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your assessment results are being verified by the awarding body. This typically takes 1-3 working days.
            </p>
            <div className="space-y-1.5 text-left max-w-xs mx-auto">
              <ChecklistItem done label="All 5 GQA modules submitted" />
              <ChecklistItem done={false} label="Assessor verification" />
              <ChecklistItem done={false} label="Certificate generation" />
            </div>
          </CardContent>
        </Card>
      )}

      {(state === "verified" || state === "downloadable") && (
        <>
          <Card className="border-emerald-200 dark:border-emerald-800">
            <CardContent className="py-5 space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Award className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-xs font-bold text-emerald-600 badge-sm">VERIFIED</span>
              </div>

              <div className="text-center space-y-0.5">
                <h3 className="font-bold text-sm text-foreground">{qualificationTitle}</h3>
                <p className="text-xs text-muted-foreground">{candidateName} — {regNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">Issued</p>
                  <p className="font-semibold text-foreground">{issuedDate || "—"}</p>
                </div>
                <div className="rounded-lg bg-muted p-2">
                  <p className="text-muted-foreground">Renewal</p>
                  <p className="font-semibold text-foreground">{expiryDate || "N/A"}</p>
                </div>
              </div>

              {reference && (
                <p className="text-[10px] text-center text-muted-foreground">
                  Reference: {reference}
                </p>
              )}
            </CardContent>
          </Card>

          {state === "downloadable" && (
            <div className="space-y-2">
              <Button className="w-full h-11" size="sm">
                <Download className="h-4 w-4 mr-1.5" /> Download Certificate (PDF)
              </Button>
              <Button variant="outline" className="w-full h-11" size="sm">
                <Download className="h-4 w-4 mr-1.5" /> Download Transcript (PDF)
              </Button>
              <Button variant="outline" className="w-full h-11" size="sm">
                <Share2 className="h-4 w-4 mr-1.5" /> Share Link (time-limited)
              </Button>
              <Button variant="ghost" className="w-full h-9 text-xs" size="sm">
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> View Audit Trail
              </Button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
          done
            ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? "✓" : "○"}
      </div>
      <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
