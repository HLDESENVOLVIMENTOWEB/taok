import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
} from "../controllers/usuarios.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUsuarios); 
router.get("/:id", authMiddleware, getUsuarioById); 
router.post("/", createUsuario); 
router.put("/:id", authMiddleware, updateUsuario); 
router.delete("/:id", authMiddleware, deleteUsuario); 
router.post("/login", loginUsuario); 

export default router;
