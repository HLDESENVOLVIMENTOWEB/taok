import { Router } from "express";
import { gerarRelatorioFiltrado, listarRelatoriosNaWeb } from "../controllers/relatorios.controller";

const router = Router();

// Gerar relatório em PDF
router.get("/pdf", gerarRelatorioFiltrado);

// Listar relatórios na web
router.get("/", listarRelatoriosNaWeb);

export default router;
