import { Lightbulb } from "lucide-react";

interface TestTipProps {
  text: string;
}

const TestTip = ({ text }: TestTipProps) => (
  <div className="border-l-[3px] border-amber-500 rounded-r-xl p-4 bg-amber-50 dark:bg-amber-950/30">
    <div className="flex items-start gap-3">
      <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-amber-700 dark:text-amber-400 mb-1.5">
          📝 Test Tip
        </p>
        <p className="text-[16px] leading-[1.7] font-medium text-foreground">{text}</p>
      </div>
    </div>
  </div>
);

export default TestTip;
