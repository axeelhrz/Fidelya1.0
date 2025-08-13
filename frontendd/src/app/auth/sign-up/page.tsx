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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-medium">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <h1 className="font-display text-responsive-xl font-bold text-primary mb-2">
            Únete a Raquet Power
          </h1>
          <p className="text-secondary">
            Crea tu cuenta y comienza tu experiencia deportiva
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div className={`progress-step flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
            currentStep >= 1 ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`h-1 w-12 rounded-full transition-all duration-300 ${
            currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'
          }`}></div>
          <div className={`progress-step flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
            currentStep >= 2 ? 'bg-primary text-white shadow-soft' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>

        <div className="flex justify-between text-sm text-secondary">
          <span>Tipo de cuenta</span>
          <span>Información personal</span>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-medium p-8 border border-gray-100">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-500 mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-red-700 font-medium">{error}</div>
              </div>
            </div>
          )}

          {/* Step 1: Role Selection */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <RoleSelector 
                selectedRole={formData.role} 
                onRoleSelect={handleRoleSelect} 
              />
              
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!formData.role}
                className="btn-primary w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <form className="space-y-6 animate-slide-in" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'name' || formData.name ? 'text-accent' : 'text-gray-400'
                    }`}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
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
                      className={`form-input block w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 text-primary placeholder-gray-400 ${
                        focusedField === 'name' 
                          ? 'border-primary bg-blue-50/50' 
                          : formData.name 
                            ? 'border-emerald-300 bg-emerald-50/50' 
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                      } focus:outline-none focus:ring-0`}
                      placeholder="Tu nombre completo"
                    />
                    {formData.name && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'email' || formData.email ? 'text-accent' : 'text-gray-400'
                    }`}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-9 9c1.657 0 3-1.007 3-2.25" />
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
                      className={`form-input block w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 text-primary placeholder-gray-400 ${
                        focusedField === 'email' 
                          ? 'border-primary bg-blue-50/50' 
                          : formData.email 
                            ? 'border-emerald-300 bg-emerald-50/50' 
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                      } focus:outline-none focus:ring-0`}
                      placeholder="tu@email.com"
                    />
                    {formData.email && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'password' || formData.password ? 'text-accent' : 'text-gray-400'
                    }`}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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
                      className={`form-input block w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-200 text-primary placeholder-gray-400 ${
                        focusedField === 'password' 
                          ? 'border-primary bg-blue-50/50' 
                          : formData.password 
                            ? 'border-emerald-300 bg-emerald-50/50' 
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                      } focus:outline-none focus:ring-0`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-primary mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'password_confirmation' || formData.password_confirmation ? 'text-accent' : 'text-gray-400'
                    }`}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                      className={`form-input block w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-200 text-primary placeholder-gray-400 ${
                        focusedField === 'password_confirmation' 
                          ? 'border-primary bg-blue-50/50' 
                          : formData.password_confirmation 
                            ? 'border-emerald-300 bg-emerald-50/50' 
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                      } focus:outline-none focus:ring-0`}
                      placeholder="Repite tu contraseña"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="btn-secondary flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-subtle"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1 flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-3"></div>
                      Creando cuenta...
                    </div>
                  ) : (
                    'Crear cuenta'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sign In Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary">¿Ya tienes cuenta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/sign-in"
                className="btn-secondary w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-semibold text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-subtle"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-secondary">
            Al crear una cuenta, aceptas nuestros{' '}
            <a href="#" className="text-accent hover:underline">términos de servicio</a>
            {' '}y{' '}
            <a href="#" className="text-accent hover:underline">política de privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
}