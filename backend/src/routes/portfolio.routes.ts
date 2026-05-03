import { Router } from "express";
import { getPortfolio, updatePortfolio } from "../controllers/portfolio.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getPortfolio);
router.put("/", requireAuth, updatePortfolio);

export default router;
