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
exports.deleteAnotacao = exports.updateAnotacao = exports.createAnotacao = exports.getAnotacaoById = exports.getAnotacoes = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
// Obter todas as anotações
const getAnotacoes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10 } = req.query; // Valores padrão: página 1, 10 registros por página
    try {
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        // Calcula o total de anotações
        const totalAnotacoes = yield prisma_1.default.anotacao.count();
        // Busca as anotações com base na página e no limite
        const anotacoes = yield prisma_1.default.anotacao.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar anotações" });
    }
});
exports.getAnotacoes = getAnotacoes;
// Obter uma anotação por ID
const getAnotacaoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const anotacao = yield prisma_1.default.anotacao.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar anotação" });
    }
});
exports.getAnotacaoById = getAnotacaoById;
// Criar uma nova anotação
const createAnotacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clienteId, empresaId, produtoServico, quantidade, valorTotal, dataVencimento, status, } = req.body;
    try {
        const novaAnotacao = yield prisma_1.default.anotacao.create({
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
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao criar anotação" });
    }
});
exports.createAnotacao = createAnotacao;
// Atualizar uma anotação por ID
const updateAnotacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const anotacaoAtualizada = yield prisma_1.default.anotacao.update({
            where: { id: Number(id) },
            data,
        });
        res.status(200).json(anotacaoAtualizada);
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao atualizar anotação" });
    }
});
exports.updateAnotacao = updateAnotacao;
// Deletar uma anotação por ID
const deleteAnotacao = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.anotacao.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao deletar anotação" });
    }
});
exports.deleteAnotacao = deleteAnotacao;
