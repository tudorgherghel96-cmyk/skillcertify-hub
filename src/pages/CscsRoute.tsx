import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

const steps = [
  { title: "Complete All 5 Modules", desc: "Watch lessons, practice quizzes, pass GQA tests" },
  { title: "Achieve Level 1 Qualification", desc: "All 5 GQA modular assessments passed (80%+)" },
  { title: "Pass CSCS Health & Safety Test", desc: "Closed-book test covering all modules" },
  { title: "Apply for CSCS Green Labourer Card", desc: "Use your qualification + test results to apply" },
];

const CscsRoute = () => {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link to="/results" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Results
      </Link>

      <div>
        <h1 className="text-xl font-bold">Your Path to the CSCS Green Card</h1>
        <p className="text-sm text-muted-foreground mt-1">Follow these steps to get your Labourer card</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 rounded-full border-2 border-primary/30 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
            </div>
            <div className="pb-6">
              <h3 className="font-semibold text-sm">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CscsRoute;
