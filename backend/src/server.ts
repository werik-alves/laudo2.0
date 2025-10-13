import "dotenv/config";
import express from "express";
import cors from "cors";
import { ldapAuthenticateAndGetFullName } from "./auth/ldap";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: true, // aceita qualquer origem
    methods: ["GET", "POST", "OPTIONS"],
  })
);
// Habilita parser JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// (Opcional) Responder preflight explicitamente
app.options("*", cors({ origin: true, methods: ["GET", "POST", "OPTIONS"] }));

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});
