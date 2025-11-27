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
exports.medicationsService = exports.MedicationsService = void 0;
var prisma_1 = require("../database/prisma");
var MedicationsService = /** @class */ (function () {
    function MedicationsService() {
    }
    // Listar medicamentos de um paciente
    MedicationsService.prototype.getMedications = function (patientId_1) {
        return __awaiter(this, arguments, void 0, function (patientId, activeOnly) {
            var medications;
            if (activeOnly === void 0) { activeOnly = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medication.findMany({
                            where: __assign({ patientId: patientId }, (activeOnly && { active: true })),
                            orderBy: { createdAt: 'desc' },
                            include: {
                                schedules: {
                                    where: {
                                        scheduledFor: { gte: new Date() },
                                        taken: false,
                                    },
                                    orderBy: { scheduledFor: 'asc' },
                                    take: 5,
                                },
                            },
                        })];
                    case 1:
                        medications = _a.sent();
                        return [2 /*return*/, medications.map(function (med) {
                                var _a;
                                return ({
                                    id: med.id,
                                    patientId: med.patientId,
                                    name: med.name,
                                    dosage: med.dosage,
                                    frequency: med.frequency,
                                    startDate: med.startDate.toISOString(),
                                    endDate: (_a = med.endDate) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                    instructions: med.instructions,
                                    prescribedBy: med.prescribedBy,
                                    active: med.active,
                                    createdAt: med.createdAt.toISOString(),
                                    updatedAt: med.updatedAt.toISOString(),
                                    upcomingSchedules: med.schedules.map(function (s) { return ({
                                        id: s.id,
                                        scheduledFor: s.scheduledFor.toISOString(),
                                        taken: s.taken,
                                    }); }),
                                });
                            })];
                }
            });
        });
    };
    // Obter um medicamento específico
    MedicationsService.prototype.getMedicationById = function (medicationId) {
        return __awaiter(this, void 0, void 0, function () {
            var medication;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medication.findUnique({
                            where: { id: medicationId },
                            include: {
                                patient: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                schedules: {
                                    orderBy: { scheduledFor: 'desc' },
                                    take: 10,
                                },
                            },
                        })];
                    case 1:
                        medication = _b.sent();
                        if (!medication) {
                            throw new Error('Medicamento não encontrado');
                        }
                        return [2 /*return*/, {
                                id: medication.id,
                                patientId: medication.patientId,
                                patientName: medication.patient.name,
                                name: medication.name,
                                dosage: medication.dosage,
                                frequency: medication.frequency,
                                startDate: medication.startDate.toISOString(),
                                endDate: (_a = medication.endDate) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                instructions: medication.instructions,
                                prescribedBy: medication.prescribedBy,
                                active: medication.active,
                                createdAt: medication.createdAt.toISOString(),
                                updatedAt: medication.updatedAt.toISOString(),
                                schedules: medication.schedules.map(function (s) {
                                    var _a;
                                    return ({
                                        id: s.id,
                                        scheduledFor: s.scheduledFor.toISOString(),
                                        taken: s.taken,
                                        takenAt: (_a = s.takenAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                    });
                                }),
                            }];
                }
            });
        });
    };
    // Criar medicamento
    MedicationsService.prototype.createMedication = function (data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var medication;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // Verificar se o usuário tem acesso a esse paciente
                    return [4 /*yield*/, this.verifyPatientAccess(data.patientId, userId)];
                    case 1:
                        // Verificar se o usuário tem acesso a esse paciente
                        _b.sent();
                        return [4 /*yield*/, prisma_1.prisma.medication.create({
                                data: {
                                    patientId: data.patientId,
                                    name: data.name,
                                    dosage: data.dosage,
                                    frequency: data.frequency,
                                    startDate: new Date(data.startDate),
                                    endDate: data.endDate ? new Date(data.endDate) : undefined,
                                    instructions: data.instructions,
                                    prescribedBy: data.prescribedBy,
                                    active: true,
                                },
                            })];
                    case 2:
                        medication = _b.sent();
                        return [2 /*return*/, {
                                id: medication.id,
                                patientId: medication.patientId,
                                name: medication.name,
                                dosage: medication.dosage,
                                frequency: medication.frequency,
                                startDate: medication.startDate.toISOString(),
                                endDate: (_a = medication.endDate) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                instructions: medication.instructions,
                                prescribedBy: medication.prescribedBy,
                                active: medication.active,
                                createdAt: medication.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Atualizar medicamento
    MedicationsService.prototype.updateMedication = function (medicationId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var medication, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medication.findUnique({
                            where: { id: medicationId },
                        })];
                    case 1:
                        medication = _b.sent();
                        if (!medication) {
                            throw new Error('Medicamento não encontrado');
                        }
                        // Verificar acesso
                        return [4 /*yield*/, this.verifyPatientAccess(medication.patientId, userId)];
                    case 2:
                        // Verificar acesso
                        _b.sent();
                        return [4 /*yield*/, prisma_1.prisma.medication.update({
                                where: { id: medicationId },
                                data: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (data.name && { name: data.name })), (data.dosage && { dosage: data.dosage })), (data.frequency && { frequency: data.frequency })), (data.startDate && { startDate: new Date(data.startDate) })), (data.endDate !== undefined && {
                                    endDate: data.endDate ? new Date(data.endDate) : null,
                                })), (data.instructions !== undefined && { instructions: data.instructions })), (data.prescribedBy !== undefined && { prescribedBy: data.prescribedBy })), (data.active !== undefined && { active: data.active })),
                            })];
                    case 3:
                        updated = _b.sent();
                        return [2 /*return*/, {
                                id: updated.id,
                                patientId: updated.patientId,
                                name: updated.name,
                                dosage: updated.dosage,
                                frequency: updated.frequency,
                                startDate: updated.startDate.toISOString(),
                                endDate: (_a = updated.endDate) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                instructions: updated.instructions,
                                prescribedBy: updated.prescribedBy,
                                active: updated.active,
                                updatedAt: updated.updatedAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Deletar medicamento
    MedicationsService.prototype.deleteMedication = function (medicationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var medication;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medication.findUnique({
                            where: { id: medicationId },
                        })];
                    case 1:
                        medication = _a.sent();
                        if (!medication) {
                            throw new Error('Medicamento não encontrado');
                        }
                        // Verificar acesso
                        return [4 /*yield*/, this.verifyPatientAccess(medication.patientId, userId)
                            // Soft delete (marcar como inativo) ao invés de deletar
                        ];
                    case 2:
                        // Verificar acesso
                        _a.sent();
                        // Soft delete (marcar como inativo) ao invés de deletar
                        return [4 /*yield*/, prisma_1.prisma.medication.update({
                                where: { id: medicationId },
                                data: { active: false },
                            })];
                    case 3:
                        // Soft delete (marcar como inativo) ao invés de deletar
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // Verificar se o usuário tem acesso ao paciente
    MedicationsService.prototype.verifyPatientAccess = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                patient: true,
                                caregiver: {
                                    include: {
                                        patients: {
                                            where: { patientId: patientId },
                                        },
                                    },
                                },
                                professional: {
                                    include: {
                                        patients: {
                                            where: { patientId: patientId },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Usuário não encontrado');
                        }
                        // Paciente pode acessar seus próprios medicamentos
                        if (user.patient && user.patient.id === patientId) {
                            return [2 /*return*/, true];
                        }
                        // Cuidador pode acessar medicamentos dos pacientes sob seus cuidados
                        if (user.caregiver && user.caregiver.patients.length > 0) {
                            return [2 /*return*/, true];
                        }
                        // Profissional pode acessar medicamentos dos seus pacientes
                        if (user.professional && user.professional.patients.length > 0) {
                            return [2 /*return*/, true];
                        }
                        throw new Error('Acesso negado');
                }
            });
        });
    };
    return MedicationsService;
}());
exports.MedicationsService = MedicationsService;
exports.medicationsService = new MedicationsService();
