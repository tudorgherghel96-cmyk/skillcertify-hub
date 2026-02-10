import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Brain, ArrowRight } from "lucide-react";

const CscsPrep = () => {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold">CSCS Test Preparation</h1>
        <p className="text-sm text-muted-foreground">
          Prepare for the CSCS Health &amp; Safety Test with mock questions.
        </p>
      </div>

      <Card>
        <CardContent className="py-6 space-y-4">
          <h2 className="font-semibold">What to expect</h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Closed-book test — no notes allowed</li>
            <li>Multiple choice and image-based questions</li>
            <li>Covers all 5 modules plus behavioural case studies</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" className="h-12">
          <Brain className="mr-2 h-4 w-4" /> Mock Test
        </Button>
        <Button asChild className="h-12">
          <Link to="/cscs-test">
            Take CSCS Test <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CscsPrep;
