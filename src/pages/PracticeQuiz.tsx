import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowLeft, RotateCcw } from "lucide-react";

const PracticeQuiz = () => {
  const { moduleId } = useParams();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link to={`/module/${moduleId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Module {moduleId}
      </Link>

      <div className="text-center space-y-2">
        <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold">Practice Quiz — Module {moduleId}</h1>
        <p className="text-sm text-muted-foreground">
          Unlimited retakes. Drill until you're confident for the GQA test.
        </p>
      </div>

      <Card>
        <CardContent className="py-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm">Practice questions will appear here.</p>
          <Button className="h-12 px-8">
            <RotateCcw className="mr-2 h-4 w-4" /> Start Practice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeQuiz;
