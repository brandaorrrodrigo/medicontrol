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
exports.examsReferenceService = void 0;
exports.loadExamReferenceCatalog = loadExamReferenceCatalog;
exports.reloadCatalog = reloadCatalog;
exports.findReferenceForMarker = findReferenceForMarker;
exports.searchMarkersByName = searchMarkersByName;
exports.getMarkersByCategory = getMarkersByCategory;
exports.getAllCategories = getAllCategories;
exports.interpretExamResult = interpretExamResult;
exports.interpretMultipleResults = interpretMultipleResults;
var promises_1 = require("fs/promises");
var path_1 = require("path");
// ============================================================================
// CACHE E CARREGAMENTO
// ============================================================================
var catalogCache = null;
/**
 * Carrega o catálogo de referência de exames do arquivo JSON.
 * O catálogo é carregado em memória e cacheado para performance.
 */
function loadExamReferenceCatalog() {
    return __awaiter(this, void 0, void 0, function () {
        var catalogPath, data, markers, _i, markers_1, marker, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (catalogCache) {
                        return [2 /*return*/, catalogCache];
                    }
                    catalogPath = path_1.default.join(__dirname, '../../knowledge/exams/exams_reference.json');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.readFile(catalogPath, 'utf-8')];
                case 2:
                    data = _a.sent();
                    markers = JSON.parse(data);
                    catalogCache = new Map();
                    for (_i = 0, markers_1 = markers; _i < markers_1.length; _i++) {
                        marker = markers_1[_i];
                        catalogCache.set(marker.markerCode, marker);
                    }
                    console.log("\uD83D\uDCDA Cat\u00E1logo de exames carregado: ".concat(catalogCache.size, " marcadores"));
                    return [2 /*return*/, catalogCache];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Erro ao carregar catálogo de exames:', error_1);
                    console.log('💡 Execute "npm run build:exam-catalog" para gerar o catálogo');
                    return [2 /*return*/, new Map()];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Recarrega o catálogo do disco (útil em desenvolvimento ou após atualização).
 */
function reloadCatalog() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    catalogCache = null;
                    return [4 /*yield*/, loadExamReferenceCatalog()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// CONSULTAS
// ============================================================================
/**
 * Busca a referência de um marcador específico por código.
 */
function findReferenceForMarker(markerCode) {
    return __awaiter(this, void 0, void 0, function () {
        var catalog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadExamReferenceCatalog()];
                case 1:
                    catalog = _a.sent();
                    return [2 /*return*/, catalog.get(markerCode) || null];
            }
        });
    });
}
/**
 * Busca marcadores por nome (busca parcial, case-insensitive).
 */
function searchMarkersByName(query) {
    return __awaiter(this, void 0, void 0, function () {
        var catalog, normalizedQuery, results, _i, _a, marker;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadExamReferenceCatalog()];
                case 1:
                    catalog = _b.sent();
                    normalizedQuery = query.toLowerCase();
                    results = [];
                    for (_i = 0, _a = catalog.values(); _i < _a.length; _i++) {
                        marker = _a[_i];
                        // Buscar no nome principal
                        if (marker.markerName.toLowerCase().includes(normalizedQuery)) {
                            results.push(marker);
                            continue;
                        }
                        // Buscar nos sinônimos
                        if (marker.synonyms.some(function (syn) { return syn.toLowerCase().includes(normalizedQuery); })) {
                            results.push(marker);
                            continue;
                        }
                        // Buscar no código
                        if (marker.markerCode.toLowerCase().includes(normalizedQuery)) {
                            results.push(marker);
                        }
                    }
                    return [2 /*return*/, results];
            }
        });
    });
}
/**
 * Lista todos os marcadores de uma categoria específica.
 */
function getMarkersByCategory(category) {
    return __awaiter(this, void 0, void 0, function () {
        var catalog, results, _i, _a, marker;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadExamReferenceCatalog()];
                case 1:
                    catalog = _b.sent();
                    results = [];
                    for (_i = 0, _a = catalog.values(); _i < _a.length; _i++) {
                        marker = _a[_i];
                        if (marker.category.toLowerCase() === category.toLowerCase()) {
                            results.push(marker);
                        }
                    }
                    return [2 /*return*/, results.sort(function (a, b) { return a.markerName.localeCompare(b.markerName); })];
            }
        });
    });
}
/**
 * Lista todas as categorias disponíveis.
 */
function getAllCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var catalog, categories, _i, _a, marker;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loadExamReferenceCatalog()];
                case 1:
                    catalog = _b.sent();
                    categories = new Set();
                    for (_i = 0, _a = catalog.values(); _i < _a.length; _i++) {
                        marker = _a[_i];
                        categories.add(marker.category);
                    }
                    return [2 /*return*/, Array.from(categories).sort()];
            }
        });
    });
}
// ============================================================================
// INTERPRETAÇÃO
// ============================================================================
/**
 * Determina o status de um valor de exame comparado com a faixa de referência.
 */
function determineStatus(value, range) {
    var low = range.low, high = range.high;
    // Se não temos limites, não podemos determinar
    if (low === undefined && high === undefined) {
        return 'UNKNOWN';
    }
    // Apenas limite superior
    if (low === undefined && high !== undefined) {
        if (value <= high)
            return 'NORMAL';
        if (value <= high * 1.5)
            return 'HIGH';
        return 'CRITICAL_HIGH';
    }
    // Apenas limite inferior
    if (low !== undefined && high === undefined) {
        if (value >= low)
            return 'NORMAL';
        if (value >= low * 0.5)
            return 'LOW';
        return 'CRITICAL_LOW';
    }
    // Ambos os limites
    if (low !== undefined && high !== undefined) {
        var range_size = high - low;
        // Normal
        if (value >= low && value <= high) {
            return 'NORMAL';
        }
        // Abaixo do normal
        if (value < low) {
            // Crítico se muito abaixo (< 50% do limite inferior)
            if (value < low - range_size * 0.5) {
                return 'CRITICAL_LOW';
            }
            return 'LOW';
        }
        // Acima do normal
        if (value > high) {
            // Crítico se muito acima (> 50% acima do limite superior)
            if (value > high + range_size * 0.5) {
                return 'CRITICAL_HIGH';
            }
            return 'HIGH';
        }
    }
    return 'UNKNOWN';
}
/**
 * Gera texto de interpretação baseado no status.
 */
