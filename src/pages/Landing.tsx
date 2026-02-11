import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, BookOpen, Award, ArrowRight } from "lucide-react";
import { welcomeMedia } from "@/data/mediaMap";

const benefits = [
  { icon: BookOpen, title: "5 Comprehensive Modules", desc: "Covering all Level 1 Health & Safety topics" },
  { icon: ShieldCheck, title: "GQA Exam Ready", desc: "Practice quizzes that mirror the real assessments" },
  { icon: Award, title: "CSCS Green Card", desc: "Clear pathway to your Labourer card" },
];

const Landing = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative bg-secondary text-secondary-foreground px-4 py-16 sm:py-24 bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to bottom, hsl(var(--secondary) / 0.85), hsl(var(--secondary) / 0.95)), url(${welcomeMedia.hero})` }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Get Your <span className="text-primary">CSCS Green Card</span> with Confidence
          </h1>
          <p className="text-base sm:text-lg text-secondary-foreground/80 max-w-lg mx-auto">
            Level 1 Award in Health &amp; Safety in a Construction Environment. 
            Learn, practise, and pass — all from your phone.
          </p>
          <Button asChild size="lg" className="text-base px-8 h-12">
            <Link to="/select-language">
              Start Course <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-12 sm:py-16 max-w-3xl mx-auto w-full">
        <h2 className="text-xl font-bold text-center mb-8">Why SkillCertify?</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center p-6 rounded-xl border bg-card">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact / Stats */}
      <section className="px-4 py-12 sm:py-16 max-w-3xl mx-auto w-full">
        <div className="rounded-xl overflow-hidden shadow-sm">
          <img
            src={welcomeMedia.stats}
            alt="SkillCertify impact statistics"
            className="w-full rounded-xl"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </section>

      {/* Tagline */}
      <section className="px-4 py-8 text-center border-t">
        <p className="text-sm text-muted-foreground tracking-wide">Construction Training. Redefined.</p>
      </section>
    </div>
  );
};

export default Landing;
