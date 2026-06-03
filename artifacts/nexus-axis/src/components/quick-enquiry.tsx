import { useState } from "react";
import { X, MessageSquare, Send, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "971585592355";

const MATTER_TYPES = [
  "Commercial Litigation",
  "Corporate Tax Advisory",
  "Business Setup & Licensing",
  "International Arbitration",
  "Real Estate & Property Law",
  "HR & Labour Compliance",
  "International Advisory",
  "Other / Not sure yet",
];

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function QuickEnquiry() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", matter: "", note: "" });
  const { t } = useTranslation();

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      `*New Enquiry — Nexus Axis Consultants*`,
      ``,
      `Name: ${form.name}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Matter: ${form.matter || "Not specified"}`,
      form.note ? `Note: ${form.note}` : null,
      ``,
      `_Submitted via nexusaxisconsultants.com_`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSubmitted(false), 400);
  };

  return (
    <>
      {/* ── Trigger bubble — bottom-left ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(true)}
            aria-label="Open Quick Enquiry"
            className="fixed bottom-6 start-6 z-40 flex items-center gap-2.5 px-4 h-12 bg-card border border-border/80 text-foreground text-sm font-semibold shadow-xl shadow-black/30 hover:border-primary/50 hover:text-primary transition-all duration-200 rounded-sm group"
          >
            <MessageSquare className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">
              {t("common.quickEnquiry", { defaultValue: "Quick Enquiry" })}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Slide-out panel — right side ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 end-0 h-full w-full sm:w-[380px] z-50 flex flex-col bg-background border-s border-border/60 shadow-2xl shadow-black/60 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t("common.quickEnquiry", { defaultValue: "Quick Enquiry" })}
          >
            {/* Gold top accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-primary/80 via-primary to-primary/20 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/60 shrink-0">
              <div>
                <div className="flex items-center gap-2.5 mb-0.5">
                  <div className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
                  <p className="text-xs tracking-[0.2em] uppercase text-primary font-semibold">
                    {t("common.availableNow", { defaultValue: "Available Now" })}
                  </p>
                </div>
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {t("common.quickEnquiry", { defaultValue: "Quick Enquiry" })}
                </h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors rounded-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center h-full min-h-[300px] gap-5"
                  >
                    <div className="h-16 w-16 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center">
                      <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold mb-2">WhatsApp Opened</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Your enquiry has been pre-filled in WhatsApp. Simply tap{" "}
                        <strong className="text-foreground">Send</strong> and we will respond
                        within one business day.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 border border-border text-sm font-semibold text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors rounded-sm"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Tell us briefly about your matter and we will connect via WhatsApp immediately.
                    </p>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="qe-name" className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        id="qe-name"
                        type="text"
                        required
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="h-10 px-3 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors rounded-sm"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="qe-phone" className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                        WhatsApp / Phone
                      </label>
                      <input
                        id="qe-phone"
                        type="tel"
                        placeholder="+971 5__ ___ ___"
                        value={form.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="h-10 px-3 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors rounded-sm"
                      />
                    </div>

                    {/* Matter type */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="qe-matter" className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                        Area of Law <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="qe-matter"
                          required
                          value={form.matter}
                          onChange={(e) => handleChange("matter", e.target.value)}
                          className="w-full h-10 px-3 pr-8 bg-card border border-border text-foreground text-sm appearance-none focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors rounded-sm cursor-pointer"
                        >
                          <option value="" disabled>Select a practice area…</option>
                          {MATTER_TYPES.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute end-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {/* Optional note */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="qe-note" className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">
                        Brief Note <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(optional)</span>
                      </label>
                      <textarea
                        id="qe-note"
                        rows={3}
                        placeholder="Any context that helps us assist you faster…"
                        value={form.note}
                        onChange={(e) => handleChange("note", e.target.value)}
                        className="px-3 py-2 bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors resize-none rounded-sm leading-relaxed"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2.5 h-12 w-full bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1db954] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#25D366]/25 rounded-sm mt-1"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      Send via WhatsApp
                    </button>

                    <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
                      This opens WhatsApp with your details pre-filled.
                      Your information is not stored on our servers.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/60 shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <div className="h-1 w-1 rounded-full bg-primary/60" />
                <span>Nexus Axis Consultants · Est. 2009 · UAE &amp; Egypt</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
