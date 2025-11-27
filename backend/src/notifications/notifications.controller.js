"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsController = exports.NotificationsController = void 0;
var notifications_service_1 = require("./notifications.service");
var notifications_validator_1 = require("./notifications.validator");
// ============================================================================
// NOTIFICATIONS CONTROLLER
// ============================================================================
var NotificationsController = /** @class */ (function () {
    function NotificationsController() {
    }
    // ==========================================================================
    // GET /api/notifications
    // Obter notificações do usuário com filtros
    // ==========================================================================
    NotificationsController.prototype.getNotifications = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, validation, _a, category, read, limit, offset, notifications, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        validation = (0, notifications_validator_1.validateGetNotificationsQuery)(req.query);
                        if (!validation.success) {
                            res.status(400).json({
                                error: 'Parâmetros inválidos',
                                details: validation.error.errors
                            });
                            return [2 /*return*/];
                        }
                        _a = validation.data, category = _a.category, read = _a.read, limit = _a.limit, offset = _a.offset;
                        return [4 /*yield*/, notifications_service_1.notificationsService.getUserNotifications(userId, {
                                category: category,
                                read: read,
                                limit: limit,
                                offset: offset
                            })];
                    case 1:
                        notifications = _b.sent();
                        res.json({
                            success: true,
                            data: {
                                count: notifications.length,
                                notifications: notifications
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Erro ao buscar notificações:', error_1);
                        res.status(500).json({
                            error: 'Erro ao buscar notificações'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/notifications/unread-count
    // Obter contagem de não lidas
    // ==========================================================================
    NotificationsController.prototype.getUnreadCount = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, count, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        return [4 /*yield*/, notifications_service_1.notificationsService.getUnreadCount(userId)];
                    case 1:
                        count = _a.sent();
                        res.json({
                            success: true,
                            data: { count: count }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Erro ao buscar contagem:', error_2);
                        res.status(500).json({
                            error: 'Erro ao buscar contagem de notificações'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PATCH /api/notifications/:id/read
    // Marcar notificação como lida
    // ==========================================================================
    NotificationsController.prototype.markAsRead = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, notification, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        id = req.params.id;
                        return [4 /*yield*/, notifications_service_1.notificationsService.markAsRead(id, userId)];
                    case 1:
                        notification = _a.sent();
                        res.json({
                            success: true,
                            data: notification
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Erro ao marcar como lida:', error_3);
                        if (error_3.message.includes('não encontrada')) {
                            res.status(404).json({ error: error_3.message });
                            return [2 /*return*/];
                        }
                        res.status(500).json({
                            error: 'Erro ao marcar notificação como lida'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PATCH /api/notifications/read-all
    // Marcar todas como lidas
    // ==========================================================================
    NotificationsController.prototype.markAllAsRead = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        return [4 /*yield*/, notifications_service_1.notificationsService.markAllAsRead(userId)];
                    case 1:
                        result = _a.sent();
                        res.json({
                            success: true,
                            data: { count: result.count }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Erro ao marcar todas como lidas:', error_4);
                        res.status(500).json({
                            error: 'Erro ao marcar todas notificações como lidas'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/notifications/preferences
    // Obter preferências de notificação
    // ==========================================================================
    NotificationsController.prototype.getPreferences = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, preferences, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        return [4 /*yield*/, notifications_service_1.notificationsService.getUserPreferences(userId)];
                    case 1:
                        preferences = _a.sent();
                        res.json({
                            success: true,
                            data: preferences
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Erro ao buscar preferências:', error_5);
                        res.status(500).json({
                            error: 'Erro ao buscar preferências de notificação'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PATCH /api/notifications/preferences
    // Atualizar preferências de notificação
    // ==========================================================================
    NotificationsController.prototype.updatePreferences = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, validation, preferences, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        validation = (0, notifications_validator_1.validateUpdatePreferences)(req.body);
                        if (!validation.success) {
                            res.status(400).json({
                                error: 'Dados inválidos',
                                details: validation.error.errors
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, notifications_service_1.notificationsService.updateUserPreferences(userId, validation.data)];
                    case 1:
                        preferences = _a.sent();
                        res.json({
                            success: true,
                            data: preferences
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Erro ao atualizar preferências:', error_6);
                        res.status(500).json({
                            error: 'Erro ao atualizar preferências de notificação'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/notifications/exam-alerts/:patientId
    // Obter alertas de exame de um paciente
    // ==========================================================================
    NotificationsController.prototype.getExamAlerts = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, validation, _a, severity, acknowledged, resolved, limit, alerts, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        patientId = req.params.patientId;
                        validation = (0, notifications_validator_1.validateGetExamAlertsQuery)(req.query);
                        if (!validation.success) {
                            res.status(400).json({
                                error: 'Parâmetros inválidos',
                                details: validation.error.errors
                            });
                            return [2 /*return*/];
                        }
                        _a = validation.data, severity = _a.severity, acknowledged = _a.acknowledged, resolved = _a.resolved, limit = _a.limit;
                        return [4 /*yield*/, notifications_service_1.notificationsService.getPatientExamAlerts(patientId, {
                                severity: severity,
                                acknowledged: acknowledged,
                                resolved: resolved,
                                limit: limit
                            })];
                    case 1:
                        alerts = _b.sent();
                        res.json({
                            success: true,
                            data: {
                                patientId: patientId,
                                count: alerts.length,
                                alerts: alerts
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _b.sent();
                        console.error('Erro ao buscar alertas de exame:', error_7);
                        res.status(500).json({
                            error: 'Erro ao buscar alertas de exame'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PATCH /api/notifications/exam-alerts/:alertId/acknowledge
    // Reconhecer um alerta (acknowledge)
    // ==========================================================================
    NotificationsController.prototype.acknowledgeAlert = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, alertId, alert_1, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        alertId = req.params.alertId;
                        return [4 /*yield*/, notifications_service_1.notificationsService.acknowledgeAlert(alertId, userId)];
                    case 1:
                        alert_1 = _a.sent();
                        res.json({
                            success: true,
                            data: alert_1
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Erro ao reconhecer alerta:', error_8);
                        res.status(500).json({
                            error: 'Erro ao reconhecer alerta'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PATCH /api/notifications/exam-alerts/:alertId/resolve
    // Resolver um alerta
    // ==========================================================================
    NotificationsController.prototype.resolveAlert = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, alertId, validation, alert_2, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.user.id;
                        alertId = req.params.alertId;
                        validation = (0, notifications_validator_1.validateResolveAlert)(req.body);
                        if (!validation.success) {
                            res.status(400).json({
                                error: 'Dados inválidos',
                                details: validation.error.errors
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, notifications_service_1.notificationsService.resolveAlert(alertId, userId, validation.data.resolutionNotes)];
                    case 1:
                        alert_2 = _a.sent();
                        res.json({
                            success: true,
                            data: alert_2
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Erro ao resolver alerta:', error_9);
                        res.status(500).json({
                            error: 'Erro ao resolver alerta'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return NotificationsController;
}());
exports.NotificationsController = NotificationsController;
exports.notificationsController = new NotificationsController();
