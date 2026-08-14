import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import businessesRouter from "./businesses";
import customersRouter from "./customers";
import transactionsRouter from "./transactions";
import reportsRouter from "./reports";
import remindersRouter from "./reminders";
import adminRouter from "./admin";
import productsRouter from "./products";
import vendorsRouter from "./vendors";
import purchasesRouter from "./purchases";
import driversRouter from "./drivers";
import deliveriesRouter from "./deliveries";
import expensesRouter from "./expenses";
import salesOrdersRouter from "./sales-orders";
import returnsRouter from './returns';
import paymentsRouter from "./paymentsRoutes";
import customerAuthRouter from "./customer-auth";

import app from "../app";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(businessesRouter);
router.use(customersRouter);
router.use(transactionsRouter);
router.use(reportsRouter);
router.use(remindersRouter);
router.use(adminRouter);
router.use(productsRouter);
router.use(vendorsRouter);
router.use(purchasesRouter);
router.use(driversRouter);
router.use(deliveriesRouter);
router.use(expensesRouter);
router.use(salesOrdersRouter);
router.use(returnsRouter);
router.use(paymentsRouter);
router.use(customerAuthRouter);

export default router;
