import { MainLayout } from "@/components/layout/main-layout";
import { MapPin, Building2, Gavel } from "lucide-react";

export default function About() {
  return (
    <MainLayout>
      <div className="bg-card border-b border-border py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent blur-3xl rounded-full" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Uncompromising Representation</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Since 2009, Nexus Axis Consultants has established itself as a premier boutique firm operating across the Middle East and North Africa.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 mb-32">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-6">Our Philosophy</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                We do not believe in standard solutions. Every legal challenge presents a unique matrix of risks, opportunities, and constraints. Our role is to map that matrix and execute a strategy that secures our clients' objectives with absolute precision.
              </p>
              <p>
                Our chambers operate with strict confidentiality and controlled authority. We take on matters where the stakes demand nothing less than complete dedication and elite legal maneuvering.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-8">
              <Building2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2">Boutique Agility</h3>
              <p className="text-muted-foreground text-sm">Large firm capability with the speed and personal attention of a specialized practice.</p>
            </div>
            <div className="bg-card border border-border p-8">
              <Gavel className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-serif text-xl font-bold mb-2">Decisive Action</h3>
              <p className="text-muted-foreground text-sm">We don't over-analyze when action is required. We strike first when advantageous.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-24">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center">Our Strongholds</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-10 group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">UAE Headquarters</h3>
                  <p className="text-muted-foreground">Established 2009</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Strategically positioned in Ajman, our UAE office handles complex corporate structuring, real estate disputes, and high-value arbitration across the Emirates.
              </p>
              <div className="text-sm font-medium border-l-2 border-primary pl-4">
                Falcon Tower, Office 1204<br />
                Rashidiya 2, Ajman
              </div>
            </div>

            <div className="bg-card border border-border p-10 group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">Egypt Chambers</h3>
                  <p className="text-muted-foreground">Established 2015</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Located in the heart of Nasr City, our Cairo team commands deep influence in domestic litigation, regulatory affairs, and commercial law.
              </p>
              <div className="text-sm font-medium border-l-2 border-primary pl-4">
                Makram Ebeid Street<br />
                Nasr City, Cairo
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
