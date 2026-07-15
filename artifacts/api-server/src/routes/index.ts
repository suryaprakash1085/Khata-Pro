import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import businessesRouter from "./businesses";
import customersRouter from "./customers";
import transactionsRouter from "./transactions";
import reportsRouter from "./reports";
import remindersRouter from "./reminders";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(businessesRouter);
router.use(customersRouter);
router.use(transactionsRouter);
router.use(reportsRouter);
router.use(remindersRouter);
router.use(adminRouter);

export default router;
