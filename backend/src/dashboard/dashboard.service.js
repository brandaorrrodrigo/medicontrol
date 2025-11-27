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
exports.dashboardService = exports.DashboardService = void 0;
var prisma_1 = require("../database/prisma");
var DashboardService = /** @class */ (function () {
    function DashboardService() {
    }
    // ============================================================================
    // PATIENT DASHBOARD
    // ============================================================================
    DashboardService.prototype.getPatientDashboard = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, patient, age, upcomingMedications;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                patient: {
                                    include: {
                                        medications: {
                                            where: { active: true },
                                            include: {
                                                schedules: {
                                                    where: {
                                                        scheduledFor: {
                                                            gte: new Date(),
                                                        },
                                                        taken: false,
                                                    },
                                                    orderBy: { scheduledFor: 'asc' },
                                                    take: 5,
                                                },
                                            },
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
                                },
                                notifications: {
                                    orderBy: { timestamp: 'desc' },
                                    take: 10,
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || !user.patient) {
                            throw new Error('Paciente não encontrado');
                        }
                        patient = user.patient;
                        age = this.calculateAge(patient.dateOfBirth);
                        upcomingMedications = patient.medications
                            .flatMap(function (med) {
                            return med.schedules.map(function (schedule) {
                                var _a;
                                return ({
                                    id: schedule.id,
                                    medicationId: med.id,
                                    patientId: patient.id,
                                    medicationName: med.name,
                                    dosage: med.dosage,
                                    time: schedule.scheduledFor.toISOString(),
                                    frequency: med.frequency,
                                    taken: schedule.taken,
                                    takenAt: (_a = schedule.takenAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                    nextDose: _this.getNextDose(med.frequency, schedule.scheduledFor),
                                });
                            });
                        })
                            .sort(function (a, b) { return new Date(a.time).getTime() - new Date(b.time).getTime(); })
                            .slice(0, 5);
                        return [2 /*return*/, {
                                patient: {
                                    id: patient.id,
                                    name: patient.name,
                                    email: user.email,
                                    phone: patient.phone,
                                    dateOfBirth: patient.dateOfBirth.toISOString(),
                                    age: age,
                                    gender: patient.gender,
                                    bloodType: patient.bloodType,
                                    conditions: patient.conditions,
                                    allergies: patient.allergies,
                                    emergencyContact: patient.emergencyContact,
                                    createdAt: patient.createdAt.toISOString(),
                                    updatedAt: patient.updatedAt.toISOString(),
                                },
                                upcomingMedications: upcomingMedications,
                                recentVitalSigns: patient.vitalSigns.map(function (vital) { return ({
                                    id: vital.id,
                                    patientId: vital.patientId,
                                    type: vital.type,
                                    value: vital.value,
                                    unit: vital.unit,
                                    timestamp: vital.timestamp.toISOString(),
                                    status: vital.status,
                                    notes: vital.notes,
                                }); }),
                                recentExams: patient.exams.map(function (exam) { return ({
                                    id: exam.id,
                                    patientId: exam.patientId,
                                    name: exam.name,
                                    type: exam.type,
                                    date: exam.date.toISOString(),
                                    status: exam.status,
                                    result: exam.result,
                                    doctor: exam.doctor,
                                    createdAt: exam.createdAt.toISOString(),
                                }); }),
                                notifications: user.notifications.map(function (notif) { return ({
                                    id: notif.id,
                                    userId: notif.userId,
                                    title: notif.title,
                                    message: notif.message,
                                    type: notif.type,
                                    timestamp: notif.timestamp.toISOString(),
                                    read: notif.read,
                                    actionUrl: notif.actionUrl,
                                }); }),
                            }];
                }
            });
        });
    };
    // ============================================================================
    // CAREGIVER DASHBOARD
    // ============================================================================
    DashboardService.prototype.getCaregiverDashboard = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, caregiver, patients, upcomingMedications, recentVitalSigns, recentExams;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                caregiver: {
                                    include: {
                                        patients: {
                                            include: {
                                                patient: {
                                                    include: {
                                                        medications: {
                                                            where: { active: true },
                                                            include: {
                                                                schedules: {
                                                                    where: {
                                                                        scheduledFor: {
                                                                            gte: new Date(),
                                                                        },
                                                                        taken: false,
                                                                    },
                                                                    orderBy: { scheduledFor: 'asc' },
                                                                    take: 3,
                                                                },
                                                            },
                                                        },
                                                        vitalSigns: {
                                                            orderBy: { timestamp: 'desc' },
                                                            take: 3,
                                                        },
                                                        exams: {
                                                            orderBy: { date: 'desc' },
                                                            take: 3,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                notifications: {
                                    orderBy: { timestamp: 'desc' },
                                    take: 10,
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || !user.caregiver) {
                            throw new Error('Cuidador não encontrado');
                        }
                        caregiver = user.caregiver;
                        patients = caregiver.patients.map(function (pc) {
                            var patient = pc.patient;
                            var age = _this.calculateAge(patient.dateOfBirth);
                            return {
                                id: patient.id,
                                name: patient.name,
                                email: '', // Privacidade
                                phone: patient.phone,
                                dateOfBirth: patient.dateOfBirth.toISOString(),
                                age: age,
                                gender: patient.gender,
                                bloodType: patient.bloodType,
                                conditions: patient.conditions,
                                allergies: patient.allergies,
                                createdAt: patient.createdAt.toISOString(),
                                updatedAt: patient.updatedAt.toISOString(),
                            };
                        });
                        upcomingMedications = caregiver.patients
                            .flatMap(function (pc) {
                            return pc.patient.medications.flatMap(function (med) {
                                return med.schedules.map(function (schedule) {
                                    var _a;
                                    return ({
                                        id: schedule.id,
                                        medicationId: med.id,
                                        patientId: pc.patient.id,
                                        medicationName: med.name,
                                        dosage: med.dosage,
                                        time: schedule.scheduledFor.toISOString(),
                                        frequency: med.frequency,
                                        taken: schedule.taken,
                                        takenAt: (_a = schedule.takenAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                                        nextDose: _this.getNextDose(med.frequency, schedule.scheduledFor),
                                    });
                                });
                            });
                        })
                            .sort(function (a, b) { return new Date(a.time).getTime() - new Date(b.time).getTime(); })
                            .slice(0, 10);
                        recentVitalSigns = caregiver.patients
                            .flatMap(function (pc) {
                            return pc.patient.vitalSigns.map(function (vital) { return ({
                                id: vital.id,
                                patientId: vital.patientId,
                                type: vital.type,
                                value: vital.value,
                                unit: vital.unit,
                                timestamp: vital.timestamp.toISOString(),
                                status: vital.status,
                            }); });
                        })
                            .sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); })
                            .slice(0, 10);
                        recentExams = caregiver.patients
                            .flatMap(function (pc) {
                            return pc.patient.exams.map(function (exam) { return ({
                                id: exam.id,
                                patientId: exam.patientId,
                                name: exam.name,
                                type: exam.type,
                                date: exam.date.toISOString(),
                                status: exam.status,
                                result: exam.result,
                                doctor: exam.doctor,
                                createdAt: exam.createdAt.toISOString(),
                            }); });
                        })
                            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); })
                            .slice(0, 10);
                        return [2 /*return*/, {
                                caregiver: {
                                    id: caregiver.id,
                                    name: caregiver.name,
                                    email: user.email,
                                    phone: caregiver.phone,
                                    relationship: caregiver.relationship,
                                    patients: [], // Será preenchido abaixo
                                    createdAt: caregiver.createdAt.toISOString(),
                                },
                                patients: patients,
                                upcomingMedications: upcomingMedications,
                                recentVitalSigns: recentVitalSigns,
                                recentExams: recentExams,
                                notifications: user.notifications.map(function (notif) { return ({
                                    id: notif.id,
                                    userId: notif.userId,
                                    title: notif.title,
                                    message: notif.message,
                                    type: notif.type,
                                    timestamp: notif.timestamp.toISOString(),
                                    read: notif.read,
                                    actionUrl: notif.actionUrl,
                                }); }),
                            }];
                }
            });
        });
    };
    // ============================================================================
    // PROFESSIONAL DASHBOARD
    // ============================================================================
    DashboardService.prototype.getProfessionalDashboard = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, professional, patients, upcomingAppointments, patientIds, recentExams, totalPatients, appointmentsToday, pendingExams;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                professional: {
                                    include: {
                                        patients: {
                                            include: {
                                                patient: true,
                                            },
                                        },
                                        consultations: {
                                            where: {
                                                date: {
                                                    gte: new Date(),
                                                },
                                            },
                                            orderBy: { date: 'asc' },
                                            take: 10,
                                            include: {
                                                patient: true,
                                            },
                                        },
                                    },
                                },
                                notifications: {
                                    orderBy: { timestamp: 'desc' },
                                    take: 10,
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || !user.professional) {
                            throw new Error('Profissional não encontrado');
                        }
                        professional = user.professional;
                        patients = professional.patients.map(function (pp) {
                            var patient = pp.patient;
                            var age = _this.calculateAge(patient.dateOfBirth);
                            return {
                                id: patient.id,
                                name: patient.name,
                                email: '', // Privacidade
                                dateOfBirth: patient.dateOfBirth.toISOString(),
                                age: age,
                                gender: patient.gender,
                                bloodType: patient.bloodType,
                                conditions: patient.conditions,
                                createdAt: patient.createdAt.toISOString(),
                                updatedAt: patient.updatedAt.toISOString(),
                            };
                        });
                        upcomingAppointments = professional.consultations.map(function (consultation) { return ({
                            id: consultation.id,
                            patientId: consultation.patientId,
                            patientName: consultation.patient.name,
                            date: consultation.date.toISOString(),
                            type: consultation.type,
                            duration: consultation.duration,
                        }); });
                        patientIds = professional.patients.map(function (pp) { return pp.patientId; });
                        return [4 /*yield*/, prisma_1.prisma.exam.findMany({
                                where: {
                                    patientId: { in: patientIds },
                                },
                                orderBy: { date: 'desc' },
                                take: 10,
                            })
                            // Calcular estatísticas
                        ];
                    case 2:
                        recentExams = _a.sent();
                        totalPatients = professional.patients.length;
                        appointmentsToday = professional.consultations.filter(function (c) {
                            var today = new Date();
                            var consultDate = new Date(c.date);
                            return (consultDate.getDate() === today.getDate() &&
                                consultDate.getMonth() === today.getMonth() &&
                                consultDate.getFullYear() === today.getFullYear());
                        }).length;
                        pendingExams = recentExams.filter(function (e) { return e.status === 'PENDING_RESULTS'; }).length;
                        return [2 /*return*/, {
                                professional: {
                                    id: professional.id,
                                    name: professional.name,
                                    email: user.email,
                                    specialty: professional.specialty,
                                    crm: professional.crm,
                                    phone: professional.phone,
                                    patients: [],
                                    createdAt: professional.createdAt.toISOString(),
                                },
                                patients: patients,
                                upcomingAppointments: upcomingAppointments,
                                recentExams: recentExams.map(function (exam) { return ({
                                    id: exam.id,
                                    patientId: exam.patientId,
                                    name: exam.name,
                                    type: exam.type,
                                    date: exam.date.toISOString(),
                                    status: exam.status,
                                    result: exam.result,
                                    doctor: exam.doctor,
                                    createdAt: exam.createdAt.toISOString(),
                                }); }),
                                notifications: user.notifications.map(function (notif) { return ({
                                    id: notif.id,
                                    userId: notif.userId,
                                    title: notif.title,
                                    message: notif.message,
                                    type: notif.type,
                                    timestamp: notif.timestamp.toISOString(),
                                    read: notif.read,
                                    actionUrl: notif.actionUrl,
                                }); }),
                                stats: {
                                    totalPatients: totalPatients,
                                    appointmentsToday: appointmentsToday,
                                    pendingExams: pendingExams,
                                },
                            }];
                }
            });
        });
    };
    // ============================================================================
    // HELPER METHODS
    // ============================================================================
    DashboardService.prototype.calculateAge = function (dateOfBirth) {
        var today = new Date();
        var birthDate = new Date(dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    DashboardService.prototype.getNextDose = function (frequency, currentDose) {
        // Parsing simples de frequência
        var match = frequency.match(/(\d+)/);
        if (!match)
            return undefined;
        var timesPerDay = parseInt(match[1]);
        var hoursInterval = 24 / timesPerDay;
        var nextDose = new Date(currentDose);
        nextDose.setHours(nextDose.getHours() + hoursInterval);
        return nextDose.toISOString();
    };
    return DashboardService;
}());
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
