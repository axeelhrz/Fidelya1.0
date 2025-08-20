'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

const registroRapidoSchema = z.object({
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un email válido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  doc_id: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  province: z.string().min(1, 'Por favor selecciona una provincia'),
  city: z.string().min(1, 'Por favor selecciona una ciudad'),
  interest_type: z.enum(['player', 'club_owner', 'league_admin'], 'Por favor selecciona tu interés'),
  preferred_sport: z.string().optional(),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  notes: z.string().optional(),
});

type RegistroRapidoFormValues = z.infer<typeof registroRapidoSchema>;

const ECUADOR_PROVINCES = [
  { name: 'Guayas', cities: ['Guayaquil', 'Milagro', 'Buena Fe', 'Daule', 'Durán'] },
  { name: 'Pichincha', cities: ['Quito', 'Cayambe', 'Mejía', 'Pedro Moncayo', 'Rumiñahui'] },
  { name: 'Manabí', cities: ['Manta', 'Portoviejo', 'Chone', 'Montecristi', 'Jipijapa'] },
  { name: 'Azuay', cities: ['Cuenca', 'Gualaceo', 'Paute', 'Santa Isabel', 'Sigsig'] },
  { name: 'Tungurahua', cities: ['Ambato', 'Baños', 'Cevallos', 'Mocha', 'Patate'] },
  { name: 'Los Ríos', cities: ['Quevedo', 'Babahoyo', 'Ventanas', 'Vinces', 'Urdaneta'] },
  { name: 'Santa Elena', cities: ['La Libertad', 'Salinas', 'Santa Elena'] },
  { name: 'Galápagos', cities: ['Puerto Ayora', 'Puerto Baquerizo Moreno', 'Puerto Villamil'] },
  { name: 'El Oro', cities: ['Machala', 'Pasaje', 'Santa Rosa', 'Huaquillas', 'Arenillas'] },
  { name: 'Esmeraldas', cities: ['Esmeraldas', 'Atacames', 'Muisne', 'Quinindé', 'San Lorenzo'] },
];

const SPORTS_OPTIONS = [
  'Tenis de Mesa',
  'Tenis',
  'Fútbol',
  'Básquetbol',
  'Voleibol',
  'Natación',
  'Atletismo',
  'Otro'
];

const RegistroRapidoClient: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistroRapidoFormValues>({
    resolver: zodResolver(registroRapidoSchema),
    defaultValues: {
      preferred_sport: 'Tenis de Mesa',
    },
  });

  const watchedProvince = watch('province');
  const selectedProvince = ECUADOR_PROVINCES.find(p => p.name === watchedProvince);

  const onSubmit = async (data: RegistroRapidoFormValues) => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/registro-rapido', data);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error en registro rápido:', error);
      alert('Error al registrarse. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] }
    },
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-6">
            Te has registrado exitosamente en nuestra sala de espera. Pronto nos pondremos en contacto contigo.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/waiting-room')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors duration-200"
            >
              Ir a Sala de Espera
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Volver al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">🏓</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro Rápido</h1>
          <p className="text-lg text-gray-600">
            Únete a la comunidad de Raquet Power sin complicaciones
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Sin contraseña • Registro inmediato
          </div>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">👤</span>
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('first_name')}
                    type="text"
                    id="first_name"
                    placeholder="Tu nombre"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                      errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-600">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('last_name')}
                    type="text"
                    id="last_name"
                    placeholder="Tu apellido"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                      errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-600">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    placeholder="0999123456"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                      errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="doc_id" className="block text-sm font-medium text-gray-700">Cédula</label>
                  <input
                    {...register('doc_id')}
                    type="text"
                    id="doc_id"
                    placeholder="1234567890"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    {...register('birth_date')}
                    type="date"
                    id="birth_date"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
                  <select
                    {...register('gender')}
                    id="gender"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                  >
                    <option value="">Seleccionar</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">📍</span>
                Ubicación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                    Provincia <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('province')}
                    id="province"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                      errors.province ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar provincia</option>
                    {ECUADOR_PROVINCES.map((province) => (
                      <option key={province.name} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="text-sm text-red-600">{errors.province.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('city')}
                    id="city"
                    disabled={!selectedProvince}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 disabled:bg-gray-100 ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar ciudad</option>
                    {selectedProvince?.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Intereses Deportivos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <span className="mr-2">🏆</span>
                Intereses Deportivos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="interest_type" className="block text-sm font-medium text-gray-700">
                    ¿Qué te interesa? <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('interest_type')}
                    id="interest_type"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 ${
                      errors.interest_type ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar interés</option>
                    <option value="player">Ser Jugador/Miembro</option>
                    <option value="club_owner">Administrar un Club</option>
                    <option value="league_admin">Administrar una Liga</option>
                  </select>
                  {errors.interest_type && (
                    <p className="text-sm text-red-600">{errors.interest_type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="preferred_sport" className="block text-sm font-medium text-gray-700">Deporte Preferido</label>
                  <select
                    {...register('preferred_sport')}
                    id="preferred_sport"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                  >
                    {SPORTS_OPTIONS.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">Nivel de Experiencia</label>
                <select
                  {...register('experience_level')}
                  id="experience_level"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300"
                >
                  <option value="">Seleccionar nivel</option>
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
            </div>

            {/* Notas Adicionales */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Comentarios Adicionales
              </label>
              <textarea
                {...register('notes')}
                id="notes"
                rows={3}
                placeholder="Cuéntanos más sobre ti o tus expectativas..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 hover:border-gray-300 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Registro Rápido
                  </>
                )}
              </button>
            </div>

            {/* Footer Info */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Al registrarte, aceptas formar parte de nuestra sala de espera.
                <br />
                <span className="text-green-600 font-medium">No se requiere contraseña</span> • Proceso simplificado
              </p>
            </div>
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Qué sigue después del registro?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p>Revisamos tu información</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <p>Te contactamos para confirmar</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <p>Accedes a la plataforma completa</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegistroRapidoClient;