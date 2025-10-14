import { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

export async function list(req: Request, res: Response) {
  try {
    const equipamentoId = req.query.equipamentoId
      ? Number(req.query.equipamentoId)
      : undefined;
    const where = equipamentoId ? { equipamentoId } : {};
    const modelos = await prisma.modelo.findMany({
      where,
      orderBy: { nome: "asc" },
    });
    return res.status(200).json(modelos);
  } catch (err) {
    console.error("Erro ao listar modelos:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { nome, equipamentoId } = req.body ?? {};
    const nomeTrim = String(nome || "").trim();
    const eqId = Number(equipamentoId);
    if (!nomeTrim || Number.isNaN(eqId)) {
      return res
        .status(400)
        .json({ error: "Nome e equipamentoId são obrigatórios" });
    }
    const modelo = await prisma.modelo.create({
      data: { nome: nomeTrim, equipamentoId: eqId },
    });
    return res.status(201).json(modelo);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ error: "Modelo já cadastrado para esse equipamento" });
    }
    console.error("Erro ao criar modelo:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}