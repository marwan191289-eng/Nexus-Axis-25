import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import practiceAreasRouter from "./practiceAreas";
import consultationsRouter from "./consultations";
import blogRouter from "./blog";
import contactRouter from "./contact";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(practiceAreasRouter);
router.use(consultationsRouter);
router.use(blogRouter);
router.use(contactRouter);
router.use(statsRouter);

export default router;
