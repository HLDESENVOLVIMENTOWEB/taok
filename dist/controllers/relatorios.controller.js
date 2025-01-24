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
exports.listarRelatoriosNaWeb = exports.gerarRelatorio = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Gerar relatório de clientes ou empresas que estão devendo, com filtro por data
const gerarRelatorio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo, dataInicio, dataFim } = req.query;
    if (!tipo || (tipo !== "clientes" && tipo !== "empresas")) {
        res.status(400).json({ error: "O tipo deve ser 'clientes' ou 'empresas'." });
        return;
    }
    try {
        const filtros = {};
        if (dataInicio)
            filtros.dataVencimento = { gte: new Date(dataInicio) };
        if (dataFim)
            filtros.dataVencimento = { lte: new Date(dataFim) };
        let dados = [];
        if (tipo === "clientes") {
            dados = yield prisma_1.default.anotacao.findMany({
                where: Object.assign(Object.assign({}, filtros), { status: "Em aberto" }),
                include: { cliente: true },
            });
        }
        else if (tipo === "empresas") {
            dados = yield prisma_1.default.anotacao.findMany({
                where: Object.assign(Object.assign({}, filtros), { status: "Em aberto" }),
                include: { empresa: true },
            });
        }
        if (dados.length === 0) {
            res.status(404).json({ message: "Nenhum registro encontrado para o filtro aplicado." });
            return;
        }
        const pdfPath = path_1.default.join(__dirname, "../../relatorio.pdf");
        const doc = new pdfkit_1.default();
        doc.pipe(fs_1.default.createWriteStream(pdfPath));
        doc.fontSize(20).text(`Relatório de ${tipo}`, { align: "center" });
        doc.moveDown();
        dados.forEach((item, index) => {
            if (tipo === "clientes") {
                doc.fontSize(14).text(`${index + 1}. Cliente: ${item.cliente.nomeCompleto}`);
                doc.text(`CPF: ${item.cliente.cpf}`);
            }
            else {
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
        const stream = fs_1.default.createReadStream(pdfPath);
        stream.pipe(res);
        stream.on("end", () => {
            fs_1.default.unlinkSync(pdfPath);
        });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao gerar relatório." });
    }
});
exports.gerarRelatorio = gerarRelatorio;
// Listar relatórios na web
const listarRelatoriosNaWeb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tipo, dataInicio, dataFim } = req.query;
    if (!tipo || (tipo !== "clientes" && tipo !== "empresas")) {
        res.status(400).json({ error: "O tipo deve ser 'clientes' ou 'empresas'." });
        return;
    }
    try {
        const filtros = {};
        if (dataInicio)
            filtros.dataVencimento = { gte: new Date(dataInicio) };
        if (dataFim)
            filtros.dataVencimento = { lte: new Date(dataFim) };
        let dados = [];
        if (tipo === "clientes") {
            dados = yield prisma_1.default.anotacao.findMany({
                where: Object.assign(Object.assign({}, filtros), { status: "Em aberto" }),
                include: { cliente: true },
            });
        }
        else if (tipo === "empresas") {
            dados = yield prisma_1.default.anotacao.findMany({
                where: Object.assign(Object.assign({}, filtros), { status: "Em aberto" }),
                include: { empresa: true },
            });
        }
        if (dados.length === 0) {
            res.status(404).json({ message: "Nenhum registro encontrado para o filtro aplicado." });
            return;
        }
        res.status(200).json(dados);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao listar relatórios." });
    }
});
exports.listarRelatoriosNaWeb = listarRelatoriosNaWeb;
