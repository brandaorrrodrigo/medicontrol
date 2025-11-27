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
exports.prescriptionsController = exports.PrescriptionsController = void 0;
var prescriptions_service_1 = require("./prescriptions.service");
var prescriptions_validator_1 = require("./prescriptions.validator");
var zod_1 = require("zod");
var PrescriptionsController = /** @class */ (function () {
    function PrescriptionsController() {
    }
    // GET /api/prescriptions?patientId=xxx
    PrescriptionsController.prototype.getPrescriptions = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, prescriptions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        patientId = req.query.patientId;
                        if (!patientId || typeof patientId !== 'string') {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Validation Error',
                                    message: 'patientId é obrigatório',
                                })];
                        }
                        return [4 /*yield*/, prescriptions_service_1.prescriptionsService.getPrescriptions(patientId)];
                    case 1:
                        prescriptions = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: prescriptions,
                            })];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/prescriptions/:id
    PrescriptionsController.prototype.getPrescriptionById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, prescription, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, prescriptions_service_1.prescriptionsService.getPrescriptionById(id)];
                    case 1:
                        prescription = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: prescription,
                            })];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2 instanceof Error && error_2.message === 'Prescrição não encontrada') {
                            return [2 /*return*/, res.status(404).json({
                                    error: 'Not Found',
                                    message: error_2.message,
                                })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/prescriptions
    PrescriptionsController.prototype.createPrescription = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData, userId, prescription, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        validatedData = prescriptions_validator_1.createPrescriptionSchema.parse(req.body);
                        userId = req.user.userId;
                        return [4 /*yield*/, prescriptions_service_1.prescriptionsService.createPrescription(validatedData, userId)];
                    case 1:
                        prescription = _a.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: prescription,
                                message: 'Prescrição criada com sucesso',
                            })];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Validation Error',
                                    details: error_3.errors,
                                })];
                        }
                        if (error_3 instanceof Error && (error_3.message === 'Apenas profissionais podem criar prescrições' ||
                            error_3.message === 'Você não tem acesso a este paciente')) {
                            return [2 /*return*/, res.status(403).json({
                                    error: 'Forbidden',
                                    message: error_3.message,
                                })];
                        }
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/prescriptions/:id
    PrescriptionsController.prototype.updatePrescription = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, validatedData, userId, prescription, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        validatedData = prescriptions_validator_1.updatePrescriptionSchema.parse(req.body);
                        userId = req.user.userId;
                        return [4 /*yield*/, prescriptions_service_1.prescriptionsService.updatePrescription(id, validatedData, userId)];
                    case 1:
                        prescription = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: prescription,
                                message: 'Prescrição atualizada com sucesso',
                            })];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Validation Error',
                                    details: error_4.errors,
                                })];
                        }
                        if (error_4 instanceof Error && error_4.message === 'Prescrição não encontrada') {
                            return [2 /*return*/, res.status(404).json({
                                    error: 'Not Found',
                                    message: error_4.message,
                                })];
                        }
                        if (error_4 instanceof Error && error_4.message === 'Apenas o profissional que criou a prescrição pode alterá-la') {
                            return [2 /*return*/, res.status(403).json({
                                    error: 'Forbidden',
                                    message: error_4.message,
                                })];
                        }
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/prescriptions/:id/items
    PrescriptionsController.prototype.addItem = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, validatedData, userId, item, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        validatedData = prescriptions_validator_1.addItemSchema.parse(req.body);
                        userId = req.user.userId;
                        return [4 /*yield*/, prescriptions_service_1.prescriptionsService.addItem(id, validatedData, userId)];
                    case 1:
                        item = _a.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: item,
                                message: 'Item adicionado à prescrição',
                            })];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Validation Error',
                                    details: error_5.errors,
                                })];
                        }
                        if (error_5 instanceof Error && error_5.message === 'Prescrição não encontrada') {
                            return [2 /*return*/, res.status(404).json({
                                    error: 'Not Found',
                                    message: error_5.message,
                                })];
                        }
                        if (error_5 instanceof Error && error_5.message === 'Acesso negado') {
                            return [2 /*return*/, res.status(403).json({
                                    error: 'Forbidden',
                                    message: error_5.message,
                                })];
                        }
                        return [2 /*return*/, next(error_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/prescriptions/items/:itemId
    PrescriptionsController.prototype.removeItem = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var itemId, userId, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        itemId = req.params.itemId;
                        userId = req.user.userId;
                        return [4 /*yield*/, prescriptions_service_1.prescriptionsService.removeItem(itemId, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Item removido da prescrição',
                            })];
                    case 2:
                        error_6 = _a.sent();
                        if (error_6 instanceof Error && error_6.message === 'Item não encontrado') {
                            return [2 /*return*/, res.status(404).json({
                                    error: 'Not Found',
                                    message: error_6.message,
                                })];
                        }
                        if (error_6 instanceof Error && error_6.message === 'Acesso negado') {
                            return [2 /*return*/, res.status(403).json({
                                    error: 'Forbidden',
                                    message: error_6.message,
                                })];
                        }
                        return [2 /*return*/, next(error_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/prescriptions/:id
    PrescriptionsController.prototype.deletePrescription = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userId, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        userId = req.user.userId;
                        return [4 /*yield*/, prescriptions_service_1.prescriptionsService.deletePrescription(id, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Prescrição deletada com sucesso',
                            })];
                    case 2:
                        error_7 = _a.sent();
                        if (error_7 instanceof Error && error_7.message === 'Prescrição não encontrada') {
                            return [2 /*return*/, res.status(404).json({
                                    error: 'Not Found',
                                    message: error_7.message,
                                })];
                        }
                        if (error_7 instanceof Error && error_7.message === 'Acesso negado') {
                            return [2 /*return*/, res.status(403).json({
                                    error: 'Forbidden',
                                    message: error_7.message,
                                })];
                        }
                        return [2 /*return*/, next(error_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PrescriptionsController;
}());
exports.PrescriptionsController = PrescriptionsController;
exports.prescriptionsController = new PrescriptionsController();
