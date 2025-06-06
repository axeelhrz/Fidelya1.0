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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #e0e7ff 100%)'
      }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        {/* Soft geometric shapes */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: '5rem',
            right: '5rem',
            width: '24rem',
            height: '24rem',
            background: 'linear-gradient(135deg, rgba(147, 197, 253, 0.4) 0%, rgba(165, 180, 252, 0.4) 100%)',
            filter: 'blur(48px)'
          }}
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
          className="absolute rounded-full"
          style={{
            bottom: '5rem',
            left: '5rem',
            width: '20rem',
            height: '20rem',
            background: 'linear-gradient(135deg, rgba(167, 243, 208, 0.4) 0%, rgba(110, 231, 183, 0.4) 100%)',
            filter: 'blur(48px)'
          }}
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
        <div 
          className="absolute inset-0"
          style={{
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Title Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Title */}
          <motion.h1
            className="mb-4"
            style={{
              fontSize: 'clamp(3.75rem, 8vw, 6rem)',
              fontWeight: '300',
              color: '#1e293b',
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '-0.02em',
              lineHeight: '1'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            Casino Escolar
          </motion.h1>

          {/* Elegant separator */}
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <div 
              className="h-px"
              style={{
                width: '2rem',
                backgroundColor: '#cbd5e1'
              }}
            />
            <div 
              className="mx-4 rounded-full"
              style={{
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#4ade80'
              }}
            />
            <div 
              className="h-px"
              style={{
                width: '2rem',
                backgroundColor: '#cbd5e1'
              }}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.div
            className="max-w-2xl mx-auto leading-relaxed"
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: '#475569',
              fontWeight: '300',
              fontFamily: "'Inter', sans-serif"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          >
            <p>Gestión inteligente de alimentación escolar</p>
            <br />
            <span style={{ color: '#059669' }}>Nutrición • Organización • Bienestar</span>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
        >
          {/* Login Button */}
          <Link href="/auth/sign-in">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center rounded-xl transition-all duration-300"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '500',
                backgroundColor: '#1e293b',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }}
            >
              Iniciar Sesión
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>

          {/* Register Button */}
          <Link href="/auth/sign-up">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center rounded-xl transition-all duration-300"
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '500',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                color: '#374151',
                border: '2px solid #e5e7eb',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                minWidth: '200px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.color = '#059669';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }}
            >
              Crear Cuenta
              <motion.span
                className="ml-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                +
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
        >
          {/* Feature 1 */}
          <motion.div
            className="text-center group"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex items-center justify-center mx-auto mb-4 rounded-2xl transition-shadow duration-300"
              style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              <svg className="w-8 h-8" style={{ color: '#2563eb' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 
              className="mb-2"
              style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Gestión Simple
            </h3>
            <p 
              className="leading-relaxed"
              style={{
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Administra menús y pedidos de forma intuitiva
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="text-center group"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex items-center justify-center mx-auto mb-4 rounded-2xl transition-shadow duration-300"
              style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              <svg className="w-8 h-8" style={{ color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 
              className="mb-2"
              style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Alimentación Saludable
            </h3>
            <p 
              className="leading-relaxed"
              style={{
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Promovemos hábitos nutricionales balanceados
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="text-center group"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex items-center justify-center mx-auto mb-4 rounded-2xl transition-shadow duration-300"
              style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
            >
              <svg className="w-8 h-8" style={{ color: '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 
              className="mb-2"
              style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#1e293b',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Comunidad Educativa
            </h3>
            <p 
              className="leading-relaxed"
              style={{
                fontSize: '0.875rem',
                color: '#475569',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Conecta familias, estudiantes y administración
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          className="absolute text-center"
          style={{
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <motion.div
            className="flex items-center space-x-2"
            style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontFamily: "'Inter', sans-serif"
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div 
              className="rounded-full"
              style={{
                width: '0.25rem',
                height: '0.25rem',
                backgroundColor: '#94a3b8'
              }}
            />
            <span>Sistema de gestión educativa</span>
            <div 
              className="rounded-full"
              style={{
                width: '0.25rem',
                height: '0.25rem',
                backgroundColor: '#94a3b8'
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}