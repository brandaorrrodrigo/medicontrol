# 🚀 Guia Rápido: Sistema de Catálogo de Exames

## 📋 O que foi criado

✅ Sistema completo de catalogação e interpretação de exames laboratoriais
✅ Script automático de extração de dados de PDFs
✅ Service TypeScript para consulta e interpretação
✅ Controller e rotas REST API prontos
✅ 50+ marcadores pré-configurados

## 🎯 Como Usar em 3 Passos

### 1️⃣ Adicione seus PDFs

```bash
# Navegue até a pasta de PDFs
cd backend/knowledge/exams/raw-pdfs

# Copie seus PDFs para esta pasta
# Exemplos de PDFs úteis:
# - Guias de interpretação de exames
# - Manuais de valores de referência
# - Livros de bioquímica clínica
```

### 2️⃣ Execute o script de construção

```bash
# Volte para a pasta backend
cd ../../..

# Execute o script
npm run build:exam-catalog
```

**Saída esperada:**
```
🔬 Iniciando construção do catálogo de exames laboratoriais...

📚 Encontrados 5 PDFs para processar:

   - Exames-Laboratoriais-Pelo-Nutricionista-Felipe-Fedrizzi.pdf
   - Interpretacao-de-exames-laboratoriais-CEUB.pdf
   ...

📄 Processando: Exames-Laboratoriais-Pelo-Nutricionista-Felipe-Fedrizzi.pdf
  ✓ Encontrados 45 marcadores

📊 Total de marcadores extraídos: 180
🔄 Agregando e normalizando marcadores...
✅ Catálogo final: 52 marcadores únicos

💾 Arquivo salvo em: knowledge/exams/exams_reference.json

✨ Catálogo de exames construído com sucesso!
```

### 3️⃣ Use no código

```typescript
import { examsReferenceService } from './exams/exams-reference.service'

// Interpretar resultado de glicemia
const interpretation = await examsReferenceService.interpretResult(
  'GLICEMIA_JEJUM',
  110,  // valor
  'M',  // sexo
  45    // idade
)

console.log(interpretation.interpretationText)
// "Glicose em jejum está acima do valor de referência (110 mg/dL)..."
console.log(interpretation.status)
// "HIGH"
```

## 🌐 Endpoints da API

Integre as rotas no seu `app.ts`:

```typescript
import examsInterpretationRoutes from './exams/exams-interpretation.routes'

app.use('/api/exams-interpretation', examsInterpretationRoutes)
```

### Exemplos de Requisições

**Buscar marcador:**
```bash
GET /api/exams-interpretation/marker/GLICEMIA_JEJUM
```

**Buscar por nome:**
```bash
POST /api/exams-interpretation/search
{
  "query": "colesterol"
}
```

**Interpretar resultado:**
```bash
POST /api/exams-interpretation/interpret
{
  "markerCode": "GLICEMIA_JEJUM",
  "value": 95,
  "patientSex": "F",
  "patientAge": 52
}
```

**Interpretar múltiplos:**
```bash
POST /api/exams-interpretation/interpret-multiple
{
  "results": [
    { "markerCode": "GLICEMIA_JEJUM", "value": 95 },
    { "markerCode": "COLESTEROL_TOTAL", "value": 220 },
    { "markerCode": "HDL_COLESTEROL", "value": 45 }
  ],
  "patientSex": "F",
  "patientAge": 52
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 3,
      "critical": 0,
      "abnormal": 2,
      "normal": 1
    },
    "interpretations": {
      "critical": [],
      "abnormal": [
        {
          "markerCode": "COLESTEROL_TOTAL",
          "status": "HIGH",
          "interpretationText": "Colesterol total está acima..."
        }
      ],
      "normal": [...]
    }
  }
}
```

## 📊 Marcadores Pré-configurados

O sistema já reconhece automaticamente:

### Glicemia
- Glicose em jejum
- Hemoglobina glicada (HbA1c)
- Insulina

### Lipidograma
- Colesterol total, HDL, LDL, VLDL
- Triglicerídeos

### Função Hepática
- TGO/AST, TGP/ALT
- GGT, Fosfatase Alcalina
- Bilirrubinas, Albumina

### Função Renal
- Creatinina, Ureia
- Ácido Úrico

### Hemograma
- Hemoglobina, Hematócrito
- Eritrócitos, Leucócitos, Plaquetas
- VCM, HCM, CHCM

### Outros
- Inflamatórios (PCR, VHS)
- Eletrólitos (Na, K, Ca, Mg)
- Tireoide (TSH, T4, T3)
- Vitaminas (D, B12, Ácido Fólico)

**Total: 50+ marcadores**

## 🔧 Personalização

### Adicionar novo marcador

Edite `scripts/build_exam_catalog.ts`, seção `MARKER_MAPPINGS`:

```typescript
'novo exame': {
  code: 'NOVO_EXAME',
  category: 'Categoria',
  defaultUnit: 'mg/dL',
  synonyms: ['sinônimo 1', 'sinônimo 2']
}
```

Execute novamente:
```bash
npm run build:exam-catalog
```

### Edição manual do catálogo

Você pode editar diretamente o arquivo `knowledge/exams/exams_reference.json` para:
- Corrigir valores de referência
- Adicionar notas de interpretação
- Ajustar categorias
- Incluir faixas específicas por idade/sexo

Depois, recarregue via API:
```bash
POST /api/exams-interpretation/reload-catalog
```

## 📁 Estrutura de Arquivos

```
backend/
  ├─ knowledge/exams/
  │   ├─ raw-pdfs/               # Seus PDFs aqui
  │   ├─ exams_reference.json    # Catálogo gerado
  │   └─ README.md
  │
  ├─ scripts/
  │   └─ build_exam_catalog.ts   # Script de construção
  │
  └─ src/exams/
      ├─ exams-reference.service.ts          # Lógica de interpretação
      ├─ exams-interpretation.controller.ts  # Controller REST
      └─ exams-interpretation.routes.ts      # Rotas
```

## 🎯 Próximos Passos

1. **Adicione mais PDFs** para expandir o catálogo
2. **Integre com o módulo de exames** existente
3. **Crie interface no frontend** para visualização
4. **Implemente alertas** para valores críticos
5. **Exporte relatórios** em PDF com interpretações

## ⚠️ Avisos Importantes

- ⚠️ Este é um sistema **auxiliar** - não substitui avaliação médica
- 📚 Sempre use fontes confiáveis para os PDFs
- 🔄 Execute o script sempre que adicionar novos PDFs
- 💾 Os PDFs não são versionados no Git (muito grandes)

## 🆘 Problemas Comuns

**"Nenhum PDF encontrado"**
→ Verifique se copiou os PDFs para `knowledge/exams/raw-pdfs/`

**"Catálogo vazio"**
→ PDFs podem não ter texto extraível ou precisam de mais padrões no MARKER_MAPPINGS

**"Erro ao carregar catálogo"**
→ Execute `npm run build:exam-catalog` primeiro

## 📚 Documentação Completa

- `knowledge/exams/README.md` - Documentação detalhada
- `knowledge/exams/raw-pdfs/README.md` - Guia de PDFs

---

**Pronto!** Seu sistema de interpretação de exames está configurado e funcionando. 🎉
