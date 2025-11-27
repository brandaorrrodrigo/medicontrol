# 🏥 Hospital Gate - Portaria Futurista MedicControl

## 🎨 Visual

Portaria ultra-moderna de hospital com:
- ✅ Portas deslizantes animadas (motor realista)
- ✅ Sensores de movimento piscando
- ✅ Partículas flutuantes futuristas
- ✅ Grid holográfico de fundo
- ✅ Efeitos de luz cyan/azul
- ✅ Ícones médicos flutuantes
- ✅ Transições suaves com Framer Motion

## 🔊 Áudio Necessário

Para experiência completa, adicione em `frontend/public/sounds/`:

### 1. door-opening.mp3
Som de porta automática hospitalar abrindo (2-3 segundos)

**Sugestão de criação:**
- Use Freesound.org: "automatic door hospital"
- Ou grave: som metálico de motor elétrico + deslize suave

### 2. welcome-voice.mp3
Voz feminina delicada dizendo:

```
"Bem-vindo ao Sistema MedicControl de Administração de Medicamentos.
Acesso autorizado. Sistemas inicializando."
```

**Sugestões para criar:**

#### Opção 1: IA (Grátis)
```bash
# Usar ElevenLabs (11labs.io) - voz feminina brasileira
# Ou Google Cloud Text-to-Speech
# Ou Azure Cognitive Services
```

#### Opção 2: Código (usar no backend)
```typescript
// backend/src/ai-chat/tts.service.ts
import { TextToSpeechClient } from '@google-cloud/text-to-speech'

const text = "Bem-vindo ao Sistema MedicControl..."
const audioContent = await ttsClient.synthesizeSpeech({
  input: { text },
  voice: { languageCode: 'pt-BR', name: 'pt-BR-Standard-A' },
  audioConfig: { audioEncoding: 'MP3' }
})
```

## 🚀 Uso

```tsx
import HospitalGate from '@/components/splash/HospitalGate'

export default function Home() {
  const [showGate, setShowGate] = useState(true)

  if (showGate) {
    return <HospitalGate onEnter={() => setShowGate(false)} />
  }

  return <Dashboard />
}
```

## 🎨 Cores

```css
/* Ultra moderno */
--slate-900: #0f172a    /* Fundo escuro profundo */
--blue-950: #172554     /* Azul escuro tecnológico */

/* Acentos hospitalares */
--cyan-400: #22d3ee     /* Azul médico brilhante */
--blue-500: #3b82f6     /* Azul confiança */
--teal-400: #2dd4bf     /* Verde hospitalar */

/* Alertas */
--red-500: #ef4444      /* Sensor movimento */
--green-400: #4ade80    /* Status OK */
```

## ⚙️ Instalação

```bash
# Instalar Framer Motion
npm install framer-motion

# Instalar Lucide Icons
npm install lucide-react
```

## 🎬 Timeline da Animação

1. **0s**: Logo e título aparecem fade-in
2. **1.5s**: Botão "ACESSAR SISTEMA" surge
3. **[Click]**: Portas começam a abrir
4. **0.2s**: Som de motor inicia
5. **1s**: Voz de boas-vindas começa
6. **1.5s**: Conteúdo revelado aparece
7. **2.5s**: Barra de progresso completa
8. **4.5s**: Transição para dashboard

## 🎭 Efeitos Especiais

- **Partículas**: 30 pontos flutuando aleatoriamente
- **Pulso do logo**: Escala 1 → 1.05 → 1 (2s loop)
- **Sensores**: Vermelho piscando até porta abrir
- **Ícones flutuantes**: Movimento vertical + rotação leve
- **Barra de progresso**: Gradiente animado cyan → blue

## 📱 Responsivo

- Desktop: Portas grandes (500px altura)
- Tablet: Escala mantida
- Mobile: Portas ajustadas automaticamente

## 🔒 Segurança

- Autoplay de áudio só funciona após interação do usuário (botão)
- Fallback gracioso se áudio não carregar
- Cleanup de áudio ao desmontar componente

## 🎯 Próximos Passos

1. ✅ Visual criado
2. ⏳ Adicionar áudio (instruções acima)
3. ⏳ Testar no navegador
4. ⏳ Ajustar timing se necessário
5. ⏳ Integrar com autenticação (se houver)
