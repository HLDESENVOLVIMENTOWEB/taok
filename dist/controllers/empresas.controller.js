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
exports.deleteEmpresa = exports.updateEmpresa = exports.createEmpresa = exports.getEmpresaById = exports.getEmpresas = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma")); // Certifique-se de que o prisma está importado corretamente
// Obter todas as empresas
const getEmpresas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const empresas = yield prisma_1.default.empresa.findMany();
        res.status(200).json(empresas);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar empresas" });
    }
});
exports.getEmpresas = getEmpresas;
// Obter uma empresa por ID
const getEmpresaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const empresa = yield prisma_1.default.empresa.findUnique({
            where: { id: Number(id) },
        });
        if (!empresa) {
            res.status(404).json({ error: "Empresa não encontrada" });
            return;
        }
        res.status(200).json(empresa);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar empresa" });
    }
});
exports.getEmpresaById = getEmpresaById;
// Criar uma nova empresa
const createEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cnpj, razaoSocial, nomeFantasia, cep, endereco, bairro, cidade, estado, email, telefone, inscricaoEstadual, inscricaoMunicipal, responsavel, observacoes, } = req.body;
    try {
        const novaEmpresa = yield prisma_1.default.empresa.create({
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
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao criar empresa" });
    }
});
exports.createEmpresa = createEmpresa;
// Atualizar uma empresa por ID
const updateEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const empresaAtualizada = yield prisma_1.default.empresa.update({
            where: { id: Number(id) },
            data,
        });
        res.status(200).json(empresaAtualizada);
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao atualizar empresa" });
    }
});
exports.updateEmpresa = updateEmpresa;
// Deletar uma empresa por ID
const deleteEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.empresa.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao deletar empresa" });
    }
});
exports.deleteEmpresa = deleteEmpresa;
