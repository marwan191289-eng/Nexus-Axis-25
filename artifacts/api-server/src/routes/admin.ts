import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, usersTable, consultationsTable, practiceAreasTable } from "@workspace/db";
import { eq, desc, count, and } from "drizzle-orm";
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

/* ── GET /admin/verify  — check if current session user is admin ── */
router.get("/admin/verify", requireAdmin, (_req, res) => {
  res.json({ isAdmin: true });
});

/* ── GET /admin/stats — dashboard overview numbers ── */
router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [total] = await db.select({ count: count() }).from(consultationsTable);
  const [pending] = await db.select({ count: count() }).from(consultationsTable)
    .where(eq(consultationsTable.status, "pending"));
  const [confirmed] = await db.select({ count: count() }).from(consultationsTable)
    .where(eq(consultationsTable.status, "confirmed"));
  const [completed] = await db.select({ count: count() }).from(consultationsTable)
    .where(eq(consultationsTable.status, "completed"));
  const [cancelled] = await db.select({ count: count() }).from(consultationsTable)
    .where(eq(consultationsTable.status, "cancelled"));
  const [totalUsers] = await db.select({ count: count() }).from(usersTable);

  res.json({
    totalConsultations: Number(total?.count ?? 0),
    pending: Number(pending?.count ?? 0),
    confirmed: Number(confirmed?.count ?? 0),
    completed: Number(completed?.count ?? 0),
    cancelled: Number(cancelled?.count ?? 0),
    totalUsers: Number(totalUsers?.count ?? 0),
  });
});

/* ── GET /admin/consultations — all consultations with client info ── */
router.get("/admin/consultations", requireAdmin, async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };

  const rows = await db
    .select({
      consultation: consultationsTable,
      practiceAreaTitle: practiceAreasTable.title,
    })
    .from(consultationsTable)
    .leftJoin(practiceAreasTable, eq(consultationsTable.practiceAreaId, practiceAreasTable.id))
    .where(status && status !== "all" ? eq(consultationsTable.status, status as any) : undefined)
    .orderBy(desc(consultationsTable.createdAt));

  const result = rows.map(({ consultation, practiceAreaTitle }) => ({
    ...consultation,
    price: Number(consultation.price),
    scheduledAt: consultation.scheduledAt?.toISOString() ?? null,
    createdAt: consultation.createdAt.toISOString(),
    practiceAreaTitle: practiceAreaTitle ?? null,
  }));

  res.json(result);
});

/* ── PATCH /admin/consultations/:id — update status / scheduledAt / notes ── */
router.patch("/admin/consultations/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { status, scheduledAt, notes } = req.body as {
    status?: string;
    scheduledAt?: string | null;
    notes?: string | null;
  };

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
  if (notes !== undefined) updateData.notes = notes;

  const [prevRow] = await db
    .select({ status: consultationsTable.status })
    .from(consultationsTable)
    .where(eq(consultationsTable.id, id));

  const [updated] = await db
    .update(consultationsTable)
    .set(updateData)
    .where(eq(consultationsTable.id, id))
    .returning();

  if (!updated) { res.status(404).json({ error: "Consultation not found" }); return; }

  // Re-fetch with practice area
  const [row] = await db
    .select({ consultation: consultationsTable, practiceAreaTitle: practiceAreasTable.title })
    .from(consultationsTable)
    .leftJoin(practiceAreasTable, eq(consultationsTable.practiceAreaId, practiceAreasTable.id))
    .where(eq(consultationsTable.id, id));

  // Send confirmation email when status transitions to "confirmed"
  const prevStatus = prevRow?.status;
  const newStatus = row.consultation.status;
  if (newStatus === "confirmed" && prevStatus !== "confirmed") {
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

/* ── GET /admin/users — list all registered clients ── */
router.get("/admin/users", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db
    .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email, phone: usersTable.phone, isAdmin: usersTable.isAdmin, createdAt: usersTable.createdAt })
    .from(usersTable)
    .orderBy(desc(usersTable.createdAt));

  res.json(users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() })));
});

export default router;
