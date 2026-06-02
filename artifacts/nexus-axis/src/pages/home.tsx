import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetStats, useListPracticeAreas, useListBlogPosts } from "@workspace/api-client-react";
import { ArrowRight, Briefcase, ChevronRight, MapPin, Scale } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import libraryImg from "../assets/library.jpg";
import { useCountUp } from "@/hooks/use-count-up";
import { useTranslation } from "react-i18next";

function slugToCamel(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

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
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: areas, isLoading: areasLoading } = useListPracticeAreas();
  const { data: posts, isLoading: postsLoading } = useListBlogPosts({ query: { queryKey: ["blog-posts", { limit: 3 }] }});

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
              <span>{t("hero.badge")}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
              {t("hero.title1")}<br />
              <span className="text-muted-foreground">{t("hero.title2")}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t("hero.subtitle")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/consultation">
                <Button size="lg" className="w-full sm:w-auto font-serif text-lg h-14 px-8">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/practice-areas">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 border-primary/20 hover:bg-primary/10">
                  {t("hero.expertise")}
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
            {t("stats.byTheNumbers")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-0 md:divide-x divide-border/50">
            <StatCounter target={17} suffix="+" label={t("stats.years")} loading={statsLoading} />
            <StatCounter target={stats?.clientsServed ?? 1200} suffix="+" label={t("stats.clients")} loading={statsLoading} />
            <StatCounter target={stats?.casesWon ?? 890} suffix="+" label={t("stats.cases")} loading={statsLoading} />
            <StatCounter target={stats?.practiceAreas ?? 18} label={t("stats.areas")} loading={statsLoading} />
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{t("home.domainsTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("home.domainsDesc")}
              </p>
            </div>
            <Link href="/practice-areas" className="shrink-0 group flex items-center text-primary font-medium hover:text-primary/80 transition-colors">
              {t("home.viewAll")}
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
                  <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{t(`practiceAreaDB.${slugToCamel(area.slug)}.title`, { defaultValue: area.title })}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                    {t(`practiceAreaDB.${slugToCamel(area.slug)}.description`, { defaultValue: area.description })}
                  </p>
                  <div className="mt-auto flex items-center text-sm font-semibold tracking-wider uppercase text-foreground group-hover:text-primary transition-colors">
                    {t("home.exploreDomain")} <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Case Results */}
      <section className="py-32 bg-card/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">{t("home.trackRecordBadge")}</p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t("home.outcomesTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("home.outcomesDesc")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {([1,2,3,4,5,6] as const).map((n) => ({
              tag: t(`home.case${n}Tag`),
              outcome: t(`home.case${n}Outcome`),
              description: t(`home.case${n}Desc`),
              client: t(`home.case${n}Client`),
              duration: t(`home.case${n}Duration`),
            })).map((item, i) => (
              <div key={i} className="group relative bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300 flex flex-col">
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-4 block">{item.tag}</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 leading-tight">{item.outcome}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{item.description}</p>
                <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground truncate">{item.client}</span>
                  <span className="text-xs font-semibold text-primary shrink-0">{item.duration}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative border border-border bg-card p-10 md:p-14 max-w-4xl mx-auto text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <div className="relative z-10">
              <div className="text-5xl text-primary font-serif leading-none mb-6 opacity-40">"</div>
              <blockquote className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-8">
                {t("home.quote")}
              </blockquote>
              <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                {t("home.quoteCite")}
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
            {t("home.ctaTitle")}
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            {t("home.ctaDesc")}
          </p>
          <Link href="/consultation">
            <Button size="lg" className="h-16 px-10 font-serif text-xl">
              {t("home.ctaBtn")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Locations */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16 text-center">{t("home.globalPresence")}</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin className="h-32 w-32" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">{t("home.uaeOffice")}</h3>
              <p className="text-primary font-medium tracking-wide uppercase text-sm mb-6">{t("home.uaeHQLabel")}</p>
              <div className="space-y-4 text-muted-foreground">
                <p>Falcon Tower, Office 1204</p>
                <p>Rashidiya 2, Ajman</p>
                <p>United Arab Emirates</p>
                <div dir="ltr" className="pt-6 mt-6 border-t border-border/50 font-medium text-foreground">
                  +971 585 592 355
                </div>
              </div>
            </div>

            <div className="bg-card border border-border p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <MapPin className="h-32 w-32" />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">{t("home.egyptOffice")}</h3>
              <p className="text-primary font-medium tracking-wide uppercase text-sm mb-6">{t("home.egyptHQLabel")}</p>
              <div className="space-y-4 text-muted-foreground">
                <p>Makram Ebeid Street</p>
                <p>Nasr City, Cairo</p>
                <p>Egypt</p>
                <div dir="ltr" className="pt-6 mt-6 border-t border-border/50 font-medium text-foreground">
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
