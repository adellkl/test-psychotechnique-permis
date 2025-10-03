'use client'

import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    // For admin pages, only render the page content (last child)
    const childrenArray = Array.isArray(children) ? children : [children]
    const pageContent = childrenArray[childrenArray.length - 1] // Get the last child (page content)
    return <main>{pageContent}</main>
  }

  // For regular pages, render all components
  const childrenArray = Array.isArray(children) ? children : [children]
  const [InfoBar, Navigation, Footer, pageContent] = childrenArray

  return (
    <>
      {InfoBar}
      {Navigation}
      <main className="-mt-16">{pageContent}</main>
      {Footer}
    </>
  )
}
