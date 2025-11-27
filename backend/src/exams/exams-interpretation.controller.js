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
exports.examsInterpretationController = exports.ExamsInterpretationController = void 0;
var exams_reference_service_1 = require("./exams-reference.service");
var zod_1 = require("zod");
// ============================================================================
// VALIDADORES
// ============================================================================
var interpretResultSchema = zod_1.z.object({
    markerCode: zod_1.z.string(),
    value: zod_1.z.number(),
    patientSex: zod_1.z.enum(['M', 'F']).optional(),
    patientAge: zod_1.z.number().positive().optional()
});
var interpretMultipleSchema = zod_1.z.object({
    results: zod_1.z.array(zod_1.z.object({
        markerCode: zod_1.z.string(),
        value: zod_1.z.number()
    })),
    patientSex: zod_1.z.enum(['M', 'F']).optional(),
    patientAge: zod_1.z.number().positive().optional()
});
var searchMarkersSchema = zod_1.z.object({
    query: zod_1.z.string().min(2)
});
// ============================================================================
// CONTROLLER
// ============================================================================
var ExamsInterpretationController = /** @class */ (function () {
    function ExamsInterpretationController() {
    }
    // GET /api/exams/catalog
    // Lista todo o catálogo de marcadores
    ExamsInterpretationController.prototype.getCatalog = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var catalog, markers, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.loadCatalog()];
                    case 1:
                        catalog = _a.sent();
                        markers = Array.from(catalog.values());
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: {
                                    count: markers.length,
                                    markers: markers
                                }
                            })];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, next(error_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/categories
    // Lista todas as categorias disponíveis
    ExamsInterpretationController.prototype.getCategories = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var categories, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.getAllCategories()];
                    case 1:
                        categories = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: categories
                            })];
                    case 2:
                        error_2 = _a.sent();
                        return [2 /*return*/, next(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/category/:category
    // Lista marcadores de uma categoria específica
    ExamsInterpretationController.prototype.getByCategory = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var category, markers, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        category = req.params.category;
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.getByCategory(category)];
                    case 1:
                        markers = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: markers
                            })];
                    case 2:
                        error_3 = _a.sent();
                        return [2 /*return*/, next(error_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/exams/marker/:markerCode
    // Busca um marcador específico por código
    ExamsInterpretationController.prototype.getMarker = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var markerCode, marker, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        markerCode = req.params.markerCode;
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.findReference(markerCode)];
                    case 1:
                        marker = _a.sent();
                        if (!marker) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Marcador não encontrado'
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: marker
                            })];
                    case 2:
                        error_4 = _a.sent();
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/exams/search
    // Busca marcadores por nome
    ExamsInterpretationController.prototype.searchMarkers = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, results, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = searchMarkersSchema.parse(req.body);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.searchByName(data.query)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: {
                                    query: data.query,
                                    count: results.length,
                                    results: results
                                }
                            })];
                    case 2:
                        error_5 = _a.sent();
                        if (error_5 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_5.errors
                                })];
                        }
                        return [2 /*return*/, next(error_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/exams/interpret
    // Interpreta um resultado de exame
    ExamsInterpretationController.prototype.interpretResult = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, interpretation, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = interpretResultSchema.parse(req.body);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.interpretResult(data.markerCode, data.value, data.patientSex, data.patientAge)];
                    case 1:
                        interpretation = _a.sent();
                        if (!interpretation) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: 'Marcador não encontrado no catálogo'
                                })];
                        }
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: interpretation
                            })];
                    case 2:
                        error_6 = _a.sent();
                        if (error_6 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_6.errors
                                })];
                        }
                        return [2 /*return*/, next(error_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/exams/interpret-multiple
    // Interpreta múltiplos resultados de exames
    ExamsInterpretationController.prototype.interpretMultiple = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, interpretations, critical, abnormal, normal, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        data = interpretMultipleSchema.parse(req.body);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.interpretMultiple(data.results, data.patientSex, data.patientAge)
                            // Separar por status para facilitar análise
                        ];
                    case 1:
                        interpretations = _a.sent();
                        critical = interpretations.filter(function (i) {
                            return i.status === 'CRITICAL_HIGH' || i.status === 'CRITICAL_LOW';
                        });
                        abnormal = interpretations.filter(function (i) {
                            return i.status === 'HIGH' || i.status === 'LOW';
                        });
                        normal = interpretations.filter(function (i) {
                            return i.status === 'NORMAL';
                        });
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: {
                                    summary: {
                                        total: interpretations.length,
                                        critical: critical.length,
                                        abnormal: abnormal.length,
                                        normal: normal.length
                                    },
                                    interpretations: {
                                        critical: critical,
                                        abnormal: abnormal,
                                        normal: normal,
                                        all: interpretations
                                    }
                                }
                            })];
                    case 2:
                        error_7 = _a.sent();
                        if (error_7 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Validation error',
                                    details: error_7.errors
                                })];
                        }
                        return [2 /*return*/, next(error_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/exams/reload-catalog
    // Recarrega o catálogo do disco (útil após atualização)
    ExamsInterpretationController.prototype.reloadCatalog = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var catalog, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.reloadCatalog()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, exams_reference_service_1.examsReferenceService.loadCatalog()];
                    case 2:
                        catalog = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                message: 'Catálogo recarregado com sucesso',
                                data: {
                                    markerCount: catalog.size
                                }
                            })];
                    case 3:
                        error_8 = _a.sent();
                        return [2 /*return*/, next(error_8)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ExamsInterpretationController;
}());
exports.ExamsInterpretationController = ExamsInterpretationController;
exports.examsInterpretationController = new ExamsInterpretationController();
