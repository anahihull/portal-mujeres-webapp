"use client"

import { useState, useEffect } from "react"
import { Calendar, MessageCircle, User, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"

interface Pregunta {
  id: number
  fecha: string
  content: string
}

interface Respuesta {
  id: number
  user_id: string
  pregunta_id: number
  response: string
  status_id: number
}

export default function PreguntasPage() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [respuestas, setRespuestas] = useState<{ [key: number]: Respuesta[] }>({})
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [loadingRespuestas, setLoadingRespuestas] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPreguntas()
  }, [])

  const fetchPreguntas = async () => {
    try {
      const response = await fetch("https://rqlt4vnfja.execute-api.us-east-1.amazonaws.com/api/preguntas")

      if (!response.ok) {
        throw new Error("Error al obtener preguntas")
      }

      const data = await response.json()
      setPreguntas(data)
    } catch (error) {
      console.error("Error fetching preguntas:", error)
      setError("Error al cargar las preguntas")
    } finally {
      setLoading(false)
    }
  }

  const fetchRespuestas = async (preguntaId: number) => {
    if (respuestas[preguntaId]) {
      // Ya tenemos las respuestas, solo voltear la carta
      toggleCard(preguntaId)
      return
    }

    setLoadingRespuestas((prev) => new Set(prev).add(preguntaId))

    try {
      const response = await fetch(
        `https://rqlt4vnfja.execute-api.us-east-1.amazonaws.com/api/respuestas/por-pregunta/${preguntaId}`,
      )

      if (!response.ok) {
        throw new Error("Error al obtener respuestas")
      }

      const data = await response.json()
      setRespuestas((prev) => ({
        ...prev,
        [preguntaId]: data,
      }))

      // Voltear la carta después de cargar las respuestas
      toggleCard(preguntaId)
    } catch (error) {
      console.error("Error fetching respuestas:", error)
    } finally {
      setLoadingRespuestas((prev) => {
        const newSet = new Set(prev)
        newSet.delete(preguntaId)
        return newSet
      })
    }
  }

  const toggleCard = (preguntaId: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(preguntaId)) {
        newSet.delete(preguntaId)
      } else {
        newSet.add(preguntaId)
      }
      return newSet
    })
  }

  const handleCardClick = (preguntaId: number) => {
    if (flippedCards.has(preguntaId)) {
      // Si ya está volteada, solo cambiar el estado
      toggleCard(preguntaId)
    } else {
      // Si no está volteada, cargar respuestas
      fetchRespuestas(preguntaId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-white mb-2">Error al cargar preguntas</h3>
          <p className="text-white/70">{error}</p>
          <button onClick={fetchPreguntas} className="btn-primary mt-4">
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Pregunta a una Experta
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Encuentra respuestas a preguntas frecuentes sobre ciencia, tecnología e ingeniería de expertas en el campo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {preguntas.map((pregunta) => {
            const isFlipped = flippedCards.has(pregunta.id)
            const isLoadingThis = loadingRespuestas.has(pregunta.id)
            const preguntaRespuestas = respuestas[pregunta.id] || []

            return (
              <div key={pregunta.id} className="relative h-64 perspective-1000">
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                  onClick={() => handleCardClick(pregunta.id)}
                >
                  {/* Frente de la carta - Pregunta */}
                  <div className="absolute inset-0 w-full h-full backface-hidden card-purple flex flex-col justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-purple-300">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Pregunta</span>
                        </div>
                        <div className="text-white/60 text-xs flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(pregunta.fecha).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>

                      <p className="text-white text-lg leading-relaxed mb-4">{pregunta.content}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-pink-300 text-sm font-medium">Haz clic para ver respuestas</div>
                      <div className="flex items-center space-x-1 text-pink-400">
                        <RotateCcw className="w-4 h-4" />
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Reverso de la carta - Respuestas */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 card-purple flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-green-300">
                        <User className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {preguntaRespuestas.length > 1 ? "Respuestas" : "Respuesta"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-pink-400">
                        <ChevronUp className="w-4 h-4" />
                        <RotateCcw className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {isLoadingThis ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                        </div>
                      ) : preguntaRespuestas.length > 0 ? (
                        <div className="space-y-3">
                          {preguntaRespuestas.map((respuesta, index) => (
                            <div key={respuesta.id} className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-purple-300">Experta {index + 1}</span>
                                <span className="text-xs text-white/60">#{respuesta.id}</span>
                              </div>
                              <p className="text-white/90 text-sm leading-relaxed">{respuesta.response}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-white/60">
                          <div className="text-center">
                            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No hay respuestas disponibles</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-center">
                      <div className="text-pink-300 text-sm">Haz clic para volver a la pregunta</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {preguntas.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No hay preguntas disponibles</h3>
            <p className="text-white/70">Pronto tendremos más preguntas y respuestas para ti</p>
          </div>
        )}

        {/* Estadísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-purple text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{preguntas.length}</div>
            <div className="text-white/80 text-sm">Preguntas Disponibles</div>
          </div>
          <div className="card-purple text-center">
            <div className="text-2xl font-bold text-pink-400 mb-1">
              {Object.values(respuestas).reduce((total, resp) => total + resp.length, 0)}
            </div>
            <div className="text-white/80 text-sm">Respuestas de Expertas</div>
          </div>
          <div className="card-purple text-center">
            <div className="text-2xl font-bold text-indigo-400 mb-1">{flippedCards.size}</div>
            <div className="text-white/80 text-sm">Respuestas Consultadas</div>
          </div>
        </div>
      </div>
    </div>
  )
}
