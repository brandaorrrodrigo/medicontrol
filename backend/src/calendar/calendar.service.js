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
exports.calendarService = exports.CalendarService = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var CalendarService = /** @class */ (function () {
    function CalendarService() {
    }
    CalendarService.prototype.getMonthEvents = function (userId, month, year) {
        return __awaiter(this, void 0, void 0, function () {
            var user, patientId, now, targetMonth, targetYear, startOfMonth, endOfMonth, medications, consultations, currentStreak, events, streakDays;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.user.findUnique({
                            where: { id: userId },
                            include: { patient: true },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user || !user.patient) {
                            throw new Error('Patient not found');
                        }
                        patientId = user.patient.id;
                        now = new Date();
                        targetMonth = month !== undefined ? month : now.getMonth();
                        targetYear = year !== undefined ? year : now.getFullYear();
                        startOfMonth = new Date(targetYear, targetMonth, 1);
                        endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
                        return [4 /*yield*/, prisma.medicationSchedule.findMany({
                                where: {
                                    patientId: patientId,
                                    scheduledFor: {
                                        gte: startOfMonth,
                                        lte: endOfMonth,
                                    },
                                },
                                include: {
                                    medication: true,
                                },
                                orderBy: { scheduledFor: 'asc' },
                            })
                            // Fetch consultations for the month
                        ];
                    case 2:
                        medications = _a.sent();
                        return [4 /*yield*/, prisma.consultation.findMany({
                                where: {
                                    patientId: patientId,
                                    date: {
                                        gte: startOfMonth,
                                        lte: endOfMonth,
                                    },
                                },
                                include: {
                                    professional: true,
                                },
                                orderBy: { date: 'asc' },
                            })
                            // Calculate current streak
                        ];
                    case 3:
                        consultations = _a.sent();
                        return [4 /*yield*/, this.calculateStreak(patientId)
                            // Organize events by date
                        ];
                    case 4:
                        currentStreak = _a.sent();
                        events = {};
                        // Add medications
                        medications.forEach(function (med) {
                            var dateKey = med.scheduledFor.toISOString().split('T')[0];
                            if (!events[dateKey]) {
                                events[dateKey] = {
                                    date: med.scheduledFor,
                                    medications: [],
                                    consultations: [],
                                    hasStreak: false,
                                    isToday: _this.isToday(med.scheduledFor),
                                };
                            }
                            events[dateKey].medications.push({
                                id: med.id,
                                name: med.medication.name,
                                time: med.scheduledFor.toTimeString().slice(0, 5),
                                taken: med.taken,
                                missed: _this.isMissed(med.scheduledFor, med.taken),
                                dosage: med.medication.dosage,
                            });
                        });
                        // Add consultations
                        consultations.forEach(function (cons) {
                            var dateKey = cons.date.toISOString().split('T')[0];
                            if (!events[dateKey]) {
                                events[dateKey] = {
                                    date: cons.date,
                                    medications: [],
                                    consultations: [],
                                    hasStreak: false,
                                    isToday: _this.isToday(cons.date),
                                };
                            }
                            events[dateKey].consultations.push({
                                id: cons.id,
                                time: cons.date.toTimeString().slice(0, 5),
                                doctor: cons.professional.name,
                                type: cons.type,
                                status: cons.status,
                                location: cons.location,
                            });
                        });
                        return [4 /*yield*/, this.getStreakDays(patientId)];
                    case 5:
                        streakDays = _a.sent();
                        streakDays.forEach(function (day) {
                            var dateKey = day.toISOString().split('T')[0];
                            if (events[dateKey]) {
                                events[dateKey].hasStreak = true;
                            }
                        });
                        return [2 /*return*/, {
                                events: events,
                                currentStreak: currentStreak,
                                month: targetMonth,
                                year: targetYear,
                            }];
                }
            });
        });
    };
    // Calculate current streak
    CalendarService.prototype.calculateStreak = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var activities, streak, today, lastActivity, daysDiff, uniqueDates, sortedDates, currentDate, i, activityDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.activityLog.findMany({
                            where: { patientId: patientId },
                            orderBy: { date: 'desc' },
                            select: { date: true },
                        })];
                    case 1:
                        activities = _a.sent();
                        if (activities.length === 0)
                            return [2 /*return*/, 0];
                        streak = 0;
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        lastActivity = new Date(activities[0].date);
                        lastActivity.setHours(0, 0, 0, 0);
                        daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
                        if (daysDiff > 1) {
                            return [2 /*return*/, 0];
                        }
                        uniqueDates = new Set();
                        activities.forEach(function (activity) {
                            var date = new Date(activity.date);
                            date.setHours(0, 0, 0, 0);
                            uniqueDates.add(date.toISOString());
                        });
                        sortedDates = Array.from(uniqueDates).sort().reverse();
                        currentDate = new Date(sortedDates[0]);
                        for (i = 0; i < sortedDates.length; i++) {
                            activityDate = new Date(sortedDates[i]);
                            if (activityDate.getTime() === currentDate.getTime()) {
                                streak++;
                                currentDate.setDate(currentDate.getDate() - 1);
                            }
                            else {
                                break;
                            }
                        }
                        return [2 /*return*/, streak];
                }
            });
        });
    };
    // Get all days with streak
    CalendarService.prototype.getStreakDays = function (patientId) {
        return __awaiter(this, void 0, void 0, function () {
            var activities, uniqueDates, sortedDates, today, lastActivity, daysDiff, streakDays, currentDate, i, activityDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma.activityLog.findMany({
                            where: { patientId: patientId },
                            orderBy: { date: 'desc' },
                            select: { date: true },
                        })];
                    case 1:
                        activities = _a.sent();
                        if (activities.length === 0)
                            return [2 /*return*/, []];
                        uniqueDates = new Set();
                        activities.forEach(function (activity) {
                            var date = new Date(activity.date);
                            date.setHours(0, 0, 0, 0);
                            uniqueDates.add(date.toISOString());
                        });
                        sortedDates = Array.from(uniqueDates).sort().reverse();
                        today = new Date();
                        today.setHours(0, 0, 0, 0);
                        lastActivity = new Date(sortedDates[0]);
                        daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
                        if (daysDiff > 1) {
                            return [2 /*return*/, []];
                        }
                        streakDays = [];
                        currentDate = new Date(sortedDates[0]);
                        for (i = 0; i < sortedDates.length; i++) {
                            activityDate = new Date(sortedDates[i]);
                            if (activityDate.getTime() === currentDate.getTime()) {
                                streakDays.push(new Date(activityDate));
                                currentDate.setDate(currentDate.getDate() - 1);
                            }
                            else {
                                break;
                            }
                        }
                        return [2 /*return*/, streakDays];
                }
            });
        });
    };
    // Check if date is today
    CalendarService.prototype.isToday = function (date) {
        var today = new Date();
        return (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear());
    };
    // Check if medication is missed
    CalendarService.prototype.isMissed = function (scheduledFor, taken) {
        if (taken)
            return false;
        var now = new Date();
        return scheduledFor < now;
    };
    return CalendarService;
}());
exports.CalendarService = CalendarService;
exports.calendarService = new CalendarService();
