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
exports.examManualController = exports.ExamManualController = void 0;
var exam_manual_service_1 = require("./exam-manual.service");
var exam_manual_validator_1 = require("./exam-manual.validator");
var zod_1 = require("zod");
var ExamManualController = /** @class */ (function () {
    function ExamManualController() {
    }
    // POST /api/exams/manual
    // Entrada manual individual de exame
    ExamManualController.prototype.createManualEntry = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, userId, result, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        data = exam_manual_validator_1.manualExamEntrySchema.parse(req.body);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Usuário não autenticado'
                                })];
                        }
                        console.log("\uD83D\uDCDD Entrada manual recebida: ".concat(data.markerCode));
                        return [4 /*yield*/, exam_manual_service_1.examManualService.processManualEntry(data, userId)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, res.status(201).json({
                                success: true,
                                message: 'Resultado de exame registrado com sucesso',
                                data: result
                            })];
                    case 2:
                        error_1 = _b.sent();
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
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/exams/manual/batch
    // Entrada manual em lote (múltiplos marcadores de uma vez)
    ExamManualController.prototype.createManualBatch = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data, userId, result, hasErrors, hasSuccess, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        data = exam_manual_validator_1.manualExamBatchSchema.parse(req.body);
                        userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                        if (!userId) {
                            return [2 /*return*/, res.status(401).json({
                                    success: false,
                                    error: 'Usuário não autenticado'
                                })];
                        }
                        console.log("\uD83D\uDCDD Entrada manual em lote recebida: ".concat(data.markers.length, " marcadores"));
                        return [4 /*yield*/, exam_manual_service_1.examManualService.processManualBatch(data, userId)
                            // Determinar status HTTP baseado nos resultados
                        ];
                    case 1:
                        result = _b.sent();
                        hasErrors = result.failureCount > 0;
                        hasSuccess = result.successCount > 0;
                        if (hasSuccess && !hasErrors) {
                            // Todos processados com sucesso
                            return [2 /*return*/, res.status(201).json({
                                    success: true,
                                    message: "".concat(result.successCount, " resultados registrados com sucesso"),
                                    data: result
                                })];
                        }
                        else if (hasSuccess && hasErrors) {
                            // Processamento parcial
                            return [2 /*return*/, res.status(207).json({
                                    success: true,
                                    message: "".concat(result.successCount, " registrados, ").concat(result.failureCount, " falharam"),
                                    data: result
                                })];
                        }
                        else {
                            // Todos falharam
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    message: 'Nenhum resultado pôde ser registrado',
                                    data: result
                                })];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        if (error_2 instanceof zod_1.z.ZodError) {
                            return [2 /*return*/, res.status(400).json({
                                    success: false,
                                    error: 'Dados inválidos',
                                    details: error_2.errors
                                })];
                        }
                        if (error_2 instanceof Error) {
                            return [2 /*return*/, res.status(400).json({
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
    // GET /api/exams/markers
    // Listar todos os marcadores disponíveis
    ExamManualController.prototype.listMarkers = function (_req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var markers, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, exam_manual_service_1.examManualService.listAvailableMarkers()];
                    case 1:
                        markers = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: {
                                    count: markers.length,
                                    markers: markers
                                }
                            })];
                    case 2:
                        error_3 = _a.sent();
                        if (error_3 instanceof Error) {
                            return [2 /*return*/, res.status(400).json({
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
    // GET /api/exams/markers/:markerCode
    // Obter informações detalhadas de um marcador
    ExamManualController.prototype.getMarkerInfo = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var markerCode, marker, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        markerCode = req.params.markerCode;
                        return [4 /*yield*/, exam_manual_service_1.examManualService.getMarkerInfo(markerCode)];
                    case 1:
                        marker = _a.sent();
                        return [2 /*return*/, res.status(200).json({
                                success: true,
                                data: marker
                            })];
                    case 2:
                        error_4 = _a.sent();
                        if (error_4 instanceof Error) {
                            return [2 /*return*/, res.status(404).json({
                                    success: false,
                                    error: error_4.message
                                })];
                        }
                        return [2 /*return*/, next(error_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ExamManualController;
}());
exports.ExamManualController = ExamManualController;
exports.examManualController = new ExamManualController();
