import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { SuperUserProvider } from "@/contexts/SuperUserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import OfflineBanner from "@/components/layout/OfflineBanner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Landing from "@/pages/Landing";
import SelectLanguage from "@/pages/SelectLanguage";
import Auth from "@/pages/Auth";
import JourneyDashboard from "@/pages/JourneyDashboard";
import LearnHub from "@/pages/LearnHub";
import MyCard from "@/pages/MyCard";
import Profile from "@/pages/Profile";
import ModuleOverview from "@/pages/ModuleOverview";
import LessonPlayer from "@/pages/LessonPlayer";
import PracticeQuiz from "@/pages/PracticeQuiz";
import GqaTest from "@/pages/GqaTest";
import CscsPrep from "@/pages/CscsPrep";
import CscsTest from "@/pages/CscsTest";
import Results from "@/pages/Results";
import NotFound from "@/pages/NotFound";
import BoostDrill from "@/pages/BoostDrill";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <LanguageProvider>
      <ProgressProvider>
        <GamificationProvider>
        <SuperUserProvider>
        <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineBanner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/select-language" element={<SelectLanguage />} />
              {/* Play-first: Lesson 1.1 accessible without auth */}
              <Route path="/lesson/1/1" element={<AppLayout />}>
                <Route index element={<LessonPlayer />} />
              </Route>
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<JourneyDashboard />} />
                <Route path="/learn" element={<LearnHub />} />
                <Route path="/my-card" element={<MyCard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/module/:id" element={<ModuleOverview />} />
                <Route path="/lesson/:moduleId/:lessonId" element={<LessonPlayer />} />
                <Route path="/practice/boost" element={<BoostDrill />} />
                <Route path="/practice/:moduleId" element={<PracticeQuiz />} />
                <Route path="/gqa-test/:moduleId" element={<GqaTest />} />
                <Route path="/cscs-prep" element={<CscsPrep />} />
                <Route path="/cscs-test" element={<CscsTest />} />
                <Route path="/results" element={<Results />} />
                {/* Legacy redirects */}
                <Route path="/journey" element={<Navigate to="/my-card" replace />} />
                <Route path="/practice-hub" element={<Navigate to="/learn" replace />} />
                <Route path="/cscs-route" element={<Navigate to="/my-card" replace />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        </AccessibilityProvider>
        </SuperUserProvider>
        </GamificationProvider>
      </ProgressProvider>
    </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
