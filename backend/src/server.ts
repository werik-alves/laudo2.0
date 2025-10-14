import "dotenv/config";
import express from "express";
import cors from "cors";
import { ldapAuthenticateAndGetFullName } from "./auth/ldap";
import jwt from "jsonwebtoken";
import { PrismaClient, Prisma } from "@prisma/client";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options("*", cors({ origin: true, methods: ["GET", "POST", "OPTIONS"] }));

const prisma = new PrismaClient();
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Credenciais não informadas" });
  }

  try {
    const result = await ldapAuthenticateAndGetFullName(
      String(username),
      String(password)
    );
    if (result.success) {
      // Se você já estiver emitindo JWT aqui, mantenha. Caso não, apenas devolva success + fullName
      return res.status(200).json({ success: true, fullName: result.fullName });
    }
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

// Listar lojas
app.get("/lojas", async (_req, res) => {
  try {
    const lojas = await prisma.loja.findMany({ orderBy: { nome: "asc" } });
    return res.status(200).json(lojas);
  } catch (err) {
    console.error("Erro ao listar lojas:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

// Criar loja
app.post("/lojas", async (req, res) => {
  try {
    const { nome } = req.body ?? {};
    const nomeTrim = String(nome || "").trim();
    if (!nomeTrim) {
      return res.status(400).json({ error: "Nome da loja é obrigatório" });
    }

    const loja = await prisma.loja.create({ data: { nome: nomeTrim } });
    return res.status(201).json(loja);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({ error: "Loja já cadastrada" });
    }
    console.error("Erro ao criar loja:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
