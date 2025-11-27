"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var notifications_controller_1 = require("./notifications.controller");
var auth_middleware_1 = require("../auth/auth.middleware");
var router = (0, express_1.Router)();
// ============================================================================
// TODAS AS ROTAS REQUEREM AUTENTICAÇÃO
// ============================================================================
router.use(auth_middleware_1.authenticate);
// ============================================================================
// NOTIFICAÇÕES GERAIS
// ============================================================================
// GET /api/notifications?category=EXAM_ALERT&read=false&limit=50&offset=0
// Buscar notificações com filtros
router.get('/', notifications_controller_1.notificationsController.getNotifications.bind(notifications_controller_1.notificationsController));
// GET /api/notifications/unread-count
// Obter contagem de não lidas
router.get('/unread-count', notifications_controller_1.notificationsController.getUnreadCount.bind(notifications_controller_1.notificationsController));
// PATCH /api/notifications/:id/read
// Marcar notificação como lida
router.patch('/:id/read', notifications_controller_1.notificationsController.markAsRead.bind(notifications_controller_1.notificationsController));
// PATCH /api/notifications/read-all
// Marcar todas como lidas
router.patch('/read-all', notifications_controller_1.notificationsController.markAllAsRead.bind(notifications_controller_1.notificationsController));
// ============================================================================
// PREFERÊNCIAS DE NOTIFICAÇÃO
// ============================================================================
// GET /api/notifications/preferences
// Obter preferências do usuário
router.get('/preferences', notifications_controller_1.notificationsController.getPreferences.bind(notifications_controller_1.notificationsController));
// PATCH /api/notifications/preferences
// Atualizar preferências
router.patch('/preferences', notifications_controller_1.notificationsController.updatePreferences.bind(notifications_controller_1.notificationsController));
// ============================================================================
// ALERTAS DE EXAME
// ============================================================================
// GET /api/notifications/exam-alerts/:patientId?severity=CRITICAL&acknowledged=false&resolved=false
// Buscar alertas de exame do paciente
router.get('/exam-alerts/:patientId', notifications_controller_1.notificationsController.getExamAlerts.bind(notifications_controller_1.notificationsController));
// PATCH /api/notifications/exam-alerts/:alertId/acknowledge
// Reconhecer um alerta (acknowledge)
router.patch('/exam-alerts/:alertId/acknowledge', notifications_controller_1.notificationsController.acknowledgeAlert.bind(notifications_controller_1.notificationsController));
// PATCH /api/notifications/exam-alerts/:alertId/resolve
// Resolver um alerta (marcar como resolvido)
router.patch('/exam-alerts/:alertId/resolve', notifications_controller_1.notificationsController.resolveAlert.bind(notifications_controller_1.notificationsController));
exports.default = router;
