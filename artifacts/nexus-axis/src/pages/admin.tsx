import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CalendarClock, LogOut,
  CheckCircle2, Clock, XCircle, TrendingUp, AlertCircle,
  ChevronDown, Search, X, Calendar, Shield,
  ArrowUpRight, RefreshCw,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/* ─── Types ──────────────────────────────────────────────────────────── */
type Status = "pending" | "confirmed" | "completed" | "cancelled";

type Consultation = {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  practiceAreaTitle?: string | null;
  durationType: string;
  price: number;
  status: Status;
  scheduledAt?: string | null;
  notes?: string | null;
  createdAt: string;
};

type Stats = {
  totalConsultations: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalUsers: number;
};

/* ─── Status config ──────────────────────────────────────────────────── */
const STATUS_CFG: Record<Status, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "text-amber-400 bg-amber-400/10 border-amber-400/25",   dot: "bg-amber-400",   icon: Clock        },
  confirmed: { label: "Confirmed", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25", dot: "bg-emerald-400", icon: CheckCircle2  },
  completed: { label: "Completed", color: "text-sky-400 bg-sky-400/10 border-sky-400/25",         dot: "bg-sky-400",     icon: TrendingUp    },
  cancelled: { label: "Cancelled", color: "text-rose-400 bg-rose-400/10 border-rose-400/25",      dot: "bg-rose-400",    icon: XCircle       },
};

const ALL_STATUSES: Status[] = ["pending", "confirmed", "completed", "cancelled"];

/* ─── API helpers ────────────────────────────────────────────────────── */
async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

