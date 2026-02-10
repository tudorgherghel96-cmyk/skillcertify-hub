import { Lightbulb } from "lucide-react";

interface TestTipProps {
  text: string;
}

const TestTip = ({ text }: TestTipProps) => (
  <div className="border-l-4 border-amber-500 rounded-r-xl p-4 bg-amber-50 dark:bg-amber-950/30">
    <div className="flex items-start gap-2">
      <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
          Test Tip
        </p>
        <p className="text-[15px] leading-relaxed text-foreground">{text}</p>
      </div>
    </div>
  </div>
);

export default TestTip;
