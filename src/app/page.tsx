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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Minimal geometric accent */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-emerald-50/30 to-blue-50/30 rounded-full blur-3xl"
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
        
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-light text-slate-800 mb-6 tracking-tight">
            Casino
          </h1>
          <h2 className="text-4xl md:text-5xl font-light text-emerald-600 mb-8 tracking-tight">
            Escolar
          </h2>
          
          {/* Elegant separator */}
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <div className="mx-4 w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          </motion.div>

          <motion.p
            className="text-lg text-slate-600 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Plataforma digital para la gestión de alimentación escolar
          </motion.p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/auth/sign-in">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Iniciar Sesión
              </Button>
            </motion.div>
          </Link>

          <Link href="/auth/sign-up">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-600 px-8 py-4 text-base font-medium rounded-xl bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300"
              >
                Crear Cuenta
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Minimal footer accent */}
        <motion.div
          className="mt-20 text-sm text-slate-400 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Nutrición • Organización • Bienestar
        </motion.div>
      </div>
    </div>
  );
}