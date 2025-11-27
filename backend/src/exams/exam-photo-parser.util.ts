// ============================================================================
// EXAM PHOTO PARSER - OCR com Tesseract.js para fotos de exames
// ============================================================================

import Tesseract from 'tesseract.js'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

// ============================================================================
// TIPOS
// ============================================================================

export interface OCRResult {
  text: string
  confidence: number
  processingTime: number
  imageQuality: 'excellent' | 'good' | 'fair' | 'poor'
  warnings: string[]
}

export interface ProcessedImage {
  originalPath: string
  processedPath: string
  width: number
  height: number
  format: string
}

// ============================================================================
// CONFIGURAÇÃO DO TESSERACT
// ============================================================================

const TESSERACT_CONFIG = {
  lang: 'por', // Português
  oem: 1, // LSTM OCR Engine Mode (mais preciso)
  psm: 6, // Page Segmentation Mode: assume uniform block of text
}

// ============================================================================
// NORMALIZAÇÃO E PRÉ-PROCESSAMENTO DE IMAGEM
// ============================================================================

export async function preprocessImage(
  inputPath: string,
  options: {
    autoRotate?: boolean
    enhanceContrast?: boolean
  } = {}
): Promise<ProcessedImage> {
  const { autoRotate = true, enhanceContrast = true } = options

  console.log('📸 Pré-processando imagem para OCR...')

  try {
    // Ler informações da imagem original
    const metadata = await sharp(inputPath).metadata()

    // Pipeline de processamento com Sharp
    let pipeline = sharp(inputPath)

    // 1. Auto-rotação baseada em EXIF
    if (autoRotate) {
      pipeline = pipeline.rotate()
    }

    // 2. Redimensionar se muito grande (mantém proporção)
    const MAX_WIDTH = 3000
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // 3. Converter para escala de cinza
    pipeline = pipeline.greyscale()

    // 4. Aumentar contraste
    if (enhanceContrast) {
      pipeline = pipeline.normalize() // Auto-normalização de contraste
    }

    // 5. Aplicar threshold para binarização (preto e branco)
    // Isso melhora muito o OCR
    pipeline = pipeline.threshold(128, {
      greyscale: false
    })

    // 6. Aumentar nitidez
    pipeline = pipeline.sharpen()

    // Gerar nome do arquivo processado
    const ext = path.extname(inputPath)
    const base = path.basename(inputPath, ext)
    const dir = path.dirname(inputPath)
    const processedPath = path.join(dir, `${base}_processed.png`)

    // Salvar imagem processada como PNG
    await pipeline.png().toFile(processedPath)

    // Obter metadados da imagem processada
    const processedMetadata = await sharp(processedPath).metadata()

    console.log('✅ Imagem pré-processada com sucesso')
    console.log(`   Original: ${metadata.width}x${metadata.height}`)
    console.log(`   Processada: ${processedMetadata.width}x${processedMetadata.height}`)

    return {
      originalPath: inputPath,
      processedPath,
      width: processedMetadata.width || 0,
      height: processedMetadata.height || 0,
      format: processedMetadata.format || 'png'
    }
  } catch (error) {
    console.error('❌ Erro ao pré-processar imagem:', error)
    throw new Error('Falha ao processar imagem')
  }
}

// ============================================================================
// OCR COM TESSERACT
// ============================================================================

