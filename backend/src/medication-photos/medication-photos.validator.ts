import { z } from 'zod'
import { MedicationPhotoType } from '@prisma/client'

export const uploadMedicationPhotoSchema = z.object({
  medicationId: z.string().uuid('medicationId deve ser um UUID válido'),
  type: z.nativeEnum(MedicationPhotoType, {
    errorMap: () => ({
      message: 'type deve ser MEDICATION_BOX, BOTTLE, LEAFLET ou PRESCRIPTION',
    }),
  }),
  prescriptionId: z.string().uuid().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  takenAt: z.string().datetime().optional().nullable(),
})

export const updateMedicationPhotoSchema = z.object({
  type: z.nativeEnum(MedicationPhotoType).optional(),
  notes: z.string().max(500).optional().nullable(),
  ocrText: z.string().optional().nullable(),
})

export type UploadMedicationPhotoInput = z.infer<typeof uploadMedicationPhotoSchema>
export type UpdateMedicationPhotoInput = z.infer<typeof updateMedicationPhotoSchema>
