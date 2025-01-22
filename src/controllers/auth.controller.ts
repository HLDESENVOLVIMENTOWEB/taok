import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import { hashPassword, comparePassword } from "../services/bcrypt.service";
import { generateToken } from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { nomeUsuario, email, senha } = req.body;

  const hashedPassword = await hashPassword(senha);

  try {
    const usuario = await prisma.usuario.create({
      data: { nomeUsuario, email, senha: hashedPassword },
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao registrar usuário" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    res.status(404).json({ error: "Usuário não encontrado" });
    return;
  }

  const isPasswordValid = await comparePassword(senha, usuario.senha);
  if (!isPasswordValid) {
    res.status(401).json({ error: "Senha incorreta" });
    return;
  }

  const token = generateToken(usuario.id, usuario.role);
  res.json({ token });
};
