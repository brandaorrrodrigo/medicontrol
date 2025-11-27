import { z } from 'zod'

// ============================================================================
// SCHEMA DE VALIDAÇÃO PARA UPLOAD DE VOZ
// ============================================================================

export const voiceExamUploadSchema = z.object({
  // Identificação do paciente
  patientId: z.string().uuid('ID do paciente inválido'),

  // Metadados opcionais
  date: z.string().datetime('Data inválida').optional(),
  laboratory: z.string().optional(),
  notes: z.string().optional()
})

export type VoiceExamUploadInput = z.infer<typeof voiceExamUploadSchema>
