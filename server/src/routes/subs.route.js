
import { Router } from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import {getPrices, createStripeSession, findSubscriptionByCustomerId} from '../controllers/subs.controller.js';

const router = Router();


router.get("/prices", verifyToken, getPrices);
router.post("/session", verifyToken, createStripeSession);
router.get('/getSubscription', verifyToken, findSubscriptionByCustomerId);

export default router;