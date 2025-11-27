// @ts-nocheck
import fs from 'fs/promises'
import path from 'path'
import { prisma } from '../database/prisma'
import { parseExamPDF, mapToMarkerCode, type ExtractedMarker } from './exam-parser.util'
import { extractWithAI, isOllamaAvailable, splitTextIntoChunks } from './llama-extractor.util'
import { examsReferenceService } from './exams-reference.service'
import type { UploadExamPdfInput } from './exam-upload.validator'

// ============================================================================
// TIPOS
// ============================================================================

interface UploadResult {
  examId: string
  extractedMarkersCount: number
  interpretedMarkersCount: number
  failedMarkers: string[]
  summary: {
    total: number
    normal: number
    abnormal: number
    critical: number
    unknown: number
  }
  rawText: string
  extractedMarkers: ExtractedMarkerResult[]
  interpretedMarkers: InterpretedMarkerResult[]
  errors: string[]
}

interface ExtractedMarkerResult {
  rawName: string
  value: number
  unit: string
  markerCode: string | null
  confidence: number
  method: string
}

interface InterpretedMarkerResult {
  markerCode: string
  markerName: string
  value: number
  unit: string
  status: string
  interpretationText: string
  referenceMin?: number
  referenceMax?: number
}

// ============================================================================
// CLASSE DO SERVICE
// ============================================================================

export class ExamUploadService {
  // ==========================================================================
  // EXTRAÇÃO DE TEXTO DO PDF
  // ==========================================================================

  private async extractTextFromPDF(pdfPath: string): Promise<{ text: string; method: 'text' | 'ocr' }> {
    console.log('📄 Extraindo texto do PDF...')

    try {
      // Usar pdf.js-extract para extração de texto
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

      if (text.trim().length > 100) {
        console.log('✅ Texto extraído com sucesso (método: text)')
        return { text, method: 'text' }
      }

      throw new Error('Texto extraído muito curto, pode ser PDF escaneado')
    } catch (error) {
      console.error('❌ Erro na extração de texto:', error)
      // Aqui poderíamos adicionar OCR como fallback
      // return await this.extractWithOCR(pdfPath)
      throw new Error('Falha ao extrair texto do PDF. O arquivo pode estar corrompido ou ser uma imagem escaneada.')
    }
  }

  // ==========================================================================
  // PIPELINE COMPLETO DE PROCESSAMENTO
  // ==========================================================================

