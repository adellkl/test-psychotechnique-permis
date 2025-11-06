import "../globals.css"
import type { Metadata } from "next"
import { CenterProvider } from "./context/CenterContext"

export const metadata: Metadata = {
  title: "Administration - Permis Expert",
  description: "Espace administrateur pour la gestion des rendez-vous",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CenterProvider>
      {children}
    </CenterProvider>
  )
}
