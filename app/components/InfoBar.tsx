'use client'

import { useState, useEffect } from "react"

export default function InfoBar() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className={`fixed top-0 left-0 right-0 z-[40] border-b border-white/20 bg-black/80 backdrop-blur-sm py-3 transition-transform duration-300 ${scrolled ? '-translate-y-full' : 'translate-y-0'
            }`} suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-x-4 md:gap-x-6 text-[10px] sm:text-xs md:text-sm text-white">
                    {/* Centre Clichy */}
                    <div className="flex items-center gap-x-2 sm:gap-x-3">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Clichy</span>
                        </div>
                        <span className="text-white/50">•</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <a href="tel:0765565379" className="font-semibold text-white hover:text-blue-300 transition-colors whitespace-nowrap tracking-wide">07.65.56.53.79</a>
                        </div>
                        <span className="text-white/50">•</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <a href="mailto:contact@test-psychotechnique-permis.com" className="font-medium text-white hover:text-blue-300 transition-colors truncate max-w-[100px] sm:max-w-none" title="contact@test-psychotechnique-permis.com">contact@...</a>
                        </div>
                    </div>

                    <span className="hidden lg:inline text-white/30">|</span>

                    {/* Centre Colombes */}
                    <div className="flex items-center gap-x-2 sm:gap-x-3">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">Colombes</span>
                        </div>
                        <span className="text-white/50">•</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <a href="tel:0972132250" className="font-semibold text-white hover:text-green-300 transition-colors whitespace-nowrap tracking-wide">09.72.13.22.50</a>
                        </div>
                        <span className="text-white/50">•</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <a href="mailto:reservation@mon-permis-auto.com" className="font-medium text-white hover:text-green-300 transition-colors truncate max-w-[100px] sm:max-w-none" title="reservation@mon-permis-auto.com">reservation@...</a>
                        </div>
                    </div>

                    <span className="hidden lg:inline text-white/50">•</span>
                    <div className="hidden lg:flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-white/70 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="whitespace-nowrap">Lun-Sam 9h-19h</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
