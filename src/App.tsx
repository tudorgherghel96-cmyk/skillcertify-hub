import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { SuperUserProvider } from "@/contexts/SuperUserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import PWAInstallGate from "@/components/PWAInstallGate";
import OfflineBanner from "@/components/layout/OfflineBanner";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Route-level code splitting
const Landing = React.lazy(() => import("@/pages/Landing"));
const SelectLanguage = React.lazy(() => import("@/pages/SelectLanguage"));
const Auth = React.lazy(() => import("@/pages/Auth"));
const JourneyDashboard = React.lazy(() => import("@/pages/JourneyDashboard"));
const LearnHub = React.lazy(() => import("@/pages/LearnHub"));
const MyCard = React.lazy(() => import("@/pages/MyCard"));
const Profile = React.lazy(() => import("@/pages/Profile"));
const ModuleOverview = React.lazy(() => import("@/pages/ModuleOverview"));
const LessonPlayer = React.lazy(() => import("@/pages/LessonPlayer"));
const PracticeQuiz = React.lazy(() => import("@/pages/PracticeQuiz"));
const GqaTest = React.lazy(() => import("@/pages/GqaTest"));
const CscsPrep = React.lazy(() => import("@/pages/CscsPrep"));
const CscsTest = React.lazy(() => import("@/pages/CscsTest"));
const Results = React.lazy(() => import("@/pages/Results"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const BoostDrill = React.lazy(() => import("@/pages/BoostDrill"));
const Privacy = React.lazy(() => import("@/pages/Privacy"));
const Terms = React.lazy(() => import("@/pages/Terms"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PWAInstallGate>
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
            <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/select-language" element={<SelectLanguage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              {/* Lesson player is always full-screen — outside AppLayout */}
              <Route path="/lesson/1/1" element={<LessonPlayer />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<JourneyDashboard />} />
                <Route path="/learn" element={<LearnHub />} />
                <Route path="/my-card" element={<MyCard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/module/:id" element={<ModuleOverview />} />
              </Route>
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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
              <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                <Route path="/lesson/:moduleId/:lessonId" element={<LessonPlayer />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
        </AccessibilityProvider>
        </SuperUserProvider>
        </GamificationProvider>
      </ProgressProvider>
    </LanguageProvider>
    </AuthProvider>
    </PWAInstallGate>
  </QueryClientProvider>
);

export default App;
