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
exports.examUploadService = exports.ExamUploadService = void 0;
var prisma_1 = require("../database/prisma");
var exam_parser_util_1 = require("./exam-parser.util");
var llama_extractor_util_1 = require("./llama-extractor.util");
var exams_reference_service_1 = require("./exams-reference.service");
// ============================================================================
// CLASSE DO SERVICE
// ============================================================================
var ExamUploadService = /** @class */ (function () {
    function ExamUploadService() {
    }
    // ==========================================================================
    // EXTRAÇÃO DE TEXTO DO PDF
    // ==========================================================================
    ExamUploadService.prototype.extractTextFromPDF = function (pdfPath) {
        return __awaiter(this, void 0, void 0, function () {
            var PDFExtract, pdfExtract, pdfData, text, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('📄 Extraindo texto do PDF...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        PDFExtract = require('pdf.js-extract').PDFExtract;
                        pdfExtract = new PDFExtract();
                        return [4 /*yield*/, pdfExtract.extract(pdfPath, {})
                            // Extrair texto de todas as páginas
                        ];
                    case 2:
                        pdfData = _a.sent();
                        text = pdfData.pages
                            .map(function (page) {
                            return page.content
                                .map(function (item) { return item.str; })
                                .join(' ');
                        })
                            .join('\n');
                        if (text.trim().length > 100) {
                            console.log('✅ Texto extraído com sucesso (método: text)');
                            return [2 /*return*/, { text: text, method: 'text' }];
                        }
                        throw new Error('Texto extraído muito curto, pode ser PDF escaneado');
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Erro na extração de texto:', error_1);
                        // Aqui poderíamos adicionar OCR como fallback
                        // return await this.extractWithOCR(pdfPath)
                        throw new Error('Falha ao extrair texto do PDF. O arquivo pode estar corrompido ou ser uma imagem escaneada.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PIPELINE COMPLETO DE PROCESSAMENTO
    // ==========================================================================
    ExamUploadService.prototype.processPDFUpload = function (filePath, input) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, _a, rawText, extractionMethod, parsed, extractedMarkers, aiAvailable, chunks, aiMarkers, _i, aiMarkers_1, aiMarker, error_2, mappedMarkers, failedMarkers, _b, extractedMarkers_1, marker, markerCode, interpretedMarkers, patient, patientSex, patientAge, _c, mappedMarkers_1, marker, interpretation, error_3, examDate, examType, laboratory, exam, _loop_1, _d, interpretedMarkers_1, interpreted, summary;
            var _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        errors = [];
                        // 1. Extrair texto do PDF
                        console.log('🔍 Iniciando processamento do PDF...');
                        return [4 /*yield*/, this.extractTextFromPDF(filePath)
                            // 2. Parse com heurísticas e regex
                        ];
                    case 1:
                        _a = _k.sent(), rawText = _a.text, extractionMethod = _a.method;
                        // 2. Parse com heurísticas e regex
                        console.log('🧮 Analisando conteúdo...');
                        parsed = (0, exam_parser_util_1.parseExamPDF)(rawText);
                        extractedMarkers = parsed.extractedMarkers;
                        if (!(extractedMarkers.length < 3)) return [3 /*break*/, 8];
                        console.log('⚠️ Poucos marcadores detectados. Tentando com IA...');
                        return [4 /*yield*/, (0, llama_extractor_util_1.isOllamaAvailable)()];
                    case 2:
                        aiAvailable = _k.sent();
                        if (!aiAvailable) return [3 /*break*/, 7];
                        _k.label = 3;
                    case 3:
                        _k.trys.push([3, 5, , 6]);
                        chunks = (0, llama_extractor_util_1.splitTextIntoChunks)(rawText);
                        return [4 /*yield*/, (0, llama_extractor_util_1.extractWithAI)(chunks[0])
                            // Converter marcadores da IA para formato padrão
                        ]; // Processar primeiro chunk
                    case 4:
                        aiMarkers = _k.sent() // Processar primeiro chunk
                        ;
                        // Converter marcadores da IA para formato padrão
                        for (_i = 0, aiMarkers_1 = aiMarkers; _i < aiMarkers_1.length; _i++) {
                            aiMarker = aiMarkers_1[_i];
                            extractedMarkers.push({
                                rawName: aiMarker.markerName,
                                value: aiMarker.value,
                                unit: aiMarker.unit,
                                confidence: aiMarker.confidence,
                                method: 'ai',
                                rawSnippet: ''
                            });
                        }
                        console.log("\u2705 IA extraiu ".concat(aiMarkers.length, " marcadores adicionais"));
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _k.sent();
                        console.error('❌ Erro na extração com IA:', error_2);
                        errors.push('Falha ao usar IA para extração adicional');
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        console.log('ℹ️ IA não disponível. Usando apenas regex/heurísticas.');
                        _k.label = 8;
                    case 8:
                        // 4. Mapear para marker codes
                        console.log('🗺️ Mapeando marcadores...');
                        mappedMarkers = [];
                        failedMarkers = [];
                        for (_b = 0, extractedMarkers_1 = extractedMarkers; _b < extractedMarkers_1.length; _b++) {
                            marker = extractedMarkers_1[_b];
                            markerCode = (0, exam_parser_util_1.mapToMarkerCode)(marker.rawName);
                            if (markerCode) {
                                mappedMarkers.push({
                                    rawName: marker.rawName,
                                    value: marker.value,
                                    unit: marker.unit,
                                    markerCode: markerCode,
                                    confidence: marker.confidence,
                                    method: marker.method
                                });
                            }
                            else {
                                failedMarkers.push(marker.rawName);
                                errors.push("Marcador n\u00E3o identificado: ".concat(marker.rawName));
                            }
                        }
                        console.log("\u2705 Mapeados: ".concat(mappedMarkers.length, " | Falhas: ").concat(failedMarkers.length));
                        // 5. Interpretar resultados
                        console.log('🔬 Interpretando resultados...');
                        interpretedMarkers = [];
                        return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                                where: { id: input.patientId }
                            })];
                    case 9:
                        patient = _k.sent();
                        patientSex = (patient === null || patient === void 0 ? void 0 : patient.gender) === 'M' ? 'M' : (patient === null || patient === void 0 ? void 0 : patient.gender) === 'F' ? 'F' : undefined;
                        patientAge = (patient === null || patient === void 0 ? void 0 : patient.dateOfBirth)
                            ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                            : undefined;
                        _c = 0, mappedMarkers_1 = mappedMarkers;
                        _k.label = 10;
                    case 10:
                        if (!(_c < mappedMarkers_1.length)) return [3 /*break*/, 15];
                        marker = mappedMarkers_1[_c];
                        if (!marker.markerCode)
                            return [3 /*break*/, 14];
                        _k.label = 11;
                    case 11:
                        _k.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.interpretResult(marker.markerCode, marker.value, patientSex, patientAge)];
                    case 12:
                        interpretation = _k.sent();
                        if (interpretation) {
                            interpretedMarkers.push({
                                markerCode: interpretation.markerCode,
                                markerName: interpretation.markerName,
                                value: interpretation.value,
                                unit: interpretation.unit,
                                status: interpretation.status,
                                interpretationText: interpretation.interpretationText,
                                referenceMin: (_e = interpretation.referenceRange) === null || _e === void 0 ? void 0 : _e.low,
                                referenceMax: (_f = interpretation.referenceRange) === null || _f === void 0 ? void 0 : _f.high
                            });
                        }
                        return [3 /*break*/, 14];
                    case 13:
                        error_3 = _k.sent();
                        console.error("\u274C Erro ao interpretar ".concat(marker.markerCode, ":"), error_3);
                        errors.push("Erro ao interpretar ".concat(marker.rawName));
                        return [3 /*break*/, 14];
                    case 14:
                        _c++;
                        return [3 /*break*/, 10];
                    case 15:
                        // 6. Criar registro no banco de dados
                        console.log('💾 Salvando no banco de dados...');
                        examDate = input.examDate ? new Date(input.examDate) : parsed.examDate || new Date();
                        examType = input.examType || 'Exame Laboratorial';
                        laboratory = input.laboratory || parsed.laboratory || 'Não identificado';
                        return [4 /*yield*/, prisma_1.prisma.exam.create({
                                data: {
                                    patientId: input.patientId,
                                    name: examType,
                                    type: examType,
                                    date: examDate,
                                    status: 'COMPLETED',
                                    location: laboratory,
                                    notes: input.notes,
                                    pdfUploaded: true,
                                    pdfPath: filePath,
                                    rawTextExtracted: rawText,
                                    extractionMethod: extractionMethod
                                }
                            })
                            // 7. Salvar resultados individuais
                        ];
                    case 16:
                        exam = _k.sent();
                        _loop_1 = function (interpreted) {
                            return __generator(this, function (_l) {
                                switch (_l.label) {
                                    case 0: return [4 /*yield*/, prisma_1.prisma.examResult.create({
                                            data: {
                                                examId: exam.id,
                                                markerCode: interpreted.markerCode,
                                                markerName: interpreted.markerName,
                                                value: interpreted.value,
                                                unit: interpreted.unit,
                                                status: interpreted.status,
                                                interpretationText: interpreted.interpretationText,
                                                referenceMin: interpreted.referenceMin,
                                                referenceMax: interpreted.referenceMax,
                                                confidence: (_g = mappedMarkers.find(function (m) { return m.markerCode === interpreted.markerCode; })) === null || _g === void 0 ? void 0 : _g.confidence,
                                                extractionMethod: (_h = mappedMarkers.find(function (m) { return m.markerCode === interpreted.markerCode; })) === null || _h === void 0 ? void 0 : _h.method,
                                                rawTextSnippet: (_j = mappedMarkers.find(function (m) { return m.markerCode === interpreted.markerCode; })) === null || _j === void 0 ? void 0 : _j.rawName
                                            }
                                        })];
                                    case 1:
                                        _l.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _d = 0, interpretedMarkers_1 = interpretedMarkers;
                        _k.label = 17;
                    case 17:
                        if (!(_d < interpretedMarkers_1.length)) return [3 /*break*/, 20];
                        interpreted = interpretedMarkers_1[_d];
                        return [5 /*yield**/, _loop_1(interpreted)];
                    case 18:
                        _k.sent();
                        _k.label = 19;
                    case 19:
                        _d++;
                        return [3 /*break*/, 17];
                    case 20:
                        summary = {
                            total: interpretedMarkers.length,
                            normal: interpretedMarkers.filter(function (m) { return m.status === 'NORMAL'; }).length,
                            abnormal: interpretedMarkers.filter(function (m) { return m.status === 'HIGH' || m.status === 'LOW'; }).length,
                            critical: interpretedMarkers.filter(function (m) { return m.status === 'CRITICAL_HIGH' || m.status === 'CRITICAL_LOW'; }).length,
                            unknown: interpretedMarkers.filter(function (m) { return m.status === 'UNKNOWN'; }).length
                        };
                        console.log('✨ Processamento concluído!');
                        console.log("\uD83D\uDCCA Sum\u00E1rio: ".concat(summary.normal, " normal | ").concat(summary.abnormal, " alterado | ").concat(summary.critical, " cr\u00EDtico"));
                        return [2 /*return*/, {
                                examId: exam.id,
                                extractedMarkersCount: mappedMarkers.length,
                                interpretedMarkersCount: interpretedMarkers.length,
                                failedMarkers: failedMarkers,
                                summary: summary,
                                rawText: rawText.substring(0, 500) + '...', // Truncar para resposta
                                extractedMarkers: mappedMarkers,
                                interpretedMarkers: interpretedMarkers,
                                errors: errors
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // BUSCAR EXAME COM RESULTADOS
    // ==========================================================================
    ExamUploadService.prototype.getExamWithResults = function (examId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var exam, isOwner, isCaregiver, isProfessional;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prisma_1.prisma.exam.findUnique({
                            where: { id: examId },
                            include: {
                                patient: {
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
                                },
                                results: {
                                    orderBy: { status: 'asc' } // Críticos primeiro
                                }
                            }
                        })];
                    case 1:
                        exam = _a.sent();
                        if (!exam) {
                            throw new Error('Exame não encontrado');
                        }
                        isOwner = exam.patient.userId === userId;
                        isCaregiver = exam.patient.caregivers.some(function (pc) { return pc.caregiver.userId === userId; });
                        isProfessional = exam.patient.professionals.some(function (pp) { return pp.professional.userId === userId; });
                        if (!isOwner && !isCaregiver && !isProfessional) {
                            throw new Error('Você não tem permissão para acessar este exame');
                        }
                        return [2 /*return*/, exam];
                }
            });
        });
    };
    // ==========================================================================
    // LISTAR EXAMES DE UM PACIENTE
    // ==========================================================================
    ExamUploadService.prototype.listPatientExams = function (patientId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var patient, isOwner, isCaregiver, isProfessional, exams;
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
                            throw new Error('Você não tem permissão para acessar os exames deste paciente');
                        }
                        return [4 /*yield*/, prisma_1.prisma.exam.findMany({
                                where: {
                                    patientId: patientId,
                                    pdfUploaded: true
                                },
                                include: {
                                    results: {
                                        select: {
                                            id: true,
                                            markerCode: true,
                                            markerName: true,
                                            status: true
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
    return ExamUploadService;
}());
exports.ExamUploadService = ExamUploadService;
exports.examUploadService = new ExamUploadService();
