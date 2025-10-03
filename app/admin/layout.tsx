import "../globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administration - Permis Expert",
  description: "Espace administrateur pour la gestion des rendez-vous",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
