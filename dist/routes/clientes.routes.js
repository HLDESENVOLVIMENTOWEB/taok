"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_controller_1 = require("../controllers/clientes.controller");
const router = (0, express_1.Router)();
router.get("/", clientes_controller_1.getClientes); // Listar todos os clientes
router.get("/:id", clientes_controller_1.getClienteById); // Obter um cliente por ID
router.post("/", clientes_controller_1.createCliente); // Criar um novo cliente
router.put("/:id", clientes_controller_1.updateCliente); // Atualizar um cliente
router.delete("/:id", clientes_controller_1.deleteCliente); // Deletar um cliente
exports.default = router;
