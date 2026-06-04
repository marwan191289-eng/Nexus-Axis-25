import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Menu, X, User as UserIcon, Sun, Moon, ChevronDown, Globe, Shield } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/use-theme";
import { LANGUAGES, applyLanguageToDOM } from "@/i18n/index";
const logoPath = "/nexus-logo.png";

export function Navbar() {
  const [location] = useLocation();
  const { data: user, isLoading } = useGetMe();
  const logout = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    fetch("/api/admin/verify", { credentials: "include" })
      .then(r => setIsAdmin(r.ok))
      .catch(() => setIsAdmin(false));
  }, [user]);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const changeLang = (code: string) => {
    i18n.changeLanguage(code);
    applyLanguageToDOM(code);
    setIsLangOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/practice-areas", label: t("nav.practiceAreas") },
    { href: "/about", label: t("nav.about") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/blog", label: t("nav.insights") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border/60 bg-background/98 backdrop-blur-md shadow-sm shadow-black/20"
          : "border-border/30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/50"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <img src={logoPath} alt="Nexus Axis Consultants" className="h-14 w-auto object-contain" />
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-base font-bold tracking-[0.18em] text-foreground uppercase group-hover:text-primary transition-colors duration-200" style={{ fontFamily: "var(--app-font-serif, Georgia, serif)" }}>
              Nexus Axis
            </span>
            <span className="text-[9px] tracking-[0.32em] text-primary/80 uppercase font-medium mt-0.5">
              Consultants
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 hover:text-primary group ${
                  location.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    location.startsWith(link.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-5">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="h-9 w-9 flex items-center justify-center rounded-none border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Language selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="h-9 px-3 flex items-center gap-1.5 border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-200 text-sm"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="font-medium">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-popover border border-border shadow-xl shadow-black/30 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLang(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left ${
                        lang.code === i18n.language ? "text-primary font-semibold bg-primary/5" : "text-foreground"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="flex-1">{lang.nativeLabel}</span>
                      {lang.code === i18n.language && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <Link href="/admin" className="text-sm font-medium flex items-center gap-1.5 text-primary hover:text-primary/80">
                        <Shield className="h-3.5 w-3.5" />
                        Admin
                      </Link>
                    )}
                    <Link href="/portal" className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      {t("nav.clientPortal")}
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/" })}>
                      {t("nav.signOut")}
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">
                    {t("nav.clientLogin")}
                  </Link>
                )}
                <Link href="/consultation">
                  <Button className="font-serif shadow-sm shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300">{t("nav.bookConsultation")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="h-9 w-9 flex items-center justify-center border border-border text-muted-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-md p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-medium px-2 py-1 transition-colors ${
                location.startsWith(link.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Language grid for mobile */}
          <div className="h-px bg-border my-1" />
          <div className="grid grid-cols-4 gap-2 px-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { changeLang(lang.code); setIsMobileMenuOpen(false); }}
                className={`flex flex-col items-center gap-1 py-2 px-1 border transition-colors text-xs font-semibold ${
                  lang.code === i18n.language
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <div className="h-px bg-border my-1" />
          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-lg font-medium text-primary hover:text-primary/80 px-2 py-1 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Shield className="h-5 w-5" />
                  Admin Dashboard
                </Link>
              )}
              <Link href="/portal" className="text-lg font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <UserIcon className="h-5 w-5" />
                {t("nav.clientPortal")}
              </Link>
              <Button variant="ghost" className="justify-start px-2 py-1" onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/" })}>
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <Link href="/login" className="text-lg font-medium text-muted-foreground hover:text-primary px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
              {t("nav.clientLogin")}
            </Link>
          )}
          <Link href="/consultation" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full mt-2 font-serif">{t("nav.bookConsultation")}</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
