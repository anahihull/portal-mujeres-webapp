"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, DollarSign, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Evento {
  id: number
  fecha: string
  titulo: string
  descripcion: string
  costo: string
  evento_url: string
  status_id: number
}

export default function CalendarioPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEventos()
  }, [])

  const fetchEventos = async () => {
    try {
      const response = await fetch(
        "https://rqlt4vnfja.execute-api.us-east-1.amazonaws.com/api/eventos/filtrados?status=aprobado",
      )

      if (!response.ok) {
        throw new Error("Error al obtener eventos")
      }

      const data = await response.json()
      setEventos(data)
    } catch (error) {
      console.error("Error fetching eventos:", error)
      setError("Error al cargar los eventos")
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return eventos.filter((evento) => {
      const eventoDate = new Date(evento.fecha).toISOString().split("T")[0]
      return eventoDate === dateString
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const formatCurrency = (amount: string) => {
    const num = Number.parseFloat(amount)
    if (num === 0) return "Gratis"
    return `$${num.toFixed(2)}`
  }

  const handleEventClick = (evento: Evento) => {
    setSelectedEvent(evento)
  }

  const handleEventUrlClick = (url: string) => {
    let formattedUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`
    }
    window.open(formattedUrl, "_blank")
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-white/10 bg-white/5">
          {/* Empty cell */}
        </div>,
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = getEventsForDate(date)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <div
          key={day}
          className={`h-24 border border-white/10 bg-white/5 p-1 hover:bg-white/10 transition-colors ${
            isToday ? "bg-purple-500/20 border-purple-400" : ""
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-purple-300" : "text-white"}`}>{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((evento) => (
              <div
                key={evento.id}
                onClick={() => handleEventClick(evento)}
                className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white px-1 py-0.5 rounded cursor-pointer hover:from-pink-600 hover:to-purple-700 transition-colors truncate"
              >
                {evento.titulo}
              </div>
            ))}
            {dayEvents.length > 2 && <div className="text-xs text-white/60">+{dayEvents.length - 2} más</div>}
          </div>
        </div>,
      )
    }

    return days
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
          <h3 className="text-2xl font-semibold text-white mb-2">Error al cargar eventos</h3>
          <p className="text-white/70">{error}</p>
          <button onClick={fetchEventos} className="btn-primary mt-4">
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Calendario de Eventos
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Descubre eventos, talleres, conferencias y oportunidades en ciencia y tecnología
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth("prev")}
                      className="text-white hover:bg-white/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateMonth("next")}
                      className="text-white hover:bg-white/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-white/70 font-medium py-2 text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-0 border border-white/10 rounded-lg overflow-hidden">
                  {renderCalendar()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Details / Upcoming Events */}
          <div className="space-y-6">
            {selectedEvent ? (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Detalles del Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedEvent.titulo}</h3>
                    <p className="text-white/70">{selectedEvent.descripcion}</p>
                  </div>

                  <div className="flex items-center space-x-2 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedEvent.fecha).toLocaleDateString("es-ES")}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-white/80">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(selectedEvent.costo)}</span>
                  </div>

                  {selectedEvent.evento_url && (
                    <Button
                      onClick={() => handleEventUrlClick(selectedEvent.evento_url)}
                      className="w-full btn-primary"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Más información
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => setSelectedEvent(null)}
                    className="w-full text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Cerrar detalles
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Próximos Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {eventos
                      .filter((evento) => new Date(evento.fecha) >= new Date())
                      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                      .slice(0, 5)
                      .map((evento) => (
                        <div
                          key={evento.id}
                          onClick={() => handleEventClick(evento)}
                          className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                        >
                          <h4 className="text-white font-medium text-sm">{evento.titulo}</h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-white/60 text-xs">
                              {new Date(evento.fecha).toLocaleDateString("es-ES")}
                            </span>
                            <span className="text-purple-300 text-xs">{formatCurrency(evento.costo)}</span>
                          </div>
                        </div>
                      ))}
                    {eventos.filter((evento) => new Date(evento.fecha) >= new Date()).length === 0 && (
                      <p className="text-white/70 text-center py-4">No hay eventos próximos</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats */}
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{eventos.length}</div>
                  <div className="text-white/80 text-sm">Eventos Disponibles</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
