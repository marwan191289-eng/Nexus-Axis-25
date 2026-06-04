import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, usersTable, consultationsTable, practiceAreasTable, blogPostsTable } from "@workspace/db";
import { eq, desc, count, asc } from "drizzle-orm";
import { sendConsultationConfirmedEmail } from "../lib/email";

const router: IRouter = Router();

/* ── Admin auth middleware ── */
async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = (req.session as Record<string, unknown>).userId as number | undefined;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user?.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

/* ── GET /admin/verify ── */
router.get("/admin/verify", requireAdmin, (_req, res) => {
  res.json({ isAdmin: true });
});

/* ── GET /admin/stats ── */
router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [total] = await db.select({ count: count() }).from(consultationsTable);
  const [pending] = await db.select({ count: count() }).from(consultationsTable).where(eq(consultationsTable.status, "pending"));
  const [confirmed] = await db.select({ count: count() }).from(consultationsTable).where(eq(consultationsTable.status, "confirmed"));
  const [completed] = await db.select({ count: count() }).from(consultationsTable).where(eq(consultationsTable.status, "completed"));
  const [cancelled] = await db.select({ count: count() }).from(consultationsTable).where(eq(consultationsTable.status, "cancelled"));
  const [totalUsers] = await db.select({ count: count() }).from(usersTable);
  const [totalBlog] = await db.select({ count: count() }).from(blogPostsTable);
  const [totalAreas] = await db.select({ count: count() }).from(practiceAreasTable);

  res.json({
    totalConsultations: Number(total?.count ?? 0),
    pending: Number(pending?.count ?? 0),
    confirmed: Number(confirmed?.count ?? 0),
    completed: Number(completed?.count ?? 0),
    cancelled: Number(cancelled?.count ?? 0),
    totalUsers: Number(totalUsers?.count ?? 0),
    totalBlog: Number(totalBlog?.count ?? 0),
    totalAreas: Number(totalAreas?.count ?? 0),
  });
});

/* ── GET /admin/consultations ── */
router.get("/admin/consultations", requireAdmin, async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };

  const rows = await db
    .select({ consultation: consultationsTable, practiceAreaTitle: practiceAreasTable.title })
    .from(consultationsTable)
    .leftJoin(practiceAreasTable, eq(consultationsTable.practiceAreaId, practiceAreasTable.id))
    .where(status && status !== "all" ? eq(consultationsTable.status, status as any) : undefined)
    .orderBy(desc(consultationsTable.createdAt));

  res.json(rows.map(({ consultation, practiceAreaTitle }) => ({
    ...consultation,
    price: Number(consultation.price),
    scheduledAt: consultation.scheduledAt?.toISOString() ?? null,
    createdAt: consultation.createdAt.toISOString(),
    practiceAreaTitle: practiceAreaTitle ?? null,
  })));
});

/* ── PATCH /admin/consultations/:id ── */
router.patch("/admin/consultations/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { status, scheduledAt, notes } = req.body as { status?: string; scheduledAt?: string | null; notes?: string | null };
  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
  if (notes !== undefined) updateData.notes = notes;

  const [prevRow] = await db.select({ status: consultationsTable.status }).from(consultationsTable).where(eq(consultationsTable.id, id));
  const [updated] = await db.update(consultationsTable).set(updateData).where(eq(consultationsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Consultation not found" }); return; }

  const [row] = await db
    .select({ consultation: consultationsTable, practiceAreaTitle: practiceAreasTable.title })
    .from(consultationsTable)
    .leftJoin(practiceAreasTable, eq(consultationsTable.practiceAreaId, practiceAreasTable.id))
    .where(eq(consultationsTable.id, id));

  if (row.consultation.status === "confirmed" && prevRow?.status !== "confirmed") {
    sendConsultationConfirmedEmail({
      clientName: row.consultation.clientName,
      clientEmail: row.consultation.clientEmail,
      scheduledAt: row.consultation.scheduledAt,
      durationType: row.consultation.durationType,
      practiceAreaTitle: row.practiceAreaTitle ?? null,
      price: Number(row.consultation.price),
      consultationId: row.consultation.id,
    }).catch(() => {});
  }

  res.json({
    ...row.consultation,
    price: Number(row.consultation.price),
    scheduledAt: row.consultation.scheduledAt?.toISOString() ?? null,
    createdAt: row.consultation.createdAt.toISOString(),
    practiceAreaTitle: row.practiceAreaTitle ?? null,
  });
});

/* ── GET /admin/users ── */
router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, phone: usersTable.phone, isAdmin: usersTable.isAdmin, createdAt: usersTable.createdAt })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));
  res.json(users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() })));
});

/* ── PATCH /admin/users/:id ── */
router.patch("/admin/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { isAdmin } = req.body as { isAdmin: boolean };
  if (typeof isAdmin !== "boolean") { res.status(400).json({ error: "isAdmin must be boolean" }); return; }
  const [updated] = await db.update(usersTable).set({ isAdmin }).where(eq(usersTable.id, id)).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, isAdmin: usersTable.isAdmin });
  if (!updated) { res.status(404).json({ error: "User not found" }); return; }
  res.json(updated);
});

