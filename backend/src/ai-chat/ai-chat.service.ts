import OpenAI from 'openai'
import { prisma } from '../database/prisma'

// ============================================================================
// CONFIGURAÇÃO OPENAI
// ============================================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// ============================================================================
// TIPOS
// ============================================================================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface PatientContext {
  name: string
  age: number
  gender: string
  conditions: string[]
  allergies: string[]
  medications: Array<{
    name: string
    dosage: string
    frequency: string
  }>
  recentExams: Array<{
    markerName: string
    value: number
    unit: string
    status: string
    date: Date
  }>
  criticalAlerts: Array<{
    title: string
    message: string
    severity: string
  }>
  trends: string
}

// ============================================================================
// AI CHAT SERVICE
// ============================================================================

export class AIChatService {
  // ==========================================================================
  // SYSTEM PROMPT
  // ==========================================================================

  private getSystemPrompt(context: PatientContext): string {
    return `Você é o assistente médico virtual do MedicControl, especializado em ajudar pacientes a entender seus exames e cuidar da saúde.

INFORMAÇÕES DO PACIENTE:
- Nome: ${context.name}
- Idade: ${context.age} anos
- Sexo: ${context.gender}
- Condições: ${context.conditions.join(', ') || 'Nenhuma registrada'}
- Alergias: ${context.allergies.join(', ') || 'Nenhuma registrada'}

MEDICAMENTOS ATUAIS:
${context.medications.map(m => `- ${m.name} ${m.dosage} - ${m.frequency}`).join('\n') || '- Nenhum'}

EXAMES RECENTES:
${context.recentExams.slice(0, 5).map(e => `- ${e.markerName}: ${e.value} ${e.unit} (${e.status})`).join('\n') || '- Nenhum'}

ALERTAS:
${context.criticalAlerts.map(a => `- [${a.severity}] ${a.message}`).join('\n') || '- Nenhum'}

DIRETRIZES:
1. Seja empático e acolhedor
2. Use linguagem simples
3. SEMPRE baseie respostas nos dados REAIS acima
4. NUNCA diagnostique - apenas eduque
5. Em casos graves, recomende médico
6. Seja conciso (máx 3 parágrafos)
7. Use emojis moderadamente
8. Termine com pergunta ou ação`
  }

  // ==========================================================================
  // BUSCAR CONTEXTO
  // ==========================================================================

  private async getPatientContext(patientId: string): Promise<PatientContext> {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        medications: {
          where: { active: true },
          take: 5
        },
        exams: {
          take: 2,
          orderBy: { date: 'desc' },
          include: { results: { take: 10 } }
        },
        examAlerts: {
          where: { resolved: false },
          take: 3
        }
      }
    })

    if (!patient) throw new Error('Paciente não encontrado')

    const age = Math.floor(
      (Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )

    const genderMap: Record<string, string> = { M: 'Masculino', F: 'Feminino', O: 'Outro' }

    return {
      name: patient.name,
      age,
      gender: genderMap[patient.gender] || 'Não informado',
      conditions: patient.conditions,
      allergies: patient.allergies,
      medications: patient.medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency
      })),
      recentExams: patient.exams.flatMap(e => e.results).map(r => ({
        markerName: r.markerName,
        value: r.value,
        unit: r.unit,
        status: r.status,
        date: r.createdAt
      })),
      criticalAlerts: patient.examAlerts.map(a => ({
        title: a.title,
        message: a.message,
        severity: a.severity
      })),
      trends: 'Análise de tendências disponível no dashboard'
    }
  }

  // ==========================================================================
  // CHAT COM STREAMING
  // ==========================================================================

  async *chat(
    patientId: string,
    message: string,
    history: ChatMessage[] = []
  ): AsyncGenerator<string> {
    const context = await this.getPatientContext(patientId)

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: this.getSystemPrompt(context) },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ]

    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) yield content
    }
  }

  // ==========================================================================
  // SUGESTÕES
  // ==========================================================================

  async getSuggestedQuestions(patientId: string): Promise<string[]> {
    const context = await this.getPatientContext(patientId)

    const suggestions = [
      'Como estão meus exames recentes?',
      'O que significam meus resultados?'
    ]

    if (context.criticalAlerts.length > 0) {
      suggestions.push('Por que recebi um alerta?')
    }

    if (context.recentExams.length > 0) {
      suggestions.push(`Meu ${context.recentExams[0].markerName} está bom?`)
    }

    return suggestions.slice(0, 4)
  }
}

export const aiChatService = new AIChatService()
