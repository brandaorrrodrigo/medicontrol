# Biblioteca Farmacológica - MedicControl

Sistema de extração e gestão de conhecimento farmacológico a partir de eBooks médicos usando IA local (Ollama).

## Visão Geral

Este módulo permite que o MedicControl extraia automaticamente informações farmacológicas de PDFs médicos e as converta em dados estruturados para alimentar:

- Interações medicamentosas (DrugInteraction)
- Interações com alimentos (DrugFoodInteraction)
- Efeitos desejados e adversos (MedicationEffectTemplate)
- Tempos de início de ação
- Contraindicações e recomendações de dosagem

## Arquitetura

```
medlibrary/
├── original_pdfs/      # PDFs de livros farmacológicos (não versionados)
├── processed_json/     # Resultados da extração em JSON (versionados)
├── logs/               # Logs de processamento (não versionados)
└── README.md          # Esta documentação
```

### Fluxo de Dados

```
PDF → Extração de Texto → Chunking → LLM (Ollama) → ExtractedMedicalFact (staging)
                                                              ↓
                                                       Revisão Humana
                                                              ↓
                                                         Aprovação
                                                              ↓
                                      DrugInteraction / DrugFoodInteraction (produção)
```

## Pré-requisitos

### 1. Ollama Instalado e Rodando

```bash
# Instalar Ollama (se ainda não tiver)
curl -fsSL https://ollama.com/install.sh | sh

# Iniciar servidor Ollama
ollama serve

# Baixar modelo recomendado (em outro terminal)
ollama pull llama3.2:3b
```

### 2. Dependências do Node

```bash
cd backend
npm install
```

Isso instalará automaticamente:
- `pdf-parse` - Extração de texto de PDFs
- Todas as dependências do Prisma e TypeScript

### 3. Banco de Dados

```bash
# Aplicar migrations (cria tabelas MedicalSourceDocument e ExtractedMedicalFact)
npm run prisma:migrate

# Ou apenas fazer push do schema
npm run db:push
```

## Uso

### 1. Adicionar PDFs

Coloque seus eBooks farmacológicos em `medlibrary/original_pdfs/`:

```bash
cp /caminho/para/seu/livro.pdf backend/medlibrary/original_pdfs/
```

Formatos suportados:
- PDFs com texto (não escaneados)
- Idiomas: Português e Inglês
- Tamanho: Qualquer (processamento em chunks)

### 2. Executar Ingestão

#### Processar todos os PDFs pendentes

```bash
npm run medlibrary:scan
```

Este comando:
1. Registra novos PDFs encontrados no banco
2. Extrai texto de cada documento
3. Divide em chunks de ~3000 caracteres
4. Processa cada chunk com Ollama
5. Salva fatos extraídos em `ExtractedMedicalFact`
6. Gera JSON de resultado em `processed_json/`
7. Cria log em `logs/`

#### Processar arquivo específico

```bash
npm run medlibrary:scan -- --file="farmacologia_basica.pdf"
```

#### Reprocessar documentos já processados

```bash
npm run medlibrary:scan -- --reprocess
```

### 3. Revisar e Aprovar Fatos

#### Revisão interativa (recomendado)

```bash
npm run medlibrary:approve
```

Interface interativa:
- Mostra cada fato extraído
- Exibe fonte, medicamento, tipo, descrição, recomendação
- Opções: `s` (aprovar), `n` (rejeitar), `e` (editar - em desenvolvimento), `q` (sair)

#### Aprovação automática (alta evidência)

```bash
npm run medlibrary:approve -- --auto
```

Aprova automaticamente fatos com `evidenceLevel: 'alta'`.

#### Aplicar fatos aprovados às tabelas finais

```bash
npm run medlibrary:approve -- --apply
```

Migra fatos aprovados para:
- `DrugInteraction` (DRUG_DRUG_INTERACTION)
- `DrugFoodInteraction` (DRUG_FOOD_INTERACTION)

Marca fatos como `APPLIED` após migração.

#### Ver estatísticas

```bash
npm run medlibrary:stats
```

Exibe:
- Total de documentos e status
- Fatos extraídos por status
- Tamanho das tabelas de produção

## Tipos de Fatos Extraídos

| Tipo | Descrição | Tabela Destino |
|------|-----------|----------------|
| `DESIRED_EFFECT` | Efeitos terapêuticos desejados | MedicationEffectTemplate |
| `SIDE_EFFECT` | Efeitos colaterais comuns | MedicationEffectTemplate |
| `SERIOUS_SIDE_EFFECT` | Efeitos adversos graves | MedicationEffectTemplate |
| `DRUG_DRUG_INTERACTION` | Interações medicamentosas | DrugInteraction |
| `DRUG_FOOD_INTERACTION` | Interações com alimentos | DrugFoodInteraction |
| `ONSET_TIME` | Tempo até início de ação | (metadata) |
| `CONTRAINDICATION` | Contraindicações | (metadata) |
| `DOSAGE_RECOMMENDATION` | Recomendações de dosagem | (metadata) |

