"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMedicationSchema = exports.createMedicationSchema = void 0;
var zod_1 = require("zod");
exports.createMedicationSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid('ID do paciente inválido'),
    name: zod_1.z.string().min(1, 'Nome do medicamento é obrigatório'),
    dosage: zod_1.z.string().min(1, 'Dosagem é obrigatória'),
    frequency: zod_1.z.string().min(1, 'Frequência é obrigatória'),
    startDate: zod_1.z.string().datetime('Data de início inválida'),
    endDate: zod_1.z.string().datetime('Data de término inválida').optional(),
    instructions: zod_1.z.string().optional(),
    prescribedBy: zod_1.z.string().optional(),
});
exports.updateMedicationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    dosage: zod_1.z.string().min(1).optional(),
    frequency: zod_1.z.string().min(1).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional().nullable(),
    instructions: zod_1.z.string().optional().nullable(),
    prescribedBy: zod_1.z.string().optional().nullable(),
    active: zod_1.z.boolean().optional(),
});
