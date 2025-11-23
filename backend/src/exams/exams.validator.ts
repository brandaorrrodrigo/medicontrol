import { z } from 'zod'
import { ExamStatus } from '@prisma/client'

export const createExamSchema = z.object({
  patientId: z.string().uuid(),
  name: z.string().min(1),
  type: z.string().min(1),
  date: z.string().datetime(),
  status: z.nativeEnum(ExamStatus).optional().default(ExamStatus.SCHEDULED),
  result: z.string().optional(),
  doctor: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
})

export const updateExamSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  status: z.nativeEnum(ExamStatus).optional(),
  result: z.string().optional().nullable(),
  doctor: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type CreateExamInput = z.infer<typeof createExamSchema>
export type UpdateExamInput = z.infer<typeof updateExamSchema>
