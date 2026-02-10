import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ArrowLeft, AlertTriangle } from "lucide-react";

const GqaTest = () => {
  const { moduleId } = useParams();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link to={`/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Module {moduleId}
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold">GQA Module {moduleId} Assessment</h1>
        <p className="text-sm text-muted-foreground">Closed-book test — 80% pass mark — 90 minutes</p>
      </div>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="py-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Before you begin</p>
            <p className="text-muted-foreground mt-1">
              This is a closed-book assessment. No notes allowed. Make sure you've completed all lessons and feel confident with the practice quiz.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            The GQA assessment link will be provided by your training provider.
          </p>
          <Button className="h-12 px-8" disabled>
            <ExternalLink className="mr-2 h-4 w-4" /> Open GQA Test (Link Pending)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GqaTest;
