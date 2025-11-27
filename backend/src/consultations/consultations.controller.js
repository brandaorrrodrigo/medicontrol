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
exports.consultationsController = exports.ConsultationsController = void 0;
var consultations_service_1 = require("./consultations.service");
var consultations_validator_1 = require("./consultations.validator");
var zod_1 = require("zod");
var ConsultationsController = /** @class */ (function () {
    function ConsultationsController() {
    }
    // GET /api/consultations?patientId=xxx OR ?professionalId=xxx
    ConsultationsController.prototype.getConsultations = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, professionalId, consultations, consultations, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = req.query, patientId = _a.patientId, professionalId = _a.professionalId;
                        if (!(patientId && typeof patientId === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, consultations_service_1.consultationsService.getConsultations(patientId)];
                    case 1:
                        consultations = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: consultations,
                            })];
                    case 2:
                        if (!(professionalId && typeof professionalId === 'string')) return [3 /*break*/, 4];
                        return [4 /*yield*/, consultations_service_1.consultationsService.getConsultationsByProfessional(professionalId)];
                    case 3:
                        consultations = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: consultations,
                            })];
                    case 4: return [2 /*return*/, res.status(400).json({
                            error: 'Validation Error',
                            message: 'patientId ou professionalId é obrigatório',
                        })];
                    case 5:
                        error_1 = _b.sent();
                        return [2 /*return*/, next(error_1)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/consultations/:id
    ConsultationsController.prototype.getConsultationById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, consultation, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, consultations_service_1.consultationsService.getConsultationById(id)];
                    case 1:
                        consultation = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: consultation,
                            })];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2 instanceof Error && error_2.message === 'Consulta não encontrada') {
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
    // POST /api/consultations
    ConsultationsController.prototype.createConsultation = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData, userId, consultation, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        validatedData = consultations_validator_1.createConsultationSchema.parse(req.body);
                        userId = req.user.userId;
                        return [4 /*yield*/, consultations_service_1.consultationsService.createConsultation(validatedData, userId)];
                    case 1:
                        consultation = _a.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                data: consultation,
                                message: 'Consulta criada com sucesso',
                            })];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Validation Error',
                                    details: error_3.errors,
                                })];
                        }
                        if (error_3 instanceof Error && (error_3.message === 'Apenas profissionais podem criar consultas' ||
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
    // PUT /api/consultations/:id
    ConsultationsController.prototype.updateConsultation = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, validatedData, userId, consultation, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        validatedData = consultations_validator_1.updateConsultationSchema.parse(req.body);
                        userId = req.user.userId;
                        return [4 /*yield*/, consultations_service_1.consultationsService.updateConsultation(id, validatedData, userId)];
                    case 1:
                        consultation = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: consultation,
                                message: 'Consulta atualizada com sucesso',
                            })];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    error: 'Validation Error',
                                    details: error_4.errors,
                                })];
                        }
                        if (error_4 instanceof Error && error_4.message === 'Consulta não encontrada') {
                            return [2 /*return*/, res.status(404).json({
                                    error: 'Not Found',
                                    message: error_4.message,
                                })];
                        }
                        if (error_4 instanceof Error && error_4.message === 'Apenas o profissional que criou a consulta pode alterá-la') {
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
    // PATCH /api/consultations/:id/status
    // NOTE: updateStatus endpoint is disabled until schema is updated
    // The 'status' field is not available in the current Prisma schema
    ConsultationsController.prototype.updateStatus = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, _status;
            return __generator(this, function (_a) {
                try {
                    _id = req.params.id;
                    _status = req.body.status;
                    // userId would be needed for real implementation: req.user!.userId
                    if (!_status || !['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(_status)) {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Validation Error',
                                message: 'Status inválido',
                            })];
                    }
                    return [2 /*return*/, res.status(501).json({
                            error: 'Not Implemented',
                            message: 'updateStatus endpoint is disabled until schema is updated',
                        })];
                }
                catch (error) {
                    return [2 /*return*/, next(error)];
                }
                return [2 /*return*/];
            });
        });
    };
    // DELETE /api/consultations/:id
    ConsultationsController.prototype.deleteConsultation = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userId, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        userId = req.user.userId;
                        return [4 /*yield*/, consultations_service_1.consultationsService.deleteConsultation(id, userId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Consulta deletada com sucesso',
                            })];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof Error && error_5.message === 'Consulta não encontrada') {
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
    return ConsultationsController;
}());
exports.ConsultationsController = ConsultationsController;
exports.consultationsController = new ConsultationsController();
