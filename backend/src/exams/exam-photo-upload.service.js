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
exports.examPhotoUploadService = exports.ExamPhotoUploadService = void 0;
// @ts-nocheck
var promises_1 = require("fs/promises");
var path_1 = require("path");
var prisma_1 = require("../database/prisma");
var exam_parser_util_1 = require("./exam-parser.util");
var llama_extractor_util_1 = require("./llama-extractor.util");
var exams_reference_service_1 = require("./exams-reference.service");
var exam_photo_parser_util_1 = require("./exam-photo-parser.util");
// ============================================================================
// CLASSE DO SERVICE
// ============================================================================
var ExamPhotoUploadService = /** @class */ (function () {
    function ExamPhotoUploadService() {
    }
    // ==========================================================================
    // VALIDAÇÃO DA IMAGEM
    // ==========================================================================
    ExamPhotoUploadService.prototype.validatePhoto = function (photoPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, isValid;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🔍 Validando arquivo de imagem...');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, promises_1.default.access(photoPath)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        throw new Error('Arquivo de imagem não encontrado');
                    case 4: return [4 /*yield*/, (0, exam_photo_parser_util_1.validateImageFile)(photoPath)];
                    case 5:
                        isValid = _b.sent();
                        if (!isValid) {
                            throw new Error('Imagem inválida. Use uma foto com pelo menos 200x200 pixels.');
                        }
                        console.log('✅ Imagem válida');
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // PIPELINE COMPLETO DE PROCESSAMENTO
    // ==========================================================================
    ExamPhotoUploadService.prototype.processPhotoUpload = function (filePath, input) {
        return __awaiter(this, void 0, void 0, function () {
            var errors, warnings, photoResult, extractedMarkers, aiAvailable, chunks, aiMarkers, _i, aiMarkers_1, aiMarker, error_1, mappedMarkers, failedMarkers, _a, extractedMarkers_1, marker, markerCode, interpretedMarkers, patient, patientSex, patientAge, _b, mappedMarkers_1, marker, interpretation, error_2, examDate, examType, laboratory, processedImagePath, exam, _loop_1, _c, interpretedMarkers_1, interpreted, summary;
            var _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        errors = [];
                        warnings = [];
                        console.log('🚀 Iniciando processamento de foto de exame...');
                        console.log("   Arquivo: ".concat(path_1.default.basename(filePath)));
                        // 1. Validar imagem
                        return [4 /*yield*/, this.validatePhoto(filePath)
                            // 2. Processar foto (pré-processamento + OCR + extração)
                        ];
                    case 1:
                        // 1. Validar imagem
                        _j.sent();
                        // 2. Processar foto (pré-processamento + OCR + extração)
                        console.log('📸 Processando imagem e executando OCR...');
                        return [4 /*yield*/, (0, exam_photo_parser_util_1.processExamPhoto)(filePath, {
                                autoRotate: input.autoRotate,
                                enhanceContrast: input.enhanceContrast
                            })
                            // Adicionar warnings do OCR
                        ];
                    case 2:
                        photoResult = _j.sent();
                        // Adicionar warnings do OCR
                        warnings.push.apply(warnings, photoResult.ocrResult.warnings);
                        extractedMarkers = photoResult.extractedMarkers;
                        console.log("\uD83D\uDCCA OCR extraiu ".concat(extractedMarkers.length, " marcadores"));
                        console.log("   Confian\u00E7a OCR: ".concat(photoResult.ocrResult.confidence.toFixed(2), "%"));
                        console.log("   Qualidade: ".concat(photoResult.ocrResult.imageQuality));
                        if (!(extractedMarkers.length < 3)) return [3 /*break*/, 9];
                        console.log('⚠️ Poucos marcadores detectados. Tentando com IA...');
                        return [4 /*yield*/, (0, llama_extractor_util_1.isOllamaAvailable)()];
                    case 3:
                        aiAvailable = _j.sent();
                        if (!aiAvailable) return [3 /*break*/, 8];
                        _j.label = 4;
                    case 4:
                        _j.trys.push([4, 6, , 7]);
                        chunks = (0, llama_extractor_util_1.splitTextIntoChunks)(photoResult.cleanedText);
                        return [4 /*yield*/, (0, llama_extractor_util_1.extractWithAI)(chunks[0])
                            // Converter marcadores da IA para formato padrão
                        ]; // Processar primeiro chunk
                    case 5:
                        aiMarkers = _j.sent() // Processar primeiro chunk
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
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _j.sent();
                        console.error('❌ Erro na extração com IA:', error_1);
                        errors.push('Falha ao usar IA para extração adicional');
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        console.log('ℹ️ IA não disponível. Usando apenas OCR.');
                        warnings.push('Poucos marcadores detectados. Considere tirar outra foto mais nítida.');
                        _j.label = 9;
                    case 9:
                        // 4. Mapear para marker codes
                        console.log('🗺️ Mapeando marcadores...');
                        mappedMarkers = [];
                        failedMarkers = [];
                        for (_a = 0, extractedMarkers_1 = extractedMarkers; _a < extractedMarkers_1.length; _a++) {
                            marker = extractedMarkers_1[_a];
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
                    case 10:
                        patient = _j.sent();
                        patientSex = (patient === null || patient === void 0 ? void 0 : patient.gender) === 'M' ? 'M' : (patient === null || patient === void 0 ? void 0 : patient.gender) === 'F' ? 'F' : undefined;
                        patientAge = (patient === null || patient === void 0 ? void 0 : patient.dateOfBirth)
                            ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                            : undefined;
                        _b = 0, mappedMarkers_1 = mappedMarkers;
                        _j.label = 11;
                    case 11:
                        if (!(_b < mappedMarkers_1.length)) return [3 /*break*/, 16];
                        marker = mappedMarkers_1[_b];
                        if (!marker.markerCode)
                            return [3 /*break*/, 15];
                        _j.label = 12;
                    case 12:
                        _j.trys.push([12, 14, , 15]);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.interpretResult(marker.markerCode, marker.value, patientSex, patientAge)];
                    case 13:
                        interpretation = _j.sent();
                        if (interpretation) {
                            interpretedMarkers.push({
                                markerCode: interpretation.markerCode,
                                markerName: interpretation.markerName,
                                value: interpretation.value,
                                unit: interpretation.unit,
                                status: interpretation.status,
                                interpretationText: interpretation.interpretationText,
                                referenceMin: (_d = interpretation.referenceRange) === null || _d === void 0 ? void 0 : _d.low,
                                referenceMax: (_e = interpretation.referenceRange) === null || _e === void 0 ? void 0 : _e.high
                            });
                        }
                        return [3 /*break*/, 15];
                    case 14:
                        error_2 = _j.sent();
                        console.error("\u274C Erro ao interpretar ".concat(marker.markerCode, ":"), error_2);
                        errors.push("Erro ao interpretar ".concat(marker.rawName));
                        return [3 /*break*/, 15];
                    case 15:
                        _b++;
                        return [3 /*break*/, 11];
                    case 16:
                        // 6. Salvar no banco de dados
                        console.log('💾 Salvando no banco de dados...');
                        examDate = input.examDate ? new Date(input.examDate) : new Date();
                        examType = input.examType || 'Exame Laboratorial (Foto)';
                        laboratory = input.laboratory || 'Não identificado';
                        processedImagePath = photoResult.processedImage.processedPath;
                        return [4 /*yield*/, prisma_1.prisma.exam.create({
                                data: {
                                    patientId: input.patientId,
                                    name: examType,
                                    type: examType,
                                    date: examDate,
                                    status: 'COMPLETED',
                                    location: laboratory,
                                    notes: input.notes,
                                    photoUploaded: true,
                                    photoPath: filePath,
                                    processedPhotoPath: processedImagePath,
                                    rawTextExtracted: photoResult.cleanedText,
                                    extractionMethod: 'ocr',
                                    ocrConfidence: photoResult.ocrResult.confidence,
                                    imageQuality: photoResult.ocrResult.imageQuality
                                }
                            })
                            // 7. Salvar resultados individuais
                        ];
                    case 17:
                        exam = _j.sent();
                        _loop_1 = function (interpreted) {
                            return __generator(this, function (_k) {
                                switch (_k.label) {
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
                                                confidence: (_f = mappedMarkers.find(function (m) { return m.markerCode === interpreted.markerCode; })) === null || _f === void 0 ? void 0 : _f.confidence,
                                                extractionMethod: (_g = mappedMarkers.find(function (m) { return m.markerCode === interpreted.markerCode; })) === null || _g === void 0 ? void 0 : _g.method,
                                                rawTextSnippet: (_h = mappedMarkers.find(function (m) { return m.markerCode === interpreted.markerCode; })) === null || _h === void 0 ? void 0 : _h.rawName
                                            }
                                        })];
                                    case 1:
                                        _k.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _c = 0, interpretedMarkers_1 = interpretedMarkers;
                        _j.label = 18;
                    case 18:
                        if (!(_c < interpretedMarkers_1.length)) return [3 /*break*/, 21];
                        interpreted = interpretedMarkers_1[_c];
                        return [5 /*yield**/, _loop_1(interpreted)];
                    case 19:
                        _j.sent();
                        _j.label = 20;
                    case 20:
                        _c++;
                        return [3 /*break*/, 18];
                    case 21:
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
                                ocrConfidence: photoResult.ocrResult.confidence,
                                imageQuality: photoResult.ocrResult.imageQuality,
                                processingTime: photoResult.ocrResult.processingTime,
                                extractedMarkersCount: mappedMarkers.length,
                                interpretedMarkersCount: interpretedMarkers.length,
                                failedMarkers: failedMarkers,
                                summary: summary,
                                rawOCRText: photoResult.rawText.substring(0, 500) + '...', // Truncar
                                extractedMarkers: mappedMarkers,
                                interpretedMarkers: interpretedMarkers,
                                warnings: warnings,
                                errors: errors
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // BUSCAR EXAME COM FOTO
    // ==========================================================================
    ExamPhotoUploadService.prototype.getExamWithPhoto = function (examId, userId) {
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
    // LISTAR EXAMES COM FOTO DE UM PACIENTE
    // ==========================================================================
    ExamPhotoUploadService.prototype.listPatientPhotoExams = function (patientId, userId) {
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
                                    photoUploaded: true
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
    return ExamPhotoUploadService;
}());
exports.ExamPhotoUploadService = ExamPhotoUploadService;
exports.examPhotoUploadService = new ExamPhotoUploadService();
