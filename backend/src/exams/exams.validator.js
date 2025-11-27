"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExamSchema = exports.createExamSchema = void 0;
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
exports.createExamSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    type: zod_1.z.string().min(1),
    date: zod_1.z.string().datetime(),
    status: zod_1.z.nativeEnum(client_1.ExamStatus).optional().default(client_1.ExamStatus.SCHEDULED),
    result: zod_1.z.string().optional(),
    doctor: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateExamSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    type: zod_1.z.string().min(1).optional(),
    date: zod_1.z.string().datetime().optional(),
    status: zod_1.z.nativeEnum(client_1.ExamStatus).optional(),
    result: zod_1.z.string().optional().nullable(),
    doctor: zod_1.z.string().optional().nullable(),
    location: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
});
