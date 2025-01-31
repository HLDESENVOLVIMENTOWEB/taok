"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const relatorios_controller_1 = require("../controllers/relatorios.controller");
const router = (0, express_1.Router)();
// Gerar relatório em PDF
router.get("/pdf", relatorios_controller_1.gerarRelatorioFiltrado);
// Listar relatórios na web
router.get("/", relatorios_controller_1.listarRelatoriosNaWeb);
exports.default = router;