export async function performOCR(imagePath: string): Promise<OCRResult> {
  console.log('🔍 Executando OCR com Tesseract.js...')

  const startTime = Date.now()
  const warnings: string[] = []

  try {
    // Executar OCR
    const result = await Tesseract.recognize(
      imagePath,
      TESSERACT_CONFIG.lang,
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100)
            if (progress % 25 === 0) {
              console.log(`   OCR: ${progress}%`)
            }
          }
        }
      }
    )

    const processingTime = Date.now() - startTime

    // Configurar parâmetros adicionais
    // Nota: Tesseract.js v4+ usa uma API diferente para parâmetros
    // Os parâmetros são aplicados durante o reconhecimento

    const text = result.data.text
    const confidence = result.data.confidence

    console.log(`✅ OCR concluído em ${processingTime}ms`)
    console.log(`   Confiança: ${confidence.toFixed(2)}%`)
    console.log(`   Texto extraído: ${text.length} caracteres`)

    // Avaliar qualidade da imagem baseado na confiança
    let imageQuality: OCRResult['imageQuality']
    if (confidence >= 90) {
      imageQuality = 'excellent'
    } else if (confidence >= 70) {
      imageQuality = 'good'
    } else if (confidence >= 50) {
      imageQuality = 'fair'
      warnings.push('Confiança do OCR abaixo do ideal. Considere tirar foto com melhor iluminação.')
    } else {
      imageQuality = 'poor'
      warnings.push('Baixa confiança do OCR. Tente tirar outra foto com melhor qualidade.')
    }

    // Validações adicionais
    if (text.length < 50) {
      warnings.push('Pouco texto detectado. Verifique se a foto está nítida e bem enquadrada.')
    }

    return {
      text,
      confidence,
      processingTime,
      imageQuality,
      warnings
    }
  } catch (error) {
    console.error('❌ Erro no OCR:', error)
    throw new Error('Falha ao executar OCR na imagem')
  }
}

// ============================================================================
// LIMPEZA E NORMALIZAÇÃO DO TEXTO OCR
// ============================================================================

export function cleanOCRText(text: string): string {
  let cleaned = text

  // 1. Remover espaços múltiplos
  cleaned = cleaned.replace(/\s+/g, ' ')

  // 2. Aplicar correções em contexto numérico
  cleaned = cleaned.replace(/(\d+)[Oo](\d+)/g, '$10$2') // 1O2 -> 102
  cleaned = cleaned.replace(/[Il](\d+)/g, '1$1') // I23 -> 123
  cleaned = cleaned.replace(/(\d+)[Il]/g, '$11') // 23I -> 231

  // 3. Normalizar quebras de linha
  cleaned = cleaned.replace(/\r\n/g, '\n')
  cleaned = cleaned.replace(/\r/g, '\n')

  // 4. Remover linhas vazias múltiplas
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n')

  // 5. Trim de cada linha
  cleaned = cleaned
    .split('\n')
    .map(line => line.trim())
    .join('\n')

  return cleaned.trim()
}

// ============================================================================
// EXTRAÇÃO DE MARCADORES DO TEXTO OCR
// ============================================================================

interface ExtractedMarkerFromOCR {
  rawName: string
  value: number
  unit: string
  confidence: number
  method: 'ocr-regex' | 'ocr-heuristic'
  rawSnippet: string
}

