import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import { hashPassword, comparePassword } from "../services/bcrypt.service";
import { generateToken } from "../services/auth.service";

// Obter todos os usuários
export const getUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

// Obter um usuário por ID
export const getUsuarioById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });

    if (!usuario) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

// Criar um novo usuário
export const createUsuario = async (req: Request, res: Response): Promise<void> => {
  const { nomeUsuario, email, senha, role } = req.body;

  try {
    const hashedPassword = await hashPassword(senha);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nomeUsuario,
        email,
        senha: hashedPassword,
        role: role || "User",
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
};

// Atualizar um usuário por ID
export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { senha, ...resto } = req.body;

  try {
    const data = senha
      ? { ...resto, senha: await hashPassword(senha) }
      : resto;

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar usuário" });
  }
};

// Deletar um usuário por ID
export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar usuário" });
  }
};

// Login de usuário
export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

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
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login" });
  }
};
