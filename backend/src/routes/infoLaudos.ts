import { Router } from "express";
import { create } from "../controllers/infoLaudoController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/", requireAuth, create);

export default router;
