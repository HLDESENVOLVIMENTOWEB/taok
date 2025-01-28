import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Função auxiliar para validar parâmetros
const validarParametros = (tipo: string | undefined, id: string | undefined) => {
  if (!tipo || (tipo !== "clientes" && tipo !== "empresas")) {
    throw new Error("O tipo deve ser 'clientes' ou 'empresas'.");
  }

  if (!id) {
    throw new Error("O parâmetro 'id' é obrigatório para filtrar o relatório.");
  }
};

// Função auxiliar para gerar o PDF
const gerarPDF = (
  tipo: string,
  id: number,
  entidade: any,
  dados: any[],
  pdfPath: string
) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));

  // Cabeçalho do relatório
  doc.fontSize(20).text(`Relatório de ${tipo} - ID: ${id}`, { align: "center" });
  doc.moveDown();

  // Informações do cliente ou empresa
  if (tipo === "clientes") {
    doc.fontSize(16).text(`Cliente: ${entidade.nomeCompleto}`);
    doc.text(`CPF: ${entidade.cpf}`);
  } else {
    doc.fontSize(16).text(`Empresa: ${entidade.razaoSocial}`);
    doc.text(`CNPJ: ${entidade.cnpj}`);
  }
  doc.moveDown();

  // Dados do relatório
  dados.forEach((item, index) => {
    doc.fontSize(14).text(`${index + 1}. Produto/Serviço: ${item.produtoServico}`);
    doc.text(`Quantidade: ${item.quantidade}`);
    doc.text(`Valor Total: R$ ${item.valorTotal.toFixed(2)}`);
    doc.text(`Data de Vencimento: ${new Date(item.dataVencimento).toLocaleDateString()}`);
    doc.text("------------------------------------------------------");
    doc.moveDown();
  });

  doc.end();
};

export const gerarRelatorioFiltrado = async (req: Request, res: Response): Promise<void> => {
  const { tipo, id, dataInicio, dataFim } = req.query;

  try {
    // Validação de parâmetros
    validarParametros(tipo as string, id as string);

    const filtros: any = { status: "Em aberto" };
    if (dataInicio) filtros.dataVencimento = { gte: new Date(dataInicio as string) };
    if (dataFim) filtros.dataVencimento = { lte: new Date(dataFim as string) };

    const tipoId = Number(id);
    let dados: any[] = [];
    let entidade: any;

    // Busca de dados conforme o tipo
    if (tipo === "clientes") {
      entidade = await prisma.cliente.findUnique({ where: { id: tipoId } });
      if (!entidade) throw new Error("Cliente não encontrado.");

      dados = await prisma.anotacao.findMany({
        where: { ...filtros, clienteId: tipoId },
        include: { cliente: true },
      });
    } else {
      entidade = await prisma.empresa.findUnique({ where: { id: tipoId } });
      if (!entidade) throw new Error("Empresa não encontrada.");

      dados = await prisma.anotacao.findMany({
        where: { ...filtros, empresaId: tipoId },
        include: { empresa: true },
      });
    }

    if (dados.length === 0) {
      res.status(404).json({ message: "Nenhum registro encontrado para o filtro aplicado." });
      return;
    }

    // Caminho para o PDF
    const pdfPath = path.join(__dirname, `../../relatorio_${id}.pdf`);
    gerarPDF(tipo as string, tipoId, entidade, dados, pdfPath);

    setTimeout(() => {
      if (!fs.existsSync(pdfPath)) {
        res.status(500).json({ error: "Erro ao gerar PDF." });
        return;
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=relatorio_${id}.pdf`);

      const stream = fs.createReadStream(pdfPath);
      stream.pipe(res);

      stream.on("error", (err) => {
        console.error("Erro ao enviar o PDF:", err);
        res.status(500).json({ error: "Erro ao enviar relatório." });
      });

      stream.on("close", () => fs.unlinkSync(pdfPath));
    }, 500);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const listarRelatoriosNaWeb = async (req: Request, res: Response): Promise<void> => {
  const { tipo, dataInicio, dataFim, page = 1, limit = 10 } = req.query;

  try {
    validarParametros(tipo as string, "dummy"); // Tipo apenas para validação básica

    const filtros: any = {};
    if (dataInicio) filtros.dataVencimento = { gte: new Date(dataInicio as string) };
    if (dataFim) filtros.dataVencimento = { lte: new Date(dataFim as string) };

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const offset = (pageNumber - 1) * limitNumber;

    const dados = await prisma.anotacao.findMany({
      where: filtros,
      include: tipo === "clientes" ? { cliente: true } : { empresa: true },
      skip: offset,
      take: limitNumber,
    });

    const totalRegistros = await prisma.anotacao.count({ where: filtros });
    const totalPaginas = Math.ceil(totalRegistros / limitNumber);

    if (dados.length === 0) {
      res.status(404).json({ message: "Nenhum registro encontrado para o filtro aplicado." });
      return;
    }

    res.status(200).json({
      data: dados,
      meta: {
        totalRegistros,
        totalPaginas,
        paginaAtual: pageNumber,
        limite: limitNumber,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
