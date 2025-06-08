"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        {/* Soft geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* Logo Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative w-56 h-36 sm:w-72 sm:h-44 md:w-96 md:h-56 lg:w-[28rem] lg:h-64 xl:w-[32rem] xl:h-72">
              <Image
                src="/logo-colores.png"
                alt="Casino Escolar"
                fill
                className={`object-contain transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'brightness-125 contrast-125 saturate-110 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]' 
                    : 'brightness-100 contrast-110 saturate-105 drop-shadow-[0_0_20px_rgba(0,0,0,0.15)]'
                }`}
                priority
              />
            </div>
          </motion.div>

          {/* Elegant separator */}
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <div className="w-12 h-px bg-slate-300 dark:bg-slate-600" />
            <div className="mx-4 w-3 h-3 bg-emerald-400 dark:bg-emerald-500 rounded-full shadow-lg" />
            <div className="w-12 h-px bg-slate-300 dark:bg-slate-600" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            Gestión inteligente de alimentación escolar
            <br />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Nutrición • Organización • Bienestar</span>
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
        >
          {/* Login Button */}
          <Link href="/auth/login">
            <motion.div
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group"
            >
              <Button
                size="lg"
                className="px-10 py-5 text-lg font-medium bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Iniciar Sesión
                <motion.div
                  className="ml-3 w-5 h-5"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.div>
              </Button>
            </motion.div>
          </Link>

          {/* Register Button */}
          <Link href="/auth/registro">
            <motion.div
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group"
            >
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-5 text-lg font-medium bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Crear Cuenta
                <motion.div
                  className="ml-3 w-5 h-5"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  +
                </motion.div>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        >
          {/* Feature 1 */}
          <motion.div
            className="text-center group"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-200 group-hover:to-blue-300 dark:group-hover:from-blue-800/70 dark:group-hover:to-blue-700/70">
              <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Gestión Simple</h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Administra menús y pedidos de forma intuitiva y eficiente
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="text-center group"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-emerald-200 group-hover:to-emerald-300 dark:group-hover:from-emerald-800/70 dark:group-hover:to-emerald-700/70">
              <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Alimentación Saludable</h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Promovemos hábitos nutricionales balanceados y saludables
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="text-center group"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-amber-200 group-hover:to-amber-300 dark:group-hover:from-amber-800/70 dark:group-hover:to-amber-700/70">
              <svg className="w-10 h-10 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Comunidad Educativa</h3>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Conecta familias, estudiantes y administración escolar
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        >
          <motion.div
            className="flex items-center space-x-3 text-slate-400 dark:text-slate-500 text-sm"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
            <span style={{ fontFamily: "'Inter', sans-serif" }}>Sistema de gestión educativa</span>
            <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}