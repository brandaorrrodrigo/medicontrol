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
exports.consultationRemindersCron = exports.ConsultationRemindersCron = void 0;
// @ts-nocheck
var node_cron_1 = require("node-cron");
var prisma_1 = require("../database/prisma");
var notifications_service_1 = require("../notifications/notifications.service");
var ConsultationRemindersCron = /** @class */ (function () {
    function ConsultationRemindersCron() {
        this.task = null;
    }
    // Iniciar cron job
    ConsultationRemindersCron.prototype.start = function () {
        var _this = this;
        // Rodar a cada 1 hora
        this.task = node_cron_1.default.schedule('0 * * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[CRON] Verificando lembretes de consultas...');
                        return [4 /*yield*/, this.checkUpcomingConsultations()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        console.log('[CRON] Sistema de lembretes de consultas iniciado');
    };
    // Parar cron job
    ConsultationRemindersCron.prototype.stop = function () {
        if (this.task) {
            this.task.stop();
            console.log('[CRON] Sistema de lembretes de consultas parado');
        }
    };
    // Verificar consultas próximas
    ConsultationRemindersCron.prototype.checkUpcomingConsultations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, twentyFourHoursFromNow, upcomingConsultations, _i, upcomingConsultations_1, consultation, timeUntil, recentPatientNotification, recentProfessionalNotification, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        now = new Date();
                        twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                        return [4 /*yield*/, prisma_1.prisma.consultation.findMany({
                                where: {
                                    date: {
                                        gte: now,
                                        lte: twentyFourHoursFromNow,
                                    },
                                },
                                include: {
                                    patient: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                    professional: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            })];
                    case 1:
                        upcomingConsultations = _a.sent();
                        console.log("[CRON] ".concat(upcomingConsultations.length, " consultas pr\u00F3ximas encontradas"));
                        _i = 0, upcomingConsultations_1 = upcomingConsultations;
                        _a.label = 2;
                    case 2:
                        if (!(_i < upcomingConsultations_1.length)) return [3 /*break*/, 9];
                        consultation = upcomingConsultations_1[_i];
                        timeUntil = this.getTimeUntilDescription(consultation.date);
                        return [4 /*yield*/, prisma_1.prisma.notification.findFirst({
                                where: {
                                    userId: consultation.patient.user.id,
                                    title: 'Lembrete de Consulta',
                                    createdAt: {
                                        gte: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Últimas 2 horas
                                    },
                                },
                            })
                            // Notificar paciente
                        ];
                    case 3:
                        recentPatientNotification = _a.sent();
                        if (!!recentPatientNotification) return [3 /*break*/, 5];
                        return [4 /*yield*/, notifications_service_1.notificationsService.createNotification({
                                userId: consultation.patient.user.id,
                                title: 'Lembrete de Consulta',
                                message: "".concat(timeUntil, ": Consulta com ").concat(consultation.professional.name),
                                type: 'WARNING',
                            })];
                    case 4:
                        _a.sent();
                        console.log("[CRON] Notifica\u00E7\u00E3o criada para paciente ".concat(consultation.patient.user.email));
                        _a.label = 5;
                    case 5: return [4 /*yield*/, prisma_1.prisma.notification.findFirst({
                            where: {
                                userId: consultation.professional.user.id,
                                title: 'Lembrete de Consulta',
                                createdAt: {
                                    gte: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Últimas 2 horas
                                },
                            },
                        })
                        // Notificar profissional
                    ];
                    case 6:
                        recentProfessionalNotification = _a.sent();
                        if (!!recentProfessionalNotification) return [3 /*break*/, 8];
                        return [4 /*yield*/, notifications_service_1.notificationsService.createNotification({
                                userId: consultation.professional.user.id,
                                title: 'Lembrete de Consulta',
                                message: "".concat(timeUntil, ": Consulta com ").concat(consultation.patient.name),
                                type: 'INFO',
                            })];
                    case 7:
                        _a.sent();
                        console.log("[CRON] Notifica\u00E7\u00E3o criada para profissional ".concat(consultation.professional.user.email));
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        error_1 = _a.sent();
                        console.error('[CRON] Erro ao verificar lembretes de consultas:', error_1);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    // Calcular descrição do tempo até a consulta
    ConsultationRemindersCron.prototype.getTimeUntilDescription = function (date) {
        var now = new Date();
        var diffMs = date.getTime() - now.getTime();
        var diffHours = Math.round(diffMs / (1000 * 60 * 60));
        if (diffHours <= 1) {
            return 'Em menos de 1 hora';
        }
        else if (diffHours <= 3) {
            return "Em ".concat(diffHours, " horas");
        }
        else if (diffHours <= 12) {
            return "Hoje em ".concat(diffHours, " horas");
        }
        else {
            return 'Amanhã';
        }
    };
    return ConsultationRemindersCron;
}());
exports.ConsultationRemindersCron = ConsultationRemindersCron;
exports.consultationRemindersCron = new ConsultationRemindersCron();
