'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'

export default function ModernHero() {
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Mémoriser le tableau pour éviter les re-renders
  const texts = useMemo(() => ['annulation ?', 'suspension ?', 'invalidation ?'], [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex]

      if (!isDeleting) {
        if (currentText.length < current.length) {
          setCurrentText(current.substring(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(current.substring(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, currentIndex, isDeleting, texts])

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }), [])

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  }), [])

  const itemTransition = useMemo(() => ({ duration: 0.4 }), [])

  return (
    <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden h-screen flex items-center justify-center pt-20">
      {/* Overlay to hide content below */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10"></div>
      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          willChange: 'background-position'
        }}
      />

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
        style={{ willChange: 'transform' }}
      />
      <motion.div
        className="absolute bottom-20 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
        style={{ willChange: 'transform' }}
      />

      {/* Floating Bubbles - Optimisé avec moins d'éléments */}
      {isMounted && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-blue-400/30 rounded-full blur-sm"
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
            y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            x: [null, Math.random() * 100 - 50],
            opacity: [0.3, 0.7, 0]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'linear'
          }}
          style={{ willChange: 'transform, opacity' }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 items-center text-left"
        >
          {/* Left Content */}
          <div className="space-y-8 z-10">
            {/* Title */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h1
                className="text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight"
                style={{
                  background: 'linear-gradient(to right, #fff, #93c5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  willChange: 'auto'
                }}
              >
                Centre de Test
                <br />
                <motion.span
                  className="text-blue-400"
                  animate={{
                    textShadow: ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 40px rgba(59, 130, 246, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)']
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ willChange: 'auto' }}
                >
                  Psychotechnique
                </motion.span>
                <br />
                Permis
                <br />
                <motion.span
                  className="text-red-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
                  style={{
                    background: 'linear-gradient(to right, #f87171, #dc2626)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {currentText || '\u00A0'}
                  <span className="animate-pulse ml-2">|</span>
                </motion.span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl"
              >
                En cas d'échec, une deuxième chance vous sera accordée{' '}
                <span className="font-bold text-emerald-400">gratuitement !</span>
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="tel:0765565379"
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-base sm:text-lg overflow-hidden shadow-lg shadow-blue-500/50"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="relative z-10">Appelez nous !</span>
                </Link>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href="/rendez-vous"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Prendre rendez-vous
                </Link>
              </motion.div>
            </motion.div>

            {/* Mobile Info Pills */}
            <motion.div
              variants={itemVariants}
              className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8"
            >
              <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-medium">Clichy (92)</span>
              </div>

              <a href="tel:0765565379" className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-white text-sm font-medium">07 65 56 53 79</span>
              </a>

              <a href="mailto:contact@test-psychotechnique-permis.com" className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors sm:col-span-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-white text-sm font-medium">contact@test-psychotechnique-permis.com</span>
              </a>

              <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full sm:col-span-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-white text-sm font-medium">Lun-Sam 9h-19h</span>
              </div>
            </motion.div>

          </div>

          {/* Right Side - iPhone Mockup */}
          <motion.div
            variants={itemVariants}
            className="relative hidden lg:block mt-16"
          >
            {/* iPhone Mockup */}
            <motion.div
              className="relative mx-auto"
              style={{ width: '340px', height: '680px', willChange: 'transform' }}
              animate={{
                y: [0, -15, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Particules orbitales animées autour de l'iPhone */}
              <motion.div
                className="absolute -top-8 left-12 w-2.5 h-2.5 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"
                animate={{
                  x: [0, 30, 0, -30, 0],
                  y: [0, -20, -40, -20, 0],
                  scale: [1, 1.2, 1, 1.2, 1],
                  opacity: [0.6, 0.9, 0.6, 0.9, 0.6]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-10 -left-8 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"
                animate={{
                  x: [0, -25, -40, -25, 0],
                  y: [0, 30, 0, -30, 0],
                  scale: [1, 1.3, 1, 1.3, 1],
                  opacity: [0.7, 1, 0.7, 1, 0.7]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute top-40 -left-10 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                animate={{
                  x: [0, -30, -50, -30, 0],
                  y: [0, -25, 0, 25, 0],
                  scale: [1, 1.4, 1, 1.4, 1],
                  opacity: [0.5, 0.8, 0.5, 0.8, 0.5]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <motion.div
                className="absolute bottom-32 -left-6 w-2.5 h-2.5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50"
                animate={{
                  x: [0, -35, -45, -35, 0],
                  y: [0, 20, 40, 20, 0],
                  scale: [1, 1.2, 1, 1.2, 1],
                  opacity: [0.6, 0.9, 0.6, 0.9, 0.6]
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.div
                className="absolute -bottom-10 left-24 w-3 h-3 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"
                animate={{
                  x: [0, 25, 45, 25, 0],
                  y: [0, 30, 50, 30, 0],
                  scale: [1, 1.3, 1, 1.3, 1],
                  opacity: [0.7, 1, 0.7, 1, 0.7]
                }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
              
              {/* Particules côté droit */}
              <motion.div
                className="absolute -top-6 right-16 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"
                animate={{
                  x: [0, 35, 50, 35, 0],
                  y: [0, -25, -35, -25, 0],
                  scale: [1, 1.3, 1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6, 0.9, 0.6]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
              <motion.div
                className="absolute top-20 -right-8 w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
                animate={{
                  x: [0, 40, 55, 40, 0],
                  y: [0, 20, 0, -20, 0],
                  scale: [1, 1.4, 1, 1.4, 1],
                  opacity: [0.7, 1, 0.7, 1, 0.7]
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              />
              <motion.div
                className="absolute top-52 -right-10 w-3 h-3 bg-rose-400 rounded-full shadow-lg shadow-rose-400/50"
                animate={{
                  x: [0, 45, 60, 45, 0],
                  y: [0, -30, 0, 30, 0],
                  scale: [1, 1.2, 1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5, 0.8, 0.5]
                }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              />
              <motion.div
                className="absolute bottom-40 -right-7 w-2 h-2 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50"
                animate={{
                  x: [0, 38, 48, 38, 0],
                  y: [0, 25, 40, 25, 0],
                  scale: [1, 1.3, 1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6, 0.9, 0.6]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              />
              <motion.div
                className="absolute -bottom-8 right-20 w-2.5 h-2.5 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50"
                animate={{
                  x: [0, 30, 42, 30, 0],
                  y: [0, 35, 48, 35, 0],
                  scale: [1, 1.4, 1, 1.4, 1],
                  opacity: [0.7, 1, 0.7, 1, 0.7]
                }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              
              {/* Particules en haut et en bas */}
              <motion.div
                className="absolute -top-10 left-1/2 w-2 h-2 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50"
                animate={{
                  x: [0, 20, 0, -20, 0],
                  y: [0, -30, -45, -30, 0],
                  scale: [1, 1.3, 1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6, 0.9, 0.6]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
              />
              <motion.div
                className="absolute -bottom-12 left-1/2 w-3 h-3 bg-fuchsia-400 rounded-full shadow-lg shadow-fuchsia-400/50"
                animate={{
                  x: [0, -25, 0, 25, 0],
                  y: [0, 35, 50, 35, 0],
                  scale: [1, 1.4, 1, 1.4, 1],
                  opacity: [0.7, 1, 0.7, 1, 0.7]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
              />

              {/* iPhone Frame with realistic shadows */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[55px] p-[3px] shadow-2xl">
                {/* Side buttons */}
                <div className="absolute left-0 top-24 w-[3px] h-8 bg-gray-700 rounded-r-sm"></div>
                <div className="absolute left-0 top-40 w-[3px] h-12 bg-gray-700 rounded-r-sm"></div>
                <div className="absolute left-0 top-56 w-[3px] h-12 bg-gray-700 rounded-r-sm"></div>
                <div className="absolute right-0 top-32 w-[3px] h-16 bg-gray-700 rounded-l-sm"></div>

                {/* Inner bezel */}
                <div className="absolute inset-[3px] bg-black rounded-[52px] shadow-inner">
                  {/* Notch with speaker */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-3xl z-20 flex items-center justify-center">
                    <div className="w-16 h-1.5 bg-gray-800 rounded-full mt-1"></div>
                  </div>

                  {/* Screen with slight bezel */}
                  <div className="absolute inset-[2px] bg-white rounded-[50px] overflow-hidden">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-black z-30 flex items-center justify-between px-6 pt-2">
                      {/* Left side - Time */}
                      <div className="text-white text-sm font-semibold">
                        9:41
                      </div>

                      {/* Right side - Status icons */}
                      <div className="flex items-center gap-1">
                        {/* Signal */}
                        <div className="flex items-end gap-0.5">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1.5 bg-white rounded-full"></div>
                          <div className="w-1 h-2 bg-white rounded-full"></div>
                          <div className="w-1 h-2.5 bg-white rounded-full"></div>
                        </div>

                        {/* WiFi */}
                        <svg className="w-4 h-4 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>

                        {/* Battery */}
                        <div className="flex items-center ml-1">
                          <div className="w-6 h-3 border border-white rounded-sm relative">
                            <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '80%' }}></div>
                          </div>
                          <div className="w-0.5 h-1.5 bg-white rounded-r-sm ml-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      </div>
                    </div>

                    {/* App Content with hidden scrollbar */}
                    <div
                      className="pt-16 px-5 pb-6 h-full overflow-y-auto scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      {/* Header */}
                      <div className="mb-5 mt-3">
                        <h2 className="text-xl font-bold text-gray-900">Mon Rendez-vous</h2>
                        <p className="text-xs text-gray-600">Test Psychotechnique</p>
                      </div>

                      {/* Success Message */}
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 mb-5 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-base">Réservation confirmée</p>
                            <p className="text-xs text-emerald-100">Email de confirmation envoyé</p>
                          </div>
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="text-xs text-gray-500 font-medium mb-2">INFORMATIONS CLIENT</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-900">Jean Dupont</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <p className="text-sm text-gray-700">j.dupont@email.fr</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <p className="text-sm text-gray-700">06 12 34 56 78</p>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="space-y-3">
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg">📅</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-blue-600 font-medium mb-1">DATE & HEURE</p>
                              <p className="text-sm font-bold text-gray-900">Lundi 15 Janvier 2025</p>
                              <p className="text-xs text-gray-600">10:00 - 12:00 (2h)</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg">📍</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-purple-600 font-medium mb-1">LOCALISATION</p>
                              <p className="text-sm font-bold text-gray-900">Centre Clichy</p>
                              <p className="text-xs text-gray-600">82 Rue Henri Barbusse</p>
                              <p className="text-xs text-gray-600">92110 Clichy</p>
                              <p className="text-xs text-purple-600 mt-1">🚇 3 min Métro ligne 13</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg">⭐</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-amber-600 font-medium mb-1">GARANTIE 2ÈME CHANCE</p>
                              <p className="text-sm font-bold text-gray-900">Offerte gratuitement</p>
                              <p className="text-xs text-gray-600">En cas d'échec au test</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg">💳</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-emerald-600 font-medium mb-1">PAIEMENT</p>
                              <p className="text-sm font-bold text-gray-900">Sur place uniquement</p>
                              <p className="text-xs text-gray-600">CB, espèces acceptées</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="mt-5 p-4 bg-gray-100 rounded-xl">
                        <p className="text-xs text-gray-600 font-medium mb-2">BESOIN D'AIDE ?</p>
                        <a href="tel:0765565379" className="flex items-center gap-2 text-blue-600">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="text-sm font-semibold">07 65 56 53 79</span>
                        </a>
                      </div>

                      {/* iOS Home Indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Realistic shadow */}
              <div className="absolute inset-0 rounded-[55px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] pointer-events-none"></div>

              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-[50px] bg-gradient-to-r from-blue-500/30 to-emerald-500/30 blur-3xl -z-10"
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
              />
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
