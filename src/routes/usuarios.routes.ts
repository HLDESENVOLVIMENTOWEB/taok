import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
} from "../controllers/usuarios.controller";

const router = Router();

router.get("/", getUsuarios); // Listar todos os usuários
router.get("/:id", getUsuarioById); // Obter um usuário por ID
router.post("/", createUsuario); // Criar um novo usuário
router.put("/:id", updateUsuario); // Atualizar um usuário
router.delete("/:id", deleteUsuario); // Deletar um usuário
router.post("/login", loginUsuario); // Login de usuário

export default router;
