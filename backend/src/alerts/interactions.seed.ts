import { PrismaClient, AlertSeverity } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * SEED DE INTERAÇÕES MEDICAMENTOSAS
 *
 * Popula banco com interações medicamento-medicamento e medicamento-alimento
 * comuns no Brasil. Fontes: ANVISA, bulas médicas, literatura científica.
 */

// ============================================================================
// INTERAÇÕES MEDICAMENTO-MEDICAMENTO
// ============================================================================

const drugInteractions = [
  // Anticoagulantes + Anti-inflamatórios
  {
    drugA: 'varfarina',
    drugB: 'aspirina',
    severity: AlertSeverity.CRITICAL,
    description:
      'Risco CRÍTICO de sangramento. Varfarina + AAS aumentam significativamente o risco de hemorragias.',
    recommendation:
      'Evitar uso conjunto. Se necessário, monitorar INR rigorosamente e sinais de sangramento.',
    source: 'ANVISA - Bula Varfarina',
  },
  {
    drugA: 'varfarina',
    drugB: 'ibuprofeno',
    severity: AlertSeverity.HIGH,
    description:
      'Risco elevado de sangramento gastrointestinal. Anti-inflamatórios podem potencializar efeito anticoagulante.',
    recommendation:
      'Preferir paracetamol como analgésico. Se inevitável, usar menor dose possível e monitorar.',
    source: 'ANVISA',
  },
  {
    drugA: 'varfarina',
    drugB: 'diclofenaco',
    severity: AlertSeverity.HIGH,
    description:
      'Aumento do risco de sangramento. Interação com anticoagulante oral.',
    recommendation:
      'Evitar uso conjunto. Considerar alternativas como paracetamol.',
    source: 'Bula Diclofenaco',
  },

  // Antibióticos + Contraceptivos
  {
    drugA: 'amoxicilina',
    drugB: 'anticoncepcional oral',
    severity: AlertSeverity.MEDIUM,
    description:
      'Antibióticos podem reduzir eficácia de contraceptivos orais, aumentando risco de gravidez indesejada.',
    recommendation:
      'Usar método contraceptivo adicional (preservativo) durante tratamento e 7 dias após.',
    source: 'ANVISA - Bula Amoxicilina',
  },
  {
    drugA: 'azitromicina',
    drugB: 'anticoncepcional oral',
    severity: AlertSeverity.MEDIUM,
    description:
      'Possível redução da eficácia contraceptiva durante uso de antibiótico.',
    recommendation: 'Usar método contraceptivo de barreira adicional.',
    source: 'Bula Azitromicina',
  },

  // Antidepressivos + Analgésicos
  {
    drugA: 'fluoxetina',
    drugB: 'tramadol',
    severity: AlertSeverity.HIGH,
    description:
      'Risco de Síndrome Serotoninérgica (confusão, agitação, rigidez muscular, febre). Combinação perigosa.',
    recommendation:
      'Evitar uso conjunto. Se necessário, monitorar rigorosamente sintomas de síndrome serotoninérgica.',
    source: 'ANVISA - Bula Fluoxetina',
  },
  {
    drugA: 'sertralina',
    drugB: 'tramadol',
    severity: AlertSeverity.HIGH,
    description: 'Risco de Síndrome Serotoninérgica. Combinação perigosa.',
    recommendation: 'Evitar uso concomitante. Buscar alternativa analgésica.',
    source: 'Bula Sertralina',
  },

  // Anti-hipertensivos + AINEs
  {
    drugA: 'losartana',
    drugB: 'ibuprofeno',
    severity: AlertSeverity.MEDIUM,
    description:
      'Anti-inflamatórios podem reduzir efeito anti-hipertensivo e aumentar risco de lesão renal.',
    recommendation:
      'Monitorar pressão arterial e função renal. Preferir paracetamol como analgésico.',
    source: 'ANVISA',
  },
  {
    drugA: 'enalapril',
    drugB: 'ibuprofeno',
    severity: AlertSeverity.MEDIUM,
    description:
      'Redução do efeito anti-hipertensivo. Risco de insuficiência renal aguda.',
    recommendation:
      'Evitar uso prolongado de AINEs. Monitorar pressão e função renal.',
    source: 'Bula Enalapril',
  },

  // Antiácidos + Outros medicamentos
  {
    drugA: 'omeprazol',
    drugB: 'clopidogrel',
    severity: AlertSeverity.HIGH,
    description:
      'Omeprazol reduz ativação do Clopidogrel, diminuindo proteção cardiovascular.',
    recommendation:
      'Evitar combinação. Se necessário antiácido, preferir ranitidina ou espaçar administração.',
    source: 'ANVISA - Bula Clopidogrel',
  },
  {
    drugA: 'omeprazol',
    drugB: 'levotiroxina',
    severity: AlertSeverity.MEDIUM,
    description:
      'Omeprazol pode reduzir absorção de levotiroxina, descompensando hipotireoidismo.',
    recommendation:
      'Administrar levotiroxina em jejum, 30min antes do omeprazol. Monitorar TSH.',
    source: 'Bula Levotiroxina',
  },

  // Antidiabéticos
  {
    drugA: 'metformina',
    drugB: 'enalapril',
    severity: AlertSeverity.LOW,
    description:
      'Combinação geralmente segura, mas pode potencializar risco de hipoglicemia leve.',
    recommendation:
      'Monitorar glicemia regularmente, especialmente no início do tratamento.',
    source: 'Bula Metformina',
  },
  {
    drugA: 'insulina',
    drugB: 'propranolol',
    severity: AlertSeverity.MEDIUM,
    description:
      'Beta-bloqueadores podem mascarar sintomas de hipoglicemia (tremor, taquicardia).',
    recommendation:
      'Monitorar glicemia com maior frequência. Atenção a sintomas atípicos de hipoglicemia.',
    source: 'ANVISA',
  },

  // Antibióticos + Anticoagulantes
  {
    drugA: 'ciprofloxacino',
    drugB: 'varfarina',
    severity: AlertSeverity.HIGH,
    description:
      'Ciprofloxacino aumenta efeito anticoagulante, elevando risco de sangramento.',
    recommendation: 'Monitorar INR durante e após tratamento com antibiótico.',
    source: 'Bula Ciprofloxacino',
  },

  // Antifúngicos + Estatinas
  {
    drugA: 'fluconazol',
    drugB: 'sinvastatina',
    severity: AlertSeverity.HIGH,
    description:
      'Risco de rabdomiólise (destruição muscular grave). Fluconazol aumenta níveis de estatina.',
    recommendation:
      'Suspender estatina durante tratamento com fluconazol ou reduzir dose drasticamente.',
    source: 'ANVISA - Bula Sinvastatina',
  },
  {
    drugA: 'fluconazol',
    drugB: 'atorvastatina',
    severity: AlertSeverity.MEDIUM,
    description:
      'Aumento dos níveis de atorvastatina com risco de toxicidade muscular.',
    recommendation:
      'Reduzir dose de atorvastatina ou suspender temporariamente durante uso de fluconazol.',
    source: 'Bula Atorvastatina',
  },

  // Benzodiazepínicos + Álcool (representado como medicamento para fins educacionais)
  {
    drugA: 'diazepam',
    drugB: 'clonazepam',
    severity: AlertSeverity.HIGH,
    description:
      'Uso concomitante de múltiplos benzodiazepínicos aumenta risco de sedação excessiva, depressão respiratória e dependência.',
    recommendation:
      'Evitar politerapia com benzodiazepínicos. Preferir monoterapia.',
    source: 'ANVISA',
  },
]

