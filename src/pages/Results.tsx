import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ArrowRight } from "lucide-react";

const Results = () => {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Award className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold">Your Results</h1>
        <p className="text-sm text-muted-foreground">Track your progress across all assessments</p>
      </div>

      {/* GQA Results */}
      <Card>
        <CardContent className="py-4 space-y-3">
          <h2 className="font-semibold">GQA Module Results</h2>
          {[1, 2, 3, 4, 5].map((m) => (
            <div key={m} className="flex justify-between items-center text-sm py-1 border-b last:border-0">
              <span>Module {m}</span>
              <span className="text-muted-foreground">Not attempted</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CSCS Result */}
      <Card>
        <CardContent className="py-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold">CSCS Test</span>
            <span className="text-muted-foreground">Not attempted</span>
          </div>
        </CardContent>
      </Card>

      <Button asChild variant="outline" className="w-full h-12">
        <Link to="/cscs-route">
          CSCS Card Pathway <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default Results;
