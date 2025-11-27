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
var promises_1 = require("fs/promises");
var path_1 = require("path");
// ============================================================================
// MAPEAMENTO DE MARCADORES (Manual inicial - extensível)
// ============================================================================
var MARKER_MAPPINGS = {
    // GLICEMIA
    'glicose': {
        code: 'GLICEMIA_JEJUM',
        category: 'Glicemia',
        defaultUnit: 'mg/dL',
        synonyms: ['glicose em jejum', 'glicemia de jejum', 'glicose plasmatica', 'glicose sanguinea']
    },
    'hemoglobina glicada': {
        code: 'HEMOGLOBINA_GLICADA',
        category: 'Glicemia',
        defaultUnit: '%',
        synonyms: ['hba1c', 'hemoglobina glicosilada', 'a1c']
    },
    'insulina': {
        code: 'INSULINA',
        category: 'Glicemia',
        defaultUnit: 'μU/mL',
        synonyms: ['insulina basal', 'insulina em jejum']
    },
    // LIPIDOGRAMA
    'colesterol total': {
        code: 'COLESTEROL_TOTAL',
        category: 'Lipidograma',
        defaultUnit: 'mg/dL',
        synonyms: ['colesterol']
    },
    'hdl': {
        code: 'HDL_COLESTEROL',
        category: 'Lipidograma',
        defaultUnit: 'mg/dL',
        synonyms: ['hdl colesterol', 'colesterol hdl', 'hdl-c']
    },
    'ldl': {
        code: 'LDL_COLESTEROL',
        category: 'Lipidograma',
        defaultUnit: 'mg/dL',
        synonyms: ['ldl colesterol', 'colesterol ldl', 'ldl-c']
    },
    'vldl': {
        code: 'VLDL_COLESTEROL',
        category: 'Lipidograma',
        defaultUnit: 'mg/dL',
        synonyms: ['vldl colesterol', 'colesterol vldl', 'vldl-c']
    },
    'triglicerideos': {
        code: 'TRIGLICERIDEOS',
        category: 'Lipidograma',
        defaultUnit: 'mg/dL',
        synonyms: ['triglicerides', 'tg']
    },
    // FUNÇÃO HEPÁTICA
    'tgo': {
        code: 'AST_TGO',
        category: 'Função Hepática',
        defaultUnit: 'U/L',
        synonyms: ['ast', 'aspartato aminotransferase', 'transaminase oxalacetica']
    },
    'tgp': {
        code: 'ALT_TGP',
        category: 'Função Hepática',
        defaultUnit: 'U/L',
        synonyms: ['alt', 'alanina aminotransferase', 'transaminase piruvica']
    },
    'gama gt': {
        code: 'GAMA_GT',
        category: 'Função Hepática',
        defaultUnit: 'U/L',
        synonyms: ['ggt', 'gamaglutamiltransferase', 'gamma gt']
    },
    'fosfatase alcalina': {
        code: 'FOSFATASE_ALCALINA',
        category: 'Função Hepática',
        defaultUnit: 'U/L',
        synonyms: ['fa', 'alkaline phosphatase']
    },
    'bilirrubina total': {
        code: 'BILIRRUBINA_TOTAL',
        category: 'Função Hepática',
        defaultUnit: 'mg/dL',
        synonyms: ['bilirrubinas totais']
    },
    'bilirrubina direta': {
        code: 'BILIRRUBINA_DIRETA',
        category: 'Função Hepática',
        defaultUnit: 'mg/dL',
        synonyms: ['bilirrubina conjugada']
    },
    'bilirrubina indireta': {
        code: 'BILIRRUBINA_INDIRETA',
        category: 'Função Hepática',
        defaultUnit: 'mg/dL',
        synonyms: ['bilirrubina nao conjugada']
    },
    'albumina': {
        code: 'ALBUMINA',
        category: 'Função Hepática',
        defaultUnit: 'g/dL',
        synonyms: ['albumina serica']
    },
    // FUNÇÃO RENAL
    'creatinina': {
        code: 'CREATININA',
        category: 'Função Renal',
        defaultUnit: 'mg/dL',
        synonyms: ['creatinina serica']
    },
    'ureia': {
        code: 'UREIA',
        category: 'Função Renal',
        defaultUnit: 'mg/dL',
        synonyms: ['ureia serica']
    },
    'acido urico': {
        code: 'ACIDO_URICO',
        category: 'Função Renal',
        defaultUnit: 'mg/dL',
        synonyms: ['uricemia', 'acido urico serico']
    },
    // HEMOGRAMA
    'hemoglobina': {
        code: 'HEMOGLOBINA',
        category: 'Hemograma',
        defaultUnit: 'g/dL',
        synonyms: ['hb', 'hemoglobina sanguinea']
    },
    'hematocrito': {
        code: 'HEMATOCRITO',
        category: 'Hemograma',
        defaultUnit: '%',
        synonyms: ['ht', 'htc']
    },
    'eritrocitos': {
        code: 'ERITROCITOS',
        category: 'Hemograma',
        defaultUnit: 'milhões/mm³',
        synonyms: ['hemacias', 'globulos vermelhos', 'red blood cells']
    },
    'leucocitos': {
        code: 'LEUCOCITOS',
        category: 'Hemograma',
        defaultUnit: '/mm³',
        synonyms: ['globulos brancos', 'white blood cells', 'wbc']
    },
    'plaquetas': {
        code: 'PLAQUETAS',
        category: 'Hemograma',
        defaultUnit: '/mm³',
        synonyms: ['plaquetas sanguineas', 'platelets']
    },
    'vcm': {
        code: 'VCM',
        category: 'Hemograma',
        defaultUnit: 'fL',
        synonyms: ['volume corpuscular medio']
    },
    'hcm': {
        code: 'HCM',
        category: 'Hemograma',
        defaultUnit: 'pg',
        synonyms: ['hemoglobina corpuscular media']
    },
    'chcm': {
        code: 'CHCM',
        category: 'Hemograma',
        defaultUnit: 'g/dL',
        synonyms: ['concentracao de hemoglobina corpuscular media']
    },
    // INFLAMATÓRIOS
    'pcr': {
        code: 'PROTEINA_C_REATIVA',
        category: 'Inflamatórios',
        defaultUnit: 'mg/L',
        synonyms: ['proteina c reativa', 'c reactive protein', 'crp']
    },
    'vhs': {
        code: 'VHS',
        category: 'Inflamatórios',
        defaultUnit: 'mm/h',
        synonyms: ['velocidade de hemossedimentacao', 'hemossedimentacao']
    },
    'ferritina': {
        code: 'FERRITINA',
        category: 'Inflamatórios',
        defaultUnit: 'ng/mL',
        synonyms: ['ferritina serica']
    },
    // ELETRÓLITOS
    'sodio': {
        code: 'SODIO',
        category: 'Eletrólitos',
        defaultUnit: 'mEq/L',
        synonyms: ['na', 'sodio serico']
    },
    'potassio': {
        code: 'POTASSIO',
        category: 'Eletrólitos',
        defaultUnit: 'mEq/L',
        synonyms: ['k', 'potassio serico']
    },
    'calcio': {
        code: 'CALCIO',
        category: 'Eletrólitos',
        defaultUnit: 'mg/dL',
        synonyms: ['ca', 'calcio serico', 'calcio ionico']
    },
    'magnesio': {
        code: 'MAGNESIO',
        category: 'Eletrólitos',
        defaultUnit: 'mg/dL',
        synonyms: ['mg', 'magnesio serico']
    },
    // TIREOIDE
    'tsh': {
        code: 'TSH',
        category: 'Função Tireoidiana',
        defaultUnit: 'μUI/mL',
        synonyms: ['hormonio tireoestimulante', 'tireotrofina']
    },
    't4 livre': {
        code: 'T4_LIVRE',
        category: 'Função Tireoidiana',
        defaultUnit: 'ng/dL',
        synonyms: ['tiroxina livre', 'free t4']
    },
    't3 livre': {
        code: 'T3_LIVRE',
        category: 'Função Tireoidiana',
        defaultUnit: 'pg/mL',
        synonyms: ['triiodotironina livre', 'free t3']
    },
    // VITAMINAS
    'vitamina d': {
        code: 'VITAMINA_D',
        category: 'Vitaminas',
        defaultUnit: 'ng/mL',
        synonyms: ['25-hidroxivitamina d', '25(oh)d', 'calcidiol']
    },
    'vitamina b12': {
        code: 'VITAMINA_B12',
        category: 'Vitaminas',
        defaultUnit: 'pg/mL',
        synonyms: ['cobalamina', 'b12']
    },
    'acido folico': {
        code: 'ACIDO_FOLICO',
        category: 'Vitaminas',
        defaultUnit: 'ng/mL',
        synonyms: ['folato', 'vitamina b9']
    },
};
// ============================================================================
// UTILITÁRIOS
// ============================================================================
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function findMarkerMapping(text) {
    var normalized = normalizeText(text);
    // Busca exata
    if (MARKER_MAPPINGS[normalized]) {
        return MARKER_MAPPINGS[normalized];
    }
    // Busca por sinônimos
    for (var _i = 0, _a = Object.entries(MARKER_MAPPINGS); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], mapping = _b[1];
        if (mapping.synonyms.some(function (syn) { return normalizeText(syn) === normalized; })) {
            return mapping;
        }
    }
    // Busca parcial
    for (var _c = 0, _d = Object.entries(MARKER_MAPPINGS); _c < _d.length; _c++) {
        var _e = _d[_c], key = _e[0], mapping = _e[1];
        if (normalized.includes(key) || key.includes(normalized)) {
            return mapping;
        }
    }
    return null;
}
function extractNumberFromText(text) {
    var match = text.match(/(\d+(?:[.,]\d+)?)/);
    if (match) {
        return parseFloat(match[1].replace(',', '.'));
    }
    return null;
}
function extractRangeFromText(text) {
    // Padrões: "70-99", "70 a 99", "70 - 99 mg/dL", "< 100", "> 50"
    // Padrão: número - número
    var rangeMatch = text.match(/(\d+(?:[.,]\d+)?)\s*[-a]\s*(\d+(?:[.,]\d+)?)/i);
    if (rangeMatch) {
        return {
            low: parseFloat(rangeMatch[1].replace(',', '.')),
            high: parseFloat(rangeMatch[2].replace(',', '.'))
        };
    }
    // Padrão: < número
    var lessThanMatch = text.match(/[<≤]\s*(\d+(?:[.,]\d+)?)/i);
    if (lessThanMatch) {
        return {
            high: parseFloat(lessThanMatch[1].replace(',', '.'))
        };
    }
    // Padrão: > número
    var greaterThanMatch = text.match(/[>≥]\s*(\d+(?:[.,]\d+)?)/i);
    if (greaterThanMatch) {
        return {
            low: parseFloat(greaterThanMatch[1].replace(',', '.'))
        };
    }
    return null;
}
function extractUnitFromText(text) {
    // Padrões comuns: mg/dL, g/dL, U/L, μU/mL, ng/mL, pg/mL, mEq/L, %, etc.
    var unitMatch = text.match(/\b(mg\/dL|g\/dL|U\/L|μU\/mL|uU\/mL|ng\/mL|pg\/mL|mEq\/L|mmol\/L|%|fL|pg|mm\/h|milhões\/mm³|\/mm³)\b/i);
    return unitMatch ? unitMatch[1] : null;
}
// ============================================================================
// PROCESSAMENTO DE PDF
// ============================================================================
function processPDF(pdfPath, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var PDFExtract, pdfExtract, pdfData, text, lines, markers, i, line, nextLine, combinedLine, mapping, range, unit, marker;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDCC4 Processando: ".concat(filename));
                    PDFExtract = require('pdf.js-extract').PDFExtract;
                    pdfExtract = new PDFExtract();
                    return [4 /*yield*/, pdfExtract.extract(pdfPath, {})
                        // Extrair texto de todas as páginas
                    ];
                case 1:
                    pdfData = _a.sent();
                    text = pdfData.pages
                        .map(function (page) {
                        return page.content
                            .map(function (item) { return item.str; })
                            .join(' ');
                    })
                        .join('\n');
                    lines = text.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; });
                    markers = [];
                    // Estratégia: procurar por linhas que parecem conter nomes de exames
                    // seguidas de linhas com valores de referência
                    for (i = 0; i < lines.length; i++) {
                        line = lines[i];
                        nextLine = i + 1 < lines.length ? lines[i + 1] : '';
                        combinedLine = "".concat(line, " ").concat(nextLine);
                        mapping = findMarkerMapping(line);
                        if (mapping) {
                            range = extractRangeFromText(combinedLine);
                            unit = extractUnitFromText(combinedLine) || mapping.defaultUnit || '';
                            marker = {
                                markerCode: mapping.code,
                                markerName: line,
                                category: mapping.category,
                                unit: unit,
                                synonyms: __spreadArray([], mapping.synonyms, true),
                                referenceRanges: range ? [__assign({ population: 'Adultos', sex: 'ANY', ageRange: '18-65' }, range)] : [],
                                interpretationHints: [],
                                sources: [{
                                        pdf: filename,
                                        pages: [Math.floor(i / 50) + 1] // Estimativa grosseira da página
                                    }]
                            };
                            markers.push(marker);
                        }
                    }
                    console.log("  \u2713 Encontrados ".concat(markers.length, " marcadores"));
                    return [2 /*return*/, markers];
            }
        });
    });
}
// ============================================================================
// AGREGAÇÃO
// ============================================================================
function aggregateMarkers(allMarkers) {
    var markerMap = new Map();
    for (var _i = 0, allMarkers_1 = allMarkers; _i < allMarkers_1.length; _i++) {
        var marker = allMarkers_1[_i];
        if (!marker.markerCode)
            continue;
        var existing = markerMap.get(marker.markerCode);
        if (!existing) {
            // Primeiro registro deste marcador
            markerMap.set(marker.markerCode, {
                markerCode: marker.markerCode,
                markerName: marker.markerName || marker.markerCode,
                synonyms: marker.synonyms || [],
                category: marker.category || 'Outros',
                unit: marker.unit || '',
                referenceRanges: marker.referenceRanges || [],
                interpretationHints: marker.interpretationHints || [],
                sources: marker.sources || []
            });
        }
        else {
            // Mesclar com registro existente
            // Adicionar sinônimos únicos
            if (marker.synonyms) {
                for (var _a = 0, _b = marker.synonyms; _a < _b.length; _a++) {
                    var syn = _b[_a];
                    if (!existing.synonyms.includes(syn)) {
                        existing.synonyms.push(syn);
                    }
                }
            }
            // Adicionar ranges únicos
            if (marker.referenceRanges) {
                var _loop_1 = function (range) {
                    var isDuplicate = existing.referenceRanges.some(function (r) {
                        return r.population === range.population &&
                            r.sex === range.sex &&
                            r.ageRange === range.ageRange &&
                            r.low === range.low &&
                            r.high === range.high;
                    });
                    if (!isDuplicate) {
                        existing.referenceRanges.push(range);
                    }
                };
                for (var _c = 0, _d = marker.referenceRanges; _c < _d.length; _c++) {
                    var range = _d[_c];
                    _loop_1(range);
                }
            }
            // Adicionar hints únicos
            if (marker.interpretationHints) {
                for (var _e = 0, _f = marker.interpretationHints; _e < _f.length; _e++) {
                    var hint = _f[_e];
                    if (!existing.interpretationHints.includes(hint)) {
                        existing.interpretationHints.push(hint);
                    }
                }
            }
            // Adicionar fontes
            if (marker.sources) {
                var _loop_2 = function (source) {
                    var existingSource = existing.sources.find(function (s) { return s.pdf === source.pdf; });
                    if (existingSource) {
                        // Mesclar páginas
                        for (var _j = 0, _k = source.pages; _j < _k.length; _j++) {
                            var page = _k[_j];
                            if (!existingSource.pages.includes(page)) {
                                existingSource.pages.push(page);
                            }
                        }
                    }
                    else {
                        existing.sources.push(source);
                    }
                };
                for (var _g = 0, _h = marker.sources; _g < _h.length; _g++) {
                    var source = _h[_g];
                    _loop_2(source);
                }
            }
            // Atualizar unidade se estava vazia
            if (!existing.unit && marker.unit) {
                existing.unit = marker.unit;
            }
        }
    }
    return Array.from(markerMap.values()).sort(function (a, b) {
        return a.markerCode.localeCompare(b.markerCode);
    });
}
// ============================================================================
// MAIN
// ============================================================================
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rawPdfsDir, outputPath, _a, files, pdfFiles, allMarkers, _i, pdfFiles_1, pdfFile, pdfPath, markers, error_1, finalMarkers, byCategory;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🔬 Iniciando construção do catálogo de exames laboratoriais...\n');
                    rawPdfsDir = path_1.default.join(__dirname, '../knowledge/exams/raw-pdfs');
                    outputPath = path_1.default.join(__dirname, '../knowledge/exams/exams_reference.json');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promises_1.default.access(rawPdfsDir)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    console.error("\u274C Diret\u00F3rio n\u00E3o encontrado: ".concat(rawPdfsDir));
                    console.log('📁 Crie o diretório e adicione PDFs antes de executar este script.');
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, promises_1.default.readdir(rawPdfsDir)];
                case 5:
                    files = _b.sent();
                    pdfFiles = files.filter(function (f) { return f.toLowerCase().endsWith('.pdf'); });
                    if (pdfFiles.length === 0) {
                        console.log('⚠️  Nenhum PDF encontrado em:', rawPdfsDir);
                        console.log('📁 Adicione arquivos PDF ao diretório e execute novamente.');
                        process.exit(0);
                    }
                    console.log("\uD83D\uDCDA Encontrados ".concat(pdfFiles.length, " PDFs para processar:\n"));
                    pdfFiles.forEach(function (f) { return console.log("   - ".concat(f)); });
                    console.log('');
                    allMarkers = [];
                    _i = 0, pdfFiles_1 = pdfFiles;
                    _b.label = 6;
                case 6:
                    if (!(_i < pdfFiles_1.length)) return [3 /*break*/, 11];
                    pdfFile = pdfFiles_1[_i];
                    pdfPath = path_1.default.join(rawPdfsDir, pdfFile);
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, processPDF(pdfPath, pdfFile)];
                case 8:
                    markers = _b.sent();
                    allMarkers.push.apply(allMarkers, markers);
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _b.sent();
                    console.error("\u274C Erro ao processar ".concat(pdfFile, ":"), error_1);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11:
                    console.log("\n\uD83D\uDCCA Total de marcadores extra\u00EDdos: ".concat(allMarkers.length));
                    // Agregar marcadores
                    console.log('🔄 Agregando e normalizando marcadores...');
                    finalMarkers = aggregateMarkers(allMarkers);
                    console.log("\u2705 Cat\u00E1logo final: ".concat(finalMarkers.length, " marcadores \u00FAnicos"));
                    // Salvar arquivo JSON
                    return [4 /*yield*/, promises_1.default.writeFile(outputPath, JSON.stringify(finalMarkers, null, 2), 'utf-8')];
                case 12:
                    // Salvar arquivo JSON
                    _b.sent();
                    console.log("\n\uD83D\uDCBE Arquivo salvo em: ".concat(outputPath));
                    console.log('\n✨ Catálogo de exames construído com sucesso!\n');
                    byCategory = finalMarkers.reduce(function (acc, m) {
                        acc[m.category] = (acc[m.category] || 0) + 1;
                        return acc;
                    }, {});
                    console.log('📈 Distribuição por categoria:');
                    Object.entries(byCategory)
                        .sort(function (_a, _b) {
                        var a = _a[1];
                        var b = _b[1];
                        return b - a;
                    })
                        .forEach(function (_a) {
                        var cat = _a[0], count = _a[1];
                        console.log("   ".concat(cat, ": ").concat(count));
                    });
                    console.log('');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