/* ─── Stat card ──────────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, accent }: {
  label: string; value: number | string; icon: React.ElementType; color: string; accent?: boolean;
}) {
  return (
    <div className={`relative p-5 border overflow-hidden flex flex-col gap-3 ${accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      {accent && <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-primary to-primary/10" />}
      <div className={`h-9 w-9 flex items-center justify-center ${color} bg-current/10 rounded-sm`} style={{ backgroundColor: "transparent" }}>
        <div className={`h-9 w-9 flex items-center justify-center rounded-sm ${accent ? "bg-primary/15" : "bg-card-border/30 border border-border"}`}>
          <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </div>
      <div>
        <p className={`text-3xl font-serif font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
        <p className="text-xs text-muted-foreground tracking-[0.1em] uppercase font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${cfg.color}`}>
      <Icon className="h-3 w-3" />{cfg.label}
    </span>
  );
}

/* ─── Status Update Dropdown ─────────────────────────────────────────── */
function StatusDropdown({ consultation, onUpdate }: { consultation: Consultation; onUpdate: (c: Consultation) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = async (status: Status) => {
    setLoading(true);
    setOpen(false);
    try {
      const updated = await apiFetch(`/admin/consultations/${consultation.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onUpdate(updated);
    } catch { /* noop */ }
    setLoading(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border hover:border-primary/50 transition-colors bg-card rounded-sm"
      >
        {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />}
        Change Status
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-1 end-0 w-40 bg-card border border-border shadow-xl shadow-black/30 z-50 rounded-sm overflow-hidden"
          >
            {ALL_STATUSES.filter(s => s !== consultation.status).map(s => {
              const cfg = STATUS_CFG[s];
              const Icon = cfg.icon;
              return (
                <button
                  key={s}
                  onClick={() => update(s)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium hover:bg-muted/60 transition-colors text-start"
                >
                  <Icon className={`h-3.5 w-3.5 ${cfg.color.split(" ")[0]}`} />
                  {cfg.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}

/* ─── Schedule Modal ─────────────────────────────────────────────────── */
function ScheduleModal({ consultation, onClose, onUpdate }: {
  consultation: Consultation;
  onClose: () => void;
  onUpdate: (c: Consultation) => void;
}) {
  const existing = consultation.scheduledAt
    ? format(new Date(consultation.scheduledAt), "yyyy-MM-dd'T'HH:mm")
    : "";
  const [value, setValue] = useState(existing);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await apiFetch(`/admin/consultations/${consultation.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          scheduledAt: value || null,
          status: value && consultation.status === "pending" ? "confirmed" : consultation.status,
        }),
      });
      onUpdate(updated);
      onClose();
    } catch { /* noop */ }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-card border border-border shadow-2xl rounded-sm overflow-hidden"
      >
        <div className="h-0.5 w-full bg-gradient-to-r from-primary to-primary/20" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif font-bold text-lg">Schedule Appointment</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Matter #{String(consultation.id).padStart(4, "0")}</p>
            </div>
            <button onClick={onClose} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors rounded-sm">
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            <span className="font-medium text-foreground">{consultation.clientName}</span>
            {" · "}{consultation.practiceAreaTitle ?? "General Counsel"}
            {" · "}{consultation.durationType}
          </p>

          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">
              Date &amp; Time
            </label>
            <input
              type="datetime-local"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="h-10 px-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 rounded-sm"
            />
            {value && consultation.status === "pending" && (
              <p className="text-xs text-emerald-400">Status will be automatically set to Confirmed.</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 h-9 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2"
            >
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
              {value ? "Save Schedule" : "Clear Schedule"}
            </button>
            <button onClick={onClose} className="h-9 px-4 border border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors rounded-sm">
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Consultation Row ───────────────────────────────────────────────── */
function ConsultationRow({ consultation, onUpdate }: {
  consultation: Consultation;
  onUpdate: (c: Consultation) => void;
}) {
  const [scheduling, setScheduling] = useState(false);

  return (
    <>
      <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
        <td className="px-4 py-3.5 text-sm">
          <div className="font-medium text-foreground">{consultation.clientName}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{consultation.clientEmail}</div>
          {consultation.clientPhone && (
            <div className="text-xs text-muted-foreground">{consultation.clientPhone}</div>
          )}
        </td>
        <td className="px-4 py-3.5 text-sm text-muted-foreground">
          {consultation.practiceAreaTitle ?? <span className="italic opacity-50">General Counsel</span>}
        </td>
        <td className="px-4 py-3.5 text-sm">
          <div className="text-foreground font-medium">{consultation.durationType}</div>
          <div className="text-xs text-muted-foreground">AED {Number(consultation.price).toLocaleString()}</div>
        </td>
        <td className="px-4 py-3.5">
          <StatusBadge status={consultation.status} />
        </td>
        <td className="px-4 py-3.5 text-sm text-muted-foreground">
          {consultation.scheduledAt ? (
            <button
              onClick={() => setScheduling(true)}
              className="text-primary hover:underline text-left"
            >
              {format(new Date(consultation.scheduledAt), "d MMM, h:mm a")}
            </button>
          ) : (
            <button
              onClick={() => setScheduling(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-primary transition-colors"
            >
              <Calendar className="h-3 w-3" /> Set date
            </button>
          )}
        </td>
        <td className="px-4 py-3.5 text-xs text-muted-foreground">
          {format(new Date(consultation.createdAt), "d MMM yyyy")}
        </td>
        <td className="px-4 py-3.5">
          <StatusDropdown consultation={consultation} onUpdate={onUpdate} />
        </td>
      </tr>
      <AnimatePresence>
        {scheduling && (
          <ScheduleModal
            consultation={consultation}
            onClose={() => setScheduling(false)}
            onUpdate={c => { onUpdate(c); setScheduling(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Main Admin Page ────────────────────────────────────────────────── */
export default function Admin() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<"consultations" | "users">("consultations");
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (userLoading) return;
    if (!user) { setLocation("/login"); return; }
    apiFetch("/admin/verify")
      .then(() => setIsAdmin(true))
      .catch(() => { setIsAdmin(false); setLocation("/"); });
  }, [user, userLoading]);

  /* ── Fetch data ── */
  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        apiFetch("/admin/stats"),
        apiFetch(`/admin/consultations?status=${statusFilter}`),
      ]);
      setStats(s);
      setConsultations(c);
    } catch { /* noop */ }
    setLoading(false);
  }, [isAdmin, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const u = await apiFetch("/admin/users");
      setUsers(u);
    } catch { /* noop */ }
  }, [isAdmin]);

  useEffect(() => {
    if (activeSection === "users") loadUsers();
  }, [activeSection, loadUsers]);

  const updateConsultation = (updated: Consultation) => {
    setConsultations(prev => prev.map(c => c.id === updated.id ? updated : c));
    loadData();
  };

  /* ── Filter consultations ── */
  const filtered = consultations.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.clientName.toLowerCase().includes(q) ||
      c.clientEmail.toLowerCase().includes(q) ||
      (c.practiceAreaTitle ?? "").toLowerCase().includes(q)
    );
  });

  /* ── Loading / not admin ── */
  if (userLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  /* ─── Layout ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "var(--app-font-sans, sans-serif)" }}>

      {/* ── Top bar ── */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img src="/nexus-logo.png" alt="Nexus Axis" className="h-8 w-auto" />
          </Link>
          <div className="h-4 w-px bg-border mx-1" />
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
          <Link href="/portal">
            <button className="flex items-center gap-1.5 px-3 h-8 text-xs text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-colors rounded-sm">
              <ArrowUpRight className="h-3 w-3" /> Portal
            </button>
          </Link>
          <a href="/api/auth/logout" onClick={async e => { e.preventDefault(); await apiFetch("/auth/logout", { method: "POST" }); setLocation("/login"); }}
            className="flex items-center gap-1.5 px-3 h-8 text-xs text-muted-foreground border border-border hover:border-rose-500/40 hover:text-rose-400 transition-colors rounded-sm">
            <LogOut className="h-3 w-3" /> Logout
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 border-e border-border bg-card flex flex-col hidden md:flex">
          <nav className="flex-1 py-4 px-3 space-y-1">
            {[
              { key: "consultations", icon: CalendarClock, label: "Consultations", badge: stats?.pending },
              { key: "users",         icon: Users,         label: "Clients",       badge: stats?.totalUsers },
            ].map(({ key, icon: Icon, label, badge }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as any)}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
                  activeSection === key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    activeSection === key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>{badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <Link href="/">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors">
                <LayoutDashboard className="h-4 w-4" /> View Site
              </button>
            </Link>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-8 space-y-7">

            {/* Stats */}
            {activeSection === "consultations" && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <StatCard label="Total" value={stats?.totalConsultations ?? "—"} icon={CalendarClock} color="" accent />
                <StatCard label="Pending"   value={stats?.pending   ?? "—"} icon={Clock}        color="text-amber-400"   />
                <StatCard label="Confirmed" value={stats?.confirmed ?? "—"} icon={CheckCircle2} color="text-emerald-400" />
                <StatCard label="Completed" value={stats?.completed ?? "—"} icon={TrendingUp}   color="text-sky-400"     />
                <StatCard label="Cancelled" value={stats?.cancelled ?? "—"} icon={XCircle}      color="text-rose-400"    />
              </div>
            )}

            {activeSection === "users" && (
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Registered Clients" value={stats?.totalUsers ?? "—"} icon={Users} color="" accent />
                <StatCard label="With Consultations" value={
                  consultations.length > 0
                    ? new Set(consultations.map(c => c.clientEmail)).size
                    : "—"
                } icon={CalendarClock} color="" />
              </div>
            )}

            {/* ── Consultations section ── */}
            {activeSection === "consultations" && (
              <div className="bg-card border border-border overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
                  <h2 className="text-base font-serif font-bold">All Consultations</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search client…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-8 pl-8 pr-3 text-sm bg-background border border-border focus:outline-none focus:border-primary/50 rounded-sm w-44"
                      />
                      {search && (
                        <button onClick={() => setSearch("")} className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Status filter */}
                    <div className="flex gap-1 flex-wrap">
                      {["all", ...ALL_STATUSES].map(s => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`px-2.5 h-8 text-xs font-semibold capitalize transition-colors rounded-sm border ${
                            statusFilter === s
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          {s === "all" ? "All" : STATUS_CFG[s as Status].label}
                        </button>
                      ))}
                    </div>

                    <button onClick={loadData} className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">
                      <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border/60 bg-background/40">
                        {["Client", "Practice Area", "Duration / Fee", "Status", "Scheduled", "Requested", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="border-b border-border/40">
                            {[...Array(7)].map((_, j) => (
                              <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>
                            ))}
                          </tr>
                        ))
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                            <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-30" />
                            {search ? `No results for "${search}"` : "No consultations found."}
                          </td>
                        </tr>
                      ) : filtered.map(c => (
                        <ConsultationRow key={c.id} consultation={c} onUpdate={updateConsultation} />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer count */}
                {!loading && filtered.length > 0 && (
                  <div className="px-5 py-3 border-t border-border/60 text-xs text-muted-foreground bg-background/40">
                    Showing {filtered.length} of {consultations.length} consultations
                    {search && ` matching "${search}"`}
                  </div>
                )}
              </div>
            )}

            {/* ── Clients section ── */}
            {activeSection === "users" && (
              <div className="bg-card border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                  <h2 className="text-base font-serif font-bold">Registered Clients</h2>
                  <button onClick={loadUsers} className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border/60 bg-background/40">
                        {["Name", "Email", "Phone", "Role", "Joined"].map(h => (
                          <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
                            No registered clients yet.
                          </td>
                        </tr>
                      ) : users.map((u: any) => (
                        <tr key={u.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-foreground">{u.name}</td>
                          <td className="px-4 py-3.5 text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3.5 text-muted-foreground">{u.phone ?? <span className="italic opacity-40">—</span>}</td>
                          <td className="px-4 py-3.5">
                            {u.isAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/25 rounded-full">
                                <Shield className="h-3 w-3" /> Admin
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/60">Client</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {format(new Date(u.createdAt), "d MMM yyyy")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
