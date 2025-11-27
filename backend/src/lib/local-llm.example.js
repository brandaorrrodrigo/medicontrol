"use strict";
/**
 * EXEMPLO DE USO DO OLLAMA LOCAL
 *
 * Este arquivo demonstra como usar a integração com Ollama
 * para extrair informações de textos médicos/farmacológicos.
 *
 * NÃO É UM MÓDULO FUNCIONAL - APENAS EXEMPLO/REFERÊNCIA
 */
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
exports.extractMedicalFactsFromText = extractMedicalFactsFromText;
exports.processMedicalLeaflet = processMedicalLeaflet;
exports.identifyMedicationFromOCR = identifyMedicationFromOCR;
exports.checkDrugInteractions = checkDrugInteractions;
var local_llm_1 = require("./local-llm");
/**
 * Exemplo 1: Extrair informações de um chunk de texto de eBook farmacológico
 */
function extractMedicalFactsFromText(textChunk) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "\nVoc\u00EA \u00E9 um assistente especializado em farmacologia.\nExtraia informa\u00E7\u00F5es sobre medicamentos do texto abaixo.\n\nRetorne um JSON no formato:\n{\n  \"facts\": [\n    {\n      \"name\": \"Nome do medicamento\",\n      \"dose\": \"Dose/concentra\u00E7\u00E3o\",\n      \"indication\": \"Indica\u00E7\u00E3o principal\"\n    }\n  ]\n}\n\nTexto:\n".concat(textChunk, "\n\nResponda APENAS com o JSON, sem texto adicional.\n").trim();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, local_llm_1.callLocalLlm)(prompt, {
                            temperature: 0.1, // Baixa temperatura = mais determinístico
                        })];
                case 2:
                    response = _a.sent();
                    data = (0, local_llm_1.extractJsonFromLlmResponse)(response);
                    return [2 /*return*/, data.facts];
                case 3:
                    error_1 = _a.sent();
                    console.error('Erro ao extrair fatos médicos:', error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Exemplo 2: Processar PDF de bula médica em chunks
 */
function processMedicalLeaflet(pdfText_1) {
    return __awaiter(this, arguments, void 0, function (pdfText, chunkSize) {
        var chunks, i, i, facts, error_2;
        if (chunkSize === void 0) { chunkSize = 2000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunks = [];
                    for (i = 0; i < pdfText.length; i += chunkSize) {
                        chunks.push(pdfText.substring(i, i + chunkSize));
                    }
                    console.log("Processando ".concat(chunks.length, " chunks..."));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < chunks.length)) return [3 /*break*/, 8];
                    console.log("Chunk ".concat(i + 1, "/").concat(chunks.length));
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, extractMedicalFactsFromText(chunks[i])
                        // Aqui você salvaria no banco de dados:
                        // await prisma.extractedMedicalFact.createMany({ data: facts })
                    ];
                case 3:
                    facts = _a.sent();
                    // Aqui você salvaria no banco de dados:
                    // await prisma.extractedMedicalFact.createMany({ data: facts })
                    console.log("Extra\u00EDdos ".concat(facts.length, " fatos m\u00E9dicos"));
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Erro no chunk ".concat(i + 1, ":"), error_2);
                    return [3 /*break*/, 5];
                case 5: 
                // Pequeno delay para não sobrecarregar o Ollama
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 6:
                    // Pequeno delay para não sobrecarregar o Ollama
                    _a.sent();
                    _a.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Exemplo 3: Identificar medicamento em foto de receita (OCR + LLM)
 */
function identifyMedicationFromOCR(ocrText) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "\nVoc\u00EA \u00E9 um assistente especializado em leitura de receitas m\u00E9dicas.\nDo texto OCR abaixo, identifique o nome do medicamento e a dose.\n\nTexto OCR:\n".concat(ocrText, "\n\nRetorne JSON:\n{\n  \"name\": \"Nome do medicamento\",\n  \"dose\": \"Dose prescrita\"\n}\n\nSe n\u00E3o conseguir identificar, retorne null.\nResponda APENAS com o JSON.\n").trim();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, local_llm_1.callLocalLlm)(prompt, { temperature: 0.1 })];
                case 2:
                    response = _a.sent();
                    if (response.toLowerCase().includes('null')) {
                        return [2 /*return*/, null];
                    }
                    data = (0, local_llm_1.extractJsonFromLlmResponse)(response);
                    return [2 /*return*/, data];
                case 3:
                    error_3 = _a.sent();
                    console.error('Erro ao identificar medicamento:', error_3);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Exemplo 4: Análise de interações medicamentosas (futuro)
 */
function checkDrugInteractions(medications) {
    return __awaiter(this, void 0, void 0, function () {
        var prompt, response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prompt = "\nVoc\u00EA \u00E9 um farmac\u00EAutico especializado.\nAnalise a lista de medicamentos abaixo e identifique poss\u00EDveis intera\u00E7\u00F5es.\n\nMedicamentos:\n".concat(medications.join(', '), "\n\nRetorne JSON:\n{\n  \"hasInteraction\": true/false,\n  \"warning\": \"Descri\u00E7\u00E3o da intera\u00E7\u00E3o se houver\"\n}\n\nSeja conservador - em caso de d\u00FAvida, indique intera\u00E7\u00E3o poss\u00EDvel.\nResponda APENAS com o JSON.\n").trim();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, local_llm_1.callLocalLlm)(prompt, { temperature: 0.2 })];
                case 2:
                    response = _a.sent();
                    data = (0, local_llm_1.extractJsonFromLlmResponse)(response);
                    return [2 /*return*/, data];
                case 3:
                    error_4 = _a.sent();
                    console.error('Erro ao verificar interações:', error_4);
                    return [2 /*return*/, {
                            hasInteraction: false,
                            warning: 'Erro ao verificar. Consulte um profissional.',
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * IMPORTANTE:
 *
 * Estes exemplos demonstram o uso do Ollama local.
 * Para implementação real:
 *
 * 1. Crie modelos Prisma adequados (ExtractedMedicalFact, etc)
 * 2. Adicione validação robusta de entrada/saída
 * 3. Implemente retry logic para falhas
 * 4. Adicione logging apropriado
 * 5. Considere processamento em background (queues)
 * 6. Teste com dados reais antes de produção
 *
 * LEMBRE-SE: Tudo roda LOCALMENTE. Sem APIs externas!
 */
