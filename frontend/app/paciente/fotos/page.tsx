'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MainLayout } from '@/components/layout/MainLayout'

const PHOTO_TYPES = {
  BEFORE: { label: 'Antes', color: 'bg-red-100 text-red-700' },
  AFTER: { label: 'Depois', color: 'bg-green-100 text-green-700' },
  PROGRESS: { label: 'Progresso', color: 'bg-blue-100 text-blue-700' },
}

export default function PhotosPage() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
  const [filterType, setFilterType] = useState<string>('ALL')
  const [formData, setFormData] = useState({
    type: 'BEFORE',
    notes: '',
    file: null as File | null,
    preview: null as string | null,
  })

  useEffect(() => {
    if (!authLoading && user) {
      loadPhotos()
    }
  }, [authLoading, user])

  const loadPhotos = async () => {
    try {
      setLoading(true)
      const { getPhotos } = await import('@/lib/api')
      const data = await getPhotos()
      setPhotos(data)
    } catch (error) {
      console.error('Erro ao carregar fotos:', error)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        file,
        preview: URL.createObjectURL(file),
      })
    }
  }

  const handleUploadPhoto = async () => {
    if (!formData.file) return

    try {
      setUploading(true)
      const { uploadPhoto } = await import('@/lib/api')
      await uploadPhoto(formData.file, formData.type, formData.notes || undefined)

      setShowUploadModal(false)
      setFormData({
        type: 'BEFORE',
        notes: '',
        file: null,
        preview: null,
      })
      await loadPhotos()
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da foto. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta foto?')) {
      try {
        const { deletePhoto } = await import('@/lib/api')
        await deletePhoto(id)
        await loadPhotos()
      } catch (error) {
        console.error('Erro ao remover foto:', error)
        alert('Erro ao remover foto. Tente novamente.')
      }
    }
  }

  const filteredPhotos = filterType === 'ALL'
    ? photos
    : photos.filter(p => p.type === filterType)

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Fotos</h1>
            <p className="text-gray-600 mt-1">Acompanhe sua evolução através de fotos</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Foto
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total de Fotos</h3>
            <p className="text-2xl font-bold text-gray-900">{photos.length}</p>
          </div>
          {Object.entries(PHOTO_TYPES).map(([key, value]) => {
            const count = photos.filter(p => p.type === key).length
            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{value.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterType === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          {Object.entries(PHOTO_TYPES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* Photo Gallery */}
        {filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma foto encontrada</h3>
            <p className="text-gray-500">Adicione sua primeira foto para começar a acompanhar sua evolução</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${photo.filepath}`}
                    alt={photo.notes || 'Foto'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ESem imagem%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${PHOTO_TYPES[photo.type as keyof typeof PHOTO_TYPES]?.color}`}>
                      {PHOTO_TYPES[photo.type as keyof typeof PHOTO_TYPES]?.label}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-600">
                    {new Date(photo.date).toLocaleDateString('pt-BR')}
                  </p>
                  {photo.notes && (
                    <p className="text-sm text-gray-900 mt-1 line-clamp-2">{photo.notes}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePhoto(photo.id)
                  }}
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Adicionar Foto</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false)
                    setFormData({ type: 'BEFORE', notes: '', file: null, preview: null })
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Foto *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(PHOTO_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                  {formData.preview ? (
                    <div className="relative">
                      <img src={formData.preview} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
                      <button
                        onClick={() => setFormData({ ...formData, file: null, preview: null })}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 mb-2">Clique para selecionar uma foto</p>
                      <p className="text-sm text-gray-400">PNG, JPG até 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva o contexto da foto..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setFormData({ type: 'BEFORE', notes: '', file: null, preview: null })
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleUploadPhoto}
                disabled={!formData.file || uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Enviando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Details Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/${selectedPhoto.filepath}`}
              alt={selectedPhoto.notes || 'Foto'}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="bg-white p-6 rounded-b-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm px-3 py-1 rounded-full ${PHOTO_TYPES[selectedPhoto.type as keyof typeof PHOTO_TYPES]?.color}`}>
                  {PHOTO_TYPES[selectedPhoto.type as keyof typeof PHOTO_TYPES]?.label}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(selectedPhoto.date).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {selectedPhoto.notes && (
                <p className="text-gray-900 mt-4">{selectedPhoto.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
