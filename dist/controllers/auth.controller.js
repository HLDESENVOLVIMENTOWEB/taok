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
exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const bcrypt_service_1 = require("../services/bcrypt.service");
const auth_service_1 = require("../services/auth.service");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomeUsuario, email, senha } = req.body;
    const hashedPassword = yield (0, bcrypt_service_1.hashPassword)(senha);
    try {
        const usuario = yield prisma_1.default.usuario.create({
            data: { nomeUsuario, email, senha: hashedPassword },
        });
        res.status(201).json(usuario);
    }
    catch (error) {
        res.status(400).json({ error: "Erro ao registrar usuário" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, senha } = req.body;
    const usuario = yield prisma_1.default.usuario.findUnique({ where: { email } });
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
});
exports.login = login;
