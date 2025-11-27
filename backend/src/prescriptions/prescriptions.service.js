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
exports.prescriptionsService = exports.PrescriptionsService = void 0;
// @ts-nocheck
var prisma_1 = require("../database/prisma");
var notifications_service_1 = require("../notifications/notifications.service");
var PrescriptionsService = /** @class */ (function () {
    function PrescriptionsService() {
    }
    // Listar prescrições de um paciente
    PrescriptionsService.prototype.getPrescriptions = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var prescriptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.prescription.findMany({
                            where: { patientId: patientId },
                            orderBy: { date: 'desc' },
                            include: {
                                professional: {
                                    select: {
                                        id: true,
                                        name: true,
                                        specialty: true,
                                        crm: true,
                                    },
                                },
                                items: {
                                    include: {
                                        medication: {
                                            select: {
                                                id: true,
                                                active: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        prescriptions = _a.sent();
                        return [2 /*return*/, prescriptions.map(function (p) { return ({
                                id: p.id,
                                patientId: p.patientId,
                                professionalId: p.professionalId,
                                professional: p.professional,
                                date: p.date.toISOString(),
                                notes: p.notes,
                                createdAt: p.createdAt.toISOString(),
                                items: p.items.map(function (item) {
                                    var _a;
                                    return ({
                                        id: item.id,
                                        medicationName: item.medicationName,
                                        dosage: item.dosage,
                                        frequency: item.frequency,
                                        duration: item.duration,
                                        instructions: item.instructions,
                                        medicationId: item.medicationId,
                                        isActive: ((_a = item.medication) === null || _a === void 0 ? void 0 : _a.active) || false,
                                    });
                                }),
                            }); })];
                }
            });
        });
    };
    // Obter detalhes de uma prescrição
    PrescriptionsService.prototype.getPrescriptionById = function (prescriptionId) {
        return __awaiter(this, void 0, void 0, function () {
            var prescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.prescription.findUnique({
                            where: { id: prescriptionId },
                            include: {
                                patient: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                professional: {
                                    select: {
                                        id: true,
                                        name: true,
                                        specialty: true,
                                        crm: true,
                                    },
                                },
                                items: {
                                    include: {
                                        medication: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        prescription = _a.sent();
                        if (!prescription) {
                            throw new Error('Prescrição não encontrada');
                        }
                        return [2 /*return*/, {
                                id: prescription.id,
                                patientId: prescription.patientId,
                                patientName: prescription.patient.name,
                                professionalId: prescription.professionalId,
                                professional: prescription.professional,
                                date: prescription.date.toISOString(),
                                notes: prescription.notes,
                                createdAt: prescription.createdAt.toISOString(),
                                items: prescription.items.map(function (item) { return ({
                                    id: item.id,
                                    medicationName: item.medicationName,
                                    dosage: item.dosage,
                                    frequency: item.frequency,
                                    duration: item.duration,
                                    instructions: item.instructions,
                                    medicationId: item.medicationId,
                                    medication: item.medication,
                                }); }),
                            }];
                }
            });
        });
    };
    // Criar prescrição
    PrescriptionsService.prototype.createPrescription = function (data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, prescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                professional: {
                                    include: {
                                        patients: {
                                            where: { patientId: data.patientId },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || !user.professional) {
                            throw new Error('Apenas profissionais podem criar prescrições');
                        }
                        if (user.professional.patients.length === 0) {
                            throw new Error('Você não tem acesso a este paciente');
                        }
                        return [4 /*yield*/, prisma_1.prisma.prescription.create({
                                data: {
                                    patientId: data.patientId,
                                    professionalId: user.professional.id,
                                    notes: data.notes,
                                    items: {
                                        create: data.items.map(function (item) { return ({
                                            medicationName: item.medicationName,
                                            dosage: item.dosage,
                                            frequency: item.frequency,
                                            duration: item.duration,
                                            instructions: item.instructions,
                                        }); }),
                                    },
                                },
                                include: {
                                    items: true,
                                    patient: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            })
                            // Criar notificação para o paciente
                        ];
                    case 2:
                        prescription = _a.sent();
                        // Criar notificação para o paciente
                        return [4 /*yield*/, notifications_service_1.notificationsService.createNotification({
                                userId: prescription.patient.user.id,
                                title: 'Nova Prescrição',
                                message: "Voc\u00EA recebeu uma nova prescri\u00E7\u00E3o m\u00E9dica de ".concat(user.professional.name),
                                type: 'INFO',
                            })];
                    case 3:
                        // Criar notificação para o paciente
                        _a.sent();
                        return [2 /*return*/, {
                                id: prescription.id,
                                patientId: prescription.patientId,
                                professionalId: prescription.professionalId,
                                date: prescription.date.toISOString(),
                                notes: prescription.notes,
                                itemsCount: prescription.items.length,
                                createdAt: prescription.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Atualizar prescrição
    PrescriptionsService.prototype.updatePrescription = function (prescriptionId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var prescription, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.prescription.findUnique({
                            where: { id: prescriptionId },
                            include: {
                                professional: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        prescription = _a.sent();
                        if (!prescription) {
                            throw new Error('Prescrição não encontrada');
                        }
                        // Verificar se é o profissional que criou a prescrição
                        if (prescription.professional.user.id !== userId) {
                            throw new Error('Apenas o profissional que criou a prescrição pode alterá-la');
                        }
                        return [4 /*yield*/, prisma_1.prisma.prescription.update({
                                where: { id: prescriptionId },
                                data: __assign({}, (data.notes !== undefined && { notes: data.notes })),
                            })];
                    case 2:
                        updated = _a.sent();
                        return [2 /*return*/, {
                                id: updated.id,
                                notes: updated.notes,
                                updatedAt: updated.updatedAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Adicionar item à prescrição
    PrescriptionsService.prototype.addItem = function (prescriptionId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var prescription, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.prescription.findUnique({
                            where: { id: prescriptionId },
                            include: {
                                professional: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        prescription = _a.sent();
                        if (!prescription) {
                            throw new Error('Prescrição não encontrada');
                        }
                        if (prescription.professional.user.id !== userId) {
                            throw new Error('Acesso negado');
                        }
                        return [4 /*yield*/, prisma_1.prisma.prescriptionItem.create({
                                data: {
                                    prescriptionId: prescriptionId,
                                    medicationName: data.medicationName,
                                    dosage: data.dosage,
                                    frequency: data.frequency,
                                    duration: data.duration,
                                    instructions: data.instructions,
                                },
                            })];
                    case 2:
                        item = _a.sent();
                        return [2 /*return*/, {
                                id: item.id,
                                medicationName: item.medicationName,
                                dosage: item.dosage,
                                frequency: item.frequency,
                                createdAt: item.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Remover item da prescrição
    PrescriptionsService.prototype.removeItem = function (itemId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.prescriptionItem.findUnique({
                            where: { id: itemId },
                            include: {
                                prescription: {
                                    include: {
                                        professional: {
                                            include: {
                                                user: true,
                                            },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        item = _a.sent();
                        if (!item) {
                            throw new Error('Item não encontrado');
                        }
                        if (item.prescription.professional.user.id !== userId) {
                            throw new Error('Acesso negado');
                        }
                        return [4 /*yield*/, prisma_1.prisma.prescriptionItem.delete({
                                where: { id: itemId },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // Deletar prescrição
    PrescriptionsService.prototype.deletePrescription = function (prescriptionId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var prescription;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.prescription.findUnique({
                            where: { id: prescriptionId },
                            include: {
                                professional: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        prescription = _a.sent();
                        if (!prescription) {
                            throw new Error('Prescrição não encontrada');
                        }
                        if (prescription.professional.user.id !== userId) {
                            throw new Error('Acesso negado');
                        }
                        return [4 /*yield*/, prisma_1.prisma.prescription.delete({
                                where: { id: prescriptionId },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    return PrescriptionsService;
}());
exports.PrescriptionsService = PrescriptionsService;
exports.prescriptionsService = new PrescriptionsService();
