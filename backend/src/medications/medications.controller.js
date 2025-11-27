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
exports.medicationsController = exports.MedicationsController = void 0;
var medications_service_1 = require("./medications.service");
var medications_validator_1 = require("./medications.validator");
var zod_1 = require("zod");
var MedicationsController = /** @class */ (function () {
    function MedicationsController() {
    }
    // GET /api/medications?patientId=xxx&active=true
    MedicationsController.prototype.getMedications = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, patientId, active, activeOnly, medications, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        _a = req.query, patientId = _a.patientId, active = _a.active;
                        if (!patientId || typeof patientId !== 'string') {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'patientId é obrigatório',
                                })];
                        }
                        activeOnly = active === 'true';
                        return [4 /*yield*/, medications_service_1.medicationsService.getMedications(patientId, activeOnly)];
                    case 1:
                        medications = _c.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: medications })];
                    case 2:
                        error_1 = _c.sent();
                        if (error_1 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_1.message })];
                        }
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/medications/:id
    MedicationsController.prototype.getMedicationById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, medication, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, medications_service_1.medicationsService.getMedicationById(id)];
                    case 1:
                        medication = _a.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: medication })];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_2.message })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/medications
    MedicationsController.prototype.createMedication = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, data, medication, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        data = medications_validator_1.createMedicationSchema.parse(req.body);
                        return [4 /*yield*/, medications_service_1.medicationsService.createMedication(data, userId)];
                    case 1:
                        medication = _b.sent();
                        return [2 /*return*/, res.status(201).json({ success: true, data: medication })];
                    case 2:
                        error_3 = _b.sent();
                        if (error_3 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_3.errors,
                                })];
                        }
                        if (error_3 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_3.message })];
                        }
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/medications/:id
    MedicationsController.prototype.updateMedication = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, data, medication, error_4;
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
                        data = medications_validator_1.updateMedicationSchema.parse(req.body);
                        return [4 /*yield*/, medications_service_1.medicationsService.updateMedication(id, data, userId)];
                    case 1:
                        medication = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: medication })];
                    case 2:
                        error_4 = _b.sent();
                        if (error_4 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_4.errors,
                                })];
                        }
                        if (error_4 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_4.message })];
                        }
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/medications/:id
    MedicationsController.prototype.deleteMedication = function (req, res, next) {
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
                        return [4 /*yield*/, medications_service_1.medicationsService.deleteMedication(id, userId)];
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
    return MedicationsController;
}());
exports.MedicationsController = MedicationsController;
exports.medicationsController = new MedicationsController();
