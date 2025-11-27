'use client'

import { useState } from 'react'
import HospitalGate from '@/components/splash/HospitalGate'

export default function GateDemoPage() {
  const [hasEntered, setHasEntered] = useState(false)

  if (!hasEntered) {
    return <HospitalGate onEnter={() => setHasEntered(true)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-6">
            🎉 Entrada Concluída!
          </h1>

          <p className="text-2xl text-slate-600 mb-12">
            Você acabou de passar pela experiência de entrada mais épica de um sistema médico!
          </p>

          {/* Cards de features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Análise com IA
              </h3>
              <p className="text-slate-600">
                Tendências, predições e insights automáticos dos seus exames
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Chatbot Médico
              </h3>
              <p className="text-slate-600">
                Converse sobre sua saúde com IA contextualizada
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-3xl">🔔</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Alertas Inteligentes
              </h3>
              <p className="text-slate-600">
                Notificações automáticas de valores críticos
              </p>
            </div>
          </div>

          {/* Detalhes técnicos */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-left mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              ⚡ Tecnologias Usadas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
              <div>
                <p className="font-semibold text-cyan-400">Next.js 14</p>
                <p className="text-sm">App Router</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-400">Framer Motion</p>
                <p className="text-sm">Animações</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-400">Tailwind CSS</p>
                <p className="text-sm">Styling</p>
              </div>
              <div>
                <p className="font-semibold text-cyan-400">Web Audio API</p>
                <p className="text-sm">Sons + Voz</p>
              </div>
            </div>
          </div>

          {/* Botão para ver novamente */}
          <button
            onClick={() => setHasEntered(false)}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:-translate-y-1 transition-all duration-300"
          >
            🔄 Ver Entrada Novamente
          </button>

          <p className="text-slate-500 text-sm mt-8">
            Criado com ❤️ para ser o sistema médico mais bonito do mundo
          </p>
        </div>
      </div>
    </div>
  )
}
