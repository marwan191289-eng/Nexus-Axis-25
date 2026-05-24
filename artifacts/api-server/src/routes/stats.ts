import { Router, type IRouter } from "express";
import { db, consultationsTable, practiceAreasTable } from "@workspace/db";
import { count, eq } from "drizzle-orm";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [{ consultationsBooked }] = await db.select({ consultationsBooked: count() }).from(consultationsTable);
  const [{ pendingConsultations }] = await db.select({ pendingConsultations: count() }).from(consultationsTable).where(eq(consultationsTable.status, "pending"));
  const [{ practiceAreas }] = await db.select({ practiceAreas: count() }).from(practiceAreasTable);

  res.json(GetStatsResponse.parse({
    yearsEstablished: new Date().getFullYear() - 2009,
    clientsServed: 1200,
    casesWon: 890,
    practiceAreas: Number(practiceAreas),
    consultationsBooked: Number(consultationsBooked),
    pendingConsultations: Number(pendingConsultations),
  }));
});

export default router;
