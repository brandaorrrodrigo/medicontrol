# 🌙 DARK MODE COMPLETO - GUIA DE USO

## 🎉 SISTEMA DE DARK MODE IMPLEMENTADO!

O MedicControl agora tem um sistema completo de Dark Mode com:
- ✅ Tema claro, escuro e automático (sistema)
- ✅ Persistência no localStorage
- ✅ Transições suaves
- ✅ 4 tipos de toggles animados
- ✅ Zero flash de tema incorreto
- ✅ TypeScript tipado

---

## 📦 ARQUIVOS CRIADOS

```
frontend/
├── contexts/
│   └── ThemeContext.tsx          ← Context + Provider + Hook
├── components/
│   └── ui/
│       └── ThemeToggle.tsx       ← 4 toggles diferentes
└── tailwind.config.js            ← Atualizado com dark mode
```

---

## 🚀 INSTALAÇÃO RÁPIDA

### 1. Adicionar ThemeProvider no Layout Raiz

```tsx
// app/layout.tsx ou pages/_app.tsx
import { ThemeProvider, ThemeScript } from '@/contexts/ThemeContext'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeScript /> {/* Previne flash de tema */}
      </head>
      <body>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Adicionar Toggle no Header/Menu

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle'

function Header() {
  return (
    <header>
      {/* Seu conteúdo */}
      <ThemeToggle /> {/* Adicione o toggle */}
    </header>
  )
}
```

---

## 🎨 TIPOS DE TOGGLES DISPONÍVEIS

### 1. ThemeToggle (Padrão - Recomendado)
```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle'

<ThemeToggle />
```
- Botão quadrado com ícone
- Animação de rotação
- Partículas no modo escuro
- Efeito hover gradiente

### 2. ThemeSelector (Com opção Sistema)
```tsx
import { ThemeSelector } from '@/components/ui/ThemeToggle'

<ThemeSelector />
```
- Dropdown com 3 opções: Claro, Escuro, Sistema
- Indicador visual do tema ativo
- Animações suaves

### 3. ThemeSwitch (Estilo Switch)
```tsx
import { ThemeSwitch } from '@/components/ui/ThemeToggle'

<ThemeSwitch />
```
- Switch deslizante
- Estrelas animadas no modo escuro
- Gradiente de fundo

### 4. MiniThemeToggle (Compacto)
```tsx
import { MiniThemeToggle } from '@/components/ui/ThemeToggle'

<MiniThemeToggle />
```
- Versão menor para menus
- Apenas ícone
- Hover effect

---

## 🎯 USANDO O HOOK useTheme

```tsx
'use client'

import { useTheme } from '@/contexts/ThemeContext'

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()

  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (sempre resolvido)

  return (
    <div>
      <p>Tema atual: {theme}</p>
      <p>Tema resolvido: {resolvedTheme}</p>

      <button onClick={toggleTheme}>
        Alternar Tema
      </button>

      <button onClick={() => setTheme('dark')}>
        Modo Escuro
      </button>

      <button onClick={() => setTheme('light')}>
        Modo Claro
      </button>

      <button onClick={() => setTheme('system')}>
        Seguir Sistema
      </button>
    </div>
  )
}
```

---

## 🎨 ESTILIZANDO COMPONENTES PARA DARK MODE

### Classes Tailwind para Dark Mode

Use o prefixo `dark:` para estilos no modo escuro:

```tsx
<div className="bg-white dark:bg-slate-900">
  <h1 className="text-slate-900 dark:text-white">
    Título
  </h1>
  <p className="text-slate-600 dark:text-slate-300">
    Texto secundário
  </p>
</div>
```

### Paleta de Cores Recomendada

#### Backgrounds
```tsx
// Fundo principal
bg-white dark:bg-slate-900

// Fundo secundário
bg-slate-50 dark:bg-slate-800

// Fundo de cards
bg-white dark:bg-slate-800

// Fundo de hover
hover:bg-slate-100 dark:hover:bg-slate-700
```

#### Text Colors
```tsx
// Texto principal
text-slate-900 dark:text-white

// Texto secundário
text-slate-600 dark:text-slate-300

// Texto terciário
text-slate-500 dark:text-slate-400
```

#### Borders
```tsx
border-slate-200 dark:border-slate-700
```

#### Shadows
```tsx
shadow-lg dark:shadow-dark-lg
```

---

## 💡 EXEMPLOS PRÁTICOS

### Card com Dark Mode
```tsx
<div className="
  bg-white dark:bg-slate-800
  border border-slate-200 dark:border-slate-700
  rounded-2xl p-6
  shadow-lg dark:shadow-dark-lg
  transition-colors duration-300
">
  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
    Título do Card
  </h3>
  <p className="text-slate-600 dark:text-slate-300">
    Conteúdo do card
  </p>
</div>
```

