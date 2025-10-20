/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import prisma from "../db/prisma";

export async function create(req: Request, res: Response) {
  try {
    const {
      numeroChamado,
      tecnico,
      equipamento,
      modelo,
      loja,
      setor,
      tombo,
      data,
      testesRealizados,
      diagnostico,
      estadoEquipamento, // "funcionando" | "nao_funcionando" | ""
      necessidade, // "substituido" | "enviar_conserto" | "descartado" | ""
    } = req.body ?? {};

    if (
      !numeroChamado ||
      !tecnico ||
      !equipamento ||
      !modelo ||
      !loja ||
      !setor ||
      !tombo ||
      !data
    ) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    const estadoEnum =
      estadoEquipamento === "funcionando"
        ? "FUNCIONANDO"
        : estadoEquipamento === "nao_funcionando"
        ? "NAO_FUNCIONANDO"
        : null;

    const necessidadeEnum =
      necessidade === "substituido"
        ? "SUBSTITUIDO"
        : necessidade === "enviar_conserto"
        ? "ENVIAR_CONSERTO"
        : necessidade === "descartado"
        ? "DESCARTADO"
        : null;

    const createdByUsername = (req as any).user?.username ?? undefined;

    const laudo = await prisma.infoLaudo.create({
      data: {
        numeroChamado: String(numeroChamado),
        tecnico: String(tecnico),
        equipamento: String(equipamento),
        modelo: String(modelo),
        loja: String(loja),
        setor: String(setor),
        tombo: String(tombo),
        data: String(data),
        testesRealizados: testesRealizados ? String(testesRealizados) : null,
        diagnostico: diagnostico ? String(diagnostico) : null,
        estadoEquipamento: estadoEnum as any,
        necessidade: necessidadeEnum as any,
        createdByUsername,
      },
    });
    return res.status(201).json(laudo);
  } catch (err) {
    console.error("Erro ao criar info_laudo:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const numeroChamado = String(
      (req.query.numeroChamado ?? "").toString()
    ).trim();
    const tecnico = String((req.query.tecnico ?? "").toString()).trim();
    const data = String((req.query.data ?? "").toString()).trim();
    const tombo = String((req.query.tombo ?? "").toString()).trim();

    const filters: any[] = [];
    if (numeroChamado)
      filters.push({ numeroChamado: { contains: numeroChamado } });
    if (tecnico) filters.push({ tecnico: { contains: tecnico } });
    if (data) filters.push({ data: { contains: data } }); // ex.: "12/10/2025" ou parte
    if (tombo) filters.push({ tombo: { contains: tombo } });

    const where = filters.length ? { AND: filters } : undefined;

    const laudos = await prisma.infoLaudo.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(laudos);
  } catch (err) {
    console.error("Erro ao listar info_laudos:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }
    await prisma.infoLaudo.delete({ where: { id } });
    return res.status(204).send();
  } catch (err: any) {
    if (err?.code === "P2025") {
      return res.status(404).json({ error: "Laudo não encontrado" });
    }
    console.error("Erro ao excluir info_laudo:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
