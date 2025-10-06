'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import InfoBar from './InfoBar'
import PageTransition from './PageTransition'
import CookieConsent from './CookieConsent'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [is404, setIs404] = useState(false)
  
  useEffect(() => {
    // Détecter si on est sur une page 404 en vérifiant le contenu
    const check404 = () => {
      const has404Content = document.querySelector('[data-404-page]')
      setIs404(!!has404Content)
    }
    
    check404()
    // Réexécuter après un court délai pour être sûr
    const timer = setTimeout(check404, 100)
    return () => clearTimeout(timer)
  }, [pathname])
  
  // Vérifier si nous sommes sur une page admin
  const isAdminPage = pathname?.startsWith('/admin')

  // Si c'est une page admin ou 404, afficher uniquement le contenu sans navigation/footer/infobar
  if (isAdminPage || is404) {
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
