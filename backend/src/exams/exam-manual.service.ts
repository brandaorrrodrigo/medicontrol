// @ts-nocheck
import { prisma } from '../database/prisma'
import { examsReferenceService } from './exams-reference.service'
import type { ManualExamEntryInput, ManualExamBatchInput } from './exam-manual.validator'
import {
  validateAndNormalizeUnit,
  validateValueRange,
  MARKER_UNITS,
  PREFERRED_UNITS
} from './unit-conversion.util'

// ============================================================================
// TIPOS
// ============================================================================

interface ManualExamResult {
  examId: string
  examResultId: string
  patientId: string
  markerCode: string
  markerName: string
  value: number
  unit: string
  normalizedValue: number
  normalizedUnit: string
  wasConverted: boolean
  status: string
  interpretation: string
  referenceMin?: number
  referenceMax?: number
  createdAt: Date
  source: string
}

interface ManualExamBatchResult {
  examId: string
  patientId: string
  successCount: number
  failureCount: number
  results: ManualExamResult[]
  errors: Array<{
    markerCode: string
    error: string
  }>
}

// ============================================================================
// CLASSE DO SERVICE
// ============================================================================

export class ExamManualService {
  // ==========================================================================
  // VALIDAR MARCADOR NO CATÁLOGO
  // ==========================================================================

  private async validateMarkerExists(markerCode: string): Promise<void> {
    // Verificar se o marcador existe no catálogo
    const catalog = await examsReferenceService.loadCatalog()
    const marker = catalog.get(markerCode)

    if (!marker) {
      const availableMarkers = Array.from(catalog.keys()).slice(0, 10)
      throw new Error(
        `Marcador "${markerCode}" não encontrado no catálogo. ` +
        `Exemplos de marcadores válidos: ${availableMarkers.join(', ')}...`
      )
    }
  }

  // ==========================================================================
  // VALIDAR PERMISSÃO DE ACESSO AO PACIENTE
  // ==========================================================================