export function extractMarkersFromOCR(text: string): ExtractedMarkerFromOCR[] {
  const markers: ExtractedMarkerFromOCR[] = []

  // Limpar texto primeiro
  const cleanText = cleanOCRText(text)
  const lines = cleanText.split('\n').filter(l => l.length > 3)

  console.log('🔎 Buscando marcadores no texto OCR...')

  // ========================================================================
  // PADRÕES DE REGEX PARA FOTOS (mais tolerantes que PDF)
  // ========================================================================

  const patterns = [
    // Padrão 1: "Glicose 95 mg/dL"
    /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*)\s+(\d+(?:[.,]\d+)?)\s*([a-zA-Zμ%\/]+)/gi,

    // Padrão 2: "Glicose: 95 mg/dL"
    /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*):\s*(\d+(?:[.,]\d+)?)\s*([a-zA-Zμ%\/]+)/gi,

    // Padrão 3: "Glicose.....95.....mg/dL" (pontos de preenchimento)
    /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*)[.\s]+(\d+(?:[.,]\d+)?)[.\s]*([a-zA-Zμ%\/]+)/gi,

    // Padrão 4: Formato tabular "Glicose | 95 | mg/dL"
    /([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+)*)\s*[|]\s*(\d+(?:[.,]\d+)?)\s*[|]?\s*([a-zA-Zμ%\/]+)/gi
  ]

  // Aplicar cada padrão
  for (const pattern of patterns) {
    const matches = cleanText.matchAll(pattern)

    for (const match of matches) {
      const [fullMatch, name, value, unit] = match

      if (!name || !value || !unit) continue

      const rawName = name.trim()
      const numValue = parseFloat(value.replace(',', '.'))

      // Validações
      if (rawName.length < 3 || rawName.length > 100) continue
      if (isNaN(numValue)) continue
      if (unit.length > 20) continue

      // Evitar duplicatas simples
      const isDuplicate = markers.some(m =>
        m.rawName === rawName &&
        m.value === numValue &&
        m.unit === unit
      )

      if (!isDuplicate) {
        markers.push({
          rawName,
          value: numValue,
          unit: unit.trim(),
          confidence: 0.7, // Confiança média para OCR
          method: 'ocr-regex',
          rawSnippet: fullMatch.substring(0, 200)
        })
      }
    }
  }

  // ========================================================================
  // HEURÍSTICA LINHA POR LINHA (fallback)
  // ========================================================================

  if (markers.length < 3) {
    console.log('⚠️ Poucos marcadores via regex. Tentando heurística...')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const nextLine = i + 1 < lines.length ? lines[i + 1] : ''

      // Procurar nome de marcador (palavra começando com maiúscula)
      const nameMatch = line.match(/^([A-ZÀ-Ú][a-zà-ú]+(?: [A-ZÀ-Úa-zà-ú]+){0,3})/i)
      if (!nameMatch) continue

      // Procurar valor na mesma linha ou próxima
      const searchText = `${line} ${nextLine}`
      const valueMatch = searchText.match(/(\d+(?:[.,]\d+)?)\s*([a-zA-Zμ%\/]+)/)

      if (valueMatch && nameMatch) {
        const rawName = nameMatch[1].trim()
        const value = parseFloat(valueMatch[1].replace(',', '.'))
        const unit = valueMatch[2]

        if (!isNaN(value) && rawName.length >= 3) {
          // Verificar duplicata
          const isDuplicate = markers.some(m =>
            m.rawName === rawName &&
            m.value === value
          )

          if (!isDuplicate) {
            markers.push({
              rawName,
              value,
              unit,
              confidence: 0.5, // Confiança menor para heurística
              method: 'ocr-heuristic',
              rawSnippet: searchText.substring(0, 200)
            })
          }
        }
      }
    }
  }

  console.log(`✅ Encontrados ${markers.length} marcadores`)

  return markers
}

// ============================================================================
// FUNÇÃO PRINCIPAL - PROCESSAR FOTO COMPLETA
// ============================================================================

export interface PhotoProcessingResult {
  ocrResult: OCRResult
  processedImage: ProcessedImage
  extractedMarkers: ExtractedMarkerFromOCR[]
  rawText: string
  cleanedText: string
}

export async function processExamPhoto(
  photoPath: string,
  options: {
    autoRotate?: boolean
    enhanceContrast?: boolean
  } = {}
): Promise<PhotoProcessingResult> {
  console.log('📋 Iniciando processamento completo da foto de exame...')

  // 1. Pré-processar imagem
  const processedImage = await preprocessImage(photoPath, options)

  // 2. Executar OCR
  const ocrResult = await performOCR(processedImage.processedPath)

  // 3. Limpar texto
  const cleanedText = cleanOCRText(ocrResult.text)

  // 4. Extrair marcadores
  const extractedMarkers = extractMarkersFromOCR(cleanedText)

  console.log('✨ Processamento completo da foto concluído!')

  return {
    ocrResult,
    processedImage,
    extractedMarkers,
    rawText: ocrResult.text,
    cleanedText
  }
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

export async function validateImageFile(filePath: string): Promise<boolean> {
  try {
    const metadata = await sharp(filePath).metadata()

    // Validações básicas
    if (!metadata.width || !metadata.height) return false
    if (metadata.width < 200 || metadata.height < 200) return false
    if (metadata.width > 10000 || metadata.height > 10000) return false

    return true
  } catch {
    return false
  }
}

export async function cleanupProcessedImages(originalPath: string): Promise<void> {
  try {
    const ext = path.extname(originalPath)
    const base = path.basename(originalPath, ext)
    const dir = path.dirname(originalPath)
    const processedPath = path.join(dir, `${base}_processed.png`)

    // Remover imagem processada (manter apenas original)
    await fs.unlink(processedPath).catch(() => {})
  } catch {
    // Ignorar erros de limpeza
  }
}
