import { Request, Response } from "express";
import prisma from "../prisma/prisma";

// Obter todas as anotações
export const getAnotacoes = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.query; // Valores padrão: página 1, 10 registros por página

  try {
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    // Calcula o total de anotações
    const totalAnotacoes = await prisma.anotacao.count();

    // Busca as anotações com base na página e no limite
    const anotacoes = await prisma.anotacao.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      include: {
        cliente: true,
        empresa: true,
      },
    });

    // Retorna os resultados com informações de paginação
    res.status(200).json({
      data: anotacoes,
      pagination: {
        total: totalAnotacoes,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalAnotacoes / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar anotações" });
  }
};


// Obter uma anotação por ID
export const getAnotacaoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const anotacao = await prisma.anotacao.findUnique({
      where: { id: Number(id) },
      include: {
        cliente: true,
        empresa: true,
      },
    });

    if (!anotacao) {
      res.status(404).json({ error: "Anotação não encontrada" });
      return;
    }

    res.status(200).json(anotacao);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar anotação" });
  }
};

// Criar uma nova anotação
export const createAnotacao = async (req: Request, res: Response): Promise<void> => {
  const {
    clienteId,
    empresaId,
    produtoServico,
    quantidade,
    valorTotal,
    dataVencimento,
    status,
  } = req.body;

  try {
    const novaAnotacao = await prisma.anotacao.create({
      data: {
        clienteId,
        empresaId,
        produtoServico,
        quantidade,
        valorTotal,
        dataVencimento: new Date(dataVencimento),
        status,
      },
    });

    res.status(201).json(novaAnotacao);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar anotação" });
  }
};

// Atualizar uma anotação por ID
export const updateAnotacao = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  try {
    const anotacaoAtualizada = await prisma.anotacao.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(anotacaoAtualizada);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar anotação" });
  }
};

// Deletar uma anotação por ID
export const deleteAnotacao = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.anotacao.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar anotação" });
  }
};