// ============================================================================
// INTERAÇÕES MEDICAMENTO-ALIMENTO
// ============================================================================

const drugFoodInteractions = [
  // Antibióticos
  {
    drugName: 'tetraciclina',
    foodName: 'leite e derivados',
    severity: AlertSeverity.HIGH,
    description:
      'Cálcio presente no leite forma complexos com tetraciclina, reduzindo absorção em até 80%.',
    recommendation:
      'Tomar tetraciclina com estômago vazio (1h antes ou 2h após refeições). Evitar laticínios 2h antes/depois.',
    source: 'ANVISA - Bula Tetraciclina',
  },
  {
    drugName: 'ciprofloxacino',
    foodName: 'leite e derivados',
    severity: AlertSeverity.MEDIUM,
    description:
      'Produtos lácteos reduzem absorção do antibiótico, diminuindo eficácia.',
    recommendation:
      'Evitar laticínios 2h antes e após tomar ciprofloxacino. Preferir tomar com água.',
    source: 'Bula Ciprofloxacino',
  },

  // Anticoagulantes
  {
    drugName: 'varfarina',
    foodName: 'vegetais verde-escuros (couve, espinafre, brócolis)',
    severity: AlertSeverity.MEDIUM,
    description:
      'Vitamina K presente em vegetais antagoniza efeito da varfarina, podendo reduzir anticoagulação.',
    recommendation:
      'Não eliminar vegetais da dieta, mas manter consumo CONSTANTE. Variações grandes afetam INR.',
    source: 'ANVISA - Bula Varfarina',
  },
  {
    drugName: 'varfarina',
    foodName: 'cranberry (oxicoco)',
    severity: AlertSeverity.HIGH,
    description:
      'Cranberry potencializa efeito anticoagulante, aumentando risco de sangramento.',
    recommendation:
      'Evitar consumo regular de cranberry (suco, cápsulas). Consumo ocasional: informar médico.',
    source: 'Literatura científica',
  },

  // Antihipertensivos
  {
    drugName: 'enalapril',
    foodName: 'alimentos ricos em potássio (banana, laranja, abacate)',
    severity: AlertSeverity.MEDIUM,
    description:
      'IECA aumenta retenção de potássio. Excesso na dieta pode causar hipercalemia (perigosa para coração).',
    recommendation:
      'Moderar consumo de alimentos ricos em potássio. Evitar suplementos de potássio. Monitorar exames.',
    source: 'Bula Enalapril',
  },
  {
    drugName: 'losartana',
    foodName: 'alimentos ricos em potássio',
    severity: AlertSeverity.MEDIUM,
    description:
      'BRA aumenta potássio sérico. Dieta rica em potássio pode levar a hipercalemia.',
    recommendation:
      'Consumo moderado de bananas, abacate, água de coco. Evitar suplementos.',
    source: 'ANVISA',
  },

  // Estatinas
  {
    drugName: 'sinvastatina',
    foodName: 'toranja (grapefruit)',
    severity: AlertSeverity.CRITICAL,
    description:
      'Toranja inibe metabolismo da sinvastatina, aumentando níveis em até 16x. Risco ALTO de rabdomiólise.',
    recommendation:
      'EVITAR COMPLETAMENTE toranja (fruta, suco) durante tratamento com sinvastatina.',
    source: 'ANVISA - Bula Sinvastatina',
  },
  {
    drugName: 'atorvastatina',
    foodName: 'toranja (grapefruit)',
    severity: AlertSeverity.HIGH,
    description:
      'Toranja aumenta níveis de atorvastatina, elevando risco de efeitos adversos musculares.',
    recommendation:
      'Evitar toranja. Se consumir ocasionalmente, informar médico para ajuste de dose.',
    source: 'Bula Atorvastatina',
  },

  // Levotiroxina
  {
    drugName: 'levotiroxina',
    foodName: 'café',
    severity: AlertSeverity.MEDIUM,
    description:
      'Café (e chá preto) reduz absorção de levotiroxina em até 55%.',
    recommendation:
      'Tomar levotiroxina em jejum com água. Aguardar 30-60min para café/alimentos.',
    source: 'Bula Levotiroxina',
  },
  {
    drugName: 'levotiroxina',
    foodName: 'alimentos ricos em fibras',
    severity: AlertSeverity.LOW,
    description:
      'Fibras (aveia, linhaça) podem reduzir ligeiramente absorção do hormônio tireoidiano.',
    recommendation:
      'Tomar levotiroxina em jejum. Café da manhã rico em fibras: aguardar 30-60min.',
    source: 'Literatura médica',
  },
  {
    drugName: 'levotiroxina',
    foodName: 'soja',
    severity: AlertSeverity.MEDIUM,
    description:
      'Produtos de soja podem reduzir absorção de levotiroxina.',
    recommendation:
      'Evitar tomar levotiroxina com leite de soja. Espaçar consumo de soja do medicamento.',
    source: 'ANVISA',
  },

  // Bifosfonatos
  {
    drugName: 'alendronato',
    foodName: 'alimentos e bebidas (exceto água)',
    severity: AlertSeverity.HIGH,
    description:
      'Qualquer alimento reduz drasticamente absorção de alendronato (até 60% menos eficaz).',
    recommendation:
      'Tomar em jejum com copo cheio de ÁGUA. Aguardar 30min antes de comer/beber qualquer coisa.',
    source: 'ANVISA - Bula Alendronato',
  },

  // Antidepressivos IMAO (menos comum hoje, mas importante)
  {
    drugName: 'fenelzina',
    foodName: 'queijos maturados, embutidos, vinho tinto',
    severity: AlertSeverity.CRITICAL,
    description:
      'Tiramina (presente nestes alimentos) + IMAO pode causar crise hipertensiva grave (risco de morte).',
    recommendation:
      'EVITAR queijos maturados, salame, vinho tinto, cerveja, fígado, extrato de levedura.',
    source: 'Literatura médica',
  },

  // Metformina
  {
    drugName: 'metformina',
    foodName: 'álcool',
    severity: AlertSeverity.HIGH,
    description:
      'Álcool + metformina aumenta risco de acidose láctica (complicação grave).',
    recommendation:
      'Evitar consumo excessivo de álcool. Consumo moderado ocasional: informar médico.',
    source: 'ANVISA - Bula Metformina',
  },

  // Antibióticos + Álcool
  {
    drugName: 'metronidazol',
    foodName: 'álcool',
    severity: AlertSeverity.CRITICAL,
    description:
      'Reação tipo dissulfiram: náusea intensa, vômitos, rubor facial, taquicardia. Muito desconfortável.',
    recommendation:
      'EVITAR TOTALMENTE álcool durante tratamento e 48h após última dose.',
    source: 'ANVISA - Bula Metronidazol',
  },
]

