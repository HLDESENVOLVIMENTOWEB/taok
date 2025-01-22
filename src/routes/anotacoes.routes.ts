import { Router } from "express";
import {
  getAnotacoes,
  getAnotacaoById,
  createAnotacao,
  updateAnotacao,
  deleteAnotacao,
} from "../controllers/anotacoes.controller";

const router = Router();

router.get("/", getAnotacoes); // Listar todas as anotações
router.get("/:id", getAnotacaoById); // Obter uma anotação por ID
router.post("/", createAnotacao); // Criar uma nova anotação
router.put("/:id", updateAnotacao); // Atualizar uma anotação
router.delete("/:id", deleteAnotacao); // Deletar uma anotação

export default router;
