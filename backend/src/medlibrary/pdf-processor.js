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
exports.extractTextFromPDF = extractTextFromPDF;
exports.splitIntoChunks = splitIntoChunks;
exports.detectSections = detectSections;
exports.cleanText = cleanText;
exports.isValidPDF = isValidPDF;
exports.listPDFs = listPDFs;
exports.extractPDFMetadata = extractPDFMetadata;
// TODO: medlibrary needs schema migration - pdf-parse library not installed
var promises_1 = require("fs/promises");
var path_1 = require("path");
/**
 * PROCESSADOR DE PDFs
 *
 * Extrai texto de arquivos PDF e divide em chunks para processamento.
 */
// ============================================================================
// EXTRAÇÃO DE TEXTO DO PDF
// ============================================================================
/**
 * Extrai texto de um arquivo PDF
 *
 * NOTA: Esta função requer a biblioteca 'pdf-parse'.
 * Instale com: npm install pdf-parse @types/pdf-parse
 */
function extractTextFromPDF(pdfPath) {
    return __awaiter(this, void 0, void 0, function () {
        var pdfParse, dataBuffer, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, Promise.resolve("".concat('pdf-parse/lib/pdf-parse.js')).then(function (s) { return require(s); })];
                case 1:
                    pdfParse = _a.sent();
                    return [4 /*yield*/, promises_1.default.readFile(pdfPath)];
                case 2:
                    dataBuffer = _a.sent();
                    return [4 /*yield*/, pdfParse.default(dataBuffer)];
                case 3:
                    data = _a.sent();
                    return [2 /*return*/, {
                            text: data.text,
                            pages: data.numpages,
                        }];
                case 4:
                    error_1 = _a.sent();
                    if (error_1.code === 'MODULE_NOT_FOUND') {
                        throw new Error('A biblioteca pdf-parse não está instalada. Execute: npm install pdf-parse');
                    }
                    throw new Error("Erro ao extrair texto do PDF: ".concat(error_1.message));
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// DIVISÃO EM CHUNKS
// ============================================================================
/**
 * Divide texto em chunks lógicos para processamento
 */
function splitIntoChunks(text, options) {
    if (options === void 0) { options = {}; }
    var _a = options.chunkSize, chunkSize = _a === void 0 ? 3000 : _a, _b = options.chunkOverlap, chunkOverlap = _b === void 0 ? 500 : _b, _c = options.skipPages, skipPages = _c === void 0 ? [] : _c, _d = options.onlyPages, onlyPages = _d === void 0 ? [] : _d;
    var chunks = [];
    var currentPosition = 0;
    var chunkIndex = 0;
    // Dividir por parágrafos para respeitar estrutura
    var paragraphs = text.split(/\n\n+/);
    var currentChunk = '';
    var currentPageStart = 0;
    var currentPageEnd = 0;
    for (var _i = 0, paragraphs_1 = paragraphs; _i < paragraphs_1.length; _i++) {
        var paragraph = paragraphs_1[_i];
        // Se adicionar este parágrafo ultrapassar o tamanho do chunk
        if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
            // Salvar chunk atual
            chunks.push({
                text: currentChunk.trim(),
                pageStart: currentPageStart,
                pageEnd: currentPageEnd,
                chunkIndex: chunkIndex++,
                totalChunks: 0, // Será atualizado depois
            });
            // Iniciar novo chunk com sobreposição
            var overlapText = currentChunk.slice(-chunkOverlap);
            currentChunk = overlapText + '\n\n' + paragraph;
            currentPageStart = currentPageEnd;
        }
        else {
            currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + paragraph;
        }
        // Estimar página atual (aproximação: 3000 caracteres por página)
        currentPageEnd = Math.floor(currentPosition / 3000) + 1;
        currentPosition += paragraph.length;
    }
    // Adicionar último chunk
    if (currentChunk.trim().length > 0) {
        chunks.push({
            text: currentChunk.trim(),
            pageStart: currentPageStart,
            pageEnd: currentPageEnd,
            chunkIndex: chunkIndex++,
            totalChunks: 0,
        });
    }
    // Atualizar totalChunks em todos os chunks
    chunks.forEach(function (chunk) {
        chunk.totalChunks = chunks.length;
    });
    // Filtrar por páginas se especificado
    var filteredChunks = chunks;
    if (onlyPages && onlyPages.length > 0) {
        filteredChunks = chunks.filter(function (chunk) {
            return onlyPages.some(function (page) { return page >= chunk.pageStart && page <= chunk.pageEnd; });
        });
    }
    if (skipPages && skipPages.length > 0) {
        filteredChunks = filteredChunks.filter(function (chunk) {
            return !skipPages.some(function (page) { return page >= chunk.pageStart && page <= chunk.pageEnd; });
        });
    }
    return filteredChunks;
}
// ============================================================================
// DETECÇÃO INTELIGENTE DE CHUNKS
// ============================================================================
/**
 * Detecta seções do documento para criar chunks mais inteligentes
 * (opcional, para melhorar qualidade da extração)
 */
function detectSections(text) {
    var sections = [];
    // Regex para detectar títulos de seção (heurística simples)
    var sectionRegex = /^([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑa-záàâãéèêíïóôõöúçñ\s]{3,50})$/gm;
    var lastIndex = 0;
    var lastTitle = 'Introdução';
    var match;
    while ((match = sectionRegex.exec(text)) !== null) {
        var title = match[1].trim();
        var startIndex = match.index;
        // Adicionar seção anterior
        if (startIndex > lastIndex) {
            sections.push({
                title: lastTitle,
                text: text.slice(lastIndex, startIndex).trim(),
            });
        }
        lastTitle = title;
        lastIndex = startIndex + title.length;
    }
    // Adicionar última seção
    if (lastIndex < text.length) {
        sections.push({
            title: lastTitle,
            text: text.slice(lastIndex).trim(),
        });
    }
    return sections.filter(function (s) { return s.text.length > 100; }); // Ignorar seções muito pequenas
}
// ============================================================================
// LIMPEZA DE TEXTO
// ============================================================================
/**
 * Limpa e normaliza texto extraído do PDF
 */
function cleanText(text) {
    return (text
        // Remover quebras de linha no meio de palavras
        .replace(/(\w)-\n(\w)/g, '$1$2')
        // Normalizar espaços em branco
        .replace(/[ \t]+/g, ' ')
        // Normalizar quebras de linha múltiplas
        .replace(/\n{3,}/g, '\n\n')
        // Remover espaços no início/fim de linhas
        .replace(/^[ \t]+|[ \t]+$/gm, '')
        .trim());
}
// ============================================================================
// VALIDAÇÃO DE PDF
// ============================================================================
/**
 * Verifica se o arquivo é um PDF válido
 */
function isValidPDF(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var stats, buffer, file, header, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, promises_1.default.stat(filePath)];
                case 1:
                    stats = _b.sent();
                    if (!stats.isFile())
                        return [2 /*return*/, false
                            // Verificar extensão
                        ];
                    // Verificar extensão
                    if (!filePath.toLowerCase().endsWith('.pdf'))
                        return [2 /*return*/, false
                            // Verificar header do PDF
                        ];
                    buffer = Buffer.alloc(5);
                    return [4 /*yield*/, promises_1.default.open(filePath, 'r')];
                case 2:
                    file = _b.sent();
                    return [4 /*yield*/, file.read(buffer, 0, 5, 0)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, file.close()];
                case 4:
                    _b.sent();
                    header = buffer.toString('utf-8');
                    return [2 /*return*/, header === '%PDF-'];
                case 5:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// LISTAGEM DE PDFs
// ============================================================================
/**
 * Lista todos os arquivos PDF em um diretório
 */
function listPDFs(directory) {
    return __awaiter(this, void 0, void 0, function () {
        var files, pdfs, _i, files_1, file, filePath, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, promises_1.default.readdir(directory)];
                case 1:
                    files = _a.sent();
                    pdfs = [];
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    filePath = path_1.default.join(directory, file);
                    return [4 /*yield*/, isValidPDF(filePath)];
                case 3:
                    if (_a.sent()) {
                        pdfs.push(filePath);
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, pdfs.sort()];
                case 6:
                    error_2 = _a.sent();
                    throw new Error("Erro ao listar PDFs: ".concat(error_2.message));
                case 7: return [2 /*return*/];
            }
        });
    });
}
// ============================================================================
// EXTRAÇÃO DE METADADOS
// ============================================================================
/**
 * Tenta extrair metadados do PDF (título, autor, etc.)
 */
function extractPDFMetadata(pdfPath) {
    return __awaiter(this, void 0, void 0, function () {
        var pdfParse, dataBuffer, data, _a;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, Promise.resolve("".concat('pdf-parse/lib/pdf-parse.js')).then(function (s) { return require(s); })];
                case 1:
                    pdfParse = _e.sent();
                    return [4 /*yield*/, promises_1.default.readFile(pdfPath)];
                case 2:
                    dataBuffer = _e.sent();
                    return [4 /*yield*/, pdfParse.default(dataBuffer)];
                case 3:
                    data = _e.sent();
                    return [2 /*return*/, {
                            title: (_b = data.info) === null || _b === void 0 ? void 0 : _b.Title,
                            author: (_c = data.info) === null || _c === void 0 ? void 0 : _c.Author,
                            creationDate: ((_d = data.info) === null || _d === void 0 ? void 0 : _d.CreationDate)
                                ? new Date(data.info.CreationDate)
                                : undefined,
                        }];
                case 4:
                    _a = _e.sent();
                    return [2 /*return*/, {}];
                case 5: return [2 /*return*/];
            }
        });
    });
}
