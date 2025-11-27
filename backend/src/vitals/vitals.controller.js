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
exports.vitalsController = exports.VitalsController = void 0;
var vitals_service_1 = require("./vitals.service");
var vitals_validator_1 = require("./vitals.validator");
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
var VitalsController = /** @class */ (function () {
    function VitalsController() {
    }
    // GET /api/vitals?patientId=xxx&type=BLOOD_PRESSURE&limit=50
    VitalsController.prototype.getVitalSigns = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, type, limit, vitalType, limitNum, vitalSigns, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, patientId = _a.patientId, type = _a.type, limit = _a.limit;
                        if (!patientId || typeof patientId !== 'string') {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'patientId é obrigatório',
                                })];
                        }
                        vitalType = type;
                        limitNum = limit ? parseInt(limit) : 50;
                        return [4 /*yield*/, vitals_service_1.vitalsService.getVitalSigns(patientId, vitalType, limitNum)];
                    case 1:
                        vitalSigns = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: vitalSigns })];
                    case 2:
                        error_1 = _b.sent();
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/vitals
    VitalsController.prototype.createVitalSign = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, data, vitalSign, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        data = vitals_validator_1.createVitalSignSchema.parse(req.body);
                        return [4 /*yield*/, vitals_service_1.vitalsService.createVitalSign(data, userId)];
                    case 1:
                        vitalSign = _b.sent();
                        return [2 /*return*/, res.status(201).json({ success: true, data: vitalSign })];
                    case 2:
                        error_2 = _b.sent();
                        if (error_2 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_2.errors,
                                })];
                        }
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_2.message })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/vitals/:id
    VitalsController.prototype.deleteVitalSign = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, result, error_3;
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
                        return [4 /*yield*/, vitals_service_1.vitalsService.deleteVitalSign(id, userId)];
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
    // GET /api/vitals/stats?patientId=xxx&type=BLOOD_PRESSURE&days=30
    VitalsController.prototype.getStats = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, type, days, daysNum, stats, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, patientId = _a.patientId, type = _a.type, days = _a.days;
                        if (!patientId || typeof patientId !== 'string') {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'patientId é obrigatório',
                                })];
                        }
                        if (!type || typeof type !== 'string' || !Object.values(client_1.VitalSignType).includes(type)) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'type é obrigatório e deve ser um tipo válido',
                                })];
                        }
                        daysNum = days ? parseInt(days) : 30;
                        return [4 /*yield*/, vitals_service_1.vitalsService.getStats(patientId, type, daysNum)];
                    case 1:
                        stats = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: stats })];
                    case 2:
                        error_4 = _b.sent();
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return VitalsController;
}());
exports.VitalsController = VitalsController;
exports.vitalsController = new VitalsController();
