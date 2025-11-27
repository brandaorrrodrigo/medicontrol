# 🔊 Arquivos de Som para a Portaria Futurista

## Arquivos Necessários

Esta pasta deve conter dois arquivos de áudio:

### 1. `door-opening.mp3`
**Som de porta automática abrindo**
- Duração recomendada: 2-3 segundos
- Som de motor elétrico com portas deslizantes
- Sugestões de busca:
  - "automatic door opening sound effect"
  - "sliding door motor sound"
  - "hospital automatic door"

**Fontes gratuitas:**
- [Freesound.org](https://freesound.org/search/?q=automatic+door)
- [Zapsplat.com](https://www.zapsplat.com) - Procure por "automatic door"
- [Pixabay](https://pixabay.com/sound-effects/) - Seção de efeitos sonoros

### 2. `welcome-voice.mp3`
**Voz feminina delicada de boas-vindas**
- Duração recomendada: 3-4 segundos
- Texto: "Bem-vindo ao Sistema MedicControl de Administração de Medicamentos"

**Como criar:**

#### Opção 1: Google Cloud Text-to-Speech (Gratuito até 1M caracteres/mês)
```bash
# Instale o CLI do Google Cloud
npm install -g @google-cloud/text-to-speech

# Use voices WaveNet portuguesas (mais naturais):
# pt-BR-Wavenet-A (feminina)
```

#### Opção 2: ElevenLabs (Qualidade premium)
- Acesse: https://elevenlabs.io
- Use a voz "Rachel" ou "Domi" em português
- Texto: "Bem-vindo ao Sistema Medic Control de Administração de Medicamentos"

#### Opção 3: Microsoft Azure TTS (Grátis 5M chars/mês)
- Voz recomendada: `pt-BR-FranciscaNeural` (feminina, delicada)

#### Opção 4: Python + gTTS (Simples, gratuito)
```python
from gtts import gTTS
import os

text = "Bem-vindo ao Sistema Medic Control de Administração de Medicamentos"
tts = gTTS(text=text, lang='pt', slow=False)
tts.save("welcome-voice.mp3")
```

#### Opção 5: Gravar você mesmo
- Use o Audacity (gratuito)
- Aplique efeitos de reverb leve e equalização para som profissional

## Instalação Rápida

### Usando Python (Mais Fácil):
```bash
# 1. Instale gTTS
pip install gtts

# 2. Crie o arquivo
cd frontend/public/sounds
python -c "from gtts import gTTS; gTTS('Bem-vindo ao Sistema Medic Control de Administração de Medicamentos', lang='pt').save('welcome-voice.mp3')"
```

### Para o som da porta:
Baixe de: https://freesound.org/people/InspectorJ/sounds/345568/
(Automatic Door - Clean and Clear)

## Modo de Fallback

Se você não tiver os arquivos de som, o componente continuará funcionando perfeitamente, apenas sem áudio. Os visuais são a estrela principal! ✨

## Verificação

Após adicionar os arquivos, verifique:
```bash
ls frontend/public/sounds/
# Deve mostrar:
# door-opening.mp3
# welcome-voice.mp3
```
