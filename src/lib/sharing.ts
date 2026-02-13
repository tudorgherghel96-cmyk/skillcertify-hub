const APP_URL = "https://skillcert-buddy.lovable.app";
const WHATSAPP_SUPPORT_NUMBER = "447000000000"; // Replace with real number

export interface ShareOptions {
  text: string;
  title?: string;
  url?: string;
}

/**
 * Share via Web Share API with WhatsApp wa.me fallback
 */
export async function shareContent({ text, title, url }: ShareOptions) {
  const fullText = url ? `${text}\n${url}` : text;

  if (navigator.share) {
    try {
      await navigator.share({ title: title || "SkillCertify", text: fullText });
      return;
    } catch {
      // User cancelled or API failed — fall through to WhatsApp
    }
  }

  // Fallback: open WhatsApp
  const encoded = encodeURIComponent(fullText);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}

/**
 * Share achievement after passing a topic test
 */
export function shareAchievement(topicName: string) {
  shareContent({
    title: "I passed on SkillCertify!",
    text: `I just passed ${topicName} on SkillCertify! 🎉 Working toward my CSCS Green Card. Try it:`,
    url: APP_URL,
  });
}

/**
 * Share overall progress
 */
export function shareProgress(topicsDone: number, totalTopics: number, streakDays: number) {
  const pct = Math.round((topicsDone / totalTopics) * 100);
  shareContent({
    title: "My SkillCertify Progress",
    text: `I'm ${pct}% through my CSCS Green Card course! 💪 ${topicsDone}/${totalTopics} topics done, ${streakDays}-day streak. Check it out:`,
    url: APP_URL,
  });
}

/**
 * Invite a friend with optional language context
 */
export function inviteFriend(languageName?: string) {
  const langPart = languageName && languageName !== "English"
    ? ` It's all on your phone and in ${languageName}.`
    : " It's all on your phone.";
  shareContent({
    title: "Try SkillCertify",
    text: `Hey, I'm using this app to get my CSCS Green Card.${langPart} Check it out:`,
    url: APP_URL,
  });
}

/**
 * Open WhatsApp support with pre-filled context
 */
export function openWhatsAppSupport(context: {
  name?: string;
  language?: string;
  currentTopic?: string;
}) {
  const parts = ["Hi, I need help with SkillCertify."];
  if (context.name) parts.push(`Name: ${context.name}`);
  if (context.language && context.language !== "English") parts.push(`Language: ${context.language}`);
  if (context.currentTopic) parts.push(`Currently on: ${context.currentTopic}`);

  const msg = encodeURIComponent(parts.join("\n"));
  window.open(`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${msg}`, "_blank");
}

/**
 * Generate a simple referral code from user ID
 */
export function generateReferralCode(userId?: string): string {
  if (!userId) return "CSCS2024";
  return "SC" + userId.slice(0, 6).toUpperCase();
}
