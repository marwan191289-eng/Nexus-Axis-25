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
              {/* WhatsApp */}
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
