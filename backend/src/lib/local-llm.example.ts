/**
 * EXEMPLO DE USO DO OLLAMA LOCAL
 *
 * Este arquivo demonstra como usar a integração com Ollama
 * para extrair informações de textos médicos/farmacológicos.
 *
 * NÃO É UM MÓDULO FUNCIONAL - APENAS EXEMPLO/REFERÊNCIA
 */

import { callLocalLlm, extractJsonFromLlmResponse } from './local-llm'

/**
 * Exemplo 1: Extrair informações de um chunk de texto de eBook farmacológico
 */
export async function extractMedicalFactsFromText(
  textChunk: string
): Promise<Array<{ name: string; dose: string; indication: string }>> {
  const prompt = `
Você é um assistente especializado em farmacologia.
Extraia informações sobre medicamentos do texto abaixo.

Retorne um JSON no formato:
{
  "facts": [
    {
      "name": "Nome do medicamento",
      "dose": "Dose/concentração",
      "indication": "Indicação principal"
    }
  ]
}

Texto:
${textChunk}

Responda APENAS com o JSON, sem texto adicional.
`.trim()

  try {
    const response = await callLocalLlm(prompt, {
      temperature: 0.1, // Baixa temperatura = mais determinístico
    })

    const data = extractJsonFromLlmResponse<{
      facts: Array<{ name: string; dose: string; indication: string }>
    }>(response)

    return data.facts
  } catch (error) {
    console.error('Erro ao extrair fatos médicos:', error)
    return []
  }
}

/**
 * Exemplo 2: Processar PDF de bula médica em chunks
 */
export async function processMedicalLeaflet(
  pdfText: string,
  chunkSize: number = 2000
): Promise<void> {
  // Dividir texto em chunks para não sobrecarregar o LLM
  const chunks: string[] = []
  for (let i = 0; i < pdfText.length; i += chunkSize) {
    chunks.push(pdfText.substring(i, i + chunkSize))
  }

  console.log(`Processando ${chunks.length} chunks...`)

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Chunk ${i + 1}/${chunks.length}`)

    try {
      const facts = await extractMedicalFactsFromText(chunks[i])

      // Aqui você salvaria no banco de dados:
      // await prisma.extractedMedicalFact.createMany({ data: facts })

      console.log(`Extraídos ${facts.length} fatos médicos`)
    } catch (error) {
      console.error(`Erro no chunk ${i + 1}:`, error)
      // Continua para o próximo chunk mesmo se este falhar
    }

    // Pequeno delay para não sobrecarregar o Ollama
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

/**
 * Exemplo 3: Identificar medicamento em foto de receita (OCR + LLM)
 */
export async function identifyMedicationFromOCR(
  ocrText: string
): Promise<{ name: string; dose: string } | null> {
  const prompt = `
Você é um assistente especializado em leitura de receitas médicas.
Do texto OCR abaixo, identifique o nome do medicamento e a dose.

Texto OCR:
${ocrText}

Retorne JSON:
{
  "name": "Nome do medicamento",
  "dose": "Dose prescrita"
}

Se não conseguir identificar, retorne null.
Responda APENAS com o JSON.
`.trim()

  try {
    const response = await callLocalLlm(prompt, { temperature: 0.1 })

    if (response.toLowerCase().includes('null')) {
      return null
    }

    const data = extractJsonFromLlmResponse<{ name: string; dose: string }>(
      response
    )

    return data
  } catch (error) {
    console.error('Erro ao identificar medicamento:', error)
    return null
  }
}

/**
 * Exemplo 4: Análise de interações medicamentosas (futuro)
 */
export async function checkDrugInteractions(
  medications: string[]
): Promise<{ hasInteraction: boolean; warning?: string }> {
  const prompt = `
Você é um farmacêutico especializado.
Analise a lista de medicamentos abaixo e identifique possíveis interações.

Medicamentos:
${medications.join(', ')}

Retorne JSON:
{
  "hasInteraction": true/false,
  "warning": "Descrição da interação se houver"
}

Seja conservador - em caso de dúvida, indique interação possível.
Responda APENAS com o JSON.
`.trim()

  try {
    const response = await callLocalLlm(prompt, { temperature: 0.2 })
    const data = extractJsonFromLlmResponse<{
      hasInteraction: boolean
      warning?: string
    }>(response)

    return data
  } catch (error) {
    console.error('Erro ao verificar interações:', error)
    return {
      hasInteraction: false,
      warning: 'Erro ao verificar. Consulte um profissional.',
    }
  }
}

/**
 * IMPORTANTE:
 *
 * Estes exemplos demonstram o uso do Ollama local.
 * Para implementação real:
 *
 * 1. Crie modelos Prisma adequados (ExtractedMedicalFact, etc)
 * 2. Adicione validação robusta de entrada/saída
 * 3. Implemente retry logic para falhas
 * 4. Adicione logging apropriado
 * 5. Considere processamento em background (queues)
 * 6. Teste com dados reais antes de produção
 *
 * LEMBRE-SE: Tudo roda LOCALMENTE. Sem APIs externas!
 */
