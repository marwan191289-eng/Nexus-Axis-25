import { Router, type IRouter } from "express";
import { db, practiceAreasTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  GetPracticeAreaParams,
  ListPracticeAreasResponse,
  GetPracticeAreaResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/practice-areas", async (_req, res): Promise<void> => {
  const areas = await db.select().from(practiceAreasTable).orderBy(asc(practiceAreasTable.order));
  res.json(ListPracticeAreasResponse.parse(areas));
});

router.get("/practice-areas/:id", async (req, res): Promise<void> => {
  const params = GetPracticeAreaParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [area] = await db.select().from(practiceAreasTable).where(eq(practiceAreasTable.id, params.data.id));
  if (!area) {
    res.status(404).json({ error: "Practice area not found" });
    return;
  }

  res.json(GetPracticeAreaResponse.parse(area));
});

export default router;
