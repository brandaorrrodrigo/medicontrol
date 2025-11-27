import fs from 'fs/promises'
import path from 'path'

// ============================================================================
// TIPOS
// ============================================================================

interface ReferenceRange {
  population: string
  sex: 'M' | 'F' | 'ANY'
  ageRange: string
  low?: number
  high?: number
  notes?: string
}

interface ExamMarker {
  markerCode: string
  markerName: string
  synonyms: string[]
  category: string
  unit: string
  referenceRanges: ReferenceRange[]
  interpretationHints: string[]
  sources: Array<{
    pdf: string
    pages: number[]
  }>
}

// ============================================================================
// MAPEAMENTO DE MARCADORES (Manual inicial - extensível)
// ============================================================================

const MARKER_MAPPINGS: Record<string, {
  code: string
  category: string
  defaultUnit?: string
  synonyms: string[]
}> = {
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
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findMarkerMapping(text: string): typeof MARKER_MAPPINGS[string] | null {
  const normalized = normalizeText(text)

  // Busca exata
  if (MARKER_MAPPINGS[normalized]) {
    return MARKER_MAPPINGS[normalized]
  }

  // Busca por sinônimos
  for (const [key, mapping] of Object.entries(MARKER_MAPPINGS)) {
    if (mapping.synonyms.some(syn => normalizeText(syn) === normalized)) {
      return mapping
    }
  }

  // Busca parcial
  for (const [key, mapping] of Object.entries(MARKER_MAPPINGS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return mapping
    }
  }

  return null
}

function extractNumberFromText(text: string): number | null {
  const match = text.match(/(\d+(?:[.,]\d+)?)/)
  if (match) {
    return parseFloat(match[1].replace(',', '.'))
  }
  return null
}

function extractRangeFromText(text: string): { low?: number; high?: number } | null {
  // Padrões: "70-99", "70 a 99", "70 - 99 mg/dL", "< 100", "> 50"

  // Padrão: número - número
  const rangeMatch = text.match(/(\d+(?:[.,]\d+)?)\s*[-a]\s*(\d+(?:[.,]\d+)?)/i)
  if (rangeMatch) {
    return {
      low: parseFloat(rangeMatch[1].replace(',', '.')),
      high: parseFloat(rangeMatch[2].replace(',', '.'))
    }
  }

  // Padrão: < número
  const lessThanMatch = text.match(/[<≤]\s*(\d+(?:[.,]\d+)?)/i)
  if (lessThanMatch) {
    return {
      high: parseFloat(lessThanMatch[1].replace(',', '.'))
    }
  }

  // Padrão: > número
  const greaterThanMatch = text.match(/[>≥]\s*(\d+(?:[.,]\d+)?)/i)
  if (greaterThanMatch) {
    return {
      low: parseFloat(greaterThanMatch[1].replace(',', '.'))
    }
  }

  return null
}

function extractUnitFromText(text: string): string | null {
  // Padrões comuns: mg/dL, g/dL, U/L, μU/mL, ng/mL, pg/mL, mEq/L, %, etc.
  const unitMatch = text.match(/\b(mg\/dL|g\/dL|U\/L|μU\/mL|uU\/mL|ng\/mL|pg\/mL|mEq\/L|mmol\/L|%|fL|pg|mm\/h|milhões\/mm³|\/mm³)\b/i)
  return unitMatch ? unitMatch[1] : null
}

// ============================================================================
// PROCESSAMENTO DE PDF
// ============================================================================

async function processPDF(pdfPath: string, filename: string): Promise<Partial<ExamMarker>[]> {
  console.log(`📄 Processando: ${filename}`)

  // Usar pdf.js-extract
  const PDFExtract = require('pdf.js-extract').PDFExtract
  const pdfExtract = new PDFExtract()

  const pdfData = await pdfExtract.extract(pdfPath, {})

  // Extrair texto de todas as páginas
  const text = pdfData.pages
    .map((page: any) =>
      page.content
        .map((item: any) => item.str)
        .join(' ')
    )
    .join('\n')

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  const markers: Partial<ExamMarker>[] = []

  // Estratégia: procurar por linhas que parecem conter nomes de exames
  // seguidas de linhas com valores de referência
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const nextLine = i + 1 < lines.length ? lines[i + 1] : ''
    const combinedLine = `${line} ${nextLine}`

    // Tentar identificar marcador
    const mapping = findMarkerMapping(line)
    if (mapping) {
      // Tentar extrair range e unidade da linha atual ou próximas
      const range = extractRangeFromText(combinedLine)
      const unit = extractUnitFromText(combinedLine) || mapping.defaultUnit || ''

      const marker: Partial<ExamMarker> = {
        markerCode: mapping.code,
        markerName: line,
        category: mapping.category,
        unit: unit,
        synonyms: [...mapping.synonyms],
        referenceRanges: range ? [{
          population: 'Adultos',
          sex: 'ANY',
          ageRange: '18-65',
          ...range
        }] : [],
        interpretationHints: [],
        sources: [{
          pdf: filename,
          pages: [Math.floor(i / 50) + 1] // Estimativa grosseira da página
        }]
      }

      markers.push(marker)
    }
  }

  console.log(`  ✓ Encontrados ${markers.length} marcadores`)
  return markers
}

