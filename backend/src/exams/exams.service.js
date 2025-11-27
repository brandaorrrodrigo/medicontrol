"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.examsService = exports.ExamsService = void 0;
var prisma_1 = require("../database/prisma");
var client_1 = require("@prisma/client");
var promises_1 = require("fs/promises");
var ExamsService = /** @class */ (function () {
    function ExamsService() {
    }
    // Listar exames de um paciente
    ExamsService.prototype.getExams = function (patientId, status) {
        return __awaiter(this, void 0, void 0, function () {
            var exams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.exam.findMany({
                            where: __assign({ patientId: patientId }, (status && { status: status })),
                            orderBy: { date: 'desc' },
                            include: {
                                files: true,
                            },
                        })];
                    case 1:
                        exams = _a.sent();
                        return [2 /*return*/, exams.map(function (exam) { return ({
                                id: exam.id,
                                patientId: exam.patientId,
                                name: exam.name,
                                type: exam.type,
                                date: exam.date.toISOString(),
                                status: exam.status,
                                result: exam.result,
                                doctor: exam.doctor,
                                location: exam.location,
                                notes: exam.notes,
                                createdAt: exam.createdAt.toISOString(),
                                updatedAt: exam.updatedAt.toISOString(),
                                files: exam.files.map(function (f) { return ({
                                    id: f.id,
                                    filename: f.filename,
                                    mimetype: f.mimetype,
                                    size: f.size,
                                    createdAt: f.createdAt.toISOString(),
                                }); }),
                            }); })];
                }
            });
        });
    };
    // Obter detalhes de um exame
    ExamsService.prototype.getExamById = function (examId) {
        return __awaiter(this, void 0, void 0, function () {
            var exam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.exam.findUnique({
                            where: { id: examId },
                            include: {
                                patient: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                files: true,
                            },
                        })];
                    case 1:
                        exam = _a.sent();
                        if (!exam) {
                            throw new Error('Exame não encontrado');
                        }
                        return [2 /*return*/, {
                                id: exam.id,
                                patientId: exam.patientId,
                                patientName: exam.patient.name,
                                name: exam.name,
                                type: exam.type,
                                date: exam.date.toISOString(),
                                status: exam.status,
                                result: exam.result,
                                doctor: exam.doctor,
                                location: exam.location,
                                notes: exam.notes,
                                createdAt: exam.createdAt.toISOString(),
                                updatedAt: exam.updatedAt.toISOString(),
                                files: exam.files.map(function (f) { return ({
                                    id: f.id,
                                    filename: f.filename,
                                    filepath: f.filepath,
                                    mimetype: f.mimetype,
                                    size: f.size,
                                    createdAt: f.createdAt.toISOString(),
                                }); }),
                            }];
                }
            });
        });
    };
    // Criar exame
    ExamsService.prototype.createExam = function (data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var exam;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar acesso
                    return [4 /*yield*/, this.verifyPatientAccess(data.patientId, userId)];
                    case 1:
                        // Verificar acesso
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.exam.create({
                                data: {
                                    patientId: data.patientId,
                                    name: data.name,
                                    type: data.type,
                                    date: new Date(data.date),
                                    status: data.status || client_1.ExamStatus.SCHEDULED,
                                    result: data.result,
                                    doctor: data.doctor,
                                    location: data.location,
                                    notes: data.notes,
                                },
                            })];
                    case 2:
                        exam = _a.sent();
                        return [2 /*return*/, {
                                id: exam.id,
                                patientId: exam.patientId,
                                name: exam.name,
                                type: exam.type,
                                date: exam.date.toISOString(),
                                status: exam.status,
                                createdAt: exam.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Atualizar exame
    ExamsService.prototype.updateExam = function (examId, data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var exam, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.exam.findUnique({
                            where: { id: examId },
                        })];
                    case 1:
                        exam = _a.sent();
                        if (!exam) {
                            throw new Error('Exame não encontrado');
                        }
                        return [4 /*yield*/, this.verifyPatientAccess(exam.patientId, userId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.exam.update({
                                where: { id: examId },
                                data: __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (data.name && { name: data.name })), (data.type && { type: data.type })), (data.date && { date: new Date(data.date) })), (data.status && { status: data.status })), (data.result !== undefined && { result: data.result })), (data.doctor !== undefined && { doctor: data.doctor })), (data.location !== undefined && { location: data.location })), (data.notes !== undefined && { notes: data.notes })),
                            })];
                    case 3:
                        updated = _a.sent();
                        return [2 /*return*/, {
                                id: updated.id,
                                patientId: updated.patientId,
                                name: updated.name,
                                type: updated.type,
                                date: updated.date.toISOString(),
                                status: updated.status,
                                updatedAt: updated.updatedAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Upload de arquivo para exame
    ExamsService.prototype.uploadFile = function (examId, file, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var exam, examFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.exam.findUnique({
                            where: { id: examId },
                        })];
                    case 1:
                        exam = _a.sent();
                        if (!exam) {
                            throw new Error('Exame não encontrado');
                        }
                        return [4 /*yield*/, this.verifyPatientAccess(exam.patientId, userId)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.examFile.create({
                                data: {
                                    examId: examId,
                                    filename: file.filename,
                                    filepath: file.path,
                                    mimetype: file.mimetype,
                                    size: file.size,
                                },
                            })];
                    case 3:
                        examFile = _a.sent();
                        return [2 /*return*/, {
                                id: examFile.id,
                                filename: examFile.filename,
                                mimetype: examFile.mimetype,
                                size: examFile.size,
                                createdAt: examFile.createdAt.toISOString(),
                            }];
                }
            });
        });
    };
    // Deletar arquivo de exame
    ExamsService.prototype.deleteFile = function (fileId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var file, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.examFile.findUnique({
                            where: { id: fileId },
                            include: {
                                exam: true,
                            },
                        })];
                    case 1:
                        file = _a.sent();
                        if (!file) {
                            throw new Error('Arquivo não encontrado');
                        }
                        return [4 /*yield*/, this.verifyPatientAccess(file.exam.patientId, userId)
                            // Deletar arquivo físico
                        ];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, promises_1.default.unlink(file.filepath)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error('Erro ao deletar arquivo físico:', error_1);
                        return [3 /*break*/, 6];
                    case 6: 
                    // Deletar registro do banco
                    return [4 /*yield*/, prisma_1.prisma.examFile.delete({
                            where: { id: fileId },
                        })];
                    case 7:
                        // Deletar registro do banco
                        _a.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // Deletar exame
    ExamsService.prototype.deleteExam = function (examId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var exam, _i, _a, file, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.exam.findUnique({
                            where: { id: examId },
                            include: {
                                files: true,
                            },
                        })];
                    case 1:
                        exam = _b.sent();
                        if (!exam) {
                            throw new Error('Exame não encontrado');
                        }
                        return [4 /*yield*/, this.verifyPatientAccess(exam.patientId, userId)
                            // Deletar arquivos físicos
                        ];
                    case 2:
                        _b.sent();
                        _i = 0, _a = exam.files;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        file = _a[_i];
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, promises_1.default.unlink(file.filepath)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _b.sent();
                        console.error('Erro ao deletar arquivo:', error_2);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8: 
                    // Deletar exame (cascade deleta os files)
                    return [4 /*yield*/, prisma_1.prisma.exam.delete({
                            where: { id: examId },
                        })];
                    case 9:
                        // Deletar exame (cascade deleta os files)
                        _b.sent();
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    // Verificar acesso ao paciente
    ExamsService.prototype.verifyPatientAccess = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.user.findUnique({
                            where: { id: userId },
                            include: {
                                patient: true,
                                caregiver: {
                                    include: {
                                        patients: {
                                            where: { patientId: patientId },
                                        },
                                    },
                                },
                                professional: {
                                    include: {
                                        patients: {
                                            where: { patientId: patientId },
                                        },
                                    },
                                },
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Usuário não encontrado');
                        }
                        if (user.patient && user.patient.id === patientId)
                            return [2 /*return*/, true];
                        if (user.caregiver && user.caregiver.patients.length > 0)
                            return [2 /*return*/, true];
                        if (user.professional && user.professional.patients.length > 0)
                            return [2 /*return*/, true];
                        throw new Error('Acesso negado');
                }
            });
        });
    };
    return ExamsService;
}());
exports.ExamsService = ExamsService;
exports.examsService = new ExamsService();
