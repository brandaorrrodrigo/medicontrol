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
exports.examVoiceController = exports.ExamVoiceController = void 0;
var exam_voice_service_1 = require("./exam-voice.service");
var exam_voice_validator_1 = require("./exam-voice.validator");
var zod_1 = require("zod");
var promises_1 = require("fs/promises");
var ExamVoiceController = /** @class */ (function () {
    function ExamVoiceController() {
    }
    // POST /api/exams/voice
    // Upload e processamento de áudio de exame
    ExamVoiceController.prototype.uploadVoice = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var validAudioTypes, data, userId, result, _a, error_1, _b, statusCode;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 10, , 15]);
                        // Validar se arquivo foi enviado
                        if (!req.file) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Nenhum arquivo de áudio foi enviado'
                                })];
                        }
                        validAudioTypes = [
                            'audio/wav',
                            'audio/wave',
                            'audio/x-wav',
                            'audio/mpeg',
                            'audio/mp3',
                            'audio/mp4',
                            'audio/m4a',
                            'audio/x-m4a',
                            'audio/webm',
                            'audio/ogg'
                        ];
                        if (!!validAudioTypes.includes(req.file.mimetype)) return [3 /*break*/, 2];
                        // Remover arquivo
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 1:
                        // Remover arquivo
                        _d.sent();
                        return [2 /*return*/, res.status(400).json({
                                success: false,
                                error: 'Apenas arquivos de áudio são permitidos (WAV, MP3, M4A, OGG, WebM)'
                            })];
                    case 2:
                        data = exam_voice_validator_1.voiceExamUploadSchema.parse(req.body);
                        userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
                        if (!!userId) return [3 /*break*/, 4];
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 3:
                        _d.sent();
                        return [2 /*return*/, res.status(401).json({
                                success: false,
                                error: 'Usuário não autenticado'
                            })];
                    case 4:
                        console.log("\uD83C\uDFA4 Upload de \u00E1udio recebido: ".concat(req.file.originalname));
                        return [4 /*yield*/, exam_voice_service_1.examVoiceService.processVoiceExam(req.file.path, data.patientId, userId, {
                                date: data.date,
                                laboratory: data.laboratory,
                                notes: data.notes
                            })
                            // Remover arquivo de áudio após processamento
                        ];
                    case 5:
                        result = _d.sent();
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 7:
                        _d.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        _a = _d.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/, res.status(201).json({
                            success: true,
                            message: "".concat(result.exams.length, " exame(s) processado(s) com sucesso"),
                            data: result
                        })];
                    case 10:
                        error_1 = _d.sent();
                        if (!req.file) return [3 /*break*/, 14];
                        _d.label = 11;
                    case 11:
                        _d.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, promises_1.default.unlink(req.file.path)];
                    case 12:
                        _d.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        _b = _d.sent();
                        return [3 /*break*/, 14];
                    case 14:
                        if (error_1 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Dados inválidos',
                                    details: error_1.errors
                                })];
                        }
                        if (error_1 instanceof Error) {
                            statusCode = 400;
                            if (error_1.message.includes('Falha ao transcrever')) {
                                statusCode = 502; // Bad Gateway
                            }
                            else if (error_1.message.includes('Paciente não encontrado')) {
                                statusCode = 404;
                            }
                            else if (error_1.message.includes('não tem permissão')) {
                                statusCode = 403;
                            }
                            else if (error_1.message.includes('Nenhum exame reconhecido')) {
                                statusCode = 400;
                            }
                            return [2 /*return*/, res.status(statusCode).json({
                                    success: false,
                                    error: error_1.message
                                })];
                        }
                        return [2 /*return*/, next(error_1)];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/patient/:patientId/voice
    // Listar exames de voz de um paciente
    ExamVoiceController.prototype.listPatientVoiceExams = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var patientId, userId, exams, error_2;
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
                        return [4 /*yield*/, exam_voice_service_1.examVoiceService.listPatientVoiceExams(patientId, userId)];
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
                        error_2 = _b.sent();
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(403).json({
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
    return ExamVoiceController;
}());
exports.ExamVoiceController = ExamVoiceController;
exports.examVoiceController = new ExamVoiceController();
