import { z } from 'zod'

export const uploadExamPdfSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
  examDate: z.string().datetime().optional(),
  examType: z.string().optional(),
  laboratory: z.string().optional(),
  notes: z.string().optional()
})

export type UploadExamPdfInput = z.infer<typeof uploadExamPdfSchema>
