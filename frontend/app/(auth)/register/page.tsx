'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authService } from '@/services/auth.service'

type UserRole = 'PATIENT' | 'CAREGIVER' | 'PROFESSIONAL'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<UserRole>('PATIENT')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    // Patient fields
    dateOfBirth: '',
    gender: 'M' as 'M' | 'F' | 'O',
    bloodType: '',
    // Caregiver fields
    relationship: '',
    // Professional fields
    specialty: '',
    crm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validação
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const registerData: any = {
        email: formData.email,
        password: formData.password,
        role,
        name: formData.name,
        phone: formData.phone || undefined,
      }

      // Adicionar campos específicos por role
      if (role === 'PATIENT') {
        registerData.dateOfBirth = formData.dateOfBirth
        registerData.gender = formData.gender
        registerData.bloodType = formData.bloodType || undefined
      } else if (role === 'CAREGIVER') {
        registerData.relationship = formData.relationship || undefined
      } else if (role === 'PROFESSIONAL') {
        registerData.specialty = formData.specialty
        registerData.crm = formData.crm
      }

      await authService.register(registerData)

      // Redirecionar baseado no role
      switch (role) {
        case 'PATIENT':
          router.push('/patient/dashboard')
          break
        case 'CAREGIVER':
          router.push('/caregiver/dashboard')
          break
        case 'PROFESSIONAL':
          router.push('/professional/dashboard')
          break
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Criar Nova Conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 ? 'Escolha o tipo de conta' : 'Preencha seus dados'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 ? (
            // Step 1: Escolher role
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('PATIENT')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    role === 'PATIENT'
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Paciente</h3>
                    <p className="text-xs text-gray-500 mt-1">Gerenciar minha saúde</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('CAREGIVER')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    role === 'CAREGIVER'
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Cuidador</h3>
                    <p className="text-xs text-gray-500 mt-1">Cuidar de pacientes</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('PROFESSIONAL')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    role === 'PROFESSIONAL'
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Profissional</h3>
                    <p className="text-xs text-gray-500 mt-1">Atender pacientes</p>
                  </div>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-6 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Continuar
              </button>
            </div>
          ) : (
            // Step 2: Formulário
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Campos comuns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar senha *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Confirme sua senha"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="(11) 98765-4321"
                  />
                </div>
              </div>

              {/* Campos específicos por role */}
              {role === 'PATIENT' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gênero *
                    </label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="O">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo Sanguíneo
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">Selecione</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              )}

              {role === 'CAREGIVER' && (
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relação com o paciente
                  </label>
                  <input
                    type="text"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Ex: Filho(a), Cônjuge, Enfermeiro(a)"
                  />
                </div>
              )}

              {role === 'PROFESSIONAL' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidade *
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      required
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Ex: Cardiologia"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CRM *
                    </label>
                    <input
                      type="text"
                      name="crm"
                      required
                      value={formData.crm}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="123456-SP"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </div>
            </form>
          )}

          {/* Link to login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
