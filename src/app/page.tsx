"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-education-gradient">
      {/* Elegant Background Elements */}
      <div className="absolute inset-0">
        {/* Soft geometric shapes with improved animations */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-education-accent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-green-100/30 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Elegant dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16 animate-content-appear"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main Title with elegant typography */}
          <motion.h1
            className="text-responsive-xl font-light mb-6 text-education-primary text-elegant leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          >
            Casino Escolar
          </motion.h1>

          {/* Elegant separator with enhanced design */}
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <motion.div 
              className="mx-6 w-3 h-3 bg-education-accent rounded-full shadow-soft"
              animate={{ 
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 4px 20px rgba(0, 0, 0, 0.08)",
                  "0 8px 40px rgba(16, 185, 129, 0.2)",
                  "0 4px 20px rgba(0, 0, 0, 0.08)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </motion.div>

          {/* Enhanced subtitle */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
          >
            <p className="text-responsive-base text-education-secondary leading-relaxed font-light text-clean mb-4">
              Gestión inteligente de alimentación escolar
            </p>
            <motion.p 
              className="text-education-accent font-medium text-clean text-lg"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Nutrición • Organización • Bienestar
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
        >
          {/* Login Button with enhanced hover effects */}
          <Link href="/auth/sign-in">
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group hover-lift"
            >
              <Button
                size="lg"
                className="text-clean shadow-soft hover:shadow-soft-lg group-hover:animate-subtle-glow"
              >
                <span>Iniciar Sesión</span>
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </Button>
            </motion.div>
          </Link>

          {/* Register Button with enhanced styling */}
          <Link href="/auth/sign-up">
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group hover-lift"
            >
              <Button
                size="lg"
                variant="outline"
                className="text-clean shadow-soft hover:shadow-soft-lg"
              >
                <span>Crear Cuenta</span>
                <motion.span
                  className="ml-2 inline-block"
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  +
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Enhanced Feature Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
        >
          {/* Feature 1 - Enhanced with glass effect */}
          <motion.div
            className="text-center group hover-lift glass-elegant rounded-2xl p-6"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div 
              className="w-16 h-16 bg-education-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-soft-lg transition-all duration-300"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-medium text-education-primary mb-3 text-clean">Gestión Intuitiva</h3>
            <p className="text-sm text-education-secondary leading-relaxed text-clean">
              Administra menús y pedidos de forma elegante y eficiente con nuestra interfaz moderna
            </p>
          </motion.div>

          {/* Feature 2 - Enhanced with glass effect */}
          <motion.div
            className="text-center group hover-lift glass-elegant rounded-2xl p-6"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-soft-lg transition-all duration-300"
              whileHover={{ rotate: -5, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-medium text-education-primary mb-3 text-clean">Nutrición Balanceada</h3>
            <p className="text-sm text-education-secondary leading-relaxed text-clean">
              Promovemos hábitos alimentarios saludables y conscientes para toda la comunidad
            </p>
          </motion.div>

          {/* Feature 3 - Enhanced with glass effect */}
          <motion.div
            className="text-center group hover-lift glass-elegant rounded-2xl p-6"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-soft-lg transition-all duration-300"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </motion.div>
            <h3 className="text-lg font-medium text-education-primary mb-3 text-clean">Comunidad Conectada</h3>
            <p className="text-sm text-education-secondary leading-relaxed text-clean">
              Uniendo familias, estudiantes y administración en un ecosistema educativo
            </p>
          </motion.div>
        </motion.div>

        {/* Enhanced Bottom Accent */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.div
            className="flex items-center space-x-3 text-education-secondary text-sm text-clean glass-elegant px-6 py-3 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              className="w-2 h-2 bg-education-accent rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="font-medium">Plataforma de gestión educativa</span>
            <motion.div 
              className="w-2 h-2 bg-education-accent rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}