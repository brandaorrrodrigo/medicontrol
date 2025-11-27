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
exports.stockService = void 0;
exports.createMedicationStock = createMedicationStock;
exports.getMedicationStock = getMedicationStock;
exports.updateMedicationStock = updateMedicationStock;
exports.consumeMedicationStock = consumeMedicationStock;
exports.restockMedication = restockMedication;
exports.deleteMedicationStock = deleteMedicationStock;
var client_1 = require("@prisma/client");
var alerts_service_1 = require("./alerts.service");
var prisma = new client_1.PrismaClient();
/**
 * SERVIÇO DE GERENCIAMENTO DE ESTOQUE
 *
 * Funções para criar, atualizar e consumir estoque de medicamentos.
 */
// ============================================================================
// CRIAR ESTOQUE
// ============================================================================
function createMedicationStock(data, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var medication, existingStock, stock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medication.findUnique({
                        where: { id: data.medicationId },
                        include: { patient: true },
                    })];
                case 1:
                    medication = _a.sent();
                    if (!medication) {
                        throw new Error('Medicamento não encontrado');
                    }
                    // Verificar acesso
                    return [4 /*yield*/, verifyMedicationAccess(medication.patientId, userId)
                        // Verificar se já existe estoque para este medicamento
                    ];
                case 2:
                    // Verificar acesso
                    _a.sent();
                    return [4 /*yield*/, prisma.medicationStock.findUnique({
                            where: { medicationId: data.medicationId },
                        })];
                case 3:
                    existingStock = _a.sent();
                    if (existingStock) {
                        throw new Error('Estoque já existe para este medicamento');
                    }
                    return [4 /*yield*/, prisma.medicationStock.create({
                            data: {
                                medicationId: data.medicationId,
                                currentQuantity: data.currentQuantity,
                                initialQuantity: data.initialQuantity,
                                unitType: data.unitType,
                                lowStockThreshold: data.lowStockThreshold || 30,
                                criticalStockThreshold: data.criticalStockThreshold || 10,
                                lastRestockDate: data.lastRestockDate
                                    ? new Date(data.lastRestockDate)
                                    : null,
                                nextRestockDate: data.nextRestockDate
                                    ? new Date(data.nextRestockDate)
                                    : null,
                                notes: data.notes,
                            },
                        })
                        // Regenerar alertas de estoque
                    ];
                case 4:
                    stock = _a.sent();
                    // Regenerar alertas de estoque
                    return [4 /*yield*/, alerts_service_1.alertsService.generateAlertsForPatient(medication.patientId)];
                case 5:
                    // Regenerar alertas de estoque
                    _a.sent();
                    return [2 /*return*/, stock];
            }
        });
    });
}
// ============================================================================
// OBTER ESTOQUE
// ============================================================================
function getMedicationStock(medicationId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var medication;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medication.findUnique({
                        where: { id: medicationId },
                        include: {
                            stock: true,
                            patient: true,
                        },
                    })];
                case 1:
                    medication = _a.sent();
                    if (!medication) {
                        throw new Error('Medicamento não encontrado');
                    }
                    return [4 /*yield*/, verifyMedicationAccess(medication.patientId, userId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, medication.stock];
            }
        });
    });
}
// ============================================================================
// ATUALIZAR ESTOQUE
// ============================================================================
function updateMedicationStock(medicationId, data, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var medication, updateData, updatedStock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medication.findUnique({
                        where: { id: medicationId },
                        include: {
                            stock: true,
                            patient: true,
                        },
                    })];
                case 1:
                    medication = _a.sent();
                    if (!medication) {
                        throw new Error('Medicamento não encontrado');
                    }
                    if (!medication.stock) {
                        throw new Error('Estoque não encontrado para este medicamento');
                    }
                    return [4 /*yield*/, verifyMedicationAccess(medication.patientId, userId)
                        // Atualizar estoque
                    ];
                case 2:
                    _a.sent();
                    updateData = {};
                    if (data.currentQuantity !== undefined) {
                        updateData.currentQuantity = data.currentQuantity;
                    }
                    if (data.lowStockThreshold !== undefined) {
                        updateData.lowStockThreshold = data.lowStockThreshold;
                    }
                    if (data.criticalStockThreshold !== undefined) {
                        updateData.criticalStockThreshold = data.criticalStockThreshold;
                    }
                    if (data.lastRestockDate !== undefined) {
                        updateData.lastRestockDate = data.lastRestockDate
                            ? new Date(data.lastRestockDate)
                            : null;
                    }
                    if (data.nextRestockDate !== undefined) {
                        updateData.nextRestockDate = data.nextRestockDate
                            ? new Date(data.nextRestockDate)
                            : null;
                    }
                    if (data.notes !== undefined) {
                        updateData.notes = data.notes;
                    }
                    return [4 /*yield*/, prisma.medicationStock.update({
                            where: { id: medication.stock.id },
                            data: updateData,
                        })
                        // Regenerar alertas de estoque
                    ];
                case 3:
                    updatedStock = _a.sent();
                    // Regenerar alertas de estoque
                    return [4 /*yield*/, alerts_service_1.alertsService.generateAlertsForPatient(medication.patientId)];
                case 4:
                    // Regenerar alertas de estoque
                    _a.sent();
                    return [2 /*return*/, updatedStock];
            }
        });
    });
}
// ============================================================================
// CONSUMIR ESTOQUE (ao tomar medicamento)
// ============================================================================
function consumeMedicationStock(medicationId, quantity, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var medication, updatedStock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medication.findUnique({
                        where: { id: medicationId },
                        include: {
                            stock: true,
                            patient: true,
                        },
                    })];
                case 1:
                    medication = _a.sent();
                    if (!medication) {
                        throw new Error('Medicamento não encontrado');
                    }
                    if (!medication.stock) {
                        throw new Error('Estoque não configurado para este medicamento');
                    }
                    return [4 /*yield*/, verifyMedicationAccess(medication.patientId, userId)
                        // Verificar se há estoque suficiente
                    ];
                case 2:
                    _a.sent();
                    // Verificar se há estoque suficiente
                    if (medication.stock.currentQuantity < quantity) {
                        throw new Error("Estoque insuficiente. Dispon\u00EDvel: ".concat(medication.stock.currentQuantity));
                    }
                    return [4 /*yield*/, prisma.medicationStock.update({
                            where: { id: medication.stock.id },
                            data: {
                                currentQuantity: medication.stock.currentQuantity - quantity,
                            },
                        })
                        // Regenerar alertas de estoque
                    ];
                case 3:
                    updatedStock = _a.sent();
                    // Regenerar alertas de estoque
                    return [4 /*yield*/, alerts_service_1.alertsService.generateAlertsForPatient(medication.patientId)];
                case 4:
                    // Regenerar alertas de estoque
                    _a.sent();
                    return [2 /*return*/, updatedStock];
            }
        });
    });
}
// ============================================================================
// REABASTECER ESTOQUE
// ============================================================================
function restockMedication(medicationId, quantity, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var medication, newQuantity, updatedStock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medication.findUnique({
                        where: { id: medicationId },
                        include: {
                            stock: true,
                            patient: true,
                        },
                    })];
                case 1:
                    medication = _a.sent();
                    if (!medication) {
                        throw new Error('Medicamento não encontrado');
                    }
                    if (!medication.stock) {
                        throw new Error('Estoque não configurado para este medicamento');
                    }
                    return [4 /*yield*/, verifyMedicationAccess(medication.patientId, userId)
                        // Atualizar estoque
                    ];
                case 2:
                    _a.sent();
                    newQuantity = medication.stock.currentQuantity + quantity;
                    return [4 /*yield*/, prisma.medicationStock.update({
                            where: { id: medication.stock.id },
                            data: {
                                currentQuantity: newQuantity,
                                initialQuantity: newQuantity, // Atualizar também a quantidade inicial
                                lastRestockDate: new Date(),
                            },
                        })
                        // Regenerar alertas (pode remover alertas de estoque baixo)
                    ];
                case 3:
                    updatedStock = _a.sent();
                    // Regenerar alertas (pode remover alertas de estoque baixo)
                    return [4 /*yield*/, alerts_service_1.alertsService.generateAlertsForPatient(medication.patientId)];
                case 4:
                    // Regenerar alertas (pode remover alertas de estoque baixo)
                    _a.sent();
                    return [2 /*return*/, updatedStock];
            }
        });
    });
}
// ============================================================================
// DELETAR ESTOQUE
// ============================================================================
function deleteMedicationStock(medicationId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var medication;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.medication.findUnique({
                        where: { id: medicationId },
                        include: {
                            stock: true,
                            patient: true,
                        },
                    })];
                case 1:
                    medication = _a.sent();
                    if (!medication) {
                        throw new Error('Medicamento não encontrado');
                    }
                    if (!medication.stock) {
                        throw new Error('Estoque não encontrado');
                    }
                    return [4 /*yield*/, verifyMedicationAccess(medication.patientId, userId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.medicationStock.delete({
                            where: { id: medication.stock.id },
                        })
                        // Limpar alertas de estoque relacionados
                    ];
                case 3:
                    _a.sent();
                    // Limpar alertas de estoque relacionados
                    return [4 /*yield*/, prisma.medicationAlert.deleteMany({
                            where: {
                                medicationId: medicationId,
                                type: {
                                    in: ['STOCK_LOW', 'STOCK_CRITICAL', 'STOCK_LAST_UNIT'],
                                },
                            },
                        })];
                case 4:
                    // Limpar alertas de estoque relacionados
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// VERIFICAÇÃO DE ACESSO
// ============================================================================
function verifyMedicationAccess(patientId, userId) {
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
exports.stockService = {
    createMedicationStock: createMedicationStock,
    getMedicationStock: getMedicationStock,
    updateMedicationStock: updateMedicationStock,
    consumeMedicationStock: consumeMedicationStock,
    restockMedication: restockMedication,
    deleteMedicationStock: deleteMedicationStock,
};
