import express from "express";
import clienteRoutes from "./routes/clientes.routes";
import empresaRoutes from "./routes/empresas.routes";
import anotacoesRoutes from "./routes/anotacoes.routes";
import usuariosRoutes from "./routes/usuarios.routes";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middleware/auth.middleware";

const app = express();

app.use(express.json());

// Rotas protegidas (aplicando o middleware `authMiddleware`)
app.use("/api/clientes", authMiddleware, clienteRoutes);
app.use("/api/empresas", authMiddleware, empresaRoutes);
app.use("/api/anotacoes", authMiddleware, anotacoesRoutes);
app.use("/api/usuarios", authMiddleware, usuariosRoutes);

// Rotas públicas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
