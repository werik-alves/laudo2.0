/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.auth_token;
  if (!token) return res.status(401).json({ error: "Unauthenticated" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      username: string;
      fullName?: string;
      isAdmin?: boolean;
    };
    (req as any).user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
