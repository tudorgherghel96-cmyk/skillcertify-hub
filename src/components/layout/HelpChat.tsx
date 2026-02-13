import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { openWhatsAppSupport } from "@/lib/sharing";

const WHATSAPP_MESSAGE = encodeURIComponent("Hi, I need help with my CSCS card journey on SkillCertify.");

interface Message {
  id: number;
  text: string;
  from: "user" | "bot";
}

export default function HelpChat() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "chat">("menu");
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hi! How can we help you today?", from: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text, from: "user" },
      { id: Date.now() + 1, text: "Thanks for your message! Our team will get back to you shortly.", from: "bot" },
    ]);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 w-[320px] rounded-2xl border bg-card shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">Need help?</span>
              <button onClick={() => { setOpen(false); setView("menu"); }} className="p-1 hover:opacity-80">
                <X className="h-4 w-4" />
              </button>
            </div>

            {view === "menu" ? (
              <div className="p-4 space-y-3">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    openWhatsAppSupport({
                      name: user?.user_metadata?.full_name || user?.email?.split("@")[0],
                      language: language.english,
                    });
                  }}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-600 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.553 4.12 1.52 5.855L0 24l6.335-1.652A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.88 0-3.63-.508-5.14-1.392l-.368-.22-3.756.98.997-3.648-.24-.384A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">WhatsApp us</p>
                    <p className="text-xs text-muted-foreground">Quick reply on WhatsApp</p>
                  </div>
                </a>
                <button
                  onClick={() => setView("chat")}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:bg-accent transition-colors w-full text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Chat with us</p>
                    <p className="text-xs text-muted-foreground">Send a message here</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex flex-col h-[340px]">
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${
                        m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t p-3 flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="min-h-[40px] max-h-[80px] text-xs resize-none"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  />
                  <Button size="icon" className="shrink-0 h-10 w-10" onClick={sendMessage} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        aria-label="Help chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
