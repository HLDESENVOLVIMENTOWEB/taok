import { Request, Response } from "express";
import prisma from "../prisma/prisma"; // Certifique-se de que o prisma está importado corretamente


export const getEmpresas = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.query; // Valores padrão: página 1, 10 registros por página

  try {
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    // Calcula o total de empresas
    const totalEmpresas = await prisma.empresa.count();

    // Busca as empresas com base na página e no limite
    const empresas = await prisma.empresa.findMany({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        nomeFantasia: true,
        email: true,
        telefone: true,
        cnpj: true,
        endereco: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Formata a resposta no padrão solicitado
    const data = empresas.map((empresa) => ({
      id: empresa.id,
      nomeEmpresa: empresa.nomeFantasia,
      email: empresa.email,
      telefone: empresa.telefone,
      cnpj: empresa.cnpj,
      endereco: empresa.endereco,
      createdAt: empresa.createdAt,
      updatedAt: empresa.updatedAt,
    }));

    // Retorna os resultados com informações adicionais sobre a paginação
    res.status(200).json({
      data,
      meta: {
        total: totalEmpresas,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalEmpresas / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar empresas" });
  }
};



// Obter uma empresa por ID
export const getEmpresaById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: Number(id) },
    });

    if (!empresa) {
      res.status(404).json({ error: "Empresa não encontrada" });
      return;
    }

    res.status(200).json(empresa);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar empresa" });
  }
};

// Criar uma nova empresa
export const createEmpresa = async (req: Request, res: Response): Promise<void> => {
  const {
    cnpj,
    razaoSocial,
    nomeFantasia,
    cep,
    endereco,
    bairro,
    cidade,
    estado,
    email,
    telefone,
    inscricaoEstadual,
    inscricaoMunicipal,
    responsavel,
    observacoes,
  } = req.body;

  try {
    const novaEmpresa = await prisma.empresa.create({
      data: {
        cnpj,
        razaoSocial,
        nomeFantasia,
        cep,
        endereco,
        bairro,
        cidade,
        estado,
        email,
        telefone,
        inscricaoEstadual,
        inscricaoMunicipal,
        responsavel,
        observacoes,
      },
    });

    res.status(201).json(novaEmpresa);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar empresa" });
  }
};

// Atualizar uma empresa por ID
export const updateEmpresa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body;

  try {
    const empresaAtualizada = await prisma.empresa.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(empresaAtualizada);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar empresa" });
  }
};

// Deletar uma empresa por ID
export const deleteEmpresa = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.empresa.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: "Erro ao deletar empresa" });
  }
};
