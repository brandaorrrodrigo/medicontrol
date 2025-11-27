"use strict";
// TODO: medlibrary needs schema migration - models not in current Prisma schema
// import type { MedicalFactType, AlertSeverity } from '@prisma/client'
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTRACTION_PROMPT_TEMPLATE = void 0;
exports.buildExtractionPrompt = buildExtractionPrompt;
exports.normalizeName = normalizeName;
exports.validateExtractedFact = validateExtractedFact;
// ============================================================================
// PROMPT TEMPLATES
// ============================================================================
exports.EXTRACTION_PROMPT_TEMPLATE = "Voc\u00EA \u00E9 um sistema especializado em extra\u00E7\u00E3o de informa\u00E7\u00F5es farmacol\u00F3gicas.\n\nTAREFA:\nAnalise o texto abaixo e extraia APENAS fatos farmacol\u00F3gicos relevantes sobre medicamentos.\n\nTIPOS DE FATOS A EXTRAIR:\n1. DESIRED_EFFECT - Efeitos terap\u00EAuticos desejados do medicamento\n2. SIDE_EFFECT - Efeitos colaterais comuns ou esperados\n3. SERIOUS_SIDE_EFFECT - Efeitos adversos graves que requerem aten\u00E7\u00E3o m\u00E9dica imediata\n4. DRUG_DRUG_INTERACTION - Intera\u00E7\u00F5es com outros medicamentos\n5. DRUG_FOOD_INTERACTION - Intera\u00E7\u00F5es com alimentos, bebidas ou subst\u00E2ncias\n6. ONSET_TIME - Tempo t\u00EDpico at\u00E9 o medicamento come\u00E7ar a fazer efeito\n7. CONTRAINDICATION - Situa\u00E7\u00F5es em que o medicamento N\u00C3O deve ser usado\n8. DOSAGE_RECOMMENDATION - Recomenda\u00E7\u00F5es sobre dosagem\n\nFORMATO DE RESPOSTA:\nRetorne APENAS um objeto JSON v\u00E1lido no seguinte formato (sem coment\u00E1rios):\n\n{\n  \"facts\": [\n    {\n      \"medicationName\": \"nome do medicamento normalizado em min\u00FAsculas\",\n      \"factType\": \"um dos tipos acima\",\n      \"otherMedicationName\": \"nome do outro medicamento (apenas para DRUG_DRUG_INTERACTION)\",\n      \"foodKey\": \"identificador do alimento (apenas para DRUG_FOOD_INTERACTION, ex: alcool, cafeina, leite)\",\n      \"description\": \"descri\u00E7\u00E3o clara e objetiva do fato\",\n      \"recommendation\": \"recomenda\u00E7\u00E3o cl\u00EDnica (opcional)\",\n      \"severity\": \"LOW | MEDIUM | HIGH | CRITICAL (apenas para intera\u00E7\u00F5es e efeitos adversos)\",\n      \"typicalOnsetHoursMin\": n\u00FAmero m\u00EDnimo de horas (apenas para ONSET_TIME),\n      \"typicalOnsetHoursMax\": n\u00FAmero m\u00E1ximo de horas (apenas para ONSET_TIME),\n      \"evidenceLevel\": \"alta | moderada | baixa | expert_opinion (opcional)\"\n    }\n  ]\n}\n\nREGRAS IMPORTANTES:\n- Extraia apenas informa\u00E7\u00F5es EXPLICITAMENTE mencionadas no texto\n- N\u00C3O invente ou infira informa\u00E7\u00F5es n\u00E3o presentes\n- Use nomes gen\u00E9ricos dos medicamentos (princ\u00EDpio ativo), n\u00E3o nomes comerciais\n- Para intera\u00E7\u00F5es, seja CONSERVADOR: prefira reportar intera\u00E7\u00E3o poss\u00EDvel do que ignorar\n- Normalize nomes de medicamentos para min\u00FAsculas sem acentos\n- Se n\u00E3o houver fatos relevantes, retorne: {\"facts\": []}\n\nTEXTO A ANALISAR:\n{{TEXT}}\n\nResponda APENAS com JSON v\u00E1lido:";
function buildExtractionPrompt(text) {
    return exports.EXTRACTION_PROMPT_TEMPLATE.replace('{{TEXT}}', text);
}
// ============================================================================
// NORMALIZAÇÃO DE NOMES
// ============================================================================
/**
 * Normaliza nome de medicamento ou alimento para comparação
 */
function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^\w\s-]/g, '') // Remove pontuação
        .replace(/\s+/g, ' ') // Remove espaços extras
        .trim();
}
// ============================================================================
// VALIDAÇÃO DE FATOS
// ============================================================================
function validateExtractedFact(fact) {
    if (!fact.medicationName || typeof fact.medicationName !== 'string') {
        return false;
    }
    if (!fact.factType || !Object.values(['DESIRED_EFFECT', 'SIDE_EFFECT', 'SERIOUS_SIDE_EFFECT', 'DRUG_DRUG_INTERACTION', 'DRUG_FOOD_INTERACTION', 'ONSET_TIME', 'CONTRAINDICATION', 'DOSAGE_RECOMMENDATION']).includes(fact.factType)) {
        return false;
    }
    if (!fact.description || typeof fact.description !== 'string') {
        return false;
    }
    // Validações específicas por tipo
    if (fact.factType === 'DRUG_DRUG_INTERACTION' && !fact.otherMedicationName) {
        return false;
    }
    if (fact.factType === 'DRUG_FOOD_INTERACTION' && !fact.foodKey) {
        return false;
    }
    if (fact.factType === 'ONSET_TIME' && (!fact.typicalOnsetHoursMin || !fact.typicalOnsetHoursMax)) {
        return false;
    }
    return true;
}
