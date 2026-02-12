import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Target, CreditCard, HardHat } from "lucide-react";
import CardWallet from "@/components/journey/CardWallet";

const benefits = [
  {
    icon: Smartphone,
    label: "Learn on your phone",
  },
  {
    icon: Target,
    label: "Know when you're ready",
  },
  {
    icon: CreditCard,
    label: "Get your card",
  },
];

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-secondary text-secondary-foreground px-4 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-semibold"
          >
            <HardHat className="h-3.5 w-3.5" />
            UK Construction Workers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-2xl sm:text-4xl font-bold leading-tight tracking-tight"
          >
            Get your CSCS Green Card.{" "}
            <span className="text-primary">Start to finish, from your phone.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-sm sm:text-base text-secondary-foreground/75 max-w-lg mx-auto leading-relaxed"
          >
            Learn the safety stuff, pass the test, get your card. We'll walk you through every step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-3 pt-2"
          >
            <Button
              asChild
              size="lg"
              className="text-base px-8 h-12 font-semibold w-full max-w-xs active:scale-[0.97] transition-transform"
            >
              <Link to="/select-language">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="link"
              className="text-secondary-foreground/60 text-xs font-medium h-auto min-h-0 p-0"
            >
              <Link to="/auth">
                Already have an account? Sign in
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Card Wallet */}
      <section className="px-4 -mt-1 pt-6 pb-2 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <CardWallet currentTarget="green" />
          <p className="text-xs text-muted-foreground text-center mt-3 px-4 leading-relaxed">
            Start with Green. Then go for Blue, Gold, or Black — all from the same app.
          </p>
        </motion.div>
      </section>

      {/* 3 simple benefits */}
      <section className="px-4 py-10 sm:py-14 max-w-2xl mx-auto w-full">
        <div className="flex justify-center gap-8 sm:gap-12">
          {benefits.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground leading-tight max-w-[80px]">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="px-4 py-6 text-center border-t mt-auto">
        <p className="text-xs text-muted-foreground tracking-wide">
          No classroom. No waiting. Just your phone.
        </p>
      </section>
    </div>
  );
};

export default Landing;