  private async validatePatientAccess(patientId: string, userId: string): Promise<void> {
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
      throw new Error('Você não tem permissão para adicionar exames a este paciente')
    }
  }

  // ==========================================================================
  // PROCESSAR ENTRADA MANUAL INDIVIDUAL
  // ==========================================================================

  async processManualEntry(
    input: ManualExamEntryInput,
    userId: string
  ): Promise<ManualExamResult> {
    console.log('📝 Processando entrada manual de exame...')
    console.log(`   Marcador: ${input.markerCode}`)
    console.log(`   Valor: ${input.value} ${input.unit}`)

    // 1. Validar permissão de acesso ao paciente
    await this.validatePatientAccess(input.patientId, userId)

    // 2. Validar se o marcador existe
    await this.validateMarkerExists(input.markerCode)

    // 3. Validar e normalizar unidade
    console.log('🔄 Validando e normalizando unidade...')
    const unitValidation = validateAndNormalizeUnit(
      input.markerCode,
      input.value,
      input.unit
    )

    if (!unitValidation.isValid) {
      throw new Error(unitValidation.message || 'Unidade inválida')
    }

    const normalizedValue = unitValidation.value
    const normalizedUnit = unitValidation.unit
    const wasConverted = unitValidation.normalized

    if (wasConverted) {
      console.log(`✅ ${unitValidation.message}`)
    } else {
      console.log(`✅ Unidade validada: ${normalizedUnit}`)
    }

    // 4. Validar faixa de valor
    console.log('🔍 Validando faixa de valor...')
    const rangeValidation = validateValueRange(input.markerCode, normalizedValue)

    if (!rangeValidation.isValid) {
      throw new Error(rangeValidation.message || 'Valor fora da faixa razoável')
    }

    console.log('✅ Valor dentro da faixa razoável')

    // 5. Obter informações do paciente para interpretação
    const patient = await prisma.patient.findUnique({
      where: { id: input.patientId }
    })

    const patientSex = patient?.gender === 'M' ? 'M' : patient?.gender === 'F' ? 'F' : undefined
    const patientAge = patient?.dateOfBirth
      ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : undefined

    // 6. Interpretar resultado
    console.log('🔬 Interpretando resultado...')
    const interpretation = await examsReferenceService.interpretResult(
      input.markerCode,
      normalizedValue,
      patientSex,
      patientAge
    )

    if (!interpretation) {
      throw new Error('Não foi possível interpretar o resultado')
    }

    console.log(`✅ Status: ${interpretation.status}`)

    // 7. Criar ou buscar exame
    const examDate = input.date ? new Date(input.date) : new Date()

    // Buscar se já existe um exame manual na mesma data
    let exam = await prisma.exam.findFirst({
      where: {
        patientId: input.patientId,
        date: examDate,
        manualEntry: true
      }
    })

    // Se não existe, criar novo
    if (!exam) {
      console.log('💾 Criando registro de exame...')
      exam = await prisma.exam.create({
        data: {
          patientId: input.patientId,
          name: 'Exame Laboratorial (Manual)',
          type: 'Exame Laboratorial',
          date: examDate,
          status: 'COMPLETED',
          location: input.laboratory || 'Entrada Manual',
          notes: input.notes,
          manualEntry: true,
          source: 'MANUAL'
        }
      })
    }

    // 8. Salvar resultado individual
    console.log('💾 Salvando resultado...')
    const examResult = await prisma.examResult.create({
      data: {
        examId: exam.id,
        markerCode: interpretation.markerCode,
        markerName: interpretation.markerName,
        value: normalizedValue,
        unit: normalizedUnit,
        status: interpretation.status,
        interpretationText: interpretation.interpretationText,
        referenceMin: interpretation.referenceRange?.low,
        referenceMax: interpretation.referenceRange?.high,
        confidence: 1.0, // Entrada manual tem confiança máxima
        extractionMethod: 'manual',
        rawTextSnippet: `Manual: ${input.value} ${input.unit}${wasConverted ? ` → ${normalizedValue} ${normalizedUnit}` : ''}`
      }
    })

    console.log('✨ Entrada manual processada com sucesso!')

    return {
      examId: exam.id,
      examResultId: examResult.id,
      patientId: input.patientId,
      markerCode: interpretation.markerCode,
      markerName: interpretation.markerName,
      value: input.value,
      unit: input.unit,
      normalizedValue,
      normalizedUnit,
      wasConverted,
      status: interpretation.status,
      interpretation: interpretation.interpretationText,
      referenceMin: interpretation.referenceRange?.low,
      referenceMax: interpretation.referenceRange?.high,
      createdAt: examResult.createdAt,
      source: 'MANUAL'
    }
  }

  // ==========================================================================
  // PROCESSAR ENTRADA MÚLTIPLA (BATCH)
  // ==========================================================================

  async processManualBatch(
    input: ManualExamBatchInput,
    userId: string
  ): Promise<ManualExamBatchResult> {
    console.log('📝 Processando entrada manual em lote...')
    console.log(`   Marcadores: ${input.markers.length}`)

    // Validar permissão de acesso ao paciente
    await this.validatePatientAccess(input.patientId, userId)

    // Criar exame único para todos os marcadores
    const examDate = input.date ? new Date(input.date) : new Date()

    const exam = await prisma.exam.create({
      data: {
        patientId: input.patientId,
        name: 'Exame Laboratorial (Manual)',
        type: 'Exame Laboratorial',
        date: examDate,
        status: 'COMPLETED',
        location: input.laboratory || 'Entrada Manual',
        notes: input.notes,
        manualEntry: true,
        source: 'MANUAL'
      }
    })

    const results: ManualExamResult[] = []
    const errors: Array<{ markerCode: string; error: string }> = []

    // Processar cada marcador
    for (const marker of input.markers) {
      try {
        // Validar marcador
        await this.validateMarkerExists(marker.markerCode)

        // Validar e normalizar unidade
        const unitValidation = validateAndNormalizeUnit(
          marker.markerCode,
          marker.value,
          marker.unit
        )

        if (!unitValidation.isValid) {
          throw new Error(unitValidation.message || 'Unidade inválida')
        }

        const normalizedValue = unitValidation.value
        const normalizedUnit = unitValidation.unit
        const wasConverted = unitValidation.normalized

        // Validar faixa
        const rangeValidation = validateValueRange(marker.markerCode, normalizedValue)
        if (!rangeValidation.isValid) {
          throw new Error(rangeValidation.message || 'Valor fora da faixa')
        }

        // Obter sexo e idade do paciente
        const patient = await prisma.patient.findUnique({
          where: { id: input.patientId }
        })

        const patientSex = patient?.gender === 'M' ? 'M' : patient?.gender === 'F' ? 'F' : undefined
        const patientAge = patient?.dateOfBirth
          ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : undefined

        // Interpretar
        const interpretation = await examsReferenceService.interpretResult(
          marker.markerCode,
          normalizedValue,
          patientSex,
          patientAge
        )

        if (!interpretation) {
          throw new Error('Não foi possível interpretar o resultado')
        }

        // Salvar
        const examResult = await prisma.examResult.create({
          data: {
            examId: exam.id,
            markerCode: interpretation.markerCode,
            markerName: interpretation.markerName,
            value: normalizedValue,
            unit: normalizedUnit,
            status: interpretation.status,
            interpretationText: interpretation.interpretationText,
            referenceMin: interpretation.referenceRange?.low,
            referenceMax: interpretation.referenceRange?.high,
            confidence: 1.0,
            extractionMethod: 'manual',
            rawTextSnippet: `Manual: ${marker.value} ${marker.unit}${wasConverted ? ` → ${normalizedValue} ${normalizedUnit}` : ''}`
          }
        })

        results.push({
          examId: exam.id,
          examResultId: examResult.id,
          patientId: input.patientId,
          markerCode: interpretation.markerCode,
          markerName: interpretation.markerName,
          value: marker.value,
          unit: marker.unit,
          normalizedValue,
          normalizedUnit,
          wasConverted,
          status: interpretation.status,
          interpretation: interpretation.interpretationText,
          referenceMin: interpretation.referenceRange?.low,
          referenceMax: interpretation.referenceRange?.high,
          createdAt: examResult.createdAt,
          source: 'MANUAL'
        })

        console.log(`✅ ${marker.markerCode}: processado`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        errors.push({
          markerCode: marker.markerCode,
          error: errorMessage
        })
        console.log(`❌ ${marker.markerCode}: ${errorMessage}`)
      }
    }

    console.log('✨ Entrada em lote concluída!')
    console.log(`   Sucessos: ${results.length}`)
    console.log(`   Falhas: ${errors.length}`)

    return {
      examId: exam.id,
      patientId: input.patientId,
      successCount: results.length,
      failureCount: errors.length,
      results,
      errors
    }
  }

  // ==========================================================================
  // LISTAR MARCADORES DISPONÍVEIS
  // ==========================================================================

  async listAvailableMarkers(): Promise<Array<{
    code: string
    name: string
    category: string
    acceptedUnits: string[]
    preferredUnit: string
  }>> {
    const catalog = await examsReferenceService.loadCatalog()
    const markers: Array<{
      code: string
      name: string
      category: string
      acceptedUnits: string[]
      preferredUnit: string
    }> = []

    for (const [code, marker] of catalog.entries()) {
      markers.push({
        code,
        name: marker.name,
        category: marker.category,
        acceptedUnits: MARKER_UNITS[code] || [],
        preferredUnit: PREFERRED_UNITS[code] || ''
      })
    }

    return markers.sort((a, b) => a.name.localeCompare(b.name))
  }

  // ==========================================================================
  // OBTER INFORMAÇÕES DE UM MARCADOR
  // ==========================================================================

  async getMarkerInfo(markerCode: string): Promise<{
    code: string
    name: string
    category: string
    acceptedUnits: string[]
    preferredUnit: string
    description?: string
  }> {
    const catalog = await examsReferenceService.loadCatalog()
    const marker = catalog.get(markerCode)

    if (!marker) {
      throw new Error(`Marcador "${markerCode}" não encontrado`)
    }

    return {
      code: markerCode,
      name: marker.name,
      category: marker.category,
      acceptedUnits: MARKER_UNITS[markerCode] || [],
      preferredUnit: PREFERRED_UNITS[markerCode] || '',
      description: marker.description
    }
  }
}

export const examManualService = new ExamManualService()
