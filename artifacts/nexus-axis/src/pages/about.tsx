import { MainLayout } from "@/components/layout/main-layout";
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

const leadership = [
  {
    img: marwanImg,
    name: "Marwan Negm",
    title: "Managing Partner",
    location: "Ajman, UAE",
    bio: "Founder and Managing Partner with over 20 years of practice in commercial litigation and corporate advisory across UAE and Egyptian courts. Admitted before the Federal Supreme Court.",
    areas: ["Commercial Litigation", "Corporate Advisory", "International Arbitration"],
  },
  {
    img: leader2Img,
    name: "Layla Al Rashidi",
    title: "Senior Partner",
    location: "Ajman, UAE",
    bio: "A leading authority in UAE corporate tax strategy and Free Zone structuring. Advises multinational clients on inbound investment and regulatory compliance across the MENA region.",
    areas: ["Corporate Tax", "Business Setup", "Regulatory Compliance"],
  },
  {
    img: leader3Img,
    name: "Khaled Mansour",
    title: "Partner",
    location: "Cairo, Egypt",
    bio: "Heads the Cairo chambers with deep expertise in Egyptian commercial law, real estate transactions, and cross-border dispute resolution. Fluent in Arabic, English, and French.",
    areas: ["Real Estate Law", "Dispute Resolution", "Corporate Law"],
  },
  {
    img: leader4Img,
    name: "Sara Al Hamdan",
    title: "Associate Partner",
    location: "Ajman, UAE",
    bio: "Specializes in employment law, HR compliance, and workforce restructuring. Advises boards and HR directors on Emiratization requirements and labour dispute prevention.",
    areas: ["HR Compliance", "Employment Law", "Emiratization"],
  },
];

const values = [
  {
    icon: Scale,
    title: "Precision",
    body: "Every detail considered. Outcomes delivered with surgical accuracy and deep commercial insight.",
  },
  {
    icon: Building2,
    title: "Boutique Agility",
    body: "Large firm capability with the speed and personal attention of a specialized practice.",
  },
  {
    icon: Gavel,
    title: "Decisive Action",
    body: "We don't over-analyze when action is required. We strike when advantageous.",
  },
  {
    icon: Globe,
    title: "MENA Expertise",
    body: "Dual presence in UAE and Egypt gives us unmatched access across the region's most active markets.",
  },
];

export default function About() {
  return (
    <MainLayout>
      {/* Hero */}
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={libraryImg}
          alt="Nexus Axis Consultants legal library"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 md:px-8 pb-16">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4 font-medium">
              Established 2009 — UAE &amp; Egypt
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
              Uncompromising Representation
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Since 2009, Nexus Axis Consultants has established itself as a premier boutique firm operating across the Middle East and North Africa.
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <section className="py-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start mb-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">Our Philosophy</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  We do not believe in standard solutions. Every legal challenge presents a unique matrix of risks, opportunities, and constraints. Our role is to map that matrix and execute a strategy that secures our clients' objectives with absolute precision.
                </p>
                <p>
                  Our chambers operate with strict confidentiality and controlled authority. We take on matters where the stakes demand nothing less than complete dedication and elite legal maneuvering.
                </p>
                <p>
                  We measure success by outcomes achieved and lasting value created — never by hours billed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="bg-card border border-border p-7 group hover:border-primary/40 transition-colors">
                  <v.icon className="h-6 w-6 text-primary mb-4" />
                  <h3 className="font-serif text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.body}</p>
                </div>
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
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">The Team</p>
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Leadership</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Our partners combine deep academic credentials with decades of frontline practice in some of the region's most complex matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {leadership.map((person) => (
              <div
                key={person.name}
                data-testid={`card-leader-${person.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group bg-card border border-border hover:border-primary/40 transition-colors overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-52 shrink-0 overflow-hidden">
                  <img
                    src={person.img}
                    alt={person.name}
                    className="w-full h-64 md:h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  />
                </div>
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="font-serif text-xl font-bold">{person.name}</h3>
                    </div>
                    <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-1">{person.title}</p>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-5">
                      <MapPin className="h-3 w-3" />
                      {person.location}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{person.bio}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {person.areas.map((area) => (
                      <span
                        key={area}
                        className="text-xs px-3 py-1 bg-primary/10 text-primary border border-primary/20 font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-28">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3 font-medium">Locations</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-16">Our Strongholds</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
            <div className="bg-card border border-border p-10 group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">UAE Headquarters</h3>
                  <p className="text-muted-foreground text-sm">Established 2009</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Strategically positioned in Ajman, our UAE office handles complex corporate structuring, real estate disputes, and high-value arbitration across the Emirates.
              </p>
              <div className="text-sm font-medium border-l-2 border-primary pl-4 text-foreground/80">
                Falcon Tower, 1409 Al Wahda Street<br />
                Rashidiya 2, Ajman<br />
                United Arab Emirates
              </div>
              <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground space-y-1">
                <p>+971 585 592 355</p>
                <p>info@nexusaxisconsultants.com</p>
              </div>
            </div>

            <div className="bg-card border border-border p-10 group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold">Egypt Chambers</h3>
                  <p className="text-muted-foreground text-sm">Established 2015</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Located in the heart of Nasr City, our Cairo team commands deep influence in domestic litigation, regulatory affairs, and commercial law across Egypt.
              </p>
              <div className="text-sm font-medium border-l-2 border-primary pl-4 text-foreground/80">
                Al Tahrir Building, 753 St<br />
                Nasr City, Cairo<br />
                Egypt
              </div>
              <div className="mt-6 pt-6 border-t border-border text-sm text-muted-foreground space-y-1">
                <p>+20 100 123 4567</p>
                <p>cairo@nexusaxisconsultants.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
