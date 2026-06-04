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
  UserCog, Lock, Pencil, Trash2, Plus, FileText, BookOpen, Unlock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import logoPath from "@/assets/logo.svg";

/* ─── Types ──────────────────────────────────────────────────────────── */
type Status = "pending" | "confirmed" | "completed" | "cancelled";
type ActiveSection = "consultations" | "users" | "blog" | "practice-areas";

type Consultation = {
  id: number; clientName: string; clientEmail: string; clientPhone?: string | null;
  practiceAreaTitle?: string | null; durationType: string; price: number;
  status: Status; scheduledAt?: string | null; notes?: string | null; createdAt: string;
};
type ClientUser = {
  id: number; name: string; email: string; phone?: string | null;
  isAdmin: boolean; createdAt: string;
};
type Stats = {
  totalConsultations: number; pending: number; confirmed: number;
  completed: number; cancelled: number; totalUsers: number;
  totalBlog: number; totalAreas: number;
};
type AdminBlogPost = {
  id: number; title: string; slug: string; excerpt: string;
  content: string; category: string; author: string;
  publishedAt: string; imageUrl: string | null;
};
type AdminPracticeArea = {
  id: number; title: string; slug: string; description: string;
  icon: string; details: string; order: number;
};

/* ─── Status config ──────────────────────────────────────────────────── */
const STATUS_CFG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   color: "text-amber-400 bg-amber-400/10 border-amber-400/30",     icon: Clock        },
  confirmed: { label: "Confirmed", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", icon: CheckCircle2  },
  completed: { label: "Completed", color: "text-sky-400 bg-sky-400/10 border-sky-400/30",           icon: TrendingUp    },
  cancelled: { label: "Cancelled", color: "text-rose-400 bg-rose-400/10 border-rose-400/30",        icon: XCircle       },
};
const ALL_STATUSES: Status[] = ["pending", "confirmed", "completed", "cancelled"];
const BLOG_CATEGORIES = ["Corporate", "Real Estate", "Dispute Resolution", "Regulatory", "Immigration"];

/* ─── API helper ─────────────────────────────────────────────────────── */
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

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/* ─── Shared UI ──────────────────────────────────────────────────────── */
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

const inputCls = "w-full h-9 px-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 rounded-sm placeholder:text-muted-foreground/40";
const textareaCls = "w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 rounded-sm placeholder:text-muted-foreground/40 resize-y";
const labelCls = "block text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground mb-1.5";

