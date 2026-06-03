import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CalendarClock, LogOut,
  CheckCircle2, Clock, XCircle, TrendingUp, AlertCircle,
  ChevronDown, Search, X, Calendar, Shield,
  ArrowUpRight, RefreshCw, StickyNote, ChevronRight,
  UserCog, Lock, Unlock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import logoPath from "@/assets/logo.svg";

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

type ClientUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  isAdmin: boolean;
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
const STATUS_CFG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "text-amber-400 bg-amber-400/10 border-amber-400/30",     icon: Clock        },
  confirmed: { label: "Confirmed", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", icon: CheckCircle2  },
  completed: { label: "Completed", color: "text-sky-400 bg-sky-400/10 border-sky-400/30",           icon: TrendingUp    },
  cancelled: { label: "Cancelled", color: "text-rose-400 bg-rose-400/10 border-rose-400/30",        icon: XCircle       },
};
const ALL_STATUSES: Status[] = ["pending", "confirmed", "completed", "cancelled"];

/* ─── API helpers ────────────────────────────────────────────────────── */
async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? String(res.status));
  }
  return res.json();
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function StatCard({ label, value, icon: Icon, accent = false, sub }: {
  label: string; value: number | string; icon: React.ElementType; accent?: boolean; sub?: string;
}) {
  return (
    <div className={`relative p-5 border overflow-hidden ${accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
      {accent && <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-primary to-transparent" />}
      <div className={`h-8 w-8 flex items-center justify-center rounded-sm mb-4 ${accent ? "bg-primary/15" : "bg-muted/60 border border-border"}`}>
        <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <p className={`text-3xl font-serif font-bold leading-none ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
      <p className="text-xs text-muted-foreground tracking-[0.1em] uppercase font-medium mt-1.5">{label}</p>
      {sub && <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const { label, color, icon: Icon } = STATUS_CFG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-full ${color}`}>
      <Icon className="h-3 w-3" />{label}
    </span>
  );
}

/* ── Status Dropdown ── */
function StatusDropdown({ consultation, onUpdate }: { consultation: Consultation; onUpdate: (c: Consultation) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = async (status: Status) => {
    setLoading(true); setOpen(false);
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
        Change
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full mt-1 end-0 w-40 bg-card border border-border shadow-2xl shadow-black/50 z-50 rounded-sm overflow-hidden"
          >
            {ALL_STATUSES.filter(s => s !== consultation.status).map(s => {
              const { icon: Icon, color, label } = STATUS_CFG[s];
              return (
                <button key={s} onClick={() => update(s)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium hover:bg-muted/60 transition-colors text-start"
                >
                  <Icon className={`h-3.5 w-3.5 ${color.split(" ")[0]}`} />{label}
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

/* ── Schedule Modal ── */
function ScheduleModal({ consultation, onClose, onUpdate }: {
  consultation: Consultation; onClose: () => void; onUpdate: (c: Consultation) => void;
}) {
  const existing = consultation.scheduledAt ? format(new Date(consultation.scheduledAt), "yyyy-MM-dd'T'HH:mm") : "";
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
      onUpdate(updated); onClose();
    } catch { /* noop */ }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
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

          <p className="text-sm text-muted-foreground mb-5">
            <span className="font-medium text-foreground">{consultation.clientName}</span>
            {" · "}{consultation.practiceAreaTitle ?? "General Counsel"}
            {" · "}{consultation.durationType}
          </p>

          <div className="flex flex-col gap-2 mb-5">
            <label className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Date &amp; Time (UAE)</label>
            <input
              type="datetime-local"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="h-10 px-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 rounded-sm"
            />
            {value && consultation.status === "pending" && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Status will automatically be set to Confirmed — email sent to client.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="flex-1 h-9 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2"
            >
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
              {value ? "Confirm & Schedule" : "Clear Schedule"}
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

/* ── Inline Notes Editor ── */
function NotesEditor({ consultation, onUpdate }: { consultation: Consultation; onUpdate: (c: Consultation) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(consultation.notes ?? "");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (open) { setDraft(consultation.notes ?? ""); ref.current?.focus(); } }, [open]);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await apiFetch(`/admin/consultations/${consultation.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes: draft || null }),
      });
      onUpdate(updated); setOpen(false);
    } catch { /* noop */ }
    setSaving(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors rounded-sm ${
          consultation.notes
            ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
        }`}
      >
        <StickyNote className="h-3 w-3" />
        {consultation.notes ? "Notes" : "Add note"}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }} transition={{ duration: 0.12 }}
              className="absolute top-full mt-1.5 end-0 w-80 bg-card border border-border shadow-2xl shadow-black/50 z-50 rounded-sm overflow-hidden"
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-primary to-transparent" />
              <div className="p-3">
                <p className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground mb-2">
                  Internal Notes — {consultation.clientName}
                </p>
                <textarea
                  ref={ref}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this consultation…"
                  className="w-full px-3 py-2 bg-background border border-border text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/40 rounded-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={save} disabled={saving}
                    className="flex-1 h-8 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 rounded-sm flex items-center justify-center gap-1.5"
                  >
                    {saving ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                    Save Notes
                  </button>
                  <button onClick={() => setOpen(false)}
                    className="h-8 px-3 border border-border text-xs text-muted-foreground hover:text-foreground rounded-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Consultation Row ── */
function ConsultationRow({ consultation, onUpdate }: { consultation: Consultation; onUpdate: (c: Consultation) => void }) {
  const [scheduling, setScheduling] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={`border-b border-border/40 transition-colors cursor-pointer ${expanded ? "bg-muted/20" : "hover:bg-muted/10"}`}
        onClick={() => setExpanded(e => !e)}
      >
        <td className="px-4 py-3.5 text-sm">
          <div className="flex items-center gap-2">
            <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground/50 transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`} />
            <div>
              <div className="font-medium text-foreground">{consultation.clientName}</div>
              <div className="text-xs text-muted-foreground">{consultation.clientEmail}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5 text-sm text-muted-foreground">
          {consultation.practiceAreaTitle ?? <span className="italic opacity-40">General Counsel</span>}
        </td>
        <td className="px-4 py-3.5 text-sm">
          <div className="text-foreground font-medium">{consultation.durationType}</div>
          <div className="text-xs text-muted-foreground">AED {Number(consultation.price).toLocaleString()}</div>
        </td>
        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
          <StatusBadge status={consultation.status} />
        </td>
        <td className="px-4 py-3.5 text-sm text-muted-foreground" onClick={e => e.stopPropagation()}>
          {consultation.scheduledAt ? (
            <button onClick={() => setScheduling(true)} className="text-primary hover:underline text-left text-sm">
              {format(new Date(consultation.scheduledAt), "d MMM, h:mm a")}
            </button>
          ) : (
            <button onClick={() => setScheduling(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-primary transition-colors"
            >
              <Calendar className="h-3 w-3" /> Set date
            </button>
          )}
        </td>
        <td className="px-4 py-3.5 text-xs text-muted-foreground">
          {format(new Date(consultation.createdAt), "d MMM yyyy")}
        </td>
        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <StatusDropdown consultation={consultation} onUpdate={onUpdate} />
            <NotesEditor consultation={consultation} onUpdate={onUpdate} />
          </div>
        </td>
      </tr>

      {/* Expanded details row */}
      <AnimatePresence>
        {expanded && (
          <tr className="border-b border-border/40">
            <td colSpan={7} className="px-0 py-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-12 py-4 bg-muted/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {consultation.clientPhone && (
                    <div>
                      <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Phone</p>
                      <p className="font-medium">{consultation.clientPhone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Reference</p>
                    <p className="font-medium font-mono">#{String(consultation.id).padStart(5, "0")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Requested</p>
                    <p className="font-medium">{format(new Date(consultation.createdAt), "d MMM yyyy, h:mm a")}</p>
                  </div>
                  {consultation.notes && (
                    <div className="col-span-2 md:col-span-4">
                      <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Internal Notes</p>
                      <p className="text-muted-foreground whitespace-pre-wrap">{consultation.notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>

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

/* ── First Admin Setup Banner ── */
function FirstAdminBanner({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const promote = async () => {
    setLoading(true); setError("");
    try {
      await apiFetch("/admin/setup", { method: "POST" });
      onSuccess();
    } catch (e: any) {
      setError(e.message ?? "Failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border border-primary/30 bg-primary/5 p-8 rounded-sm">
          <div className="h-0.5 w-16 bg-primary mb-6" />
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-bold">First-Time Admin Setup</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            No administrators exist yet. Since you're logged in, you can claim admin access now.
            Once you do, only existing admins can grant access to others.
          </p>
          {error && (
            <p className="text-rose-400 text-sm mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
          <button onClick={promote} disabled={loading}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Claim Admin Access
          </button>
          <Link href="/">
            <button className="w-full mt-3 h-9 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">
              Back to Site
            </button>
          </Link>
        </div>
      </div>
    </div>
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
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [adminState, setAdminState] = useState<"loading" | "noAuth" | "firstSetup" | "ok">("loading");
  const [togglingAdmin, setTogglingAdmin] = useState<number | null>(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (userLoading) return;
    if (!user) { setLocation("/login"); return; }
    apiFetch("/admin/verify")
      .then(() => setAdminState("ok"))
      .catch(() => {
        // User is logged in but is not an admin — show first-admin setup
        setAdminState("firstSetup");
      });
  }, [user, userLoading]);

  /* ── Fetch consultations ── */
  const loadData = useCallback(async () => {
    if (adminState !== "ok") return;
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
  }, [adminState, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Fetch users ── */
  const loadUsers = useCallback(async () => {
    if (adminState !== "ok") return;
    setUsersLoading(true);
    try {
      const u = await apiFetch("/admin/users");
      setUsers(u);
    } catch { /* noop */ }
    setUsersLoading(false);
  }, [adminState]);

  useEffect(() => {
    if (activeSection === "users") loadUsers();
  }, [activeSection, loadUsers]);

  const updateConsultation = (updated: Consultation) => {
    setConsultations(prev => prev.map(c => c.id === updated.id ? updated : c));
    apiFetch("/admin/stats").then(setStats).catch(() => {});
  };

  const toggleAdmin = async (u: ClientUser) => {
    setTogglingAdmin(u.id);
    try {
      const updated = await apiFetch(`/admin/users/${u.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isAdmin: !u.isAdmin }),
      });
      setUsers(prev => prev.map(x => x.id === updated.id ? { ...x, isAdmin: updated.isAdmin } : x));
    } catch { /* noop */ }
    setTogglingAdmin(null);
  };

  const filtered = consultations.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.clientName.toLowerCase().includes(q) ||
      c.clientEmail.toLowerCase().includes(q) ||
      (c.practiceAreaTitle ?? "").toLowerCase().includes(q)
    );
  });

  /* ── Render states ── */
  if (userLoading || adminState === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (adminState === "firstSetup") {
    return <FirstAdminBanner onSuccess={() => setAdminState("ok")} />;
  }

  /* ─── Dashboard layout ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "var(--app-font-sans, sans-serif)" }}>

      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src={logoPath} alt="Nexus Axis" className="h-8 w-auto" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xs font-bold tracking-[0.18em] text-foreground uppercase group-hover:text-primary transition-colors" style={{ fontFamily: "var(--app-font-serif, Georgia, serif)" }}>
                Nexus Axis
              </span>
              <span className="text-[8px] tracking-[0.32em] text-primary/70 uppercase mt-0.5">Consultants</span>
            </div>
          </Link>
          <div className="h-4 w-px bg-border mx-0.5" />
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
          <Link href="/portal">
            <button className="flex items-center gap-1.5 px-3 h-8 text-xs text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-colors rounded-sm">
              <ArrowUpRight className="h-3 w-3" /> Portal
            </button>
          </Link>
          <button
            onClick={async () => { await apiFetch("/auth/logout", { method: "POST" }); setLocation("/login"); }}
            className="flex items-center gap-1.5 px-3 h-8 text-xs text-muted-foreground border border-border hover:border-rose-500/40 hover:text-rose-400 transition-colors rounded-sm"
          >
            <LogOut className="h-3 w-3" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-e border-border bg-card flex-col hidden md:flex">
          <nav className="flex-1 py-4 px-3 space-y-0.5">
            {([
              { key: "consultations", icon: CalendarClock, label: "Consultations", badge: stats?.pending },
              { key: "users",         icon: Users,         label: "Clients",       badge: stats?.totalUsers },
            ] as const).map(({ key, icon: Icon, label, badge }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${
                  activeSection === key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />{label}
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                    activeSection === key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>{badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border space-y-0.5">
            <Link href="/">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors">
                <LayoutDashboard className="h-4 w-4" /> View Site
              </button>
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-7 space-y-6">

            {/* ── Consultations view ── */}
            {activeSection === "consultations" && (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <StatCard label="Total" value={stats?.totalConsultations ?? "—"} icon={CalendarClock} accent />
                  <StatCard label="Pending"   value={stats?.pending   ?? "—"} icon={Clock}        />
                  <StatCard label="Confirmed" value={stats?.confirmed ?? "—"} icon={CheckCircle2} />
                  <StatCard label="Completed" value={stats?.completed ?? "—"} icon={TrendingUp}   />
                  <StatCard label="Cancelled" value={stats?.cancelled ?? "—"} icon={XCircle}      />
                </div>

                {/* Table */}
                <div className="bg-card border border-border overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
                    <div>
                      <h2 className="text-base font-serif font-bold">All Consultations</h2>
                      {!loading && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                          {statusFilter !== "all" ? ` — ${STATUS_CFG[statusFilter as Status]?.label ?? statusFilter}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          type="text" placeholder="Search client…" value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="h-8 pl-8 pr-8 text-sm bg-background border border-border focus:outline-none focus:border-primary/50 rounded-sm w-44"
                        />
                        {search && (
                          <button onClick={() => setSearch("")} className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      {/* Status filters */}
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

                      <button onClick={loadData}
                        className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Table body */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[860px]">
                      <thead>
                        <tr className="border-b border-border/60 bg-background/30">
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
                            <td colSpan={7} className="px-4 py-20 text-center text-muted-foreground">
                              <AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-25" />
                              <p className="text-sm">{search ? `No results for "${search}"` : "No consultations found."}</p>
                              {statusFilter !== "all" && (
                                <button onClick={() => setStatusFilter("all")} className="text-xs text-primary hover:underline mt-2">
                                  Clear filter
                                </button>
                              )}
                            </td>
                          </tr>
                        ) : filtered.map(c => (
                          <ConsultationRow key={c.id} consultation={c} onUpdate={updateConsultation} />
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!loading && filtered.length > 0 && (
                    <div className="px-5 py-3 border-t border-border/50 text-xs text-muted-foreground bg-background/30 flex items-center justify-between">
                      <span>Showing {filtered.length} of {consultations.length}</span>
                      {stats?.pending ? (
                        <span className="text-amber-400">{stats.pending} pending review</span>
                      ) : null}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── Clients view ── */}
            {activeSection === "users" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Registered Clients" value={stats?.totalUsers ?? "—"} icon={Users} accent />
                  <StatCard label="Admins" value={users.filter(u => u.isAdmin).length} icon={Shield} />
                </div>

                <div className="bg-card border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-serif font-bold">Registered Clients</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Manage access and roles</p>
                    </div>
                    <button onClick={loadUsers}
                      className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${usersLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[620px]">
                      <thead>
                        <tr className="border-b border-border/60 bg-background/30">
                          {["Name", "Email", "Phone", "Role", "Joined", "Actions"].map(h => (
                            <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {usersLoading ? (
                          [...Array(4)].map((_, i) => (
                            <tr key={i} className="border-b border-border/40">
                              {[...Array(6)].map((_, j) => (
                                <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>
                              ))}
                            </tr>
                          ))
                        ) : users.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">
                              <Users className="h-8 w-8 mx-auto mb-3 opacity-25" />
                              <p className="text-sm">No registered clients yet.</p>
                            </td>
                          </tr>
                        ) : users.map(u => (
                          <tr key={u.id} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-3.5 font-medium text-foreground">{u.name}</td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs">{u.email}</td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs">
                              {u.phone ?? <span className="italic opacity-40">—</span>}
                            </td>
                            <td className="px-4 py-3.5">
                              {u.isAdmin ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/25 rounded-full">
                                  <Shield className="h-3 w-3" /> Admin
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground/50">Client</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                              {format(new Date(u.createdAt), "d MMM yyyy")}
                            </td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => toggleAdmin(u)}
                                disabled={togglingAdmin === u.id || (u.isAdmin && users.filter(x => x.isAdmin).length === 1)}
                                title={u.isAdmin && users.filter(x => x.isAdmin).length === 1 ? "Cannot remove the last admin" : ""}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors rounded-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                                  u.isAdmin
                                    ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                                }`}
                              >
                                {togglingAdmin === u.id
                                  ? <RefreshCw className="h-3 w-3 animate-spin" />
                                  : u.isAdmin
                                    ? <><Lock className="h-3 w-3" /> Revoke Admin</>
                                    : <><UserCog className="h-3 w-3" /> Make Admin</>
                                }
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
