import { z } from 'zod'
import { Gender } from '@prisma/client'

export const updatePatientSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.nativeEnum(Gender).optional(),
  bloodType: z.string().optional().nullable(),
  conditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string(),
  }).optional().nullable(),
})

export const linkCaregiverSchema = z.object({
  caregiverId: z.string().uuid(),
})

export const linkProfessionalSchema = z.object({
  professionalId: z.string().uuid(),
})

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