/* ── POST /admin/setup ── */
router.post("/admin/setup", async (req, res): Promise<void> => {
  const userId = (req.session as Record<string, unknown>).userId as number | undefined;
  if (!userId) { res.status(401).json({ error: "Not authenticated" }); return; }
  const [adminCount] = await db.select({ count: count() }).from(usersTable).where(eq(usersTable.isAdmin, true));
  if (Number(adminCount?.count ?? 0) > 0) { res.status(403).json({ error: "An admin already exists." }); return; }
  const [updated] = await db.update(usersTable).set({ isAdmin: true }).where(eq(usersTable.id, userId)).returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email, isAdmin: usersTable.isAdmin });
  res.json({ ok: true, user: updated });
});

/* ════════════════════════════════════════════════════
   BLOG POSTS CRUD
════════════════════════════════════════════════════ */

/* ── GET /admin/blog ── */
router.get("/admin/blog", requireAdmin, async (_req, res): Promise<void> => {
  const posts = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.publishedAt));
  res.json(posts.map(p => ({ ...p, publishedAt: p.publishedAt.toISOString() })));
});

/* ── POST /admin/blog ── */
router.post("/admin/blog", requireAdmin, async (req, res): Promise<void> => {
  const { title, slug, excerpt, content, category, author, imageUrl, publishedAt } = req.body as Record<string, string>;
  if (!title?.trim() || !slug?.trim() || !content?.trim()) {
    res.status(400).json({ error: "title, slug and content are required" });
    return;
  }
  const [post] = await db.insert(blogPostsTable).values({
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt?.trim() ?? "",
    content: content.trim(),
    category: category?.trim() ?? "Corporate",
    author: author?.trim() ?? "Nexus Axis Editorial",
    imageUrl: imageUrl?.trim() || null,
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
  }).returning();
  res.status(201).json({ ...post, publishedAt: post.publishedAt.toISOString() });
});

/* ── PATCH /admin/blog/:id ── */
router.patch("/admin/blog/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, slug, excerpt, content, category, author, imageUrl, publishedAt } = req.body as Record<string, string | null>;
  const u: Record<string, unknown> = {};
  if (title !== undefined) u.title = title;
  if (slug !== undefined) u.slug = slug;
  if (excerpt !== undefined) u.excerpt = excerpt;
  if (content !== undefined) u.content = content;
  if (category !== undefined) u.category = category;
  if (author !== undefined) u.author = author;
  if (imageUrl !== undefined) u.imageUrl = imageUrl || null;
  if (publishedAt !== undefined) u.publishedAt = new Date(publishedAt as string);
  const [updated] = await db.update(blogPostsTable).set(u).where(eq(blogPostsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Post not found" }); return; }
  res.json({ ...updated, publishedAt: updated.publishedAt.toISOString() });
});

/* ── DELETE /admin/blog/:id ── */
router.delete("/admin/blog/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.json({ ok: true });
});

/* ════════════════════════════════════════════════════
   PRACTICE AREAS CRUD
════════════════════════════════════════════════════ */

/* ── GET /admin/practice-areas ── */
router.get("/admin/practice-areas", requireAdmin, async (_req, res): Promise<void> => {
  const areas = await db.select().from(practiceAreasTable).orderBy(asc(practiceAreasTable.order));
  res.json(areas);
});

/* ── POST /admin/practice-areas ── */
router.post("/admin/practice-areas", requireAdmin, async (req, res): Promise<void> => {
  const { title, slug, description, icon, details, order } = req.body as Record<string, string>;
  if (!title?.trim() || !slug?.trim()) {
    res.status(400).json({ error: "title and slug are required" });
    return;
  }
  const [area] = await db.insert(practiceAreasTable).values({
    title: title.trim(),
    slug: slug.trim(),
    description: description?.trim() ?? "",
    icon: icon?.trim() || "Briefcase",
    details: details?.trim() ?? "",
    order: Number(order ?? 99),
  }).returning();
  res.status(201).json(area);
});

/* ── PATCH /admin/practice-areas/:id ── */
router.patch("/admin/practice-areas/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, slug, description, icon, details, order } = req.body as Record<string, string>;
  const u: Record<string, unknown> = {};
  if (title !== undefined) u.title = title;
  if (slug !== undefined) u.slug = slug;
  if (description !== undefined) u.description = description;
  if (icon !== undefined) u.icon = icon || "Briefcase";
  if (details !== undefined) u.details = details;
  if (order !== undefined) u.order = Number(order);
  const [updated] = await db.update(practiceAreasTable).set(u).where(eq(practiceAreasTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Practice area not found" }); return; }
  res.json(updated);
});

/* ── DELETE /admin/practice-areas/:id ── */
router.delete("/admin/practice-areas/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(practiceAreasTable).where(eq(practiceAreasTable.id, id));
  res.json({ ok: true });
});

export default router;
