'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      type ErrorResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      const errorObj = err as ErrorResponse;

      if (
        typeof err === 'object' &&
        err !== null &&
        errorObj.response &&
        typeof errorObj.response === 'object' &&
        errorObj.response.data &&
        typeof errorObj.response.data === 'object' &&
        'message' in errorObj.response.data
      ) {
        setError(errorObj.response.data.message || 'Ocurrió un error durante el inicio de sesión');
      } else {
        setError('Ocurrió un error durante el inicio de sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/30 to-purple-600/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/30 to-blue-600/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-r from-fuchsia-400/20 to-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-violet-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-cyan-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-32 left-32 w-5 h-5 bg-pink-400/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Enhanced Logo and Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 rounded-3xl flex items-center justify-center mb-8 shadow-strong relative overflow-hidden animate-glow">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-white/10"></div>
            <svg className="w-12 h-12 text-white relative z-10 animate-float" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h1 className="font-display text-responsive-xl font-black text-gradient-primary mb-4 tracking-tight">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-gray-600 text-xl font-medium leading-relaxed">
            Inicia sesión en tu cuenta de{' '}
            <span className="font-display font-bold text-gradient-secondary">Raquet Power</span>
          </p>
        </div>

        {/* Enhanced Sign In Form */}
        <div className="glass-strong rounded-3xl shadow-strong p-10 border border-white/30 relative overflow-hidden">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-cyan-50/50 rounded-3xl"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>
          
          <div className="relative z-10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 p-5 backdrop-blur-sm">
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
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block font-display text-sm font-bold text-gray-800 mb-4 tracking-wide">
                    CORREO ELECTRÓNICO
                  </label>
                  <div className="relative group">
                    <div className={`absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-all duration-500 ${
                      focusedField === 'email' || email ? 'text-violet-600 scale-110' : 'text-gray-400'
                    }`}>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="email"
                      required
                      className={`form-input block w-full pl-14 pr-5 py-5 border-2 rounded-2xl transition-all duration-500 glass text-gray-900 placeholder-gray-500 font-medium ${
                        focusedField === 'email' 
                          ? 'border-violet-500 shadow-strong shadow-violet-500/25 bg-white/90 scale-[1.02]' 
                          : email 
                            ? 'border-emerald-300 bg-emerald-50/50 shadow-medium' 
                            : 'border-gray-200 hover:border-gray-300 shadow-soft'
                      } focus:outline-none focus:ring-0`}
                      placeholder="tu@email.com"
                    />
                    {email && (
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
                      focusedField === 'password' || password ? 'text-violet-600 scale-110' : 'text-gray-400'
                    }`}>
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="current-password"
                      required
                      className={`form-input block w-full pl-14 pr-14 py-5 border-2 rounded-2xl transition-all duration-500 glass text-gray-900 placeholder-gray-500 font-medium ${
                        focusedField === 'password' 
                          ? 'border-violet-500 shadow-strong shadow-violet-500/25 bg-white/90 scale-[1.02]' 
                          : password 
                            ? 'border-emerald-300 bg-emerald-50/50 shadow-medium' 
                            : 'border-gray-200 hover:border-gray-300 shadow-soft'
                      } focus:outline-none focus:ring-0`}
                      placeholder="Tu contraseña"
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
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-hover-lift group relative w-full flex justify-center py-5 px-8 border border-transparent font-display text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-700 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-strong hover:shadow-2xl disabled:transform-none disabled:hover:shadow-strong tracking-wide"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-white/10 rounded-2xl"></div>
                  {isLoading ? (
                    <div className="flex items-center relative z-10">
                      <div className="spinner mr-3"></div>
                      INICIANDO SESIÓN...
                    </div>
                  ) : (
                    <span className="relative z-10">INICIAR SESIÓN</span>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 glass font-display font-semibold text-gray-600 tracking-wide">¿NO TIENES CUENTA?</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/auth/sign-up"
                  className="btn-hover-lift w-full flex justify-center py-5 px-8 border-2 border-gray-200 rounded-2xl font-display text-lg font-bold text-gray-700 glass hover:bg-white/90 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-500 shadow-soft hover:shadow-medium tracking-wide"
                >
                  CREAR NUEVA CUENTA
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-10">
          <p className="text-gray-500 leading-relaxed font-medium">
            Al iniciar sesión, aceptas nuestros{' '}
            <span className="font-semibold text-gradient-secondary cursor-pointer hover:underline">términos de servicio</span>
            {' '}y{' '}
            <span className="font-semibold text-gradient-secondary cursor-pointer hover:underline">política de privacidad</span>
          </p>
        </div>
      </div>
    </div>
  );
}