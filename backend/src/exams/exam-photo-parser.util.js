"use strict";
// ============================================================================
// EXAM PHOTO PARSER - OCR com Tesseract.js para fotos de exames
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
exports.preprocessImage = preprocessImage;
exports.performOCR = performOCR;
exports.cleanOCRText = cleanOCRText;
exports.extractMarkersFromOCR = extractMarkersFromOCR;
exports.processExamPhoto = processExamPhoto;
exports.validateImageFile = validateImageFile;
exports.cleanupProcessedImages = cleanupProcessedImages;
var tesseract_js_1 = require("tesseract.js");
var sharp_1 = require("sharp");
var promises_1 = require("fs/promises");
var path_1 = require("path");
// ============================================================================
// CONFIGURAÇÃO DO TESSERACT
// ============================================================================
var TESSERACT_CONFIG = {
    lang: 'por', // Português
    oem: 1, // LSTM OCR Engine Mode (mais preciso)
    psm: 6, // Page Segmentation Mode: assume uniform block of text
};
// ============================================================================
// NORMALIZAÇÃO E PRÉ-PROCESSAMENTO DE IMAGEM
// ============================================================================
function preprocessImage(inputPath_1) {
    return __awaiter(this, arguments, void 0, function (inputPath, options) {
        var _a, autoRotate, _b, enhanceContrast, metadata, pipeline, MAX_WIDTH, ext, base, dir, processedPath, processedMetadata, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = options.autoRotate, autoRotate = _a === void 0 ? true : _a, _b = options.enhanceContrast, enhanceContrast = _b === void 0 ? true : _b;
                    console.log('📸 Pré-processando imagem para OCR...');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, sharp_1.default)(inputPath).metadata()
                        // Pipeline de processamento com Sharp
                    ];
                case 2:
                    metadata = _c.sent();
                    pipeline = (0, sharp_1.default)(inputPath);
                    // 1. Auto-rotação baseada em EXIF
                    if (autoRotate) {
                        pipeline = pipeline.rotate();
                    }
                    MAX_WIDTH = 3000;
                    if (metadata.width && metadata.width > MAX_WIDTH) {
                        pipeline = pipeline.resize(MAX_WIDTH, null, {
                            fit: 'inside',
                            withoutEnlargement: true
                        });
                    }
                    // 3. Converter para escala de cinza
                    pipeline = pipeline.greyscale();
                    // 4. Aumentar contraste
                    if (enhanceContrast) {
                        pipeline = pipeline.normalize(); // Auto-normalização de contraste
                    }
                    // 5. Aplicar threshold para binarização (preto e branco)
                    // Isso melhora muito o OCR
                    pipeline = pipeline.threshold(128, {
                        greyscale: false
                    });
                    // 6. Aumentar nitidez
                    pipeline = pipeline.sharpen();
                    ext = path_1.default.extname(inputPath);
                    base = path_1.default.basename(inputPath, ext);
                    dir = path_1.default.dirname(inputPath);
                    processedPath = path_1.default.join(dir, "".concat(base, "_processed.png"));
                    // Salvar imagem processada como PNG
                    return [4 /*yield*/, pipeline.png().toFile(processedPath)
                        // Obter metadados da imagem processada
                    ];
                case 3:
                    // Salvar imagem processada como PNG
                    _c.sent();
                    return [4 /*yield*/, (0, sharp_1.default)(processedPath).metadata()];
                case 4:
                    processedMetadata = _c.sent();
                    console.log('✅ Imagem pré-processada com sucesso');
                    console.log("   Original: ".concat(metadata.width, "x").concat(metadata.height));
                    console.log("   Processada: ".concat(processedMetadata.width, "x").concat(processedMetadata.height));
                    return [2 /*return*/, {
                            originalPath: inputPath,
                            processedPath: processedPath,
                            width: processedMetadata.width || 0,
                            height: processedMetadata.height || 0,
                            format: processedMetadata.format || 'png'
                        }];
                case 5:
                    error_1 = _c.sent();
                    console.error('❌ Erro ao pré-processar imagem:', error_1);
                    throw new Error('Falha ao processar imagem');
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// OCR COM TESSERACT
// ============================================================================
function performOCR(imagePath) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, warnings, result, processingTime, text, confidence, imageQuality, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔍 Executando OCR com Tesseract.js...');
                    startTime = Date.now();
                    warnings = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, tesseract_js_1.default.recognize(imagePath, TESSERACT_CONFIG.lang, {
                            logger: function (m) {
                                if (m.status === 'recognizing text') {
                                    var progress = Math.round(m.progress * 100);
                                    if (progress % 25 === 0) {
                                        console.log("   OCR: ".concat(progress, "%"));
                                    }
                                }
                            }
                        })];
                case 2:
                    result = _a.sent();
                    processingTime = Date.now() - startTime;
                    text = result.data.text;
                    confidence = result.data.confidence;
                    console.log("\u2705 OCR conclu\u00EDdo em ".concat(processingTime, "ms"));
                    console.log("   Confian\u00E7a: ".concat(confidence.toFixed(2), "%"));
                    console.log("   Texto extra\u00EDdo: ".concat(text.length, " caracteres"));
                    imageQuality = void 0;
                    if (confidence >= 90) {
                        imageQuality = 'excellent';
                    }
                    else if (confidence >= 70) {
                        imageQuality = 'good';
                    }
                    else if (confidence >= 50) {
                        imageQuality = 'fair';
                        warnings.push('Confiança do OCR abaixo do ideal. Considere tirar foto com melhor iluminação.');
                    }
                    else {
                        imageQuality = 'poor';
                        warnings.push('Baixa confiança do OCR. Tente tirar outra foto com melhor qualidade.');
                    }
                    // Validações adicionais
                    if (text.length < 50) {
                        warnings.push('Pouco texto detectado. Verifique se a foto está nítida e bem enquadrada.');
                    }
                    return [2 /*return*/, {
                            text: text,
                            confidence: confidence,
                            processingTime: processingTime,
                            imageQuality: imageQuality,
                            warnings: warnings
                        }];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Erro no OCR:', error_2);
                    throw new Error('Falha ao executar OCR na imagem');
                case 4: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// LIMPEZA E NORMALIZAÇÃO DO TEXTO OCR
