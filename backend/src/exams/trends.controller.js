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
exports.trendsController = exports.TrendsController = void 0;
var trends_service_1 = require("./trends.service");
var trends_validator_1 = require("./trends.validator");
// ============================================================================
// TRENDS CONTROLLER - Análise de Tendências e Gráficos
// ============================================================================
var TrendsController = /** @class */ (function () {
    function TrendsController() {
    }
    // ==========================================================================
    // GET /api/exams/trends/:patientId/:markerCode
    // Obter tendência de um marcador específico
    // ==========================================================================
    TrendsController.prototype.getMarkerTrend = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, markerCode, userId, validation, _b, startDate, endDate, limit, trend, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.params, patientId = _a.patientId, markerCode = _a.markerCode;
                        userId = req.user.id;
                        validation = (0, trends_validator_1.validateGetMarkerTrendQuery)(req.query);
                        if (!validation.success) {
                            res.status(400).json({
                                error: 'Parâmetros inválidos',
                                details: validation.error.errors
                            });
                            return [2 /*return*/];
                        }
                        _b = validation.data, startDate = _b.startDate, endDate = _b.endDate, limit = _b.limit;
                        return [4 /*yield*/, trends_service_1.trendsService.getMarkerTrend(patientId, markerCode.toUpperCase(), userId, {
                                startDate: startDate ? new Date(startDate) : undefined,
                                endDate: endDate ? new Date(endDate) : undefined,
                                limit: limit
                            })];
                    case 1:
                        trend = _c.sent();
                        res.json({
                            success: true,
                            data: trend
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _c.sent();
                        console.error('Erro ao buscar tendência do marcador:', error_1);
                        if (error_1.message.includes('não encontrado')) {
                            res.status(404).json({
                                error: error_1.message
                            });
                            return [2 /*return*/];
                        }
                        if (error_1.message.includes('permissão')) {
                            res.status(403).json({
                                error: error_1.message
                            });
                            return [2 /*return*/];
                        }
                        res.status(500).json({
                            error: 'Erro ao buscar tendência do marcador'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/exams/trends/:patientId
    // Obter todas as tendências de marcadores do paciente
    // ==========================================================================
    TrendsController.prototype.getAllPatientTrends = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, userId, validation, _a, startDate, endDate, trends, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        patientId = req.params.patientId;
                        userId = req.user.id;
                        validation = (0, trends_validator_1.validateGetAllTrendsQuery)(req.query);
                        if (!validation.success) {
                            res.status(400).json({
                                error: 'Parâmetros inválidos',
                                details: validation.error.errors
                            });
                            return [2 /*return*/];
                        }
                        _a = validation.data, startDate = _a.startDate, endDate = _a.endDate;
                        return [4 /*yield*/, trends_service_1.trendsService.getAllPatientTrends(patientId, userId, {
                                startDate: startDate ? new Date(startDate) : undefined,
                                endDate: endDate ? new Date(endDate) : undefined
                            })];
                    case 1:
                        trends = _b.sent();
                        res.json({
                            success: true,
                            data: {
                                patientId: patientId,
                                count: trends.length,
                                trends: trends
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Erro ao buscar tendências do paciente:', error_2);
                        if (error_2.message.includes('não encontrado')) {
                            res.status(404).json({
                                error: error_2.message
                            });
                            return [2 /*return*/];
                        }
                        if (error_2.message.includes('permissão')) {
                            res.status(403).json({
                                error: error_2.message
                            });
                            return [2 /*return*/];
                        }
                        res.status(500).json({
                            error: 'Erro ao buscar tendências do paciente'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/exams/trends/:patientId/summary
    // Obter resumo geral das tendências do paciente
    // ==========================================================================
    TrendsController.prototype.getPatientTrendsSummary = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, userId, summary, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        patientId = req.params.patientId;
                        userId = req.user.id;
                        return [4 /*yield*/, trends_service_1.trendsService.getPatientTrendsSummary(patientId, userId)];
                    case 1:
                        summary = _a.sent();
                        res.json({
                            success: true,
                            data: summary
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Erro ao buscar resumo de tendências:', error_3);
                        if (error_3.message.includes('não encontrado')) {
                            res.status(404).json({
                                error: error_3.message
                            });
                            return [2 /*return*/];
                        }
                        if (error_3.message.includes('permissão')) {
                            res.status(403).json({
                                error: error_3.message
                            });
                            return [2 /*return*/];
                        }
                        res.status(500).json({
                            error: 'Erro ao buscar resumo de tendências'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/exams/trends/:patientId/:markerCode/statistics
    // Obter apenas estatísticas (sem interpretação médica)
    // ==========================================================================
    TrendsController.prototype.getMarkerStatistics = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, markerCode, userId, validation, _b, startDate, endDate, limit, trend, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.params, patientId = _a.patientId, markerCode = _a.markerCode;
                        userId = req.user.id;
                        validation = (0, trends_validator_1.validateGetMarkerTrendQuery)(req.query);
                        if (!validation.success) {
                            res.status(400).json({
                                error: 'Parâmetros inválidos',
                                details: validation.error.errors
                            });
                            return [2 /*return*/];
                        }
                        _b = validation.data, startDate = _b.startDate, endDate = _b.endDate, limit = _b.limit;
                        return [4 /*yield*/, trends_service_1.trendsService.getMarkerTrend(patientId, markerCode.toUpperCase(), userId, {
                                startDate: startDate ? new Date(startDate) : undefined,
                                endDate: endDate ? new Date(endDate) : undefined,
                                limit: limit
                            })
                            // Retornar apenas estatísticas e pontos de dados
                        ];
                    case 1:
                        trend = _c.sent();
                        // Retornar apenas estatísticas e pontos de dados
                        res.json({
                            success: true,
                            data: {
                                markerCode: trend.markerCode,
                                markerName: trend.markerName,
                                unit: trend.unit,
                                dataPoints: trend.dataPoints,
                                statistics: trend.statistics,
                                trend: trend.trend,
                                referenceRange: trend.referenceRange
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _c.sent();
                        console.error('Erro ao buscar estatísticas do marcador:', error_4);
                        if (error_4.message.includes('não encontrado')) {
                            res.status(404).json({
                                error: error_4.message
                            });
                            return [2 /*return*/];
                        }
                        if (error_4.message.includes('permissão')) {
                            res.status(403).json({
                                error: error_4.message
                            });
                            return [2 /*return*/];
                        }
                        res.status(500).json({
                            error: 'Erro ao buscar estatísticas do marcador'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/exams/trends/:patientId/critical
    // Obter apenas marcadores com alertas críticos
    // ==========================================================================
    TrendsController.prototype.getCriticalMarkers = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, userId, allTrends, criticalTrends, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        patientId = req.params.patientId;
                        userId = req.user.id;
                        return [4 /*yield*/, trends_service_1.trendsService.getAllPatientTrends(patientId, userId)
                            // Filtrar apenas críticos
                        ];
                    case 1:
                        allTrends = _a.sent();
                        criticalTrends = allTrends.filter(function (trend) { return trend.currentStatus.severity === 'CRITICAL'; });
                        res.json({
                            success: true,
                            data: {
                                patientId: patientId,
                                criticalCount: criticalTrends.length,
                                markers: criticalTrends
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Erro ao buscar marcadores críticos:', error_5);
                        if (error_5.message.includes('não encontrado')) {
                            res.status(404).json({
                                error: error_5.message
                            });
                            return [2 /*return*/];
                        }
                        if (error_5.message.includes('permissão')) {
                            res.status(403).json({
                                error: error_5.message
                            });
                            return [2 /*return*/];
                        }
                        res.status(500).json({
                            error: 'Erro ao buscar marcadores críticos'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // GET /api/exams/trends/:patientId/:markerCode/compare
    // Comparar tendência de um marcador com população (futuro: usar dados agregados)
    // ==========================================================================
    TrendsController.prototype.compareWithPopulation = function (req, res, _next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, markerCode, userId, trend, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.params, patientId = _a.patientId, markerCode = _a.markerCode;
                        userId = req.user.id;
                        return [4 /*yield*/, trends_service_1.trendsService.getMarkerTrend(patientId, markerCode.toUpperCase(), userId)
                            // TODO: Implementar comparação com dados populacionais agregados
                            // Por enquanto, retornar apenas os dados do paciente com nota
                        ];
                    case 1:
                        trend = _b.sent();
                        // TODO: Implementar comparação com dados populacionais agregados
                        // Por enquanto, retornar apenas os dados do paciente com nota
                        res.json({
                            success: true,
                            data: {
                                patient: trend,
                                population: {
                                    available: false,
                                    message: 'Dados populacionais ainda não disponíveis'
                                }
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        console.error('Erro ao comparar com população:', error_6);
                        if (error_6.message.includes('não encontrado')) {
                            res.status(404).json({
                                error: error_6.message
                            });
                            return [2 /*return*/];
                        }
                        if (error_6.message.includes('permissão')) {
                            res.status(403).json({
                                error: error_6.message
                            });
                            return [2 /*return*/];
                        }
                        res.status(500).json({
                            error: 'Erro ao comparar com população'
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TrendsController;
}());
exports.TrendsController = TrendsController;
exports.trendsController = new TrendsController();