// ============================================================================
// FUNÇÃO DE SEED
// ============================================================================

export async function seedInteractions() {
  console.log('🌱 Iniciando seed de interações medicamentosas...')

  try {
    // Limpar interações existentes (apenas em desenvolvimento!)
    if (process.env.NODE_ENV === 'development') {
      await prisma.drugInteraction.deleteMany()
      await prisma.drugFoodInteraction.deleteMany()
      console.log('🗑️  Interações anteriores removidas')
    }

    // Seed de interações medicamento-medicamento
    let count = 0
    for (const interaction of drugInteractions) {
      await prisma.drugInteraction.upsert({
        where: {
          drugA_drugB: {
            drugA: interaction.drugA,
            drugB: interaction.drugB,
          },
        },
        update: interaction,
        create: interaction,
      })
      count++
    }
    console.log(`✅ ${count} interações medicamento-medicamento criadas`)

    // Seed de interações medicamento-alimento
    count = 0
    for (const interaction of drugFoodInteractions) {
      await prisma.drugFoodInteraction.upsert({
        where: {
          drugName_foodName: {
            drugName: interaction.drugName,
            foodName: interaction.foodName,
          },
        },
        update: interaction,
        create: interaction,
      })
      count++
    }
    console.log(`✅ ${count} interações medicamento-alimento criadas`)

    console.log('🎉 Seed de interações concluído com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao fazer seed de interações:', error)
    throw error
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedInteractions()
    .then(() => prisma.$disconnect())
    .catch((error) => {
      console.error(error)
      prisma.$disconnect()
      process.exit(1)
    })
}
