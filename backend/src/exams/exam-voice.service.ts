import { prisma } from '../database/prisma'
import { examsReferenceService } from './exams-reference.service'
import { createSTTProvider, validateAudioFile } from './voice-stt.provider'
import { parseVoiceTextToExamEntries } from './voice-parser.util'
import { validateAndNormalizeUnit } from './unit-conversion.util'

// ============================================================================
// TIPOS
// ============================================================================

interface VoiceExamResult {
  transcript: string
  exams: Array<{
    examId: string
    examResultId: string
    markerCode: string
    markerName: string
    value: number
    unit: string
    normalizedValue: number
    normalizedUnit: string
    status: string
    interpretation: string
    referenceMin?: number
    referenceMax?: number
    source: string
  }>
  unmatchedSegments: string[]
  processingTime: number
}

// ============================================================================
// CLASSE DO SERVICE
// ============================================================================

export class ExamVoiceService {
  private sttProvider = createSTTProvider()

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
  // PIPELINE COMPLETO DE PROCESSAMENTO DE VOZ
  // ==========================================================================

  async processVoiceExam(
    audioFilePath: string,
    patientId: string,
    userId: string,
    metadata?: {
      date?: string
      laboratory?: string
      notes?: string
    }
  ): Promise<VoiceExamResult> {
    const startTime = Date.now()

    console.log('🎤 Iniciando processamento de exame por voz...')
    console.log(`   Arquivo: ${audioFilePath}`)
    console.log(`   Paciente: ${patientId}`)

    // 1. Validar permissão
    await this.validatePatientAccess(patientId, userId)

    // 2. Validar arquivo de áudio
    console.log('🔍 Validando arquivo de áudio...')
    const validation = await validateAudioFile(audioFilePath)

    if (!validation.isValid) {
      throw new Error(validation.error || 'Arquivo de áudio inválido')
    }

    console.log('✅ Arquivo de áudio válido')

    // 3. Transcrever áudio
    console.log('🎙️ Transcrevendo áudio...')
    let transcript: string

    try {
      transcript = await this.sttProvider.transcribe(audioFilePath)
    } catch (error) {
      console.error('❌ Erro ao transcrever:', error)
      throw new Error('Falha ao transcrever áudio')
    }

    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Transcrição vazia. Verifique se o áudio contém fala audível.')
    }

    console.log('✅ Transcrição concluída')
    console.log(`   Transcrição: "${transcript}"`)

    // 4. Analisar transcrição para extrair exames
    console.log('📊 Analisando transcrição...')
    const parseResult = parseVoiceTextToExamEntries(transcript)

    if (parseResult.entries.length === 0) {
      throw new Error('Nenhum exame reconhecido na fala. Tente mencionar o nome do exame e o valor.')
    }

    console.log(`✅ ${parseResult.entries.length} exame(s) reconhecido(s)`)

    // 5. Obter informações do paciente
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    })

    const patientSex = patient?.gender === 'M' ? 'M' : patient?.gender === 'F' ? 'F' : undefined
    const patientAge = patient?.dateOfBirth
      ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      : undefined

    // 6. Criar exame
    const examDate = metadata?.date ? new Date(metadata.date) : new Date()

    const exam = await prisma.exam.create({
      data: {
        patientId,
        name: 'Exame Laboratorial (Voz)',
        type: 'Exame Laboratorial',
        date: examDate,
        status: 'COMPLETED',
        location: metadata?.laboratory || 'Entrada por Voz',
        notes: metadata?.notes,
        voiceEntry: true,
        source: 'VOICE',
        rawTextExtracted: transcript
      }
    })

    console.log('💾 Exame criado')

    // 7. Processar cada marcador extraído
    const exams: VoiceExamResult['exams'] = []

    for (const entry of parseResult.entries) {
      try {
        console.log(`🔬 Processando ${entry.markerCode}...`)

        // Validar e normalizar unidade
        const unitValidation = validateAndNormalizeUnit(
          entry.markerCode,
          entry.value,
          entry.unit
        )

        const normalizedValue = unitValidation.value
        const normalizedUnit = unitValidation.unit

        if (unitValidation.normalized) {
          console.log(`   Convertido: ${entry.value} ${entry.unit} → ${normalizedValue} ${normalizedUnit}`)
        }

        // Interpretar resultado
        const interpretation = await examsReferenceService.interpretResult(
          entry.markerCode,
          normalizedValue,
          patientSex,
          patientAge
        )

        if (!interpretation) {
          console.log(`   ⚠️ Não foi possível interpretar ${entry.markerCode}`)
          continue
        }

        console.log(`   Status: ${interpretation.status}`)

        // Salvar resultado
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
            confidence: entry.confidence,
            extractionMethod: 'voice',
            rawTextSnippet: entry.rawSegment
          }
        })

        exams.push({
          examId: exam.id,
          examResultId: examResult.id,
          markerCode: interpretation.markerCode,
          markerName: interpretation.markerName,
          value: entry.value,
          unit: entry.unit,
          normalizedValue,
          normalizedUnit,
          status: interpretation.status,
          interpretation: interpretation.interpretationText,
          referenceMin: interpretation.referenceRange?.low,
          referenceMax: interpretation.referenceRange?.high,
          source: 'VOICE'
        })

        console.log(`✅ ${entry.markerCode} salvo`)
      } catch (error) {
        console.error(`❌ Erro ao processar ${entry.markerCode}:`, error)
        // Continuar processando outros marcadores
      }
    }

    const processingTime = Date.now() - startTime

    console.log('✨ Processamento concluído!')
    console.log(`   Tempo total: ${processingTime}ms`)
    console.log(`   Exames salvos: ${exams.length}`)

    return {
      transcript,
      exams,
      unmatchedSegments: parseResult.unmatchedSegments,
      processingTime
    }
  }

  // ==========================================================================
  // LISTAR EXAMES DE VOZ DE UM PACIENTE
  // ==========================================================================

  async listPatientVoiceExams(patientId: string, userId: string) {
    // Verificar permissão
    await this.validatePatientAccess(patientId, userId)

    // Buscar exames
    const exams = await prisma.exam.findMany({
      where: {
        patientId,
        voiceEntry: true
      },
      include: {
        results: {
          select: {
            id: true,
            markerCode: true,
            markerName: true,
            status: true,
            value: true,
            unit: true
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

export const examVoiceService = new ExamVoiceService()
