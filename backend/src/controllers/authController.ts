import { Request, Response } from "express";
import { ldapAuthenticateAndGetFullName } from "../auth/ldap";

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
      return res.status(200).json({ success: true, fullName: result.fullName });
    }
    return res.status(401).json({ error: "Usuário ou senha inválidos" });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro interno" });
  }
}
