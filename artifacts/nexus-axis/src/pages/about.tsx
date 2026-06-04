import { MainLayout } from "@/components/layout/main-layout";
import { PageSEO } from "@/components/page-seo";
import { MapPin, Building2, Gavel, Scale, Globe } from "lucide-react";
import libraryImg from "@assets/library_1779665186892.jpg";
import marwanImg from "@assets/marwan-negm_1779665186899.jpg";
import leader2Img from "@assets/leader2_1779665186901.jpg";
import leader3Img from "@assets/leader3_1779665186902.jpg";
import leader4Img from "@assets/leader4_1779665186902.jpg";
import office2Img from "@assets/office2_1779665186899.jpg";
import office3Img from "@assets/office3_1779665186900.jpg";
import partnerOfficeImg from "@assets/partner-office_1779665186900.jpg";
import receptionImg from "@assets/reception_1779665186901.jpg";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/section-reveal";

export default function About() {
  const { t } = useTranslation();

  const leadership = [
    {
      img: marwanImg,
      imgFit: "object-cover object-center", imgBg: "bg-neutral-900",
      name: t("about.team1Name"),
      title: t("about.team1Title"),
      location: t("about.team1Location"),
      bio: t("about.team1Bio"),
      areas: [t("about.team1Area1"), t("about.team1Area2"), t("about.team1Area3")],
      founder: true,
    },
    {
      img: "/mohab-samy-clean.png",
      imgFit: "object-cover object-center", imgBg: "bg-neutral-900",
      name: t("about.team5Name"),
      title: t("about.team5Title"),
      location: t("about.team5Location"),
      bio: t("about.team5Bio"),
      areas: [t("about.team5Area1"), t("about.team5Area2"), t("about.team5Area3")],
      founder: true,
    },
    {
      img: leader2Img,
      imgFit: "object-cover object-top", imgBg: "bg-neutral-900",
      name: t("about.team2Name"),
      title: t("about.team2Title"),
      location: t("about.team2Location"),
      bio: t("about.team2Bio"),
      areas: [t("about.team2Area1"), t("about.team2Area2"), t("about.team2Area3")],
      founder: false,
    },
    {
      img: leader3Img,
      imgFit: "object-cover object-top", imgBg: "bg-neutral-900", extraImgClass: "brightness-125 contrast-110",
      name: t("about.team3Name"),
      title: t("about.team3Title"),
      location: t("about.team3Location"),
      bio: t("about.team3Bio"),
      areas: [t("about.team3Area1"), t("about.team3Area2"), t("about.team3Area3")],
      founder: false,
    },
    {
      img: leader4Img,
      imgFit: "object-cover object-top", imgBg: "bg-neutral-900",
      name: t("about.team4Name"),
      title: t("about.team4Title"),
      location: t("about.team4Location"),
      bio: t("about.team4Bio"),
      areas: [t("about.team4Area1"), t("about.team4Area2"), t("about.team4Area3")],
      founder: false,
    },
  ];

  const values = [
    { icon: Scale, title: t("about.val1Title"), body: t("about.val1Body") },
    { icon: Building2, title: t("about.val2Title"), body: t("about.val2Body") },
    { icon: Gavel, title: t("about.val3Title"), body: t("about.val3Body") },
    { icon: Globe, title: t("about.val4Title"), body: t("about.val4Body") },
  ];

  return (
    <MainLayout>
      <PageSEO
        title="About Us"
        path="/about"
        description="Meet the leadership of Nexus Axis Consultants — a premier boutique law firm established in 2009 with offices in Ajman, UAE and Cairo, Egypt. Elite partners across commercial litigation, corporate law, and international arbitration."
      />
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[480px] overflow-hidden">
        <img
          src={libraryImg}
          alt="Nexus Axis Consultants legal library"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-8 pb-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-primary/60" />
              <p className="text-xs tracking-[0.35em] uppercase text-primary font-semibold">
                {t("about.badge")}
              </p>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-5">
              {t("about.hero")}
            </h1>
            <div className="w-14 h-px bg-gradient-to-r from-primary to-primary/20 mb-5" />
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <section className="py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">{t("about.philosophy")}</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>{t("about.philosophyP1")}</p>
                <p>{t("about.philosophyP2")}</p>
                <p>{t("about.philosophyP3")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <SectionReveal key={v.title} delay={i * 80} className="h-full">
                  <div className="bg-card border border-border p-7 group hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 h-full">
                    <v.icon className="h-6 w-6 text-primary mb-4" />
                    <h3 className="font-serif text-lg font-bold mb-2">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Office Gallery */}
      <section className="py-4 border-y border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 h-64 md:h-80">
          <div className="overflow-hidden">
            <img src={receptionImg} alt="Reception" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden">
            <img src={office2Img} alt="Conference room" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden">
            <img src={office3Img} alt="Senior partner office" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="overflow-hidden">
            <img src={partnerOfficeImg} alt="Partner office" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-28 bg-card/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">{t("about.team")}</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t("about.leadership")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">{t("about.teamDesc")}</p>
          </div>

          {/* Founders Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {leadership.filter(p => p.founder).map((person, i) => (
              <SectionReveal key={person.name} delay={i * 100}>
                <div className="group bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col">
                  <div className={`w-full overflow-hidden ${person.imgBg ?? "bg-neutral-900"}`} style={{ minHeight: "300px" }}>
                    <img
                      src={person.img}
                      alt={person.name}
                      className={`w-full h-full ${person.imgFit ?? "object-cover object-center"} grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out ${person.extraImgClass ?? ""}`}
                    />
                  </div>
                  <div className="p-7 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors">{person.name}</h3>
                        {person.founder && (
                          <span className="text-[10px] px-2 py-0.5 bg-primary/15 text-primary border border-primary/25 font-semibold uppercase tracking-wider">
                            Founder & Partner
                          </span>
                        )}
                      </div>
                      <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-1">{person.title}</p>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
                        <MapPin className="h-3 w-3" />
                        {person.location}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5">{person.bio}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {person.areas.map((area) => (
                        <span key={area} className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Other Team Members */}
          <div>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-8">{t("about.otherTeam")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {leadership.filter(p => !p.founder).map((person, i) => (
                <SectionReveal key={person.name} delay={i * 100}>
                  <div className="group bg-card border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col">
                    <div className={`w-full overflow-hidden ${person.imgBg ?? "bg-neutral-900"}`} style={{ minHeight: "300px" }}>
                      <img
                        src={person.img}
                        alt={person.name}
                        className={`w-full h-full ${person.imgFit ?? "object-cover object-center"} grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out ${person.extraImgClass ?? ""}`}
                      />
                    </div>
                    <div className="p-7 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif text-xl font-bold group-hover:text-primary transition-colors">{person.name}</h3>
                        </div>
                        <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-1">{person.title}</p>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-4">
                          <MapPin className="h-3 w-3" />
                          {person.location}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-5">{person.bio}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {person.areas.map((area) => (
                          <span key={area} className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 font-medium">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-28">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">{t("about.locations")}</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16">{t("about.strongholds")}</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            <SectionReveal direction="left">
              <div className="bg-card border border-border p-10 group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold">{t("about.uaeHQ")}</h3>
                    <p className="text-muted-foreground text-sm">{t("about.uaeEstablished")}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{t("about.uaeDesc")}</p>
                <div className="text-sm font-medium border-l-2 border-primary pl-4 text-foreground/80">
                  Falcon Tower, 1409 Al Wahda Street<br />
                  Rashidiya 2, Ajman<br />
                  United Arab Emirates
                </div>
                <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground space-y-2">
                  <a href="tel:+971585592355" className="block hover:text-primary transition-colors" dir="ltr">+971 585 592 355</a>
                  <a href="https://wa.me/971585592355" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#25D366] font-semibold hover:underline">
                    <span className="text-xs">↗</span> WhatsApp
                  </a>
                  <a href="mailto:info@nexusaxisconsultants.com" className="block hover:text-primary transition-colors break-all" dir="ltr">info@nexusaxisconsultants.com</a>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal direction="right" delay={120}>
              <div className="bg-card border border-border p-10 group hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold">{t("about.egyptChambers")}</h3>
                    <p className="text-muted-foreground text-sm">{t("about.egyptEstablished")}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{t("about.egyptDesc")}</p>
                <div className="text-sm font-medium border-l-2 border-primary pl-4 text-foreground/80">
                  Al Tahrir Building, 753 St<br />
                  Nasr City, Cairo<br />
                  Egypt
                </div>
                <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground space-y-2">
                  <a href="tel:+201001234567" className="block hover:text-primary transition-colors" dir="ltr">+20 100 123 4567</a>
                  <a href="mailto:cairo@nexusaxisconsultants.com" className="block hover:text-primary transition-colors break-all" dir="ltr">cairo@nexusaxisconsultants.com</a>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
