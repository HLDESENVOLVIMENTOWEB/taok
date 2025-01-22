import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Gerar relatório de clientes ou empresas que estão devendo, com filtro por data
export const gerarRelatorio = async (req: Request, res: Response): Promise<void> => {
  const { tipo, dataInicio, dataFim } = req.query;

  if (!tipo || (tipo !== "clientes" && tipo !== "empresas")) {
    res.status(400).json({ error: "O tipo deve ser 'clientes' ou 'empresas'." });
    return;
  }

  try {
    const filtros: any = {};
    if (dataInicio) filtros.dataVencimento = { gte: new Date(dataInicio as string) };
    if (dataFim) filtros.dataVencimento = { lte: new Date(dataFim as string) };

    let dados: any[] = [];
    if (tipo === "clientes") {
      dados = await prisma.anotacao.findMany({
        where: { ...filtros, status: "Em aberto" },
        include: { cliente: true },
      });
    } else if (tipo === "empresas") {
      dados = await prisma.anotacao.findMany({
        where: { ...filtros, status: "Em aberto" },
        include: { empresa: true },
      });
    }

    if (dados.length === 0) {
      res.status(404).json({ message: "Nenhum registro encontrado para o filtro aplicado." });
      return;
    }

    const pdfPath = path.join(__dirname, "../../relatorio.pdf");
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text(`Relatório de ${tipo}`, { align: "center" });
    doc.moveDown();

    dados.forEach((item, index) => {
      if (tipo === "clientes") {
        doc.fontSize(14).text(`${index + 1}. Cliente: ${item.cliente.nomeCompleto}`);
        doc.text(`CPF: ${item.cliente.cpf}`);
      } else {
        doc.fontSize(14).text(`${index + 1}. Empresa: ${item.empresa.razaoSocial}`);
        doc.text(`CNPJ: ${item.empresa.cnpj}`);
      }
      doc.text(`Produto/Serviço: ${item.produtoServico}`);
      doc.text(`Quantidade: ${item.quantidade}`);
      doc.text(`Valor Total: R$ ${item.valorTotal.toFixed(2)}`);
      doc.text(`Data de Vencimento: ${new Date(item.dataVencimento).toLocaleDateString()}`);
      doc.text("------------------------------------------------------");
      doc.moveDown();
    });

    doc.end();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");
    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);

    stream.on("end", () => {
      fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar relatório." });
  }
};

// Listar relatórios na web
export const listarRelatoriosNaWeb = async (req: Request, res: Response): Promise<void> => {
  const { tipo, dataInicio, dataFim } = req.query;

  if (!tipo || (tipo !== "clientes" && tipo !== "empresas")) {
    res.status(400).json({ error: "O tipo deve ser 'clientes' ou 'empresas'." });
    return;
  }

  try {
    const filtros: any = {};
    if (dataInicio) filtros.dataVencimento = { gte: new Date(dataInicio as string) };
    if (dataFim) filtros.dataVencimento = { lte: new Date(dataFim as string) };

    let dados: any[] = [];
    if (tipo === "clientes") {
      dados = await prisma.anotacao.findMany({
        where: { ...filtros, status: "Em aberto" },
        include: { cliente: true },
      });
    } else if (tipo === "empresas") {
      dados = await prisma.anotacao.findMany({
        where: { ...filtros, status: "Em aberto" },
        include: { empresa: true },
      });
    }

    if (dados.length === 0) {
      res.status(404).json({ message: "Nenhum registro encontrado para o filtro aplicado." });
      return;
    }

    res.status(200).json(dados);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar relatórios." });
  }
};
