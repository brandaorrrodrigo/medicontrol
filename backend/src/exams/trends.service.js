"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.trendsService = exports.TrendsService = void 0;
// @ts-nocheck
var prisma_1 = require("../database/prisma");
var trends_statistics_util_1 = require("./trends-statistics.util");
var exams_reference_service_1 = require("./exams-reference.service");
// ============================================================================
// CLASSE DO SERVICE
// ============================================================================
var TrendsService = /** @class */ (function () {
    function TrendsService() {
    }
    // ==========================================================================
    // VALIDAR PERMISSÃO DE ACESSO AO PACIENTE
    // ==========================================================================
    TrendsService.prototype.validatePatientAccess = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var patient, isOwner, isCaregiver, isProfessional;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                            where: { id: patientId },
                            include: {
                                user: true,
                                caregivers: {
                                    include: {
                                        caregiver: { include: { user: true } }
                                    }
                                },
                                professionals: {
                                    include: {
                                        professional: { include: { user: true } }
                                    }
                                }
                            }
                        })];
                    case 1:
                        patient = _a.sent();
                        if (!patient) {
                            throw new Error('Paciente não encontrado');
                        }
                        isOwner = patient.userId === userId;
                        isCaregiver = patient.caregivers.some(function (pc) { return pc.caregiver.userId === userId; });
                        isProfessional = patient.professionals.some(function (pp) { return pp.professional.userId === userId; });
                        if (!isOwner && !isCaregiver && !isProfessional) {
                            throw new Error('Você não tem permissão para acessar os dados deste paciente');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // OBTER TENDÊNCIA DE UM MARCADOR ESPECÍFICO
    // ==========================================================================
    TrendsService.prototype.getMarkerTrend = function (patientId_1, markerCode_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (patientId, markerCode, userId, options) {
            var results, catalog, markerInfo, dataPoints, statistics, trend, lastResult, referenceRange, currentStatus, _a, insights, alerts;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Validar permissão
                    return [4 /*yield*/, this.validatePatientAccess(patientId, userId)
                        // Buscar resultados do marcador
                    ];
                    case 1:
                        // Validar permissão
                        _b.sent();
                        return [4 /*yield*/, prisma_1.prisma.examResult.findMany({
                                where: {
                                    markerCode: markerCode,
                                    exam: {
                                        patientId: patientId,
                                        date: __assign(__assign({}, (options.startDate && { gte: options.startDate })), (options.endDate && { lte: options.endDate }))
                                    }
                                },
                                include: {
                                    exam: {
                                        select: {
                                            id: true,
                                            date: true
                                        }
                                    }
                                },
                                orderBy: {
                                    exam: {
                                        date: 'asc'
                                    }
                                },
                                take: options.limit || 100
                            })];
                    case 2:
                        results = _b.sent();
                        if (results.length === 0) {
                            throw new Error("Nenhum resultado encontrado para ".concat(markerCode));
                        }
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.loadCatalog()];
                    case 3:
                        catalog = _b.sent();
                        markerInfo = catalog.get(markerCode);
                        if (!markerInfo) {
                            throw new Error("Marcador ".concat(markerCode, " n\u00E3o encontrado no cat\u00E1logo"));
                        }
                        dataPoints = results.map(function (r) { return ({
                            date: r.exam.date,
                            value: r.value,
                            unit: r.unit,
                            status: r.status
                        }); });
                        statistics = (0, trends_statistics_util_1.calculateStatistics)(dataPoints);
                        trend = (0, trends_statistics_util_1.analyzeTrend)(dataPoints);
                        lastResult = results[results.length - 1];
                        referenceRange = {
                            low: lastResult.referenceMin,
                            high: lastResult.referenceMax
                        };
                        currentStatus = this.determineCurrentStatus(lastResult.value, lastResult.status, referenceRange.low, referenceRange.high);
                        _a = this.generateInsightsAndAlerts(markerCode, markerInfo.name, dataPoints, statistics, trend, currentStatus), insights = _a.insights, alerts = _a.alerts;
                        return [2 /*return*/, {
                                markerCode: markerCode,
                                markerName: markerInfo.name,
                                unit: results[0].unit,
                                category: markerInfo.category,
                                dataPoints: results.map(function (r) { return ({
                                    date: r.exam.date.toISOString(),
                                    value: r.value,
                                    status: r.status,
                                    examId: r.exam.id
                                }); }),
                                statistics: statistics,
                                trend: trend,
                                referenceRange: referenceRange,
                                currentStatus: currentStatus,
                                insights: insights,
                                alerts: alerts
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // OBTER TODAS AS TENDÊNCIAS DO PACIENTE
    // ==========================================================================
    TrendsService.prototype.getAllPatientTrends = function (patientId_1, userId_1) {
        return __awaiter(this, arguments, void 0, function (patientId, userId, options) {
            var uniqueMarkers, trends, _i, uniqueMarkers_1, markerCode, trend, error_1;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Validar permissão
                    return [4 /*yield*/, this.validatePatientAccess(patientId, userId)
                        // Buscar todos os marcadores únicos do paciente
                    ];
                    case 1:
                        // Validar permissão
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.examResult.findMany({
                                where: {
                                    exam: {
                                        patientId: patientId,
                                        date: __assign(__assign({}, (options.startDate && { gte: options.startDate })), (options.endDate && { lte: options.endDate }))
                                    }
                                },
                                select: {
                                    markerCode: true
                                },
                                distinct: ['markerCode']
                            })
                            // Buscar tendência de cada marcador
                        ];
                    case 2:
                        uniqueMarkers = _a.sent();
                        trends = [];
                        _i = 0, uniqueMarkers_1 = uniqueMarkers;
                        _a.label = 3;
                    case 3:
                        if (!(_i < uniqueMarkers_1.length)) return [3 /*break*/, 8];
                        markerCode = uniqueMarkers_1[_i].markerCode;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.getMarkerTrend(patientId, markerCode, userId, options)];
                    case 5:
                        trend = _a.sent();
                        trends.push(trend);
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error("Erro ao buscar tend\u00EAncia de ".concat(markerCode, ":"), error_1);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: 
                    // Ordenar por prioridade (críticos primeiro, depois por nome)
                    return [2 /*return*/, trends.sort(function (a, b) {
                            if (a.currentStatus.severity !== b.currentStatus.severity) {
                                var severityOrder = { 'CRITICAL': 0, 'WARNING': 1, 'NORMAL': 2 };
                                return severityOrder[a.currentStatus.severity] - severityOrder[b.currentStatus.severity];
                            }
                            return a.markerName.localeCompare(b.markerName);
                        })];
                }
            });
        });
    };
    // ==========================================================================
    // OBTER RESUMO GERAL DAS TENDÊNCIAS
    // ==========================================================================
    TrendsService.prototype.getPatientTrendsSummary = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var trends, totalMarkers, markersWithData, criticalAlerts, warnings, overallHealth, topConcerns, positiveChanges, recommendations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllPatientTrends(patientId, userId)];
                    case 1:
                        trends = _a.sent();
                        totalMarkers = trends.length;
                        markersWithData = trends.filter(function (t) { var _a; return (((_a = t.statistics) === null || _a === void 0 ? void 0 : _a.count) || 0) > 0; }).length;
                        criticalAlerts = trends.filter(function (t) { return t.currentStatus.severity === 'CRITICAL'; }).length;
                        warnings = trends.filter(function (t) { return t.currentStatus.severity === 'WARNING'; }).length;
                        if (criticalAlerts > 0) {
                            overallHealth = 'POOR';
                        }
                        else if (warnings > 2) {
                            overallHealth = 'FAIR';
                        }
                        else {
                            overallHealth = 'GOOD';
                        }
                        topConcerns = [];
                        trends.forEach(function (t) {
                            var _a;
                            if (t.currentStatus.severity === 'CRITICAL') {
                                topConcerns.push("".concat(t.markerName, ": ").concat(t.currentStatus.status, " - ").concat((_a = t.statistics) === null || _a === void 0 ? void 0 : _a.latest, " ").concat(t.unit));
                            }
                            else if (t.trend && t.trend.direction === 'UP' && t.currentStatus.severity === 'WARNING') {
                                topConcerns.push("".concat(t.markerName, ": tend\u00EAncia de alta (").concat(t.trend.slope.toFixed(1), "% ao m\u00EAs)"));
                            }
                        });
                        positiveChanges = [];
                        trends.forEach(function (t) {
                            if (t.trend && t.currentStatus.severity === 'NORMAL') {
                                if (t.trend.direction === 'DOWN' && ['COLESTEROL_TOTAL', 'LDL_COLESTEROL', 'TRIGLICERIDEOS', 'GLICEMIA_JEJUM'].includes(t.markerCode)) {
                                    positiveChanges.push("".concat(t.markerName, ": tend\u00EAncia de melhora (").concat(Math.abs(t.trend.slope).toFixed(1), "% redu\u00E7\u00E3o ao m\u00EAs)"));
                                }
                                else if (t.trend.direction === 'UP' && ['HDL_COLESTEROL', 'HEMOGLOBINA'].includes(t.markerCode)) {
                                    positiveChanges.push("".concat(t.markerName, ": tend\u00EAncia de melhora (+").concat(t.trend.slope.toFixed(1), "% ao m\u00EAs)"));
                                }
                            }
                        });
                        recommendations = [];
                        if (criticalAlerts > 0) {
                            recommendations.push('Consulte um médico urgentemente para avaliar valores críticos');
                        }
                        if (warnings > 0) {
                            recommendations.push('Agende consulta médica para avaliar valores alterados');
                        }
                        if (trends.some(function (t) { return t.markerCode === 'GLICEMIA_JEJUM' && t.currentStatus.severity !== 'NORMAL'; })) {
                            recommendations.push('Monitore a glicemia regularmente e mantenha alimentação balanceada');
                        }
                        if (trends.some(function (t) { return t.markerCode === 'COLESTEROL_TOTAL' && t.currentStatus.severity !== 'NORMAL'; })) {
                            recommendations.push('Considere atividade física regular e dieta para controle do colesterol');
                        }
                        return [2 /*return*/, {
                                patientId: patientId,
                                totalMarkers: totalMarkers,
                                markersWithData: markersWithData,
                                criticalAlerts: criticalAlerts,
                                warnings: warnings,
                                overallHealth: overallHealth,
                                topConcerns: topConcerns.slice(0, 5),
                                positiveChanges: positiveChanges.slice(0, 3),
                                recommendations: recommendations.slice(0, 5)
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // MÉTODOS AUXILIARES
    // ==========================================================================
    TrendsService.prototype.determineCurrentStatus = function (value, status, refMin, refMax) {
        var isInRange = refMin !== undefined && refMax !== undefined
            ? value >= refMin && value <= refMax
            : status === 'NORMAL';
        var severity;
        if (status.includes('CRITICAL')) {
            severity = 'CRITICAL';
        }
        else if (status === 'HIGH' || status === 'LOW') {
            severity = 'WARNING';
        }
        else {
            severity = 'NORMAL';
        }
        return {
            isInRange: isInRange,
            status: status,
            severity: severity
        };
    };
    TrendsService.prototype.generateInsightsAndAlerts = function (markerCode, markerName, dataPoints, statistics, trend, currentStatus) {
        var insights = [];
        var alerts = [];
        if (!statistics || !trend) {
            return { insights: insights, alerts: alerts };
        }
        // Insight sobre tendência
        if (trend.confidence > 0.5) {
            insights.push(trend.description);
        }
        // Insight sobre variabilidade
        if (statistics.count >= 5) {
            var cv = (statistics.stdDev / statistics.mean) * 100; // Coeficiente de variação
            if (cv > 20) {
                insights.push("Valores com alta variabilidade (".concat(cv.toFixed(1), "% de varia\u00E7\u00E3o)"));
            }
            else if (cv < 5) {
                insights.push('Valores consistentes e estáveis ao longo do tempo');
            }
        }
        // Insight sobre mudança recente
        if (statistics.changePercent !== 0) {
            var direction = statistics.changePercent > 0 ? 'aumento' : 'redução';
            insights.push("".concat(Math.abs(statistics.changePercent).toFixed(1), "% de ").concat(direction, " desde o primeiro exame"));
        }
        // Alertas críticos
        if (currentStatus.severity === 'CRITICAL') {
            alerts.push("\u26A0\uFE0F CR\u00CDTICO: ".concat(markerName, " em ").concat(statistics.latest, " ").concat(dataPoints[0].unit));
            alerts.push('Procure atendimento médico imediatamente');
        }
        // Alertas de tendência preocupante
        if (trend.direction === 'UP' && ['GLICEMIA_JEJUM', 'COLESTEROL_TOTAL', 'TRIGLICERIDEOS', 'CREATININA'].includes(markerCode)) {
            if (Math.abs(trend.slope) > 5) {
                alerts.push("\u26A0\uFE0F Tend\u00EAncia de alta acentuada em ".concat(markerName, ". Consulte seu m\u00E9dico."));
            }
        }
        if (trend.direction === 'DOWN' && ['HEMOGLOBINA', 'HDL_COLESTEROL'].includes(markerCode)) {
            if (Math.abs(trend.slope) > 5) {
                alerts.push("\u26A0\uFE0F Tend\u00EAncia de queda acentuada em ".concat(markerName, ". Consulte seu m\u00E9dico."));
            }
        }
        // Alerta de valor fora da faixa
        if (!currentStatus.isInRange && currentStatus.severity === 'WARNING') {
            alerts.push("\u26A0\uFE0F ".concat(markerName, " fora da faixa de refer\u00EAncia"));
        }
        return { insights: insights, alerts: alerts };
    };
    return TrendsService;
}());
exports.TrendsService = TrendsService;
exports.trendsService = new TrendsService();
