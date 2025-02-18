import { Request, Response } from "express";
import prisma from "../prisma/prisma"; // Certifique-se de que o Prisma está configurado corretamente

// Obter todos os clientes
export const getClientes = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.query; // Valores padrão: página 1, 10 registros por página

  try {
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    // Calcula o total de clientes
    const totalClientes = await prisma.cliente.count();

    // Busca os clientes com base na página e no limite
    const clientes = await prisma.cliente.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    // Retorna os resultados com informações de paginação
    res.status(200).json({
      clientes,
      pagination: {
        total: totalClientes,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalClientes / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
};

// Obter um cliente por ID
export const getClienteById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
    });

    if (!cliente) {
      res.status(404).json({ error: "Cliente não encontrado" });
      return;
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
};

// Criar um novo cliente
export const createCliente = async (req: Request, res: Response): Promise<void> => {
  const {
    nomeCompleto,
    cpf,
    dataNascimento,
    nomeMae,
    email,
    telefone,
    cep,
    observacoes,
  } = req.body;

  try {
    const novoCliente = await prisma.cliente.create({
      data: {
        nomeCompleto,
        cpf,
        dataNascimento: new Date(dataNascimento),
        nomeMae,
        email,
        telefone,
        cep,
        observacoes,
      },
    });

    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar cliente" });
  }
};

// Atualizar um cliente por ID
export const updateCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  try {
    const clienteAtualizado = await prisma.cliente.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(clienteAtualizado);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar cliente" });
  }
};

// Deletar um cliente por ID
export const deleteCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.cliente.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar cliente" });
  }
};
