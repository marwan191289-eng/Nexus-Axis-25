import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetStats, useListPracticeAreas, useListBlogPosts } from "@workspace/api-client-react";
import { ArrowRight, Briefcase, ChevronRight, MapPin, Scale } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import libraryImg from "../assets/library.jpg";

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
      <section className="py-24 bg-card/50 border-y border-border relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-border/50">
            {[
              { label: "Years Established", value: stats?.yearsEstablished || 15, loading: statsLoading },
              { label: "Clients Served", value: stats?.clientsServed || "2.5k+", loading: statsLoading },
              { label: "Cases Won", value: stats?.casesWon || "98%", loading: statsLoading },
              { label: "Practice Areas", value: stats?.practiceAreas || 8, loading: statsLoading },
            ].map((stat, i) => (
              <div key={i} className="pl-8 first:pl-0 flex flex-col gap-2">
                {stat.loading ? (
                  <Skeleton className="h-12 w-24 bg-primary/10" />
                ) : (
                  <div className="text-4xl md:text-5xl font-serif font-bold text-primary">
                    {stat.value}
                  </div>
                )}
                <div className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
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