## Modelo de Dados

### MedicalSourceDocument

Representa um documento fonte (eBook PDF):

```typescript
{
  id: string
  title: string
  authors?: string
  year?: number
  sourceType: 'ebook' | 'article' | 'guideline'
  filePath: string
  status: 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'ERROR'
  pagesCount?: number
  processingStartedAt?: Date
  processingCompletedAt?: Date
  errorMessage?: string
}
```

### ExtractedMedicalFact

Representa um fato extraído (staging):

```typescript
{
  id: string
  sourceDocumentId: string
  medicationName: string
  factType: MedicalFactType
  otherMedicationName?: string  // Para DRUG_DRUG_INTERACTION
  foodKey?: string              // Para DRUG_FOOD_INTERACTION
  description: string
  recommendation?: string
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  typicalOnsetHoursMin?: number
  typicalOnsetHoursMax?: number
  evidenceLevel?: string        // 'alta' | 'moderada' | 'baixa' | 'expert_opinion'
  rawText: string
  pageRange?: string
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'APPLIED'
  reviewNotes?: string
  reviewedBy?: string
  reviewedAt?: Date
}
```

## Pipeline de Processamento

### 1. Extração de Texto
- Biblioteca: `pdf-parse`
- Extrai texto completo mantendo estrutura
- Captura metadados (autor, título, data)

### 2. Chunking
- Tamanho: 3000 caracteres por chunk
- Overlap: 500 caracteres entre chunks
- Respeita limites de parágrafo

### 3. Processamento LLM
- Modelo: Configurável (padrão: llama3.2:3b)
- Temperature: 0.1 (baixa para maior precisão)
- Timeout: 3 minutos por chunk
- Retry: 1 tentativa em caso de falha

### 4. Deduplicação
- Remove fatos idênticos baseado em:
  - `medicationName`
  - `factType`
  - `otherMedicationName` / `foodKey`
  - Primeiros 50 caracteres da `description`

### 5. Filtragem de Qualidade
Descarta fatos com:
- Descrição muito curta (< 10 caracteres)
- Nome de medicamento muito curto (< 3 caracteres)
- Onset time inválido (min > max ou > 720 horas)

### 6. Agregação
- Agrupa fatos similares
- Mantém descrição mais completa
- Combina recomendações únicas

## Prompt LLM

O sistema usa um prompt estruturado que instrui o LLM a:

1. Extrair APENAS informações explícitas do texto
2. Não inferir ou inventar dados
3. Usar nomes genéricos (princípio ativo)
4. Normalizar nomes para lowercase sem acentos
5. Ser conservador em interações (reportar quando em dúvida)
6. Retornar JSON válido no schema especificado

Ver `src/medlibrary/types.ts` para o template completo.

## Boas Práticas

### Seleção de Documentos
- Prefira fontes confiáveis (livros acadêmicos, guidelines)
- Evite documentos escaneados (OCR não implementado ainda)
- PDFs com texto pesquisável funcionam melhor

### Revisão de Fatos
- Sempre revise fatos antes de aplicar (exceto alta evidência em fontes confiáveis)
- Verifique nomes de medicamentos (genéricos vs. comerciais)
- Confirme severidades de interações
- Rejeite fatos vagos ou imprecisos

### Performance
- Processe documentos individualmente para monitorar qualidade
- Use `--reprocess` com cuidado (reprocessará TUDO)
- Considere processar fora do horário de pico (LLM intensivo)

## Troubleshooting

### Erro: "Ollama não está disponível"
```bash
# Verificar se Ollama está rodando
curl http://localhost:11434/api/tags

# Iniciar Ollama se necessário
ollama serve
```

### Erro: "pdf-parse não está instalado"
```bash
npm install pdf-parse
```

### Processamento muito lento
- Use modelo menor: `ollama pull llama3.2:1b`
- Reduza `chunkSize` em `ingest.ts` (linha 42)
- Considere GPU para acelerar Ollama

### Fatos de baixa qualidade
- Ajuste `temperature` para 0.0 em `ingest.ts` (mais determinístico)
- Melhore prompt em `types.ts` para seu domínio
- Use modelos maiores para melhor compreensão

### JSON inválido do LLM
- Modelo muito pequeno - use pelo menos 3B parâmetros
- Temperature muito alta - reduza para < 0.2
- Chunk muito grande - reduza `chunkSize`

## Melhorias Futuras

- [ ] OCR para PDFs escaneados (usando Ollama vision)
- [ ] Interface web para aprovação de fatos
- [ ] Extração de imagens (estruturas químicas)
- [ ] Suporte a múltiplos idiomas
- [ ] Cache de chunks processados
- [ ] Processamento paralelo de chunks
- [ ] Integração com PubMed para validação
- [ ] Exportação para formatos padrão (RxNorm, SNOMED)

## Licença

Parte do sistema MedicControl - uso interno.

## Suporte

Para dúvidas ou problemas, consulte a documentação principal do MedicControl ou abra uma issue no repositório.
