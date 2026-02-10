import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, ArrowLeft } from "lucide-react";

const CscsTest = () => {
  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      <Link to="/cscs-prep" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Prep
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold">CSCS Health &amp; Safety Test</h1>
        <p className="text-sm text-muted-foreground">Closed-book assessment delivered via GQAonline</p>
      </div>

      <Card>
        <CardContent className="py-8 text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            The CSCS test link will be provided by your training provider.
          </p>
          <Button className="h-12 px-8" disabled>
            <ExternalLink className="mr-2 h-4 w-4" /> Open CSCS Test (Link Pending)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CscsTest;
