import { MainLayout } from "@/components/layout/main-layout";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const { t } = useTranslation();

  const consultationTiers = [
    {
      name: t("pricing.tier1Name"),
      duration: t("pricing.tier1Duration"),
      price: "AED 500",
      description: t("pricing.tier1Desc"),
      features: [
        t("pricing.tier1f1"),
        t("pricing.tier1f2"),
        t("pricing.tier1f3"),
        t("pricing.tier1f4"),
      ],
    },
    {
      name: t("pricing.tier2Name"),
      duration: t("pricing.tier2Duration"),
      price: "AED 800",
      featured: true,
      description: t("pricing.tier2Desc"),
      features: [
        t("pricing.tier2f1"),
        t("pricing.tier2f2"),
        t("pricing.tier2f3"),
        t("pricing.tier2f4"),
      ],
    },
    {
      name: t("pricing.tier3Name"),
      duration: t("pricing.tier3Duration"),
      price: "AED 1,100",
      description: t("pricing.tier3Desc"),
      features: [
        t("pricing.tier3f1"),
        t("pricing.tier3f2"),
        t("pricing.tier3f3"),
        t("pricing.tier3f4"),
      ],
    },
  ];

  const representationPackages = [
    {
      name: t("pricing.rep1Name"),
      price: t("pricing.rep1Price"),
      description: t("pricing.rep1Desc"),
      features: [
        t("pricing.rep1f1"),
        t("pricing.rep1f2"),
        t("pricing.rep1f3"),
        t("pricing.rep1f4"),
        t("pricing.rep1f5"),
      ],
    },
    {
      name: t("pricing.rep2Name"),
      price: t("pricing.rep2Price"),
      featured: true,
      description: t("pricing.rep2Desc"),
      features: [
        t("pricing.rep2f1"),
        t("pricing.rep2f2"),
        t("pricing.rep2f3"),
        t("pricing.rep2f4"),
        t("pricing.rep2f5"),
        t("pricing.rep2f6"),
      ],
    },
    {
      name: t("pricing.rep3Name"),
      price: t("pricing.rep3Price"),
      description: t("pricing.rep3Desc"),
      features: [
        t("pricing.rep3f1"),
        t("pricing.rep3f2"),
        t("pricing.rep3f3"),
        t("pricing.rep3f4"),
        t("pricing.rep3f5"),
      ],
    },
  ];

  const corporatePackages = [
    {
      name: t("pricing.corp1Name"),
      price: t("pricing.corp1Price"),
      period: t("pricing.perMonth"),
      description: t("pricing.corp1Desc"),
      features: [
        t("pricing.corp1f1"),
        t("pricing.corp1f2"),
        t("pricing.corp1f3"),
        t("pricing.corp1f4"),
      ],
    },
    {
      name: t("pricing.corp2Name"),
      price: t("pricing.corp2Price"),
      period: t("pricing.perMonth"),
      featured: true,
      description: t("pricing.corp2Desc"),
      features: [
        t("pricing.corp2f1"),
        t("pricing.corp2f2"),
        t("pricing.corp2f3"),
        t("pricing.corp2f4"),
        t("pricing.corp2f5"),
        t("pricing.corp2f6"),
      ],
    },
    {
      name: t("pricing.corp3Name"),
      price: t("pricing.corp3Price"),
      period: t("pricing.perMonth"),
      description: t("pricing.corp3Desc"),
      features: [
        t("pricing.corp3f1"),
        t("pricing.corp3f2"),
        t("pricing.corp3f3"),
        t("pricing.corp3f4"),
        t("pricing.corp3f5"),
        t("pricing.corp3f6"),
        t("pricing.corp3f7"),
      ],
    },
  ];

  const documentServices = [
    { name: t("pricing.doc1Name"), price: t("pricing.doc1Price") },
    { name: t("pricing.doc2Name"), price: t("pricing.doc2Price") },
    { name: t("pricing.doc3Name"), price: t("pricing.doc3Price") },
    { name: t("pricing.doc4Name"), price: t("pricing.doc4Price") },
    { name: t("pricing.doc5Name"), price: t("pricing.doc5Price") },
    { name: t("pricing.doc6Name"), price: t("pricing.doc6Price") },
    { name: t("pricing.doc7Name"), price: t("pricing.doc7Price") },
    { name: t("pricing.doc8Name"), price: t("pricing.doc8Price") },
  ];

  return (
    <MainLayout>
      {/* Hero */}
      <div className="bg-card border-b border-border py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
              {t("pricing.badge")}
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {t("pricing.title")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("pricing.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-20 space-y-28">

        {/* Section 1: Consultation Tiers */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("pricing.consultationTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">{t("pricing.consultationDesc")}</p>
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
                    {t("pricing.recommended")}
                  </div>
                )}
                <div className="mb-8">
                  <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">{tier.duration}</div>
                  <h3 className="text-2xl font-serif font-bold mb-4">{tier.name}</h3>
                  <div className="text-4xl font-serif font-bold text-primary mb-4">{tier.price}</div>
                  <p className="text-muted-foreground text-sm">{tier.description}</p>
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
                    {t("pricing.book")} — {tier.duration}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Full Representation */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("pricing.representationTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">{t("pricing.representationDesc")}</p>
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
                    {t("pricing.mostPopular")}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-bold mb-4">{pkg.name}</h3>
                  <div className="text-3xl font-serif font-bold text-primary mb-4">{pkg.price}</div>
                  <p className="text-muted-foreground text-sm">{pkg.description}</p>
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
                    {t("pricing.getStarted")}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Corporate Services */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("pricing.corporateTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">{t("pricing.corporateDesc")}</p>
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
                    {t("pricing.mostPopular")}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-bold mb-4">{pkg.name}</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-serif font-bold text-primary">{pkg.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">{pkg.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{pkg.description}</p>
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
                    {t("pricing.getStarted")}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Document & Filing Services */}
        <section>
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t("pricing.docTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">{t("pricing.docDesc")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {documentServices.map((svc, i) => (
              <div key={i} className="bg-card border border-border p-6 flex flex-col gap-3">
                <p className="font-serif font-semibold text-foreground leading-snug">{svc.name}</p>
                <p className="text-primary font-bold text-xl mt-auto">{svc.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bespoke Note */}
        <section>
          <div className="border border-border bg-card p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">{t("pricing.noteTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{t("pricing.noteDesc")}</p>
              <Link href="/consultation">
                <Button className="gap-2">
                  {t("pricing.contactForQuote")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
