// @ts-nocheck
import fs from 'fs/promises'
import path from 'path'
import { prisma } from '../database/prisma'
import { mapToMarkerCode } from './exam-parser.util'
import { extractWithAI, isOllamaAvailable, splitTextIntoChunks } from './llama-extractor.util'
import { examsReferenceService } from './exams-reference.service'
import type { UploadExamPhotoInput } from './exam-photo-upload.validator'
import {
  processExamPhoto,
  validateImageFile,
  type PhotoProcessingResult
} from './exam-photo-parser.util'

// ============================================================================
// TIPOS
// ============================================================================

interface PhotoUploadResult {
  examId: string
  ocrConfidence: number
  imageQuality: string
  processingTime: number
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
  rawOCRText: string
  extractedMarkers: ExtractedMarkerResult[]
  interpretedMarkers: InterpretedMarkerResult[]
  warnings: string[]
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

export class ExamPhotoUploadService {
  // ==========================================================================
  // VALIDAÇÃO DA IMAGEM
  // ==========================================================================

  private async validatePhoto(photoPath: string): Promise<void> {
    console.log('🔍 Validando arquivo de imagem...')

    // Verificar se arquivo existe
    try {
      await fs.access(photoPath)
    } catch {
      throw new Error('Arquivo de imagem não encontrado')
    }

    // Validar formato e dimensões
    const isValid = await validateImageFile(photoPath)
    if (!isValid) {
      throw new Error('Imagem inválida. Use uma foto com pelo menos 200x200 pixels.')
    }

    console.log('✅ Imagem válida')
  }

  // ==========================================================================
  // PIPELINE COMPLETO DE PROCESSAMENTO
  // ==========================================================================

  async processPhotoUpload(
    filePath: string,
    input: UploadExamPhotoInput
  ): Promise<PhotoUploadResult> {
    const errors: string[] = []
    const warnings: string[] = []

    console.log('🚀 Iniciando processamento de foto de exame...')
    console.log(`   Arquivo: ${path.basename(filePath)}`)

    // 1. Validar imagem
    await this.validatePhoto(filePath)

    // 2. Processar foto (pré-processamento + OCR + extração)
    console.log('📸 Processando imagem e executando OCR...')
    const photoResult: PhotoProcessingResult = await processExamPhoto(filePath, {
      autoRotate: input.autoRotate,
      enhanceContrast: input.enhanceContrast
    })

    // Adicionar warnings do OCR
    warnings.push(...photoResult.ocrResult.warnings)

    let extractedMarkers = photoResult.extractedMarkers

    console.log(`📊 OCR extraiu ${extractedMarkers.length} marcadores`)
    console.log(`   Confiança OCR: ${photoResult.ocrResult.confidence.toFixed(2)}%`)
    console.log(`   Qualidade: ${photoResult.ocrResult.imageQuality}`)

    // 3. Se poucos marcadores foram encontrados, tentar com IA
    if (extractedMarkers.length < 3) {
      console.log('⚠️ Poucos marcadores detectados. Tentando com IA...')

      const aiAvailable = await isOllamaAvailable()
      if (aiAvailable) {
        try {
          const chunks = splitTextIntoChunks(photoResult.cleanedText)
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
        console.log('ℹ️ IA não disponível. Usando apenas OCR.')
        warnings.push('Poucos marcadores detectados. Considere tirar outra foto mais nítida.')
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

    // 6. Salvar no banco de dados
    console.log('💾 Salvando no banco de dados...')

    const examDate = input.examDate ? new Date(input.examDate) : new Date()
    const examType = input.examType || 'Exame Laboratorial (Foto)'
    const laboratory = input.laboratory || 'Não identificado'

    // Salvar imagem processada permanentemente
    const processedImagePath = photoResult.processedImage.processedPath

    const exam = await prisma.exam.create({
      data: {
        patientId: input.patientId,
        name: examType,
        type: examType,
        date: examDate,
        status: 'COMPLETED',
        location: laboratory,
        notes: input.notes,
        photoUploaded: true,
        photoPath: filePath,
        processedPhotoPath: processedImagePath,
        rawTextExtracted: photoResult.cleanedText,
        extractionMethod: 'ocr',
        ocrConfidence: photoResult.ocrResult.confidence,
        imageQuality: photoResult.ocrResult.imageQuality
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
      ocrConfidence: photoResult.ocrResult.confidence,
      imageQuality: photoResult.ocrResult.imageQuality,
      processingTime: photoResult.ocrResult.processingTime,
      extractedMarkersCount: mappedMarkers.length,
      interpretedMarkersCount: interpretedMarkers.length,
      failedMarkers,
      summary,
      rawOCRText: photoResult.rawText.substring(0, 500) + '...', // Truncar
      extractedMarkers: mappedMarkers,
      interpretedMarkers,
      warnings,
      errors
    }
  }

  // ==========================================================================
  // BUSCAR EXAME COM FOTO
  // ==========================================================================

  async getExamWithPhoto(examId: string, userId: string) {
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
  // LISTAR EXAMES COM FOTO DE UM PACIENTE
  // ==========================================================================

  async listPatientPhotoExams(patientId: string, userId: string) {
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
        photoUploaded: true
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

export const examPhotoUploadService = new ExamPhotoUploadService()
