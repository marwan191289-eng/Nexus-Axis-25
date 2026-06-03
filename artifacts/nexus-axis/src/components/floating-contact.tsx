import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "971585592355";
const WHATSAPP_DISPLAY = "+971 585 592 355";

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function FloatingContact() {
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 380);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = scrolled && !dismissed;

  return (
    <>
      {/* ── Sticky bottom bar ── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="cta-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed bottom-0 inset-x-0 z-50"
            role="complementary"
            aria-label={t("common.bookConsultationBar", { defaultValue: "Book a consultation" })}
          >
            {/* Gold top-border line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

            <div className="bg-background/95 backdrop-blur-xl border-t border-border/60 shadow-[0_-8px_40px_rgba(0,0,0,0.45)]">
              <div className="container mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">

                {/* Left — tagline */}
                <p className="text-sm text-muted-foreground hidden sm:block shrink-0">
                  <span className="text-foreground font-medium">High-stakes matter?</span>{" "}
                  Our counsel is available now.
                </p>

                {/* Center — WhatsApp */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20legal%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/70 transition-all duration-200 text-sm font-semibold group shrink-0 rounded-sm"
                >
                  <span className="h-7 w-7 rounded-full bg-[#25D366]/15 flex items-center justify-center group-hover:bg-[#25D366]/25 transition-colors">
                    <WhatsAppIcon className="h-4 w-4" />
                  </span>
                  <span className="hidden xs:inline">{WHATSAPP_DISPLAY}</span>
                  <span className="inline xs:hidden">WhatsApp</span>
                </a>

                {/* Right — CTA button + dismiss */}
                <div className="flex items-center gap-3 ml-auto">
                  <Link href="/consultation">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-serif font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/25 rounded-sm whitespace-nowrap">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      {t("common.bookConsultation", { defaultValue: "Book a Consultation" })}
                    </button>
                  </Link>
                  <button
                    onClick={() => setDismissed(true)}
                    aria-label="Dismiss"
                    className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors rounded-sm shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating WhatsApp pill (always visible after scroll, top of page) ── */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            key="wa-pill"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className={`fixed z-40 end-5 transition-all duration-300 ${visible ? "bottom-24" : "bottom-6"}`}
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20legal%20services.`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp — ${WHATSAPP_DISPLAY}`}
              className="h-14 w-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 flex items-center justify-center hover:scale-110 hover:shadow-2xl hover:shadow-[#25D366]/50 active:scale-95 transition-all duration-200 focus-visible:ring-4 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
