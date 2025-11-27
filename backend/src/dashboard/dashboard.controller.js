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
exports.dashboardController = exports.DashboardController = void 0;
var dashboard_service_1 = require("./dashboard.service");
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var DashboardController = /** @class */ (function () {
    function DashboardController() {
    }
    // GET /api/dashboard/patient
    DashboardController.prototype.getPatientDashboard = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, data, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Não autenticado',
                                })];
                        }
                        // Verificar se é um paciente
                        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'PATIENT') {
                            return [2 /*return*/, res.status(403).json({
                                    success: false,
                                    error: 'Acesso negado. Apenas pacientes podem acessar este endpoint.',
                                })];
                        }
                        return [4 /*yield*/, dashboard_service_1.dashboardService.getPatientDashboard(userId)];
                    case 1:
                        data = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: data,
                            })];
                    case 2:
                        error_1 = _c.sent();
                        if (error_1 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_1.message,
                                })];
                        }
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/dashboard/caregiver
    DashboardController.prototype.getCaregiverDashboard = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, data, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Não autenticado',
                                })];
                        }
                        // Verificar se é um cuidador
                        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'CAREGIVER') {
                            return [2 /*return*/, res.status(403).json({
                                    success: false,
                                    error: 'Acesso negado. Apenas cuidadores podem acessar este endpoint.',
                                })];
                        }
                        return [4 /*yield*/, dashboard_service_1.dashboardService.getCaregiverDashboard(userId)];
                    case 1:
                        data = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: data,
                            })];
                    case 2:
                        error_2 = _c.sent();
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_2.message,
                                })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/dashboard/professional
    DashboardController.prototype.getProfessionalDashboard = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, data, error_3;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Não autenticado',
                                })];
                        }
                        // Verificar se é um profissional
                        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'PROFESSIONAL') {
                            return [2 /*return*/, res.status(403).json({
                                    success: false,
                                    error: 'Acesso negado. Apenas profissionais podem acessar este endpoint.',
                                })];
                        }
                        return [4 /*yield*/, dashboard_service_1.dashboardService.getProfessionalDashboard(userId)];
                    case 1:
                        data = _c.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: data,
                            })];
                    case 2:
                        error_3 = _c.sent();
                        if (error_3 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_3.message,
                                })];
                        }
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ============================================================================
    // DASHBOARD CONFIG ENDPOINTS
    // ============================================================================
    // GET /api/dashboard/config
    DashboardController.prototype.getConfig = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, config, error_4;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ error: 'Not authenticated' })];
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: userId },
                                include: { patient: true },
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user || !user.patient) {
                            return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                        }
                        return [4 /*yield*/, prisma.dashboardConfig.findUnique({
                                where: { patientId: user.patient.id },
                            })];
                    case 2:
                        config = _b.sent();
                        if (!config) {
                            return [2 /*return*/, res.status(404).json({ error: 'Dashboard config not found' })];
                        }
                        return [2 /*return*/, res.json(config)];
                    case 3:
                        error_4 = _b.sent();
                        console.error('Error getting dashboard config:', error_4);
                        return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/dashboard/config
    DashboardController.prototype.saveConfig = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, widgets, layout, user, config, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        _a = req.body, widgets = _a.widgets, layout = _a.layout;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ error: 'Not authenticated' })];
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: userId },
                                include: { patient: true },
                            })];
                    case 1:
                        user = _c.sent();
                        if (!user || !user.patient) {
                            return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                        }
                        return [4 /*yield*/, prisma.dashboardConfig.upsert({
                                where: { patientId: user.patient.id },
                                update: { widgets: widgets, layout: layout },
                                create: { patientId: user.patient.id, widgets: widgets, layout: layout },
                            })];
                    case 2:
                        config = _c.sent();
                        return [2 /*return*/, res.json({ message: 'Dashboard config saved successfully', config: config })];
                    case 3:
                        error_5 = _c.sent();
                        console.error('Error saving dashboard config:', error_5);
                        return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ============================================================================
    // WIDGET DATA ENDPOINTS
    // ============================================================================
    // GET /api/dashboard/widgets/stats
    DashboardController.prototype.getStatsWidget = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, patientId, _a, medications, vitals, consultations, exams, error_6;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ error: 'Not authenticated' })];
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: userId },
                                include: { patient: true },
                            })];
                    case 1:
                        user = _c.sent();
                        if (!user || !user.patient) {
                            return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                        }
                        patientId = user.patient.id;
                        return [4 /*yield*/, Promise.all([
                                prisma.medication.count({ where: { patientId: patientId, active: true } }),
                                prisma.vitalSign.count({ where: { patientId: patientId } }),
                                prisma.consultation.count({ where: { patientId: patientId } }),
                                prisma.exam.count({ where: { patientId: patientId } }),
                            ])];
                    case 2:
                        _a = _c.sent(), medications = _a[0], vitals = _a[1], consultations = _a[2], exams = _a[3];
                        return [2 /*return*/, res.json({
                                medications: medications,
                                vitals: vitals,
                                consultations: consultations,
                                exams: exams,
                            })];
                    case 3:
                        error_6 = _c.sent();
                        console.error('Error getting stats widget:', error_6);
                        return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/dashboard/widgets/medications
    DashboardController.prototype.getMedicationsWidget = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, patientId, today, medications, formatted, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ error: 'Not authenticated' })];
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: userId },
                                include: { patient: true },
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user || !user.patient) {
                            return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                        }
                        patientId = user.patient.id;
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return [4 /*yield*/, prisma.medicationSchedule.findMany({
                                where: {
                                    patientId: patientId,
                                    scheduledFor: {
                                        gte: today,
                                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                                    },
                                },
                                include: {
                                    medication: true,
                                },
                                orderBy: { scheduledFor: 'asc' },
                                take: 5,
                            })];
                    case 2:
                        medications = _b.sent();
                        formatted = medications.map(function (med) { return ({
                            id: med.id,
                            name: med.medication.name,
                            time: med.scheduledFor.toTimeString().slice(0, 5),
                            taken: med.taken || false,
                            dosage: med.medication.dosage,
                        }); });
                        return [2 /*return*/, res.json({ medications: formatted })];
                    case 3:
                        error_7 = _b.sent();
                        console.error('Error getting medications widget:', error_7);
                        return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/dashboard/widgets/vitals
    DashboardController.prototype.getVitalsWidget = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, patientId, latestVitals, vitalsMap_1, error_8;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 3, , 4]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ error: 'Not authenticated' })];
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: userId },
                                include: { patient: true },
                            })];
                    case 1:
                        user = _g.sent();
                        if (!user || !user.patient) {
                            return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                        }
                        patientId = user.patient.id;
                        return [4 /*yield*/, prisma.vitalSign.findMany({
                                where: { patientId: patientId },
                                orderBy: { timestamp: 'desc' },
                                take: 10,
                            })
                            // Organize by type
                        ];
                    case 2:
                        latestVitals = _g.sent();
                        vitalsMap_1 = {};
                        latestVitals.forEach(function (vital) {
                            if (!vitalsMap_1[vital.type]) {
                                vitalsMap_1[vital.type] = vital;
                            }
                        });
                        return [2 /*return*/, res.json({
                                bloodPressure: ((_b = vitalsMap_1.BLOOD_PRESSURE) === null || _b === void 0 ? void 0 : _b.value) || null,
                                heartRate: ((_c = vitalsMap_1.HEART_RATE) === null || _c === void 0 ? void 0 : _c.value) || null,
                                weight: ((_d = vitalsMap_1.WEIGHT) === null || _d === void 0 ? void 0 : _d.value) || null,
                                glucose: ((_e = vitalsMap_1.GLUCOSE) === null || _e === void 0 ? void 0 : _e.value) || null,
                                lastMeasurement: ((_f = latestVitals[0]) === null || _f === void 0 ? void 0 : _f.timestamp) || null,
                            })];
                    case 3:
                        error_8 = _g.sent();
                        console.error('Error getting vitals widget:', error_8);
                        return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/dashboard/widgets/consultations
    DashboardController.prototype.getConsultationsWidget = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, patientId, now, consultations, formatted, error_9;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ error: 'Not authenticated' })];
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: userId },
                                include: { patient: true },
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user || !user.patient) {
                            return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                        }
                        patientId = user.patient.id;
                        now = new Date();
                        return [4 /*yield*/, prisma.consultation.findMany({
                                where: {
                                    patientId: patientId,
                                    date: { gte: now },
                                    status: { in: ['SCHEDULED', 'CONFIRMED'] },
                                },
                                include: {
                                    professional: true,
                                },
                                orderBy: { date: 'asc' },
                                take: 3,
                            })];
                    case 2:
                        consultations = _b.sent();
                        formatted = consultations.map(function (cons) { return ({
                            id: cons.id,
                            date: cons.date,
                            doctor: cons.professional.name,
                            type: cons.type,
                            location: cons.location,
                        }); });
                        return [2 /*return*/, res.json({ consultations: formatted })];
                    case 3:
                        error_9 = _b.sent();
                        console.error('Error getting consultations widget:', error_9);
                        return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/dashboard/widgets/exams
    DashboardController.prototype.getExamsWidget = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, user, patientId, exams, formatted, error_10;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ error: 'Not authenticated' })];
                        }
                        return [4 /*yield*/, prisma.user.findUnique({
                                where: { id: userId },
                                include: { patient: true },
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user || !user.patient) {
                            return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                        }
                        patientId = user.patient.id;
                        return [4 /*yield*/, prisma.exam.findMany({
                                where: { patientId: patientId },
                                orderBy: { date: 'desc' },
                                take: 5,
                            })];
                    case 2:
                        exams = _b.sent();
                        formatted = exams.map(function (exam) { return ({
                            id: exam.id,
                            name: exam.name,
                            date: exam.date,
                            status: exam.status,
                            type: exam.type,
                        }); });
                        return [2 /*return*/, res.json({ exams: formatted })];
                    case 3:
                        error_10 = _b.sent();
                        console.error('Error getting exams widget:', error_10);
                        return [2 /*return*/, res.status(500).json({ error: 'Internal server error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return DashboardController;
}());
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
