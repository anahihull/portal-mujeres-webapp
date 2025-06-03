import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pregunta a una Experta - Mujeres en la Ciencia",
  description: "Encuentra respuestas a preguntas sobre ciencia y tecnología de expertas en el campo",
}

export default function PreguntasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
