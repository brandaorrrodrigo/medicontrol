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
exports.patientsService = exports.PatientsService = void 0;
var prisma_1 = require("../database/prisma");
var PatientsService = /** @class */ (function () {
    function PatientsService() {
    }
    // Listar todos os pacientes (com filtros por role)
    PatientsService.prototype.getPatients = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                patient: true,
                                caregiver: {
                                    include: {
                                        patients: {
                                            include: {
                                                patient: true,
                                            },
                                        },
                                    },
                                },
                                professional: {
                                    include: {
                                        patients: {
                                            include: {
                                                patient: true,
                                            },
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
                        // Se for paciente, retorna apenas ele mesmo
                        if (user.patient) {
                            return [2 /*return*/, [this.formatPatient(user.patient)]];
                        }
                        // Se for cuidador, retorna pacientes sob seus cuidados
                        if (user.caregiver) {
                            return [2 /*return*/, user.caregiver.patients.map(function (pc) { return _this.formatPatient(pc.patient); })];
                        }
                        // Se for profissional, retorna seus pacientes
                        if (user.professional) {
                            return [2 /*return*/, user.professional.patients.map(function (pp) { return _this.formatPatient(pp.patient); })];
                        }
                        return [2 /*return*/, []];
                }
            });
        });
    };
    // Obter detalhes de um paciente
    PatientsService.prototype.getPatientById = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var patient;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar acesso
                    return [4 /*yield*/, this.verifyPatientAccess(patientId, userId)];
                    case 1:
                        // Verificar acesso
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                                where: { id: patientId },
                                include: {
                                    user: {
                                        select: {
                                            email: true,
                                        },
                                    },
                                    caregivers: {
                                        include: {
                                            caregiver: true,
                                        },
                                    },
                                    professionals: {
                                        include: {
                                            professional: true,
                                        },
                                    },
                                    medications: {
                                        where: { active: true },
                                        take: 5,
                                    },
                                    vitalSigns: {
                                        orderBy: { timestamp: 'desc' },
                                        take: 5,
                                    },
                                    exams: {
                                        orderBy: { date: 'desc' },
                                        take: 5,
                                    },
                                },
                            })];
                    case 2:
                        patient = _a.sent();
                        if (!patient) {
                            throw new Error('Paciente não encontrado');
                        }
                        return [2 /*return*/, {
                                id: patient.id,
                                name: patient.name,
                                email: patient.user.email,
                                phone: patient.phone,
                                dateOfBirth: patient.dateOfBirth.toISOString(),
                                age: this.calculateAge(patient.dateOfBirth),
                                gender: patient.gender,
                                bloodType: patient.bloodType,
                                conditions: patient.conditions,
                                allergies: patient.allergies,
                                emergencyContact: patient.emergencyContact,
                                createdAt: patient.createdAt.toISOString(),
                                updatedAt: patient.updatedAt.toISOString(),
                                caregivers: patient.caregivers.map(function (pc) { return ({
                                    id: pc.caregiver.id,
                                    name: pc.caregiver.name,
                                    relationship: pc.caregiver.relationship,
                                }); }),
                                professionals: patient.professionals.map(function (pp) { return ({
                                    id: pp.professional.id,
                                    name: pp.professional.name,
                                    specialty: pp.professional.specialty,
                                    crm: pp.professional.crm,
                                }); }),
                                medications: patient.medications.map(function (m) { return ({
                                    id: m.id,
                                    name: m.name,
                                    dosage: m.dosage,
                                    frequency: m.frequency,
                                }); }),
                                recentVitalSigns: patient.vitalSigns.map(function (v) { return ({
                                    id: v.id,
                                    type: v.type,
                                    value: v.value,
                                    timestamp: v.timestamp.toISOString(),
                                }); }),
                                recentExams: patient.exams.map(function (e) { return ({
                                    id: e.id,
                                    name: e.name,
                                    date: e.date.toISOString(),
                                    status: e.status,
                                }); }),
                            }];
                }
            });
        });
    };
    // Atualizar paciente
    PatientsService.prototype.updatePatient = function (patientId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar acesso
                    return [4 /*yield*/, this.verifyPatientAccess(patientId, userId)];
                    case 1:
                        // Verificar acesso
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.patient.update({
                                where: { id: patientId },
                                data: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (data.name && { name: data.name })), (data.phone !== undefined && { phone: data.phone })), (data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) })), (data.gender && { gender: data.gender })), (data.bloodType !== undefined && { bloodType: data.bloodType })), (data.conditions && { conditions: data.conditions })), (data.allergies && { allergies: data.allergies })), (data.emergencyContact !== undefined && { emergencyContact: data.emergencyContact })),
                            })];
                    case 2:
                        updated = _a.sent();
                        return [2 /*return*/, this.formatPatient(updated)];
                }
            });
        });
    };
    // Vincular cuidador ao paciente
    PatientsService.prototype.linkCaregiver = function (patientId, caregiverId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isOwnPatient, isProfessional, caregiver;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                patient: true,
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
                        isOwnPatient = user.patient && user.patient.id === patientId;
                        isProfessional = user.professional && user.professional.patients.length > 0;
                        if (!isOwnPatient && !isProfessional) {
                            throw new Error('Acesso negado');
                        }
                        return [4 /*yield*/, prisma_1.prisma.caregiver.findUnique({
                                where: { id: caregiverId },
                            })];
                    case 2:
                        caregiver = _a.sent();
                        if (!caregiver) {
                            throw new Error('Cuidador não encontrado');
                        }
                        // Criar vínculo (ou ignorar se já existe)
                        return [4 /*yield*/, prisma_1.prisma.patientCaregiver.upsert({
                                where: {
                                    patientId_caregiverId: {
                                        patientId: patientId,
                                        caregiverId: caregiverId,
                                    },
                                },
                                create: {
                                    patientId: patientId,
                                    caregiverId: caregiverId,
                                },
                                update: {},
                            })];
                    case 3:
                        // Criar vínculo (ou ignorar se já existe)
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Cuidador vinculado com sucesso',
                            }];
                }
            });
        });
    };
    // Desvincular cuidador
    PatientsService.prototype.unlinkCaregiver = function (patientId, caregiverId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar acesso
                    return [4 /*yield*/, this.verifyPatientAccess(patientId, userId)];
                    case 1:
                        // Verificar acesso
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.patientCaregiver.delete({
                                where: {
                                    patientId_caregiverId: {
                                        patientId: patientId,
                                        caregiverId: caregiverId,
                                    },
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Cuidador desvinculado com sucesso',
                            }];
                }
            });
        });
    };
    // Vincular profissional ao paciente
    PatientsService.prototype.linkProfessional = function (patientId, professionalId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var professional;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyPatientAccess(patientId, userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.professional.findUnique({
                                where: { id: professionalId },
                            })];
                    case 2:
                        professional = _a.sent();
                        if (!professional) {
                            throw new Error('Profissional não encontrado');
                        }
                        return [4 /*yield*/, prisma_1.prisma.patientProfessional.upsert({
                                where: {
                                    patientId_professionalId: {
                                        patientId: patientId,
                                        professionalId: professionalId,
                                    },
                                },
                                create: {
                                    patientId: patientId,
                                    professionalId: professionalId,
                                },
                                update: {},
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Profissional vinculado com sucesso',
                            }];
                }
            });
        });
    };
    // Desvincular profissional
    PatientsService.prototype.unlinkProfessional = function (patientId, professionalId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.verifyPatientAccess(patientId, userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.patientProfessional.delete({
                                where: {
                                    patientId_professionalId: {
                                        patientId: patientId,
                                        professionalId: professionalId,
                                    },
                                },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: 'Profissional desvinculado com sucesso',
                            }];
                }
            });
        });
    };
    // Helpers
    PatientsService.prototype.formatPatient = function (patient) {
        return {
            id: patient.id,
            name: patient.name,
            phone: patient.phone,
            dateOfBirth: patient.dateOfBirth.toISOString(),
            age: this.calculateAge(patient.dateOfBirth),
            gender: patient.gender,
            bloodType: patient.bloodType,
            conditions: patient.conditions,
            allergies: patient.allergies,
            createdAt: patient.createdAt.toISOString(),
            updatedAt: patient.updatedAt.toISOString(),
        };
    };
    PatientsService.prototype.calculateAge = function (dateOfBirth) {
        var today = new Date();
        var birthDate = new Date(dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    PatientsService.prototype.verifyPatientAccess = function (patientId, userId) {
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
                        if (user.patient && user.patient.id === patientId)
                            return [2 /*return*/, true];
                        if (user.caregiver && user.caregiver.patients.length > 0)
                            return [2 /*return*/, true];
                        if (user.professional && user.professional.patients.length > 0)
                            return [2 /*return*/, true];
                        throw new Error('Acesso negado');
                }
            });
        });
    };
    return PatientsService;
}());
exports.PatientsService = PatientsService;
exports.patientsService = new PatientsService();
