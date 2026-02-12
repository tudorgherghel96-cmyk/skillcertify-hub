import { motion } from "framer-motion";
import { User, Globe, LogOut, Mail, Phone, Award, ChevronRight, Unlock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useSuperUser } from "@/contexts/SuperUserContext";
import { allGqaPassed, useProgress } from "@/contexts/ProgressContext";
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

  // Hidden admin access via long-press
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
            {user?.email?.split("@")[0] || "Worker"}
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

      {/* Download certificate */}
      {hasQualification && (
        <motion.div variants={fadeUp}>
          <Card>
            <CardContent className="py-3">
              <button className="flex items-center gap-3 w-full text-left">
                <Download className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium flex-1">Download your certificate</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Support */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="py-4 space-y-3">
            <h3 className="text-sm font-bold">Help & support</h3>
            <a href="mailto:support@skillcertify.co.uk" className="flex items-center gap-3 text-sm py-2 text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" /> support@skillcertify.co.uk
            </a>
            <a href="tel:+44XXXXXXXXXX" className="flex items-center gap-3 text-sm py-2 text-muted-foreground hover:text-foreground">
              <Phone className="h-4 w-4" /> Call us
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