// ============================================================================
function cleanOCRText(text) {
    var cleaned = text;
    // 1. Remover espaços múltiplos
    cleaned = cleaned.replace(/\s+/g, ' ');
    // 2. Aplicar correções em contexto numérico
    cleaned = cleaned.replace(/(\d+)[Oo](\d+)/g, '$10$2'); // 1O2 -> 102
    cleaned = cleaned.replace(/[Il](\d+)/g, '1$1'); // I23 -> 123
    cleaned = cleaned.replace(/(\d+)[Il]/g, '$11'); // 23I -> 231
    // 3. Normalizar quebras de linha
    cleaned = cleaned.replace(/\r\n/g, '\n');
    cleaned = cleaned.replace(/\r/g, '\n');
    // 4. Remover linhas vazias múltiplas
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    // 5. Trim de cada linha
    cleaned = cleaned
        .split('\n')
        .map(function (line) { return line.trim(); })
        .join('\n');
    return cleaned.trim();
}
function extractMarkersFromOCR(text) {
    var markers = [];
    // Limpar texto primeiro
    var cleanText = cleanOCRText(text);
    var lines = cleanText.split('\n').filter(function (l) { return l.length > 3; });
    console.log('🔎 Buscando marcadores no texto OCR...');
    // ========================================================================
    // PADRÕES DE REGEX PARA FOTOS (mais tolerantes que PDF)
    // ========================================================================
    var patterns = [
        // Padrão 1: "Glicose 95 mg/dL"
        /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*)\s+(\d+(?:[.,]\d+)?)\s*([a-zA-Zμ%\/]+)/gi,
        // Padrão 2: "Glicose: 95 mg/dL"
        /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*):\s*(\d+(?:[.,]\d+)?)\s*([a-zA-Zμ%\/]+)/gi,
        // Padrão 3: "Glicose.....95.....mg/dL" (pontos de preenchimento)
        /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*)[.\s]+(\d+(?:[.,]\d+)?)[.\s]*([a-zA-Zμ%\/]+)/gi,
        // Padrão 4: Formato tabular "Glicose | 95 | mg/dL"
        /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*)\s*[|]\s*(\d+(?:[.,]\d+)?)\s*[|]?\s*([a-zA-Zμ%\/]+)/gi
    ];
    // Aplicar cada padrão
    for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
        var pattern = patterns_1[_i];
        var matches = cleanText.matchAll(pattern);
        var _loop_1 = function (match) {
            var fullMatch = match[0], name_1 = match[1], value = match[2], unit = match[3];
            if (!name_1 || !value || !unit)
                return "continue";
            var rawName = name_1.trim();
            var numValue = parseFloat(value.replace(',', '.'));
            // Validações
            if (rawName.length < 3 || rawName.length > 100)
                return "continue";
            if (isNaN(numValue))
                return "continue";
            if (unit.length > 20)
                return "continue";
            // Evitar duplicatas simples
            var isDuplicate = markers.some(function (m) {
                return m.rawName === rawName &&
                    m.value === numValue &&
                    m.unit === unit;
            });
            if (!isDuplicate) {
                markers.push({
                    rawName: rawName,
                    value: numValue,
                    unit: unit.trim(),
                    confidence: 0.7, // Confiança média para OCR
                    method: 'ocr-regex',
                    rawSnippet: fullMatch.substring(0, 200)
                });
            }
        };
        for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
            var match = matches_1[_a];
            _loop_1(match);
        }
    }
    // ========================================================================
    // HEURÍSTICA LINHA POR LINHA (fallback)
    // ========================================================================
    if (markers.length < 3) {
        console.log('⚠️ Poucos marcadores via regex. Tentando heurística...');
        var _loop_2 = function (i) {
            var line = lines[i];
            var nextLine = i + 1 < lines.length ? lines[i + 1] : '';
            // Procurar nome de marcador (palavra começando com maiúscula)
            var nameMatch = line.match(/^([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+){0,3})/i);
            if (!nameMatch)
                return "continue";
            // Procurar valor na mesma linha ou próxima
            var searchText = "".concat(line, " ").concat(nextLine);
            var valueMatch = searchText.match(/(\d+(?:[.,]\d+)?)\s*([a-zA-Zμ%\/]+)/);
            if (valueMatch && nameMatch) {
                var rawName_1 = nameMatch[1].trim();
                var value_1 = parseFloat(valueMatch[1].replace(',', '.'));
                var unit = valueMatch[2];
                if (!isNaN(value_1) && rawName_1.length >= 3) {
                    // Verificar duplicata
                    var isDuplicate = markers.some(function (m) {
                        return m.rawName === rawName_1 &&
                            m.value === value_1;
                    });
                    if (!isDuplicate) {
                        markers.push({
                            rawName: rawName_1,
                            value: value_1,
                            unit: unit,
                            confidence: 0.5, // Confiança menor para heurística
                            method: 'ocr-heuristic',
                            rawSnippet: searchText.substring(0, 200)
                        });
                    }
                }
            }
        };
        for (var i = 0; i < lines.length; i++) {
            _loop_2(i);
        }
    }
    console.log("\u2705 Encontrados ".concat(markers.length, " marcadores"));
    return markers;
}
function processExamPhoto(photoPath_1) {
    return __awaiter(this, arguments, void 0, function (photoPath, options) {
        var processedImage, ocrResult, cleanedText, extractedMarkers;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('📋 Iniciando processamento completo da foto de exame...');
                    return [4 /*yield*/, preprocessImage(photoPath, options)
                        // 2. Executar OCR
                    ];
                case 1:
                    processedImage = _a.sent();
                    return [4 /*yield*/, performOCR(processedImage.processedPath)
                        // 3. Limpar texto
                    ];
                case 2:
                    ocrResult = _a.sent();
                    cleanedText = cleanOCRText(ocrResult.text);
                    extractedMarkers = extractMarkersFromOCR(cleanedText);
                    console.log('✨ Processamento completo da foto concluído!');
                    return [2 /*return*/, {
                            ocrResult: ocrResult,
                            processedImage: processedImage,
                            extractedMarkers: extractedMarkers,
                            rawText: ocrResult.text,
                            cleanedText: cleanedText
                        }];
            }
        });
    });
}
// ============================================================================
// UTILITÁRIOS
// ============================================================================
function validateImageFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, sharp_1.default)(filePath).metadata()
                        // Validações básicas
                    ];
                case 1:
                    metadata = _b.sent();
                    // Validações básicas
                    if (!metadata.width || !metadata.height)
                        return [2 /*return*/, false];
                    if (metadata.width < 200 || metadata.height < 200)
                        return [2 /*return*/, false];
                    if (metadata.width > 10000 || metadata.height > 10000)
                        return [2 /*return*/, false];
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function cleanupProcessedImages(originalPath) {
    return __awaiter(this, void 0, void 0, function () {
        var ext, base, dir, processedPath, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    ext = path_1.default.extname(originalPath);
                    base = path_1.default.basename(originalPath, ext);
                    dir = path_1.default.dirname(originalPath);
                    processedPath = path_1.default.join(dir, "".concat(base, "_processed.png"));
                    // Remover imagem processada (manter apenas original)
                    return [4 /*yield*/, promises_1.default.unlink(processedPath).catch(function () { })];
                case 1:
                    // Remover imagem processada (manter apenas original)
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
