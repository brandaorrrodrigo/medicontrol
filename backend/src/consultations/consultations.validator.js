"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsultationSchema = exports.createConsultationSchema = void 0;
var zod_1 = require("zod");
exports.createConsultationSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    date: zod_1.z.string().datetime(),
    type: zod_1.z.enum(['FIRST_VISIT', 'RETURN', 'EMERGENCY', 'ROUTINE', 'URGENT', 'FOLLOW_UP']),
    notes: zod_1.z.string().optional(),
    duration: zod_1.z.number().int().positive().optional().default(60),
    diagnosis: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    status: zod_1.z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});
exports.updateConsultationSchema = zod_1.z.object({
    date: zod_1.z.string().datetime().optional(),
    type: zod_1.z.enum(['FIRST_VISIT', 'RETURN', 'EMERGENCY', 'ROUTINE', 'URGENT', 'FOLLOW_UP']).optional(),
    notes: zod_1.z.string().optional().nullable(),
    duration: zod_1.z.number().int().positive().optional(),
    diagnosis: zod_1.z.string().optional().nullable(),
    location: zod_1.z.string().optional().nullable(),
    status: zod_1.z.enum(['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});
