import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, HelpCircle, QrCode, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

type CardRequestStatus = "not_started" | "ready" | "submitted" | "processing" | "issued";

interface GreenCardStatusProps {
  status: CardRequestStatus;
  candidateName?: string;
  regNumber?: string;
  cardType?: string;
  expiryDate?: string;
  onBack?: () => void;
}

const STATUS_STEPS: { key: CardRequestStatus; label: string }[] = [
  { key: "not_started", label: "Not started" },
  { key: "ready", label: "Ready to request" },
  { key: "submitted", label: "Submitted" },
  { key: "processing", label: "Processing" },
  { key: "issued", label: "Issued" },
];

export default function GreenCardStatus({
  status,
  candidateName = "Learner",
  regNumber = "SC-00000",
  cardType = "Green CSCS Card — Labourer",
  expiryDate,
  onBack,
}: GreenCardStatusProps) {
  const [showDigitalProof, setShowDigitalProof] = useState(false);
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);

  if (showDigitalProof) {
    return (
      <DigitalProof
        candidateName={candidateName}
        regNumber={regNumber}
        cardType={cardType}
        expiryDate={expiryDate}
        status={status}
        onBack={() => setShowDigitalProof(false)}
      />
    );
  }

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
        <CreditCard className="h-8 w-8 mx-auto text-primary" />
        <h2 className="text-base font-bold text-foreground">Green Card Status</h2>
        <p className="text-xs text-muted-foreground">Track your CSCS card request</p>
      </div>

      {/* Status stepper */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <div className="space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const isDone = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={step.key} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                        isDone
                          ? "bg-emerald-500 border-emerald-500 text-primary-foreground"
                          : "bg-muted border-border text-muted-foreground"
                      }`}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                      transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                    >
                      {isDone ? "✓" : i + 1}
                    </motion.div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`w-0.5 h-5 ${isDone ? "bg-emerald-500" : "bg-border"}`} />
                    )}
                  </div>
                  <p className={`text-sm pt-0.5 ${isCurrent ? "font-semibold text-foreground" : isDone ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.label}
                    {isCurrent && (
                      <span className="ml-1.5 text-[10px] font-bold text-primary badge-sm">← Current</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions based on status */}
      {status === "ready" && (
        <Button className="w-full h-11">Submit Card Request</Button>
      )}

      {(status === "submitted" || status === "processing") && (
        <div className="space-y-2">
          <Button variant="outline" className="w-full h-10 text-xs">
            <HelpCircle className="h-4 w-4 mr-1" /> Contact Support
          </Button>
        </div>
      )}

      {status === "issued" && (
        <div className="space-y-2">
          <Button className="w-full h-11" onClick={() => setShowDigitalProof(true)}>
            <QrCode className="h-4 w-4 mr-1.5" /> View Digital Proof
          </Button>
          <Button variant="outline" className="w-full h-10 text-xs">
            <HelpCircle className="h-4 w-4 mr-1" /> Contact Support
          </Button>
        </div>
      )}

      {/* Missing data */}
      {status === "not_started" && (
        <Card>
          <CardContent className="py-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">What's needed</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" /> Level 1 Qualification (verified)
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" /> CSCS H&S Test (passed)
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" /> ID verification
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

function DigitalProof({
  candidateName,
  regNumber,
  cardType,
  expiryDate,
  status,
  onBack,
}: {
  candidateName: string;
  regNumber: string;
  cardType: string;
  expiryDate?: string;
  status: CardRequestStatus;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <Button variant="ghost" size="sm" onClick={onBack} className="h-9 -ml-2">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <Card className="border-2 border-primary overflow-hidden">
        <div className="bg-primary p-4 text-center">
          <p className="text-primary-foreground text-[10px] font-bold tracking-wide uppercase">
            SkillCertify — Digital Proof of Progress
          </p>
        </div>
        <CardContent className="py-5 space-y-4 text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-0.5">
            <p className="font-bold text-foreground">{candidateName}</p>
            <p className="text-xs text-muted-foreground">{regNumber}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{cardType}</p>
            {expiryDate && <p className="text-xs text-muted-foreground">Expires: {expiryDate}</p>}
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 badge-sm">
              {status === "issued" ? "ACTIVE" : "PENDING"}
            </span>
          </div>

          {/* QR placeholder */}
          <div className="mx-auto h-24 w-24 bg-muted rounded-lg flex items-center justify-center">
            <QrCode className="h-12 w-12 text-muted-foreground/40" />
          </div>
        </CardContent>
        <div className="bg-muted px-4 py-2.5">
          <p className="text-[9px] text-muted-foreground text-center leading-relaxed">
            This is not an official CSCS card. It is a SkillCertify proof-of-progress document.
            For official verification, contact CSCS directly.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
