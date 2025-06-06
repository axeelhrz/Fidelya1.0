"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function RegistroPage() {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  
  const [children, setChildren] = useState([
    {
      id: 1,
      name: "",
      age: "",
      class: "",
      level: "basico"
    }
  ])
  
  const [showChildrenSection, setShowChildrenSection] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleChildChange = (id: number, field: string, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ))
  }

  const addChild = () => {
    const newId = Math.max(...children.map(c => c.id)) + 1
    setChildren([...children, {
      id: newId,
      name: "",
      age: "",
      class: "",
      level: "basico"
    }])
  }

  const removeChild = (id: number) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const registrationData = {
      ...formData,
      children: showChildrenSection ? children.filter(child => child.name.trim() !== "") : []
    }
    console.log("Registro:", registrationData)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        {/* Soft geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        {/* Auth Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="auth-form-container rounded-2xl p-8">
            
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-light text-slate-800 mb-2 text-elegant">
                Únete a nosotros
              </h1>
              <p className="text-slate-600 text-clean">
                Crea tu cuenta en Casino Escolar
              </p>
              
              {/* Elegant separator */}
              <motion.div
                className="flex items-center justify-center mt-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-8 h-px bg-slate-300" />
                <div className="mx-4 w-2 h-2 bg-emerald-400 rounded-full" />
                <div className="w-8 h-px bg-slate-300" />
              </motion.div>
            </motion.div>

            {/* Registration Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-5"
            >
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <label className="label-educational">
                    Nombre
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Tu nombre"
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <label className="label-educational">
                    Apellido
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Tu apellido"
                    required
                  />
                </motion.div>
              </div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label className="label-educational">
                  Correo Electrónico
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  required
                />
              </motion.div>

              {/* Password Fields */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <label className="label-educational">
                  Contraseña
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <label className="label-educational">
                  Confirmar Contraseña
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </motion.div>

              {/* Children Section Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="pt-4"
              >
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 text-clean">
                      ¿Tienes hijos en el colegio?
                    </h3>
                    <p className="text-xs text-slate-500 text-clean mt-1">
                      Opcional: Agrega a tus hijos para gestionar sus menús
                    </p>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setShowChildrenSection(!showChildrenSection)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      showChildrenSection 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    {showChildrenSection ? 'Ocultar' : 'Agregar'}
                  </motion.button>
                </div>
              </motion.div>

              {/* Children Section */}
              {showChildrenSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="border-t border-slate-200 pt-4">
                    <h3 className="text-lg font-medium text-slate-800 mb-4 text-clean">
                      Información de tus hijos
                    </h3>
                    
                    {children.map((child, index) => (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 bg-white/60 rounded-xl border border-slate-200 mb-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-slate-700 text-clean">
                            Hijo {index + 1}
                          </h4>
                          {children.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChild(child.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="label-educational">
                              Nombre del niño/a
                            </label>
                            <Input
                              type="text"
                              value={child.name}
                              onChange={(e) => handleChildChange(child.id, 'name', e.target.value)}
                              placeholder="Nombre completo"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="label-educational">
                                Edad
                              </label>
                              <Input
                                type="number"
                                value={child.age}
                                onChange={(e) => handleChildChange(child.id, 'age', e.target.value)}
                                placeholder="Edad"
                                min="3"
                                max="18"
                              />
                            </div>
                            
                            <div>
                              <label className="label-educational">
                                Clase
                              </label>
                              <Input
                                type="text"
                                value={child.class}
                                onChange={(e) => handleChildChange(child.id, 'class', e.target.value)}
                                placeholder="Ej: 3°A, 1°B"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="label-educational">
                              Nivel Educativo
                            </label>
                            <select
                              value={child.level}
                              onChange={(e) => handleChildChange(child.id, 'level', e.target.value)}
                              className="select-educational"
                            >
                              <option value="basico">Educación Básica</option>
                              <option value="medio">Educación Media</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.button
                      type="button"
                      onClick={addChild}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-300 text-sm font-medium text-clean"
                    >
                      + Agregar otro hijo
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="pt-4"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="btn-auth-primary group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />
                    <span className="relative z-10">Crear Cuenta</span>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>

            {/* Separator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex items-center my-6"
            >
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="px-4 text-sm text-slate-500 text-clean">o</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-center"
            >
              <p className="text-sm text-slate-600 text-clean">
                ¿Ya tienes una cuenta?{" "}
                <Link 
                  href="/auth/login" 
                  className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 font-medium"
                >
                  Iniciar sesión
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-6"
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

        {/* Bottom accent */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        >
          <motion.div
            className="flex items-center space-x-2 text-slate-400 text-sm"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <span className="text-clean">Sistema de gestión educativa</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
