import { Link } from "wouter";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import logoPath from "../../assets/logo.svg";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8 lg:pt-20 lg:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 mb-14">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Nexus Axis Consultants — Home">
              <img src={logoPath} alt="" aria-hidden="true" className="h-14 w-auto" />
              <div className="flex flex-col leading-tight">
                <span className="font-serif font-bold text-base text-foreground tracking-wide group-hover:text-primary transition-colors">
                  Nexus Axis
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                  Consultants
                </span>
              </div>
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
