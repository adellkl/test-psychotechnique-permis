'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'
import Footer from './Footer'
import InfoBar from './InfoBar'
import PageTransition from './PageTransition'
import CookieConsent from './CookieConsent'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Vérifier si nous sommes sur une page admin
  const isAdminPage = pathname?.startsWith('/admin')

  // Si c'est une page admin, afficher uniquement le contenu sans navigation/footer/infobar
  if (isAdminPage) {
    return (
      <>
        {children}
        <CookieConsent />
      </>
    )
  }

  // Sinon, afficher le layout complet avec navigation, infobar et footer
  return (
    <>
      <InfoBar />
      <Navigation />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      <CookieConsent />
    </>
  )
}
