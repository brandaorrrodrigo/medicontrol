"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAlertSchema = exports.getExamAlertsQuerySchema = exports.getNotificationsQuerySchema = exports.updatePreferencesSchema = void 0;
exports.validateUpdatePreferences = validateUpdatePreferences;
exports.validateGetNotificationsQuery = validateGetNotificationsQuery;
exports.validateGetExamAlertsQuery = validateGetExamAlertsQuery;
exports.validateResolveAlert = validateResolveAlert;
var zod_1 = require("zod");
// ============================================================================
// NOTIFICATIONS VALIDATOR
// ============================================================================
// Schema para atualizar prefer�ncias de notifica��o
exports.updatePreferencesSchema = zod_1.z.object({
    examAlertsEnabled: zod_1.z.boolean().optional(),
    examAlertsEmail: zod_1.z.boolean().optional(),
    examAlertsPush: zod_1.z.boolean().optional(),
    examAlertsCriticalOnly: zod_1.z.boolean().optional(),
    medicationRemindersEnabled: zod_1.z.boolean().optional(),
    medicationRemindersEmail: zod_1.z.boolean().optional(),
    medicationRemindersPush: zod_1.z.boolean().optional(),
    appointmentsEnabled: zod_1.z.boolean().optional(),
    appointmentsEmail: zod_1.z.boolean().optional(),
    appointmentsPush: zod_1.z.boolean().optional(),
    stockAlertsEnabled: zod_1.z.boolean().optional(),
    stockAlertsEmail: zod_1.z.boolean().optional(),
    stockAlertsPush: zod_1.z.boolean().optional(),
    healthInsightsEnabled: zod_1.z.boolean().optional(),
    healthInsightsEmail: zod_1.z.boolean().optional(),
    healthInsightsPush: zod_1.z.boolean().optional(),
    emailDigest: zod_1.z.boolean().optional(),
    emailDigestTime: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    quietHoursEnabled: zod_1.z.boolean().optional(),
    quietHoursStart: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    quietHoursEnd: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
});
function validateUpdatePreferences(data) {
    return exports.updatePreferencesSchema.safeParse(data);
}
// Schema para query de notifica��es
exports.getNotificationsQuerySchema = zod_1.z.object({
    category: zod_1.z.enum([
        'EXAM_ALERT',
        'MEDICATION_REMINDER',
        'APPOINTMENT',
        'STOCK_ALERT',
        'SYSTEM',
        'HEALTH_INSIGHT'
    ]).optional(),
    read: zod_1.z.enum(['true', 'false']).transform(function (v) { return v === 'true'; }).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(function (v) { return parseInt(v, 10); }).optional(),
    offset: zod_1.z.string().regex(/^\d+$/).transform(function (v) { return parseInt(v, 10); }).optional()
});
function validateGetNotificationsQuery(query) {
    return exports.getNotificationsQuerySchema.safeParse(query);
}
// Schema para query de alertas de exame
exports.getExamAlertsQuerySchema = zod_1.z.object({
    severity: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    acknowledged: zod_1.z.enum(['true', 'false']).transform(function (v) { return v === 'true'; }).optional(),
    resolved: zod_1.z.enum(['true', 'false']).transform(function (v) { return v === 'true'; }).optional(),
    limit: zod_1.z.string().regex(/^\d+$/).transform(function (v) { return parseInt(v, 10); }).optional()
});
function validateGetExamAlertsQuery(query) {
    return exports.getExamAlertsQuerySchema.safeParse(query);
}
// Schema para resolver alerta
exports.resolveAlertSchema = zod_1.z.object({
    resolutionNotes: zod_1.z.string().max(1000).optional()
});
function validateResolveAlert(data) {
    return exports.resolveAlertSchema.safeParse(data);
}
