"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de registro
    console.log("Sign up:", formData);
  };

  return (
    <div className="h-screen bg-gradient-magical flex items-center justify-center relative overflow-hidden py-8">
      {/* Elementos de fondo artísticos */}
      <div className="absolute inset-0">
        {/* Orbes flotantes específicos para registro */}
        <motion.div
          className="absolute top-20 left-16 w-96 h-96 bg-gradient-orb-signup-1 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-16 right-20 w-80 h-80 bg-gradient-orb-signup-2 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Partículas flotantes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-particle-signup rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0.2, 1.2, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        {/* Formulario con efecto de cristal */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-form-container rounded-2xl p-8 shadow-magical"
        >
          {/* Header del formulario */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-light text-gradient-auth-title mb-2 text-elegant">
              Únete a nosotros
            </h1>
            <p className="text-gradient-auth-subtitle text-clean">
              Crea tu cuenta en Casino Escolar
            </p>
            
            {/* Separador decorativo */}
            <motion.div
              className="w-16 h-px bg-gradient-separator mx-auto mt-4"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-5"
          >
            {/* Nombres */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gradient-label mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input-magical w-full"
                  placeholder="Tu nombre"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gradient-label mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input-magical w-full"
                  placeholder="Tu apellido"
                  required
                />
              </motion.div>
            </div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <label className="block text-sm font-medium text-gradient-label mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-magical w-full"
                placeholder="tu@email.com"
                required
              />
            </motion.div>

            {/* Rol */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <label className="block text-sm font-medium text-gradient-label mb-2">
                Tipo de Usuario
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="select-magical w-full"
                required
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="admin">Administrador</option>
                <option value="parent">Padre/Madre</option>
              </select>
            </motion.div>

            {/* Contraseñas */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <label className="block text-sm font-medium text-gradient-label mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-magical w-full"
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <label className="block text-sm font-medium text-gradient-label mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input-magical w-full"
                placeholder="••••••••"
                required
              />
            </motion.div>

            {/* Botón de envío */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="pt-4"
            >
              <motion.button
                type="submit"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="btn-auth-primary w-full group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-shine opacity-0 group-hover:opacity-100"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
                <span className="relative z-10">Crear Cuenta</span>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Separador */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="flex items-center my-6"
          >
            <div className="flex-1 h-px bg-gradient-separator-light"></div>
            <span className="px-4 text-sm text-gradient-muted">o</span>
            <div className="flex-1 h-px bg-gradient-separator-light"></div>
          </motion.div>

          {/* Enlace a login */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center"
          >
            <p className="text-sm text-gradient-muted">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/sign-in" className="text-gradient-link hover:text-gradient-link-hover transition-all duration-300 font-medium">
                Iniciar sesión
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Botón de regreso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center mt-6"
        >
          <Link href="/">
            <motion.button
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-back-home"
            >
              ← Volver al inicio
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
