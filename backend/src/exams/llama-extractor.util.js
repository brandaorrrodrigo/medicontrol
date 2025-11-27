"use strict";
// @ts-nocheck
// ============================================================================
// LLAMA 3 EXTRACTOR - Fallback com IA Local via Ollama
// ============================================================================
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
exports.isOllamaAvailable = isOllamaAvailable;
exports.extractWithAI = extractWithAI;
exports.extractWithAIBatch = extractWithAIBatch;
exports.splitTextIntoChunks = splitTextIntoChunks;
var OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
var OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';
// ============================================================================
// VERIFICAR SE OLLAMA ESTÁ DISPONÍVEL
// ============================================================================
function isOllamaAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("".concat(OLLAMA_URL, "/api/tags"), {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        })];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, response.ok];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// PROMPT PARA EXTRAÇÃO
// ============================================================================
function buildExtractionPrompt(textBlock) {
    return "You are a medical lab results parser. Extract ALL laboratory markers with their values from the following text.\n\nTEXT TO ANALYZE:\n\"\"\"\n".concat(textBlock, "\n\"\"\"\n\nINSTRUCTIONS:\n1. Find all laboratory test markers (e.g., glucose, cholesterol, hemoglobin, etc.)\n2. Extract the numeric value and unit for each marker\n3. Return ONLY a valid JSON array, nothing else\n4. Format: [{\"marker\": \"marker name\", \"value\": number, \"unit\": \"unit\"}]\n5. If no markers found, return []\n\nEXAMPLES:\nInput: \"Glicose 95 mg/dL\"\nOutput: [{\"marker\": \"Glicose\", \"value\": 95, \"unit\": \"mg/dL\"}]\n\nInput: \"Hemoglobina: 14.2 g/dL, Hemat\u00F3crito: 42%\"\nOutput: [\n  {\"marker\": \"Hemoglobina\", \"value\": 14.2, \"unit\": \"g/dL\"},\n  {\"marker\": \"Hemat\u00F3crito\", \"value\": 42, \"unit\": \"%\"}\n]\n\nNOW EXTRACT FROM THE TEXT ABOVE.\nReturn ONLY the JSON array:");
}
// ============================================================================
// CHAMADA À API DO OLLAMA
// ============================================================================
function callOllama(prompt) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(OLLAMA_URL, "/api/generate"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                model: OLLAMA_MODEL,
                                prompt: prompt,
                                stream: false,
                                options: {
                                    temperature: 0.1, // Baixa temperatura para respostas mais determinísticas
                                    top_p: 0.9,
                                    num_predict: 1000
                                }
                            })
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Ollama API error: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.response || ''];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Erro ao chamar Ollama:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// PARSING DA RESPOSTA DO LLAMA
// ============================================================================
function parseAIResponse(response) {
    try {
        // Remover markdown code blocks se existirem
        var cleanResponse = response.trim();
        cleanResponse = cleanResponse.replace(/```json\n?/g, '');
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
        cleanResponse = cleanResponse.trim();
        // Tentar encontrar o array JSON
        var jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.warn('⚠️ Nenhum array JSON encontrado na resposta do Llama');
            return [];
        }
        var parsed = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(parsed)) {
            console.warn('⚠️ Resposta do Llama não é um array');
            return [];
        }
        // Converter para formato esperado
        return parsed
            .filter(function (item) { return item.marker && item.value !== undefined && item.unit; })
            .map(function (item) { return ({
            markerName: item.marker,
            value: parseFloat(item.value),
            unit: item.unit,
            confidence: 0.7 // Confiança média para IA
        }); });
    }
    catch (error) {
        console.error('❌ Erro ao fazer parse da resposta do Llama:', error);
        return [];
    }
}
// ============================================================================
// FUNÇÃO PRINCIPAL - EXTRAÇÃO COM IA
// ============================================================================
function extractWithAI(textBlock) {
    return __awaiter(this, void 0, void 0, function () {
        var available, truncatedText, prompt_1, response, markers, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isOllamaAvailable()];
                case 1:
                    available = _a.sent();
                    if (!available) {
                        console.log('ℹ️ Ollama não está disponível. Pulando extração com IA.');
                        return [2 /*return*/, []];
                    }
                    console.log('🤖 Usando Llama 3 para extração...');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    truncatedText = textBlock.substring(0, 4000);
                    prompt_1 = buildExtractionPrompt(truncatedText);
                    return [4 /*yield*/, callOllama(prompt_1)
                        // Parse da resposta
                    ];
                case 3:
                    response = _a.sent();
                    markers = parseAIResponse(response);
                    console.log("\u2705 Llama extraiu ".concat(markers.length, " marcadores"));
                    return [2 /*return*/, markers];
                case 4:
                    error_2 = _a.sent();
                    console.error('❌ Erro na extração com IA:', error_2);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// EXTRAÇÃO EM LOTE (CHUNKS)
// ============================================================================
function extractWithAIBatch(textBlocks_1) {
    return __awaiter(this, arguments, void 0, function (textBlocks, maxConcurrent) {
        var allMarkers, i, batch, results, _i, results_1, markers;
        if (maxConcurrent === void 0) { maxConcurrent = 2; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allMarkers = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < textBlocks.length)) return [3 /*break*/, 4];
                    batch = textBlocks.slice(i, i + maxConcurrent);
                    return [4 /*yield*/, Promise.all(batch.map(function (block) { return extractWithAI(block); }))];
                case 2:
                    results = _a.sent();
                    for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                        markers = results_1[_i];
                        allMarkers.push.apply(allMarkers, markers);
                    }
                    _a.label = 3;
                case 3:
                    i += maxConcurrent;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, allMarkers];
            }
        });
    });
}
// ============================================================================
// UTILITÁRIO: DIVIDIR TEXTO EM CHUNKS
// ============================================================================
function splitTextIntoChunks(text, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 3000; }
    var lines = text.split('\n');
    var chunks = [];
    var currentChunk = '';
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if ((currentChunk + line).length > chunkSize) {
            if (currentChunk) {
                chunks.push(currentChunk);
            }
            currentChunk = line + '\n';
        }
        else {
            currentChunk += line + '\n';
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks;
}
