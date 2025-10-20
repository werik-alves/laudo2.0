import { Router } from "express";
import { create, list } from "../controllers/infoLaudoController";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", requireAdmin, list);
router.post("/", requireAuth, create);

export default router;
