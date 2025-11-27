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
exports.alertsService = void 0;
exports.getPatientAlerts = getPatientAlerts;
exports.markAlertAsRead = markAlertAsRead;
exports.markAllAlertsAsRead = markAllAlertsAsRead;
exports.resolveAlert = resolveAlert;
exports.countUnreadAlerts = countUnreadAlerts;
exports.generateAlertsForPatient = generateAlertsForPatient;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
/**
 * SERVIÇO DE ALERTAS MEDICAMENTOSOS
 *
 * Lógica para geração e gerenciamento de alertas do sistema.
 */
// ============================================================================
// HELPER: Normalizar nome de medicamento
// ============================================================================
/**
 * Normaliza nome de medicamento para comparação
 * Remove acentos, converte para minúsculas, remove espaços extras
 */
function normalizeDrugName(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/\s+/g, ' ') // Remove espaços extras
        .trim();
}
// ============================================================================
// LISTAR ALERTAS
// ============================================================================
function getPatientAlerts(patientId, userId, filters) {
    return __awaiter(this, void 0, void 0, function () {
        var type, severity, read, resolved, medicationId, _a, limit, _b, offset, where, _c, alerts, total;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: 
                // Verificar acesso (paciente, cuidador ou profissional)
                return [4 /*yield*/, verifyPatientAccess(patientId, userId)];
                case 1:
                    // Verificar acesso (paciente, cuidador ou profissional)
                    _d.sent();
                    type = filters.type, severity = filters.severity, read = filters.read, resolved = filters.resolved, medicationId = filters.medicationId, _a = filters.limit, limit = _a === void 0 ? 50 : _a, _b = filters.offset, offset = _b === void 0 ? 0 : _b;
                    where = {
                        patientId: patientId,
                    };
                    if (type !== undefined)
                        where.type = type;
                    if (severity !== undefined)
                        where.severity = severity;
                    if (read !== undefined)
                        where.read = read;
                    if (resolved !== undefined)
                        where.resolved = resolved;
                    if (medicationId !== undefined)
                        where.medicationId = medicationId;
                    return [4 /*yield*/, Promise.all([
                            prisma.medicationAlert.findMany({
                                where: where,
                                include: {
                                    medication: {
                                        select: {
                                            id: true,
                                            name: true,
                                            dosage: true,
                                        },
                                    },
                                },
                                orderBy: [
                                    { resolved: 'asc' }, // Não resolvidos primeiro
                                    { read: 'asc' }, // Não lidos primeiro
                                    { severity: 'desc' }, // Mais severos primeiro
                                    { triggeredAt: 'desc' }, // Mais recentes primeiro
                                ],
                                take: limit,
                                skip: offset,
                            }),
                            prisma.medicationAlert.count({ where: where }),
                        ])];
                case 2:
                    _c = _d.sent(), alerts = _c[0], total = _c[1];
                    return [2 /*return*/, {
                            alerts: alerts,
                            total: total,
                            limit: limit,
                            offset: offset,
                            hasMore: offset + alerts.length < total,
                        }];
            }
        });
    });
}
// ============================================================================
// MARCAR ALERTA COMO LIDO
// ============================================================================
function markAlertAsRead(alertId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var alert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medicationAlert.findUnique({
                        where: { id: alertId },
                        include: { patient: true },
                    })];
                case 1:
                    alert = _a.sent();
                    if (!alert) {
                        throw new Error('Alerta não encontrado');
                    }
                    // Verificar acesso
                    return [4 /*yield*/, verifyPatientAccess(alert.patientId, userId)];
                case 2:
                    // Verificar acesso
                    _a.sent();
                    return [4 /*yield*/, prisma.medicationAlert.update({
                            where: { id: alertId },
                            data: {
                                read: true,
                                readAt: new Date(),
                            },
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// MARCAR TODOS ALERTAS COMO LIDOS
// ============================================================================
function markAllAlertsAsRead(patientId, userId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var where, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, verifyPatientAccess(patientId, userId)];
                case 1:
                    _a.sent();
                    where = {
                        patientId: patientId,
                        read: false,
                    };
                    if (type) {
                        where.type = type;
                    }
                    return [4 /*yield*/, prisma.medicationAlert.updateMany({
                            where: where,
                            data: {
                                read: true,
                                readAt: new Date(),
                            },
                        })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.count];
            }
        });
    });
}
// ============================================================================
// MARCAR ALERTA COMO RESOLVIDO
// ============================================================================
function resolveAlert(alertId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var alert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medicationAlert.findUnique({
                        where: { id: alertId },
                        include: { patient: true },
                    })];
                case 1:
                    alert = _a.sent();
                    if (!alert) {
                        throw new Error('Alerta não encontrado');
                    }
                    return [4 /*yield*/, verifyPatientAccess(alert.patientId, userId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.medicationAlert.update({
                            where: { id: alertId },
                            data: {
                                resolved: true,
                                resolvedAt: new Date(),
                                read: true, // Auto-marcar como lido também
                                readAt: alert.readAt || new Date(),
                            },
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// CONTAR ALERTAS NÃO LIDOS
// ============================================================================
function countUnreadAlerts(patientId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, verifyPatientAccess(patientId, userId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, prisma.medicationAlert.count({
                            where: {
                                patientId: patientId,
                                read: false,
                                resolved: false,
                            },
                        })];
            }
        });
    });
}
// ============================================================================
// GERAÇÃO DE ALERTAS
// ============================================================================
/**
 * Gera todos os alertas para um paciente
 */
