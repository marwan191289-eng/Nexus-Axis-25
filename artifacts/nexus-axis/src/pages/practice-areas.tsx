import { MainLayout } from "@/components/layout/main-layout";
import { useListPracticeAreas } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Scale, Calculator, Building2, Users, Globe, Home,
  Shield, Landmark, Anchor, Heart, Lightbulb, Umbrella,
  Gavel, Lock, HardHat, Plane, TrendingUp, Briefcase,
  ChevronRight, Building,
} from "lucide-react";
import { Link } from "wouter";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Calculator,
  Building2,
  Users,
  Globe,
  Home,
  shield: Shield,
  Shield,
  landmark: Landmark,
  Landmark,
  anchor: Anchor,
  Anchor,
  building: Building,
  Building,
  heart: Heart,
  Heart,
  lightbulb: Lightbulb,
  Lightbulb,
  umbrella: Umbrella,
  Umbrella,
  gavel: Gavel,
  Gavel,
  lock: Lock,
  Lock,
  "hard-hat": HardHat,
  HardHat,
  plane: Plane,
  Plane,
  "trending-up": TrendingUp,
  TrendingUp,
};

function getIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) return Briefcase;
  return ICON_MAP[iconName] ?? ICON_MAP[iconName.charAt(0).toUpperCase() + iconName.slice(1)] ?? Briefcase;
}

const CATEGORY_MAP: Record<number, string> = {
  1: "litigation",
  2: "corporate",
  3: "corporate",
  4: "corporate",
  5: "litigation",
  6: "litigation",
  7: "litigation",
  8: "corporate",
  9: "specialist",
  10: "corporate",
  11: "specialist",
  12: "specialist",
  13: "specialist",
  14: "litigation",
  15: "specialist",
  16: "litigation",
  17: "specialist",
  18: "corporate",
};

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function PracticeAreas() {
  const { data: areas, isLoading } = useListPracticeAreas();
  const [activeCategory, setActiveCategory] = useState("all");
  const { t } = useTranslation();

  const CATEGORIES = [
    { label: t("practiceAreas.all"), value: "all" },
    { label: t("practiceAreas.litigation"), value: "litigation" },
    { label: t("practiceAreas.corporate"), value: "corporate" },
    { label: t("practiceAreas.specialist"), value: "specialist" },
  ];

  const filtered = areas?.filter((area) =>
    activeCategory === "all" ? true : CATEGORY_MAP[area.id] === activeCategory
  );

  return (
    <MainLayout>
      {/* Hero */}
      <div className="bg-card border-b border-border py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
              {t("practiceAreas.badge")}
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {t("practiceAreas.title")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("practiceAreas.subtitle")}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-px w-8 bg-primary/60" />
              <span>{areas?.length ?? 18} {t("practiceAreas.specialized")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-14">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] border transition-all duration-200 ${
                activeCategory === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat.label}
              {cat.value === "all" && areas && (
                <span className="ml-2 opacity-60">({areas.length})</span>
              )}
              {cat.value !== "all" && areas && (
                <span className="ml-2 opacity-60">
                  ({areas.filter((a) => CATEGORY_MAP[a.id] === cat.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-60 bg-card border border-border" />
              ))
            : filtered?.map((area) => {
                const Icon = getIcon(area.icon);
                return (
                  <Link
                    key={area.id}
                    href={`/practice-areas/${area.id}`}
                    className="group relative bg-card border border-border p-8 hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500" />
                    <div className="flex items-start justify-between mb-6">
                      <div className="h-11 w-11 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h2 className="text-lg font-serif font-bold mb-3 group-hover:text-primary transition-colors leading-snug">
                      {area.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {area.description}
                    </p>
                  </Link>
                );
              })}
        </div>

        {/* CTA */}
        <div className="mt-20 border border-border bg-card p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Don't see your area of concern?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Our scope is broad. If your matter involves UAE or Egyptian law — or cross-border MENA issues — we very likely have the expertise. Contact us for a confidential assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consultation">
                <button className="h-12 px-8 bg-primary text-primary-foreground font-serif font-semibold hover:bg-primary/90 transition-colors">
                  Book a Consultation
                </button>
              </Link>
              <Link href="/contact">
                <button className="h-12 px-8 border border-border text-foreground font-semibold hover:border-primary/50 hover:text-primary transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
