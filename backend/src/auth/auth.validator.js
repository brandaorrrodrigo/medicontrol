"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z
        .string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
    role: zod_1.z.nativeEnum(client_1.UserRole),
    // Dados específicos por role
    name: zod_1.z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    phone: zod_1.z.string().optional(),
    // Paciente
    dateOfBirth: zod_1.z.string().optional(),
    gender: zod_1.z.enum(['M', 'F', 'O']).optional(),
    bloodType: zod_1.z.string().optional(),
    // Profissional
    specialty: zod_1.z.string().optional(),
    crm: zod_1.z.string().optional(),
    // Cuidador
    relationship: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'Senha é obrigatória'),
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Token é obrigatório'),
    password: zod_1.z
        .string()
        .min(8, 'Senha deve ter no mínimo 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, 'Refresh token é obrigatório'),
});