  async processPDFUpload(
    filePath: string,
    input: UploadExamPdfInput
  ): Promise<UploadResult> {
    const errors: string[] = []

    // 1. Extrair texto do PDF
    console.log('🔍 Iniciando processamento do PDF...')
    const { text: rawText, method: extractionMethod } = await this.extractTextFromPDF(filePath)

    // 2. Parse com heurísticas e regex
    console.log('🧮 Analisando conteúdo...')
    const parsed = parseExamPDF(rawText)

    let extractedMarkers = parsed.extractedMarkers

    // 3. Se poucos marcadores foram encontrados, tentar com IA
    if (extractedMarkers.length < 3) {
      console.log('⚠️ Poucos marcadores detectados. Tentando com IA...')

      const aiAvailable = await isOllamaAvailable()
      if (aiAvailable) {
        try {
          const chunks = splitTextIntoChunks(rawText)
          const aiMarkers = await extractWithAI(chunks[0]) // Processar primeiro chunk

          // Converter marcadores da IA para formato padrão
          for (const aiMarker of aiMarkers) {
            extractedMarkers.push({
              rawName: aiMarker.markerName,
              value: aiMarker.value,
              unit: aiMarker.unit,
              confidence: aiMarker.confidence,
              method: 'ai',
              rawSnippet: ''
            })
          }

          console.log(`✅ IA extraiu ${aiMarkers.length} marcadores adicionais`)
        } catch (error) {
          console.error('❌ Erro na extração com IA:', error)
          errors.push('Falha ao usar IA para extração adicional')
        }
      } else {
        console.log('ℹ️ IA não disponível. Usando apenas regex/heurísticas.')
      }
    }

    // 4. Mapear para marker codes
    console.log('🗺️ Mapeando marcadores...')
    const mappedMarkers: ExtractedMarkerResult[] = []
    const failedMarkers: string[] = []

    for (const marker of extractedMarkers) {
      const markerCode = mapToMarkerCode(marker.rawName)

      if (markerCode) {
        mappedMarkers.push({
          rawName: marker.rawName,
          value: marker.value,
          unit: marker.unit,
          markerCode,
          confidence: marker.confidence,
          method: marker.method
        })
      } else {
        failedMarkers.push(marker.rawName)
        errors.push(`Marcador não identificado: ${marker.rawName}`)
      }
    }

    console.log(`✅ Mapeados: ${mappedMarkers.length} | Falhas: ${failedMarkers.length}`)

    // 5. Interpretar resultados
    console.log('🔬 Interpretando resultados...')
    const interpretedMarkers: InterpretedMarkerResult[] = []

    // Determinar sexo e idade do paciente
    const patient = await prisma.patient.findUnique({
      where: { id: input.patientId }
    })

    const patientSex = patient?.gender === 'M' ? 'M' : patient?.gender === 'F' ? 'F' : undefined
    const patientAge = patient?.dateOfBirth
      ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : undefined

    for (const marker of mappedMarkers) {
      if (!marker.markerCode) continue

      try {
        const interpretation = await examsReferenceService.interpretResult(
          marker.markerCode,
          marker.value,
          patientSex,
          patientAge
        )

        if (interpretation) {
          interpretedMarkers.push({
            markerCode: interpretation.markerCode,
            markerName: interpretation.markerName,
            value: interpretation.value,
            unit: interpretation.unit,
            status: interpretation.status,
            interpretationText: interpretation.interpretationText,
            referenceMin: interpretation.referenceRange?.low,
            referenceMax: interpretation.referenceRange?.high
          })
        }
      } catch (error) {
        console.error(`❌ Erro ao interpretar ${marker.markerCode}:`, error)
        errors.push(`Erro ao interpretar ${marker.rawName}`)
      }
    }

    // 6. Criar registro no banco de dados
    console.log('💾 Salvando no banco de dados...')

    const examDate = input.examDate ? new Date(input.examDate) : parsed.examDate || new Date()
    const examType = input.examType || 'Exame Laboratorial'
    const laboratory = input.laboratory || parsed.laboratory || 'Não identificado'

    const exam = await prisma.exam.create({
      data: {
        patientId: input.patientId,
        name: examType,
        type: examType,
        date: examDate,
        status: 'COMPLETED',
        location: laboratory,
        notes: input.notes,
        pdfUploaded: true,
        pdfPath: filePath,
        rawTextExtracted: rawText,
        extractionMethod
      }
    })

    // 7. Salvar resultados individuais
    for (const interpreted of interpretedMarkers) {
      await prisma.examResult.create({
        data: {
          examId: exam.id,
          markerCode: interpreted.markerCode,
          markerName: interpreted.markerName,
          value: interpreted.value,
          unit: interpreted.unit,
          status: interpreted.status,
          interpretationText: interpreted.interpretationText,
          referenceMin: interpreted.referenceMin,
          referenceMax: interpreted.referenceMax,
          confidence: mappedMarkers.find(m => m.markerCode === interpreted.markerCode)?.confidence,
          extractionMethod: mappedMarkers.find(m => m.markerCode === interpreted.markerCode)?.method,
          rawTextSnippet: mappedMarkers.find(m => m.markerCode === interpreted.markerCode)?.rawName
        }
      })
    }

    // 8. Calcular sumário
    const summary = {
      total: interpretedMarkers.length,
      normal: interpretedMarkers.filter(m => m.status === 'NORMAL').length,
      abnormal: interpretedMarkers.filter(m => m.status === 'HIGH' || m.status === 'LOW').length,
      critical: interpretedMarkers.filter(m => m.status === 'CRITICAL_HIGH' || m.status === 'CRITICAL_LOW').length,
      unknown: interpretedMarkers.filter(m => m.status === 'UNKNOWN').length
    }

    console.log('✨ Processamento concluído!')
    console.log(`📊 Sumário: ${summary.normal} normal | ${summary.abnormal} alterado | ${summary.critical} crítico`)

    return {
      examId: exam.id,
      extractedMarkersCount: mappedMarkers.length,
      interpretedMarkersCount: interpretedMarkers.length,
      failedMarkers,
      summary,
      rawText: rawText.substring(0, 500) + '...', // Truncar para resposta
      extractedMarkers: mappedMarkers,
      interpretedMarkers,
      errors
    }
  }

  // ==========================================================================
  // BUSCAR EXAME COM RESULTADOS
  // ==========================================================================

  async getExamWithResults(examId: string, userId: string) {
    // Verificar permissão
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        patient: {
          include: {
            user: true,
            caregivers: {
              include: {
                caregiver: {
                  include: { user: true }
                }
              }
            },
            professionals: {
              include: {
                professional: {
                  include: { user: true }
                }
              }
            }
          }
        },
        results: {
          orderBy: { status: 'asc' } // Críticos primeiro
        }
      }
    })

    if (!exam) {
      throw new Error('Exame não encontrado')
    }

    // Verificar permissão
    const isOwner = exam.patient.userId === userId
    const isCaregiver = exam.patient.caregivers.some(
      (pc: any) => pc.caregiver.userId === userId
    )
    const isProfessional = exam.patient.professionals.some(
      (pp: any) => pp.professional.userId === userId
    )

    if (!isOwner && !isCaregiver && !isProfessional) {
      throw new Error('Você não tem permissão para acessar este exame')
    }

    return exam
  }

  // ==========================================================================
  // LISTAR EXAMES DE UM PACIENTE
  // ==========================================================================

  async listPatientExams(patientId: string, userId: string) {
    // Verificar permissão
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        caregivers: {
          include: {
            caregiver: {
              include: { user: true }
            }
          }
        },
        professionals: {
          include: {
            professional: {
              include: { user: true }
            }
          }
        }
      }
    })

    if (!patient) {
      throw new Error('Paciente não encontrado')
    }

    const isOwner = patient.userId === userId
    const isCaregiver = patient.caregivers.some(
      (pc: any) => pc.caregiver.userId === userId
    )
    const isProfessional = patient.professionals.some(
      (pp: any) => pp.professional.userId === userId
    )

    if (!isOwner && !isCaregiver && !isProfessional) {
      throw new Error('Você não tem permissão para acessar os exames deste paciente')
    }

    // Buscar exames
    const exams = await prisma.exam.findMany({
      where: {
        patientId,
        pdfUploaded: true
      },
      include: {
        results: {
          select: {
            id: true,
            markerCode: true,
            markerName: true,
            status: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return exams
  }
}

export const examUploadService = new ExamUploadService()
