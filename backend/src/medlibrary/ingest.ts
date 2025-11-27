#!/usr/bin/env node

// TODO: medlibrary needs schema migration - models not in current Prisma schema
// MedicalSourceDocument and ExtractedMedicalFact models need to be added to Prisma schema
// This file is disabled until schema is updated

/**
 * SCRIPT DE INGESTÃO DE EBOOKS FARMACOLÓGICOS (DISABLED)
 *
 * Processa PDFs da pasta medlibrary/original_pdfs/
 * e extrai fatos médicos usando Ollama local.
 *
 * Uso (will be available after schema migration):
 *   npm run medlibrary:scan
 *   npm run medlibrary:scan -- --file="nome_do_arquivo.pdf"
 *   npm run medlibrary:scan -- --reprocess
 */

// Placeholder export to prevent import errors
export async function main() {
  console.warn('medlibrary/ingest module is disabled - schema migration needed')
  console.warn('Please add MedicalSourceDocument and ExtractedMedicalFact to Prisma schema')
}

export { main as runIngest }
