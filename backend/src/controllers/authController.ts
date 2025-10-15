import { Request, Response } from "express";
import { ldapAuthenticateAndGetFullName } from "../auth/ldap";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 8; // 8h

export async function login(req: Request, res: Response) {
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
      const token = jwt.sign(
        { username: String(username), fullName: result.fullName },
        JWT_SECRET,
        { expiresIn: TOKEN_MAX_AGE_SECONDS }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // em produção, defina como true com HTTPS
        maxAge: TOKEN_MAX_AGE_SECONDS * 1000,
        path: "/",
      });

      return res
        .status(200)
        .json({ success: true, fullName: result.fullName, token });
    }
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}

export async function me(req: Request, res: Response) {
  const bearer =
    typeof req.headers.authorization === "string" &&
    req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined;

  const token = req.cookies?.auth_token || bearer;
  if (!token) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      username: string;
      fullName?: string;
    };
    return res
      .status(200)
      .json({
        success: true,
        username: payload.username,
        fullName: payload.fullName,
      });
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  return res.status(204).send();
}
