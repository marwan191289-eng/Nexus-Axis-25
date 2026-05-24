import { Link } from "wouter";
import { ShieldAlert, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <ShieldAlert className="h-8 w-8 text-primary group-hover:text-primary/80 transition-colors" />
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                Nexus Axis <span className="text-primary">Legal</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Established in 2009. A professional legal services platform delivering sharp, authoritative, and reassuring representation for high-stakes matters.
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
