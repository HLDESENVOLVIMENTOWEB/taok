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
exports.deleteCliente = exports.updateCliente = exports.createCliente = exports.getClienteById = exports.getClientes = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma")); // Certifique-se de que o Prisma está configurado corretamente
// Obter todos os clientes
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield prisma_1.default.cliente.findMany();
        res.status(200).json(clientes);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar clientes" });
    }
});
exports.getClientes = getClientes;
// Obter um cliente por ID
const getClienteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cliente = yield prisma_1.default.cliente.findUnique({
            where: { id: Number(id) },
        });
        if (!cliente) {
            res.status(404).json({ error: "Cliente não encontrado" });
            return;
        }
        res.status(200).json(cliente);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar cliente" });
    }
});
exports.getClienteById = getClienteById;
// Criar um novo cliente
const createCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomeCompleto, cpf, dataNascimento, nomeMae, email, telefone, cep, observacoes, } = req.body;
    try {
        const novoCliente = yield prisma_1.default.cliente.create({
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
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao criar cliente" });
    }
});
exports.createCliente = createCliente;
// Atualizar um cliente por ID
const updateCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const clienteAtualizado = yield prisma_1.default.cliente.update({
            where: { id: Number(id) },
            data,
        });
        res.status(200).json(clienteAtualizado);
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao atualizar cliente" });
    }
});
exports.updateCliente = updateCliente;
// Deletar um cliente por ID
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.cliente.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao deletar cliente" });
    }
});
exports.deleteCliente = deleteCliente;
