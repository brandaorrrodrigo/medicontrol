// TODO: medlibrary needs schema migration - pdf-parse library not installed
import fs from 'fs/promises'
import path from 'path'
import type { TextChunk, ProcessingOptions } from './types'

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
export async function extractTextFromPDF(
  pdfPath: string
): Promise<{ text: string; pages: number }> {
  try {
    // Lazy load pdf-parse (só carrega quando necessário)
    // Disabled due to missing pdf-parse dependency
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js' as any)

    const dataBuffer = await fs.readFile(pdfPath)
    const data = await pdfParse.default(dataBuffer)

    return {
      text: data.text,
      pages: data.numpages,
    }
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(
        'A biblioteca pdf-parse não está instalada. Execute: npm install pdf-parse'
      )
    }
    throw new Error(`Erro ao extrair texto do PDF: ${error.message}`)
  }
}

// ============================================================================
// DIVISÃO EM CHUNKS
// ============================================================================

/**
 * Divide texto em chunks lógicos para processamento
 */
export function splitIntoChunks(
  text: string,
  options: ProcessingOptions = {}
): TextChunk[] {
  const {
    chunkSize = 3000,
    chunkOverlap = 500,
    skipPages = [],
    onlyPages = [],
  } = options

  const chunks: TextChunk[] = []
  let currentPosition = 0
  let chunkIndex = 0

  // Dividir por parágrafos para respeitar estrutura
  const paragraphs = text.split(/\n\n+/)

  let currentChunk = ''
  let currentPageStart = 0
  let currentPageEnd = 0

  for (const paragraph of paragraphs) {
    // Se adicionar este parágrafo ultrapassar o tamanho do chunk
    if (currentChunk.length + paragraph.length > chunkSize && currentChunk.length > 0) {
      // Salvar chunk atual
      chunks.push({
        text: currentChunk.trim(),
        pageStart: currentPageStart,
        pageEnd: currentPageEnd,
        chunkIndex: chunkIndex++,
        totalChunks: 0, // Será atualizado depois
      })

      // Iniciar novo chunk com sobreposição
      const overlapText = currentChunk.slice(-chunkOverlap)
      currentChunk = overlapText + '\n\n' + paragraph
      currentPageStart = currentPageEnd
    } else {
      currentChunk += (currentChunk.length > 0 ? '\n\n' : '') + paragraph
    }

    // Estimar página atual (aproximação: 3000 caracteres por página)
    currentPageEnd = Math.floor(currentPosition / 3000) + 1
    currentPosition += paragraph.length
  }

  // Adicionar último chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      pageStart: currentPageStart,
      pageEnd: currentPageEnd,
      chunkIndex: chunkIndex++,
      totalChunks: 0,
    })
  }

  // Atualizar totalChunks em todos os chunks
  chunks.forEach((chunk) => {
    chunk.totalChunks = chunks.length
  })

  // Filtrar por páginas se especificado
  let filteredChunks = chunks

  if (onlyPages && onlyPages.length > 0) {
    filteredChunks = chunks.filter((chunk) =>
      onlyPages.some((page) => page >= chunk.pageStart && page <= chunk.pageEnd)
    )
  }

  if (skipPages && skipPages.length > 0) {
    filteredChunks = filteredChunks.filter(
      (chunk) =>
        !skipPages.some((page) => page >= chunk.pageStart && page <= chunk.pageEnd)
    )
  }

  return filteredChunks
}

// ============================================================================
// DETECÇÃO INTELIGENTE DE CHUNKS
// ============================================================================

/**
 * Detecta seções do documento para criar chunks mais inteligentes
 * (opcional, para melhorar qualidade da extração)
 */
export function detectSections(text: string): { title: string; text: string }[] {
  const sections: { title: string; text: string }[] = []

  // Regex para detectar títulos de seção (heurística simples)
  const sectionRegex = /^([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑa-záàâãéèêíïóôõöúçñ\s]{3,50})$/gm

  let lastIndex = 0
  let lastTitle = 'Introdução'

  let match
  while ((match = sectionRegex.exec(text)) !== null) {
    const title = match[1].trim()
    const startIndex = match.index

    // Adicionar seção anterior
    if (startIndex > lastIndex) {
      sections.push({
        title: lastTitle,
        text: text.slice(lastIndex, startIndex).trim(),
      })
    }

    lastTitle = title
    lastIndex = startIndex + title.length
  }

  // Adicionar última seção
  if (lastIndex < text.length) {
    sections.push({
      title: lastTitle,
      text: text.slice(lastIndex).trim(),
    })
  }

  return sections.filter((s) => s.text.length > 100) // Ignorar seções muito pequenas
}

// ============================================================================
// LIMPEZA DE TEXTO
// ============================================================================

/**
 * Limpa e normaliza texto extraído do PDF
 */
export function cleanText(text: string): string {
  return (
    text
      // Remover quebras de linha no meio de palavras
      .replace(/(\w)-\n(\w)/g, '$1$2')
      // Normalizar espaços em branco
      .replace(/[ \t]+/g, ' ')
      // Normalizar quebras de linha múltiplas
      .replace(/\n{3,}/g, '\n\n')
      // Remover espaços no início/fim de linhas
      .replace(/^[ \t]+|[ \t]+$/gm, '')
      .trim()
  )
}

// ============================================================================
// VALIDAÇÃO DE PDF
// ============================================================================

/**
 * Verifica se o arquivo é um PDF válido
 */
export async function isValidPDF(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath)
    if (!stats.isFile()) return false

    // Verificar extensão
    if (!filePath.toLowerCase().endsWith('.pdf')) return false

    // Verificar header do PDF
    const buffer = Buffer.alloc(5)
    const file = await fs.open(filePath, 'r')
    await file.read(buffer, 0, 5, 0)
    await file.close()

    const header = buffer.toString('utf-8')
    return header === '%PDF-'
  } catch {
    return false
  }
}

// ============================================================================
// LISTAGEM DE PDFs
// ============================================================================

/**
 * Lista todos os arquivos PDF em um diretório
 */
export async function listPDFs(directory: string): Promise<string[]> {
  try {
    const files = await fs.readdir(directory)
    const pdfs: string[] = []

    for (const file of files) {
      const filePath = path.join(directory, file)
      if (await isValidPDF(filePath)) {
        pdfs.push(filePath)
      }
    }

    return pdfs.sort()
  } catch (error: any) {
    throw new Error(`Erro ao listar PDFs: ${error.message}`)
  }
}

// ============================================================================
// EXTRAÇÃO DE METADADOS
// ============================================================================

/**
 * Tenta extrair metadados do PDF (título, autor, etc.)
 */
export async function extractPDFMetadata(pdfPath: string): Promise<{
  title?: string
  author?: string
  creationDate?: Date
}> {
  try {
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js' as any)
    const dataBuffer = await fs.readFile(pdfPath)
    const data = await pdfParse.default(dataBuffer)

    return {
      title: data.info?.Title,
      author: data.info?.Author,
      creationDate: data.info?.CreationDate
        ? new Date(data.info.CreationDate)
        : undefined,
    }
  } catch {
    return {}
  }
}
