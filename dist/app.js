"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const clientes_routes_1 = __importDefault(require("./routes/clientes.routes"));
const empresas_routes_1 = __importDefault(require("./routes/empresas.routes"));
const anotacoes_routes_1 = __importDefault(require("./routes/anotacoes.routes"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
// Rotas protegidas com autenticação
app.use("/api/clientes", auth_middleware_1.authMiddleware, clientes_routes_1.default);
app.use("/api/empresas", auth_middleware_1.authMiddleware, empresas_routes_1.default);
app.use("/api/anotacoes", auth_middleware_1.authMiddleware, anotacoes_routes_1.default);
// Rotas de usuários: remove o middleware para criação de usuário
app.use("/api/usuarios", usuarios_routes_1.default);
// Rotas de autenticação
app.use("/api/auth", auth_routes_1.default);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
