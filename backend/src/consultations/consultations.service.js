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
exports.consultationsService = exports.ConsultationsService = void 0;
// @ts-nocheck
var prisma_1 = require("../database/prisma");
var notifications_service_1 = require("../notifications/notifications.service");
var ConsultationsService = /** @class */ (function () {
    function ConsultationsService() {
    }
    // Listar consultas de um paciente
    ConsultationsService.prototype.getConsultations = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var consultations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.consultation.findMany({
                            where: { patientId: patientId },
                            orderBy: { date: 'asc' },
                            include: {
                                professional: {
                                    select: {
                                        id: true,
                                        name: true,
                                        specialty: true,
                                        crm: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        consultations = _a.sent();
                        return [2 /*return*/, consultations.map(function (c) { return ({
                                id: c.id,
                                patientId: c.patientId,
                                professionalId: c.professionalId,
                                professional: c.professional,
                                date: c.date.toISOString(),
                                type: c.type,
                                duration: c.duration,
                                notes: c.notes,
                                diagnosis: c.diagnosis,
                                createdAt: c.createdAt.toISOString(),
                            }); })];
                }
            });
        });
    };
    // Listar consultas de um profissional
    ConsultationsService.prototype.getConsultationsByProfessional = function (professionalId) {
        return __awaiter(this, void 0, void 0, function () {
            var consultations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.consultation.findMany({
                            where: { professionalId: professionalId },
                            orderBy: { date: 'asc' },
                            include: {
                                patient: {
                                    select: {
                                        id: true,
                                        name: true,
                                        dateOfBirth: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        consultations = _a.sent();
                        return [2 /*return*/, consultations.map(function (c) { return ({
                                id: c.id,
                                patientId: c.patientId,
                                patient: c.patient,
                                professionalId: c.professionalId,
                                date: c.date.toISOString(),
                                type: c.type,
                                duration: c.duration,
                                notes: c.notes,
                                diagnosis: c.diagnosis,
                                createdAt: c.createdAt.toISOString(),
                            }); })];
                }
            });
        });
    };
    // Obter detalhes de uma consulta
    ConsultationsService.prototype.getConsultationById = function (consultationId) {
        return __awaiter(this, void 0, void 0, function () {
            var consultation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.consultation.findUnique({
                            where: { id: consultationId },
                            include: {
                                patient: {
                                    select: {
                                        id: true,
                                        name: true,
                                        dateOfBirth: true,
                                        gender: true,
                                        bloodType: true,
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
                            },
                        })];
                    case 1:
                        consultation = _a.sent();
                        if (!consultation) {
                            throw new Error('Consulta não encontrada');
                        }
                        return [2 /*return*/, {
                                id: consultation.id,
                                patientId: consultation.patientId,
                                patient: consultation.patient,
                                professionalId: consultation.professionalId,
                                professional: consultation.professional,
                                date: consultation.date.toISOString(),
                                type: consultation.type,
                                duration: consultation.duration,
                                notes: consultation.notes,
                                diagnosis: consultation.diagnosis,
                                createdAt: consultation.createdAt.toISOString(),
                                updatedAt: consultation.updatedAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Criar consulta
    ConsultationsService.prototype.createConsultation = function (data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, consultation;
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
                            throw new Error('Apenas profissionais podem criar consultas');
                        }
                        if (user.professional.patients.length === 0) {
                            throw new Error('Você não tem acesso a este paciente');
                        }
                        return [4 /*yield*/, prisma_1.prisma.consultation.create({
                                data: {
                                    patientId: data.patientId,
                                    professionalId: user.professional.id,
                                    date: new Date(data.date),
                                    type: data.type,
                                    duration: data.duration || 60,
                                    notes: data.notes,
                                    diagnosis: data.diagnosis,
                                    location: data.location,
                                    status: data.status,
                                },
                                include: {
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
                        consultation = _a.sent();
                        // Criar notificação para o paciente
                        return [4 /*yield*/, notifications_service_1.notificationsService.createNotification({
                                userId: consultation.patient.user.id,
                                title: 'Nova Consulta Agendada',
                                message: "Voc\u00EA tem uma consulta agendada com ".concat(user.professional.name, " em ").concat(new Date(data.date).toLocaleDateString('pt-BR')),
                                type: 'INFO',
                            })];
                    case 3:
                        // Criar notificação para o paciente
                        _a.sent();
                        return [2 /*return*/, {
                                id: consultation.id,
                                patientId: consultation.patientId,
                                professionalId: consultation.professionalId,
                                date: consultation.date.toISOString(),
                                type: consultation.type,
                                duration: consultation.duration,
                                notes: consultation.notes,
                                diagnosis: consultation.diagnosis,
                                createdAt: consultation.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Atualizar consulta
    ConsultationsService.prototype.updateConsultation = function (consultationId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var consultation, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.consultation.findUnique({
                            where: { id: consultationId },
                            include: {
                                professional: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        consultation = _a.sent();
                        if (!consultation) {
                            throw new Error('Consulta não encontrada');
                        }
                        // Verificar se é o profissional que criou a consulta
                        if (consultation.professional.user.id !== userId) {
                            throw new Error('Apenas o profissional que criou a consulta pode alterá-la');
                        }
                        return [4 /*yield*/, prisma_1.prisma.consultation.update({
                                where: { id: consultationId },
                                data: __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (data.date && { date: new Date(data.date) })), (data.type && { type: data.type })), (data.duration !== undefined && { duration: data.duration })), (data.notes !== undefined && { notes: data.notes })), (data.diagnosis !== undefined && { diagnosis: data.diagnosis })), (data.location !== undefined && { location: data.location })), (data.status && { status: data.status })),
                            })];
                    case 2:
                        updated = _a.sent();
                        return [2 /*return*/, {
                                id: updated.id,
                                date: updated.date.toISOString(),
                                type: updated.type,
                                duration: updated.duration,
                                notes: updated.notes,
                                diagnosis: updated.diagnosis,
                                updatedAt: updated.updatedAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Atualizar status da consulta
    // NOTA: Campo 'status' não existe no schema atual do Prisma
    // Esta função está comentada até que o campo seja adicionado ao schema
    /*
    async updateStatus(
      consultationId: string,
      status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
      userId: string
    ) {
      const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
        include: {
          professional: {
            include: {
              user: true,
            },
          },
          patient: {
            include: {
              user: true,
            },
          },
        },
      })
  
      if (!consultation) {
        throw new Error('Consulta não encontrada')
      }
  
      // Verificar se é o profissional que criou a consulta
      if (consultation.professional.user.id !== userId) {
        throw new Error('Acesso negado')
      }
  
      const updated = await prisma.consultation.update({
        where: { id: consultationId },
        data: { status },
      })
  
      // Notificar paciente sobre mudança de status
      const statusMessages = {
        SCHEDULED: 'agendada',
        CONFIRMED: 'confirmada',
        IN_PROGRESS: 'em andamento',
        COMPLETED: 'concluída',
        CANCELLED: 'cancelada',
      }
  
      await notificationsService.createNotification({
        userId: consultation.patient.user.id,
        title: 'Status da Consulta Atualizado',
        message: `Sua consulta foi ${statusMessages[status]}`,
        type: status === 'CANCELLED' ? 'WARNING' : 'INFO',
      })
  
      return {
        id: updated.id,
        status: updated.status,
        updatedAt: updated.updatedAt.toISOString(),
      }
    }
    */
    // Deletar consulta
    ConsultationsService.prototype.deleteConsultation = function (consultationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var consultation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.consultation.findUnique({
                            where: { id: consultationId },
                            include: {
                                professional: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        })];
                    case 1:
                        consultation = _a.sent();
                        if (!consultation) {
                            throw new Error('Consulta não encontrada');
                        }
                        if (consultation.professional.user.id !== userId) {
                            throw new Error('Acesso negado');
                        }
                        return [4 /*yield*/, prisma_1.prisma.consultation.delete({
                                where: { id: consultationId },
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    return ConsultationsService;
}());
exports.ConsultationsService = ConsultationsService;
exports.consultationsService = new ConsultationsService();