function generateInterpretationText(markerName, value, unit, status, range) {
    var rangeText = range && range.low !== undefined && range.high !== undefined
        ? "Refer\u00EAncia: ".concat(range.low, "-").concat(range.high, " ").concat(unit)
        : range && range.high !== undefined
            ? "Refer\u00EAncia: < ".concat(range.high, " ").concat(unit)
            : range && range.low !== undefined
                ? "Refer\u00EAncia: > ".concat(range.low, " ").concat(unit)
                : 'Sem referência disponível';
    switch (status) {
        case 'NORMAL':
            return "".concat(markerName, " est\u00E1 dentro dos valores normais (").concat(value, " ").concat(unit, "). ").concat(rangeText);
        case 'LOW':
            return "".concat(markerName, " est\u00E1 abaixo do valor de refer\u00EAncia (").concat(value, " ").concat(unit, "). ").concat(rangeText, ". Recomenda-se avalia\u00E7\u00E3o m\u00E9dica.");
        case 'HIGH':
            return "".concat(markerName, " est\u00E1 acima do valor de refer\u00EAncia (").concat(value, " ").concat(unit, "). ").concat(rangeText, ". Recomenda-se avalia\u00E7\u00E3o m\u00E9dica.");
        case 'CRITICAL_LOW':
            return "\u26A0\uFE0F ".concat(markerName, " est\u00E1 CRITICAMENTE BAIXO (").concat(value, " ").concat(unit, "). ").concat(rangeText, ". Procure atendimento m\u00E9dico imediatamente.");
        case 'CRITICAL_HIGH':
            return "\u26A0\uFE0F ".concat(markerName, " est\u00E1 CRITICAMENTE ALTO (").concat(value, " ").concat(unit, "). ").concat(rangeText, ". Procure atendimento m\u00E9dico imediatamente.");
        default:
            return "".concat(markerName, ": ").concat(value, " ").concat(unit, ". N\u00E3o foi poss\u00EDvel determinar o status (sem refer\u00EAncia adequada).");
    }
}
/**
 * Interpreta um resultado de exame.
 *
 * @param markerCode - Código do marcador (ex: "GLICEMIA_JEJUM")
 * @param value - Valor numérico do resultado
 * @param patientSex - Sexo do paciente ('M', 'F' ou undefined)
 * @param patientAge - Idade do paciente (opcional)
 */
function interpretExamResult(markerCode, value, patientSex, _patientAge) {
    return __awaiter(this, void 0, void 0, function () {
        var reference, selectedRange, status, interpretationText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findReferenceForMarker(markerCode)];
                case 1:
                    reference = _a.sent();
                    if (!reference) {
                        console.warn("\u26A0\uFE0F Marcador n\u00E3o encontrado no cat\u00E1logo: ".concat(markerCode));
                        return [2 /*return*/, null];
                    }
                    if (reference.referenceRanges.length > 0) {
                        // Prioridade:
                        // 1. Sexo e idade específicos
                        // 2. Apenas sexo específico
                        // 3. ANY sex
                        selectedRange = reference.referenceRanges.find(function (r) {
                            var sexMatch = r.sex === 'ANY' || r.sex === patientSex;
                            // Aqui poderíamos fazer matching de idade também
                            return sexMatch;
                        });
                        // Fallback: primeira faixa disponível
                        if (!selectedRange) {
                            selectedRange = reference.referenceRanges[0];
                        }
                    }
                    status = selectedRange
                        ? determineStatus(value, selectedRange)
                        : 'UNKNOWN';
                    interpretationText = generateInterpretationText(reference.markerName, value, reference.unit, status, selectedRange);
                    return [2 /*return*/, {
                            markerCode: reference.markerCode,
                            markerName: reference.markerName,
                            value: value,
                            unit: reference.unit,
                            status: status,
                            referenceRange: selectedRange,
                            interpretationText: interpretationText,
                            hints: reference.interpretationHints
                        }];
            }
        });
    });
}
/**
 * Interpreta múltiplos resultados de exames.
 */
function interpretMultipleResults(results, patientSex, patientAge) {
    return __awaiter(this, void 0, void 0, function () {
        var interpretations, _i, results_1, result, interpretation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    interpretations = [];
                    _i = 0, results_1 = results;
                    _a.label = 1;
                case 1:
                    if (!(_i < results_1.length)) return [3 /*break*/, 4];
                    result = results_1[_i];
                    return [4 /*yield*/, interpretExamResult(result.markerCode, result.value, patientSex, patientAge)];
                case 2:
                    interpretation = _a.sent();
                    if (interpretation) {
                        interpretations.push(interpretation);
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, interpretations];
            }
        });
    });
}
// ============================================================================
// EXPORT DEFAULT SERVICE
// ============================================================================
exports.examsReferenceService = {
    loadCatalog: loadExamReferenceCatalog,
    reloadCatalog: reloadCatalog,
    findReference: findReferenceForMarker,
    searchByName: searchMarkersByName,
    getByCategory: getMarkersByCategory,
    getAllCategories: getAllCategories,
    interpretResult: interpretExamResult,
    interpretMultiple: interpretMultipleResults
};
