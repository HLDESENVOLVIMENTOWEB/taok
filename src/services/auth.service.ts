import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "seu-segredo";

export const generateToken = (id: number, role: string): string => {
  return jwt.sign({ id, role }, SECRET, { expiresIn: "1d" });
};
