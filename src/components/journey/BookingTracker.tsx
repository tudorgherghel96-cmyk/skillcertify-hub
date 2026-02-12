import { motion } from "framer-motion";
import { Calendar, ExternalLink, ArrowLeft, Target, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";

interface BookingTrackerProps {
  readinessPercent?: number;
  bookedDate?: string;
  testPassed?: boolean | null;
  onBack?: () => void;
  onBookedDateConfirm?: (date: string) => void;
  onTestResult?: (passed: boolean) => void;
}

export default function BookingTracker({
  readinessPercent = 0,
  bookedDate,
  testPassed,
  onBack,
  onBookedDateConfirm,
  onTestResult,
}: BookingTrackerProps) {
  const [dateInput, setDateInput] = useState("");
  const [showResult, setShowResult] = useState(false);

  const isPastBookedDate = bookedDate && new Date(bookedDate) < new Date();

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
        <Calendar className="h-8 w-8 mx-auto text-primary" />
        <h2 className="text-base font-bold text-foreground">CSCS Health & Safety Test</h2>
        <p className="text-xs text-muted-foreground">Book, prepare, and pass your test</p>
      </div>

      {/* Readiness */}
      <Card>
        <CardContent className="py-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Your Readiness</h3>
            <span className={`text-sm font-bold ${readinessPercent >= 80 ? "text-emerald-600" : readinessPercent >= 60 ? "text-amber-600" : "text-destructive"}`}>
              {readinessPercent}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${readinessPercent >= 80 ? "bg-emerald-500" : readinessPercent >= 60 ? "bg-amber-500" : "bg-destructive"}`}
              initial={{ width: 0 }}
              animate={{ width: `${readinessPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {readinessPercent >= 80
              ? "You're ready! Consider booking your test."
              : "Keep practising — we recommend 80%+ readiness before booking."}
          </p>
        </CardContent>
      </Card>

      {/* Prep actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" asChild className="h-12 text-xs flex-col gap-0.5">
          <Link to="/cscs-test">
            <Target className="h-4 w-4" />
            <span>Mock Test</span>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-12 text-xs flex-col gap-0.5">
          <Link to="/practice-hub">
            <Zap className="h-4 w-4" />
            <span>10-min Drill</span>
          </Link>
        </Button>
      </div>

      {/* Booking */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Book Your Test</h3>

          {!bookedDate ? (
            <>
              <p className="text-xs text-muted-foreground">
                Book your CSCS Health & Safety Test through the official CITB website. Once booked, enter your test date below.
              </p>
              <Button variant="outline" className="w-full h-10 text-xs" asChild>
                <a href="https://www.citb.co.uk/courses-and-qualifications/health-safety-and-environment-test/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> Book on CITB Website
                </a>
              </Button>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                />
                <Button
                  size="sm"
                  className="h-10"
                  disabled={!dateInput}
                  onClick={() => onBookedDateConfirm?.(dateInput)}
                >
                  Confirm
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Test booked for: {new Date(bookedDate).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              {isPastBookedDate && testPassed == null && !showResult && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Your test date has passed. Did you pass?</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-10"
                      onClick={() => onTestResult?.(true)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Yes, I passed!
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-10"
                      onClick={() => {
                        setShowResult(true);
                        onTestResult?.(false);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Not yet
                    </Button>
                  </div>
                </div>
              )}

              {testPassed === false && (
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardContent className="py-3 space-y-2">
                    <p className="text-sm font-semibold text-foreground">Don't worry — you can retake it.</p>
                    <p className="text-xs text-muted-foreground">
                      Review your weak areas, do more practice drills, and rebook when ready.
                    </p>
                    <Button variant="outline" size="sm" className="w-full h-9 text-xs" asChild>
                      <Link to="/practice-hub">Start Recovery Plan</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {testPassed === true && (
                <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
                  <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-500 mb-1" />
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Congratulations! Test passed.</p>
                  <p className="text-xs text-muted-foreground mt-0.5">You can now request your Green Card.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
