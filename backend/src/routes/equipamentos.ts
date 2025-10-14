import { Router } from "express";
import * as equipamentoController from "../controllers/equipamentoController";

const router = Router();

router.get("/", equipamentoController.list);
router.post("/", equipamentoController.create);

export default router;
