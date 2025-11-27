"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkProfessionalSchema = exports.linkCaregiverSchema = exports.updatePatientSchema = void 0;
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
exports.updatePatientSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    phone: zod_1.z.string().optional().nullable(),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    gender: zod_1.z.nativeEnum(client_1.Gender).optional(),
    bloodType: zod_1.z.string().optional().nullable(),
    conditions: zod_1.z.array(zod_1.z.string()).optional(),
    allergies: zod_1.z.array(zod_1.z.string()).optional(),
    emergencyContact: zod_1.z.object({
        name: zod_1.z.string(),
        phone: zod_1.z.string(),
        relationship: zod_1.z.string(),
    }).optional().nullable(),
});
exports.linkCaregiverSchema = zod_1.z.object({
    caregiverId: zod_1.z.string().uuid(),
});
exports.linkProfessionalSchema = zod_1.z.object({
    professionalId: zod_1.z.string().uuid(),
});
