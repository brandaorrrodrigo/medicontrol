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
exports.listAlerts = listAlerts;
exports.countUnreadAlerts = countUnreadAlerts;
exports.markAlertAsRead = markAlertAsRead;
exports.resolveAlert = resolveAlert;
exports.readAllAlerts = readAllAlerts;
exports.refreshAlerts = refreshAlerts;
var alerts_service_1 = require("./alerts.service");
var alerts_validator_1 = require("./alerts.validator");
/**
 * CONTROLLER DE ALERTAS
 *
 * Handlers para os endpoints de alertas medicamentosos.
 */
// ============================================================================
// GET /api/alerts - Listar alertas do paciente
// ============================================================================
function listAlerts(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, patientId, query, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    patientId = req.patientId;
                    query = alerts_validator_1.listAlertsQuerySchema.parse(req.query);
                    return [4 /*yield*/, alerts_service_1.alertsService.getPatientAlerts(patientId, userId, query)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, res.json(result)];
                case 2:
                    error_1 = _a.sent();
                    console.error('Erro ao listar alertas:', error_1);
                    if (error_1.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_1.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Parâmetros inválidos',
                                details: error_1.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao listar alertas' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// GET /api/alerts/count - Contar alertas não lidos
// ============================================================================
function countUnreadAlerts(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, patientId, count, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    patientId = req.patientId;
                    return [4 /*yield*/, alerts_service_1.alertsService.countUnreadAlerts(patientId, userId)];
                case 1:
                    count = _a.sent();
                    return [2 /*return*/, res.json({ count: count })];
                case 2:
                    error_2 = _a.sent();
                    console.error('Erro ao contar alertas:', error_2);
                    if (error_2.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao contar alertas' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// PATCH /api/alerts/:id/read - Marcar alerta como lido
// ============================================================================
function markAlertAsRead(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, id, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    id = alerts_validator_1.markAlertReadParamSchema.parse(req.params).id;
                    return [4 /*yield*/, alerts_service_1.alertsService.markAlertAsRead(id, userId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.json({ message: 'Alerta marcado como lido' })];
                case 2:
                    error_3 = _a.sent();
                    console.error('Erro ao marcar alerta como lido:', error_3);
                    if (error_3.message === 'Alerta não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Alerta não encontrado' })];
                    }
                    if (error_3.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_3.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'ID inválido',
                                details: error_3.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao marcar alerta' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// PATCH /api/alerts/:id/resolve - Marcar alerta como resolvido
// ============================================================================
function resolveAlert(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, id, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    id = alerts_validator_1.resolveAlertParamSchema.parse(req.params).id;
                    return [4 /*yield*/, alerts_service_1.alertsService.resolveAlert(id, userId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.json({ message: 'Alerta resolvido' })];
                case 2:
                    error_4 = _a.sent();
                    console.error('Erro ao resolver alerta:', error_4);
                    if (error_4.message === 'Alerta não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Alerta não encontrado' })];
                    }
                    if (error_4.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_4.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'ID inválido',
                                details: error_4.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao resolver alerta' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// POST /api/alerts/read-all - Marcar todos como lidos
// ============================================================================
function readAllAlerts(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, patientId, type, count, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    patientId = req.patientId;
                    type = alerts_validator_1.readAllAlertsBodySchema.parse(req.body).type;
                    return [4 /*yield*/, alerts_service_1.alertsService.markAllAlertsAsRead(patientId, userId, type)];
                case 1:
                    count = _a.sent();
                    return [2 /*return*/, res.json({
                            message: "".concat(count, " alerta(s) marcado(s) como lido(s)"),
                            count: count,
                        })];
                case 2:
                    error_5 = _a.sent();
                    console.error('Erro ao marcar todos alertas:', error_5);
                    if (error_5.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_5.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Dados inválidos',
                                details: error_5.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao marcar alertas' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// POST /api/alerts/refresh - Regenerar alertas (DEBUG)
// ============================================================================
function refreshAlerts(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var patientId, _a, _medicationId, _types, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    patientId = req.patientId;
                    _a = alerts_validator_1.refreshAlertsBodySchema.parse(req.body), _medicationId = _a.medicationId, _types = _a.types;
                    // TODO: Se medicationId ou types forem fornecidos, filtrar a regeneração
                    // Por enquanto, regenera todos os alertas
                    return [4 /*yield*/, alerts_service_1.alertsService.generateAlertsForPatient(patientId)];
                case 1:
                    // TODO: Se medicationId ou types forem fornecidos, filtrar a regeneração
                    // Por enquanto, regenera todos os alertas
                    _b.sent();
                    return [2 /*return*/, res.json({
                            message: 'Alertas regenerados com sucesso',
                        })];
                case 2:
                    error_6 = _b.sent();
                    console.error('Erro ao regenerar alertas:', error_6);
                    if (error_6.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Dados inválidos',
                                details: error_6.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao regenerar alertas' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
