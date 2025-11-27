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
exports.examsController = exports.ExamsController = void 0;
var exams_service_1 = require("./exams.service");
var exams_validator_1 = require("./exams.validator");
var zod_1 = require("zod");
var ExamsController = /** @class */ (function () {
    function ExamsController() {
    }
    // GET /api/exams?patientId=xxx&status=SCHEDULED
    ExamsController.prototype.getExams = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, patientId, status_1, examStatus, exams, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, patientId = _a.patientId, status_1 = _a.status;
                        if (!patientId || typeof patientId !== 'string') {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'patientId é obrigatório',
                                })];
                        }
                        examStatus = status_1;
                        return [4 /*yield*/, exams_service_1.examsService.getExams(patientId, examStatus)];
                    case 1:
                        exams = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: exams })];
                    case 2:
                        error_1 = _b.sent();
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/:id
    ExamsController.prototype.getExamById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var id, exam, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, exams_service_1.examsService.getExamById(id)];
                    case 1:
                        exam = _a.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: exam })];
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
    // POST /api/exams
    ExamsController.prototype.createExam = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, data, exam, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        data = exams_validator_1.createExamSchema.parse(req.body);
                        return [4 /*yield*/, exams_service_1.examsService.createExam(data, userId)];
                    case 1:
                        exam = _b.sent();
                        return [2 /*return*/, res.status(201).json({ success: true, data: exam })];
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
    // PUT /api/exams/:id
    ExamsController.prototype.updateExam = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, data, exam, error_4;
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
                        data = exams_validator_1.updateExamSchema.parse(req.body);
                        return [4 /*yield*/, exams_service_1.examsService.updateExam(id, data, userId)];
                    case 1:
                        exam = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: exam })];
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
    // POST /api/exams/:id/upload
    ExamsController.prototype.uploadFile = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, file, error_5;
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
                        if (!req.file) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Nenhum arquivo enviado',
                                })];
                        }
                        return [4 /*yield*/, exams_service_1.examsService.uploadFile(id, req.file, userId)];
                    case 1:
                        file = _b.sent();
                        return [2 /*return*/, res.status(201).json({ success: true, data: file })];
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
    // GET /api/exams/files/:fileId/download
    ExamsController.prototype.downloadFile = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var fileId, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fileId = req.params.fileId;
                        return [4 /*yield*/, exams_service_1.examsService.getExamById(fileId)
                            // TODO: Implementar download real do arquivo
                        ];
                    case 1:
                        _a.sent();
                        // TODO: Implementar download real do arquivo
                        return [2 /*return*/, res.status(200).json({ success: true, message: 'Download não implementado' })];
                    case 2:
                        error_6 = _a.sent();
                        return [2 /*return*/, next(error_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/exams/files/:fileId
    ExamsController.prototype.deleteFile = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, fileId, result, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({ success: false, error: 'Não autenticado' })];
                        }
                        fileId = req.params.fileId;
                        return [4 /*yield*/, exams_service_1.examsService.deleteFile(fileId, userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_7 = _b.sent();
                        if (error_7 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_7.message })];
                        }
                        return [2 /*return*/, next(error_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/exams/:id
    ExamsController.prototype.deleteExam = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, id, result, error_8;
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
                        return [4 /*yield*/, exams_service_1.examsService.deleteExam(id, userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(200).json({ success: true, data: result })];
                    case 2:
                        error_8 = _b.sent();
                        if (error_8 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({ success: false, error: error_8.message })];
                        }
                        return [2 /*return*/, next(error_8)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ExamsController;
}());
exports.ExamsController = ExamsController;
exports.examsController = new ExamsController();
