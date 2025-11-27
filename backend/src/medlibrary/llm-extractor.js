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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractFactsFromChunk = extractFactsFromChunk;
exports.extractFactsFromChunks = extractFactsFromChunks;
exports.deduplicateFacts = deduplicateFacts;
exports.filterLowQualityFacts = filterLowQualityFacts;
exports.aggregateSimilarFacts = aggregateSimilarFacts;
exports.processChunksWithPipeline = processChunksWithPipeline;
var local_llm_1 = require("../lib/local-llm");
var types_1 = require("./types");
/**
 * EXTRATOR LLM COM OLLAMA LOCAL
 *
 * Usa o Ollama local para extrair fatos farmacológicos de chunks de texto.
 */
// ============================================================================
// EXTRAÇÃO DE FATOS DE UM CHUNK
// ============================================================================
/**
 * Extrai fatos de um chunk de texto usando LLM
 */
function extractFactsFromChunk(chunk_1) {
    return __awaiter(this, arguments, void 0, function (chunk, options) {
        var _a, temperature, prompt_1, response, data, validFacts, _i, _b, fact, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = options.temperature, temperature = _a === void 0 ? 0.1 : _a;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 6]);
                    prompt_1 = (0, types_1.buildExtractionPrompt)(chunk.text);
                    // Chamar Ollama
                    console.log("[LLM] Processando chunk ".concat(chunk.chunkIndex + 1, "/").concat(chunk.totalChunks, " (p\u00E1ginas ").concat(chunk.pageStart, "-").concat(chunk.pageEnd, ")..."));
                    return [4 /*yield*/, (0, local_llm_1.callLocalLlm)(prompt_1, {
                            temperature: temperature,
                            // timeout: 180000, // 3 minutos por chunk - removed, not in type definition
                        })
                        // Extrair JSON da resposta
                    ];
                case 2:
                    response = _c.sent();
                    data = (0, local_llm_1.extractJsonFromLlmResponse)(response);
                    if (!data || !Array.isArray(data.facts)) {
                        console.warn("[LLM] Resposta inv\u00E1lida para chunk ".concat(chunk.chunkIndex + 1, ": n\u00E3o cont\u00E9m array de facts"));
                        return [2 /*return*/, []];
                    }
                    validFacts = [];
                    for (_i = 0, _b = data.facts; _i < _b.length; _i++) {
                        fact = _b[_i];
                        if ((0, types_1.validateExtractedFact)(fact)) {
                            // Normalizar nomes
                            fact.medicationName = (0, types_1.normalizeName)(fact.medicationName);
                            if (fact.otherMedicationName) {
                                fact.otherMedicationName = (0, types_1.normalizeName)(fact.otherMedicationName);
                            }
                            if (fact.foodKey) {
                                fact.foodKey = (0, types_1.normalizeName)(fact.foodKey);
                            }
                            validFacts.push(fact);
                        }
                        else {
                            console.warn("[LLM] Fato inv\u00E1lido ignorado: ".concat(JSON.stringify(fact).substring(0, 100), "..."));
                        }
                    }
                    console.log("[LLM] \u2713 ".concat(validFacts.length, " fatos extra\u00EDdos do chunk ").concat(chunk.chunkIndex + 1));
                    return [2 /*return*/, validFacts];
                case 3:
                    error_1 = _c.sent();
                    console.error("[LLM] Erro ao processar chunk ".concat(chunk.chunkIndex + 1, ":"), error_1.message);
                    if (!!error_1.retried) return [3 /*break*/, 5];
                    console.log("[LLM] Tentando novamente chunk ".concat(chunk.chunkIndex + 1, "..."));
                    error_1.retried = true;
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })]; // Aguardar 5s
                case 4:
                    _c.sent(); // Aguardar 5s
                    return [2 /*return*/, extractFactsFromChunk(chunk, options)];
                case 5: throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// EXTRAÇÃO EM LOTE
// ============================================================================
/**
 * Processa múltiplos chunks em sequência (não paralelo para não sobrecarregar LLM)
 */
function extractFactsFromChunks(chunks_1) {
    return __awaiter(this, arguments, void 0, function (chunks, options, onProgress) {
        var allFacts, processedCount, _i, chunks_2, chunk, facts, error_2;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allFacts = [];
                    processedCount = 0;
                    _i = 0, chunks_2 = chunks;
                    _a.label = 1;
                case 1:
                    if (!(_i < chunks_2.length)) return [3 /*break*/, 7];
                    chunk = chunks_2[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, extractFactsFromChunk(chunk, options)];
                case 3:
                    facts = _a.sent();
                    allFacts.push.apply(allFacts, facts);
                    processedCount++;
                    if (onProgress) {
                        onProgress(processedCount, chunks.length, allFacts.length);
                    }
                    // Pequeno delay entre chunks para não sobrecarregar
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 4:
                    // Pequeno delay entre chunks para não sobrecarregar
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error("[LLM] Erro fatal no chunk ".concat(chunk.chunkIndex + 1, ":"), error_2.message);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, allFacts];
            }
        });
    });
}
// ============================================================================
// DEDUPLICAÇÃO DE FATOS
// ============================================================================
/**
 * Remove fatos duplicados ou muito similares
 */
