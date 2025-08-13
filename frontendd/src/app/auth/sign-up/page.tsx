'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import RoleSelector from '@/components/auth/RoleSelector';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '' as 'liga' | 'miembro' | 'club' | ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { register: registerUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role: 'liga' | 'miembro' | 'club') => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && formData.role) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (formData.password !== formData.password_confirmation) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setIsLoading(false);
      return;
    }

    if (!formData.role) {
      setError("Debes seleccionar un tipo de cuenta");
      setIsLoading(false);
      return;
    }

    try {
      await registerUser(formData as Required<typeof formData>);
    } catch (err: unknown) {
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      }

      const errorObj = err as ErrorResponse;

      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in errorObj &&
        typeof errorObj.response === 'object' &&
        errorObj.response !== null &&
        'data' in errorObj.response &&
        typeof errorObj.response.data === 'object' &&
        errorObj.response.data !== null &&
        'message' in errorObj.response.data
      ) {
        setError(errorObj.response?.data?.message || 'Ocurrió un error durante el registro');
      } else if (err instanceof Error) {
        setError(err.message || 'Ocurrió un error durante el registro');
      } else {
        setError('Ocurrió un error durante el registro');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-fuchsia-400/30 to-violet-600/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/30 to-cyan-600/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 right-20 w-6 h-6 bg-fuchsia-400/40 rounded-lg animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-60 left-20 w-4 h-4 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-40 right-32 w-5 h-5 bg-cyan-400/40 rounded-lg animate-bounce" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Enhanced Logo and Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-fuchsia-600 via-violet-600 to-purple-700 rounded-3xl flex items-center justify-center mb-8 shadow-strong relative overflow-hidden animate-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-white/10"></div>
            <svg className="w-12 h-12 text-white relative z-10 animate-float" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h1 className="font-display text-responsive-xl font-black text-gradient-primary mb-4 tracking-tight">
            Únete a Raquet Power
          </h1>
          <p className="text-gray-600 text-xl font-medium leading-relaxed">
            Crea tu cuenta y comienza tu{' '}
            <span className="font-display font-bold text-gradient-accent">experiencia deportiva</span>
          </p>
        </div>

        {/* Enhanced Progress Indicator */}
        <div className="mb-10">
          <div className="flex items-center justify-center space-x-6">
            <div className={`progress-step flex items-center justify-center w-12 h-12 rounded-2xl font-display text-sm font-black transition-all duration-500 ${
              currentStep >= 1 ? 'bg-gradient-to-br from-fuchsia-600 to-violet-700 text-white shadow-strong animate-glow' : 'bg-gray-200 text-gray-600 shadow-soft'
            }`}>
              1
            </div>
            <div className={`h-2 w-16 rounded-full transition-all duration-500 ${currentStep >= 2 ? 'bg-gradient-to-r from-fuchsia-600 to-violet-700 shadow-medium' : 'bg-gray-200'}`}></div>
            <div className={`progress-step flex items-center justify-center w-12 h-12 rounded-2xl font-display text-sm font-black transition-all duration-500 ${
              currentStep >= 2 ? 'bg-gradient-to-br from-fuchsia-600 to-violet-700 text-white shadow-strong animate-glow' : 'bg-gray-200 text-gray-600 shadow-soft'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-4 text-sm font-display font-semibold tracking-wide">
            <span className={`transition-colors duration-300 ${currentStep >= 1 ? 'text-gradient-primary' : 'text-gray-500'}`}>TIPO DE CUENTA</span>
            <span className={`transition-colors duration-300 ${currentStep >= 2 ? 'text-gradient-primary' : 'text-gray-500'}`}>INFORMACIÓN PERSONAL</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-strong rounded-3xl shadow-strong p-10 border border-white/30 relative overflow-hidden">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-50/50 via-transparent to-violet-50/50 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-purple-500"></div>
          
          <div className="relative z-10">
            {error && (
              <div className="error-message rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 p-5 backdrop-blur-sm mb-8">
                <div className="flex items-center">
                  <div className="text-red-500 mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="font-medium text-red-700">{error}</div>
                </div>
              </div>
            )}

            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-fade-in-up">
                <RoleSelector 
                  selectedRole={formData.role} 
                  onRoleSelect={handleRoleSelect} 
                />
                
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!formData.role}
                  className="btn-hover-lift w-full flex justify-center py-5 px-8 border border-transparent font-display text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-fuchsia-600 via-violet-600 to-purple-700 hover:from-fuchsia-700 hover:via-violet-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-strong hover:shadow-2xl disabled:transform-none disabled:hover:shadow-strong tracking-wide"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-white/10 rounded-2xl"></div>
                  <span className="relative z-10 flex items-center">
                    CONTINUAR
                    <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <form className="space-y-8 animate-slide-in-right" onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block font-display text-sm font-bold text-gray-800 mb-4 tracking-wide">
                      NOMBRE COMPLETO
                    </label>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-all duration-500 ${
                        focusedField === 'name' || formData.name ? 'text-fuchsia-600 scale-110' : 'text-gray-400'
                      }`}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="name"
                        required
                        className={`form-input block w-full pl-14 pr-5 py-5 border-2 rounded-2xl transition-all duration-500 glass text-gray-900 placeholder-gray-500 font-medium ${
                          focusedField === 'name' 
                            ? 'border-fuchsia-500 shadow-strong shadow-fuchsia-500/25 bg-white/90 scale-[1.02]' 
                            : formData.name 
                              ? 'border-emerald-300 bg-emerald-50/50 shadow-medium' 
                              : 'border-gray-200 hover:border-gray-300 shadow-soft'
                        } focus:outline-none focus:ring-0`}
                        placeholder="Tu nombre completo"
                      />
                      {formData.name && (
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center animate-fade-in-up">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-display text-sm font-bold text-gray-800 mb-4 tracking-wide">
                      CORREO ELECTRÓNICO
                    </label>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-all duration-500 ${
                        focusedField === 'email' || formData.email ? 'text-fuchsia-600 scale-110' : 'text-gray-400'
                      }`}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="email"
                        required
                        className={`form-input block w-full pl-14 pr-5 py-5 border-2 rounded-2xl transition-all duration-500 glass text-gray-900 placeholder-gray-500 font-medium ${
                          focusedField === 'email' 
                            ? 'border-fuchsia-500 shadow-strong shadow-fuchsia-500/25 bg-white/90 scale-[1.02]' 
                            : formData.email 
                              ? 'border-emerald-300 bg-emerald-50/50 shadow-medium' 
                              : 'border-gray-200 hover:border-gray-300 shadow-soft'
                        } focus:outline-none focus:ring-0`}
                        placeholder="tu@email.com"
                      />
                      {formData.email && (
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center animate-fade-in-up">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block font-display text-sm font-bold text-gray-800 mb-4 tracking-wide">
                      CONTRASEÑA
                    </label>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-all duration-500 ${
                        focusedField === 'password' || formData.password ? 'text-fuchsia-600 scale-110' : 'text-gray-400'
                      }`}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="new-password"
                        required
                        className={`form-input block w-full pl-14 pr-14 py-5 border-2 rounded-2xl transition-all duration-500 glass text-gray-900 placeholder-gray-500 font-medium ${
                          focusedField === 'password' 
                            ? 'border-fuchsia-500 shadow-strong shadow-fuchsia-500/25 bg-white/90 scale-[1.02]' 
                            : formData.password 
                              ? 'border-emerald-300 bg-emerald-50/50 shadow-medium' 
                              : 'border-gray-200 hover:border-gray-300 shadow-soft'
                        } focus:outline-none focus:ring-0`}
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-5 flex items-center group"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block font-display text-sm font-bold text-gray-800 mb-4 tracking-wide">
                      CONFIRMAR CONTRASEÑA
                    </label>
                    <div className="relative group">
                      <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-all duration-500 ${
                        focusedField === 'password_confirmation' || formData.password_confirmation ? 'text-fuchsia-600 scale-110' : 'text-gray-400'
                      }`}>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password_confirmation')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="new-password"
                        required
                        className={`form-input block w-full pl-14 pr-14 py-5 border-2 rounded-2xl transition-all duration-500 glass text-gray-900 placeholder-gray-500 font-medium ${
                          focusedField === 'password_confirmation' 
                            ? 'border-fuchsia-500 shadow-strong shadow-fuchsia-500/25 bg-white/90 scale-[1.02]' 
                            : formData.password_confirmation 
                              ? 'border-emerald-300 bg-emerald-50/50 shadow-medium' 
                              : 'border-gray-200 hover:border-gray-300 shadow-soft'
                        } focus:outline-none focus:ring-0`}
                        placeholder="Repite tu contraseña"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-5 flex items-center group"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-gray-400 hover:text-gray-600 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-hover-lift flex-1 flex justify-center py-5 px-6 border-2 border-gray-200 rounded-2xl font-display text-lg font-bold text-gray-700 glass hover:bg-white/90 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all duration-500 shadow-soft hover:shadow-medium tracking-wide"
                  >
                    <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    ATRÁS
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-hover-lift flex-1 flex justify-center py-5 px-6 border border-transparent font-display text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-fuchsia-600 via-violet-600 to-purple-700 hover:from-fuchsia-700 hover:via-violet-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-strong hover:shadow-2xl disabled:transform-none disabled:hover:shadow-strong tracking-wide"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-white/10 rounded-2xl"></div>
                    {isLoading ? (
                      <div className="flex items-center relative z-10">
                        <div className="spinner mr-3"></div>
                        CREANDO CUENTA...
                      </div>
                    ) : (
                      <span className="relative z-10">CREAR CUENTA</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Sign In Link */}
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 glass font-display font-semibold text-gray-600 tracking-wide">¿YA TIENES CUENTA?</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/auth/sign-in"
                  className="btn-hover-lift w-full flex justify-center py-5 px-8 border-2 border-gray-200 rounded-2xl font-display text-lg font-bold text-gray-700 glass hover:bg-white/90 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all duration-500 shadow-soft hover:shadow-medium tracking-wide"
                >
                  INICIAR SESIÓN
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-10">
          <p className="text-gray-500 leading-relaxed font-medium">
            Al crear una cuenta, aceptas nuestros{' '}
            <span className="font-semibold text-gradient-secondary cursor-pointer hover:underline">términos de servicio</span>
            {' '}y{' '}
            <span className="font-semibold text-gradient-secondary cursor-pointer hover:underline">política de privacidad</span>
          </p>
        </div>
      </div>
    </div>
  );
}