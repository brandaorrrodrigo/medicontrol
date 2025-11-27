"use strict";
// ============================================================================
// STT (Speech-to-Text) PROVIDER - Interface genérica para transcrição
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
exports.MockSTTProvider = exports.WhisperLocalProvider = exports.WhisperSTTProvider = void 0;
exports.createSTTProvider = createSTTProvider;
exports.validateAudioFile = validateAudioFile;
var promises_1 = require("fs/promises");
var form_data_1 = require("form-data");
var node_fetch_1 = require("node-fetch");
var fs_1 = require("fs");
// ============================================================================
// WHISPER PROVIDER (OpenAI API)
// ============================================================================
var WhisperSTTProvider = /** @class */ (function () {
    function WhisperSTTProvider(config) {
        this.apiKey = (config === null || config === void 0 ? void 0 : config.apiKey) || process.env.OPENAI_API_KEY || '';
        this.apiUrl = (config === null || config === void 0 ? void 0 : config.apiUrl) || process.env.WHISPER_API_URL || 'https://api.openai.com/v1/audio/transcriptions';
        this.model = (config === null || config === void 0 ? void 0 : config.model) || process.env.WHISPER_MODEL || 'whisper-1';
    }
    WhisperSTTProvider.prototype.getName = function () {
        return 'Whisper (OpenAI)';
    };
    WhisperSTTProvider.prototype.transcribe = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, response, error, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.apiKey) {
                            throw new Error('OPENAI_API_KEY não configurada. Configure a variável de ambiente.');
                        }
                        console.log('🎤 Transcrevendo áudio com Whisper...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        formData = new form_data_1.default();
                        formData.append('file', (0, fs_1.createReadStream)(filePath));
                        formData.append('model', this.model);
                        formData.append('language', 'pt'); // Português
                        return [4 /*yield*/, (0, node_fetch_1.default)(this.apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Authorization': "Bearer ".concat(this.apiKey)
                                },
                                body: formData
                            })];
                    case 2:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.text()];
                    case 3:
                        error = _a.sent();
                        throw new Error("Whisper API error: ".concat(response.status, " - ").concat(error));
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        data = _a.sent();
                        console.log('✅ Transcrição concluída');
                        console.log("   Texto: \"".concat(data.text, "\""));
                        return [2 /*return*/, data.text];
                    case 6:
                        error_1 = _a.sent();
                        console.error('❌ Erro ao transcrever com Whisper:', error_1);
                        throw new Error('Falha ao transcrever áudio com Whisper');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return WhisperSTTProvider;
}());
exports.WhisperSTTProvider = WhisperSTTProvider;
// ============================================================================
// WHISPER LOCAL PROVIDER (usando whisper.cpp ou similar)
// ============================================================================
var WhisperLocalProvider = /** @class */ (function () {
    function WhisperLocalProvider(config) {
        this.whisperPath = (config === null || config === void 0 ? void 0 : config.whisperPath) || process.env.WHISPER_LOCAL_PATH || 'whisper';
    }
    WhisperLocalProvider.prototype.getName = function () {
        return 'Whisper (Local)';
    };
    WhisperLocalProvider.prototype.transcribe = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var exec, promisify, execPromise, command, _a, stdout, stderr, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('🎤 Transcrevendo áudio com Whisper local...');
                        exec = require('child_process').exec;
                        promisify = require('util').promisify;
                        execPromise = promisify(exec);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        command = "".concat(this.whisperPath, " \"").concat(filePath, "\" --language pt --output_format txt");
                        return [4 /*yield*/, execPromise(command)];
                    case 2:
                        _a = _b.sent(), stdout = _a.stdout, stderr = _a.stderr;
                        if (stderr && !stdout) {
                            throw new Error("Whisper local error: ".concat(stderr));
                        }
                        console.log('✅ Transcrição concluída');
                        console.log("   Texto: \"".concat(stdout.trim(), "\""));
                        return [2 /*return*/, stdout.trim()];
                    case 3:
                        error_2 = _b.sent();
                        console.error('❌ Erro ao transcrever com Whisper local:', error_2);
                        throw new Error('Falha ao transcrever áudio com Whisper local. Certifique-se de que o Whisper está instalado.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return WhisperLocalProvider;
}());
exports.WhisperLocalProvider = WhisperLocalProvider;
// ============================================================================
// MOCK PROVIDER (para testes)
// ============================================================================
var MockSTTProvider = /** @class */ (function () {
    function MockSTTProvider() {
    }
    MockSTTProvider.prototype.getName = function () {
        return 'Mock STT (Testing)';
    };
    MockSTTProvider.prototype.transcribe = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var mockTranscripts, fileName, _i, _a, _b, key, transcript, defaultTranscript;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log('🎤 Usando Mock STT para testes...');
                        // Simular transcrição baseada no nome do arquivo (para testes)
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })]; // Simular delay
                    case 1:
                        // Simular transcrição baseada no nome do arquivo (para testes)
                        _c.sent(); // Simular delay
                        mockTranscripts = {
                            'glicemia': 'Minha glicemia em jejum deu noventa e cinco',
                            'lipidograma': 'Colesterol total duzentos e vinte, HDL quarenta e dois, triglicérides cento e cinquenta',
                            'tsh': 'TSH deu três vírgula dois',
                            'hemograma': 'Hemoglobina quatorze vírgula cinco, hematócrito quarenta e dois por cento'
                        };
                        fileName = filePath.toLowerCase();
                        for (_i = 0, _a = Object.entries(mockTranscripts); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], transcript = _b[1];
                            if (fileName.includes(key)) {
                                console.log("\u2705 Mock transcript: \"".concat(transcript, "\""));
                                return [2 /*return*/, transcript];
                            }
                        }
                        defaultTranscript = 'Glicemia em jejum noventa e cinco';
                        console.log("\u2705 Mock transcript (default): \"".concat(defaultTranscript, "\""));
                        return [2 /*return*/, defaultTranscript];
                }
            });
        });
    };
    return MockSTTProvider;
}());
exports.MockSTTProvider = MockSTTProvider;
// ============================================================================
// FACTORY PARA CRIAR O PROVIDER CORRETO
// ============================================================================
function createSTTProvider() {
    var providerType = process.env.STT_PROVIDER || 'whisper';
    console.log("\uD83C\uDF99\uFE0F Inicializando STT Provider: ".concat(providerType));
    switch (providerType.toLowerCase()) {
        case 'whisper':
        case 'whisper-api':
            return new WhisperSTTProvider();
        case 'whisper-local':
            return new WhisperLocalProvider();
        case 'mock':
        case 'test':
            return new MockSTTProvider();
        default:
            console.warn("\u26A0\uFE0F Provider \"".concat(providerType, "\" desconhecido. Usando Whisper API como padr\u00E3o."));
            return new WhisperSTTProvider();
    }
}
// ============================================================================
// VALIDAÇÃO DE ARQUIVO DE ÁUDIO
// ============================================================================
function validateAudioFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, maxSize, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.stat(filePath)
                        // Verificar tamanho (max 25MB para Whisper API)
                    ];
                case 1:
                    stats = _a.sent();
                    maxSize = 25 * 1024 * 1024 // 25MB
                    ;
                    if (stats.size > maxSize) {
                        return [2 /*return*/, {
                                isValid: false,
                                error: 'Arquivo de áudio muito grande. Máximo: 25MB'
                            }];
                    }
                    // Verificar tamanho mínimo
                    if (stats.size < 100) {
                        return [2 /*return*/, {
                                isValid: false,
                                error: 'Arquivo de áudio vazio ou corrompido'
                            }];
                    }
                    return [2 /*return*/, { isValid: true }];
                case 2:
                    error_3 = _a.sent();
                    return [2 /*return*/, {
                            isValid: false,
                            error: 'Não foi possível validar o arquivo de áudio'
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
