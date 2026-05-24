import { MainLayout } from "@/components/layout/main-layout";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Pricing() {
  const tiers = [
    {
      name: "Initial Assessment",
      duration: "30 Minutes",
      price: "AED 500",
      description: "A focused discussion to outline your legal position and determine viability.",
      features: [
        "Review of basic facts",
        "Initial risk assessment",
        "Jurisdiction clarification",
        "Cost estimation for full representation"
      ]
    },
    {
      name: "Standard Consultation",
      duration: "60 Minutes",
      price: "AED 800",
      featured: true,
      description: "Comprehensive review of documentation and strategic planning.",
      features: [
        "Pre-meeting document review (up to 20 pages)",
        "Detailed legal analysis",
        "Identification of immediate actions required",
        "Written summary of advised strategy"
      ]
    },
    {
      name: "Deep Dive Strategy",
      duration: "90 Minutes",
      price: "AED 1100",
      description: "Exhaustive structuring session for complex corporate or litigation matters.",
      features: [
        "Extensive document review",
        "Multi-jurisdictional analysis (UAE/Egypt)",
        "Partner-level strategic counsel",
        "Comprehensive roadmap document"
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Consultation Tiers</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Transparent, fixed-fee structures for initial strategic counsel. We believe in absolute clarity regarding costs from the first interaction.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`relative bg-card border flex flex-col p-8 ${
                tier.featured ? "border-primary shadow-2xl shadow-primary/10" : "border-border"
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Recommended
                </div>
              )}
              
              <div className="mb-8">
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">{tier.duration}</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{tier.name}</h3>
                <div className="text-4xl font-serif font-bold text-primary mb-4">{tier.price}</div>
                <p className="text-muted-foreground text-sm">{tier.description}</p>
              </div>
              
              <div className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/consultation">
                <Button className="w-full" variant={tier.featured ? "default" : "outline"}>
                  Book {tier.duration}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
