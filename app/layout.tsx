import "./globals.css"
import type { Metadata } from "next"
import InfoBar from "./components/InfoBar"
import Navigation from "./components/Navigation"
import Footer from "./components/Footer"
import ClientLayout from "./components/ClientLayout"

export const metadata: Metadata = {
  title: "Permis Expert",
  description: "Site moderne pour gestion du permis (invalidation, suspension, annulation, etc.)",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ClientLayout>
          <InfoBar />
          <Navigation />
          <Footer />
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
