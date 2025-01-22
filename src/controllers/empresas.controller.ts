import { Request, Response } from "express";
import prisma from "../prisma/prisma"; // Certifique-se de que o prisma está importado corretamente

// Obter todas as empresas
export const getEmpresas = async (req: Request, res: Response): Promise<void> => {
  try {
    const empresas = await prisma.empresa.findMany();
    res.status(200).json(empresas);
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
