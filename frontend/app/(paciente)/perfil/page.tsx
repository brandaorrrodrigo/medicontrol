'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuthStore } from '@/store/auth.store'

export default function PatientProfilePage() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const { setUser } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.patient?.phone || '',
    dateOfBirth: user?.patient?.dateOfBirth || '',
    gender: user?.patient?.gender || '',
  })

  const handleSave = async () => {
    if (!user?.patient?.id) return

    try {
      setLoading(true)
      const { updatePatientProfile } = await import('@/lib/api')

      const updatedPatient = await updatePatientProfile(user.patient.id, {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as any,
      })

      // Atualizar o usuário no store
      setUser({
        ...user,
        name: formData.name,
        patient: {
          ...user.patient,
          ...updatedPatient,
        },
      })

      setIsEditing(false)
      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <MainLayout userType="paciente">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userType="paciente">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600 mt-1">Gerencie suas informações pessoais</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isEditing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  Paciente
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 98765-4321"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{formData.phone || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('pt-BR') : 'Não informado'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero
                </label>
                {isEditing ? (
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                ) : (
                  <p className="text-gray-900 py-2">
                    {formData.gender === 'M' ? 'Masculino' : formData.gender === 'F' ? 'Feminino' : formData.gender === 'O' ? 'Outro' : 'Não informado'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID do Usuário
                </label>
                <p className="text-gray-500 py-2 text-sm font-mono">{user?.id}</p>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Senha</p>
                <p className="text-sm text-gray-500">Última alteração: Nunca</p>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                Alterar Senha
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Autenticação em dois fatores</p>
                <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition font-medium">
                Ativar
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de Perigo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Excluir Conta</p>
                <p className="text-sm text-gray-500">Permanentemente remover sua conta e todos os dados</p>
              </div>
              <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition font-medium">
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
