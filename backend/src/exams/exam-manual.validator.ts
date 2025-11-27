import { z } from 'zod'

// ============================================================================
// SCHEMA DE VALIDAÇÃO PARA ENTRADA MANUAL DE EXAME
// ============================================================================

export const manualExamEntrySchema = z.object({
  // Identificação do paciente
  patientId: z.string().uuid('ID do paciente inválido'),

  // Identificação do marcador
  markerCode: z.string().min(1, 'Código do marcador é obrigatório'),

  // Valor e unidade
  value: z.number({
    required_error: 'Valor é obrigatório',
    invalid_type_error: 'Valor deve ser numérico'
  }).finite('Valor deve ser um número válido'),

  unit: z.string().min(1, 'Unidade é obrigatória'),

  // Data do exame
  date: z.string().datetime('Data inválida').optional(),

  // Metadados opcionais
  laboratory: z.string().optional(),
  notes: z.string().optional()
})

export type ManualExamEntryInput = z.infer<typeof manualExamEntrySchema>

// ============================================================================
// SCHEMA PARA ENTRADA MÚLTIPLA (BATCH)
// ============================================================================

export const manualExamBatchSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
  date: z.string().datetime('Data inválida').optional(),
  laboratory: z.string().optional(),
  notes: z.string().optional(),

  // Array de marcadores
  markers: z.array(z.object({
    markerCode: z.string().min(1, 'Código do marcador é obrigatório'),
    value: z.number().finite('Valor deve ser um número válido'),
    unit: z.string().min(1, 'Unidade é obrigatória')
  })).min(1, 'Pelo menos um marcador é necessário').max(100, 'Máximo de 100 marcadores por vez')
})

export type ManualExamBatchInput = z.infer<typeof manualExamBatchSchema>
