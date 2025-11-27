"use strict";
/**
 * Local LLM Integration using Ollama
 *
 * Este módulo fornece integração com o Ollama rodando localmente.
 * NÃO usa nenhuma API externa de IA (OpenAI, Anthropic, etc.).
 *
 * Requisitos:
 * - Ollama instalado e rodando em http://localhost:11434
 * - Modelo baixado (ex: ollama pull llama3.1)
 *
 * Variáveis de ambiente:
 * - OLLAMA_BASE_URL: URL do Ollama (default: http://localhost:11434)
 * - OLLAMA_MODEL: Nome do modelo a usar (default: llama3.1)
 */
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
exports.callLocalLlm = callLocalLlm;
exports.callLocalLlmChat = callLocalLlmChat;
exports.checkOllamaAvailability = checkOllamaAvailability;
exports.listOllamaModels = listOllamaModels;
exports.extractJsonFromLlmResponse = extractJsonFromLlmResponse;
/**
 * Configuração do Ollama
 */
var OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
var OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';
var OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT || '120000', 10); // 2 minutos default
/**
 * Chama o Ollama local com um prompt simples
 * Usa a API /api/generate
 *
 * @param prompt - O prompt a enviar para o modelo
 * @param options - Opções adicionais (temperatura, etc)
 * @returns O texto gerado pelo modelo
 * @throws Error se o Ollama não estiver disponível ou ocorrer erro
 */
function callLocalLlm(prompt, options) {
    return __awaiter(this, void 0, void 0, function () {
        var requestBody, controller_1, timeoutId, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    requestBody = __assign({ model: OLLAMA_MODEL, prompt: prompt, stream: false }, (options && { options: options }));
                    controller_1 = new AbortController();
                    timeoutId = setTimeout(function () { return controller_1.abort(); }, OLLAMA_TIMEOUT);
                    return [4 /*yield*/, fetch("".concat(OLLAMA_BASE_URL, "/api/generate"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody),
                            signal: controller_1.signal,
                        })];
                case 1:
                    response = _a.sent();
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error("Ollama retornou erro ".concat(response.status, ": ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    if (!data.response) {
                        throw new Error('Ollama não retornou resposta válida');
                    }
                    return [2 /*return*/, data.response.trim()];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.name === 'AbortError') {
                        throw new Error("Timeout ao chamar Ollama ap\u00F3s ".concat(OLLAMA_TIMEOUT / 1000, "s. ") +
                            'O modelo pode estar muito lento ou não estar rodando.');
                    }
                    if (error_1.code === 'ECONNREFUSED' || error_1.message.includes('fetch failed')) {
                        throw new Error("Ollama local n\u00E3o est\u00E1 respondendo em ".concat(OLLAMA_BASE_URL, ". ") +
                            'Certifique-se de que o Ollama está instalado e rodando (ollama serve).');
                    }
                    throw new Error("Erro ao chamar Ollama: ".concat(error_1.message));
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Chama o Ollama local com formato de chat (mensagens)
 * Usa a API /api/chat
 *
 * @param messages - Array de mensagens (system, user, assistant)
 * @param options - Opções adicionais (temperatura, etc)
 * @returns O texto gerado pelo modelo
 * @throws Error se o Ollama não estiver disponível ou ocorrer erro
 */
function callLocalLlmChat(messages, options) {
    return __awaiter(this, void 0, void 0, function () {
        var requestBody, controller_2, timeoutId, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    requestBody = __assign({ model: OLLAMA_MODEL, messages: messages, stream: false }, (options && { options: options }));
                    controller_2 = new AbortController();
                    timeoutId = setTimeout(function () { return controller_2.abort(); }, OLLAMA_TIMEOUT);
                    return [4 /*yield*/, fetch("".concat(OLLAMA_BASE_URL, "/api/chat"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestBody),
                            signal: controller_2.signal,
                        })];
                case 1:
                    response = _a.sent();
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error("Ollama retornou erro ".concat(response.status, ": ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    if (!data.message || !data.message.content) {
                        throw new Error('Ollama não retornou resposta válida');
                    }
                    return [2 /*return*/, data.message.content.trim()];
                case 3:
                    error_2 = _a.sent();
                    if (error_2.name === 'AbortError') {
                        throw new Error("Timeout ao chamar Ollama ap\u00F3s ".concat(OLLAMA_TIMEOUT / 1000, "s. ") +
                            'O modelo pode estar muito lento ou não estar rodando.');
                    }
                    if (error_2.code === 'ECONNREFUSED' || error_2.message.includes('fetch failed')) {
                        throw new Error("Ollama local n\u00E3o est\u00E1 respondendo em ".concat(OLLAMA_BASE_URL, ". ") +
                            'Certifique-se de que o Ollama está instalado e rodando (ollama serve).');
                    }
                    throw new Error("Erro ao chamar Ollama: ".concat(error_2.message));
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Verifica se o Ollama está disponível e rodando
 *
 * @returns true se o Ollama está disponível, false caso contrário
 */
function checkOllamaAvailability() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("".concat(OLLAMA_BASE_URL, "/api/tags"), {
                            method: 'GET',
                            signal: AbortSignal.timeout(5000), // 5 segundos timeout
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.ok];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Lista os modelos disponíveis no Ollama
 *
 * @returns Array com nomes dos modelos instalados
 */
function listOllamaModels() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(OLLAMA_BASE_URL, "/api/tags"), {
                            method: 'GET',
                            signal: AbortSignal.timeout(5000),
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Erro ao listar modelos do Ollama');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data.models.map(function (m) { return m.name; })];
                case 3:
                    error_4 = _a.sent();
                    throw new Error("Erro ao listar modelos: ".concat(error_4.message));
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Helper para extrair JSON de uma resposta do LLM
 * Tenta encontrar e parsear JSON mesmo que venha com texto adicional
 *
 * @param response - Resposta do LLM que pode conter JSON
 * @returns Objeto parseado
 */
function extractJsonFromLlmResponse(response) {
    // Tentar parsear direto
    try {
        return JSON.parse(response);
    }
    catch (e) {
        // Se falhar, tentar encontrar JSON no meio do texto
        var jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            }
            catch (e2) {
                // Tentar corrigir vírgulas sobrando
                var cleaned = jsonMatch[0]
                    .replace(/,(\s*[}\]])/g, '$1') // Remove vírgula antes de } ou ]
                    .replace(/([}\]])(\s*)([}\]])/g, '$1,$2$3'); // Adiciona vírgula entre objetos/arrays
                try {
                    return JSON.parse(cleaned);
                }
                catch (e3) {
                    throw new Error("N\u00E3o foi poss\u00EDvel extrair JSON v\u00E1lido da resposta do LLM: ".concat(response.substring(0, 200), "..."));
                }
            }
        }
        throw new Error("Resposta do LLM n\u00E3o cont\u00E9m JSON v\u00E1lido: ".concat(response.substring(0, 200), "..."));
    }
}
