import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "seu-segredo";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    (req as any).user = decoded; // Adiciona o payload do token no objeto `req`
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
