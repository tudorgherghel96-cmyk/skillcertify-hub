import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import skillcertifyLogo from "@/assets/skillcertify-logo.png";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card px-4 h-14 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-bold text-foreground">Privacy Policy</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <img src={skillcertifyLogo} alt="SkillCertify" className="h-10" />

        <h1 className="text-xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: February 2026</p>

        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. Who We Are</h2>
            <p>SkillCertify Ltd ("we", "us", "our") is registered in England & Wales. Our registered address is Zeus House, London, N1 7NG. We are a GQA-approved centre delivering the Level 1 Award in Health and Safety in a Construction Environment.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. Information We Collect</h2>
            <p>We collect the following personal data when you use our platform:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account information:</strong> Name, email address, and password (encrypted).</li>
              <li><strong>Learning data:</strong> Lesson progress, quiz scores, assessment results, and study time.</li>
              <li><strong>Device information:</strong> Browser type, device type, and IP address for security and analytics.</li>
              <li><strong>Language preference:</strong> Your selected language for content delivery.</li>
              <li><strong>CSCS data:</strong> Registration numbers and test results for card application processing.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To deliver and personalise your learning experience.</li>
              <li>To track your progress toward certification and CSCS card eligibility.</li>
              <li>To process your GQA assessment submissions and issue certificates.</li>
              <li>To communicate with you about your course progress and support queries.</li>
              <li>To improve our platform and learning content.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Legal Basis for Processing</h2>
            <p>We process your data under the following legal bases (UK GDPR):</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contract:</strong> To deliver the course and certification services you have purchased.</li>
              <li><strong>Legitimate interest:</strong> To improve our services and ensure platform security.</li>
              <li><strong>Legal obligation:</strong> To maintain assessment records as required by GQA and Ofqual.</li>
              <li><strong>Consent:</strong> For marketing communications (you can opt out at any time).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">5. Data Sharing</h2>
            <p>We share your data with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>GQA Qualifications:</strong> Assessment results for certification and quality assurance.</li>
              <li><strong>CSCS:</strong> Qualification data to facilitate your card application.</li>
              <li><strong>Supabase:</strong> Our database provider (data stored in the EU).</li>
            </ul>
            <p>We never sell your personal data to third parties.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">6. Data Retention</h2>
            <p>We retain your account and learning data for as long as your account is active. Assessment records are retained for a minimum of 3 years as required by awarding body regulations. You can request deletion of your account and data at any time by contacting us.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">7. Your Rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal data.</li>
              <li>Rectify inaccurate data.</li>
              <li>Erase your data (subject to legal retention requirements).</li>
              <li>Restrict or object to processing.</li>
              <li>Data portability.</li>
              <li>Withdraw consent at any time.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">8. Cookies</h2>
            <p>We use essential cookies to maintain your session and preferences. We do not use advertising cookies. Analytics cookies are used to improve our service and can be disabled in your browser settings.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">9. Contact Us</h2>
            <p>For any privacy-related queries, contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:support@skillcertify.co.uk" className="text-primary underline">support@skillcertify.co.uk</a></p>
            <p><strong>Address:</strong> Zeus House, London, N1 7NG</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">10. Supervisory Authority</h2>
            <p>If you are not satisfied with how we handle your data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline">ico.org.uk</a>.</p>
          </section>
        </div>

        <div className="pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SkillCertify Ltd. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Zeus House, London, N1 7NG</p>
        </div>
      </div>
    </div>
  );
}
