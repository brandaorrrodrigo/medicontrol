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
exports.notificationsService = exports.NotificationsService = void 0;
var prisma_1 = require("../database/prisma");
// ============================================================================
// CLASSE DO SERVICE
// ============================================================================
var NotificationsService = /** @class */ (function () {
    function NotificationsService() {
    }
    // ==========================================================================
    // CRIAR NOTIFICAÇÃO GERAL
    // ==========================================================================
    NotificationsService.prototype.createNotification = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var prefs, sendEmail, sendPush, notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserPreferences(input.userId)
                        // Verificar se notificações estão habilitadas para esta categoria
                    ];
                    case 1:
                        prefs = _a.sent();
                        // Verificar se notificações estão habilitadas para esta categoria
                        if (!this.isNotificationEnabled(prefs, input.category)) {
                            console.log("Notifica\u00E7\u00F5es de ".concat(input.category, " desabilitadas para usu\u00E1rio ").concat(input.userId));
                            return [2 /*return*/, null];
                        }
                        // Verificar horário silencioso (quiet hours)
                        if (this.isInQuietHours(prefs)) {
                            console.log("Usu\u00E1rio ".concat(input.userId, " em hor\u00E1rio silencioso, notifica\u00E7\u00E3o adiada"));
                            // TODO: Adicionar à fila para envio posterior
                            return [2 /*return*/, null];
                        }
                        sendEmail = this.shouldSendEmail(prefs, input.category);
                        sendPush = this.shouldSendPush(prefs, input.category);
                        return [4 /*yield*/, prisma_1.prisma.notification.create({
                                data: {
                                    userId: input.userId,
                                    title: input.title,
                                    message: input.message,
                                    type: input.type,
                                    category: input.category,
                                    actionUrl: input.actionUrl,
                                    actionLabel: input.actionLabel,
                                    metadata: input.metadata,
                                    expiresAt: input.expiresAt,
                                    sentInApp: true, // Sempre criar no app
                                    sentEmail: false,
                                    sentPush: false
                                }
                            })
                            // Enviar por email se habilitado
                        ];
                    case 2:
                        notification = _a.sent();
                        if (!sendEmail) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sendEmailNotification(notification.id, input.userId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!sendPush) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sendPushNotification(notification.id, input.userId)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, notification];
                }
            });
        });
    };
    // ==========================================================================
    // CRIAR ALERTA DE EXAME
    // ==========================================================================
    NotificationsService.prototype.createExamAlert = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var alert, usersToNotify, _i, usersToNotify_1, userId, prefs, notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.examAlert.create({
                            data: {
                                patientId: input.patientId,
                                examId: input.examId,
                                markerCode: input.markerCode,
                                markerName: input.markerName,
                                type: input.type,
                                severity: input.severity,
                                title: input.title,
                                message: input.message,
                                value: input.value,
                                unit: input.unit,
                                referenceMin: input.referenceMin,
                                referenceMax: input.referenceMax,
                                trendDirection: input.trendDirection,
                                trendSlope: input.trendSlope,
                                trendConfidence: input.trendConfidence,
                                recommendedAction: input.recommendedAction,
                                actionUrl: input.actionUrl,
                                metadata: input.metadata
                            }
                        })
                        // Buscar usuários que devem ser notificados
                    ];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, this.getUsersToNotifyForPatient(input.patientId)
                            // Criar notificações para cada usuário
                        ];
                    case 2:
                        usersToNotify = _a.sent();
                        _i = 0, usersToNotify_1 = usersToNotify;
                        _a.label = 3;
                    case 3:
                        if (!(_i < usersToNotify_1.length)) return [3 /*break*/, 8];
                        userId = usersToNotify_1[_i];
                        return [4 /*yield*/, this.getUserPreferences(userId)
                            // Se preferência é "somente crítico", pular se não for crítico
                        ];
                    case 4:
                        prefs = _a.sent();
                        // Se preferência é "somente crítico", pular se não for crítico
                        if ((prefs === null || prefs === void 0 ? void 0 : prefs.examAlertsCriticalOnly) && input.severity !== 'CRITICAL') {
                            return [3 /*break*/, 7];
                        }
                        return [4 /*yield*/, this.createNotification({
                                userId: userId,
                                title: input.title,
                                message: input.message,
                                type: this.severityToNotificationType(input.severity),
                                category: 'EXAM_ALERT',
                                actionUrl: input.actionUrl,
                                actionLabel: 'Ver Detalhes',
                                metadata: {
                                    alertId: alert.id,
                                    patientId: input.patientId,
                                    examId: input.examId,
                                    markerCode: input.markerCode
                                }
                            })];
                    case 5:
                        notification = _a.sent();
                        if (!notification) return [3 /*break*/, 7];
                        // Atualizar alerta com ID da notificação
                        return [4 /*yield*/, prisma_1.prisma.examAlert.update({
                                where: { id: alert.id },
                                data: {
                                    notificationSent: true,
                                    notificationId: notification.id
                                }
                            })];
                    case 6:
                        // Atualizar alerta com ID da notificação
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: return [2 /*return*/, alert];
                }
            });
        });
    };
    // ==========================================================================
    // CRIAR ALERTAS BASEADOS EM TENDÊNCIA
    // ==========================================================================
    NotificationsService.prototype.createAlertsFromTrend = function (patientId, trend) {
        return __awaiter(this, void 0, void 0, function () {
            var alerts, alert_1, isConcerning, alert_2, alert_3, alert_4;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        alerts = [];
                        if (!(trend.currentStatus.severity === 'CRITICAL')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createExamAlert({
                                patientId: patientId,
                                markerCode: trend.markerCode,
                                markerName: trend.markerName,
                                type: 'CRITICAL_VALUE',
                                severity: 'CRITICAL',
                                title: "\uD83D\uDEA8 CR\u00CDTICO: ".concat(trend.markerName),
                                message: "Valor cr\u00EDtico detectado: ".concat((_a = trend.statistics) === null || _a === void 0 ? void 0 : _a.latest, " ").concat(trend.unit, ". Procure atendimento m\u00E9dico imediatamente."),
                                value: (_b = trend.statistics) === null || _b === void 0 ? void 0 : _b.latest,
                                unit: trend.unit,
                                referenceMin: trend.referenceRange.low,
                                referenceMax: trend.referenceRange.high,
                                recommendedAction: 'Procure atendimento médico imediatamente',
                                actionUrl: "/paciente/exames/trends/".concat(trend.markerCode),
                                metadata: {
                                    status: trend.currentStatus.status,
                                    dataPoints: trend.dataPoints.length
                                }
                            })];
                    case 1:
                        alert_1 = _j.sent();
                        alerts.push(alert_1);
                        _j.label = 2;
                    case 2:
                        if (!(trend.trend &&
                            trend.trend.confidence > 0.7 &&
                            Math.abs(trend.trend.slope) > 5)) return [3 /*break*/, 4];
                        isConcerning = this.isTrendConcerning(trend.markerCode, trend.trend.direction);
                        if (!isConcerning) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createExamAlert({
                                patientId: patientId,
                                markerCode: trend.markerCode,
                                markerName: trend.markerName,
                                type: 'CONCERNING_TREND',
                                severity: trend.currentStatus.severity === 'WARNING' ? 'HIGH' : 'MEDIUM',
                                title: "\u26A0\uFE0F Tend\u00EAncia Preocupante: ".concat(trend.markerName),
                                message: "".concat(trend.trend.description, ". Considere agendar consulta m\u00E9dica para avalia\u00E7\u00E3o."),
                                value: (_c = trend.statistics) === null || _c === void 0 ? void 0 : _c.latest,
                                unit: trend.unit,
                                referenceMin: trend.referenceRange.low,
                                referenceMax: trend.referenceRange.high,
                                trendDirection: trend.trend.direction,
                                trendSlope: trend.trend.slope,
                                trendConfidence: trend.trend.confidence,
                                recommendedAction: 'Agende consulta médica para avaliar a tendência',
                                actionUrl: "/paciente/exames/trends/".concat(trend.markerCode),
                                metadata: {
                                    changePercent: (_d = trend.statistics) === null || _d === void 0 ? void 0 : _d.changePercent,
                                    changePerMonth: (_e = trend.statistics) === null || _e === void 0 ? void 0 : _e.changePerMonth
                                }
                            })];
                    case 3:
                        alert_2 = _j.sent();
                        alerts.push(alert_2);
                        _j.label = 4;
                    case 4:
                        if (!(trend.statistics &&
                            Math.abs(trend.statistics.changePerMonth) > 10 &&
                            trend.statistics.count >= 2)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.createExamAlert({
                                patientId: patientId,
                                markerCode: trend.markerCode,
                                markerName: trend.markerName,
                                type: 'RAPID_CHANGE',
                                severity: 'MEDIUM',
                                title: "\uD83D\uDCCA Mudan\u00E7a R\u00E1pida: ".concat(trend.markerName),
                                message: "Mudan\u00E7a de ".concat(trend.statistics.changePerMonth.toFixed(1), "% ao m\u00EAs detectada. Monitore de perto."),
                                value: trend.statistics.latest,
                                unit: trend.unit,
                                referenceMin: trend.referenceRange.low,
                                referenceMax: trend.referenceRange.high,
                                trendDirection: (_f = trend.trend) === null || _f === void 0 ? void 0 : _f.direction,
                                trendSlope: trend.statistics.changePerMonth,
                                recommendedAction: 'Mantenha acompanhamento regular dos exames',
                                actionUrl: "/paciente/exames/trends/".concat(trend.markerCode),
                                metadata: {
                                    earliest: trend.statistics.earliest,
                                    latest: trend.statistics.latest,
                                    changePercent: trend.statistics.changePercent
                                }
                            })];
                    case 5:
                        alert_3 = _j.sent();
                        alerts.push(alert_3);
                        _j.label = 6;
                    case 6:
                        if (!(!trend.currentStatus.isInRange &&
                            trend.currentStatus.severity === 'WARNING')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.createExamAlert({
                                patientId: patientId,
                                markerCode: trend.markerCode,
                                markerName: trend.markerName,
                                type: 'OUT_OF_RANGE',
                                severity: 'MEDIUM',
                                title: "\u26A0\uFE0F Fora da Faixa: ".concat(trend.markerName),
                                message: "Valor atual (".concat((_g = trend.statistics) === null || _g === void 0 ? void 0 : _g.latest, " ").concat(trend.unit, ") est\u00E1 fora da faixa de refer\u00EAncia."),
                                value: (_h = trend.statistics) === null || _h === void 0 ? void 0 : _h.latest,
                                unit: trend.unit,
                                referenceMin: trend.referenceRange.low,
                                referenceMax: trend.referenceRange.high,
                                recommendedAction: 'Agende consulta para avaliar resultado',
                                actionUrl: "/paciente/exames/trends/".concat(trend.markerCode),
                                metadata: {
                                    status: trend.currentStatus.status
                                }
                            })];
                    case 7:
                        alert_4 = _j.sent();
                        alerts.push(alert_4);
                        _j.label = 8;
                    case 8: return [2 /*return*/, alerts];
                }
            });
        });
    };
    // ==========================================================================
    // BUSCAR NOTIFICAÇÕES
    // ==========================================================================
    NotificationsService.prototype.getUserNotifications = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, options) {
            var where, notifications;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = { userId: userId };
                        if (options.category)
                            where.category = options.category;
                        if (options.read !== undefined)
                            where.read = options.read;
                        // Não mostrar notificações expiradas
                        where.OR = [
                            { expiresAt: null },
                            { expiresAt: { gt: new Date() } }
                        ];
                        return [4 /*yield*/, prisma_1.prisma.notification.findMany({
                                where: where,
                                orderBy: { timestamp: 'desc' },
                                take: options.limit || 50,
                                skip: options.offset || 0
                            })];
                    case 1:
                        notifications = _a.sent();
                        return [2 /*return*/, notifications];
                }
            });
        });
    };
    NotificationsService.prototype.getUnreadCount = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma_1.prisma.notification.count({
                        where: {
                            userId: userId,
                            read: false,
                            OR: [
                                { expiresAt: null },
                                { expiresAt: { gt: new Date() } }
                            ]
                        }
                    })];
            });
        });
    };
    // ==========================================================================
    // MARCAR COMO LIDA
    // ==========================================================================
    NotificationsService.prototype.markAsRead = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.notification.findFirst({
                            where: { id: notificationId, userId: userId }
                        })];
                    case 1:
                        notification = _a.sent();
                        if (!notification) {
                            throw new Error('Notificação não encontrada');
                        }
                        return [2 /*return*/, prisma_1.prisma.notification.update({
                                where: { id: notificationId },
                                data: {
                                    read: true,
                                    readAt: new Date()
                                }
                            })];
                }
            });
        });
    };
    NotificationsService.prototype.markAllAsRead = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma_1.prisma.notification.updateMany({
                        where: {
                            userId: userId,
                            read: false
                        },
                        data: {
                            read: true,
                            readAt: new Date()
                        }
                    })];
            });
        });
    };
    // ==========================================================================
    // GERENCIAR PREFERÊNCIAS
    // ==========================================================================
    NotificationsService.prototype.getUserPreferences = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var prefs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.notificationPreference.findUnique({
                            where: { userId: userId }
                        })
                        // Se não existe, criar com padrões
                    ];
                    case 1:
                        prefs = _a.sent();
                        if (!!prefs) return [3 /*break*/, 3];
                        return [4 /*yield*/, prisma_1.prisma.notificationPreference.create({
                                data: { userId: userId }
                            })];
                    case 2:
                        prefs = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, prefs];
                }
            });
        });
    };
    NotificationsService.prototype.updateUserPreferences = function (userId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Garantir que existe
                    return [4 /*yield*/, this.getUserPreferences(userId)];
                    case 1:
                        // Garantir que existe
                        _a.sent();
                        return [2 /*return*/, prisma_1.prisma.notificationPreference.update({
                                where: { userId: userId },
                                data: updates
                            })];
                }
            });
        });
    };
    // ==========================================================================
    // GERENCIAR ALERTAS DE EXAME
    // ==========================================================================
    NotificationsService.prototype.getPatientExamAlerts = function (patientId_1) {
        return __awaiter(this, arguments, void 0, function (patientId, options) {
            var where;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                where = { patientId: patientId };
                if (options.severity)
                    where.severity = options.severity;
                if (options.acknowledged !== undefined)
                    where.acknowledged = options.acknowledged;
                if (options.resolved !== undefined)
                    where.resolved = options.resolved;
                return [2 /*return*/, prisma_1.prisma.examAlert.findMany({
                        where: where,
                        orderBy: [
                            { resolved: 'asc' },
                            { severity: 'desc' },
                            { triggeredAt: 'desc' }
                        ],
                        take: options.limit || 50,
                        include: {
                            exam: {
                                select: {
                                    id: true,
                                    name: true,
                                    date: true
                                }
                            }
                        }
                    })];
            });
        });
    };
    NotificationsService.prototype.acknowledgeAlert = function (alertId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma_1.prisma.examAlert.update({
                        where: { id: alertId },
                        data: {
                            acknowledged: true,
                            acknowledgedAt: new Date(),
                            acknowledgedBy: userId
                        }
                    })];
            });
        });
    };
    NotificationsService.prototype.resolveAlert = function (alertId, userId, resolutionNotes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, prisma_1.prisma.examAlert.update({
                        where: { id: alertId },
                        data: {
                            resolved: true,
                            resolvedAt: new Date(),
                            resolvedBy: userId,
                            resolutionNotes: resolutionNotes
                        }
                    })];
            });
        });
    };
    // ==========================================================================
    // MÉTODOS AUXILIARES
    // ==========================================================================
    NotificationsService.prototype.getUsersToNotifyForPatient = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var patient, userIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                            where: { id: patientId },
                            include: {
                                user: true,
                                caregivers: {
                                    include: { caregiver: { include: { user: true } } }
                                },
                                professionals: {
                                    include: { professional: { include: { user: true } } }
                                }
                            }
                        })];
                    case 1:
                        patient = _a.sent();
                        if (!patient)
                            return [2 /*return*/, []];
                        userIds = [];
                        // Owner sempre recebe
                        userIds.push(patient.userId);
                        // Caregivers recebem
                        patient.caregivers.forEach(function (pc) {
                            userIds.push(pc.caregiver.userId);
                        });
                        // Profissionais recebem apenas alertas críticos
                        // TODO: Implementar preferências específicas para profissionais
                        return [2 /*return*/, userIds];
                }
            });
        });
    };
    NotificationsService.prototype.isNotificationEnabled = function (prefs, category) {
        if (!prefs)
            return true;
        switch (category) {
            case 'EXAM_ALERT':
                return prefs.examAlertsEnabled;
            case 'MEDICATION_REMINDER':
                return prefs.medicationRemindersEnabled;
            case 'APPOINTMENT':
                return prefs.appointmentsEnabled;
            case 'STOCK_ALERT':
                return prefs.stockAlertsEnabled;
            case 'HEALTH_INSIGHT':
                return prefs.healthInsightsEnabled;
            default:
                return true;
        }
    };
    NotificationsService.prototype.shouldSendEmail = function (prefs, category) {
        if (!prefs)
            return false;
        switch (category) {
            case 'EXAM_ALERT':
                return prefs.examAlertsEmail;
            case 'MEDICATION_REMINDER':
                return prefs.medicationRemindersEmail;
            case 'APPOINTMENT':
                return prefs.appointmentsEmail;
            case 'STOCK_ALERT':
                return prefs.stockAlertsEmail;
            case 'HEALTH_INSIGHT':
                return prefs.healthInsightsEmail;
            default:
                return false;
        }
    };
    NotificationsService.prototype.shouldSendPush = function (prefs, category) {
        if (!prefs)
            return false;
        switch (category) {
            case 'EXAM_ALERT':
                return prefs.examAlertsPush;
            case 'MEDICATION_REMINDER':
                return prefs.medicationRemindersPush;
            case 'APPOINTMENT':
                return prefs.appointmentsPush;
            case 'STOCK_ALERT':
                return prefs.stockAlertsPush;
            case 'HEALTH_INSIGHT':
                return prefs.healthInsightsPush;
            default:
                return false;
        }
    };
    NotificationsService.prototype.isInQuietHours = function (prefs) {
        if (!prefs || !prefs.quietHoursEnabled)
            return false;
        // TODO: Implementar comparação de horários corretamente
        // Por enquanto, retornar false
        return false;
    };
    NotificationsService.prototype.severityToNotificationType = function (severity) {
        switch (severity) {
            case 'CRITICAL':
            case 'HIGH':
                return 'DANGER';
            case 'MEDIUM':
                return 'WARNING';
            case 'LOW':
                return 'INFO';
            default:
                return 'INFO';
        }
    };
    NotificationsService.prototype.isTrendConcerning = function (markerCode, direction) {
        // Marcadores onde ALTA é preocupante
        var highIsBad = [
            'GLICEMIA_JEJUM',
            'COLESTEROL_TOTAL',
            'LDL_COLESTEROL',
            'TRIGLICERIDEOS',
            'CREATININA',
            'UREIA',
            'TGO',
            'TGP',
            'PRESSAO_SISTOLICA',
            'PRESSAO_DIASTOLICA'
        ];
        // Marcadores onde BAIXA é preocupante
        var lowIsBad = [
            'HDL_COLESTEROL',
            'HEMOGLOBINA',
            'HEMACIAS',
            'FERRO'
        ];
        if (direction === 'UP' && highIsBad.includes(markerCode))
            return true;
        if (direction === 'DOWN' && lowIsBad.includes(markerCode))
            return true;
        return false;
    };
    NotificationsService.prototype.sendEmailNotification = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implementar com provider de email
                console.log("Email notification ".concat(notificationId, " para usu\u00E1rio ").concat(userId, " - implementar"));
                return [2 /*return*/];
            });
        });
    };
    NotificationsService.prototype.sendPushNotification = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implementar com provider de push
                console.log("Push notification ".concat(notificationId, " para usu\u00E1rio ").concat(userId, " - implementar"));
                return [2 /*return*/];
            });
        });
    };
    return NotificationsService;
}());
exports.NotificationsService = NotificationsService;
exports.notificationsService = new NotificationsService();
