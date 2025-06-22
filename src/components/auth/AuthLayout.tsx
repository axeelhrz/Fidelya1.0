'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle2, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false, 
  backHref = '/auth/register'
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header */}
        <header className="px-6 py-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-black text-lg">F</span>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 tracking-tight">Fidelita</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Platform</div>
              </div>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full">
                <Shield size={14} className="text-emerald-600" />
                <span className="text-xs font-medium text-slate-600">Seguro</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-full">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span className="text-xs font-medium text-slate-600">Verificado</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Back Button */}
            {showBackButton && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
              >
                <Link 
                  href={backHref}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  Volver
                </Link>
              </motion.div>
            )}

            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-600 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 shadow-xl"
            >
              {children}
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Sparkles size={14} />
            <span>© 2024 Fidelita - Plataforma premium</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}