// ============================================================================
// AGREGAÇÃO
// ============================================================================

function aggregateMarkers(allMarkers: Partial<ExamMarker>[]): ExamMarker[] {
  const markerMap = new Map<string, ExamMarker>()

  for (const marker of allMarkers) {
    if (!marker.markerCode) continue

    const existing = markerMap.get(marker.markerCode)

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
      })
    } else {
      // Mesclar com registro existente

      // Adicionar sinônimos únicos
      if (marker.synonyms) {
        for (const syn of marker.synonyms) {
          if (!existing.synonyms.includes(syn)) {
            existing.synonyms.push(syn)
          }
        }
      }

      // Adicionar ranges únicos
      if (marker.referenceRanges) {
        for (const range of marker.referenceRanges) {
          const isDuplicate = existing.referenceRanges.some(r =>
            r.population === range.population &&
            r.sex === range.sex &&
            r.ageRange === range.ageRange &&
            r.low === range.low &&
            r.high === range.high
          )
          if (!isDuplicate) {
            existing.referenceRanges.push(range)
          }
        }
      }

      // Adicionar hints únicos
      if (marker.interpretationHints) {
        for (const hint of marker.interpretationHints) {
          if (!existing.interpretationHints.includes(hint)) {
            existing.interpretationHints.push(hint)
          }
        }
      }

      // Adicionar fontes
      if (marker.sources) {
        for (const source of marker.sources) {
          const existingSource = existing.sources.find(s => s.pdf === source.pdf)
          if (existingSource) {
            // Mesclar páginas
            for (const page of source.pages) {
              if (!existingSource.pages.includes(page)) {
                existingSource.pages.push(page)
              }
            }
          } else {
            existing.sources.push(source)
          }
        }
      }

      // Atualizar unidade se estava vazia
      if (!existing.unit && marker.unit) {
        existing.unit = marker.unit
      }
    }
  }

  return Array.from(markerMap.values()).sort((a, b) =>
    a.markerCode.localeCompare(b.markerCode)
  )
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🔬 Iniciando construção do catálogo de exames laboratoriais...\n')

  const rawPdfsDir = path.join(__dirname, '../knowledge/exams/raw-pdfs')
  const outputPath = path.join(__dirname, '../knowledge/exams/exams_reference.json')

  // Verificar se o diretório existe
  try {
    await fs.access(rawPdfsDir)
  } catch {
    console.error(`❌ Diretório não encontrado: ${rawPdfsDir}`)
    console.log('📁 Crie o diretório e adicione PDFs antes de executar este script.')
    process.exit(1)
  }

  // Listar PDFs
  const files = await fs.readdir(rawPdfsDir)
  const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'))

  if (pdfFiles.length === 0) {
    console.log('⚠️  Nenhum PDF encontrado em:', rawPdfsDir)
    console.log('📁 Adicione arquivos PDF ao diretório e execute novamente.')
    process.exit(0)
  }

  console.log(`📚 Encontrados ${pdfFiles.length} PDFs para processar:\n`)
  pdfFiles.forEach(f => console.log(`   - ${f}`))
  console.log('')

  // Processar cada PDF
  const allMarkers: Partial<ExamMarker>[] = []

  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(rawPdfsDir, pdfFile)
    try {
      const markers = await processPDF(pdfPath, pdfFile)
      allMarkers.push(...markers)
    } catch (error) {
      console.error(`❌ Erro ao processar ${pdfFile}:`, error)
    }
  }

  console.log(`\n📊 Total de marcadores extraídos: ${allMarkers.length}`)

  // Agregar marcadores
  console.log('🔄 Agregando e normalizando marcadores...')
  const finalMarkers = aggregateMarkers(allMarkers)

  console.log(`✅ Catálogo final: ${finalMarkers.length} marcadores únicos`)

  // Salvar arquivo JSON
  await fs.writeFile(
    outputPath,
    JSON.stringify(finalMarkers, null, 2),
    'utf-8'
  )

  console.log(`\n💾 Arquivo salvo em: ${outputPath}`)
  console.log('\n✨ Catálogo de exames construído com sucesso!\n')

  // Estatísticas por categoria
  const byCategory = finalMarkers.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('📈 Distribuição por categoria:')
  Object.entries(byCategory)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`)
    })

  console.log('')
}

main().catch(console.error)
