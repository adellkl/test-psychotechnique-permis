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
        <div className={`fixed top-0 left-0 right-0 z-[40] bg-slate-900 border-b border-slate-800 transition-transform duration-300 ${scrolled ? '-translate-y-full' : 'translate-y-0'
            }`} suppressHydrationWarning>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between py-2 sm:py-3 gap-2 sm:gap-0">
                    {/* Centre */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-slate-400 text-xs sm:text-sm font-medium">Clichy</span>
                        <a href="tel:0765565379" className="text-white hover:text-blue-400 text-xs sm:text-sm font-semibold transition-colors">
                            07 65 56 53 79
                        </a>
                    </div>

                    {/* Horaires */}
                    <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Lun-Sam 9h-20h</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
