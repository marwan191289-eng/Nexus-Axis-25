import heroOfficeImg from "@assets/hero-office_1780448390987.jpg";
import { MainLayout } from "@/components/layout/main-layout";
import { PageSEO } from "@/components/page-seo";
import { Check, ArrowRight, Clock, Users, FileText, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const consultationTiers = [
  {
    name: "Initial Assessment",
    duration: "30 Minutes",
    price: "AED 750",
    level: "Associate",
    description: "A focused session to outline your legal position, assess exposure, and identify the most urgent actions required.",
    features: [
      "Review of basic facts & supporting documents",
      "Initial risk and liability assessment",
      "Jurisdiction and forum clarification",
      "Estimated cost outline for full representation",
    ],
  },
  {
    name: "Detailed Advisory",
    duration: "60 Minutes",
    price: "AED 1,200",
    level: "Senior Associate",
    featured: true,
    description: "In-depth document review and strategic planning with a senior associate. The most common entry point for new matters.",
    features: [
      "Pre-meeting document review (up to 30 pages)",
      "Detailed legal analysis and written opinion",
      "Immediate required actions identified",
      "Written strategy summary provided post-session",
    ],
  },
  {
    name: "Partner Strategy Session",
    duration: "90 Minutes",
    price: "AED 1,800",
    level: "Partner",
    description: "Exhaustive structuring session for complex corporate, cross-border, or high-value litigation matters with a partner.",
    features: [
      "Unlimited document review pre-session",
      "Multi-jurisdictional analysis (UAE & Egypt)",
      "Partner-level strategic counsel",
      "Comprehensive written roadmap delivered within 48 hrs",
    ],
  },
];

const hourlyRates = [
  { title: "Junior Associate", rate: "AED 550", note: "Years 1–3 post-admission" },
  { title: "Senior Associate", rate: "AED 850", note: "Years 4–7 post-admission" },
  { title: "Of Counsel", rate: "AED 1,100", note: "Specialist advisory matters" },
  { title: "Partner", rate: "AED 1,500", note: "Complex matters & strategy" },
];

const representationPackages = [
  {
    name: "Civil & Commercial Claim",
    price: "From AED 10,000",
    description: "Fixed-fee representation for straightforward civil and commercial claims in UAE first-instance courts.",
    features: [
      "Single court level (first instance)",
      "Claim preparation and court filing",
      "All scheduled hearing attendances",
      "Judgment enforcement filing",
      "Claim values up to AED 500,000",
    ],
  },
  {
    name: "Commercial Litigation",
    price: "From AED 25,000",
    featured: true,
    description: "Full multi-level representation in complex commercial disputes, including cross-claims and multi-party matters.",
    features: [
      "All court levels — first instance to cassation",
      "Expert witness coordination & briefing",
      "Interim injunction and precautionary attachment",
      "Asset tracing, attachment and enforcement",
      "Partner-level supervision throughout",
      "Bilingual Arabic / English pleadings",
    ],
  },
  {
    name: "International Arbitration",
    price: "From AED 40,000",
    description: "Full representation in DIAC, ICC, LCIA, ADGM or ad hoc arbitration proceedings under any seat.",
    features: [
      "Statement of Claim / Defence drafting",
      "Document production & disclosure management",
      "Witness statement and expert report preparation",
      "Full hearing attendance and oral advocacy",
      "Award challenge or enforcement proceedings",
    ],
  },
];

const corporatePackages = [
  {
    name: "Starter",
    price: "AED 3,500",
    description: "Essential ongoing legal support for SMEs, startups, and businesses with moderate legal requirements.",
    features: [
      "Up to 6 hours legal advice per month",
      "Employment & HR contract reviews",
      "Standard commercial contract review",
      "Quarterly regulatory compliance check",
    ],
  },
  {
    name: "Business",
    price: "AED 8,500",
    featured: true,
    description: "Comprehensive legal coverage for growing businesses with regular transactional, compliance, and employment needs.",
    features: [
      "Up to 18 hours legal advice per month",
      "Unlimited commercial contract reviews",
      "HR, employment & workforce restructuring advisory",
      "Regulatory compliance monitoring",
      "Priority response — 24-hour guaranteed",
      "Monthly legal health & risk briefing",
    ],
  },
  {
    name: "Enterprise",
    price: "AED 18,000",
    description: "A fully outsourced legal department solution for large businesses, groups, and multinationals in the UAE.",
    features: [
      "Up to 45 hours legal advice per month",
      "Dedicated senior associate point-of-contact",
      "Board, shareholder & governance advisory",
      "M&A, JV and transaction support",
      "Cross-border and multi-jurisdictional matters",
      "Litigation and dispute management",
      "4-hour emergency response guarantee",
    ],
  },
];

const documentServices = [
  { name: "Commercial Agreement Drafting", price: "AED 2,000" },
  { name: "SPA / MOU Review & Negotiation", price: "AED 3,500" },
  { name: "Power of Attorney (Notarised)", price: "AED 900" },
  { name: "DIFC Will Registration", price: "AED 4,500" },
  { name: "Court Filing Preparation", price: "AED 750" },
  { name: "Legal Opinion Letter", price: "AED 2,500" },
  { name: "Notarisation & Embassy Attestation", price: "AED 750" },
  { name: "UAE Trademark Application", price: "AED 3,200" },
  { name: "Employment Contract Package (5 staff)", price: "AED 3,500" },
  { name: "Company Formation (Professional Fee)", price: "AED 4,500" },
  { name: "NDA / Confidentiality Agreement", price: "AED 1,200" },
  { name: "Due Diligence Legal Report", price: "AED 8,500" },
];

const engagementModels = [
  {
    icon: Clock,
    title: "Hourly Billing",
    desc: "Time-based billing for advisory, research, and matters with unpredictable scope. Monthly itemised invoices with time records.",
  },
  {
    icon: FileText,
    title: "Fixed Fee",
    desc: "Agreed upfront price for defined-scope matters — document drafting, court filings, and straightforward representations.",
  },
  {
    icon: Scale,
    title: "Capped Fee",
    desc: "Hourly billing with an agreed maximum ceiling. Gives cost certainty while allowing for case complexity.",
  },
  {
    icon: Users,
    title: "Monthly Retainer",
    desc: "Structured monthly arrangements for ongoing legal support, giving businesses priority access and budget predictability.",
  },
];

export default function Pricing() {
  return (
    <MainLayout>
      <PageSEO
        title="Legal Fees & Pricing"
        path="/pricing"
        description="Transparent legal fee structures at Nexus Axis Consultants. Consultation sessions from AED 750. Hourly rates from AED 550. Monthly retainers from AED 3,500. Fixed-fee document services. No hidden costs."
      />

      {/* Hero */}
      <div className="relative py-32 overflow-hidden border-b border-border">
        <img src={heroOfficeImg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-primary/60" />
              <p className="text-xs tracking-[0.35em] uppercase text-primary font-semibold">Transparent Fee Structures</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-5">Legal Fees & Pricing</h1>
            <div className="w-14 h-px bg-gradient-to-r from-primary to-primary/20 mb-5" />
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              We believe absolute clarity on costs is a professional obligation. Every fee structure below is confirmed in writing before engagement — no hidden charges, ever.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 space-y-28">

        {/* Section 0: Engagement Models */}
        <section>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">How We Structure Fees</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">We offer four billing models depending on the nature of the matter. Your engagement letter will specify which applies.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementModels.map((m, i) => (
              <div key={i} className="bg-card border border-border p-6 flex flex-col gap-4">
                <div className="h-10 w-10 bg-primary/10 flex items-center justify-center border border-primary/20">
                  <m.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg">{m.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 1: Consultation Tiers */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Consultation Sessions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Fixed-fee initial sessions with qualified counsel. Choose the duration and seniority level your matter requires.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {consultationTiers.map((tier, i) => (
              <div
                key={i}
                className={`relative bg-card border flex flex-col p-8 ${
                  tier.featured ? "border-primary shadow-2xl shadow-primary/10" : "border-border"
                }`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{tier.duration}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/70">{tier.level}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4">{tier.name}</h3>
                  <div className="text-4xl font-serif font-bold text-primary mb-4">{tier.price}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tier.description}</p>
                </div>
                <div className="flex-1 space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/consultation">
                  <Button className="w-full" variant={tier.featured ? "default" : "outline"}>
                    Book — {tier.duration}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 1b: Hourly Rates */}
        <section>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Hourly Rate Schedule</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">For advisory, research, and matters billed on time. Rates are exclusive of VAT where applicable.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hourlyRates.map((r, i) => (
              <div key={i} className="bg-card border border-border p-7 flex flex-col gap-3">
                <p className="font-serif font-bold text-xl text-foreground">{r.title}</p>
                <p className="text-3xl font-serif font-bold text-primary">{r.rate}<span className="text-base text-muted-foreground font-sans font-normal"> / hr</span></p>
                <p className="text-xs text-muted-foreground mt-auto">{r.note}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">All time is recorded in 6-minute increments. Monthly detailed time statements are provided for all hourly matters.</p>
        </section>

        {/* Section 2: Full Representation */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Litigation & Representation</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Indicative fixed-fee ranges for active legal matters across UAE courts and arbitration tribunals. Final fees confirmed after initial consultation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {representationPackages.map((pkg, i) => (
              <div
                key={i}
                className={`relative bg-card border flex flex-col p-8 ${
                  pkg.featured ? "border-primary shadow-2xl shadow-primary/10" : "border-border"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                    Most Common
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-bold mb-4">{pkg.name}</h3>
                  <div className="text-3xl font-serif font-bold text-primary mb-4">{pkg.price}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
                </div>
                <div className="flex-1 space-y-3 mb-8">
                  {pkg.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/consultation">
                  <Button className="w-full" variant={pkg.featured ? "default" : "outline"}>
                    Discuss Your Matter
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Corporate Retainers */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Corporate Legal Retainers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Monthly arrangements providing priority access, budget certainty, and a dedicated legal team for businesses with ongoing counsel needs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {corporatePackages.map((pkg, i) => (
              <div
                key={i}
                className={`relative bg-card border flex flex-col p-8 ${
                  pkg.featured ? "border-primary shadow-2xl shadow-primary/10" : "border-border"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-bold mb-4">{pkg.name}</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-serif font-bold text-primary">{pkg.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">/ month</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
                </div>
                <div className="flex-1 space-y-3 mb-8">
                  {pkg.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <Button className="w-full" variant={pkg.featured ? "default" : "outline"}>
                    Enquire About Retainer
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Document & Filing Services */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Document & Filing Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">Fixed fees for discrete legal document preparation, review, and court or authority filing services. Government disbursements are billed separately at cost.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentServices.map((svc, i) => (
              <div key={i} className="bg-card border border-border p-6 flex items-center justify-between gap-4">
                <p className="font-serif font-semibold text-foreground leading-snug">{svc.name}</p>
                <p className="text-primary font-bold text-xl shrink-0">{svc.price}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">All fees are exclusive of UAE VAT (5%) where applicable, government filing fees, and third-party disbursements.</p>
        </section>

        {/* Bespoke Note */}
        <section>
          <div className="border border-border bg-card p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Bespoke & High-Value Matters</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Cross-border M&A, major infrastructure disputes, complex multi-party international arbitrations, and sovereign advisory are quoted individually following an initial consultation. We never apply a one-size-fits-all approach to matters of this complexity.
              </p>
              <Link href="/consultation">
                <Button className="gap-2">
                  Request a Bespoke Quote <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