/* ─── Status Dropdown ────────────────────────────────────────────────── */
function StatusDropdown({ consultation, onUpdate }: { consultation: Consultation; onUpdate: (c: Consultation) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const update = async (status: Status) => {
    setLoading(true); setOpen(false);
    try { const u = await apiFetch(`/admin/consultations/${consultation.id}`, { method: "PATCH", body: JSON.stringify({ status }) }); onUpdate(u); }
    catch { /* noop */ }
    setLoading(false);
  };
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border hover:border-primary/50 transition-colors bg-card rounded-sm">
        {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <ChevronDown className="h-3 w-3" />} Change
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
            className="absolute top-full mt-1 end-0 w-40 bg-card border border-border shadow-2xl shadow-black/50 z-50 rounded-sm overflow-hidden">
            {ALL_STATUSES.filter(s => s !== consultation.status).map(s => {
              const { icon: Icon, color, label } = STATUS_CFG[s];
              return (
                <button key={s} onClick={() => update(s)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium hover:bg-muted/60 transition-colors text-start">
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

/* ─── Schedule Modal ─────────────────────────────────────────────────── */
function ScheduleModal({ consultation, onClose, onUpdate }: { consultation: Consultation; onClose: () => void; onUpdate: (c: Consultation) => void }) {
  const existing = consultation.scheduledAt ? format(new Date(consultation.scheduledAt), "yyyy-MM-dd'T'HH:mm") : "";
  const [value, setValue] = useState(existing);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      const u = await apiFetch(`/admin/consultations/${consultation.id}`, {
        method: "PATCH",
        body: JSON.stringify({ scheduledAt: value || null, status: value && consultation.status === "pending" ? "confirmed" : consultation.status }),
      });
      onUpdate(u); onClose();
    } catch { /* noop */ }
    setSaving(false);
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-card border border-border shadow-2xl rounded-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary to-primary/20" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div><h3 className="font-serif font-bold text-lg">Schedule Appointment</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Matter #{String(consultation.id).padStart(4, "0")}</p></div>
            <button onClick={onClose} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors rounded-sm"><X className="h-4 w-4" /></button>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            <span className="font-medium text-foreground">{consultation.clientName}</span>
            {" · "}{consultation.practiceAreaTitle ?? "General Counsel"}{" · "}{consultation.durationType}
          </p>
          <div className="flex flex-col gap-2 mb-5">
            <label className={labelCls}>Date &amp; Time (UAE)</label>
            <input type="datetime-local" value={value} onChange={e => setValue(e.target.value)}
              className="h-10 px-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 rounded-sm" />
            {value && consultation.status === "pending" && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" />Status will be set to Confirmed.</p>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="flex-1 h-9 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2">
              {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
              {value ? "Confirm & Schedule" : "Clear Schedule"}
            </button>
            <button onClick={onClose} className="h-9 px-4 border border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors rounded-sm">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Notes Editor ───────────────────────────────────────────────────── */
function NotesEditor({ consultation, onUpdate }: { consultation: Consultation; onUpdate: (c: Consultation) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(consultation.notes ?? "");
  const [saving, setSaving] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (open) { setDraft(consultation.notes ?? ""); ref.current?.focus(); } }, [open]);
  const save = async () => {
    setSaving(true);
    try { const u = await apiFetch(`/admin/consultations/${consultation.id}`, { method: "PATCH", body: JSON.stringify({ notes: draft || null }) }); onUpdate(u); setOpen(false); }
    catch { /* noop */ }
    setSaving(false);
  };
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors rounded-sm ${consultation.notes ? "border-primary/30 text-primary bg-primary/5 hover:bg-primary/10" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
        <StickyNote className="h-3 w-3" />{consultation.notes ? "Notes" : "Add note"}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.97, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }} transition={{ duration: 0.12 }}
              className="absolute top-full mt-1.5 end-0 w-80 bg-card border border-border shadow-2xl shadow-black/50 z-50 rounded-sm overflow-hidden">
              <div className="h-0.5 w-full bg-gradient-to-r from-primary to-transparent" />
              <div className="p-3">
                <p className="text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground mb-2">Internal Notes — {consultation.clientName}</p>
                <textarea ref={ref} value={draft} onChange={e => setDraft(e.target.value)} rows={4} placeholder="Add internal notes…"
                  className="w-full px-3 py-2 bg-background border border-border text-sm text-foreground resize-none focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/40 rounded-sm" />
                <div className="flex gap-2 mt-2">
                  <button onClick={save} disabled={saving}
                    className="flex-1 h-8 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 rounded-sm flex items-center justify-center gap-1.5">
                    {saving ? <RefreshCw className="h-3 w-3 animate-spin" /> : null} Save Notes
                  </button>
                  <button onClick={() => setOpen(false)} className="h-8 px-3 border border-border text-xs text-muted-foreground hover:text-foreground rounded-sm">Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Consultation Row ───────────────────────────────────────────────── */
function ConsultationRow({ consultation, onUpdate }: { consultation: Consultation; onUpdate: (c: Consultation) => void }) {
  const [scheduling, setScheduling] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <tr className={`border-b border-border/40 transition-colors cursor-pointer ${expanded ? "bg-muted/20" : "hover:bg-muted/10"}`} onClick={() => setExpanded(e => !e)}>
        <td className="px-4 py-3.5 text-sm">
          <div className="flex items-center gap-2">
            <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground/50 transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`} />
            <div><div className="font-medium text-foreground">{consultation.clientName}</div>
              <div className="text-xs text-muted-foreground">{consultation.clientEmail}</div></div>
          </div>
        </td>
        <td className="px-4 py-3.5 text-sm text-muted-foreground">{consultation.practiceAreaTitle ?? <span className="italic opacity-40">General</span>}</td>
        <td className="px-4 py-3.5 text-sm">
          <div className="text-foreground font-medium">{consultation.durationType}</div>
          <div className="text-xs text-muted-foreground">AED {Number(consultation.price).toLocaleString()}</div>
        </td>
        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}><StatusBadge status={consultation.status} /></td>
        <td className="px-4 py-3.5 text-sm text-muted-foreground" onClick={e => e.stopPropagation()}>
          {consultation.scheduledAt ? (
            <button onClick={() => setScheduling(true)} className="text-primary hover:underline text-left text-sm">
              {format(new Date(consultation.scheduledAt), "d MMM, h:mm a")}
            </button>
          ) : (
            <button onClick={() => setScheduling(true)} className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-primary transition-colors">
              <Calendar className="h-3 w-3" /> Set date
            </button>
          )}
        </td>
        <td className="px-4 py-3.5 text-xs text-muted-foreground">{format(new Date(consultation.createdAt), "d MMM yyyy")}</td>
        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <StatusDropdown consultation={consultation} onUpdate={onUpdate} />
            <NotesEditor consultation={consultation} onUpdate={onUpdate} />
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr className="border-b border-border/40">
            <td colSpan={7} className="px-0 py-0">
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="px-12 py-4 bg-muted/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {consultation.clientPhone && (<div><p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Phone</p><p className="font-medium">{consultation.clientPhone}</p></div>)}
                  <div><p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Reference</p><p className="font-medium font-mono">#{String(consultation.id).padStart(5, "0")}</p></div>
                  <div><p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Requested</p><p className="font-medium">{format(new Date(consultation.createdAt), "d MMM yyyy, h:mm a")}</p></div>
                  {consultation.notes && (<div className="col-span-2 md:col-span-4"><p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Notes</p><p className="text-muted-foreground whitespace-pre-wrap">{consultation.notes}</p></div>)}
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {scheduling && <ScheduleModal consultation={consultation} onClose={() => setScheduling(false)} onUpdate={c => { onUpdate(c); setScheduling(false); }} />}
      </AnimatePresence>
    </>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────────────── */
function DeleteConfirm({ label, onConfirm, onClose, loading }: { label: string; onConfirm: () => void; onClose: () => void; loading: boolean }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()} className="w-full max-w-sm bg-card border border-rose-500/30 shadow-2xl rounded-sm overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-rose-500 to-rose-500/20" />
        <div className="p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-9 w-9 shrink-0 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 rounded-sm">
              <Trash2 className="h-4 w-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">Confirm Delete</h3>
              <p className="text-sm text-muted-foreground mt-1">This will permanently delete <span className="text-foreground font-medium">"{label}"</span>. This cannot be undone.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 h-9 bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2">
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
            </button>
            <button onClick={onClose} className="h-9 px-4 border border-border text-sm text-muted-foreground hover:text-foreground rounded-sm">Cancel</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Blog Editor Panel ──────────────────────────────────────────────── */
function BlogEditorPanel({ post, onClose, onSaved }: { post: Partial<AdminBlogPost> | null; onClose: () => void; onSaved: (p: AdminBlogPost) => void }) {
  const isNew = !post?.id;
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    category: post?.category ?? "Corporate",
    author: post?.author ?? "Nexus Axis Editorial",
    imageUrl: post?.imageUrl ?? "",
    publishedAt: post?.publishedAt ? post.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(isNew);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleTitle = (v: string) => {
    setForm(f => ({ ...f, title: v, ...(autoSlug ? { slug: slugify(v) } : {}) }));
  };
  const handleSlug = (v: string) => { setAutoSlug(false); set("slug", v); };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError("Title, slug, and content are required."); return;
    }
    setSaving(true); setError("");
    try {
      const url = isNew ? "/admin/blog" : `/admin/blog/${post!.id}`;
      const saved = await apiFetch(url, { method: isNew ? "POST" : "PATCH", body: JSON.stringify(form) });
      onSaved(saved);
    } catch (e: any) { setError(e.message ?? "Save failed"); }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-card border-l border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary to-primary/20 shrink-0" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-sm">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-none">{isNew ? "New Blog Post" : "Edit Post"}</h2>
              {!isNew && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">{post?.title}</p>}
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-sm transition-colors"><X className="h-4 w-4" /></button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Title *</label>
              <input value={form.title} onChange={e => handleTitle(e.target.value)} placeholder="e.g. UAE Corporate Tax: What Businesses Need to Know" className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Slug * <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(URL path: /blog/:id — slug is display only)</span></label>
              <input value={form.slug} onChange={e => handleSlug(e.target.value)} placeholder="e.g. uae-corporate-tax-2024" className={`${inputCls} font-mono text-xs`} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full h-9 px-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60 rounded-sm">
                {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input value={form.author} onChange={e => set("author", e.target.value)} placeholder="Marwan Negm" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Published Date</label>
              <input type="date" value={form.publishedAt} onChange={e => set("publishedAt", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Cover Image URL <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(optional)</span></label>
              <input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="/office1.jpg or https://..." className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Excerpt <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(shown in blog list)</span></label>
              <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} rows={3}
                placeholder="A brief summary shown in the blog listing…" className={textareaCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Content * <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(HTML — use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.)</span></label>
              <textarea value={form.content} onChange={e => set("content", e.target.value)} rows={18}
                placeholder={"<h2>Introduction</h2>\n<p>Your article content here...</p>\n<ul>\n  <li>Point one</li>\n  <li>Point two</li>\n</ul>"}
                className={`${textareaCls} font-mono text-xs leading-relaxed`} />
            </div>
          </div>
          {error && <p className="text-rose-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-background/30 flex items-center gap-2 shrink-0">
          <button onClick={save} disabled={saving}
            className="flex-1 h-10 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            {isNew ? "Publish Post" : "Save Changes"}
          </button>
          <button onClick={onClose} className="h-10 px-5 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Practice Area Editor Panel ─────────────────────────────────────── */
function PracticeAreaEditorPanel({ area, onClose, onSaved }: { area: Partial<AdminPracticeArea> | null; onClose: () => void; onSaved: (a: AdminPracticeArea) => void }) {
  const isNew = !area?.id;
  const [form, setForm] = useState({
    title: area?.title ?? "",
    slug: area?.slug ?? "",
    description: area?.description ?? "",
    icon: area?.icon ?? "Briefcase",
    details: area?.details ?? "",
    order: String(area?.order ?? 99),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [autoSlug, setAutoSlug] = useState(isNew);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));
  const handleTitle = (v: string) => setForm(f => ({ ...f, title: v, ...(autoSlug ? { slug: slugify(v) } : {}) }));
  const handleSlug = (v: string) => { setAutoSlug(false); set("slug", v); };

  const save = async () => {
    if (!form.title.trim() || !form.slug.trim()) { setError("Title and slug are required."); return; }
    setSaving(true); setError("");
    try {
      const url = isNew ? "/admin/practice-areas" : `/admin/practice-areas/${area!.id}`;
      const saved = await apiFetch(url, { method: isNew ? "POST" : "PATCH", body: JSON.stringify(form) });
      onSaved(saved);
    } catch (e: any) { setError(e.message ?? "Save failed"); }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-card border-l border-border flex flex-col overflow-hidden">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary to-primary/20 shrink-0" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-sm">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-none">{isNew ? "New Practice Area" : "Edit Practice Area"}</h2>
              {!isNew && <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">{area?.title}</p>}
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-sm transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Title *</label>
              <input value={form.title} onChange={e => handleTitle(e.target.value)} placeholder="e.g. Competition & Antitrust Law" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug * <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(URL path)</span></label>
              <input value={form.slug} onChange={e => handleSlug(e.target.value)} placeholder="e.g. competition-antitrust-law" className={`${inputCls} font-mono text-xs`} />
            </div>
            <div>
              <label className={labelCls}>Icon Name <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(Lucide icon)</span></label>
              <input value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="Briefcase, Scale, Shield, Heart…" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Display Order</label>
              <input type="number" value={form.order} onChange={e => set("order", e.target.value)} min={1} max={999} className={inputCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Short Description <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(shown on cards)</span></label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
                placeholder="One-sentence overview of the practice area…" className={textareaCls} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Full Details <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(shown on detail page — plain text or HTML)</span></label>
              <textarea value={form.details} onChange={e => set("details", e.target.value)} rows={16}
                placeholder="Detailed description of services, experience, and specific capabilities in this practice area…"
                className={`${textareaCls} leading-relaxed`} />
            </div>
          </div>
          {error && <p className="text-rose-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-border bg-background/30 flex items-center gap-2 shrink-0">
          <button onClick={save} disabled={saving}
            className="flex-1 h-10 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
            {isNew ? "Create Practice Area" : "Save Changes"}
          </button>
          <button onClick={onClose} className="h-10 px-5 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── First Admin Setup Banner ───────────────────────────────────────── */
function FirstAdminBanner({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const promote = async () => {
    setLoading(true); setError("");
    try { await apiFetch("/admin/setup", { method: "POST" }); onSuccess(); }
    catch (e: any) { setError(e.message ?? "Failed"); }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border border-primary/30 bg-primary/5 p-8 rounded-sm">
          <div className="h-0.5 w-16 bg-primary mb-6" />
          <div className="flex items-center gap-3 mb-4"><Shield className="h-5 w-5 text-primary" /><h2 className="font-serif text-xl font-bold">First-Time Admin Setup</h2></div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">No administrators exist yet. Since you're logged in, you can claim admin access now. Once you do, only existing admins can grant access to others.</p>
          {error && <p className="text-rose-400 text-sm mb-4 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
          <button onClick={promote} disabled={loading}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors rounded-sm flex items-center justify-center gap-2">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />} Claim Admin Access
          </button>
          <Link href="/"><button className="w-full mt-3 h-9 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">Back to Site</button></Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN ADMIN PAGE
═══════════════════════════════════════════════════════════════════════ */
export default function Admin() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const [, setLocation] = useLocation();

  /* ── Core state ── */
  const [adminState, setAdminState] = useState<"loading" | "firstSetup" | "ok">("loading");
  const [activeSection, setActiveSection] = useState<ActiveSection>("consultations");
  const [stats, setStats] = useState<Stats | null>(null);

  /* ── Consultations ── */
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [consultLoading, setConsultLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  /* ── Users ── */
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [togglingAdmin, setTogglingAdmin] = useState<number | null>(null);

  /* ── Blog ── */
  const [blogs, setBlogs] = useState<AdminBlogPost[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<AdminBlogPost> | null | false>(false);
  const [deletingBlog, setDeletingBlog] = useState<AdminBlogPost | null>(null);
  const [deletingBlogLoading, setDeletingBlogLoading] = useState(false);

  /* ── Practice Areas ── */
  const [areas, setAreas] = useState<AdminPracticeArea[]>([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [editingArea, setEditingArea] = useState<Partial<AdminPracticeArea> | null | false>(false);
  const [deletingArea, setDeletingArea] = useState<AdminPracticeArea | null>(null);
  const [deletingAreaLoading, setDeletingAreaLoading] = useState(false);

  /* ── Auth guard ── */
  useEffect(() => {
    if (userLoading) return;
    if (!user) { setLocation("/login"); return; }
    apiFetch("/admin/verify").then(() => setAdminState("ok")).catch(() => setAdminState("firstSetup"));
  }, [user, userLoading]);

  /* ── Load consultations ── */
  const loadConsultations = useCallback(async () => {
    if (adminState !== "ok") return;
    setConsultLoading(true);
    try {
      const [s, c] = await Promise.all([apiFetch("/admin/stats"), apiFetch(`/admin/consultations?status=${statusFilter}`)]);
      setStats(s); setConsultations(c);
    } catch { /* noop */ }
    setConsultLoading(false);
  }, [adminState, statusFilter]);

  /* ── Load users ── */
  const loadUsers = useCallback(async () => {
    if (adminState !== "ok") return;
    setUsersLoading(true);
    try { const u = await apiFetch("/admin/users"); setUsers(u); }
    catch { /* noop */ }
    setUsersLoading(false);
  }, [adminState]);

  /* ── Load blogs ── */
  const loadBlogs = useCallback(async () => {
    if (adminState !== "ok") return;
    setBlogsLoading(true);
    try { const b = await apiFetch("/admin/blog"); setBlogs(b); }
    catch { /* noop */ }
    setBlogsLoading(false);
  }, [adminState]);

  /* ── Load practice areas ── */
  const loadAreas = useCallback(async () => {
    if (adminState !== "ok") return;
    setAreasLoading(true);
    try { const a = await apiFetch("/admin/practice-areas"); setAreas(a); }
    catch { /* noop */ }
    setAreasLoading(false);
  }, [adminState]);

  /* ── Auto-load on section change ── */
  useEffect(() => {
    if (activeSection === "consultations") loadConsultations();
    else if (activeSection === "users") loadUsers();
    else if (activeSection === "blog") loadBlogs();
    else if (activeSection === "practice-areas") loadAreas();
  }, [activeSection, adminState]);

  useEffect(() => { if (activeSection === "consultations") loadConsultations(); }, [statusFilter]);

  /* ── Helpers ── */
  const updateConsultation = (updated: Consultation) => {
    setConsultations(prev => prev.map(c => c.id === updated.id ? updated : c));
    apiFetch("/admin/stats").then(setStats).catch(() => {});
  };

  const toggleAdmin = async (u: ClientUser) => {
    setTogglingAdmin(u.id);
    try {
      const updated = await apiFetch(`/admin/users/${u.id}`, { method: "PATCH", body: JSON.stringify({ isAdmin: !u.isAdmin }) });
      setUsers(prev => prev.map(x => x.id === updated.id ? { ...x, isAdmin: updated.isAdmin } : x));
    } catch { /* noop */ }
    setTogglingAdmin(null);
  };

  const deleteBlog = async () => {
    if (!deletingBlog) return;
    setDeletingBlogLoading(true);
    try { await apiFetch(`/admin/blog/${deletingBlog.id}`, { method: "DELETE" }); setBlogs(prev => prev.filter(b => b.id !== deletingBlog.id)); setDeletingBlog(null); }
    catch { /* noop */ }
    setDeletingBlogLoading(false);
  };

  const deleteArea = async () => {
    if (!deletingArea) return;
    setDeletingAreaLoading(true);
    try { await apiFetch(`/admin/practice-areas/${deletingArea.id}`, { method: "DELETE" }); setAreas(prev => prev.filter(a => a.id !== deletingArea.id)); setDeletingArea(null); }
    catch { /* noop */ }
    setDeletingAreaLoading(false);
  };

  const filteredConsultations = consultations.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.clientName.toLowerCase().includes(q) || c.clientEmail.toLowerCase().includes(q) || (c.practiceAreaTitle ?? "").toLowerCase().includes(q);
  });

  /* ── Loading / setup states ── */
  if (userLoading || adminState === "loading") {
    return <div className="min-h-screen bg-background flex items-center justify-center"><RefreshCw className="h-6 w-6 animate-spin text-primary" /></div>;
  }
  if (adminState === "firstSetup") {
    return <FirstAdminBanner onSuccess={() => setAdminState("ok")} />;
  }

  const SIDEBAR: { key: ActiveSection; icon: React.ElementType; label: string; badge?: number }[] = [
    { key: "consultations", icon: CalendarClock, label: "Consultations", badge: stats?.pending },
    { key: "users",         icon: Users,         label: "Clients",       badge: stats?.totalUsers },
    { key: "blog",          icon: FileText,       label: "Blog Posts",    badge: stats?.totalBlog },
    { key: "practice-areas", icon: BookOpen,      label: "Practice Areas", badge: stats?.totalAreas },
  ];

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "var(--app-font-sans, sans-serif)" }}>

      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img src={logoPath} alt="Nexus Axis" className="h-8 w-auto" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-xs font-bold tracking-[0.18em] text-foreground uppercase group-hover:text-primary transition-colors" style={{ fontFamily: "var(--app-font-serif, Georgia, serif)" }}>Nexus Axis</span>
              <span className="text-[8px] tracking-[0.32em] text-primary/70 uppercase mt-0.5">Consultants</span>
            </div>
          </Link>
          <div className="h-4 w-px bg-border mx-0.5" />
          <div className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /><span className="text-xs font-semibold tracking-[0.15em] uppercase text-primary">Admin</span></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
          <Link href="/portal"><button className="flex items-center gap-1.5 px-3 h-8 text-xs text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-colors rounded-sm"><ArrowUpRight className="h-3 w-3" /> Portal</button></Link>
          <button onClick={async () => { await apiFetch("/auth/logout", { method: "POST" }); setLocation("/login"); }}
            className="flex items-center gap-1.5 px-3 h-8 text-xs text-muted-foreground border border-border hover:border-rose-500/40 hover:text-rose-400 transition-colors rounded-sm">
            <LogOut className="h-3 w-3" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-e border-border bg-card flex-col hidden md:flex">
          <nav className="flex-1 py-4 px-3 space-y-0.5">
            <p className="px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground/50">Operations</p>
            {SIDEBAR.slice(0, 2).map(({ key, icon: Icon, label, badge }) => (
              <button key={key} onClick={() => setActiveSection(key)}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${activeSection === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <div className="flex items-center gap-2.5"><Icon className="h-4 w-4" />{label}</div>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${activeSection === key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{badge}</span>
                )}
              </button>
            ))}
            <div className="my-2 border-t border-border/40" />
            <p className="px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground/50">Content</p>
            {SIDEBAR.slice(2).map(({ key, icon: Icon, label, badge }) => (
              <button key={key} onClick={() => setActiveSection(key)}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors rounded-sm ${activeSection === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <div className="flex items-center gap-2.5"><Icon className="h-4 w-4" />{label}</div>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${activeSection === key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{badge}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-border space-y-0.5">
            <Link href="/"><button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm transition-colors"><LayoutDashboard className="h-4 w-4" /> View Site</button></Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-7 space-y-6">

            {/* ════ CONSULTATIONS ════ */}
            {activeSection === "consultations" && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <StatCard label="Total" value={stats?.totalConsultations ?? "—"} icon={CalendarClock} accent />
                  <StatCard label="Pending"   value={stats?.pending   ?? "—"} icon={Clock} />
                  <StatCard label="Confirmed" value={stats?.confirmed ?? "—"} icon={CheckCircle2} />
                  <StatCard label="Completed" value={stats?.completed ?? "—"} icon={TrendingUp} />
                  <StatCard label="Cancelled" value={stats?.cancelled ?? "—"} icon={XCircle} />
                </div>
                <div className="bg-card border border-border overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border/60">
                    <div>
                      <h2 className="text-base font-serif font-bold">All Consultations</h2>
                      {!consultLoading && <p className="text-xs text-muted-foreground mt-0.5">{filteredConsultations.length} result{filteredConsultations.length !== 1 ? "s" : ""}{statusFilter !== "all" ? ` — ${STATUS_CFG[statusFilter as Status]?.label ?? statusFilter}` : ""}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input type="text" placeholder="Search client…" value={search} onChange={e => setSearch(e.target.value)}
                          className="h-8 pl-8 pr-8 text-sm bg-background border border-border focus:outline-none focus:border-primary/50 rounded-sm w-44" />
                        {search && <button onClick={() => setSearch("")} className="absolute end-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {["all", ...ALL_STATUSES].map(s => (
                          <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-2.5 h-8 text-xs font-semibold capitalize transition-colors rounded-sm border ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                            {s === "all" ? "All" : STATUS_CFG[s as Status].label}
                          </button>
                        ))}
                      </div>
                      <button onClick={loadConsultations} className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">
                        <RefreshCw className={`h-3.5 w-3.5 ${consultLoading ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>
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
                        {consultLoading ? [...Array(5)].map((_, i) => (
                          <tr key={i} className="border-b border-border/40">{[...Array(7)].map((_, j) => <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>)}</tr>
                        )) : filteredConsultations.length === 0 ? (
                          <tr><td colSpan={7} className="px-4 py-20 text-center text-muted-foreground"><AlertCircle className="h-8 w-8 mx-auto mb-3 opacity-25" /><p className="text-sm">{search ? `No results for "${search}"` : "No consultations found."}</p>{statusFilter !== "all" && <button onClick={() => setStatusFilter("all")} className="text-xs text-primary hover:underline mt-2">Clear filter</button>}</td></tr>
                        ) : filteredConsultations.map(c => <ConsultationRow key={c.id} consultation={c} onUpdate={updateConsultation} />)}
                      </tbody>
                    </table>
                  </div>
                  {!consultLoading && filteredConsultations.length > 0 && (
                    <div className="px-5 py-3 border-t border-border/50 text-xs text-muted-foreground bg-background/30 flex items-center justify-between">
                      <span>Showing {filteredConsultations.length} of {consultations.length}</span>
                      {stats?.pending ? <span className="text-amber-400">{stats.pending} pending review</span> : null}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ════ CLIENTS ════ */}
            {activeSection === "users" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Registered Clients" value={stats?.totalUsers ?? "—"} icon={Users} accent />
                  <StatCard label="Admins" value={users.filter(u => u.isAdmin).length} icon={Shield} />
                </div>
                <div className="bg-card border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                    <div><h2 className="text-base font-serif font-bold">Registered Clients</h2><p className="text-xs text-muted-foreground mt-0.5">Manage access and roles</p></div>
                    <button onClick={loadUsers} className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">
                      <RefreshCw className={`h-3.5 w-3.5 ${usersLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[620px]">
                      <thead>
                        <tr className="border-b border-border/60 bg-background/30">
                          {["Name", "Email", "Phone", "Role", "Joined", "Actions"].map(h => <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {usersLoading ? [...Array(4)].map((_, i) => (
                          <tr key={i} className="border-b border-border/40">{[...Array(6)].map((_, j) => <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>)}</tr>
                        )) : users.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-16 text-center text-muted-foreground"><Users className="h-8 w-8 mx-auto mb-3 opacity-25" /><p className="text-sm">No registered clients yet.</p></td></tr>
                        ) : users.map(u => (
                          <tr key={u.id} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-3.5 font-medium text-foreground">{u.name}</td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs">{u.email}</td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs">{u.phone ?? <span className="italic opacity-40">—</span>}</td>
                            <td className="px-4 py-3.5">
                              {u.isAdmin ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/25 rounded-full"><Shield className="h-3 w-3" /> Admin</span>
                              ) : <span className="text-xs text-muted-foreground/50">Client</span>}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{format(new Date(u.createdAt), "d MMM yyyy")}</td>
                            <td className="px-4 py-3.5">
                              <button onClick={() => toggleAdmin(u)} disabled={togglingAdmin === u.id || (u.isAdmin && users.filter(x => x.isAdmin).length === 1)}
                                title={u.isAdmin && users.filter(x => x.isAdmin).length === 1 ? "Cannot remove the last admin" : ""}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs border transition-colors rounded-sm disabled:opacity-40 disabled:cursor-not-allowed ${u.isAdmin ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"}`}>
                                {togglingAdmin === u.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : u.isAdmin ? <><Lock className="h-3 w-3" /> Revoke Admin</> : <><Unlock className="h-3 w-3" /> Make Admin</>}
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

            {/* ════ BLOG POSTS ════ */}
            {activeSection === "blog" && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Total Posts" value={blogs.length || (stats?.totalBlog ?? "—")} icon={FileText} accent />
                  {BLOG_CATEGORIES.slice(0, 3).map(cat => (
                    <StatCard key={cat} label={cat} value={blogs.filter(b => b.category === cat).length} icon={FileText} />
                  ))}
                </div>
                <div className="bg-card border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                    <div><h2 className="text-base font-serif font-bold">Blog Posts</h2><p className="text-xs text-muted-foreground mt-0.5">{blogs.length} article{blogs.length !== 1 ? "s" : ""} published</p></div>
                    <div className="flex items-center gap-2">
                      <button onClick={loadBlogs} className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">
                        <RefreshCw className={`h-3.5 w-3.5 ${blogsLoading ? "animate-spin" : ""}`} />
                      </button>
                      <button onClick={() => setEditingBlog({})}
                        className="h-8 px-3 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors rounded-sm">
                        <Plus className="h-3.5 w-3.5" /> New Post
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border/60 bg-background/30">
                          {["Title", "Category", "Author", "Published", "Actions"].map(h => <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {blogsLoading ? [...Array(4)].map((_, i) => (
                          <tr key={i} className="border-b border-border/40">{[...Array(5)].map((_, j) => <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>)}</tr>
                        )) : blogs.length === 0 ? (
                          <tr><td colSpan={5} className="px-4 py-16 text-center text-muted-foreground"><FileText className="h-8 w-8 mx-auto mb-3 opacity-25" /><p className="text-sm">No blog posts yet.</p><button onClick={() => setEditingBlog({})} className="text-xs text-primary hover:underline mt-2">Create your first post</button></td></tr>
                        ) : blogs.map(b => (
                          <tr key={b.id} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="font-medium text-foreground max-w-xs truncate">{b.title}</div>
                              <div className="text-xs text-muted-foreground/60 font-mono mt-0.5 truncate max-w-xs">{b.slug}</div>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary/8 text-primary/80 border border-primary/15 rounded-full">{b.category}</span>
                            </td>
                            <td className="px-4 py-3.5 text-sm text-muted-foreground">{b.author}</td>
                            <td className="px-4 py-3.5 text-sm text-muted-foreground">{format(new Date(b.publishedAt), "d MMM yyyy")}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => setEditingBlog(b)}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors rounded-sm">
                                  <Pencil className="h-3 w-3" /> Edit
                                </button>
                                <button onClick={() => setDeletingBlog(b)}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border text-muted-foreground hover:border-rose-500/40 hover:text-rose-400 transition-colors rounded-sm">
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ════ PRACTICE AREAS ════ */}
            {activeSection === "practice-areas" && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard label="Total Areas" value={areas.length || (stats?.totalAreas ?? "—")} icon={BookOpen} accent />
                  <StatCard label="Litigation" value={areas.filter(a => ["commercial-litigation","international-arbitration","real-estate-law","criminal-defence-white-collar"].includes(a.slug)).length} icon={BookOpen} />
                  <StatCard label="Corporate" value={areas.filter(a => ["corporate-tax-advisory","business-setup-licensing","hr-labour-compliance","corporate-governance","banking-finance","mergers-acquisitions","regulatory-compliance","islamic-finance-sukuk","tax-disputes-fta-representation","restructuring-insolvency"].includes(a.slug)).length} icon={BookOpen} />
                  <StatCard label="Specialist" value={areas.filter(a => ["maritime-shipping-law","intellectual-property","data-protection-privacy","construction-infrastructure","family-personal-law","aviation-law","wills-estate-planning","competition-antitrust-law","fintech-digital-assets-crypto","healthcare-life-sciences-law"].includes(a.slug)).length} icon={BookOpen} />
                </div>
                <div className="bg-card border border-border overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                    <div><h2 className="text-base font-serif font-bold">Practice Areas</h2><p className="text-xs text-muted-foreground mt-0.5">{areas.length} area{areas.length !== 1 ? "s" : ""} active</p></div>
                    <div className="flex items-center gap-2">
                      <button onClick={loadAreas} className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors rounded-sm">
                        <RefreshCw className={`h-3.5 w-3.5 ${areasLoading ? "animate-spin" : ""}`} />
                      </button>
                      <button onClick={() => setEditingArea({})}
                        className="h-8 px-3 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors rounded-sm">
                        <Plus className="h-3.5 w-3.5" /> New Area
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b border-border/60 bg-background/30">
                          {["#", "Title", "Slug", "Icon", "Description", "Actions"].map(h => <th key={h} className="px-4 py-3 text-start text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {areasLoading ? [...Array(5)].map((_, i) => (
                          <tr key={i} className="border-b border-border/40">{[...Array(6)].map((_, j) => <td key={j} className="px-4 py-4"><Skeleton className="h-4 w-full" /></td>)}</tr>
                        )) : areas.length === 0 ? (
                          <tr><td colSpan={6} className="px-4 py-16 text-center text-muted-foreground"><BookOpen className="h-8 w-8 mx-auto mb-3 opacity-25" /><p className="text-sm">No practice areas yet.</p><button onClick={() => setEditingArea({})} className="text-xs text-primary hover:underline mt-2">Create your first area</button></td></tr>
                        ) : areas.map(a => (
                          <tr key={a.id} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-3.5 text-xs text-muted-foreground font-mono w-10">{a.order}</td>
                            <td className="px-4 py-3.5"><div className="font-medium text-foreground">{a.title}</div></td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground/70 font-mono max-w-[160px] truncate">{a.slug}</td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{a.icon}</td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground max-w-[240px] truncate">{a.description}</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => setEditingArea(a)}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors rounded-sm">
                                  <Pencil className="h-3 w-3" /> Edit
                                </button>
                                <button onClick={() => setDeletingArea(a)}
                                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs border border-border text-muted-foreground hover:border-rose-500/40 hover:text-rose-400 transition-colors rounded-sm">
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                              </div>
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

      {/* ── Editor Panels ── */}
      <AnimatePresence>
        {editingBlog !== false && (
          <BlogEditorPanel
            post={editingBlog}
            onClose={() => setEditingBlog(false)}
            onSaved={saved => {
              setBlogs(prev => {
                const idx = prev.findIndex(b => b.id === saved.id);
                return idx >= 0 ? prev.map(b => b.id === saved.id ? saved : b) : [saved, ...prev];
              });
              setEditingBlog(false);
              apiFetch("/admin/stats").then(setStats).catch(() => {});
            }}
          />
        )}
        {editingArea !== false && (
          <PracticeAreaEditorPanel
            area={editingArea}
            onClose={() => setEditingArea(false)}
            onSaved={saved => {
              setAreas(prev => {
                const idx = prev.findIndex(a => a.id === saved.id);
                const next = idx >= 0 ? prev.map(a => a.id === saved.id ? saved : a) : [...prev, saved];
                return next.sort((a, b) => a.order - b.order);
              });
              setEditingArea(false);
              apiFetch("/admin/stats").then(setStats).catch(() => {});
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirms ── */}
      <AnimatePresence>
        {deletingBlog && (
          <DeleteConfirm label={deletingBlog.title} loading={deletingBlogLoading} onConfirm={deleteBlog} onClose={() => setDeletingBlog(null)} />
        )}
        {deletingArea && (
          <DeleteConfirm label={deletingArea.title} loading={deletingAreaLoading} onConfirm={deleteArea} onClose={() => setDeletingArea(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
