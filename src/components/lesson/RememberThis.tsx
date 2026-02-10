import { Brain } from "lucide-react";

interface RememberThisProps {
  text: string;
}

const RememberThis = ({ text }: RememberThisProps) => (
  <div className="border-2 border-destructive/60 rounded-xl p-4 bg-destructive/5">
    <div className="flex items-start gap-2">
      <Brain className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-destructive mb-1">
          Remember This
        </p>
        <p className="text-[15px] leading-relaxed text-foreground font-medium">{text}</p>
      </div>
    </div>
  </div>
);

export default RememberThis;
