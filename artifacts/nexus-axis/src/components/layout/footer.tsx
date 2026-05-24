import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";
import logoPath from "../../assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <img src={logoPath} alt="Nexus Axis Consultants" className="h-14 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Strategic Legal &amp; Corporate Counsel serving the UAE and Egypt since 2009.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">Practice Areas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/practice-areas" className="hover:text-primary transition-colors">Corporate Law</Link></li>
              <li><Link href="/practice-areas" className="hover:text-primary transition-colors">Dispute Resolution</Link></li>
              <li><Link href="/practice-areas" className="hover:text-primary transition-colors">Real Estate</Link></li>
              <li><Link href="/practice-areas" className="hover:text-primary transition-colors">Financial Law</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">Offices</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Falcon Tower<br />Ajman, UAE</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>Nasr City<br />Cairo, Egypt</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+971 585 592 355</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>info@nexusaxisconsultants.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} Nexus Axis Consultants. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
