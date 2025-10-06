'use client'

import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const is404Page = pathname === null || pathname === undefined

  // Pour les pages admin et 404, afficher seulement le contenu sans menu/footer
  if (isAdminPage || is404Page) {
    const childrenArray = Array.isArray(children) ? children : [children]
    const pageContent = childrenArray[4] || childrenArray[childrenArray.length - 1]
    return <>{pageContent}</>
  }

  // For regular pages, render all components
  const childrenArray = Array.isArray(children) ? children : [children]
  const [InfoBar, Navigation, Footer, pageContent, ...rest] = childrenArray

  return (
    <>
      {InfoBar}
      {Navigation}
      <main className="-mt-16">{pageContent}</main>
      {Footer}
      {rest}
    </>
  )
}
