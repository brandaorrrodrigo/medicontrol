"use strict";
// ============================================================================
// VOICE PARSER - Extração de marcadores e valores de transcrição de voz
// ============================================================================
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
exports.parseVoiceTextToExamEntries = parseVoiceTextToExamEntries;
var text_to_number_util_1 = require("./text-to-number.util");
var exam_parser_util_1 = require("./exam-parser.util");
// ============================================================================
// PADRÕES DE MARCADORES EM VOZ
// ============================================================================
var VOICE_MARKER_PATTERNS = [
    // Glicemia
    {
        pattern: /\b(?:glicemia|glicose)(?:\s+(?:em\s+)?jejum)?\s*(?:deu|ficou|deu\s+em|esta|estava|foi|resultou|mediu)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:cem|cento|duzentos?|trezentos?|quatrocentos?|quinhentos?|seiscentos?|setecentos?|oitocentos?|novecentos?|mil|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|quinze|dezesseis|dezessete|dezoito|dezenove)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'GLICEMIA_JEJUM',
        unit: 'mg/dL'
    },
    // Hemoglobina Glicada
    {
        pattern: /\b(?:hemoglobina\s+glicada|hba1c|a1c)\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|quinze)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'HEMOGLOBINA_GLICADA',
        unit: '%'
    },
    // Colesterol Total
    {
        pattern: /\bcolesterol\s+total\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:cem|cento|duzentos?|trezentos?|quatrocentos?|quinhentos?)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'COLESTEROL_TOTAL',
        unit: 'mg/dL'
    },
    // HDL
    {
        pattern: /\bhdl\s*(?:colesterol)?\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'HDL_COLESTEROL',
        unit: 'mg/dL'
    },
    // LDL
    {
        pattern: /\bldl\s*(?:colesterol)?\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:cem|cento|duzentos?|trezentos?)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'LDL_COLESTEROL',
        unit: 'mg/dL'
    },
    // Triglicerídeos
    {
        pattern: /\b(?:triglicerideos?|triglicerides?)\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:cem|cento|duzentos?|trezentos?)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'TRIGLICERIDEOS',
        unit: 'mg/dL'
    },
    // TSH
    {
        pattern: /\btsh\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'TSH',
        unit: 'μUI/mL'
    },
    // Hemoglobina
    {
        pattern: /\bhemoglobina\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:dez|onze|doze|treze|quatorze|quinze|dezesseis|dezessete)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'HEMOGLOBINA',
        unit: 'g/dL'
    },
    // Hematócrito
    {
        pattern: /\bhematocrito\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:vinte|trinta|quarenta|cinquenta)\s*(?:e\s*)?)+)\s*(?:por\s*cento|porcento|%)?/gi,
        markerCode: 'HEMATOCRITO',
        unit: '%'
    },
    // Creatinina
    {
        pattern: /\bcreatinina\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:um|dois|tres)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
        markerCode: 'CREATININA',
        unit: 'mg/dL'
    },
    // Ureia
    {
        pattern: /\bureia\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:vinte|trinta|quarenta|cinquenta)\s*(?:e\s*)?)+)/gi,
        markerCode: 'UREIA',
        unit: 'mg/dL'
    }
];
// ============================================================================
// FUNÇÃO PRINCIPAL DE PARSING
// ============================================================================
function parseVoiceTextToExamEntries(text) {
    console.log('🎙️ Analisando transcrição de voz...');
    console.log("   Texto: \"".concat(text, "\""));
    var entries = [];
    var matched = new Set();
    // Normalizar texto
    var normalized = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .trim();
    // Tentar cada padrão
    for (var _i = 0, VOICE_MARKER_PATTERNS_1 = VOICE_MARKER_PATTERNS; _i < VOICE_MARKER_PATTERNS_1.length; _i++) {
        var pattern = VOICE_MARKER_PATTERNS_1[_i];
        var matches = __spreadArray([], normalized.matchAll(pattern.pattern), true);
        for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
            var match = matches_1[_a];
            var fullMatch = match[0];
            var valueStr = match[1];
            // Tentar converter valor
            var value = (0, text_to_number_util_1.textToNumber)(valueStr);
            if (value !== null && value > 0) {
                // Detectar unidade (pode ser mencionada)
                var detectedUnit = (0, text_to_number_util_1.detectUnit)(fullMatch) || pattern.unit;
                entries.push({
                    markerCode: pattern.markerCode,
                    markerName: getMarkerName(pattern.markerCode),
                    value: value,
                    unit: detectedUnit,
                    confidence: 0.8, // Alta confiança para padrões específicos
                    rawSegment: fullMatch
                });
                matched.add(fullMatch);
                console.log("\u2705 Encontrado: ".concat(pattern.markerCode, " = ").concat(value, " ").concat(detectedUnit));
            }
        }
    }
    // Fallback: tentar detectar menções genéricas de marcadores
    if (entries.length === 0) {
        console.log('⚠️ Nenhum padrão específico encontrado. Tentando fallback...');
        var fallbackEntries = fallbackParsing(normalized);
        entries.push.apply(entries, fallbackEntries);
    }
    // Identificar segmentos não reconhecidos
    var unmatchedSegments = findUnmatchedSegments(text, matched);
    console.log("\uD83D\uDCCA Resultado: ".concat(entries.length, " exames encontrados"));
    return {
        entries: entries,
        unmatchedSegments: unmatchedSegments
    };
}
// ============================================================================
// PARSING FALLBACK (GENÉRICO)
// ============================================================================
function fallbackParsing(text) {
    var entries = [];
    // Lista de marcadores comuns para buscar
    var commonMarkers = [
        'glicemia', 'glicose', 'colesterol', 'hdl', 'ldl', 'triglicerides',
        'tsh', 'hemoglobina', 'hematocrito', 'creatinina', 'ureia'
    ];
    // Dividir em sentenças
    var sentences = text.split(/[.,;]/);
    for (var _i = 0, sentences_1 = sentences; _i < sentences_1.length; _i++) {
        var sentence = sentences_1[_i];
        // Verificar se menciona um marcador
        for (var _a = 0, commonMarkers_1 = commonMarkers; _a < commonMarkers_1.length; _a++) {
            var markerName = commonMarkers_1[_a];
            if (sentence.includes(markerName)) {
                // Tentar extrair número
                var numbers = (0, text_to_number_util_1.extractNumbers)(sentence);
                if (numbers.length > 0) {
                    // Pegar primeiro número encontrado
                    var value = numbers[0];
                    // Tentar mapear nome para código
                    var markerCode = (0, exam_parser_util_1.mapToMarkerCode)(markerName);
                    if (markerCode) {
                        // Detectar unidade
                        var unit = (0, text_to_number_util_1.detectUnit)(sentence) || getDefaultUnit(markerCode);
                        entries.push({
                            markerCode: markerCode,
                            markerName: getMarkerName(markerCode),
                            value: value,
                            unit: unit,
                            confidence: 0.5, // Confiança menor para fallback
                            rawSegment: sentence.trim()
                        });
                        console.log("\u26A0\uFE0F Fallback: ".concat(markerCode, " = ").concat(value, " ").concat(unit));
                    }
                }
            }
        }
    }
    return entries;
}
// ============================================================================
// UTILITÁRIOS
// ============================================================================
function getMarkerName(markerCode) {
    var names = {
        'GLICEMIA_JEJUM': 'Glicemia de Jejum',
        'HEMOGLOBINA_GLICADA': 'Hemoglobina Glicada',
        'COLESTEROL_TOTAL': 'Colesterol Total',
        'HDL_COLESTEROL': 'HDL Colesterol',
        'LDL_COLESTEROL': 'LDL Colesterol',
        'TRIGLICERIDEOS': 'Triglicerídeos',
        'TSH': 'TSH',
        'HEMOGLOBINA': 'Hemoglobina',
        'HEMATOCRITO': 'Hematócrito',
        'CREATININA': 'Creatinina',
        'UREIA': 'Ureia'
    };
    return names[markerCode] || markerCode;
}
function getDefaultUnit(markerCode) {
    var units = {
        'GLICEMIA_JEJUM': 'mg/dL',
        'HEMOGLOBINA_GLICADA': '%',
        'COLESTEROL_TOTAL': 'mg/dL',
        'HDL_COLESTEROL': 'mg/dL',
        'LDL_COLESTEROL': 'mg/dL',
        'TRIGLICERIDEOS': 'mg/dL',
        'TSH': 'μUI/mL',
        'HEMOGLOBINA': 'g/dL',
        'HEMATOCRITO': '%',
        'CREATININA': 'mg/dL',
        'UREIA': 'mg/dL'
    };
    return units[markerCode] || 'mg/dL';
}
function findUnmatchedSegments(originalText, matchedSegments) {
    var unmatched = [];
    // Dividir em sentenças
    var sentences = originalText.split(/[.,;!?]/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
    for (var _i = 0, sentences_2 = sentences; _i < sentences_2.length; _i++) {
        var sentence = sentences_2[_i];
        var normalized = sentence.toLowerCase();
        // Verificar se esta sentença foi reconhecida
        var wasMatched = false;
        for (var _a = 0, matchedSegments_1 = matchedSegments; _a < matchedSegments_1.length; _a++) {
            var matched = matchedSegments_1[_a];
            if (normalized.includes(matched.toLowerCase())) {
                wasMatched = true;
                break;
            }
        }
        if (!wasMatched && sentence.length > 5) {
            unmatched.push(sentence);
        }
    }
    return unmatched;
}
