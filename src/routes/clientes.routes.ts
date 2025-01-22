import { Router } from "express";
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../controllers/clientes.controller";

const router = Router();

router.get("/", getClientes); // Listar todos os clientes
router.get("/:id", getClienteById); // Obter um cliente por ID
router.post("/", createCliente); // Criar um novo cliente
router.put("/:id", updateCliente); // Atualizar um cliente
router.delete("/:id", deleteCliente); // Deletar um cliente

export default router;
