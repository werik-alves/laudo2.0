import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { createTicketFollowup, LaudoInfoForGlpi } from "../services/glpi";

const router = Router();

/**
 * POST /glpi/followup
 * Body: {
 *   numeroChamado: number | string,
 *   glpiPassword: string,
 *   laudo: LaudoInfoForGlpi
 * }
 * Usa o username do usuário autenticado (JWT) e a senha informada para abrir sessão no GLPI e registrar o acompanhamento.
 */
router.post("/followup", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user as { username: string };
    const numeroChamadoRaw = (req.body?.numeroChamado ?? "").toString();
    const glpiPassword = (req.body?.glpiPassword ?? "").toString();
    const laudo = (req.body?.laudo ?? {}) as LaudoInfoForGlpi;

    const tickets_id = Number(numeroChamadoRaw);
    if (!tickets_id || Number.isNaN(tickets_id)) {
      return res.status(400).json({ error: "numeroChamado inválido" });
    }
    if (!glpiPassword) {
      return res.status(400).json({ error: "glpiPassword é obrigatório" });
    }
    if (!user?.username) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const result = await createTicketFollowup(
      user.username,
      glpiPassword,
      tickets_id,
      laudo
    );

    return res
      .status(200)
      .json({ success: true, followupId: result.id, raw: result.raw });
  } catch (err: any) {
    console.error("Erro GLPI followup:", err);
    return res
      .status(500)
      .json({ error: err?.message || "Erro interno ao integrar com GLPI" });
  }
});

// Nova rota para relacionar dados e registrar follow-up com cabeçalho
router.post("/relacionar", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user as { username: string };
    const numeroChamadoRaw = (req.body?.numeroChamado ?? "").toString();
    const glpiPassword = (req.body?.glpiPassword ?? "").toString();
    const laudo = (req.body?.laudo ?? {}) as LaudoInfoForGlpi;
    const relacao = (req.body?.relacao ?? {}) as {
      titulo?: string;
      localizacao?: string;
      tecnicoAtribuido?: string;
      grupo?: string;
      categoria?: string;
      requerente?: string;
    };

    const tickets_id = Number(numeroChamadoRaw);
    if (!tickets_id || Number.isNaN(tickets_id)) {
      return res.status(400).json({ error: "numeroChamado inválido" });
    }
    if (!glpiPassword) {
      return res.status(400).json({ error: "glpiPassword é obrigatório" });
    }
    if (!user?.username) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { createTicketFollowupWithHeader } = await import("../services/glpi");
    const result = await createTicketFollowupWithHeader(
      user.username,
      glpiPassword,
      tickets_id,
      laudo,
      relacao
    );

    return res
      .status(200)
      .json({ success: true, followupId: result.id, raw: result.raw });
  } catch (err: any) {
    console.error("Erro GLPI relacionar:", err);
    return res
      .status(500)
      .json({ error: err?.message || "Erro interno ao integrar com GLPI" });
  }
});
// Nova rota: listar categorias diretamente do DB do GLPI
router.get("/lookup/categories-db", requireAuth, async (_req, res) => {
  try {
    const { listItilCategories } = await import("../services/glpiDb");
    const categorias = await listItilCategories();
    return res.status(200).json(categorias);
  } catch (err: any) {
    console.error("Erro ao listar categorias GLPI via DB:", err);
    return res
      .status(500)
      .json({ error: err?.message || "Erro interno ao consultar DB GLPI" });
  }
});

// Nova rota: listar localizações diretamente do DB do GLPI
router.get("/lookup/locations-db", requireAuth, async (_req, res) => {
  try {
    const { listLocations } = await import("../services/glpiDb");
    const locais = await listLocations();
    return res.status(200).json(locais);
  } catch (err: any) {
    console.error("Erro ao listar localizações GLPI via DB:", err);
    return res
      .status(500)
      .json({ error: err?.message || "Erro interno ao consultar DB GLPI" });
  }
});
export default router;
