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
exports.remindersService = exports.RemindersService = void 0;
// @ts-nocheck
var prisma_1 = require("../database/prisma");
var notifications_service_1 = require("../notifications/notifications.service");
var RemindersService = /** @class */ (function () {
    function RemindersService() {
    }
    // Listar lembretes futuros de um paciente
    RemindersService.prototype.getUpcomingReminders = function (patientId_1) {
        return __awaiter(this, arguments, void 0, function (patientId, limit) {
            var reminders;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medicationSchedule.findMany({
                            where: {
                                patientId: patientId,
                                scheduledFor: {
                                    gte: new Date(),
                                },
                            },
                            orderBy: { scheduledFor: 'asc' },
                            take: limit,
                            include: {
                                medication: true,
                            },
                        })];
                    case 1:
                        reminders = _a.sent();
                        return [2 /*return*/, reminders.map(function (r) {
                                var _a;
                                return ({
                                    id: r.id,
                                    medicationId: r.medicationId,
                                    medicationName: r.medication.name,
                                    patientId: r.patientId,
                                    dosage: r.medication.dosage,
                                    scheduledFor: r.scheduledFor.toISOString(),
                                    taken: r.taken,
                                    takenAt: (_a = r.takenAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                    notes: r.notes,
                                });
                            })];
                }
            });
        });
    };
    // Obter lembretes de hoje
    RemindersService.prototype.getTodayReminders = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var today, tomorrow, reminders;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return [4 /*yield*/, prisma_1.prisma.medicationSchedule.findMany({
                                where: {
                                    patientId: patientId,
                                    scheduledFor: {
                                        gte: today,
                                        lt: tomorrow,
                                    },
                                },
                                orderBy: { scheduledFor: 'asc' },
                                include: {
                                    medication: true,
                                },
                            })];
                    case 1:
                        reminders = _a.sent();
                        return [2 /*return*/, reminders.map(function (r) {
                                var _a;
                                return ({
                                    id: r.id,
                                    medicationId: r.medicationId,
                                    medicationName: r.medication.name,
                                    dosage: r.medication.dosage,
                                    scheduledFor: r.scheduledFor.toISOString(),
                                    taken: r.taken,
                                    takenAt: (_a = r.takenAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                });
                            })];
                }
            });
        });
    };
    // Marcar lembrete como tomado
    RemindersService.prototype.markAsTaken = function (reminderId, userId, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var reminder, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medicationSchedule.findUnique({
                            where: { id: reminderId },
                            include: {
                                patient: {
                                    include: {
                                        user: true,
                                    },
                                },
                                medication: true,
                            },
                        })];
                    case 1:
                        reminder = _b.sent();
                        if (!reminder) {
                            throw new Error('Lembrete não encontrado');
                        }
                        // Verificar acesso
                        return [4 /*yield*/, this.verifyReminderAccess(reminder.patientId, userId)
                            // Atualizar lembrete
                        ];
                    case 2:
                        // Verificar acesso
                        _b.sent();
                        return [4 /*yield*/, prisma_1.prisma.medicationSchedule.update({
                                where: { id: reminderId },
                                data: {
                                    taken: true,
                                    takenAt: new Date(),
                                    notes: notes,
                                },
                            })
                            // Criar notificação de sucesso
                        ];
                    case 3:
                        updated = _b.sent();
                        // Criar notificação de sucesso
                        return [4 /*yield*/, notifications_service_1.notificationsService.createNotification({
                                userId: reminder.patient.user.id,
                                title: 'Medicamento tomado',
                                message: "".concat(reminder.medication.name, " foi registrado como tomado"),
                                type: 'SUCCESS',
                            })];
                    case 4:
                        // Criar notificação de sucesso
                        _b.sent();
                        return [2 /*return*/, {
                                id: updated.id,
                                taken: updated.taken,
                                takenAt: (_a = updated.takenAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                            }];
                }
            });
        });
    };
    // Criar lembrete manual
    RemindersService.prototype.createReminder = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var medication, reminder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medication.findUnique({
                            where: { id: data.medicationId },
                        })];
                    case 1:
                        medication = _a.sent();
                        if (!medication) {
                            throw new Error('Medicamento não encontrado');
                        }
                        if (medication.patientId !== data.patientId) {
                            throw new Error('Medicamento não pertence a esse paciente');
                        }
                        return [4 /*yield*/, prisma_1.prisma.medicationSchedule.create({
                                data: {
                                    medicationId: data.medicationId,
                                    patientId: data.patientId,
                                    scheduledFor: new Date(data.scheduledFor),
                                    taken: false,
                                },
                            })];
                    case 2:
                        reminder = _a.sent();
                        return [2 /*return*/, {
                                id: reminder.id,
                                medicationId: reminder.medicationId,
                                patientId: reminder.patientId,
                                scheduledFor: reminder.scheduledFor.toISOString(),
                                taken: reminder.taken,
                            }];
                }
            });
        });
    };
    // Deletar lembrete
    RemindersService.prototype.deleteReminder = function (reminderId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var reminder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.medicationSchedule.findUnique({
                            where: { id: reminderId },
                        })];
                    case 1:
                        reminder = _a.sent();
                        if (!reminder) {
                            throw new Error('Lembrete não encontrado');
                        }
                        return [4 /*yield*/, this.verifyReminderAccess(reminder.patientId, userId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.medicationSchedule.delete({
                                where: { id: reminderId },
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // Verificar acesso ao lembrete
    RemindersService.prototype.verifyReminderAccess = function (patientId, userId) {
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
                        if (user.patient && user.patient.id === patientId) {
                            return [2 /*return*/, true];
                        }
                        if (user.caregiver && user.caregiver.patients.length > 0) {
                            return [2 /*return*/, true];
                        }
                        if (user.professional && user.professional.patients.length > 0) {
                            return [2 /*return*/, true];
                        }
                        throw new Error('Acesso negado');
                }
            });
        });
    };
    return RemindersService;
}());
exports.RemindersService = RemindersService;
exports.remindersService = new RemindersService();
