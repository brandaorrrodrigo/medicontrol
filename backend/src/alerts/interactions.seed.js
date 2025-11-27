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
exports.seedInteractions = seedInteractions;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
/**
 * SEED DE INTERAÇÕES MEDICAMENTOSAS
 *
 * Popula banco com interações medicamento-medicamento e medicamento-alimento
 * comuns no Brasil. Fontes: ANVISA, bulas médicas, literatura científica.
 */
// ============================================================================
// INTERAÇÕES MEDICAMENTO-MEDICAMENTO
// ============================================================================
var drugInteractions = [
    // Anticoagulantes + Anti-inflamatórios
    {
        drugA: 'varfarina',
        drugB: 'aspirina',
        severity: client_1.AlertSeverity.CRITICAL,
        description: 'Risco CRÍTICO de sangramento. Varfarina + AAS aumentam significativamente o risco de hemorragias.',
        recommendation: 'Evitar uso conjunto. Se necessário, monitorar INR rigorosamente e sinais de sangramento.',
        source: 'ANVISA - Bula Varfarina',
    },
    {
        drugA: 'varfarina',
        drugB: 'ibuprofeno',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Risco elevado de sangramento gastrointestinal. Anti-inflamatórios podem potencializar efeito anticoagulante.',
        recommendation: 'Preferir paracetamol como analgésico. Se inevitável, usar menor dose possível e monitorar.',
        source: 'ANVISA',
    },
    {
        drugA: 'varfarina',
        drugB: 'diclofenaco',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Aumento do risco de sangramento. Interação com anticoagulante oral.',
        recommendation: 'Evitar uso conjunto. Considerar alternativas como paracetamol.',
        source: 'Bula Diclofenaco',
    },
    // Antibióticos + Contraceptivos
    {
        drugA: 'amoxicilina',
        drugB: 'anticoncepcional oral',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Antibióticos podem reduzir eficácia de contraceptivos orais, aumentando risco de gravidez indesejada.',
        recommendation: 'Usar método contraceptivo adicional (preservativo) durante tratamento e 7 dias após.',
        source: 'ANVISA - Bula Amoxicilina',
    },
    {
        drugA: 'azitromicina',
        drugB: 'anticoncepcional oral',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Possível redução da eficácia contraceptiva durante uso de antibiótico.',
        recommendation: 'Usar método contraceptivo de barreira adicional.',
        source: 'Bula Azitromicina',
    },
    // Antidepressivos + Analgésicos
    {
        drugA: 'fluoxetina',
        drugB: 'tramadol',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Risco de Síndrome Serotoninérgica (confusão, agitação, rigidez muscular, febre). Combinação perigosa.',
        recommendation: 'Evitar uso conjunto. Se necessário, monitorar rigorosamente sintomas de síndrome serotoninérgica.',
        source: 'ANVISA - Bula Fluoxetina',
    },
    {
        drugA: 'sertralina',
        drugB: 'tramadol',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Risco de Síndrome Serotoninérgica. Combinação perigosa.',
        recommendation: 'Evitar uso concomitante. Buscar alternativa analgésica.',
        source: 'Bula Sertralina',
    },
    // Anti-hipertensivos + AINEs
    {
        drugA: 'losartana',
        drugB: 'ibuprofeno',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Anti-inflamatórios podem reduzir efeito anti-hipertensivo e aumentar risco de lesão renal.',
        recommendation: 'Monitorar pressão arterial e função renal. Preferir paracetamol como analgésico.',
        source: 'ANVISA',
    },
    {
        drugA: 'enalapril',
        drugB: 'ibuprofeno',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Redução do efeito anti-hipertensivo. Risco de insuficiência renal aguda.',
        recommendation: 'Evitar uso prolongado de AINEs. Monitorar pressão e função renal.',
        source: 'Bula Enalapril',
    },
    // Antiácidos + Outros medicamentos
    {
        drugA: 'omeprazol',
        drugB: 'clopidogrel',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Omeprazol reduz ativação do Clopidogrel, diminuindo proteção cardiovascular.',
        recommendation: 'Evitar combinação. Se necessário antiácido, preferir ranitidina ou espaçar administração.',
        source: 'ANVISA - Bula Clopidogrel',
    },
    {
        drugA: 'omeprazol',
        drugB: 'levotiroxina',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Omeprazol pode reduzir absorção de levotiroxina, descompensando hipotireoidismo.',
        recommendation: 'Administrar levotiroxina em jejum, 30min antes do omeprazol. Monitorar TSH.',
        source: 'Bula Levotiroxina',
    },
    // Antidiabéticos
    {
        drugA: 'metformina',
        drugB: 'enalapril',
        severity: client_1.AlertSeverity.LOW,
        description: 'Combinação geralmente segura, mas pode potencializar risco de hipoglicemia leve.',
        recommendation: 'Monitorar glicemia regularmente, especialmente no início do tratamento.',
        source: 'Bula Metformina',
    },
    {
        drugA: 'insulina',
        drugB: 'propranolol',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Beta-bloqueadores podem mascarar sintomas de hipoglicemia (tremor, taquicardia).',
        recommendation: 'Monitorar glicemia com maior frequência. Atenção a sintomas atípicos de hipoglicemia.',
        source: 'ANVISA',
    },
    // Antibióticos + Anticoagulantes
    {
        drugA: 'ciprofloxacino',
        drugB: 'varfarina',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Ciprofloxacino aumenta efeito anticoagulante, elevando risco de sangramento.',
        recommendation: 'Monitorar INR durante e após tratamento com antibiótico.',
        source: 'Bula Ciprofloxacino',
    },
    // Antifúngicos + Estatinas
    {
        drugA: 'fluconazol',
        drugB: 'sinvastatina',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Risco de rabdomiólise (destruição muscular grave). Fluconazol aumenta níveis de estatina.',
        recommendation: 'Suspender estatina durante tratamento com fluconazol ou reduzir dose drasticamente.',
        source: 'ANVISA - Bula Sinvastatina',
    },
    {
        drugA: 'fluconazol',
        drugB: 'atorvastatina',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Aumento dos níveis de atorvastatina com risco de toxicidade muscular.',
        recommendation: 'Reduzir dose de atorvastatina ou suspender temporariamente durante uso de fluconazol.',
        source: 'Bula Atorvastatina',
    },
    // Benzodiazepínicos + Álcool (representado como medicamento para fins educacionais)
    {
        drugA: 'diazepam',
        drugB: 'clonazepam',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Uso concomitante de múltiplos benzodiazepínicos aumenta risco de sedação excessiva, depressão respiratória e dependência.',
        recommendation: 'Evitar politerapia com benzodiazepínicos. Preferir monoterapia.',
        source: 'ANVISA',
    },
];
// ============================================================================
// INTERAÇÕES MEDICAMENTO-ALIMENTO
// ============================================================================
var drugFoodInteractions = [
    // Antibióticos
    {
        drugName: 'tetraciclina',
        foodName: 'leite e derivados',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Cálcio presente no leite forma complexos com tetraciclina, reduzindo absorção em até 80%.',
        recommendation: 'Tomar tetraciclina com estômago vazio (1h antes ou 2h após refeições). Evitar laticínios 2h antes/depois.',
        source: 'ANVISA - Bula Tetraciclina',
    },
    {
        drugName: 'ciprofloxacino',
        foodName: 'leite e derivados',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Produtos lácteos reduzem absorção do antibiótico, diminuindo eficácia.',
        recommendation: 'Evitar laticínios 2h antes e após tomar ciprofloxacino. Preferir tomar com água.',
        source: 'Bula Ciprofloxacino',
    },
    // Anticoagulantes
    {
        drugName: 'varfarina',
        foodName: 'vegetais verde-escuros (couve, espinafre, brócolis)',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Vitamina K presente em vegetais antagoniza efeito da varfarina, podendo reduzir anticoagulação.',
        recommendation: 'Não eliminar vegetais da dieta, mas manter consumo CONSTANTE. Variações grandes afetam INR.',
        source: 'ANVISA - Bula Varfarina',
    },
    {
        drugName: 'varfarina',
        foodName: 'cranberry (oxicoco)',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Cranberry potencializa efeito anticoagulante, aumentando risco de sangramento.',
        recommendation: 'Evitar consumo regular de cranberry (suco, cápsulas). Consumo ocasional: informar médico.',
        source: 'Literatura científica',
    },
    // Antihipertensivos
    {
        drugName: 'enalapril',
        foodName: 'alimentos ricos em potássio (banana, laranja, abacate)',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'IECA aumenta retenção de potássio. Excesso na dieta pode causar hipercalemia (perigosa para coração).',
        recommendation: 'Moderar consumo de alimentos ricos em potássio. Evitar suplementos de potássio. Monitorar exames.',
        source: 'Bula Enalapril',
    },
    {
        drugName: 'losartana',
        foodName: 'alimentos ricos em potássio',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'BRA aumenta potássio sérico. Dieta rica em potássio pode levar a hipercalemia.',
        recommendation: 'Consumo moderado de bananas, abacate, água de coco. Evitar suplementos.',
        source: 'ANVISA',
    },
    // Estatinas
    {
        drugName: 'sinvastatina',
        foodName: 'toranja (grapefruit)',
        severity: client_1.AlertSeverity.CRITICAL,
        description: 'Toranja inibe metabolismo da sinvastatina, aumentando níveis em até 16x. Risco ALTO de rabdomiólise.',
        recommendation: 'EVITAR COMPLETAMENTE toranja (fruta, suco) durante tratamento com sinvastatina.',
        source: 'ANVISA - Bula Sinvastatina',
    },
    {
        drugName: 'atorvastatina',
        foodName: 'toranja (grapefruit)',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Toranja aumenta níveis de atorvastatina, elevando risco de efeitos adversos musculares.',
        recommendation: 'Evitar toranja. Se consumir ocasionalmente, informar médico para ajuste de dose.',
        source: 'Bula Atorvastatina',
    },
    // Levotiroxina
    {
        drugName: 'levotiroxina',
        foodName: 'café',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Café (e chá preto) reduz absorção de levotiroxina em até 55%.',
        recommendation: 'Tomar levotiroxina em jejum com água. Aguardar 30-60min para café/alimentos.',
        source: 'Bula Levotiroxina',
    },
    {
        drugName: 'levotiroxina',
        foodName: 'alimentos ricos em fibras',
        severity: client_1.AlertSeverity.LOW,
        description: 'Fibras (aveia, linhaça) podem reduzir ligeiramente absorção do hormônio tireoidiano.',
        recommendation: 'Tomar levotiroxina em jejum. Café da manhã rico em fibras: aguardar 30-60min.',
        source: 'Literatura médica',
    },
    {
        drugName: 'levotiroxina',
        foodName: 'soja',
        severity: client_1.AlertSeverity.MEDIUM,
        description: 'Produtos de soja podem reduzir absorção de levotiroxina.',
        recommendation: 'Evitar tomar levotiroxina com leite de soja. Espaçar consumo de soja do medicamento.',
        source: 'ANVISA',
    },
    // Bifosfonatos
    {
        drugName: 'alendronato',
        foodName: 'alimentos e bebidas (exceto água)',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Qualquer alimento reduz drasticamente absorção de alendronato (até 60% menos eficaz).',
        recommendation: 'Tomar em jejum com copo cheio de ÁGUA. Aguardar 30min antes de comer/beber qualquer coisa.',
        source: 'ANVISA - Bula Alendronato',
    },
    // Antidepressivos IMAO (menos comum hoje, mas importante)
    {
        drugName: 'fenelzina',
        foodName: 'queijos maturados, embutidos, vinho tinto',
        severity: client_1.AlertSeverity.CRITICAL,
        description: 'Tiramina (presente nestes alimentos) + IMAO pode causar crise hipertensiva grave (risco de morte).',
        recommendation: 'EVITAR queijos maturados, salame, vinho tinto, cerveja, fígado, extrato de levedura.',
        source: 'Literatura médica',
    },
    // Metformina
    {
        drugName: 'metformina',
        foodName: 'álcool',
        severity: client_1.AlertSeverity.HIGH,
        description: 'Álcool + metformina aumenta risco de acidose láctica (complicação grave).',
        recommendation: 'Evitar consumo excessivo de álcool. Consumo moderado ocasional: informar médico.',
        source: 'ANVISA - Bula Metformina',
    },
    // Antibióticos + Álcool
    {
        drugName: 'metronidazol',
        foodName: 'álcool',
        severity: client_1.AlertSeverity.CRITICAL,
        description: 'Reação tipo dissulfiram: náusea intensa, vômitos, rubor facial, taquicardia. Muito desconfortável.',
        recommendation: 'EVITAR TOTALMENTE álcool durante tratamento e 48h após última dose.',
        source: 'ANVISA - Bula Metronidazol',
    },
];
// ============================================================================
// FUNÇÃO DE SEED
// ============================================================================
function seedInteractions() {
    return __awaiter(this, void 0, void 0, function () {
        var count, _i, drugInteractions_1, interaction, _a, drugFoodInteractions_1, interaction, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🌱 Iniciando seed de interações medicamentosas...');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 13, , 14]);
                    if (!(process.env.NODE_ENV === 'development')) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.drugInteraction.deleteMany()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, prisma.drugFoodInteraction.deleteMany()];
                case 3:
                    _b.sent();
                    console.log('🗑️  Interações anteriores removidas');
                    _b.label = 4;
                case 4:
                    count = 0;
                    _i = 0, drugInteractions_1 = drugInteractions;
                    _b.label = 5;
                case 5:
                    if (!(_i < drugInteractions_1.length)) return [3 /*break*/, 8];
                    interaction = drugInteractions_1[_i];
                    return [4 /*yield*/, prisma.drugInteraction.upsert({
                            where: {
                                drugA_drugB: {
                                    drugA: interaction.drugA,
                                    drugB: interaction.drugB,
                                },
                            },
                            update: interaction,
                            create: interaction,
                        })];
                case 6:
                    _b.sent();
                    count++;
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log("\u2705 ".concat(count, " intera\u00E7\u00F5es medicamento-medicamento criadas"));
                    // Seed de interações medicamento-alimento
                    count = 0;
                    _a = 0, drugFoodInteractions_1 = drugFoodInteractions;
                    _b.label = 9;
                case 9:
                    if (!(_a < drugFoodInteractions_1.length)) return [3 /*break*/, 12];
                    interaction = drugFoodInteractions_1[_a];
                    return [4 /*yield*/, prisma.drugFoodInteraction.upsert({
                            where: {
                                drugName_foodName: {
                                    drugName: interaction.drugName,
                                    foodName: interaction.foodName,
                                },
                            },
                            update: interaction,
                            create: interaction,
                        })];
                case 10:
                    _b.sent();
                    count++;
                    _b.label = 11;
                case 11:
                    _a++;
                    return [3 /*break*/, 9];
                case 12:
                    console.log("\u2705 ".concat(count, " intera\u00E7\u00F5es medicamento-alimento criadas"));
                    console.log('🎉 Seed de interações concluído com sucesso!');
                    return [3 /*break*/, 14];
                case 13:
                    error_1 = _b.sent();
                    console.error('❌ Erro ao fazer seed de interações:', error_1);
                    throw error_1;
                case 14: return [2 /*return*/];
            }
        });
    });
}
// Executar seed se chamado diretamente
if (require.main === module) {
    seedInteractions()
        .then(function () { return prisma.$disconnect(); })
        .catch(function (error) {
        console.error(error);
        prisma.$disconnect();
        process.exit(1);
    });
}
