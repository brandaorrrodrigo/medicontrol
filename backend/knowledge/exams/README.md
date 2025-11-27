# 🔬 Catálogo de Exames Laboratoriais

Este diretório contém o sistema de catalogação e interpretação de exames laboratoriais do MedicControl.

## 📁 Estrutura

```
backend/knowledge/exams/
  ├─ raw-pdfs/              # PDFs de referência (você adiciona aqui)
  ├─ exams_reference.json   # Catálogo gerado automaticamente
  └─ README.md              # Esta documentação
```

## 🚀 Como Usar

### 1. Adicionar PDFs de Referência

Copie seus PDFs de interpretação de exames para a pasta `raw-pdfs/`:

```bash
# Exemplos de PDFs que você pode adicionar:
cp ~/Downloads/Exames-Laboratoriais-Pelo-Nutricionista-Felipe-Fedrizzi.pdf raw-pdfs/
cp ~/Downloads/Interpretacao-de-exames-laboratoriais-CEUB.pdf raw-pdfs/
cp ~/Downloads/Guia-Para-Interpretacao-de-Hemogramas.pdf raw-pdfs/
```

### 2. Gerar o Catálogo

Execute o script de construção do catálogo:

```bash
cd backend
npm run build:exam-catalog
```

O script irá:
- ✅ Ler todos os PDFs em `raw-pdfs/`
- ✅ Extrair texto e identificar marcadores laboratoriais
- ✅ Normalizar e agregar informações
- ✅ Gerar o arquivo `exams_reference.json`

### 3. Verificar o Resultado

O arquivo `exams_reference.json` terá este formato:

```json
[
  {
    "markerCode": "GLICEMIA_JEJUM",
    "markerName": "Glicose em jejum",
    "synonyms": [
      "glicose em jejum",
      "glicemia de jejum",
      "glicose plasmatica"
    ],
    "category": "Glicemia",
    "unit": "mg/dL",
    "referenceRanges": [
      {
        "population": "Adultos",
        "sex": "ANY",
        "ageRange": "18-65",
        "low": 70,
        "high": 99,
        "notes": "Valores entre 100-125 mg/dL sugerem pré-diabetes"
      }
    ],
    "interpretationHints": [
      "Valores elevados podem estar associados a resistência à insulina"
    ],
    "sources": [
      {
        "pdf": "Exames-Laboratoriais-Pelo-Nutricionista-Felipe-Fedrizzi.pdf",
        "pages": [25, 26]
      }
    ]
  }
]
```

## 🧪 Usando o Catálogo no Código

### Carregar o Catálogo

```typescript
import { examsReferenceService } from '../exams/exams-reference.service'

// Carrega o catálogo em memória (com cache)
await examsReferenceService.loadCatalog()
```

### Buscar um Marcador

```typescript
// Por código
const reference = await examsReferenceService.findReference('GLICEMIA_JEJUM')

// Por nome (busca parcial)
const results = await examsReferenceService.searchByName('glicose')

// Por categoria
const glicemiaExams = await examsReferenceService.getByCategory('Glicemia')
```

### Interpretar Resultado de Exame

```typescript
const interpretation = await examsReferenceService.interpretResult(
  'GLICEMIA_JEJUM',  // código do marcador
  110,                // valor do resultado
  'M',                // sexo do paciente (opcional)
  45                  // idade do paciente (opcional)
)

console.log(interpretation)
// {
//   markerCode: 'GLICEMIA_JEJUM',
//   markerName: 'Glicose em jejum',
//   value: 110,
//   unit: 'mg/dL',
//   status: 'HIGH',
//   interpretationText: 'Glicose em jejum está acima do valor de referência...',
//   hints: ['Valores elevados podem estar associados...']
// }
```

### Interpretar Múltiplos Resultados

```typescript
const results = [
  { markerCode: 'GLICEMIA_JEJUM', value: 95 },
  { markerCode: 'COLESTEROL_TOTAL', value: 220 },
  { markerCode: 'HDL_COLESTEROL', value: 45 }
]

const interpretations = await examsReferenceService.interpretMultiple(
  results,
  'F',  // sexo
  52    // idade
)
```

## 📊 Marcadores Suportados

O catálogo atualmente suporta marcadores nas seguintes categorias:

- **Glicemia**: Glicose, HbA1c, Insulina
- **Lipidograma**: Colesterol Total, HDL, LDL, VLDL, Triglicerídeos
- **Função Hepática**: TGO/AST, TGP/ALT, GGT, Fosfatase Alcalina, Bilirrubinas, Albumina
- **Função Renal**: Creatinina, Ureia, Ácido Úrico
- **Hemograma**: Hemoglobina, Hematócrito, Eritrócitos, Leucócitos, Plaquetas, VCM, HCM, CHCM
- **Inflamatórios**: PCR, VHS, Ferritina
- **Eletrólitos**: Sódio, Potássio, Cálcio, Magnésio
- **Função Tireoidiana**: TSH, T4 Livre, T3 Livre
- **Vitaminas**: Vitamina D, Vitamina B12, Ácido Fólico

## 🔧 Personalização

### Adicionar Novos Marcadores

Edite `scripts/build_exam_catalog.ts` e adicione no objeto `MARKER_MAPPINGS`:

```typescript
'novo exame': {
  code: 'NOVO_EXAME',
  category: 'Categoria',
  defaultUnit: 'mg/dL',
  synonyms: ['sinônimo 1', 'sinônimo 2']
}
```

Depois execute novamente:

```bash
npm run build:exam-catalog
```

### Melhorar Parsing de PDFs

O script usa extração de texto simples. Para melhorias:

1. Adicione padrões de regex mais específicos em `extractRangeFromText()`
2. Implemente detecção de tabelas
3. Use OCR para PDFs escaneados
4. Adicione machine learning para classificação

## ⚠️ Limitações Conhecidas

1. **Parsing Automático**: A extração de texto de PDFs pode ser imprecisa dependendo da formatação
2. **Faixas de Referência**: Podem não ser capturadas corretamente se o formato for não-padrão
3. **Contexto Clínico**: O catálogo fornece referências, mas a interpretação final deve sempre considerar o contexto clínico completo
4. **Atualização**: Sempre que adicionar novos PDFs, execute o script novamente

## 📝 Notas Importantes

- ⚠️ Este catálogo é uma **ferramenta auxiliar** e não substitui avaliação médica profissional
- 📚 Sempre verifique as fontes e atualize com referências confiáveis
- 🔄 Execute o script periodicamente quando adicionar novos materiais
- 💾 O arquivo `exams_reference.json` pode ser editado manualmente para correções

## 🆘 Solução de Problemas

### "Nenhum PDF encontrado"

Certifique-se de que os PDFs estão na pasta correta:

```bash
ls -la backend/knowledge/exams/raw-pdfs/
```

### "Catálogo vazio após processar"

- Verifique se os PDFs têm texto extraível (não são apenas imagens)
- Adicione novos padrões em `MARKER_MAPPINGS` para os exames que você precisa

### "Erro ao carregar catálogo"

Execute o script de construção primeiro:

```bash
npm run build:exam-catalog
```

## 🚀 Próximos Passos

Depois de gerar o catálogo, você pode:

1. Integrar com o módulo de exames do MedicControl
2. Criar endpoints API para interpretação de resultados
3. Desenvolver interface para visualização de resultados
4. Implementar alertas automáticos para valores críticos
