import { Link } from "wouter";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
const logoPath = "/nexus-logo.png";
import { useTranslation } from "react-i18next";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/nexus-axis-consultants",
    Icon: LinkedInIcon,
    color: "hover:text-[#0A66C2] hover:border-[#0A66C2]/40",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nexusaxislegal",
    Icon: InstagramIcon,
    color: "hover:text-[#E1306C] hover:border-[#E1306C]/40",
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com/NexusAxisLegal",
    Icon: XIcon,
    color: "hover:text-foreground hover:border-foreground/40",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/nexusaxisconsultants",
    Icon: FacebookIcon,
    color: "hover:text-[#1877F2] hover:border-[#1877F2]/40",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/971585592355",
    Icon: WhatsAppIcon,
    color: "hover:text-[#25D366] hover:border-[#25D366]/40",
  },
  {
    label: "Telegram",
    href: "https://t.me/nexusaxislegal",
    Icon: TelegramIcon,
    color: "hover:text-[#2AABEE] hover:border-[#2AABEE]/40",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@nexusaxislegal",
    Icon: TikTokIcon,
    color: "hover:text-foreground hover:border-foreground/40",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@nexusaxislegal",
    Icon: YouTubeIcon,
    color: "hover:text-[#FF0000] hover:border-[#FF0000]/40",
  },
];

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8 lg:pt-20 lg:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 mb-14">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-flex items-center group" aria-label="Nexus Axis Consultants — Home">
              <img src={logoPath} alt="" aria-hidden="true" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="pt-2">
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider group"
              >
                {t("common.bookConsultation")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="pt-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold mb-3">Follow Us</p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map(({ label, href, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`h-8 w-8 flex items-center justify-center border border-border text-muted-foreground/60 transition-all duration-200 ${color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Practice Areas */}
          <nav aria-label={t("footer.practiceAreas")}>
            <h3 className="font-serif text-sm font-bold mb-5 text-foreground uppercase tracking-[0.15em]">{t("footer.practiceAreas")}</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { key: "footer.commercialLitigation", href: "/practice-areas" },
                { key: "footer.corporateTax", href: "/practice-areas" },
                { key: "footer.businessSetup", href: "/practice-areas" },
                { key: "footer.arbitration", href: "/practice-areas" },
                { key: "footer.realEstate", href: "/practice-areas" },
                { key: "footer.criminalDefense", href: "/practice-areas" },
                { key: "footer.maritimeLaw", href: "/practice-areas" },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link href={href} className="hover:text-primary transition-colors hover:underline underline-offset-2">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Offices */}
          <div>
            <h3 className="font-serif text-sm font-bold mb-5 text-foreground uppercase tracking-[0.15em]">{t("footer.offices")}</h3>
            <ul className="space-y-5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">UAE</p>
                  <p>Falcon Tower, Office 1204<br />Ajman, UAE</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-1">Egypt</p>
                  <p>Makram Ebeid Street<br />Nasr City, Cairo, EG</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-sm font-bold mb-5 text-foreground uppercase tracking-[0.15em]">{t("footer.contact")}</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href="tel:+971585592355" className="hover:text-primary transition-colors" dir="ltr">+971 585 592 355</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href="tel:+201001234567" className="hover:text-primary transition-colors" dir="ltr">+20 100 123 4567</a>
              </li>
              <li className="flex items-center gap-2.5">
                <WhatsAppIcon className="h-4 w-4 text-[#25D366] shrink-0" />
                <a
                  href="https://wa.me/971585592355"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors"
                  dir="ltr"
                >
                  WhatsApp UAE
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <TelegramIcon className="h-4 w-4 text-[#2AABEE] shrink-0" />
                <a
                  href="https://t.me/nexusaxislegal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2AABEE] transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <a href="mailto:info@nexusaxisconsultants.com" className="hover:text-primary transition-colors break-all">
                  info@nexusaxisconsultants.com
                </a>
              </li>
            </ul>

            <div className="mt-7 pt-5 border-t border-border/50">
              <Link
                href="/contact"
                className="text-xs uppercase tracking-[0.15em] font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                {t("common.contactUs")} →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {year} Nexus Axis Consultants. {t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="hover:text-primary transition-colors">{t("nav.pricing")}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link>
            <Link href="#" className="hover:text-primary transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
