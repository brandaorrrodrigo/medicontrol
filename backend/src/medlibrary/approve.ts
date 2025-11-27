#!/usr/bin/env node

// TODO: medlibrary needs schema migration - models not in current Prisma schema
// ExtractedMedicalFact and MedicalSourceDocument models need to be added to Prisma schema
// This file is disabled until schema is updated

/**
 * SCRIPT DE APROVAÇÃO DE FATOS EXTRAÍDOS (DISABLED)
 *
 * Permite revisar e aprovar fatos extraídos antes de aplicá-los
 * nas tabelas definitivas (DrugInteraction, DrugFoodInteraction, etc.)
 *
 * Uso (will be available after schema migration):
 *   npm run medlibrary:approve
 *   npm run medlibrary:approve -- --auto (aprova automaticamente fatos com evidência alta)
 *   npm run medlibrary:approve -- --apply (aplica fatos aprovados às tabelas finais)
 */

// Placeholder export to prevent import errors
export async function main() {
  console.warn('medlibrary/approve module is disabled - schema migration needed')
  console.warn('Please add ExtractedMedicalFact and MedicalSourceDocument to Prisma schema')
}

export { main as runApprove }
