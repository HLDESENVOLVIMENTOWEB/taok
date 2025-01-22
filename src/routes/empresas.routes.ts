import { Router } from "express";
import {
  getEmpresas,
  getEmpresaById,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../controllers/empresas.controller";

const router = Router();

router.get("/", getEmpresas); // Listar todas as empresas
router.get("/:id", getEmpresaById); // Obter uma empresa por ID
router.post("/", createEmpresa); // Criar uma nova empresa
router.put("/:id", updateEmpresa); // Atualizar uma empresa
router.delete("/:id", deleteEmpresa); // Deletar uma empresa

export default router;
