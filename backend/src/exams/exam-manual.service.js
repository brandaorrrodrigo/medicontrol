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
exports.examManualService = exports.ExamManualService = void 0;
// @ts-nocheck
var prisma_1 = require("../database/prisma");
var exams_reference_service_1 = require("./exams-reference.service");
var unit_conversion_util_1 = require("./unit-conversion.util");
// ============================================================================
// CLASSE DO SERVICE
// ============================================================================
var ExamManualService = /** @class */ (function () {
    function ExamManualService() {
    }
    // ==========================================================================
    // VALIDAR MARCADOR NO CATÁLOGO
    // ==========================================================================
    ExamManualService.prototype.validateMarkerExists = function (markerCode) {
        return __awaiter(this, void 0, void 0, function () {
            var catalog, marker, availableMarkers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exams_reference_service_1.examsReferenceService.loadCatalog()];
                    case 1:
                        catalog = _a.sent();
                        marker = catalog.get(markerCode);
                        if (!marker) {
                            availableMarkers = Array.from(catalog.keys()).slice(0, 10);
                            throw new Error("Marcador \"".concat(markerCode, "\" n\u00E3o encontrado no cat\u00E1logo. ") +
                                "Exemplos de marcadores v\u00E1lidos: ".concat(availableMarkers.join(', '), "..."));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================================================
    // VALIDAR PERMISSÃO DE ACESSO AO PACIENTE
    // ==========================================================================
    ExamManualService.prototype.validatePatientAccess = function (patientId, userId) {
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
    // PROCESSAR ENTRADA MANUAL INDIVIDUAL
    // ==========================================================================
    ExamManualService.prototype.processManualEntry = function (input, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var unitValidation, normalizedValue, normalizedUnit, wasConverted, rangeValidation, patient, patientSex, patientAge, interpretation, examDate, exam, examResult;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log('📝 Processando entrada manual de exame...');
                        console.log("   Marcador: ".concat(input.markerCode));
                        console.log("   Valor: ".concat(input.value, " ").concat(input.unit));
                        // 1. Validar permissão de acesso ao paciente
                        return [4 /*yield*/, this.validatePatientAccess(input.patientId, userId)
                            // 2. Validar se o marcador existe
                        ];
                    case 1:
                        // 1. Validar permissão de acesso ao paciente
                        _e.sent();
                        // 2. Validar se o marcador existe
                        return [4 /*yield*/, this.validateMarkerExists(input.markerCode)
                            // 3. Validar e normalizar unidade
                        ];
                    case 2:
                        // 2. Validar se o marcador existe
                        _e.sent();
                        // 3. Validar e normalizar unidade
                        console.log('🔄 Validando e normalizando unidade...');
                        unitValidation = (0, unit_conversion_util_1.validateAndNormalizeUnit)(input.markerCode, input.value, input.unit);
                        if (!unitValidation.isValid) {
                            throw new Error(unitValidation.message || 'Unidade inválida');
                        }
                        normalizedValue = unitValidation.value;
                        normalizedUnit = unitValidation.unit;
                        wasConverted = unitValidation.normalized;
                        if (wasConverted) {
                            console.log("\u2705 ".concat(unitValidation.message));
                        }
                        else {
                            console.log("\u2705 Unidade validada: ".concat(normalizedUnit));
                        }
                        // 4. Validar faixa de valor
                        console.log('🔍 Validando faixa de valor...');
                        rangeValidation = (0, unit_conversion_util_1.validateValueRange)(input.markerCode, normalizedValue);
                        if (!rangeValidation.isValid) {
                            throw new Error(rangeValidation.message || 'Valor fora da faixa razoável');
                        }
                        console.log('✅ Valor dentro da faixa razoável');
                        return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                                where: { id: input.patientId }
                            })];
                    case 3:
                        patient = _e.sent();
                        patientSex = (patient === null || patient === void 0 ? void 0 : patient.gender) === 'M' ? 'M' : (patient === null || patient === void 0 ? void 0 : patient.gender) === 'F' ? 'F' : undefined;
                        patientAge = (patient === null || patient === void 0 ? void 0 : patient.dateOfBirth)
                            ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                            : undefined;
                        // 6. Interpretar resultado
                        console.log('🔬 Interpretando resultado...');
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.interpretResult(input.markerCode, normalizedValue, patientSex, patientAge)];
                    case 4:
                        interpretation = _e.sent();
                        if (!interpretation) {
                            throw new Error('Não foi possível interpretar o resultado');
                        }
                        console.log("\u2705 Status: ".concat(interpretation.status));
                        examDate = input.date ? new Date(input.date) : new Date();
                        return [4 /*yield*/, prisma_1.prisma.exam.findFirst({
                                where: {
                                    patientId: input.patientId,
                                    date: examDate,
                                    manualEntry: true
                                }
                            })
                            // Se não existe, criar novo
                        ];
                    case 5:
                        exam = _e.sent();
                        if (!!exam) return [3 /*break*/, 7];
                        console.log('💾 Criando registro de exame...');
                        return [4 /*yield*/, prisma_1.prisma.exam.create({
                                data: {
                                    patientId: input.patientId,
                                    name: 'Exame Laboratorial (Manual)',
                                    type: 'Exame Laboratorial',
                                    date: examDate,
                                    status: 'COMPLETED',
                                    location: input.laboratory || 'Entrada Manual',
                                    notes: input.notes,
                                    manualEntry: true,
                                    source: 'MANUAL'
                                }
                            })];
                    case 6:
                        exam = _e.sent();
                        _e.label = 7;
                    case 7:
                        // 8. Salvar resultado individual
                        console.log('💾 Salvando resultado...');
                        return [4 /*yield*/, prisma_1.prisma.examResult.create({
                                data: {
                                    examId: exam.id,
                                    markerCode: interpretation.markerCode,
                                    markerName: interpretation.markerName,
                                    value: normalizedValue,
                                    unit: normalizedUnit,
                                    status: interpretation.status,
                                    interpretationText: interpretation.interpretationText,
                                    referenceMin: (_a = interpretation.referenceRange) === null || _a === void 0 ? void 0 : _a.low,
                                    referenceMax: (_b = interpretation.referenceRange) === null || _b === void 0 ? void 0 : _b.high,
                                    confidence: 1.0, // Entrada manual tem confiança máxima
                                    extractionMethod: 'manual',
                                    rawTextSnippet: "Manual: ".concat(input.value, " ").concat(input.unit).concat(wasConverted ? " \u2192 ".concat(normalizedValue, " ").concat(normalizedUnit) : '')
                                }
                            })];
                    case 8:
                        examResult = _e.sent();
                        console.log('✨ Entrada manual processada com sucesso!');
                        return [2 /*return*/, {
                                examId: exam.id,
                                examResultId: examResult.id,
                                patientId: input.patientId,
                                markerCode: interpretation.markerCode,
                                markerName: interpretation.markerName,
                                value: input.value,
                                unit: input.unit,
                                normalizedValue: normalizedValue,
                                normalizedUnit: normalizedUnit,
                                wasConverted: wasConverted,
                                status: interpretation.status,
                                interpretation: interpretation.interpretationText,
                                referenceMin: (_c = interpretation.referenceRange) === null || _c === void 0 ? void 0 : _c.low,
                                referenceMax: (_d = interpretation.referenceRange) === null || _d === void 0 ? void 0 : _d.high,
                                createdAt: examResult.createdAt,
                                source: 'MANUAL'
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // PROCESSAR ENTRADA MÚLTIPLA (BATCH)
    // ==========================================================================
    ExamManualService.prototype.processManualBatch = function (input, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var examDate, exam, results, errors, _i, _a, marker, unitValidation, normalizedValue, normalizedUnit, wasConverted, rangeValidation, patient, patientSex, patientAge, interpretation, examResult, error_1, errorMessage;
            var _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log('📝 Processando entrada manual em lote...');
                        console.log("   Marcadores: ".concat(input.markers.length));
                        // Validar permissão de acesso ao paciente
                        return [4 /*yield*/, this.validatePatientAccess(input.patientId, userId)
                            // Criar exame único para todos os marcadores
                        ];
                    case 1:
                        // Validar permissão de acesso ao paciente
                        _f.sent();
                        examDate = input.date ? new Date(input.date) : new Date();
                        return [4 /*yield*/, prisma_1.prisma.exam.create({
                                data: {
                                    patientId: input.patientId,
                                    name: 'Exame Laboratorial (Manual)',
                                    type: 'Exame Laboratorial',
                                    date: examDate,
                                    status: 'COMPLETED',
                                    location: input.laboratory || 'Entrada Manual',
                                    notes: input.notes,
                                    manualEntry: true,
                                    source: 'MANUAL'
                                }
                            })];
                    case 2:
                        exam = _f.sent();
                        results = [];
                        errors = [];
                        _i = 0, _a = input.markers;
                        _f.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        marker = _a[_i];
                        _f.label = 4;
                    case 4:
                        _f.trys.push([4, 9, , 10]);
                        // Validar marcador
                        return [4 /*yield*/, this.validateMarkerExists(marker.markerCode)
                            // Validar e normalizar unidade
                        ];
                    case 5:
                        // Validar marcador
                        _f.sent();
                        unitValidation = (0, unit_conversion_util_1.validateAndNormalizeUnit)(marker.markerCode, marker.value, marker.unit);
                        if (!unitValidation.isValid) {
                            throw new Error(unitValidation.message || 'Unidade inválida');
                        }
                        normalizedValue = unitValidation.value;
                        normalizedUnit = unitValidation.unit;
                        wasConverted = unitValidation.normalized;
                        rangeValidation = (0, unit_conversion_util_1.validateValueRange)(marker.markerCode, normalizedValue);
                        if (!rangeValidation.isValid) {
                            throw new Error(rangeValidation.message || 'Valor fora da faixa');
                        }
                        return [4 /*yield*/, prisma_1.prisma.patient.findUnique({
                                where: { id: input.patientId }
                            })];
                    case 6:
                        patient = _f.sent();
                        patientSex = (patient === null || patient === void 0 ? void 0 : patient.gender) === 'M' ? 'M' : (patient === null || patient === void 0 ? void 0 : patient.gender) === 'F' ? 'F' : undefined;
                        patientAge = (patient === null || patient === void 0 ? void 0 : patient.dateOfBirth)
                            ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                            : undefined;
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.interpretResult(marker.markerCode, normalizedValue, patientSex, patientAge)];
                    case 7:
                        interpretation = _f.sent();
                        if (!interpretation) {
                            throw new Error('Não foi possível interpretar o resultado');
                        }
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
                                    confidence: 1.0,
                                    extractionMethod: 'manual',
                                    rawTextSnippet: "Manual: ".concat(marker.value, " ").concat(marker.unit).concat(wasConverted ? " \u2192 ".concat(normalizedValue, " ").concat(normalizedUnit) : '')
                                }
                            })];
                    case 8:
                        examResult = _f.sent();
                        results.push({
                            examId: exam.id,
                            examResultId: examResult.id,
                            patientId: input.patientId,
                            markerCode: interpretation.markerCode,
                            markerName: interpretation.markerName,
                            value: marker.value,
                            unit: marker.unit,
                            normalizedValue: normalizedValue,
                            normalizedUnit: normalizedUnit,
                            wasConverted: wasConverted,
                            status: interpretation.status,
                            interpretation: interpretation.interpretationText,
                            referenceMin: (_d = interpretation.referenceRange) === null || _d === void 0 ? void 0 : _d.low,
                            referenceMax: (_e = interpretation.referenceRange) === null || _e === void 0 ? void 0 : _e.high,
                            createdAt: examResult.createdAt,
                            source: 'MANUAL'
                        });
                        console.log("\u2705 ".concat(marker.markerCode, ": processado"));
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _f.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : 'Erro desconhecido';
                        errors.push({
                            markerCode: marker.markerCode,
                            error: errorMessage
                        });
                        console.log("\u274C ".concat(marker.markerCode, ": ").concat(errorMessage));
                        return [3 /*break*/, 10];
                    case 10:
                        _i++;
                        return [3 /*break*/, 3];
                    case 11:
                        console.log('✨ Entrada em lote concluída!');
                        console.log("   Sucessos: ".concat(results.length));
                        console.log("   Falhas: ".concat(errors.length));
                        return [2 /*return*/, {
                                examId: exam.id,
                                patientId: input.patientId,
                                successCount: results.length,
                                failureCount: errors.length,
                                results: results,
                                errors: errors
                            }];
                }
            });
        });
    };
    // ==========================================================================
    // LISTAR MARCADORES DISPONÍVEIS
    // ==========================================================================
    ExamManualService.prototype.listAvailableMarkers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var catalog, markers, _i, _a, _b, code, marker;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, exams_reference_service_1.examsReferenceService.loadCatalog()];
                    case 1:
                        catalog = _c.sent();
                        markers = [];
                        for (_i = 0, _a = catalog.entries(); _i < _a.length; _i++) {
                            _b = _a[_i], code = _b[0], marker = _b[1];
                            markers.push({
                                code: code,
                                name: marker.name,
                                category: marker.category,
                                acceptedUnits: unit_conversion_util_1.MARKER_UNITS[code] || [],
                                preferredUnit: unit_conversion_util_1.PREFERRED_UNITS[code] || ''
                            });
                        }
                        return [2 /*return*/, markers.sort(function (a, b) { return a.name.localeCompare(b.name); })];
                }
            });
        });
    };
    // ==========================================================================
    // OBTER INFORMAÇÕES DE UM MARCADOR
    // ==========================================================================
    ExamManualService.prototype.getMarkerInfo = function (markerCode) {
        return __awaiter(this, void 0, void 0, function () {
            var catalog, marker;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exams_reference_service_1.examsReferenceService.loadCatalog()];
                    case 1:
                        catalog = _a.sent();
                        marker = catalog.get(markerCode);
                        if (!marker) {
                            throw new Error("Marcador \"".concat(markerCode, "\" n\u00E3o encontrado"));
                        }
                        return [2 /*return*/, {
                                code: markerCode,
                                name: marker.name,
                                category: marker.category,
                                acceptedUnits: unit_conversion_util_1.MARKER_UNITS[markerCode] || [],
                                preferredUnit: unit_conversion_util_1.PREFERRED_UNITS[markerCode] || '',
                                description: marker.description
                            }];
                }
            });
        });
    };
    return ExamManualService;
}());
exports.ExamManualService = ExamManualService;
exports.examManualService = new ExamManualService();
