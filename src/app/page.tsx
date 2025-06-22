'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Building2, Store, Sparkles, Zap, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-violet-50/50 to-transparent rounded-full blur-3xl" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 py-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-black text-lg">F</span>
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 tracking-tight">Fidelita</div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Platform</div>
            </div>
          </Link>
          
          <nav className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              Iniciar Sesión
            </Link>
            <Link 
              href="/auth/register" 
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Registrarse
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              Fidelización
              <span className="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Inteligente
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              La plataforma que conecta asociaciones, comercios y socios en un ecosistema único de beneficios mutuos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth/register" 
                className="group px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
              >
                <Sparkles size={20} />
                Comenzar Ahora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link 
                href="/auth/login" 
                className="px-8 py-4 text-slate-700 font-semibold hover:text-slate-900 transition-colors duration-200 flex items-center gap-3"
              >
                <Shield size={20} />
                Ya soy miembro
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          >
            {[
              { icon: Building2, number: '500+', label: 'Asociaciones', color: 'text-blue-600' },
              { icon: Store, number: '2K+', label: 'Comercios', color: 'text-violet-600' },
              { icon: Users, number: '50K+', label: 'Socios Activos', color: 'text-emerald-600' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} className={stat.color} />
                    </div>
                    <div className="text-3xl font-black text-slate-900 mb-2">{stat.number}</div>
                    <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl p-12"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <Zap className="text-blue-600" size={24} />
              <h2 className="text-2xl font-black text-slate-900">¿Por qué Fidelita?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Simple', desc: 'Interfaz intuitiva y fácil de usar' },
                { title: 'Seguro', desc: 'Máxima protección de datos' },
                { title: 'Eficaz', desc: 'Resultados medibles y reales' },
              ].map((feature, index) => (
                <div key={feature.title} className="text-center">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative z-10 px-6 py-8 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-2">
          <Globe size={16} />
          <span>Hecho con ❤️ en España</span>
        </div>
        <p className="text-xs text-slate-400">
          © 2024 Fidelita. Todos los derechos reservados.
        </p>
      </motion.footer>
    </div>
  );
}