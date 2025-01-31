"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarRelatoriosNaWeb = exports.gerarRelatorioFiltrado = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Função auxiliar para validar parâmetros
const validarParametros = (tipo, id) => {
    if (!tipo || (tipo !== "clientes" && tipo !== "empresas")) {
        throw new Error("O tipo deve ser 'clientes' ou 'empresas'.");
    }
    if (!id) {
        throw new Error("O parâmetro 'id' é obrigatório para filtrar o relatório.");
    }
};
// Função auxiliar para gerar o PDF
const gerarPDF = (tipo, id, entidade, dados, pdfPath) => {
    const doc = new pdfkit_1.default();
    doc.pipe(fs_1.default.createWriteStream(pdfPath));
    // Cabeçalho do relatório
    doc.fontSize(20).text(`Relatório de ${tipo} - ID: ${id}`, { align: "center" });
    doc.moveDown();
    // Informações do cliente ou empresa
    if (tipo === "clientes") {
        doc.fontSize(16).text(`Cliente: ${entidade.nomeCompleto}`);
        doc.text(`CPF: ${entidade.cpf}`);
    }
    else {
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
const gerarRelatorioFiltrado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo, id, dataInicio, dataFim } = req.query;
    try {
        // Validação de parâmetros
        validarParametros(tipo, id);
        const filtros = { status: "Em aberto" };
        if (dataInicio)
            filtros.dataVencimento = { gte: new Date(dataInicio) };
        if (dataFim)
            filtros.dataVencimento = { lte: new Date(dataFim) };
        const tipoId = Number(id);
        let dados = [];
        let entidade;
        // Busca de dados conforme o tipo
        if (tipo === "clientes") {
            entidade = yield prisma_1.default.cliente.findUnique({ where: { id: tipoId } });
            if (!entidade)
                throw new Error("Cliente não encontrado.");
            dados = yield prisma_1.default.anotacao.findMany({
                where: Object.assign(Object.assign({}, filtros), { clienteId: tipoId }),
                include: { cliente: true },
            });
        }
        else {
            entidade = yield prisma_1.default.empresa.findUnique({ where: { id: tipoId } });
            if (!entidade)
                throw new Error("Empresa não encontrada.");
            dados = yield prisma_1.default.anotacao.findMany({
                where: Object.assign(Object.assign({}, filtros), { empresaId: tipoId }),
                include: { empresa: true },
            });
        }
        if (dados.length === 0) {
            res.status(404).json({ message: "Nenhum registro encontrado para o filtro aplicado." });
            return;
        }
        // Caminho para o PDF
        const pdfPath = path_1.default.join(__dirname, `../../relatorio_${id}.pdf`);
        gerarPDF(tipo, tipoId, entidade, dados, pdfPath);
        setTimeout(() => {
            if (!fs_1.default.existsSync(pdfPath)) {
                res.status(500).json({ error: "Erro ao gerar PDF." });
                return;
            }
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=relatorio_${id}.pdf`);
            const stream = fs_1.default.createReadStream(pdfPath);
            stream.pipe(res);
            stream.on("error", (err) => {
                console.error("Erro ao enviar o PDF:", err);
                res.status(500).json({ error: "Erro ao enviar relatório." });
            });
            stream.on("close", () => fs_1.default.unlinkSync(pdfPath));
        }, 500);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.gerarRelatorioFiltrado = gerarRelatorioFiltrado;
const listarRelatoriosNaWeb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo, dataInicio, dataFim, page = 1, limit = 10 } = req.query;
    try {
        validarParametros(tipo, "dummy"); // Tipo apenas para validação básica
        const filtros = {};
        if (dataInicio)
            filtros.dataVencimento = { gte: new Date(dataInicio) };
        if (dataFim)
            filtros.dataVencimento = { lte: new Date(dataFim) };
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const offset = (pageNumber - 1) * limitNumber;
        const dados = yield prisma_1.default.anotacao.findMany({
            where: filtros,
            include: tipo === "clientes" ? { cliente: true } : { empresa: true },
            skip: offset,
            take: limitNumber,
        });
        const totalRegistros = yield prisma_1.default.anotacao.count({ where: filtros });
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
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
});
exports.listarRelatoriosNaWeb = listarRelatoriosNaWeb;
