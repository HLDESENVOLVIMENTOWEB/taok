"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresas_controller_1 = require("../controllers/empresas.controller");
const router = (0, express_1.Router)();
router.get("/", empresas_controller_1.getEmpresas); // Listar todas as empresas
router.get("/:id", empresas_controller_1.getEmpresaById); // Obter uma empresa por ID
router.post("/", empresas_controller_1.createEmpresa); // Criar uma nova empresa
router.put("/:id", empresas_controller_1.updateEmpresa); // Atualizar uma empresa
router.delete("/:id", empresas_controller_1.deleteEmpresa); // Deletar uma empresa
exports.default = router;
