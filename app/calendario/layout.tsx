import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendario de Eventos - Mujeres en la Ciencia",
  description: "Descubre eventos, talleres y conferencias en ciencia y tecnología",
}

export default function CalendarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
