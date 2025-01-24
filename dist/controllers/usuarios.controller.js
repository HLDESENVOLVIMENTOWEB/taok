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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUsuario = exports.deleteUsuario = exports.updateUsuario = exports.createUsuario = exports.getUsuarioById = exports.getUsuarios = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const bcrypt_service_1 = require("../services/bcrypt.service");
const auth_service_1 = require("../services/auth.service");
// Obter todos os usuários
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield prisma_1.default.usuario.findMany();
        res.status(200).json(usuarios);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});
exports.getUsuarios = getUsuarios;
// Obter um usuário por ID
const getUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield prisma_1.default.usuario.findUnique({
            where: { id: Number(id) },
        });
        if (!usuario) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }
        res.status(200).json(usuario);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});
exports.getUsuarioById = getUsuarioById;
// Criar um novo usuário
const createUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomeUsuario, email, senha, role } = req.body;
    try {
        const hashedPassword = yield (0, bcrypt_service_1.hashPassword)(senha);
        const novoUsuario = yield prisma_1.default.usuario.create({
            data: {
                nomeUsuario,
                email,
                senha: hashedPassword,
                role: role || "User",
            },
        });
        res.status(201).json(novoUsuario);
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao criar usuário" });
    }
});
exports.createUsuario = createUsuario;
// Atualizar um usuário por ID
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _a = req.body, { senha } = _a, resto = __rest(_a, ["senha"]);
    try {
        const data = senha
            ? Object.assign(Object.assign({}, resto), { senha: yield (0, bcrypt_service_1.hashPassword)(senha) }) : resto;
        const usuarioAtualizado = yield prisma_1.default.usuario.update({
            where: { id: Number(id) },
            data,
        });
        res.status(200).json(usuarioAtualizado);
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao atualizar usuário" });
    }
});
exports.updateUsuario = updateUsuario;
// Deletar um usuário por ID
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.usuario.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao deletar usuário" });
    }
});
exports.deleteUsuario = deleteUsuario;
// Login de usuário
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    try {
        const usuario = yield prisma_1.default.usuario.findUnique({
            where: { email },
        });
        if (!usuario) {
            res.status(404).json({ error: "Usuário não encontrado" });
            return;
        }
        const isPasswordValid = yield (0, bcrypt_service_1.comparePassword)(senha, usuario.senha);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Senha incorreta" });
            return;
        }
        const token = (0, auth_service_1.generateToken)(usuario.id, usuario.role);
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao realizar login" });
    }
});
exports.loginUsuario = loginUsuario;
