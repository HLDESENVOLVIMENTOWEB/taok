import { Router } from "express";
import { gerarRelatorio, listarRelatoriosNaWeb } from "../controllers/relatorios.controller";

const router = Router();

// Gerar relatório em PDF
router.get("/pdf", gerarRelatorio);

// Listar relatórios na web
router.get("/", listarRelatoriosNaWeb);

export default router;
