import { Request, Response } from "express";
import prisma from "../db/prisma";
import { Prisma } from "@prisma/client";

export async function list(_req: Request, res: Response) {
  try {
    const equipamentos = await prisma.equipamento.findMany({
      orderBy: { nome: "asc" },
    });
    return res.status(200).json(equipamentos);
  } catch (err) {
    console.error("Erro ao listar equipamentos:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { nome } = req.body ?? {};
    const nomeTrim = String(nome || "").trim();
    if (!nomeTrim) {
      return res
        .status(400)
        .json({ error: "Nome do equipamento é obrigatório" });
    }
    const equipamento = await prisma.equipamento.create({
      data: { nome: nomeTrim },
    });
    return res.status(201).json(equipamento);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({ error: "Equipamento já cadastrado" });
    }
    console.error("Erro ao criar equipamento:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}