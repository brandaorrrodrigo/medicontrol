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
exports.createStock = createStock;
exports.getStock = getStock;
exports.updateStock = updateStock;
exports.consumeStock = consumeStock;
exports.restockMedication = restockMedication;
exports.deleteStock = deleteStock;
var stock_service_1 = require("./stock.service");
var alerts_validator_1 = require("./alerts.validator");
var zod_1 = require("zod");
/**
 * CONTROLLER DE ESTOQUE
 *
 * Handlers para endpoints de gerenciamento de estoque.
 */
// ============================================================================
// POST /api/medications/:medicationId/stock - Criar estoque
// ============================================================================
function createStock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, medicationId, data, stock, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    medicationId = req.params.medicationId;
                    data = alerts_validator_1.createStockBodySchema.parse(__assign(__assign({}, req.body), { medicationId: medicationId }));
                    return [4 /*yield*/, stock_service_1.stockService.createMedicationStock(data, userId)];
                case 1:
                    stock = _a.sent();
                    return [2 /*return*/, res.status(201).json(stock)];
                case 2:
                    error_1 = _a.sent();
                    console.error('Erro ao criar estoque:', error_1);
                    if (error_1.message === 'Medicamento não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Medicamento não encontrado' })];
                    }
                    if (error_1.message === 'Estoque já existe para este medicamento') {
                        return [2 /*return*/, res.status(409).json({ error: 'Estoque já existe' })];
                    }
                    if (error_1.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_1.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Dados inválidos',
                                details: error_1.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao criar estoque' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// GET /api/medications/:medicationId/stock - Obter estoque
// ============================================================================
function getStock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, medicationId, stock, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    medicationId = req.params.medicationId;
                    return [4 /*yield*/, stock_service_1.stockService.getMedicationStock(medicationId, userId)];
                case 1:
                    stock = _a.sent();
                    if (!stock) {
                        return [2 /*return*/, res.status(404).json({ error: 'Estoque não encontrado' })];
                    }
                    return [2 /*return*/, res.json(stock)];
                case 2:
                    error_2 = _a.sent();
                    console.error('Erro ao obter estoque:', error_2);
                    if (error_2.message === 'Medicamento não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Medicamento não encontrado' })];
                    }
                    if (error_2.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao obter estoque' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// PUT /api/medications/:medicationId/stock - Atualizar estoque
// ============================================================================
function updateStock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, medicationId, data, stock, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    medicationId = req.params.medicationId;
                    data = alerts_validator_1.updateStockBodySchema.parse(req.body);
                    return [4 /*yield*/, stock_service_1.stockService.updateMedicationStock(medicationId, data, userId)];
                case 1:
                    stock = _a.sent();
                    return [2 /*return*/, res.json(stock)];
                case 2:
                    error_3 = _a.sent();
                    console.error('Erro ao atualizar estoque:', error_3);
                    if (error_3.message === 'Medicamento não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Medicamento não encontrado' })];
                    }
                    if (error_3.message === 'Estoque não encontrado para este medicamento' ||
                        error_3.message === 'Estoque não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Estoque não encontrado' })];
                    }
                    if (error_3.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_3.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Dados inválidos',
                                details: error_3.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao atualizar estoque' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// POST /api/medications/:medicationId/stock/consume - Consumir estoque
// ============================================================================
var consumeStockSchema = zod_1.z.object({
    quantity: zod_1.z.number().min(0.01),
});
function consumeStock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, medicationId, quantity, stock, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    medicationId = req.params.medicationId;
                    quantity = consumeStockSchema.parse(req.body).quantity;
                    return [4 /*yield*/, stock_service_1.stockService.consumeMedicationStock(medicationId, quantity, userId)];
                case 1:
                    stock = _b.sent();
                    return [2 /*return*/, res.json(stock)];
                case 2:
                    error_4 = _b.sent();
                    console.error('Erro ao consumir estoque:', error_4);
                    if (error_4.message === 'Medicamento não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Medicamento não encontrado' })];
                    }
                    if (error_4.message === 'Estoque não configurado para este medicamento') {
                        return [2 /*return*/, res
                                .status(404)
                                .json({ error: 'Estoque não configurado para este medicamento' })];
                    }
                    if ((_a = error_4.message) === null || _a === void 0 ? void 0 : _a.startsWith('Estoque insuficiente')) {
                        return [2 /*return*/, res.status(400).json({ error: error_4.message })];
                    }
                    if (error_4.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_4.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Dados inválidos',
                                details: error_4.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao consumir estoque' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// POST /api/medications/:medicationId/stock/restock - Reabastecer estoque
// ============================================================================
var restockSchema = zod_1.z.object({
    quantity: zod_1.z.number().min(0.01),
});
function restockMedication(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, medicationId, quantity, stock, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    medicationId = req.params.medicationId;
                    quantity = restockSchema.parse(req.body).quantity;
                    return [4 /*yield*/, stock_service_1.stockService.restockMedication(medicationId, quantity, userId)];
                case 1:
                    stock = _a.sent();
                    return [2 /*return*/, res.json(stock)];
                case 2:
                    error_5 = _a.sent();
                    console.error('Erro ao reabastecer estoque:', error_5);
                    if (error_5.message === 'Medicamento não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Medicamento não encontrado' })];
                    }
                    if (error_5.message === 'Estoque não configurado para este medicamento') {
                        return [2 /*return*/, res
                                .status(404)
                                .json({ error: 'Estoque não configurado para este medicamento' })];
                    }
                    if (error_5.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    if (error_5.name === 'ZodError') {
                        return [2 /*return*/, res.status(400).json({
                                error: 'Dados inválidos',
                                details: error_5.errors,
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao reabastecer estoque' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// DELETE /api/medications/:medicationId/stock - Deletar estoque
// ============================================================================
function deleteStock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, medicationId, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    medicationId = req.params.medicationId;
                    return [4 /*yield*/, stock_service_1.stockService.deleteMedicationStock(medicationId, userId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.json({ message: 'Estoque deletado com sucesso' })];
                case 2:
                    error_6 = _a.sent();
                    console.error('Erro ao deletar estoque:', error_6);
                    if (error_6.message === 'Medicamento não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Medicamento não encontrado' })];
                    }
                    if (error_6.message === 'Estoque não encontrado') {
                        return [2 /*return*/, res.status(404).json({ error: 'Estoque não encontrado' })];
                    }
                    if (error_6.message === 'Acesso negado') {
                        return [2 /*return*/, res.status(403).json({ error: 'Acesso negado' })];
                    }
                    return [2 /*return*/, res.status(500).json({ error: 'Erro ao deletar estoque' })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
