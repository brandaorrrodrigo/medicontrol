import { z } from 'zod'

export const createMedicationSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
  name: z.string().min(1, 'Nome do medicamento é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  startDate: z.string().datetime('Data de início inválida'),
  endDate: z.string().datetime('Data de término inválida').optional(),
  instructions: z.string().optional(),
  prescribedBy: z.string().optional(),
})

export const updateMedicationSchema = z.object({
  name: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  frequency: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional().nullable(),
  instructions: z.string().optional().nullable(),
  prescribedBy: z.string().optional().nullable(),
  active: z.boolean().optional(),
})

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>
