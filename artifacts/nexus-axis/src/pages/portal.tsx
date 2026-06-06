import { MainLayout } from "@/components/layout/main-layout";
import { useGetMe, useListConsultations } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { FileText, CalendarClock, Plus, Clock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Circle as XCircle, Scale, ChevronRight, User, Mail, Phone, Calendar, TrendingUp, LayoutList } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { SectionReveal } from "@/components/section-reveal";

interface Consultation {
  id: number;
  practiceAreaTitle?: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  durationType: string;
  price: number;
  scheduledAt?: string | null;
  createdAt: string;
  notes?: string | null;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
}

interface ConsultationsResponse {
  data: Consultation[];
}

type TabKey = "all" | "active" | "completed" | "cancelled";

/* ─── Status config ────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending Review",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/25",
    dot: "bg-amber-400",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    color: "text-sky-400 bg-sky-400/10 border-sky-400/25",
    dot: "bg-sky-400",
    icon: TrendingUp,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-rose-400 bg-rose-400/10 border-rose-400/25",
    dot: "bg-rose-400",
    icon: XCircle,
  },
};

/* ─── Helpers ──────────────────────────────────────────────────────────── */
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between p-5 border overflow-hidden ${
        accent
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-card"
      }`}
    >
      {accent && (
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-primary to-primary/10" />
      )}
      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-semibold mb-3">
        {label}
      </p>
      <div>
        <p className={`text-3xl font-serif font-bold ${accent ? "text-primary" : "text-foreground"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Timeline Item ────────────────────────────────────────────────────── */
function TimelineItem({
  consultation,
  isLast,
  index,
}: {
  consultation: Consultation;
  isLast: boolean;
  index: number;
}) {
  const cfg = STATUS_CONFIG[consultation.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <SectionReveal delay={index * 60} className="relative flex gap-5 md:gap-7">
      {/* Vertical connector */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div
          className={`h-3 w-3 rounded-full border-2 border-background ring-2 ring-offset-0 shrink-0 z-10 ${cfg.dot}`}
          style={{ boxShadow: `0 0 0 3px hsl(var(--background))` }}
        />
        {!isLast && (
          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-border to-transparent min-h-[2rem]" />
        )}
      </div>

      {/* Card */}
      <div className="flex-1 mb-8 group">
        <div className="bg-card border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
          {/* Card top accent on hover */}
          <div className="h-px w-0 group-hover:w-full bg-gradient-to-r from-primary to-primary/20 transition-all duration-500" />

          <div className="p-5 md:p-6">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {consultation.practiceAreaTitle ?? "General Legal Counsel"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Matter #{String(consultation.id).padStart(4, "0")} · Requested{" "}
                    {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`inline-flex items-center gap-1.5 self-start px-2.5 py-1 text-xs font-semibold border rounded-full ${cfg.color}`}
              >
                <StatusIcon className="h-3 w-3" />
                {cfg.label}
              </span>
            </div>

            {/* Detail chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border/60 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {consultation.durationType}
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border/60 text-xs text-muted-foreground">
                <span className="text-foreground font-semibold">AED {Number(consultation.price).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background border border-border/60 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(consultation.createdAt), "d MMM yyyy")}
              </div>
              {consultation.scheduledAt && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/8 border border-primary/20 text-xs text-primary font-medium">
                  <CalendarClock className="h-3 w-3" />
                  Scheduled: {format(new Date(consultation.scheduledAt), "d MMM yyyy, h:mm a")}
                </div>
              )}
            </div>

            {/* Notes snippet */}
            {consultation.notes && (
              <div className="bg-background border border-border/50 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                <p className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground/70 mb-1.5">
                  Your Notes
                </p>
                <p className="line-clamp-2">{consultation.notes}</p>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="px-5 md:px-6 py-3 border-t border-border/50 bg-background/40 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {consultation.status === "pending"
                ? "Our team will confirm your appointment shortly."
                : consultation.status === "confirmed"
                ? "Your consultation is confirmed."
                : consultation.status === "completed"
                ? "Matter closed. Thank you for trusting us."
                : "This matter was cancelled."}
            </p>
            {consultation.status === "pending" || consultation.status === "confirmed" ? (
              <a
                href={`https://wa.me/971585592355?text=Hello%2C%20I%20have%20a%20question%20about%20Matter%20%23${String(consultation.id).padStart(4, "0")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline shrink-0 ml-4"
              >
                Message us <ChevronRight className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

/* ─── Loading skeleton ──────────────────────────────────────────────────── */
function PortalSkeleton() {
  return (
    <MainLayout>
      <div className="bg-card border-b border-border py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 py-12 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36" />)}
      </div>
    </MainLayout>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function Portal() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: rawConsultations, isLoading: consultsLoading } = useListConsultations({
    query: { enabled: !!user, queryKey: ["consultations"] },
  });

  useEffect(() => {
    if (!userLoading && !user) setLocation("/login");
  }, [user, userLoading, setLocation]);

  if (userLoading) return <PortalSkeleton />;
  if (!user) return null;

  const consultations: Consultation[] = Array.isArray(rawConsultations)
    ? rawConsultations
    : (rawConsultations as ConsultationsResponse | undefined)?.data ?? [];

  /* Stats */
  const total = consultations.length;
  const pending = consultations.filter((c) => c.status === "pending").length;
  const confirmed = consultations.filter((c) => c.status === "confirmed").length;
  const completed = consultations.filter((c) => c.status === "completed").length;
  const totalSpent = consultations
    .filter((c) => c.status === "completed")
    .reduce((sum, c) => sum + Number(c.price), 0);

  /* Tab filtering */
  const TAB_FILTERS: Record<TabKey, (c: Consultation) => boolean> = {
    all: () => true,
    active: (c) => c.status === "pending" || c.status === "confirmed",
    completed: (c) => c.status === "completed",
    cancelled: (c) => c.status === "cancelled",
  };
  const filtered = consultations
    .filter(TAB_FILTERS[activeTab])
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const TABS: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All Matters", count: total },
    { key: "active", label: "Active", count: pending + confirmed },
    { key: "completed", label: "Completed", count: completed },
    { key: "cancelled", label: "Cancelled", count: consultations.filter((c) => c.status === "cancelled").length },
  ];

  return (
    <MainLayout>
      {/* ── Dashboard Header ── */}
      <div className="border-b border-border bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 py-10 md:py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-primary font-serif font-bold text-xl">{getInitials(user.name)}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-5 h-px bg-primary/60" />
                  <p className="text-xs tracking-[0.25em] uppercase text-primary font-semibold">
                    {t("portal.title", { defaultValue: "Client Portal" })}
                  </p>
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                  {t("portal.welcome", { defaultValue: "Welcome" })}, {user.name.split(" ")[0]}.
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href="/consultation">
                <button className="flex items-center gap-2 px-5 h-10 bg-primary text-primary-foreground text-sm font-serif font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 rounded-sm">
                  <Plus className="h-4 w-4" />
                  {t("portal.newMatter", { defaultValue: "New Matter" })}
                </button>
              </Link>
            </div>
          </div>

          {/* Profile meta */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 pt-5 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>Client since {format(new Date(user.createdAt ?? Date.now()), "MMMM yyyy")}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 md:py-14 space-y-10">

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCard label="Total Matters" value={total} accent />
          <StatCard
            label="Active"
            value={pending + confirmed}
            sub={pending ? `${pending} awaiting confirmation` : undefined}
          />
          <StatCard label="Completed" value={completed} />
          <StatCard
            label="Total Invested"
            value={totalSpent > 0 ? `AED ${totalSpent.toLocaleString()}` : "—"}
            sub={totalSpent > 0 ? "across completed matters" : "No completed matters yet"}
          />
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab.key
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 inset-x-0 h-px bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Timeline / Empty ── */}
        <AnimatePresence mode="wait">
          {consultsLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center shrink-0 pt-1">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    {i < 2 && <Skeleton className="w-px flex-1 mt-2 min-h-[80px]" />}
                  </div>
                  <Skeleton className="flex-1 h-40 mb-8" />
                </div>
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border border-dashed border-border bg-card/50 py-20 flex flex-col items-center text-center"
            >
              {activeTab === "all" ? (
                <>
                  <div className="h-16 w-16 border border-dashed border-border flex items-center justify-center mb-5">
                    <Scale className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2">
                    {t("portal.noMatters", { defaultValue: "No Matters Yet" })}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    {t("portal.noMattersDesc", { defaultValue: "Your matter history will appear here once you book a consultation." })}
                  </p>
                  <Link href="/consultation">
                    <button className="flex items-center gap-2 px-6 h-10 border border-border text-sm font-semibold hover:border-primary/50 hover:text-primary transition-colors rounded-sm">
                      <CalendarClock className="h-4 w-4" />
                      {t("portal.scheduleFirst", { defaultValue: "Schedule First Consultation" })}
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <LayoutList className="h-10 w-10 text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground text-sm">
                    No {activeTab} matters to display.
                  </p>
                  <button
                    onClick={() => setActiveTab("all")}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    View all matters
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-2"
            >
              {filtered.map((c, i) => (
                <TimelineItem
                  key={c.id}
                  consultation={c}
                  isLast={i === filtered.length - 1}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Help CTA ── */}
        {total > 0 && (
          <SectionReveal>
            <div className="border border-border bg-card p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-base font-serif font-bold mb-1">Need assistance with an active matter?</h3>
                <p className="text-sm text-muted-foreground">Reach our team directly on WhatsApp for the fastest response.</p>
              </div>
              <a
                href="https://wa.me/971585592355"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center gap-2.5 px-5 h-10 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/25 transition-colors rounded-sm shrink-0"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Message Us on WhatsApp
              </a>
            </div>
          </SectionReveal>
        )}
      </div>
    </MainLayout>
  );
}
