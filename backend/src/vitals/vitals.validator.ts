import { z } from 'zod'
import { VitalSignType } from '@prisma/client'

export const createVitalSignSchema = z.object({
  patientId: z.string().uuid(),
  type: z.nativeEnum(VitalSignType),
  value: z.string().min(1),
  unit: z.string().min(1),
  notes: z.string().optional(),
  recordedBy: z.string().optional(),
  timestamp: z.string().datetime().optional(),
})

export type CreateVitalSignInput = z.infer<typeof createVitalSignSchema>
