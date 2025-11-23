import { z } from 'zod'

export const createConsultationSchema = z.object({
  patientId: z.string().uuid(),
  date: z.string().datetime(),
  type: z.enum(['ROUTINE', 'URGENT', 'FOLLOW_UP']),
  location: z.string().optional(),
  notes: z.string().optional(),
})

export const updateConsultationSchema = z.object({
  date: z.string().datetime().optional(),
  type: z.enum(['ROUTINE', 'URGENT', 'FOLLOW_UP']).optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>
export type UpdateConsultationInput = z.infer<typeof updateConsultationSchema>
