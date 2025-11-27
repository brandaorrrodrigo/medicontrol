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
exports.patientsController = exports.PatientsController = void 0;
var patients_service_1 = require("./patients.service");
var patients_validator_1 = require("./patients.validator");
var zod_1 = require("zod");
var PatientsController = /** @class */ (function () {
    function PatientsController() {
    }
    // GET /api/patients
    PatientsController.prototype.getPatients = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, patients, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        return [4 /*yield*/, patients_service_1.patientsService.getPatients(userId)];
                    case 1:
                        patients = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: patients })];
                    case 2:
                        error_1 = _b.sent();
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/patients/:id
    PatientsController.prototype.getPatientById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, patient, error_2;
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
                        return [4 /*yield*/, patients_service_1.patientsService.getPatientById(id, userId)];
                    case 1:
                        patient = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: patient })];
                    case 2:
                        error_2 = _b.sent();
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_2.message })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/patients/:id
    PatientsController.prototype.updatePatient = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, data, patient, error_3;
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
                        data = patients_validator_1.updatePatientSchema.parse(req.body);
                        return [4 /*yield*/, patients_service_1.patientsService.updatePatient(id, data, userId)];
                    case 1:
                        patient = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: patient })];
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
    // POST /api/patients/:id/link-caregiver
    PatientsController.prototype.linkCaregiver = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, caregiverId, result, error_4;
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
                        caregiverId = patients_validator_1.linkCaregiverSchema.parse(req.body).caregiverId;
                        return [4 /*yield*/, patients_service_1.patientsService.linkCaregiver(id, caregiverId, userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
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
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_4.message })];
                        }
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/patients/:id/unlink-caregiver/:caregiverId
    PatientsController.prototype.unlinkCaregiver = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, id, caregiverId, result, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        _a = req.params, id = _a.id, caregiverId = _a.caregiverId;
                        return [4 /*yield*/, patients_service_1.patientsService.unlinkCaregiver(id, caregiverId, userId)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_5 = _c.sent();
                        if (error_5 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_5.message })];
                        }
                        return [2 /*return*/, next(error_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/patients/:id/link-professional
    PatientsController.prototype.linkProfessional = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, professionalId, result, error_6;
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
                        professionalId = patients_validator_1.linkProfessionalSchema.parse(req.body).professionalId;
                        return [4 /*yield*/, patients_service_1.patientsService.linkProfessional(id, professionalId, userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_6 = _b.sent();
                        if (error_6 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_6.errors,
                                })];
                        }
                        if (error_6 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({ success: false, error: error_6.message })];
                        }
                        return [2 /*return*/, next(error_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/patients/:id/unlink-professional/:professionalId
    PatientsController.prototype.unlinkProfessional = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, id, professionalId, result, error_7;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        _a = req.params, id = _a.id, professionalId = _a.professionalId;
                        return [4 /*yield*/, patients_service_1.patientsService.unlinkProfessional(id, professionalId, userId)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_7 = _c.sent();
                        if (error_7 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_7.message })];
                        }
                        return [2 /*return*/, next(error_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PatientsController;
}());
exports.PatientsController = PatientsController;
exports.patientsController = new PatientsController();
