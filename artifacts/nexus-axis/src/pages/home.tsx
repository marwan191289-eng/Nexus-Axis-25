import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetStats, useListPracticeAreas, useListBlogPosts } from "@workspace/api-client-react";
import { ArrowRight, Briefcase, ChevronRight, MapPin, Scale, Shield, Award, Clock, Users, Star, ChevronLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useCountUp } from "@/hooks/use-count-up";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useRef } from "react";

import libraryImg from "../assets/library.jpg";
import office1Img from "../assets/office1.jpg";
import office2Img from "../assets/office2.jpg";
import receptionImg from "../assets/reception.jpg";
import meetingRoomImg from "../assets/meeting-room.jpg";
import partnerOfficeImg from "../assets/partner-office.jpg";
import office3Img from "../assets/office3.jpg";

function slugToCamel(slug: string): string {
  return slug.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

const HERO_IMAGE_SRCS = [libraryImg, receptionImg, meetingRoomImg, partnerOfficeImg, office1Img];
const GALLERY_IMAGE_SRCS = [receptionImg, office2Img, meetingRoomImg, office3Img, partnerOfficeImg, office1Img];

interface StatCounterProps {
  target: number;
  suffix?: string;
  label: string;
  loading: boolean;
}

function StatCounter({ target, suffix = "", label, loading }: StatCounterProps) {
  const { display, ref } = useCountUp({ target, suffix, duration: 2200 });
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-col gap-3 group text-center md:text-left">
      {loading ? (
        <Skeleton className="h-14 w-28 bg-primary/10 mx-auto md:mx-0" />
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

interface HeroImage { src: string; label: string; }

function HeroCarousel({ images }: { images: HeroImage[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    setCurrent((c) => {
      if (c !== index) setPrev(c);
      return index;
    });
  }, []);

  const goNext = useCallback(() => {
    setCurrent((c) => {
      setPrev(c);
      return (c + 1) % images.length;
    });
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => {
      setPrev(c);
      return (c - 1 + images.length) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    timerRef.current = setInterval(goNext, 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext]);

  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.label}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1400ms] ease-in-out ${
            i === current ? "opacity-50" : "opacity-0"
          }`}
          style={{ zIndex: i === current ? 2 : i === prev ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/15 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/55 to-transparent z-10" />

      <div className="absolute bottom-8 right-8 flex items-center gap-3 z-20">
        <button
          onClick={goPrev}
          className="h-8 w-8 border border-border/60 bg-background/40 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary/50 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("hero.badge")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5 items-center" role="tablist" aria-label="Image navigation">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Image ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-5 h-1.5 bg-primary"
                  : "w-1.5 h-1.5 bg-border hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          className="h-8 w-8 border border-border/60 bg-background/40 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary/50 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={t("hero.expertise")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: areas, isLoading: areasLoading } = useListPracticeAreas();
  const { data: posts } = useListBlogPosts({ query: { queryKey: ["blog-posts", { limit: 3 }] }});

  const areasList = Array.isArray(areas) ? areas : [];
  const postsList = Array.isArray(posts) ? posts : [];

  const heroImages: HeroImage[] = [
    { src: HERO_IMAGE_SRCS[0], label: t("home.heroImg1") },
    { src: HERO_IMAGE_SRCS[1], label: t("home.heroImg2") },
    { src: HERO_IMAGE_SRCS[2], label: t("home.heroImg3") },
    { src: HERO_IMAGE_SRCS[3], label: t("home.heroImg4") },
    { src: HERO_IMAGE_SRCS[4], label: t("home.heroImg5") },
  ];

  const galleryImages = [
    { src: GALLERY_IMAGE_SRCS[0], label: t("home.galleryImg1") },
    { src: GALLERY_IMAGE_SRCS[1], label: t("home.galleryImg2") },
    { src: GALLERY_IMAGE_SRCS[2], label: t("home.galleryImg3") },
    { src: GALLERY_IMAGE_SRCS[3], label: t("home.galleryImg4") },
    { src: GALLERY_IMAGE_SRCS[4], label: t("home.galleryImg5") },
    { src: GALLERY_IMAGE_SRCS[5], label: t("home.galleryImg6") },
  ];

  return (
    <MainLayout>
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center pt-20 pb-36 overflow-hidden">
        <HeroCarousel images={heroImages} />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-sm border border-primary/30 text-primary rounded-full bg-primary/5 backdrop-blur-sm">
              <Scale className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-medium">{t("hero.badge")}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground leading-[1.05]">
              {t("hero.title1")}<br />
              <span className="text-primary">{t("hero.title2")}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/consultation">
                <Button size="lg" className="w-full sm:w-auto font-serif text-lg h-14 px-10 shadow-lg shadow-primary/20">
                  {t("hero.cta")}
                  <ArrowRight className="ms-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/practice-areas">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 border-border/60 hover:bg-primary/5 hover:border-primary/40 backdrop-blur-sm">
                  {t("hero.expertise")}
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-border/30">
              {[
                { icon: Award, text: t("home.trustBadge1") },
                { icon: Shield, text: t("home.trustBadge2") },
                { icon: Star, text: t("home.trustBadge3") },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-card/60 border-y border-border relative overflow-hidden" aria-label="Firm statistics">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-10 font-medium text-center">
            {t("stats.byTheNumbers")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
            <StatCounter target={17} suffix="+" label={t("stats.years")} loading={statsLoading} />
            <StatCounter target={stats?.clientsServed ?? 1200} suffix="+" label={t("stats.clients")} loading={statsLoading} />
            <StatCounter target={stats?.casesWon ?? 890} suffix="+" label={t("stats.cases")} loading={statsLoading} />
            <StatCounter target={stats?.practiceAreas ?? 18} label={t("stats.areas")} loading={statsLoading} />
          </div>
        </div>
      </section>

      {/* ── Office Photo Gallery Strip ── */}
      <section className="overflow-hidden border-b border-border" aria-label="Office gallery">
        <div className="relative">
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
          </div>
          <div className="flex">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative flex-shrink-0 w-1/3 md:w-1/6 overflow-hidden group" style={{ aspectRatio: "3/4" }}>
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Nexus Axis ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">{t("home.whyBadge")}</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{t("home.whyTitle")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{t("home.whyDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: t("home.why1Title"), desc: t("home.why1Desc") },
              { icon: Shield, title: t("home.why2Title"), desc: t("home.why2Desc") },
              { icon: Clock, title: t("home.why3Title"), desc: t("home.why3Desc") },
              { icon: Users, title: t("home.why4Title"), desc: t("home.why4Desc") },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practice Areas ── */}
      <section className="py-28 bg-card/20 border-y border-border relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">{t("home.practicesBadge")}</p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{t("home.domainsTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t("home.domainsDesc")}
              </p>
            </div>
            <Link href="/practice-areas" className="shrink-0 group flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors text-sm uppercase tracking-wider">
              {t("home.viewAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {areasLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-none bg-card border border-border" />
              ))
            ) : (
              areasList.slice(0, 6).map((area) => (
                <Link
                  key={area.id}
                  href={`/practice-areas/${area.id}`}
                  className="group relative bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300 flex flex-col h-full hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="absolute top-0 start-0 w-0.5 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                  <Briefcase className="h-7 w-7 text-primary mb-6 transition-transform group-hover:scale-110 duration-300" aria-hidden="true" />
                  <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{t(`practiceAreaDB.${slugToCamel(area.slug)}.title`, { defaultValue: area.title })}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
                    {t(`practiceAreaDB.${slugToCamel(area.slug)}.description`, { defaultValue: area.description })}
                  </p>
                  <div className="mt-auto flex items-center text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
                    {t("home.exploreDomain")} <ChevronRight className="ms-1 h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Case Results ── */}
      <section className="py-28 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">{t("home.trackRecordBadge")}</p>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t("home.outcomesTitle")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("home.outcomesDesc")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {([1,2,3,4,5,6] as const).map((n) => ({
              tag: t(`home.case${n}Tag`),
              outcome: t(`home.case${n}Outcome`),
              description: t(`home.case${n}Desc`),
              client: t(`home.case${n}Client`),
              duration: t(`home.case${n}Duration`),
            })).map((item, i) => (
              <article key={i} className="group relative bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300 flex flex-col hover:shadow-lg hover:shadow-primary/5">
                <div className="absolute top-0 start-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">{item.tag}</span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 leading-tight">{item.outcome}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{item.description}</p>
                <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground truncate">{item.client}</span>
                  <span className="text-xs font-bold text-primary shrink-0 bg-primary/8 px-2 py-0.5 border border-primary/20" dir="ltr">{item.duration}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Testimonial */}
          <blockquote className="relative border border-border bg-card p-10 md:p-16 max-w-4xl mx-auto text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <div className="absolute top-4 start-4 w-16 h-16 border-s-2 border-t-2 border-primary/20" aria-hidden="true" />
            <div className="absolute bottom-4 end-4 w-16 h-16 border-e-2 border-b-2 border-primary/20" aria-hidden="true" />
            <div className="relative z-10">
              <div className="text-6xl text-primary font-serif leading-none mb-6 opacity-30" aria-hidden="true">"</div>
              <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed mb-8">
                {t("home.quote")}
              </p>
              <div className="w-10 h-0.5 bg-primary/40 mx-auto mb-4" aria-hidden="true" />
              <cite className="text-sm text-muted-foreground font-semibold tracking-[0.15em] uppercase not-italic">
                {t("home.quoteCite")}
              </cite>
            </div>
          </blockquote>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-32 overflow-hidden border-y border-border" aria-labelledby="cta-heading">
        <div className="absolute inset-0 z-0">
          <img
            src={meetingRoomImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">{t("home.ctaBadge")}</p>
          <h2 id="cta-heading" className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            {t("home.ctaDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/consultation">
              <Button size="lg" className="h-16 px-12 font-serif text-xl shadow-lg shadow-primary/20">
                {t("home.ctaBtn")}
                <ArrowRight className="ms-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-16 px-10 font-serif text-lg border-border/60 hover:border-primary/40">
                {t("common.contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="py-28" aria-labelledby="locations-heading">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">{t("home.locationsBadge")}</p>
            <h2 id="locations-heading" className="text-3xl md:text-5xl font-serif font-bold">{t("home.globalPresence")}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* UAE Office Card */}
            <div className="group bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-primary/5">
              <div className="h-52 overflow-hidden">
                <img src={receptionImg} alt={t("home.uaeOffice")} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-10 relative">
                <div className="absolute top-0 start-0 end-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                  <h3 className="text-2xl font-serif font-bold">{t("home.uaeOffice")}</h3>
                </div>
                <p className="text-primary font-semibold tracking-widest uppercase text-xs mb-6">{t("home.uaeHQLabel")}</p>
                <address className="space-y-1 text-muted-foreground text-sm not-italic">
                  <p>Falcon Tower, Office 1204</p>
                  <p>Rashidiya 2, Ajman</p>
                  <p>United Arab Emirates</p>
                </address>
                <div dir="ltr" className="pt-5 mt-5 border-t border-border/50 font-semibold text-foreground text-sm">
                  <a href="tel:+971585592355" className="hover:text-primary transition-colors">+971 585 592 355</a>
                </div>
              </div>
            </div>

            {/* Egypt Office Card */}
            <div className="group bg-card border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-primary/5">
              <div className="h-52 overflow-hidden">
                <img src={office2Img} alt={t("home.egyptOffice")} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-10 relative">
                <div className="absolute top-0 start-0 end-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                  <h3 className="text-2xl font-serif font-bold">{t("home.egyptOffice")}</h3>
                </div>
                <p className="text-primary font-semibold tracking-widest uppercase text-xs mb-6">{t("home.egyptHQLabel")}</p>
                <address className="space-y-1 text-muted-foreground text-sm not-italic">
                  <p>Makram Ebeid Street</p>
                  <p>Nasr City, Cairo</p>
                  <p>Egypt</p>
                </address>
                <div dir="ltr" className="pt-5 mt-5 border-t border-border/50 font-semibold text-foreground text-sm">
                  <a href="tel:+201001234567" className="hover:text-primary transition-colors">+20 100 123 4567</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
