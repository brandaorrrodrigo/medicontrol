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
exports.remindersController = exports.RemindersController = void 0;
var reminders_service_1 = require("./reminders.service");
var RemindersController = /** @class */ (function () {
    function RemindersController() {
    }
    // GET /api/reminders/upcoming?patientId=xxx&limit=10
    RemindersController.prototype.getUpcomingReminders = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, limit, limitNum, reminders, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, patientId = _a.patientId, limit = _a.limit;
                        if (!patientId || typeof patientId !== 'string') {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'patientId é obrigatório',
                                })];
                        }
                        limitNum = limit ? parseInt(limit) : 10;
                        return [4 /*yield*/, reminders_service_1.remindersService.getUpcomingReminders(patientId, limitNum)];
                    case 1:
                        reminders = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: reminders })];
                    case 2:
                        error_1 = _b.sent();
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/reminders/today?patientId=xxx
    RemindersController.prototype.getTodayReminders = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, reminders, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        patientId = req.query.patientId;
                        if (!patientId || typeof patientId !== 'string') {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'patientId é obrigatório',
                                })];
                        }
                        return [4 /*yield*/, reminders_service_1.remindersService.getTodayReminders(patientId)];
                    case 1:
                        reminders = _a.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: reminders })];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/reminders/:id/mark-taken
    RemindersController.prototype.markAsTaken = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, notes, result, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        id = req.params.id;
                        notes = req.body.notes;
                        return [4 /*yield*/, reminders_service_1.remindersService.markAsTaken(id, userId, notes)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_3 = _b.sent();
                        if (error_3 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_3.message })];
                        }
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/reminders
    RemindersController.prototype.createReminder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, medicationId, patientId, scheduledFor, reminder, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, medicationId = _a.medicationId, patientId = _a.patientId, scheduledFor = _a.scheduledFor;
                        if (!medicationId || !patientId || !scheduledFor) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'medicationId, patientId e scheduledFor são obrigatórios',
                                })];
                        }
                        return [4 /*yield*/, reminders_service_1.remindersService.createReminder({
                                medicationId: medicationId,
                                patientId: patientId,
                                scheduledFor: scheduledFor,
                            })];
                    case 1:
                        reminder = _b.sent();
                        return [2 /*return*/, res.status(201).json({ success: true, data: reminder })];
                    case 2:
                        error_4 = _b.sent();
                        if (error_4 instanceof Error) {
                            return [2 /*return*/, res.status(400).json({ success: false, error: error_4.message })];
                        }
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/reminders/:id
    RemindersController.prototype.deleteReminder = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, result, error_5;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        id = req.params.id;
                        return [4 /*yield*/, reminders_service_1.remindersService.deleteReminder(id, userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_5 = _b.sent();
                        if (error_5 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_5.message })];
                        }
                        return [2 /*return*/, next(error_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RemindersController;
}());
exports.RemindersController = RemindersController;
exports.remindersController = new RemindersController();
