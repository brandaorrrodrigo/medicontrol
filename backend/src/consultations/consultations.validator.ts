import { z } from 'zod'

export const createConsultationSchema = z.object({
  patientId: z.string().uuid(),
  date: z.string().datetime(),
  type: z.enum(['FIRST_VISIT', 'RETURN', 'EMERGENCY', 'ROUTINE', 'URGENT', 'FOLLOW_UP']),
  notes: z.string().optional(),
  duration: z.number().int().positive().optional().default(60),
  diagnosis: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
})

export const updateConsultationSchema = z.object({
  date: z.string().datetime().optional(),
  type: z.enum(['FIRST_VISIT', 'RETURN', 'EMERGENCY', 'ROUTINE', 'URGENT', 'FOLLOW_UP']).optional(),
  notes: z.string().optional().nullable(),
  duration: z.number().int().positive().optional(),
  diagnosis: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
})

export type CreateConsultationInput = z.infer<typeof createConsultationSchema>
export type UpdateConsultationInput = z.infer<typeof updateConsultationSchema>
