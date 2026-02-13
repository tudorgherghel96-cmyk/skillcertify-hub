import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import skillcertifyLogo from "@/assets/skillcertify-logo.png";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card px-4 h-14 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-bold text-foreground">Terms & Conditions</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <img src={skillcertifyLogo} alt="SkillCertify" className="h-10" />

        <h1 className="text-xl font-bold text-foreground">Terms & Conditions</h1>
        <p className="text-xs text-muted-foreground">Last updated: February 2026</p>

        <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">1. About Us</h2>
            <p>SkillCertify Ltd ("SkillCertify", "we", "us") operates an online learning platform delivering the GQA Level 1 Award in Health and Safety in a Construction Environment (QAN: 601/2322/9). Our registered office is at Zeus House, London, N1 7NG.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">2. Services</h2>
            <p>We provide:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Online learning content for the Level 1 Health & Safety qualification.</li>
              <li>Practice assessments and mock CSCS tests.</li>
              <li>GQA-approved assessment (internally assessed and externally quality assured).</li>
              <li>Digital certificate issuance upon successful completion.</li>
              <li>Guidance on CSCS card application.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">3. Registration & Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must provide accurate and truthful information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 16 years old to use our platform.</li>
              <li>One account per person. Account sharing is not permitted.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">4. Course Fees & Payment</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Course fees are displayed at the point of purchase and include the GQA registration and certification fee.</li>
              <li>The CSCS Health, Safety and Environment test fee (currently £21) is payable directly to the test provider.</li>
              <li>The CSCS card application fee (currently £36) is payable directly to CSCS.</li>
              <li>Payment is processed securely through our payment provider.</li>
              <li>Instalments may be available via Klarna — subject to eligibility.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">5. Refund Policy</h2>
            <p>You may request a full refund within 14 days of purchase if you have not completed more than 25% of the course content. After this period, or if more than 25% has been completed, refunds are at our discretion. GQA registration fees are non-refundable once the registration has been submitted.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">6. Assessment Rules</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Assessments must be completed by the registered learner only. Impersonation is grounds for immediate disqualification.</li>
              <li>You may retake failed assessments. A cooling-off period may apply between attempts.</li>
              <li>All assessment evidence is subject to internal and external quality assurance by GQA.</li>
              <li>We reserve the right to void results in cases of malpractice.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">7. Referral Programme</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Referrers receive £20 credit when their referred friend completes a purchase.</li>
              <li>Referred friends receive £10 off the course price.</li>
              <li>Referral rewards are subject to verification and may take up to 7 days to be credited.</li>
              <li>Self-referrals and fraudulent referrals will result in reward forfeiture.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">8. Intellectual Property</h2>
            <p>All course content, materials, assessments, and software are owned by SkillCertify Ltd or licensed to us. You may not copy, distribute, or reproduce any content without our written permission.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>While we make every effort to provide accurate and up-to-date content, we do not guarantee that you will pass the CSCS test or receive a CSCS card. Success depends on your individual effort and performance. We are not liable for any delays in CSCS card issuance by CSCS Ltd.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">10. Malpractice & Maladministration</h2>
            <p>We have a duty to report suspected malpractice to GQA. This includes impersonation, collusion, plagiarism, or any attempt to gain an unfair advantage. Suspected cases will be investigated in line with GQA's malpractice policy.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">11. Complaints</h2>
            <p>If you have a complaint about our services, please contact us at <a href="mailto:support@skillcertify.co.uk" className="text-primary underline">support@skillcertify.co.uk</a>. We aim to resolve complaints within 10 working days. If you remain unsatisfied, you may escalate to GQA Qualifications.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">12. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">13. Contact</h2>
            <p><strong>Email:</strong> <a href="mailto:support@skillcertify.co.uk" className="text-primary underline">support@skillcertify.co.uk</a></p>
            <p><strong>Address:</strong> Zeus House, London, N1 7NG</p>
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
