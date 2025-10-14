import { Router } from "express";
import * as modeloController from "../controllers/modeloController";

const router = Router();

router.get("/", modeloController.list);
router.post("/", modeloController.create);

export default router;
