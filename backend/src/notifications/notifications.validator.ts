import { z } from 'zod'

// ============================================================================
// NOTIFICATIONS VALIDATOR
// ============================================================================

// Schema para atualizar prefer�ncias de notifica��o
export const updatePreferencesSchema = z.object({
  examAlertsEnabled: z.boolean().optional(),
  examAlertsEmail: z.boolean().optional(),
  examAlertsPush: z.boolean().optional(),
  examAlertsCriticalOnly: z.boolean().optional(),

  medicationRemindersEnabled: z.boolean().optional(),
  medicationRemindersEmail: z.boolean().optional(),
  medicationRemindersPush: z.boolean().optional(),

  appointmentsEnabled: z.boolean().optional(),
  appointmentsEmail: z.boolean().optional(),
  appointmentsPush: z.boolean().optional(),

  stockAlertsEnabled: z.boolean().optional(),
  stockAlertsEmail: z.boolean().optional(),
  stockAlertsPush: z.boolean().optional(),

  healthInsightsEnabled: z.boolean().optional(),
  healthInsightsEmail: z.boolean().optional(),
  healthInsightsPush: z.boolean().optional(),

  emailDigest: z.boolean().optional(),
  emailDigestTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),

  quietHoursEnabled: z.boolean().optional(),
  quietHoursStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  quietHoursEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional()
})

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>

export function validateUpdatePreferences(data: any) {
  return updatePreferencesSchema.safeParse(data)
}

// Schema para query de notifica��es
export const getNotificationsQuerySchema = z.object({
  category: z.enum([
    'EXAM_ALERT',
    'MEDICATION_REMINDER',
    'APPOINTMENT',
    'STOCK_ALERT',
    'SYSTEM',
    'HEALTH_INSIGHT'
  ]).optional(),
  read: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  limit: z.string().regex(/^\d+$/).transform(v => parseInt(v, 10)).optional(),
  offset: z.string().regex(/^\d+$/).transform(v => parseInt(v, 10)).optional()
})

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>

export function validateGetNotificationsQuery(query: any) {
  return getNotificationsQuerySchema.safeParse(query)
}

// Schema para query de alertas de exame
export const getExamAlertsQuerySchema = z.object({
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  acknowledged: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  resolved: z.enum(['true', 'false']).transform(v => v === 'true').optional(),
  limit: z.string().regex(/^\d+$/).transform(v => parseInt(v, 10)).optional()
})

export type GetExamAlertsQuery = z.infer<typeof getExamAlertsQuerySchema>

export function validateGetExamAlertsQuery(query: any) {
  return getExamAlertsQuerySchema.safeParse(query)
}

// Schema para resolver alerta
export const resolveAlertSchema = z.object({
  resolutionNotes: z.string().max(1000).optional()
})

export type ResolveAlertInput = z.infer<typeof resolveAlertSchema>

export function validateResolveAlert(data: any) {
  return resolveAlertSchema.safeParse(data)
}
