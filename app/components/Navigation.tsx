'use client'

import Link from "next/link"
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
      ? "block w-full text-left px-4 py-3 rounded-lg transition-all duration-300"
      : "relative px-3 py-2 rounded-lg transition-all duration-300"
    const activeClass = "bg-blue-50"
    const inactiveClass = "hover:bg-gray-50"
    const activeTextColor = isActive(path) ? "text-blue-800" : "text-gray-700"
    const hoverTextColor = "hover:text-blue-700"

    return `${baseClass} ${activeClass && isActive(path) ? activeClass : inactiveClass} ${activeTextColor} ${hoverTextColor}`
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
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🚗</span>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              test psychotechnique permis
            </h1>
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex gap-2 text-sm font-medium items-center">
            <li>
              <Link href="/" className={navLinkClass('/')}>
                Accueil
                {isActive('/') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            </li>

            <li>
              <Link href="/a-propos" className={navLinkClass('/a-propos')}>
                À propos
                {isActive('/a-propos') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                className={`relative px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 ${(isActive('/invalidation-permis') || isActive('/suspension-permis') || isActive('/annulation-permis'))
                    ? 'text-blue-800 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                  }`}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {(isActive('/invalidation-permis') || isActive('/suspension-permis') || isActive('/annulation-permis')) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </button>

              <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${isServicesOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2'
                }`}>
                <div className="py-2">
                  {services.map((service, index) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-4 py-3 text-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:pl-6 ${isActive(service.href)
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                          : 'text-gray-700'
                        }`}
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></span>
                        {service.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </li>

            <li>
              <Link href="/contact" className={navLinkClass('/contact')}>
                Contact
                {isActive('/contact') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            </li>

            <li>
              <Link
                href="/rendez-vous"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-medium"
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
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 space-y-2 border-t border-gray-100">
            <Link href="/" className={navLinkClass('/', true)}>
              Accueil
              {isActive('/') && (
                <span className="absolute left-0 top-1/2 w-1 h-6 bg-blue-600 rounded-r-full -translate-y-1/2"></span>
              )}
            </Link>

            <Link href="/a-propos" className={navLinkClass('/a-propos', true)}>
              À propos
              {isActive('/a-propos') && (
                <span className="absolute left-0 top-1/2 w-1 h-6 bg-blue-600 rounded-r-full -translate-y-1/2"></span>
              )}
            </Link>

            <div className="space-y-2">
              <button
                onClick={toggleMobileServices}
                className={`${navLinkClass('/services', true)} flex items-center justify-between w-full`}
              >
                <span>Services</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isServicesOpen ? 'max-h-48' : 'max-h-0'}`}>
                <div className="pl-4 space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${isActive(service.href)
                        ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-60"></span>
                        {service.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/contact" className={navLinkClass('/contact', true)}>
              Contact
              {isActive('/contact') && (
                <span className="absolute left-0 top-1/2 w-1 h-6 bg-blue-600 rounded-r-full -translate-y-1/2"></span>
              )}
            </Link>

            <div className="pt-2">
              <Link
                href="/rendez-vous"
                className="block w-full text-center px-6 py-3 text-white rounded-lg transition-all duration-300 font-medium hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, var(--primary-navy), var(--primary-navy-light))`
                }}
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
