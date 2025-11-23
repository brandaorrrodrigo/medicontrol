import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  role: z.nativeEnum(UserRole),
  // Dados específicos por role
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().optional(),
  // Paciente
  dateOfBirth: z.string().optional(),
  gender: z.enum(['M', 'F', 'O']).optional(),
  bloodType: z.string().optional(),
  // Profissional
  specialty: z.string().optional(),
  crm: z.string().optional(),
  // Cuidador
  relationship: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
