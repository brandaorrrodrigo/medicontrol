# 🎙️ TTS com XTTS v2 (Coqui)

Este módulo adiciona síntese de voz de alta qualidade usando XTTS v2 da Coqui.

## 🚀 Instalação

### 1. Instalar Python 3.10 ou 3.11

Baixe e instale: https://www.python.org/downloads/

**IMPORTANTE**: Marque a opção "Add Python to PATH" durante a instalação!

### 2. Verificar Instalação

```bash
python --version
```

Deve mostrar Python 3.10.x ou 3.11.x

### 3. Instalar PyTorch com CUDA (para RTX 3090)

```bash
pip install torch==2.1.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
```

### 4. Instalar Coqui TTS e Dependências

```bash
cd backend/python
pip install -r requirements.txt
```

### 5. Testar Instalação

```bash
python -c "import torch; print('CUDA disponível:', torch.cuda.is_available())"
```

Deve mostrar: `CUDA disponível: True`

### 6. Baixar Modelo XTTS v2 (Primeira Execução)

Na primeira vez que rodar, o modelo (~1.8GB) será baixado automaticamente.
Isso pode levar alguns minutos dependendo da sua internet.

## ⚡ Performance

Com sua RTX 3090:
- **Primeira execução**: ~10-15 segundos (carrega modelo)
- **Execuções seguintes**: ~2-3 segundos por frase
- **VRAM usado**: ~2GB

## 🎯 Uso

O backend TypeScript chama automaticamente o script Python.
Não é necessário executar manualmente.

## 🔧 Troubleshooting

### Erro: "CUDA not available"

Se CUDA não estiver disponível, reinstale PyTorch:

```bash
pip uninstall torch torchaudio
pip install torch==2.1.2 torchaudio==2.1.2 --index-url https://download.pytorch.org/whl/cu118
```

### Erro: "No module named 'TTS'"

```bash
pip install TTS==0.22.0
```

### Modelo demora muito para baixar

O modelo XTTS v2 tem ~1.8GB. Em conexões lentas, pode demorar.
É baixado apenas uma vez e fica em cache.

## 📁 Estrutura

```
python/
├── requirements.txt      # Dependências Python
├── tts_xtts.py          # Script principal de TTS
└── README.md            # Este arquivo
```

## 🎤 Personalização de Voz

Para usar uma voz personalizada (clone de voz):

1. Grave um áudio de 10-30 segundos da pessoa
2. Salve como `speaker.wav` na pasta `python/`
3. O sistema usará essa voz automaticamente!

## 💡 Dicas

- **Primeira execução é lenta**: Normal! O modelo é carregado na RAM/VRAM
- **Cache**: Após primeira execução, fica muito mais rápido
- **Qualidade**: XTTS v2 é um dos melhores TTS open source
- **Idiomas**: Suporta português brasileiro nativamente
