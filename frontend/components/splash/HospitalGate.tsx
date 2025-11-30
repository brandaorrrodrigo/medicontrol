'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Activity, Shield, Sparkles } from 'lucide-react'

interface HospitalGateProps {
  onEnter: () => void
}

export default function HospitalGate({ onEnter }: HospitalGateProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)

  // Áudio de porta e voz
  useEffect(() => {
    // Preload áudio
    const doorSound = new Audio('/sounds/door-opening.mp3')
    const welcomeVoice = new Audio('/sounds/welcome-voice.mp3')

    doorSound.load()
    welcomeVoice.load()

    setAudioLoaded(true)

    // Cleanup
    return () => {
      doorSound.pause()
      welcomeVoice.pause()
    }
  }, [])

  const handleEnter = async () => {
    setIsOpening(true)

    // Som de porta abrindo
    if (audioLoaded) {
      const doorSound = new Audio('/sounds/door-opening.mp3')
      doorSound.volume = 0.5
      doorSound.play().catch(console.error)

      // Voz de boas-vindas após 1s
      setTimeout(() => {
        const welcomeVoice = new Audio('/sounds/welcome-voice.mp3')
        welcomeVoice.volume = 0.7
        welcomeVoice.play().catch(console.error)
      }, 1000)
    }

    // Mostrar conteúdo após animação da porta
    setTimeout(() => {
      setShowContent(true)
    }, 1500)

    // Entrar no sistema após tudo
    setTimeout(() => {
      onEnter()
    }, 4500)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
      {/* Grid futurista de fundo */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

      {/* Partículas flutuantes */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [null, Math.random() * 0.5 + 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Container principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-6xl mx-auto px-8">

          {/* Logo e título acima das portas */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center mb-12"
          >
            {/* Logo com pulso */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/50 mb-6"
            >
              <Activity className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>

            {/* Título */}
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 mb-3">
              MedControl
            </h1>
            <p className="text-xl text-slate-300 font-light tracking-wide">
              Sistema de Administração de Medicamentos
            </p>
          </motion.div>

          {/* Portas do hospital */}
          <div className="relative h-[500px] flex items-center justify-center">

            {/* Frame da porta */}
            <div className="absolute inset-0 border-4 border-slate-700 rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm">

              {/* Luz superior da porta */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>

              {/* Porta ESQUERDA */}
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-slate-800 to-slate-700 border-r-2 border-slate-600 shadow-2xl"
                initial={{ x: 0 }}
                animate={{
                  x: isOpening ? '-100%' : 0,
                }}
                transition={{
                  duration: 2,
                  ease: [0.43, 0.13, 0.23, 0.96] // Easing suave
                }}
              >
                {/* Detalhes da porta esquerda */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-8">
                    {/* Linhas decorativas */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-1 w-48 bg-gradient-to-r from-blue-500/30 to-cyan-400/30 rounded-full"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sensor de movimento esquerdo */}
                <div className="absolute top-4 right-4">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-red-500"
                    animate={{
                      opacity: isOpening ? 0 : [1, 0.3, 1],
                      scale: isOpening ? 0.5 : [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isOpening ? 0 : Infinity
                    }}
                  />
                </div>
              </motion.div>

              {/* Porta DIREITA */}
              <motion.div
                className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-slate-800 to-slate-700 border-l-2 border-slate-600 shadow-2xl"
                initial={{ x: 0 }}
                animate={{
                  x: isOpening ? '100%' : 0,
                }}
                transition={{
                  duration: 2,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
              >
                {/* Detalhes da porta direita */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-1 w-48 bg-gradient-to-l from-teal-500/30 to-green-400/30 rounded-full"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3 + 0.15
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sensor de movimento direito */}
                <div className="absolute top-4 left-4">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-red-500"
                    animate={{
                      opacity: isOpening ? 0 : [1, 0.3, 1],
                      scale: isOpening ? 0.5 : [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isOpening ? 0 : Infinity,
                      delay: 0.3
                    }}
                  />
                </div>
              </motion.div>

              {/* Conteúdo revelado quando portas abrem */}
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950/90 to-cyan-900/90 backdrop-blur-xl"
                  >
                    {/* Ícones flutuantes */}
                    <div className="flex gap-12 mb-8">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity
                        }}
                      >
                        <Heart className="w-16 h-16 text-red-400" />
                      </motion.div>
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, -5, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 0.5
                        }}
                      >
                        <Shield className="w-16 h-16 text-green-400" />
                      </motion.div>
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 1
                        }}
                      >
                        <Sparkles className="w-16 h-16 text-yellow-400" />
                      </motion.div>
                    </div>

                    {/* Mensagem de boas-vindas */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-center"
                    >
                      <p className="text-3xl font-light text-white mb-2">
                        Bem-vindo ao
                      </p>
                      <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                        Sistema MedControl
                      </h2>
                      <p className="text-xl text-cyan-200 mt-4 font-light">
                        Iniciando sistemas de saúde inteligente...
                      </p>
                    </motion.div>

                    {/* Barra de progresso */}
                    <motion.div
                      className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden mt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Botão de entrada (quando portas estão fechadas) */}
            {!isOpening && (
              <motion.button
                onClick={handleEnter}
                className="absolute z-20 px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl font-semibold text-xl shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 60px rgba(6, 182, 212, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <span className="flex items-center gap-3">
                  <Activity className="w-6 h-6" />
                  ACESSAR SISTEMA
                </span>
              </motion.button>
            )}
          </div>

          {/* Rodapé com informações */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-center mt-12 text-slate-400 text-sm"
          >
            <p>Sistema de última geração para gestão de saúde</p>
            <p className="mt-2 text-xs text-slate-500">
              Tecnologia de ponta • Segurança máxima • Cuidado humanizado
            </p>
          </motion.div>
        </div>
      </div>

      {/* Efeito de vinheta nas bordas */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 pointer-events-none"></div>
    </div>
  )
}
