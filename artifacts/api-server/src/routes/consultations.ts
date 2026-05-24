import { Router, type IRouter } from "express";
import { db, consultationsTable, practiceAreasTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateConsultationBody,
  GetConsultationParams,
  GetConsultationResponse,
  ListConsultationsResponse,
  UpdateConsultationBody,
  UpdateConsultationParams,
  UpdateConsultationResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const PRICES: Record<string, number> = {
  "30min": 500,
  "60min": 800,
  "90min": 1100,
};

router.get("/consultations", async (req, res): Promise<void> => {
  const userId = (req.session as Record<string, unknown>).userId as number | undefined;

  const rows = await db.select({
    consultation: consultationsTable,
    practiceAreaTitle: practiceAreasTable.title,
  })
    .from(consultationsTable)
    .leftJoin(practiceAreasTable, eq(consultationsTable.practiceAreaId, practiceAreasTable.id))
    .where(userId ? eq(consultationsTable.userId, userId) : undefined)
    .orderBy(desc(consultationsTable.createdAt));

  const result = rows.map(({ consultation, practiceAreaTitle }) => ({
    ...consultation,
    price: Number(consultation.price),
    scheduledAt: consultation.scheduledAt?.toISOString() ?? null,
    createdAt: consultation.createdAt.toISOString(),
    practiceAreaTitle: practiceAreaTitle ?? null,
  }));

  res.json(ListConsultationsResponse.parse(result));
});

router.post("/consultations", async (req, res): Promise<void> => {
  const parsed = CreateConsultationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = (req.session as Record<string, unknown>).userId as number | undefined;
  const { clientName, clientEmail, clientPhone, practiceAreaId, durationType, scheduledAt, notes } = parsed.data;

  const price = PRICES[durationType] ?? 500;

  const [consultation] = await db.insert(consultationsTable).values({
    clientName,
    clientEmail,
    clientPhone: clientPhone ?? null,
    practiceAreaId: practiceAreaId ?? null,
    durationType,
    price: price.toString(),
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    status: "pending",
    notes: notes ?? null,
    userId: userId ?? null,
  }).returning();

  let practiceAreaTitle: string | null = null;
  if (consultation.practiceAreaId) {
    const [area] = await db.select().from(practiceAreasTable).where(eq(practiceAreasTable.id, consultation.practiceAreaId));
    practiceAreaTitle = area?.title ?? null;
  }

  res.status(201).json(GetConsultationResponse.parse({
    ...consultation,
    price: Number(consultation.price),
    scheduledAt: consultation.scheduledAt?.toISOString() ?? null,
    createdAt: consultation.createdAt.toISOString(),
    practiceAreaTitle,
  }));
});

router.get("/consultations/:id", async (req, res): Promise<void> => {
  const params = GetConsultationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const rows = await db.select({
    consultation: consultationsTable,
    practiceAreaTitle: practiceAreasTable.title,
  })
    .from(consultationsTable)
    .leftJoin(practiceAreasTable, eq(consultationsTable.practiceAreaId, practiceAreasTable.id))
    .where(eq(consultationsTable.id, params.data.id));

  if (!rows.length) {
    res.status(404).json({ error: "Consultation not found" });
    return;
  }

  const { consultation, practiceAreaTitle } = rows[0];

  res.json(GetConsultationResponse.parse({
    ...consultation,
    price: Number(consultation.price),
    scheduledAt: consultation.scheduledAt?.toISOString() ?? null,
    createdAt: consultation.createdAt.toISOString(),
    practiceAreaTitle: practiceAreaTitle ?? null,
  }));
});

router.patch("/consultations/:id", async (req, res): Promise<void> => {
  const params = UpdateConsultationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateConsultationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.status) updateData.status = parsed.data.status;
  if (parsed.data.scheduledAt) updateData.scheduledAt = new Date(parsed.data.scheduledAt);
  if (parsed.data.notes != null) updateData.notes = parsed.data.notes;

  const [updated] = await db.update(consultationsTable)
    .set(updateData)
    .where(eq(consultationsTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Consultation not found" });
    return;
  }

  res.json(UpdateConsultationResponse.parse({
    ...updated,
    price: Number(updated.price),
    scheduledAt: updated.scheduledAt?.toISOString() ?? null,
    createdAt: updated.createdAt.toISOString(),
    practiceAreaTitle: null,
  }));
});

export default router;
