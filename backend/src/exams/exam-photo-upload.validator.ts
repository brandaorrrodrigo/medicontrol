import { z } from 'zod'

export const uploadExamPhotoSchema = z.object({
  patientId: z.string().uuid('ID do paciente inválido'),
  examDate: z.string().datetime().optional(),
  examType: z.string().optional(),
  laboratory: z.string().optional(),
  notes: z.string().optional(),
  // Opções de processamento de imagem
  autoRotate: z.boolean().optional().default(true),
  enhanceContrast: z.boolean().optional().default(true)
})

export type UploadExamPhotoInput = z.infer<typeof uploadExamPhotoSchema>
