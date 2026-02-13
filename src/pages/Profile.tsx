import { motion } from "framer-motion";
import { User, Globe, LogOut, Mail, Award, ChevronRight, Unlock, Download, Snowflake, Flame, Star, Eye, Type, Zap, Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { allGqaPassed, useProgress } from "@/contexts/ProgressContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useAccessibility, type TextSize } from "@/contexts/AccessibilityContext";
import { inviteFriend, generateReferralCode } from "@/lib/sharing";
import { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isSuperUser, isAdmin, toggleSuperUser } = useSuperUser();
  const { progress } = useProgress();
  const { gamification } = useGamification();
  const { highContrast, reducedMotion, textSize, toggleHighContrast, toggleReducedMotion, setTextSize } = useAccessibility();
  const [showSuperUser, setShowSuperUser] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoPress = () => {
    longPressTimer.current = setTimeout(() => {
      if (!isAdmin) {
        setShowPasscode(true);
      } else {
        setShowSuperUser(true);
      }
    }, 2000);
  };

  const handleLogoRelease = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handlePasscodeSubmit = () => {
    if (passcodeInput === "SCADMIN2024") {
      setShowSuperUser(true);
      setShowPasscode(false);
      setPasscodeInput("");
    }
  };

  const hasQualification = allGqaPassed(progress, false);

  return (
    <motion.div
      className="px-4 py-5 max-w-2xl mx-auto space-y-5 pb-24"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* Profile header */}
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <div
          className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center"
          onTouchStart={handleLogoPress}
          onTouchEnd={handleLogoRelease}
          onMouseDown={handleLogoPress}
          onMouseUp={handleLogoRelease}
        >
          <User className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">
            {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Worker"}
          </h1>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <span>{language.flag} {language.english}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang)}
                      className={`gap-2 ${lang.code === language.code ? "bg-primary/10 font-medium" : ""}`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{lang.english}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak & XP Stats */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> Your Stats
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-foreground">{gamification.totalXp}</p>
                <p className="text-[10px] text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-foreground">{gamification.level}</p>
                <p className="text-[10px] text-muted-foreground">Level</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-lg font-bold text-foreground">{gamification.longestStreak}</p>
                <p className="text-[10px] text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak Freeze */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                <Snowflake className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Streak Freeze</p>
                <p className="text-[11px] text-muted-foreground">
                  {gamification.streakFreezesAvailable > 0
                    ? `${gamification.streakFreezesAvailable} freeze${gamification.streakFreezesAvailable > 1 ? "s" : ""} available — auto-activates if you miss a day`
                    : gamification.streak >= 3
                    ? "Keep your 3+ day streak to earn a free freeze!"
                    : "Reach a 3-day streak to earn your first freeze"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-foreground">{gamification.streak}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Download certificate */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Download your certificate</p>
                <p className="text-[11px] text-muted-foreground">
                  {hasQualification
                    ? "Your certificate is ready to download."
                    : "Your certificate will appear here when you've passed all your tests."}
                </p>
              </div>
              {hasQualification && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Accessibility */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" /> Accessibility
            </h3>

            {/* Text Size */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Type className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Text Size</span>
              </div>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      textSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {size === "small" ? "Small (16)" : size === "medium" ? "Medium (18)" : "Large (20)"}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">High Contrast</p>
                  <p className="text-[10px] text-muted-foreground">WCAG AAA · 7:1 ratio</p>
                </div>
              </div>
              <Switch checked={highContrast} onCheckedChange={toggleHighContrast} />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Reduce Motion</p>
                  <p className="text-[10px] text-muted-foreground">Disable animations</p>
                </div>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invite a friend */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Invite a friend
            </h3>
            <p className="text-xs text-muted-foreground">
              Know someone who needs their CSCS card? Share SkillCertify with them.
            </p>
            <Button
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={() => inviteFriend(language.english)}
            >
              <Share2 className="h-4 w-4" /> Share on WhatsApp
            </Button>
            <div className="flex items-center gap-2 pt-1">
              <p className="text-[10px] text-muted-foreground">Your referral code:</p>
              <code className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">
                {generateReferralCode(user?.id)}
              </code>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-sm font-bold">Help & support</h3>
            <a href="mailto:support@skillcertify.co.uk" className="flex items-center gap-3 text-sm py-2 text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" /> support@skillcertify.co.uk
            </a>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hidden super user (admin only) */}
      {(isAdmin || showSuperUser) && (
        <motion.div variants={fadeUp}>
          <Card className={`border ${isSuperUser ? "border-amber-500 bg-amber-500/10" : "border-border"}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Unlock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">QA Mode</p>
                    <p className="text-[10px] text-muted-foreground">Bypass locks for testing</p>
                  </div>
                </div>
                <Switch
                  checked={isSuperUser}
                  onCheckedChange={toggleSuperUser}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Passcode modal */}
      {showPasscode && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="py-6 space-y-4">
              <h3 className="text-sm font-bold text-center">Enter Admin Code</h3>
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="w-full h-12 rounded-lg border bg-background px-4 text-sm"
                placeholder="Code"
                autoFocus
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { setShowPasscode(false); setPasscodeInput(""); }}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handlePasscodeSubmit}>
                  Confirm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sign out */}
      <motion.div variants={fadeUp}>
        <Button
          variant="outline"
          className="w-full h-12 text-destructive border-destructive/20 hover:bg-destructive/5"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </motion.div>
    </motion.div>
  );
}