import { Link, useLocation } from "wouter";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Menu, X, User as UserIcon } from "lucide-react";
import { useState } from "react";
import logoPath from "../../assets/logo.png";

export function Navbar() {
  const [location] = useLocation();
  const { data: user, isLoading } = useGetMe();
  const logout = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/practice-areas", label: "Practice Areas" },
    { href: "/about", label: "About Us" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Insights" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img src={logoPath} alt="Nexus Axis Consultants" className="h-12 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-border pl-6">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link href="/portal" className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Client Portal
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/" })}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                      Client Login
                    </Link>
                  </>
                )}
                <Link href="/consultation">
                  <Button className="font-serif">Book Consultation</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium text-muted-foreground hover:text-primary px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          {user ? (
            <>
              <Link href="/portal" className="text-lg font-medium text-foreground hover:text-primary px-2 py-1 flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <UserIcon className="h-5 w-5" />
                Client Portal
              </Link>
              <Button variant="ghost" className="justify-start px-2 py-1" onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/" })}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login" className="text-lg font-medium text-muted-foreground hover:text-primary px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
              Client Login
            </Link>
          )}
          <Link href="/consultation" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full mt-2 font-serif">Book Consultation</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
