"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadExamPdfSchema = void 0;
var zod_1 = require("zod");
exports.uploadExamPdfSchema = zod_1.z.object({
    patientId: zod_1.z.string().uuid('ID do paciente inválido'),
    examDate: zod_1.z.string().datetime().optional(),
    examType: zod_1.z.string().optional(),
    laboratory: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional()
});