function deduplicateFacts(facts) {
    var unique = [];
    var seen = new Set();
    for (var _i = 0, facts_1 = facts; _i < facts_1.length; _i++) {
        var fact = facts_1[_i];
        // Criar chave única baseada nos campos principais
        var key = [
            fact.medicationName,
            fact.factType,
            fact.otherMedicationName || '',
            fact.foodKey || '',
            fact.description.substring(0, 50), // Primeiros 50 chars da descrição
        ].join('|');
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(fact);
        }
    }
    var duplicatesRemoved = facts.length - unique.length;
    if (duplicatesRemoved > 0) {
        console.log("[Dedup] Removidos ".concat(duplicatesRemoved, " fatos duplicados"));
    }
    return unique;
}
// ============================================================================
// FILTRAGEM DE QUALIDADE
// ============================================================================
/**
 * Filtra fatos de baixa qualidade ou suspeitos
 */
function filterLowQualityFacts(facts) {
    return facts.filter(function (fact) {
        // Descartar se descrição muito curta
        if (fact.description.length < 10) {
            console.warn("[Quality] Fato descartado (descri\u00E7\u00E3o muito curta): ".concat(fact.medicationName));
            return false;
        }
        // Descartar se nome do medicamento muito curto (provável erro)
        if (fact.medicationName.length < 3) {
            console.warn("[Quality] Fato descartado (nome muito curto): ".concat(fact.medicationName));
            return false;
        }
        // Descartar se onset time inválido
        if (fact.factType === 'ONSET_TIME' &&
            fact.typicalOnsetHoursMin !== null &&
            fact.typicalOnsetHoursMax !== null) {
            if (fact.typicalOnsetHoursMin > fact.typicalOnsetHoursMax ||
                fact.typicalOnsetHoursMin < 0 ||
                fact.typicalOnsetHoursMax > 720 // Mais de 30 dias parece suspeito
            ) {
                console.warn("[Quality] Fato descartado (onset time inv\u00E1lido): ".concat(fact.medicationName));
                return false;
            }
        }
        return true;
    });
}
// ============================================================================
// AGREGAÇÃO DE FATOS SIMILARES
// ============================================================================
/**
 * Agrupa fatos similares para criar versões consolidadas
 * (Útil para melhorar qualidade quando mesmo fato aparece múltiplas vezes)
 */
function aggregateSimilarFacts(facts) {
    var groups = new Map();
    // Agrupar fatos similares
    for (var _i = 0, facts_2 = facts; _i < facts_2.length; _i++) {
        var fact = facts_2[_i];
        var key = "".concat(fact.medicationName, "|").concat(fact.factType, "|").concat(fact.otherMedicationName || '', "|").concat(fact.foodKey || '');
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(fact);
    }
    var aggregated = [];
    // Para cada grupo, escolher o melhor fato ou mesclar informações
    for (var _a = 0, _b = groups.entries(); _a < _b.length; _a++) {
        var _c = _b[_a], _key = _c[0], groupFacts = _c[1];
        if (groupFacts.length === 1) {
            aggregated.push(groupFacts[0]);
        }
        else {
            // Escolher o fato com descrição mais completa
            var best = groupFacts.reduce(function (a, b) {
                return a.description.length > b.description.length ? a : b;
            });
            // Se houver recommendações, concatenar as únicas
            var recommendations = __spreadArray([], new Set(groupFacts
                .map(function (f) { return f.recommendation; })
                .filter(function (r) { return r && r.trim().length > 0; })), true).join(' ');
            aggregated.push(__assign(__assign({}, best), { recommendation: recommendations || best.recommendation }));
        }
    }
    var merged = facts.length - aggregated.length;
    if (merged > 0) {
        console.log("[Aggregate] Mesclados ".concat(merged, " fatos similares"));
    }
    return aggregated;
}
// ============================================================================
// PIPELINE COMPLETO DE PROCESSAMENTO
// ============================================================================
/**
 * Pipeline completo: extração + deduplicação + filtragem + agregação
 */
function processChunksWithPipeline(chunks_1) {
    return __awaiter(this, arguments, void 0, function (chunks, options, onProgress) {
        var facts;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[Pipeline] Iniciando processamento de ".concat(chunks.length, " chunks..."));
                    return [4 /*yield*/, extractFactsFromChunks(chunks, options, onProgress)];
                case 1:
                    facts = _a.sent();
                    console.log("[Pipeline] Extra\u00E7\u00E3o: ".concat(facts.length, " fatos brutos"));
                    // 2. Deduplicação
                    facts = deduplicateFacts(facts);
                    console.log("[Pipeline] Deduplica\u00E7\u00E3o: ".concat(facts.length, " fatos \u00FAnicos"));
                    // 3. Filtragem de qualidade
                    facts = filterLowQualityFacts(facts);
                    console.log("[Pipeline] Filtragem: ".concat(facts.length, " fatos de qualidade"));
                    // 4. Agregação
                    facts = aggregateSimilarFacts(facts);
                    console.log("[Pipeline] Agrega\u00E7\u00E3o: ".concat(facts.length, " fatos finais"));
                    console.log("[Pipeline] \u2713 Processamento conclu\u00EDdo: ".concat(facts.length, " fatos extra\u00EDdos"));
                    return [2 /*return*/, facts];
            }
        });
    });
}
