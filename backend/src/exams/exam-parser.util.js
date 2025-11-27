"use strict";
// ============================================================================
// EXAM PDF PARSER - Extração inteligente de marcadores laboratoriais
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractMarkersFromText = extractMarkersFromText;
exports.mapToMarkerCode = mapToMarkerCode;
exports.detectLaboratory = detectLaboratory;
exports.extractExamDate = extractExamDate;
exports.extractPatientName = extractPatientName;
exports.parseExamPDF = parseExamPDF;
// ============================================================================
// PADRÕES DE LABORATÓRIOS CONHECIDOS
// ============================================================================
var LAB_PATTERNS = {
    fleury: /fleury|grupo fleury/i,
    sabin: /sabin|laborat[oó]rio sabin/i,
    dasa: /dasa|laborat[oó]rio dasa/i,
    hermes_pardini: /hermes pardini/i,
    oswaldo_cruz: /oswaldo cruz/i
};
// ============================================================================
// REGEX PATTERNS PARA EXTRAÇÃO
// ============================================================================
// Padrão geral: Nome do exame | Valor | Unidade | Referência
var VALUE_PATTERNS = [
    // Padrão: "Glicose    95  mg/dL  70-99"
    /^(.+?)\s+(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)\s+(<?[\d.,]+ ?[-–] ?>?[\d.,]+)/gm,
    // Padrão: "Glicose: 95 mg/dL (VR: 70-99)"
    /(.+?):\s*(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)\s*(?:\(VR:|Ref:?|Referência:?)\s*([\d.,]+ ?[-–] ?[\d.,]+)/gi,
    // Padrão: "Glicose | 95 | mg/dL | 70-99"
    /(.+?)\s*[|]\s*(\d+(?:[.,]\d+)?)\s*[|]\s*([a-zA-Zμ\/]+)\s*[|]\s*([\d.,]+ ?[-–] ?[\d.,]+)/g,
    // Padrão simples: "Glicose 95 mg/dL"
    /^([A-Z][a-zÀ-ú\s]+)\s+(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)/gm
];
// Padrão para detectar data do exame
var DATE_PATTERNS = [
    /data.*?(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /(\d{4}-\d{2}-\d{2})/
];
// Padrão para detectar nome do paciente
var PATIENT_NAME_PATTERNS = [
    /paciente:?\s*(.+)/i,
    /nome:?\s*(.+)/i
];
// ============================================================================
// NORMALIZAÇÃO DE TEXTO
// ============================================================================
function normalizeText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\t/g, ' ')
        .trim();
}
function normalizeNumber(numStr) {
    return parseFloat(numStr.replace(',', '.'));
}
// ============================================================================
// EXTRAÇÃO DE MARCADORES
// ============================================================================
function extractMarkersFromText(text) {
    var markers = [];
    // Limpar e normalizar texto
    var cleanText = normalizeText(text);
    var lines = cleanText.split('\n').map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 5; });
    // Tentar cada padrão de regex
    for (var _i = 0, VALUE_PATTERNS_1 = VALUE_PATTERNS; _i < VALUE_PATTERNS_1.length; _i++) {
        var pattern = VALUE_PATTERNS_1[_i];
        var matches = cleanText.matchAll(pattern);
        for (var _a = 0, matches_1 = matches; _a < matches_1.length; _a++) {
            var match = matches_1[_a];
            var fullMatch = match[0], name_1 = match[1], value = match[2], unit = match[3], reference = match[4];
            // Validações básicas
            if (!name_1 || !value || !unit)
                continue;
            var rawName = name_1.trim();
            var numValue = normalizeNumber(value);
            // Ignorar linhas que parecem cabeçalhos
            if (rawName.length < 3 || rawName.length > 100)
                continue;
            if (isNaN(numValue))
                continue;
            // Extrair faixa de referência
            var refMin = void 0;
            var refMax = void 0;
            if (reference) {
                var refMatch = reference.match(/([\d.,]+)\s*[-–]\s*([\d.,]+)/);
                if (refMatch) {
                    refMin = normalizeNumber(refMatch[1]);
                    refMax = normalizeNumber(refMatch[2]);
                }
            }
            markers.push({
                rawName: rawName,
                value: numValue,
                unit: unit.trim(),
                referenceRange: reference ? {
                    min: refMin,
                    max: refMax,
                    text: reference
                } : undefined,
                confidence: 0.8, // Boa confiança para regex
                method: 'regex',
                rawSnippet: fullMatch.substring(0, 200)
            });
        }
    }
    // Fallback: Heurística linha por linha
    if (markers.length === 0) {
        markers.push.apply(markers, extractUsingHeuristics(lines));
    }
    // Remover duplicatas
    return deduplicateMarkers(markers);
}
// ============================================================================
// EXTRAÇÃO POR HEURÍSTICAS
// ============================================================================
function extractUsingHeuristics(lines) {
    var markers = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        // Procurar padrão: linha com nome, seguida de linha com valor
        var nameMatch = line.match(/^([A-Z][a-zÀ-ú\s]{3,50})/i);
        if (!nameMatch)
            continue;
        var valueLine = "".concat(line, " ").concat(nextLine);
        var valueMatch = valueLine.match(/(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)/);
        if (valueMatch) {
            var rawName = nameMatch[1].trim();
            var value = normalizeNumber(valueMatch[1]);
            var unit = valueMatch[2];
            // Tentar encontrar referência na mesma linha ou próxima
            var refMatch = valueLine.match(/([\d.,]+)\s*[-–]\s*([\d.,]+)/);
            markers.push({
                rawName: rawName,
                value: value,
                unit: unit,
                referenceRange: refMatch ? {
                    min: normalizeNumber(refMatch[1]),
                    max: normalizeNumber(refMatch[2])
                } : undefined,
                confidence: 0.6, // Média confiança para heurística
                method: 'heuristic',
                rawSnippet: "".concat(line, " ").concat(nextLine).substring(0, 200)
            });
        }
    }
    return markers;
}
// ============================================================================
// MAPEAMENTO INTELIGENTE PARA MARKER CODE
// ============================================================================
var MARKER_NAME_MAP = {
    // Glicemia
    'glicose': 'GLICEMIA_JEJUM',
    'glicemia': 'GLICEMIA_JEJUM',
    'glicose jejum': 'GLICEMIA_JEJUM',
    'hemoglobina glicada': 'HEMOGLOBINA_GLICADA',
    'hba1c': 'HEMOGLOBINA_GLICADA',
    'a1c': 'HEMOGLOBINA_GLICADA',
    // Lipidograma
    'colesterol total': 'COLESTEROL_TOTAL',
    'colesterol': 'COLESTEROL_TOTAL',
    'hdl': 'HDL_COLESTEROL',
    'ldl': 'LDL_COLESTEROL',
    'vldl': 'VLDL_COLESTEROL',
    'triglicerideos': 'TRIGLICERIDEOS',
    'triglicerides': 'TRIGLICERIDEOS',
    // Função Hepática
    'tgo': 'AST_TGO',
    'ast': 'AST_TGO',
    'aspartato': 'AST_TGO',
    'tgp': 'ALT_TGP',
    'alt': 'ALT_TGP',
    'alanina': 'ALT_TGP',
    'gama gt': 'GAMA_GT',
    'ggt': 'GAMA_GT',
    'fosfatase alcalina': 'FOSFATASE_ALCALINA',
    'bilirrubina total': 'BILIRRUBINA_TOTAL',
    'bilirrubina direta': 'BILIRRUBINA_DIRETA',
    'bilirrubina indireta': 'BILIRRUBINA_INDIRETA',
    'albumina': 'ALBUMINA',
    // Função Renal
    'creatinina': 'CREATININA',
    'ureia': 'UREIA',
    'acido urico': 'ACIDO_URICO',
    'uric acid': 'ACIDO_URICO',
    // Hemograma
    'hemoglobina': 'HEMOGLOBINA',
    'hb': 'HEMOGLOBINA',
    'hematocrito': 'HEMATOCRITO',
    'ht': 'HEMATOCRITO',
    'eritrocitos': 'ERITROCITOS',
    'hemacias': 'ERITROCITOS',
    'leucocitos': 'LEUCOCITOS',
    'globulos brancos': 'LEUCOCITOS',
    'plaquetas': 'PLAQUETAS',
    'vcm': 'VCM',
    'hcm': 'HCM',
    'chcm': 'CHCM',
    // Eletrólitos
    'sodio': 'SODIO',
    'potassio': 'POTASSIO',
    'calcio': 'CALCIO',
    'magnesio': 'MAGNESIO',
    // Tireoide
    'tsh': 'TSH',
    't4 livre': 'T4_LIVRE',
    't3 livre': 'T3_LIVRE',
    // Vitaminas
    'vitamina d': 'VITAMINA_D',
    '25 oh vitamina d': 'VITAMINA_D',
    'vitamina b12': 'VITAMINA_B12',
    'acido folico': 'ACIDO_FOLICO',
    // Inflamatórios
    'pcr': 'PROTEINA_C_REATIVA',
    'proteina c reativa': 'PROTEINA_C_REATIVA',
    'vhs': 'VHS',
    'ferritina': 'FERRITINA'
};
function mapToMarkerCode(rawName) {
    var normalized = rawName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    // Busca exata
    if (MARKER_NAME_MAP[normalized]) {
        return MARKER_NAME_MAP[normalized];
    }
    // Busca parcial
    for (var _i = 0, _a = Object.entries(MARKER_NAME_MAP); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], code = _b[1];
        if (normalized.includes(key) || key.includes(normalized)) {
            return code;
        }
    }
    return null;
}
// ============================================================================
// DETECÇÃO DE METADADOS
// ============================================================================
function detectLaboratory(text) {
    for (var _i = 0, _a = Object.entries(LAB_PATTERNS); _i < _a.length; _i++) {
        var _b = _a[_i], lab = _b[0], pattern = _b[1];
        if (pattern.test(text)) {
            return lab;
        }
    }
    return null;
}
function extractExamDate(text) {
    for (var _i = 0, DATE_PATTERNS_1 = DATE_PATTERNS; _i < DATE_PATTERNS_1.length; _i++) {
        var pattern = DATE_PATTERNS_1[_i];
        var match = text.match(pattern);
        if (match) {
            var dateStr = match[1];
            var date = new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }
    return null;
}
function extractPatientName(text) {
    for (var _i = 0, PATIENT_NAME_PATTERNS_1 = PATIENT_NAME_PATTERNS; _i < PATIENT_NAME_PATTERNS_1.length; _i++) {
        var pattern = PATIENT_NAME_PATTERNS_1[_i];
        var match = text.match(pattern);
        if (match) {
            var name_2 = match[1].trim();
            if (name_2.length > 3 && name_2.length < 100) {
                return name_2;
            }
        }
    }
    return null;
}
// ============================================================================
// UTILITÁRIOS
// ============================================================================
function deduplicateMarkers(markers) {
    var seen = new Set();
    var unique = [];
    for (var _i = 0, markers_1 = markers; _i < markers_1.length; _i++) {
        var marker = markers_1[_i];
        var key = "".concat(marker.rawName, "-").concat(marker.value, "-").concat(marker.unit);
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(marker);
        }
    }
    return unique;
}
// ============================================================================
// FUNÇÃO PRINCIPAL DE PARSING
// ============================================================================
function parseExamPDF(rawText) {
    return {
        laboratory: detectLaboratory(rawText),
        examDate: extractExamDate(rawText),
        patientName: extractPatientName(rawText),
        extractedMarkers: extractMarkersFromText(rawText),
        rawText: rawText
    };
}