### Button com Dark Mode
```tsx
<button className="
  px-6 py-3 rounded-xl
  bg-blue-600 dark:bg-blue-500
  hover:bg-blue-700 dark:hover:bg-blue-600
  text-white
  shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20
  transition-all duration-300
">
  Clique Aqui
</button>
```

### Input com Dark Mode
```tsx
<input
  type="text"
  className="
    w-full px-4 py-3 rounded-xl
    bg-white dark:bg-slate-800
    border border-slate-300 dark:border-slate-600
    text-slate-900 dark:text-white
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
    transition-colors duration-300
  "
  placeholder="Digite algo..."
/>
```

### Gradientes com Dark Mode
```tsx
<div className="
  bg-gradient-to-r
  from-blue-500 to-cyan-400
  dark:from-blue-600 dark:to-cyan-500
">
  Gradiente adaptável
</div>
```

---

## 🎭 ATUALIZAR COMPONENTES EXISTENTES

### ModernCard
```tsx
// Adicione classes dark: em todos os backgrounds e textos
<div className="
  bg-white dark:bg-slate-800
  border border-slate-200 dark:border-slate-700
  shadow-lg dark:shadow-dark-lg
">
  <h3 className="text-slate-900 dark:text-white">Título</h3>
  <p className="text-slate-600 dark:text-slate-300">Conteúdo</p>
</div>
```

### ModernButton
```tsx
// Variantes com dark mode
const variants = {
  primary: 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600',
  secondary: 'bg-slate-600 dark:bg-slate-500 hover:bg-slate-700 dark:hover:bg-slate-600',
  // ...
}
```

### ModernInput
```tsx
<input className="
  bg-white dark:bg-slate-800
  border-slate-300 dark:border-slate-600
  text-slate-900 dark:text-white
  focus:border-blue-500 dark:focus:border-blue-400
"/>
```

---

## 🌟 DICAS PROFISSIONAIS

### 1. Sempre use transition-colors
```tsx
className="transition-colors duration-300"
```
Isso garante transições suaves ao trocar de tema.

### 2. Teste ambos os modos
Sempre teste seus componentes em modo claro E escuro!

### 3. Use cores semânticas
```tsx
// BOM ✅
text-slate-900 dark:text-white

// EVITE ❌
text-black dark:text-white // #000 é muito forte
```

### 4. Ajuste opacidades
No dark mode, use opacidades menores para sombras e overlays:
```tsx
shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20
```

### 5. Backgrounds gradientes
Use tons mais escuros no dark mode:
```tsx
bg-gradient-to-br
from-slate-50 to-blue-50
dark:from-slate-900 dark:to-slate-800
```

---

## 🚀 MELHORIAS OPCIONAIS

### 1. Adicionar animação de transição global

```tsx
// app/globals.css
* {
  @apply transition-colors duration-300;
}
```

### 2. Criar tema customizado

```tsx
<ThemeProvider defaultTheme="dark" storageKey="meu-app-theme">
  {children}
</ThemeProvider>
```

### 3. Adicionar temas personalizados

Você pode estender o sistema para ter mais temas (ex: "blue", "purple"):

```tsx
// ThemeContext.tsx
type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'system'
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] ThemeProvider adicionado no layout raiz
- [ ] ThemeScript no <head>
- [ ] Toggle adicionado no header
- [ ] Componentes principais atualizados com dark:
  - [ ] Cards
  - [ ] Buttons
  - [ ] Inputs
  - [ ] Modals
  - [ ] Layout
- [ ] Testado em ambos os modos
- [ ] Transições suaves configuradas

---

## 📊 ESTRUTURA COMPLETA

```tsx
// 1. Layout Raiz
<html suppressHydrationWarning>
  <head>
    <ThemeScript />
  </head>
  <body>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </body>
</html>

// 2. Header/Menu
<header>
  <ThemeToggle />
</header>

// 3. Componentes
<div className="bg-white dark:bg-slate-900">
  {/* Seu conteúdo */}
</div>

// 4. Hooks
const { theme, resolvedTheme, setTheme } = useTheme()
```

---

## 🎉 RESULTADO FINAL

✨ **Dark Mode Completo e Profissional!**

- 🌙 3 modos: Claro, Escuro, Sistema
- 💾 Persistência automática
- ⚡ Zero flash
- 🎨 4 tipos de toggles
- 🎭 Transições suaves
- 🚀 Performance otimizada

---

## 🔗 LINKS ÚTEIS

- **Demo:** http://localhost:3000/demo/dark-mode
- **Tailwind Dark Mode:** https://tailwindcss.com/docs/dark-mode
- **Framer Motion:** https://www.framer.com/motion/

---

**Criado com 🌙 para tornar o MedicControl ainda mais bonito!**
