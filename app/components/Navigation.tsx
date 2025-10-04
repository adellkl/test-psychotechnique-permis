'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsServicesOpen(false)
  }, [pathname])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const navLinkClass = (path: string, isMobile = false) => {
    const baseClass = isMobile
      ? "block w-full text-left px-4 py-3 rounded-lg transition-all duration-200"
      : "relative px-4 py-2 transition-all duration-200 font-medium text-sm"
    const activeStyles = isActive(path)
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600"

    return `${baseClass} ${activeStyles}`
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleMobileServices = () => {
    setIsServicesOpen(!isServicesOpen)
  }

  const services = [
    { href: "/invalidation-permis", label: "Invalidation du permis" },
    { href: "/suspension-permis", label: "Suspension du permis" },
    { href: "/annulation-permis", label: "Annulation du permis" }
  ]

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <Image
                src="/images/logo site .png"
                alt="Logo Test Psychotechnique Permis"
                fill
                sizes="(max-width: 640px) 40px, 48px"
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              Test Psychotechnique Permis
            </h1>
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex gap-1 items-center">
            <li>
              <Link href="/" className={navLinkClass('/')}>
                Accueil
                {isActive('/') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                )}
              </Link>
            </li>

            <li>
              <Link href="/a-propos" className={navLinkClass('/a-propos')}>
                À propos
                {isActive('/a-propos') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                )}
              </Link>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`relative px-4 py-2 transition-all duration-200 flex items-center gap-1 font-medium text-sm ${(isActive('/invalidation-permis') || isActive('/suspension-permis') || isActive('/annulation-permis'))
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {(isActive('/invalidation-permis') || isActive('/suspension-permis') || isActive('/annulation-permis')) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                )}
              </button>

              <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${isServicesOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="py-2">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-4 py-3 text-sm transition-all duration-200 hover:bg-blue-50 ${isActive(service.href)
                          ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-600'
                          : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li>
              <Link href="/contact" className={navLinkClass('/contact')}>
                Contact
                {isActive('/contact') && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                )}
              </Link>
            </li>

            <li className="ml-4">
              <Link
                href="/rendez-vous"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Prendre rendez-vous
              </Link>
            </li>
          </ul>

          {/* Bouton Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1.5 focus:outline-none"
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Menu Mobile */}
        <div className={`lg:hidden overflow-y-auto transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2 border-t border-gray-100">
            <Link href="/" className={navLinkClass('/', true)}>
              Accueil
            </Link>

            <Link href="/a-propos" className={navLinkClass('/a-propos', true)}>
              À propos
            </Link>

            <div className="space-y-2">
              <button
                onClick={toggleMobileServices}
                className={`${navLinkClass('/services', true)} flex items-center justify-between w-full`}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${isServicesOpen ? 'max-h-48' : 'max-h-0'}`}>
                <div className="pl-4 space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-4 py-2 text-sm rounded-lg transition-all ${isActive(service.href)
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/contact" className={navLinkClass('/contact', true)}>
              Contact
            </Link>

            <div className="pt-2">
              <Link
                href="/rendez-vous"
                className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
