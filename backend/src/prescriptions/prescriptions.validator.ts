import { z } from 'zod'

export const createPrescriptionSchema = z.object({
  patientId: z.string().uuid(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      medicationName: z.string().min(1),
      dosage: z.string().min(1),
      frequency: z.string().min(1),
      duration: z.string().optional(),
      instructions: z.string().optional(),
    })
  ).min(1, 'Prescrição deve ter pelo menos um medicamento'),
})

export const updatePrescriptionSchema = z.object({
  notes: z.string().optional().nullable(),
})

export const addItemSchema = z.object({
  medicationName: z.string().min(1),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  duration: z.string().optional(),
  instructions: z.string().optional(),
})

export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>
export type AddItemInput = z.infer<typeof addItemSchema>