function generateAlertsForPatient(patientId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Limpar alertas antigos não resolvidos (exceto DOSE_TIME que são pontuais)
                return [4 /*yield*/, prisma.medicationAlert.deleteMany({
                        where: {
                            patientId: patientId,
                            resolved: false,
                            type: {
                                not: client_1.MedicationAlertType.DOSE_TIME,
                            },
                            triggeredAt: {
                                lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Mais de 24h
                            },
                        },
                    })
                    // Gerar alertas
                ];
                case 1:
                    // Limpar alertas antigos não resolvidos (exceto DOSE_TIME que são pontuais)
                    _a.sent();
                    // Gerar alertas
                    return [4 /*yield*/, Promise.all([
                            generateDoseTimeAlerts(patientId),
                            generateDrugInteractionAlerts(patientId),
                            generateDrugFoodInteractionAlerts(patientId),
                            generateStockAlerts(patientId),
                            generateTreatmentEndingAlerts(patientId),
                        ])];
                case 2:
                    // Gerar alertas
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * 1. DOSE_TIME - Alertas de horários de medicamentos
 */
function generateDoseTimeAlerts(patientId) {
    return __awaiter(this, void 0, void 0, function () {
        var now, next2Hours, upcomingSchedules, _i, upcomingSchedules_1, schedule, existingAlert, timeUntil, hours, minutes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date();
                    next2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                    return [4 /*yield*/, prisma.medicationSchedule.findMany({
                            where: {
                                patientId: patientId,
                                taken: false,
                                scheduledFor: {
                                    gte: now,
                                    lte: next2Hours,
                                },
                            },
                            include: {
                                medication: true,
                            },
                        })
                        // Criar alertas para cada horário próximo
                    ];
                case 1:
                    upcomingSchedules = _a.sent();
                    _i = 0, upcomingSchedules_1 = upcomingSchedules;
                    _a.label = 2;
                case 2:
                    if (!(_i < upcomingSchedules_1.length)) return [3 /*break*/, 6];
                    schedule = upcomingSchedules_1[_i];
                    return [4 /*yield*/, prisma.medicationAlert.findFirst({
                            where: {
                                patientId: patientId,
                                medicationId: schedule.medicationId,
                                type: client_1.MedicationAlertType.DOSE_TIME,
                                metadata: {
                                    path: ['scheduleId'],
                                    equals: schedule.id,
                                },
                                resolved: false,
                            },
                        })];
                case 3:
                    existingAlert = _a.sent();
                    if (!!existingAlert) return [3 /*break*/, 5];
                    timeUntil = Math.round((schedule.scheduledFor.getTime() - now.getTime()) / (60 * 1000));
                    hours = schedule.scheduledFor.getHours();
                    minutes = schedule.scheduledFor.getMinutes();
                    return [4 /*yield*/, prisma.medicationAlert.create({
                            data: {
                                patientId: patientId,
                                medicationId: schedule.medicationId,
                                type: client_1.MedicationAlertType.DOSE_TIME,
                                severity: timeUntil <= 30 ? client_1.AlertSeverity.HIGH : client_1.AlertSeverity.MEDIUM,
                                title: "Lembrete: ".concat(schedule.medication.name),
                                message: "Tomar ".concat(schedule.medication.dosage, " \u00E0s ").concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0')),
                                actionUrl: "/paciente/medicamentos/".concat(schedule.medicationId),
                                metadata: {
                                    scheduleId: schedule.id,
                                    scheduledFor: schedule.scheduledFor.toISOString(),
                                    minutesUntil: timeUntil,
                                },
                            },
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * 2. DRUG_INTERACTION - Alertas de interações medicamentosas
 */
function generateDrugInteractionAlerts(patientId) {
    return __awaiter(this, void 0, void 0, function () {
        var medications, normalizedMeds, i, j, medA, medB, interaction, existingAlert;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medication.findMany({
                        where: {
                            patientId: patientId,
                            active: true,
                        },
                        select: {
                            id: true,
                            name: true,
                        },
                    })];
                case 1:
                    medications = _a.sent();
                    if (medications.length < 2)
                        return [2 /*return*/]; // Precisa de pelo menos 2 medicamentos
                    normalizedMeds = medications.map(function (med) { return (__assign(__assign({}, med), { normalizedName: normalizeDrugName(med.name) })); });
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < normalizedMeds.length)) return [3 /*break*/, 9];
                    j = i + 1;
                    _a.label = 3;
                case 3:
                    if (!(j < normalizedMeds.length)) return [3 /*break*/, 8];
                    medA = normalizedMeds[i];
                    medB = normalizedMeds[j];
                    return [4 /*yield*/, prisma.drugInteraction.findFirst({
                            where: {
                                OR: [
                                    { drugA: medA.normalizedName, drugB: medB.normalizedName },
                                    { drugA: medB.normalizedName, drugB: medA.normalizedName },
                                ],
                            },
                        })];
                case 4:
                    interaction = _a.sent();
                    if (!interaction) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.medicationAlert.findFirst({
                            where: {
                                patientId: patientId,
                                type: client_1.MedicationAlertType.DRUG_INTERACTION,
                                metadata: {
                                    path: ['interactionId'],
                                    equals: interaction.id,
                                },
                                resolved: false,
                            },
                        })];
                case 5:
                    existingAlert = _a.sent();
                    if (!!existingAlert) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.medicationAlert.create({
                            data: {
                                patientId: patientId,
                                medicationId: medA.id, // Associar ao primeiro medicamento
                                type: client_1.MedicationAlertType.DRUG_INTERACTION,
                                severity: interaction.severity,
                                title: "Intera\u00E7\u00E3o: ".concat(medA.name, " + ").concat(medB.name),
                                message: interaction.description,
                                actionUrl: "/paciente/medicamentos",
                                metadata: {
                                    interactionId: interaction.id,
                                    drugAId: medA.id,
                                    drugAName: medA.name,
                                    drugBId: medB.id,
                                    drugBName: medB.name,
                                    recommendation: interaction.recommendation,
                                    source: interaction.source,
                                },
                            },
                        })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    j++;
                    return [3 /*break*/, 3];
                case 8:
                    i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * 3. FOOD_INTERACTION - Alertas de interações com alimentos
 */
function generateDrugFoodInteractionAlerts(patientId) {
    return __awaiter(this, void 0, void 0, function () {
        var medications, _i, medications_1, med, normalizedName, foodInteractions, _a, foodInteractions_1, interaction, existingAlert;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prisma.medication.findMany({
                        where: {
                            patientId: patientId,
                            active: true,
                        },
                        select: {
                            id: true,
                            name: true,
                        },
                    })];
                case 1:
                    medications = _b.sent();
                    if (medications.length === 0)
                        return [2 /*return*/];
                    _i = 0, medications_1 = medications;
                    _b.label = 2;
                case 2:
                    if (!(_i < medications_1.length)) return [3 /*break*/, 9];
                    med = medications_1[_i];
                    normalizedName = normalizeDrugName(med.name);
                    return [4 /*yield*/, prisma.drugFoodInteraction.findMany({
                            where: {
                                drugName: normalizedName,
                            },
                        })];
                case 3:
                    foodInteractions = _b.sent();
                    _a = 0, foodInteractions_1 = foodInteractions;
                    _b.label = 4;
                case 4:
                    if (!(_a < foodInteractions_1.length)) return [3 /*break*/, 8];
                    interaction = foodInteractions_1[_a];
                    return [4 /*yield*/, prisma.medicationAlert.findFirst({
                            where: {
                                patientId: patientId,
                                medicationId: med.id,
                                type: client_1.MedicationAlertType.FOOD_INTERACTION,
                                metadata: {
                                    path: ['foodInteractionId'],
                                    equals: interaction.id,
                                },
                                resolved: false,
                            },
                        })];
                case 5:
                    existingAlert = _b.sent();
                    if (!!existingAlert) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.medicationAlert.create({
                            data: {
                                patientId: patientId,
                                medicationId: med.id,
                                type: client_1.MedicationAlertType.FOOD_INTERACTION,
                                severity: interaction.severity,
                                title: "".concat(med.name, " + ").concat(interaction.foodName),
                                message: interaction.description,
                                actionUrl: "/paciente/medicamentos/".concat(med.id),
                                metadata: {
                                    foodInteractionId: interaction.id,
                                    foodName: interaction.foodName,
                                    recommendation: interaction.recommendation,
                                    source: interaction.source,
                                },
                            },
                        })];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 4];
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * 4. STOCK_ALERTS - Alertas de estoque baixo
 */
function generateStockAlerts(patientId) {
    return __awaiter(this, void 0, void 0, function () {
        var medications, _i, medications_2, med, _a, currentQuantity, initialQuantity, lowStockThreshold, criticalStockThreshold, percentRemaining, alertType, severity, title, message, existingAlert;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prisma.medication.findMany({
                        where: {
                            patientId: patientId,
                            active: true,
                        },
                        include: {
                            stock: true,
                        },
                    })];
                case 1:
                    medications = _b.sent();
                    _i = 0, medications_2 = medications;
                    _b.label = 2;
                case 2:
                    if (!(_i < medications_2.length)) return [3 /*break*/, 6];
                    med = medications_2[_i];
                    if (!med.stock)
                        return [3 /*break*/, 5];
                    _a = med.stock, currentQuantity = _a.currentQuantity, initialQuantity = _a.initialQuantity, lowStockThreshold = _a.lowStockThreshold, criticalStockThreshold = _a.criticalStockThreshold;
                    percentRemaining = (currentQuantity / initialQuantity) * 100;
                    alertType = null;
                    severity = client_1.AlertSeverity.LOW;
                    title = '';
                    message = '';
                    // Última unidade
                    if (currentQuantity === 1) {
                        alertType = client_1.MedicationAlertType.STOCK_LAST_UNIT;
                        severity = client_1.AlertSeverity.CRITICAL;
                        title = "\u00DALTIMA UNIDADE: ".concat(med.name);
                        message = "Resta apenas 1 ".concat(med.stock.unitType.toLowerCase(), " de ").concat(med.name, ". Reabaste\u00E7a URGENTEMENTE!");
                    }
                    // Estoque crítico (10%)
                    else if (percentRemaining <= criticalStockThreshold) {
                        alertType = client_1.MedicationAlertType.STOCK_CRITICAL;
                        severity = client_1.AlertSeverity.CRITICAL;
                        title = "Estoque Cr\u00EDtico: ".concat(med.name);
                        message = "Apenas ".concat(currentQuantity, " ").concat(med.stock.unitType.toLowerCase(), "(s) restantes (").concat(percentRemaining.toFixed(0), "%). Reabaste\u00E7a urgentemente!");
                    }
                    // Estoque baixo (30%)
                    else if (percentRemaining <= lowStockThreshold) {
                        alertType = client_1.MedicationAlertType.STOCK_LOW;
                        severity = client_1.AlertSeverity.MEDIUM;
                        title = "Estoque Baixo: ".concat(med.name);
                        message = "".concat(currentQuantity, " ").concat(med.stock.unitType.toLowerCase(), "(s) restantes (").concat(percentRemaining.toFixed(0), "%). Considere reabastecer em breve.");
                    }
                    if (!alertType) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.medicationAlert.findFirst({
                            where: {
                                patientId: patientId,
                                medicationId: med.id,
                                type: alertType,
                                resolved: false,
                            },
                        })];
                case 3:
                    existingAlert = _b.sent();
                    if (!!existingAlert) return [3 /*break*/, 5];
                    return [4 /*yield*/, prisma.medicationAlert.create({
                            data: {
                                patientId: patientId,
                                medicationId: med.id,
                                type: alertType,
                                severity: severity,
                                title: title,
                                message: message,
                                actionUrl: "/paciente/medicamentos/".concat(med.id),
                                metadata: {
                                    stockId: med.stock.id,
                                    currentQuantity: currentQuantity,
                                    initialQuantity: initialQuantity,
                                    percentRemaining: percentRemaining.toFixed(2),
                                    unitType: med.stock.unitType,
                                },
                            },
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * 5. TREATMENT_ENDING - Alertas de fim de tratamento
 */
function generateTreatmentEndingAlerts(patientId) {
    return __awaiter(this, void 0, void 0, function () {
        var now, in7Days, medications, _i, medications_3, med, daysUntilEnd, existingAlert, severity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date();
                    in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                    return [4 /*yield*/, prisma.medication.findMany({
                            where: {
                                patientId: patientId,
                                active: true,
                                endDate: {
                                    gte: now,
                                    lte: in7Days,
                                },
                            },
                        })];
                case 1:
                    medications = _a.sent();
                    _i = 0, medications_3 = medications;
                    _a.label = 2;
                case 2:
                    if (!(_i < medications_3.length)) return [3 /*break*/, 6];
                    med = medications_3[_i];
                    if (!med.endDate)
                        return [3 /*break*/, 5];
                    daysUntilEnd = Math.ceil((med.endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                    return [4 /*yield*/, prisma.medicationAlert.findFirst({
                            where: {
                                patientId: patientId,
                                medicationId: med.id,
                                type: client_1.MedicationAlertType.TREATMENT_ENDING,
                                resolved: false,
                            },
                        })];
                case 3:
                    existingAlert = _a.sent();
                    if (!!existingAlert) return [3 /*break*/, 5];
                    severity = daysUntilEnd <= 3
                        ? client_1.AlertSeverity.HIGH
                        : daysUntilEnd <= 5
                            ? client_1.AlertSeverity.MEDIUM
                            : client_1.AlertSeverity.LOW;
                    return [4 /*yield*/, prisma.medicationAlert.create({
                            data: {
                                patientId: patientId,
                                medicationId: med.id,
                                type: client_1.MedicationAlertType.TREATMENT_ENDING,
                                severity: severity,
                                title: "Tratamento Terminando: ".concat(med.name),
                                message: "O tratamento com ".concat(med.name, " termina em ").concat(daysUntilEnd, " dia(s). Consulte seu m\u00E9dico se necess\u00E1rio."),
                                actionUrl: "/paciente/medicamentos/".concat(med.id),
                                metadata: {
                                    endDate: med.endDate.toISOString(),
                                    daysUntilEnd: daysUntilEnd,
                                },
                            },
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// VERIFICAÇÃO DE ACESSO
// ============================================================================
function verifyPatientAccess(patientId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, hasAccess, hasAccess;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: userId },
                        include: {
                            patient: true,
                            caregiver: {
                                include: {
                                    patients: true,
                                },
                            },
                            professional: {
                                include: {
                                    patients: true,
                                },
                            },
                        },
                    })];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        throw new Error('Usuário não encontrado');
                    }
                    // Paciente próprio
                    if (((_a = user.patient) === null || _a === void 0 ? void 0 : _a.id) === patientId) {
                        return [2 /*return*/];
                    }
                    // Cuidador deste paciente
                    if (user.caregiver) {
                        hasAccess = user.caregiver.patients.some(function (p) { return p.patientId === patientId; });
                        if (hasAccess)
                            return [2 /*return*/];
                    }
                    // Profissional deste paciente
                    if (user.professional) {
                        hasAccess = user.professional.patients.some(function (p) { return p.patientId === patientId; });
                        if (hasAccess)
                            return [2 /*return*/];
                    }
                    throw new Error('Acesso negado');
            }
        });
    });
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.alertsService = {
    getPatientAlerts: getPatientAlerts,
    markAlertAsRead: markAlertAsRead,
    markAllAlertsAsRead: markAllAlertsAsRead,
    resolveAlert: resolveAlert,
    countUnreadAlerts: countUnreadAlerts,
    generateAlertsForPatient: generateAlertsForPatient,
};
