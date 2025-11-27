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
exports.examPhotoUploadController = exports.ExamPhotoUploadController = void 0;
var exam_photo_upload_service_1 = require("./exam-photo-upload.service");
var exam_photo_upload_validator_1 = require("./exam-photo-upload.validator");
var zod_1 = require("zod");
var promises_1 = require("fs/promises");
var ExamPhotoUploadController = /** @class */ (function () {
    function ExamPhotoUploadController() {
    }
    // POST /api/exams/upload-photo
    // Upload e processamento de foto de exame
    ExamPhotoUploadController.prototype.uploadPhoto = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validImageTypes, data, userId_1, patient, isOwner, isCaregiver, isProfessional, result, error_1, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 12, , 17]);
                        // Validar se arquivo foi enviado
                        if (!req.file) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Nenhuma foto foi enviada'
                                })];
                        }
                        validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                        if (!!validImageTypes.includes(req.file.mimetype)) return [3 /*break*/, 2];
                        // Remover arquivo
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 1:
                        // Remover arquivo
                        _c.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                error: 'Apenas arquivos de imagem são permitidos (JPEG, PNG, WebP)'
                            })];
                    case 2:
                        data = exam_photo_upload_validator_1.uploadExamPhotoSchema.parse(req.body);
                        userId_1 = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        if (!!userId_1) return [3 /*break*/, 4];
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, res.status(401).json({
                                success: false,
                                error: 'Usuário não autenticado'
                            })];
                    case 4: return [4 /*yield*/, Promise.resolve().then(function () { return require('../database/prisma'); })];
                    case 5: return [4 /*yield*/, (_c.sent()).prisma.patient.findUnique({
                            where: { id: data.patientId },
                            include: {
                                user: true,
                                caregivers: {
                                    include: {
                                        caregiver: { include: { user: true } }
                                    }
                                },
                                professionals: {
                                    include: {
                                        professional: { include: { user: true } }
                                    }
                                }
                            }
                        })];
                    case 6:
                        patient = _c.sent();
                        if (!!patient) return [3 /*break*/, 8];
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/, res.status(404).json({
                                success: false,
                                error: 'Paciente não encontrado'
                            })];
                    case 8:
                        isOwner = patient.userId === userId_1;
                        isCaregiver = patient.caregivers.some(function (pc) { return pc.caregiver.userId === userId_1; });
                        isProfessional = patient.professionals.some(function (pp) { return pp.professional.userId === userId_1; });
                        if (!(!isOwner && !isCaregiver && !isProfessional)) return [3 /*break*/, 10];
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/, res.status(403).json({
                                success: false,
                                error: 'Você não tem permissão para adicionar exames a este paciente'
                            })];
                    case 10:
                        // Processar foto
                        console.log("\uD83D\uDCF8 Upload de foto recebido: ".concat(req.file.originalname));
                        return [4 /*yield*/, exam_photo_upload_service_1.examPhotoUploadService.processPhotoUpload(req.file.path, data)];
                    case 11:
                        result = _c.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                message: 'Foto processada com sucesso',
                                data: result
                            })];
                    case 12:
                        error_1 = _c.sent();
                        if (!req.file) return [3 /*break*/, 16];
                        _c.label = 13;
                    case 13:
                        _c.trys.push([13, 15, , 16]);
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 14:
                        _c.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        _a = _c.sent();
                        return [3 /*break*/, 16];
                    case 16:
                        if (error_1 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Dados inválidos',
                                    details: error_1.errors
                                })];
                        }
                        if (error_1 instanceof Error) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: error_1.message
                                })];
                        }
                        return [2 /*return*/, next(error_1)];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/:examId/photo-results
    // Buscar exame de foto com resultados detalhados
    ExamPhotoUploadController.prototype.getPhotoResults = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var examId, userId, exam, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        examId = req.params.examId;
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Usuário não autenticado'
                                })];
                        }
                        return [4 /*yield*/, exam_photo_upload_service_1.examPhotoUploadService.getExamWithPhoto(examId, userId)];
                    case 1:
                        exam = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: exam
                            })];
                    case 2:
                        error_2 = _b.sent();
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_2.message
                                })];
                        }
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/patient/:patientId/photos
    // Listar todos os exames de foto de um paciente
    ExamPhotoUploadController.prototype.listPatientPhotoExams = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, userId, exams, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        patientId = req.params.patientId;
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Usuário não autenticado'
                                })];
                        }
                        return [4 /*yield*/, exam_photo_upload_service_1.examPhotoUploadService.listPatientPhotoExams(patientId, userId)];
                    case 1:
                        exams = _b.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: {
                                    count: exams.length,
                                    exams: exams
                                }
                            })];
                    case 2:
                        error_3 = _b.sent();
                        if (error_3 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({
                                    success: false,
                                    error: error_3.message
                                })];
                        }
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/:examId/photo
    // Download da foto original
    ExamPhotoUploadController.prototype.downloadPhoto = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var examId, userId, exam, _a, ext, error_4;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        examId = req.params.examId;
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Usuário não autenticado'
                                })];
                        }
                        return [4 /*yield*/, exam_photo_upload_service_1.examPhotoUploadService.getExamWithPhoto(examId, userId)];
                    case 1:
                        exam = _c.sent();
                        if (!exam.photoPath) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Foto não encontrada'
                                })];
                        }
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, promises_1.default.access(exam.photoPath)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _c.sent();
                        return [2 /*return*/, res.status(404).json({
                                success: false,
                                error: 'Arquivo de foto não encontrado no servidor'
                            })];
                    case 5:
                        ext = exam.photoPath.split('.').pop() || 'jpg';
                        // Enviar arquivo
                        return [2 /*return*/, res.download(exam.photoPath, "exame-foto-".concat(exam.id, ".").concat(ext))];
                    case 6:
                        error_4 = _c.sent();
                        if (error_4 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_4.message
                                })];
                        }
                        return [2 /*return*/, next(error_4)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/:examId/processed-photo
    // Download da foto processada (com pré-processamento para OCR)
    ExamPhotoUploadController.prototype.downloadProcessedPhoto = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var examId, userId, exam, _a, error_5;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        examId = req.params.examId;
                        userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Usuário não autenticado'
                                })];
                        }
                        return [4 /*yield*/, exam_photo_upload_service_1.examPhotoUploadService.getExamWithPhoto(examId, userId)];
                    case 1:
                        exam = _c.sent();
                        if (!exam.processedPhotoPath) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Foto processada não encontrada'
                                })];
                        }
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, promises_1.default.access(exam.processedPhotoPath)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        _a = _c.sent();
                        return [2 /*return*/, res.status(404).json({
                                success: false,
                                error: 'Arquivo de foto processada não encontrado no servidor'
                            })];
                    case 5: 
                    // Enviar arquivo (sempre PNG)
                    return [2 /*return*/, res.download(exam.processedPhotoPath, "exame-foto-processada-".concat(exam.id, ".png"))];
                    case 6:
                        error_5 = _c.sent();
                        if (error_5 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_5.message
                                })];
                        }
                        return [2 /*return*/, next(error_5)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return ExamPhotoUploadController;
}());
exports.ExamPhotoUploadController = ExamPhotoUploadController;
exports.examPhotoUploadController = new ExamPhotoUploadController();
