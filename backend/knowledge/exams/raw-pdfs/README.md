# 📚 PDFs de Referência de Exames Laboratoriais

Esta pasta deve conter os PDFs de interpretação de exames laboratoriais que serão processados pelo script de construção do catálogo.

## 📥 Como Adicionar PDFs

Simplesmente copie seus arquivos PDF para esta pasta:

```bash
# No Windows
copy "C:\Users\Seu-Usuario\Downloads\seu-pdf.pdf" .

# No Linux/Mac
cp ~/Downloads/seu-pdf.pdf .
```

## 📖 Tipos de PDFs Recomendados

- ✅ Guias de interpretação de exames laboratoriais
- ✅ Manuais de valores de referência
- ✅ Livros técnicos sobre exames bioquímicos
- ✅ Apostilas de biomedicina/medicina
- ✅ Guidelines de sociedades médicas

### Exemplos de Nomes de Arquivos:

- `Exames-Laboratoriais-Pelo-Nutricionista-Felipe-Fedrizzi.pdf`
- `Interpretacao-de-exames-laboratoriais-CEUB.pdf`
- `Interpretacao-de-exames-laboratoriais.pdf`
- `Ebook-Exames-Laboratoriais.pdf`
- `Interpretacao-de-exames-bioquimicos.pdf`
- `Guia-Para-Interpretacao-de-Hemogramas.pdf`
- `Interpretacao-de-exames-hepaticos.pdf`

## ⚠️ Requisitos dos PDFs

Para melhor processamento, os PDFs devem:

1. **Ter texto extraível** (não apenas imagens escaneadas)
2. **Conter informações sobre valores de referência**
3. **Estar em português** (ou adapte o script para outros idiomas)
4. **Ser de fontes confiáveis** (livros, artigos científicos, guidelines)

## 🔒 Privacidade e Copyright

⚠️ **IMPORTANTE**:

- Não compartilhe PDFs protegidos por copyright
- Use apenas materiais que você tem direito de usar
- Os PDFs NÃO são versionados no Git (estão no .gitignore)
- São apenas para processamento local

## 🚀 Próximo Passo

Após adicionar os PDFs aqui, execute:

```bash
cd ../../..
npm run build:exam-catalog
```

Isso irá processar todos os PDFs e gerar o arquivo `exams_reference.json`.
