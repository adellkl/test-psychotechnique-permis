"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [servicesDesktopOpen, setServicesDesktopOpen] = useState(false)
  const [servicesMobileOpen, setServicesMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isHomePage = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setServicesMobileOpen(false)
    document.body.style.overflow = 'auto'
  }, [pathname])

  const toggleMenu = () => {
    const newState = !menuOpen
    setMenuOpen(newState)
    document.body.style.overflow = newState ? 'hidden' : 'auto'
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const links = [
    { href: '/', label: 'Accueil', icon: '🏠' },
    { href: '/a-propos', label: 'À propos', icon: 'ℹ️' },
    { href: '/contact', label: 'Contact', icon: '✉️' },
    { href: '/agrement-prefectoral', label: 'Agrément Préfectoral', icon: '📋' },
    { href: '/mentions-legales', label: 'Mentions Légales', icon: '⚖️' },
  ]

  const services = [
    { href: '/invalidation-permis', label: 'Invalidation du permis' },
    { href: '/suspension-permis', label: 'Suspension du permis' },
    { href: '/annulation-permis', label: 'Annulation du permis' },
  ]

  return (
    <header className={`fixed ${scrolled ? 'top-0' : 'top-12'} left-0 right-0 z-50 transition-all duration-300 ${isHomePage && !scrolled ? 'bg-transparent backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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
            <span className={`font-bold text-lg transition-colors hidden sm:block ${isHomePage && !scrolled ? 'text-white' : 'text-gray-900'}`}>
              Test Psychotechnique
            </span>
            <span className={`font-bold text-base transition-colors sm:hidden ${isHomePage && !scrolled ? 'text-white' : 'text-gray-900'}`}>
              Test Psychotechnique Permis
            </span>
          </Link>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex gap-1 items-center">
            <li>
              <Link
                href="/"
                className={`relative px-4 py-2 transition-all duration-200 font-medium text-sm ${isActive('/')
                  ? isHomePage && !scrolled
                    ? 'text-blue-400 font-semibold'
                    : 'text-blue-600 font-semibold'
                  : isHomePage && !scrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-800 hover:text-blue-600'
                  }`}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/a-propos"
                className={`relative px-4 py-2 transition-all duration-200 font-medium text-sm ${isActive('/a-propos')
                  ? isHomePage && !scrolled
                    ? 'text-blue-400 font-semibold'
                    : 'text-blue-600 font-semibold'
                  : isHomePage && !scrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-800 hover:text-blue-600'
                  }`}
              >
                À propos
              </Link>
            </li>
            {/* Services Desktop */}
            <li
              className="relative"
              onMouseEnter={() => setServicesDesktopOpen(true)}
              onMouseLeave={() => setServicesDesktopOpen(false)}
            >
              <button
                className={`relative px-4 py-2 transition-all duration-200 flex items-center gap-1 font-medium text-sm ${(isActive('/invalidation-permis') || isActive('/suspension-permis') || isActive('/annulation-permis'))
                  ? isHomePage && !scrolled
                    ? 'text-blue-400 font-semibold'
                    : 'text-blue-600 font-semibold'
                  : isHomePage && !scrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${servicesDesktopOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${servicesDesktopOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
              >
                <div className="py-2">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-4 py-3 text-sm transition-all duration-200 hover:bg-blue-50 ${isActive(service.href) ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
                        }`}
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
            <li>
              <Link
                href="/contact"
                className={`relative px-4 py-2 transition-all duration-200 font-medium text-sm ${isActive('/contact')
                  ? isHomePage && !scrolled
                    ? 'text-blue-400 font-semibold'
                    : 'text-blue-600 font-semibold'
                  : isHomePage && !scrolled
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-800 hover:text-blue-600'
                  }`}
              >
                Contact
              </Link>
            </li>
            <li className="ml-4">
              <Link
                href="/rendez-vous"
                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${isHomePage && !scrolled ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                Prendre rendez-vous
              </Link>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none"
          >
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isHomePage && !scrolled ? 'bg-white' : 'bg-gray-800'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isHomePage && !scrolled ? 'bg-white' : 'bg-gray-800'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isHomePage && !scrolled ? 'bg-white' : 'bg-gray-800'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Menu Burger Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay avec effet blur */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
              onClick={toggleMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ willChange: 'opacity' }}
            />

            {/* Panneau menu avec effet glass */}
            <motion.div
              className="fixed top-0 right-0 w-[85vw] max-w-[380px] bg-white/95 backdrop-blur-xl z-[101] lg:hidden flex flex-col shadow-2xl border-l border-gray-200/50"
              style={{ height: '100vh', maxHeight: '100vh', willChange: 'transform' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35, mass: 0.8 }}
            >
              {/* En-tête moderne sans logo */}
              <div className="relative px-6 flex-shrink-0 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm h-16">
                <div className="flex items-center justify-between h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-gray-900 font-bold text-lg">Navigation</h2>
                      <p className="text-gray-500 text-xs">Menu principal</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleMenu}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl group"
                  >
                    <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Zone scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain bg-gradient-to-br from-gray-50/50 via-blue-50/30 to-indigo-50/50">
                {/* Navigation principale */}
                <div className="px-3 py-4 space-y-2 mx-4 mt-4 mb-4">
                  {/* Accueil */}
                  <Link
                    href="/"
                    onClick={toggleMenu}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive('/')
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                      : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive('/') ? 'bg-white/20' : 'bg-blue-100 group-hover:bg-blue-200'
                      }`}>
                      <svg className={`w-4 h-4 ${isActive('/') ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold">Accueil</span>
                  </Link>

                  {/* À propos */}
                  <Link
                    href="/a-propos"
                    onClick={toggleMenu}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive('/a-propos')
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                      : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive('/a-propos') ? 'bg-white/20' : 'bg-purple-100 group-hover:bg-purple-200'
                      }`}>
                      <svg className={`w-4 h-4 ${isActive('/a-propos') ? 'text-white' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold">À propos</span>
                  </Link>

                  {/* Contact */}
                  <Link
                    href="/contact"
                    onClick={toggleMenu}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${isActive('/contact')
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                      : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive('/contact') ? 'bg-white/20' : 'bg-green-100 group-hover:bg-green-200'
                      }`}>
                      <svg className={`w-4 h-4 ${isActive('/contact') ? 'text-white' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold">Contact</span>
                  </Link>

                  {/* Services avec sous-menu */}
                  <button
                    onClick={() => setServicesMobileOpen(!servicesMobileOpen)}
                    className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all duration-300 group ${servicesMobileOpen || services.some((s) => isActive(s.href))
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                      : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${servicesMobileOpen || services.some((s) => isActive(s.href)) ? 'bg-white/20' : 'bg-orange-100 group-hover:bg-orange-200'
                        }`}>
                        <svg className={`w-4 h-4 ${servicesMobileOpen || services.some((s) => isActive(s.href)) ? 'text-white' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold">Services</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${servicesMobileOpen ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Sous-menu Services */}
                  {servicesMobileOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-8 space-y-2 mt-2 overflow-hidden"
                    >
                      <Link
                        href="/invalidation-permis"
                        onClick={toggleMenu}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive('/invalidation-permis')
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md'
                          : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-sm'
                          }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${isActive('/invalidation-permis') ? 'bg-white' : 'bg-red-500'}`} />
                        <span className="font-semibold text-xs">Invalidation du permis</span>
                      </Link>
                      <Link
                        href="/suspension-permis"
                        onClick={toggleMenu}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive('/suspension-permis')
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md'
                          : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-sm'
                          }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${isActive('/suspension-permis') ? 'bg-white' : 'bg-yellow-500'}`} />
                        <span className="font-semibold text-xs">Suspension du permis</span>
                      </Link>
                      <Link
                        href="/annulation-permis"
                        onClick={toggleMenu}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive('/annulation-permis')
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                          : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-sm'
                          }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${isActive('/annulation-permis') ? 'bg-white' : 'bg-red-500'}`} />
                        <span className="font-semibold text-xs">Annulation du permis</span>
                      </Link>
                    </motion.div>
                  )}

                  {/* Bouton Prendre rendez-vous */}
                  <Link
                    href="/rendez-vous"
                    onClick={toggleMenu}
                    className="flex items-center justify-center gap-2.5 w-full px-5 py-4 mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Prendre rendez-vous</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
