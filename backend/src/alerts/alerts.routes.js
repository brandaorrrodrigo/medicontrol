"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../auth/auth.middleware");
var alerts_controller_1 = require("./alerts.controller");
var router = (0, express_1.Router)();
// Todas as rotas de alertas exigem usuário autenticado
router.use(auth_middleware_1.authenticate);
// GET /api/alerts - listar alertas do usuário logado
router.get('/', alerts_controller_1.listAlerts);
// GET /api/alerts/count - contar alertas não lidos
router.get('/count', alerts_controller_1.countUnreadAlerts);
// PATCH /api/alerts/:id/read - marcar alerta como lido
router.patch('/:id/read', alerts_controller_1.markAlertAsRead);
// PATCH /api/alerts/:id/resolve - marcar alerta como resolvido
router.patch('/:id/resolve', alerts_controller_1.resolveAlert);
// POST /api/alerts/read-all - marcar todos como lidos
router.post('/read-all', alerts_controller_1.readAllAlerts);
// POST /api/alerts/refresh - regenerar alertas (DEBUG)
router.post('/refresh', alerts_controller_1.refreshAlerts);
exports.default = router;
