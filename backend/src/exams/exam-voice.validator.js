"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceExamUploadSchema = void 0;
var zod_1 = require("zod");
// ============================================================================
// SCHEMA DE VALIDAÇÃO PARA UPLOAD DE VOZ
// ============================================================================
exports.voiceExamUploadSchema = zod_1.z.object({
    // Identificação do paciente
    patientId: zod_1.z.string().uuid('ID do paciente inválido'),
    // Metadados opcionais
    date: zod_1.z.string().datetime('Data inválida').optional(),
    laboratory: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional()
});
