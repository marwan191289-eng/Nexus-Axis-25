import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetStats, useListPracticeAreas, useListBlogPosts } from "@workspace/api-client-react";
import { ArrowRight, Briefcase, ChevronRight, MapPin, Scale } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import libraryImg from "../assets/library.jpg";
import { useCountUp } from "@/hooks/use-count-up";

interface StatCounterProps {
  target: number;
  suffix?: string;
  label: string;
  loading: boolean;
}

function StatCounter({ target, suffix = "", label, loading }: StatCounterProps) {
  const { display, ref } = useCountUp({ target, suffix, duration: 2200 });
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="pl-8 first:pl-0 flex flex-col gap-3 group">
      {loading ? (
        <Skeleton className="h-14 w-28 bg-primary/10" />
      ) : (
        <div className="text-5xl md:text-6xl font-serif font-bold text-primary tabular-nums">
          {display}
        </div>
      )}
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: areas, isLoading: areasLoading } = useListPracticeAreas();
  const { data: posts, isLoading: postsLoading } = useListBlogPosts({ query: { queryKey: ["blog-posts", { limit: 3 }] }}); // using array key for now, we don't have getListBlogPostsQueryKey from Orval correctly imported but let's assume it's listBlogPosts

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={libraryImg} 
            alt="Nexus Axis Consultants" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-sm border border-primary/30 text-primary rounded-full bg-primary/5 backdrop-blur-sm">
              <Scale className="h-4 w-4" />
              <span>Established 2009 &mdash; UAE & Egypt</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
              Controlled authority.<br />
              <span className="text-muted-foreground">Unwavering precision.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              We provide decisive, high-stakes legal representation. When everything is on the line, we are the firm you want in your corner.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/consultation">
                <Button size="lg" className="w-full sm:w-auto font-serif text-lg h-14 px-8">
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/practice-areas">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 border-primary/20 hover:bg-primary/10">
                  Our Expertise
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-card/50 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-10 font-medium text-center">
            By The Numbers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0 md:divide-x divide-border/50">
            <StatCounter
              target={17}
              suffix="+"
              label="Years Established"
              loading={statsLoading}
            />
            <StatCounter
              target={stats?.clientsServed ?? 1200}
              suffix="+"
              label="Clients Served"
              loading={statsLoading}
            />
            <StatCounter
              target={stats?.casesWon ?? 890}
              suffix="+"
              label="Cases Won"
              loading={statsLoading}
            />
            <StatCounter
              target={stats?.practiceAreas ?? 6}
              label="Practice Areas"
              loading={statsLoading}
            />
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Domains of Expertise</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We focus intensely on the areas where we can deliver overwhelming advantage. Our practice is built on deep specialization rather than broad generalization.
              </p>
            </div>
            <Link href="/practice-areas" className="shrink-0 group flex items-center text-primary font-medium hover:text-primary/80 transition-colors">
              View all practice areas
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areasLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-none bg-card border border-border" />
              ))
            ) : (
              areas?.slice(0, 6).map((area) => (
                <Link 
                  key={area.id} 
                  href={`/practice-areas/${area.id}`}
                  className="group relative bg-card border border-border p-8 hover:border-primary/50 transition-colors flex flex-col h-full hover-elevate"
                >
                  <Briefcase className="h-8 w-8 text-primary mb-6" />
                  <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{area.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                    {area.description}
                  </p>
                  <div className="mt-auto flex items-center text-sm font-semibold tracking-wider uppercase text-foreground group-hover:text-primary transition-colors">
                    Explore Domain <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials / Case Results */}
      <section className="py-32 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">Track Record</p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Outcomes That Matter</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                A selection of matters resolved for clients across the region. Identifying details have been anonymised to preserve confidentiality.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                tag: "Commercial Litigation",
                outcome: "AED 18.4M Recovered",
                description:
                  "Represented a Dubai-based trading group in a complex breach-of-contract dispute against a regional distributor. Secured full judgment at DIFC Courts within 14 months.",
                client: "Trading Group — Dubai, UAE",
                duration: "14 months",
              },
              {
                tag: "Corporate Tax",
                outcome: "AED 6.2M Tax Saved",
                description:
                  "Restructured the UAE operations of a European manufacturer before the corporate tax effective date, achieving qualifying Free Zone status and a 0% rate on qualifying income.",
                client: "European Manufacturer — Abu Dhabi, UAE",
                duration: "3 months",
              },
              {
                tag: "Business Setup",
                outcome: "Operational in 19 Days",
                description:
                  "End-to-end mainland licensing, visa processing, and bank account establishment for a fintech startup entering the UAE market from Singapore.",
                client: "Fintech Startup — Ajman, UAE",
                duration: "19 days",
              },
              {
                tag: "International Arbitration",
                outcome: "USD 4.1M Award Enforced",
                description:
                  "Successfully enforced a foreign arbitral award against a UAE-based respondent who had deliberately dissipated assets. Obtained precautionary attachment within 72 hours of filing.",
                client: "European Construction Firm — Cairo, Egypt",
                duration: "8 months",
              },
              {
                tag: "HR Compliance",
                outcome: "Zero Penalty Outcome",
                description:
                  "Advised a retail group on a workforce restructuring of 340 employees across three Emirates, achieving full MOHRE compliance and avoiding AED 2.8M in potential penalties.",
                client: "Retail Group — Sharjah, UAE",
                duration: "6 weeks",
              },
              {
                tag: "Real Estate",
                outcome: "Full Refund + Damages",
                description:
                  "Recovered 100% of a client's off-plan deposit plus statutory compensation after the developer failed to deliver within the contracted period. Resolved before Rental Dispute Center.",
                client: "Private Investor — Cairo, Egypt",
                duration: "5 months",
              },
            ].map((item, i) => (
              <div
                key={i}
                data-testid={`card-case-${i}`}
                className="group relative bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300 flex flex-col"
              >
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">
                  {item.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 leading-tight">
                  {item.outcome}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {item.description}
                </p>
                <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground truncate">{item.client}</span>
                  <span className="text-xs font-semibold text-primary shrink-0">{item.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Client Quote */}
          <div className="relative border border-border bg-card p-10 md:p-14 max-w-4xl mx-auto text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="text-5xl text-primary font-serif leading-none mb-6 opacity-40">"</div>
              <blockquote className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-8">
                They understood the commercial reality of our situation from the very first call. We didn't feel like a file number — we felt like the only client they had.
              </blockquote>
              <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                CEO, Regional Logistics Group — UAE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary/5 border-y border-primary/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl rounded-full" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            Clarity in Complex Situations
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            The first step toward resolution is a structured consultation. We offer 30, 60, and 90-minute sessions to dissect your position and chart a path forward.
          </p>
          <Link href="/consultation">
            <Button size="lg" className="h-16 px-10 font-serif text-xl">
              Book a Consultation
            </Button>
          </Link>
        </div>
      </section>

      {/* Locations */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center">Global Presence</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin className="h-32 w-32" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">UAE Office</h3>
              <p className="text-primary font-medium tracking-wide uppercase text-sm mb-6">Ajman Headquaters</p>
              <div className="space-y-4 text-muted-foreground">
                <p>Falcon Tower, Office 1204</p>
                <p>Rashidiya 2, Ajman</p>
                <p>United Arab Emirates</p>
                <div className="pt-6 mt-6 border-t border-border/50 font-medium text-foreground">
                  +971 585 592 355
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin className="h-32 w-32" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">Egypt Office</h3>
              <p className="text-primary font-medium tracking-wide uppercase text-sm mb-6">Cairo Chambers</p>
              <div className="space-y-4 text-muted-foreground">
                <p>Makram Ebeid Street</p>
                <p>Nasr City, Cairo</p>
                <p>Egypt</p>
                <div className="pt-6 mt-6 border-t border-border/50 font-medium text-foreground">
                  +20 100 123 4567
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
