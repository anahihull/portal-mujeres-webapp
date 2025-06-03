"use client"

import { useState, useEffect } from "react"
import { Play, Calendar, User } from "lucide-react"

interface Entrevista {
  id: string
  titulo: string
  descripcion: string
  url_video: string
  url_imagen: string
  nombre_experta: string
  profesion_experta: string
  fecha_publicacion: string
}

export default function EntrevistasPage() {
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntrevistas()
  }, [])

  const fetchEntrevistas = async () => {
    try {
      const response = await fetch("/api/entrevistas")
      const data = await response.json()
      setEntrevistas(data)
    } catch (error) {
      console.error("Error fetching entrevistas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Entrevistas con Expertas
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Descubre historias inspiradoras de mujeres que están transformando el mundo de la ciencia y la tecnología
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {entrevistas.map((entrevista) => (
            <div key={entrevista.id} className="card-purple group">
              <div className="relative mb-4">
                <img
                  src={entrevista.url_imagen || "/placeholder.svg?height=200&width=400"}
                  alt={entrevista.titulo}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-colors">
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-pink-300 transition-colors">
                {entrevista.titulo}
              </h3>

              <p className="text-white/70 mb-4 line-clamp-3">{entrevista.descripcion}</p>

              <div className="flex items-center justify-between text-sm text-white/60">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{entrevista.nombre_experta}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(entrevista.fecha_publicacion).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-purple-300">{entrevista.profesion_experta}</div>
            </div>
          ))}
        </div>

        {entrevistas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No hay entrevistas disponibles</h3>
            <p className="text-white/70">Pronto tendremos contenido inspirador para ti</p>
          </div>
        )}
      </div>
    </div>
  )
}
