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
exports.examVoiceService = exports.ExamVoiceService = void 0;
var prisma_1 = require("../database/prisma");
var exams_reference_service_1 = require("./exams-reference.service");
var voice_stt_provider_1 = require("./voice-stt.provider");
var voice_parser_util_1 = require("./voice-parser.util");
var unit_conversion_util_1 = require("./unit-conversion.util");
// ============================================================================
// CLASSE DO SERVICE
// ============================================================================
var ExamVoiceService = /** @class */ (function () {
    function ExamVoiceService() {
        this.sttProvider = (0, voice_stt_provider_1.createSTTProvider)();
    }
    // ==========================================================================
    // VALIDAR PERMISSÃO DE ACESSO AO PACIENTE
    // ==========================================================================
    ExamVoiceService.prototype.validatePatientAccess = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var patient, isOwner, isCaregiver, isProfessional;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                            where: { id: patientId },
                            include: {
                                user: true,
                                caregivers: {
                                    include: {
                                        caregiver: {
                                            include: { user: true }
                                        }
                                    }
                                },
                                professionals: {
                                    include: {
                                        professional: {
                                            include: { user: true }
                                        }
                                    }
                                }
                            }
                        })];
                    case 1:
                        patient = _a.sent();
                        if (!patient) {
                            throw new Error('Paciente não encontrado');
                        }
                        isOwner = patient.userId === userId;
                        isCaregiver = patient.caregivers.some(function (pc) { return pc.caregiver.userId === userId; });
                        isProfessional = patient.professionals.some(function (pp) { return pp.professional.userId === userId; });
                        if (!isOwner && !isCaregiver && !isProfessional) {
                            throw new Error('Você não tem permissão para adicionar exames a este paciente');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PIPELINE COMPLETO DE PROCESSAMENTO DE VOZ
    // ==========================================================================
    ExamVoiceService.prototype.processVoiceExam = function (audioFilePath, patientId, userId, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, validation, transcript, error_1, parseResult, patient, patientSex, patientAge, examDate, exam, exams, _i, _a, entry, unitValidation, normalizedValue, normalizedUnit, interpretation, examResult, error_2, processingTime;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        startTime = Date.now();
                        console.log('🎤 Iniciando processamento de exame por voz...');
                        console.log("   Arquivo: ".concat(audioFilePath));
                        console.log("   Paciente: ".concat(patientId));
                        // 1. Validar permissão
                        return [4 /*yield*/, this.validatePatientAccess(patientId, userId)
                            // 2. Validar arquivo de áudio
                        ];
                    case 1:
                        // 1. Validar permissão
                        _f.sent();
                        // 2. Validar arquivo de áudio
                        console.log('🔍 Validando arquivo de áudio...');
                        return [4 /*yield*/, (0, voice_stt_provider_1.validateAudioFile)(audioFilePath)];
                    case 2:
                        validation = _f.sent();
                        if (!validation.isValid) {
                            throw new Error(validation.error || 'Arquivo de áudio inválido');
                        }
                        console.log('✅ Arquivo de áudio válido');
                        // 3. Transcrever áudio
                        console.log('🎙️ Transcrevendo áudio...');
                        _f.label = 3;
                    case 3:
                        _f.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.sttProvider.transcribe(audioFilePath)];
                    case 4:
                        transcript = _f.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _f.sent();
                        console.error('❌ Erro ao transcrever:', error_1);
                        throw new Error('Falha ao transcrever áudio');
                    case 6:
                        if (!transcript || transcript.trim().length === 0) {
                            throw new Error('Transcrição vazia. Verifique se o áudio contém fala audível.');
                        }
                        console.log('✅ Transcrição concluída');
                        console.log("   Transcri\u00E7\u00E3o: \"".concat(transcript, "\""));
                        // 4. Analisar transcrição para extrair exames
                        console.log('📊 Analisando transcrição...');
                        parseResult = (0, voice_parser_util_1.parseVoiceTextToExamEntries)(transcript);
                        if (parseResult.entries.length === 0) {
                            throw new Error('Nenhum exame reconhecido na fala. Tente mencionar o nome do exame e o valor.');
                        }
                        console.log("\u2705 ".concat(parseResult.entries.length, " exame(s) reconhecido(s)"));
                        return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                                where: { id: patientId }
                            })];
                    case 7:
                        patient = _f.sent();
                        patientSex = (patient === null || patient === void 0 ? void 0 : patient.gender) === 'M' ? 'M' : (patient === null || patient === void 0 ? void 0 : patient.gender) === 'F' ? 'F' : undefined;
                        patientAge = (patient === null || patient === void 0 ? void 0 : patient.dateOfBirth)
                            ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                            : undefined;
                        examDate = (metadata === null || metadata === void 0 ? void 0 : metadata.date) ? new Date(metadata.date) : new Date();
                        return [4 /*yield*/, prisma_1.prisma.exam.create({
                                data: {
                                    patientId: patientId,
                                    name: 'Exame Laboratorial (Voz)',
                                    type: 'Exame Laboratorial',
                                    date: examDate,
                                    status: 'COMPLETED',
                                    location: (metadata === null || metadata === void 0 ? void 0 : metadata.laboratory) || 'Entrada por Voz',
                                    notes: metadata === null || metadata === void 0 ? void 0 : metadata.notes,
                                    voiceEntry: true,
                                    source: 'VOICE',
                                    rawTextExtracted: transcript
                                }
                            })];
                    case 8:
                        exam = _f.sent();
                        console.log('💾 Exame criado');
                        exams = [];
                        _i = 0, _a = parseResult.entries;
                        _f.label = 9;
                    case 9:
                        if (!(_i < _a.length)) return [3 /*break*/, 15];
                        entry = _a[_i];
                        _f.label = 10;
                    case 10:
                        _f.trys.push([10, 13, , 14]);
                        console.log("\uD83D\uDD2C Processando ".concat(entry.markerCode, "..."));
                        unitValidation = (0, unit_conversion_util_1.validateAndNormalizeUnit)(entry.markerCode, entry.value, entry.unit);
                        normalizedValue = unitValidation.value;
                        normalizedUnit = unitValidation.unit;
                        if (unitValidation.normalized) {
                            console.log("   Convertido: ".concat(entry.value, " ").concat(entry.unit, " \u2192 ").concat(normalizedValue, " ").concat(normalizedUnit));
                        }
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.interpretResult(entry.markerCode, normalizedValue, patientSex, patientAge)];
                    case 11:
                        interpretation = _f.sent();
                        if (!interpretation) {
                            console.log("   \u26A0\uFE0F N\u00E3o foi poss\u00EDvel interpretar ".concat(entry.markerCode));
                            return [3 /*break*/, 14];
                        }
                        console.log("   Status: ".concat(interpretation.status));
                        return [4 /*yield*/, prisma_1.prisma.examResult.create({
                                data: {
                                    examId: exam.id,
                                    markerCode: interpretation.markerCode,
                                    markerName: interpretation.markerName,
                                    value: normalizedValue,
                                    unit: normalizedUnit,
                                    status: interpretation.status,
                                    interpretationText: interpretation.interpretationText,
                                    referenceMin: (_b = interpretation.referenceRange) === null || _b === void 0 ? void 0 : _b.low,
                                    referenceMax: (_c = interpretation.referenceRange) === null || _c === void 0 ? void 0 : _c.high,
                                    confidence: entry.confidence,
                                    extractionMethod: 'voice',
                                    rawTextSnippet: entry.rawSegment
                                }
                            })];
                    case 12:
                        examResult = _f.sent();
                        exams.push({
                            examId: exam.id,
                            examResultId: examResult.id,
                            markerCode: interpretation.markerCode,
                            markerName: interpretation.markerName,
                            value: entry.value,
                            unit: entry.unit,
                            normalizedValue: normalizedValue,
                            normalizedUnit: normalizedUnit,
                            status: interpretation.status,
                            interpretation: interpretation.interpretationText,
                            referenceMin: (_d = interpretation.referenceRange) === null || _d === void 0 ? void 0 : _d.low,
                            referenceMax: (_e = interpretation.referenceRange) === null || _e === void 0 ? void 0 : _e.high,
                            source: 'VOICE'
                        });
                        console.log("\u2705 ".concat(entry.markerCode, " salvo"));
                        return [3 /*break*/, 14];
                    case 13:
                        error_2 = _f.sent();
                        console.error("\u274C Erro ao processar ".concat(entry.markerCode, ":"), error_2);
                        return [3 /*break*/, 14];
                    case 14:
                        _i++;
                        return [3 /*break*/, 9];
                    case 15:
                        processingTime = Date.now() - startTime;
                        console.log('✨ Processamento concluído!');
                        console.log("   Tempo total: ".concat(processingTime, "ms"));
                        console.log("   Exames salvos: ".concat(exams.length));
                        return [2 /*return*/, {
                                transcript: transcript,
                                exams: exams,
                                unmatchedSegments: parseResult.unmatchedSegments,
                                processingTime: processingTime
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // LISTAR EXAMES DE VOZ DE UM PACIENTE
    // ==========================================================================
    ExamVoiceService.prototype.listPatientVoiceExams = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var exams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Verificar permissão
                    return [4 /*yield*/, this.validatePatientAccess(patientId, userId)
                        // Buscar exames
                    ];
                    case 1:
                        // Verificar permissão
                        _a.sent();
                        return [4 /*yield*/, prisma_1.prisma.exam.findMany({
                                where: {
                                    patientId: patientId,
                                    voiceEntry: true
                                },
                                include: {
                                    results: {
                                        select: {
                                            id: true,
                                            markerCode: true,
                                            markerName: true,
                                            status: true,
                                            value: true,
                                            unit: true
                                        }
                                    }
                                },
                                orderBy: {
                                    date: 'desc'
                                }
                            })];
                    case 2:
                        exams = _a.sent();
                        return [2 /*return*/, exams];
                }
            });
        });
    };
    return ExamVoiceService;
}());
exports.ExamVoiceService = ExamVoiceService;
exports.examVoiceService = new ExamVoiceService();
