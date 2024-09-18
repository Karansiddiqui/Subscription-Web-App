
import { Router } from "express";
import { verifyToken } from "../middleware/verifyUser.js";
import getArticle from "../controllers/article.controller.js";

const router = Router();


router.get("/", verifyToken, getArticle);


export default router;