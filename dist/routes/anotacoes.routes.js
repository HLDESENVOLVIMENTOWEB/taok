"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const anotacoes_controller_1 = require("../controllers/anotacoes.controller");
const router = (0, express_1.Router)();
router.get("/", anotacoes_controller_1.getAnotacoes); // Listar todas as anotações
router.get("/:id", anotacoes_controller_1.getAnotacaoById); // Obter uma anotação por ID
router.post("/", anotacoes_controller_1.createAnotacao); // Criar uma nova anotação
router.put("/:id", anotacoes_controller_1.updateAnotacao); // Atualizar uma anotação
router.delete("/:id", anotacoes_controller_1.deleteAnotacao); // Deletar uma anotação
exports.default = router;
