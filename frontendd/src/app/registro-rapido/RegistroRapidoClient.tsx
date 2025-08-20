'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import authTheme from '@/theme/authTheme';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import axios from '@/lib/axios';

const registroRapidoSchema = z.object({
  // Información personal básica
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  doc_id: z.string().optional(),
  email: z.string().email('Por favor ingresa un email válido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  birth_date: z.string().optional(),
  gender: z.enum(['masculino', 'femenino']).optional(),
  
  // Ubicación
  country: z.string().optional(),
  province: z.string().min(1, 'Por favor selecciona una provincia'),
  city: z.string().min(1, 'Por favor selecciona una ciudad'),
  
  // Club y federación
  club_name: z.string().optional(),
  federation: z.string().optional(),
  
  // Estilo de juego
  playing_side: z.enum(['derecho', 'zurdo']).optional(),
  playing_style: z.enum(['clasico', 'lapicero']).optional(),
  
  // Raqueta - palo
  racket_brand: z.string().optional(),
  racket_model: z.string().optional(),
  racket_custom_brand: z.string().optional(),
  racket_custom_model: z.string().optional(),
  
  // Caucho del drive
  drive_rubber_brand: z.string().optional(),
  drive_rubber_model: z.string().optional(),
  drive_rubber_type: z.enum(['liso', 'pupo_largo', 'pupo_corto', 'antitopspin']).optional(),
  drive_rubber_color: z.enum(['negro', 'rojo', 'verde', 'azul', 'amarillo', 'morado', 'fucsia']).optional(),
  drive_rubber_sponge: z.string().optional(),
  drive_rubber_hardness: z.string().optional(),
  drive_rubber_custom_brand: z.string().optional(),
  drive_rubber_custom_model: z.string().optional(),
  
  // Caucho del back
  backhand_rubber_brand: z.string().optional(),
  backhand_rubber_model: z.string().optional(),
  backhand_rubber_type: z.enum(['liso', 'pupo_largo', 'pupo_corto', 'antitopspin']).optional(),
  backhand_rubber_color: z.enum(['negro', 'rojo', 'verde', 'azul', 'amarillo', 'morado', 'fucsia']).optional(),
  backhand_rubber_sponge: z.string().optional(),
  backhand_rubber_hardness: z.string().optional(),
  backhand_rubber_custom_brand: z.string().optional(),
  backhand_rubber_custom_model: z.string().optional(),
  
  // Información adicional
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

const TT_CLUBS_ECUADOR = [
  { name: 'PPH Cuenca', federation: 'Fede Guayas' },
  { name: 'Ping Pro', federation: 'Fede Guayas' },
  { name: 'Billy Team', federation: 'Fede Guayas' },
  { name: 'Independiente', federation: 'Fede Guayas' },
  { name: 'BackSpin', federation: 'Fede Guayas' },
  { name: 'Spin Factor', federation: 'Fede - Manabí' },
  { name: 'Spin Zone', federation: 'Fede Tungurahua' },
  { name: 'TM - Manta', federation: 'Fede - Manabí' },
  { name: 'Primorac', federation: 'Fede Pichincha' },
  { name: 'TT Quevedo', federation: 'Fede Los Ríos' },
  { name: 'Fede Santa Elena', federation: 'Fede Santa Elena' },
  { name: 'Ranking Uartes', federation: 'Fede Galápagos' },
  { name: 'Guayaquil City', federation: 'Fede Guayas' },
  { name: 'Buena Fe', federation: 'Fede Guayas' },
  { name: 'Milagro', federation: 'Fede Guayas' },
  { name: 'Ping Pong Rick', federation: 'Fede Guayas' },
  { name: 'Ranking Liga 593', federation: 'LATEM' },
];

const POPULAR_BRANDS = [
  'Butterfly', 'DHS', 'Sanwei', 'Nittaku', 'Yasaka', 'Stiga', 
  'Victas', 'Joola', 'Xiom', 'Saviga', 'Friendship', 'Dr. Neubauer', 'Double Fish'
];

const RUBBER_COLORS = ['negro', 'rojo', 'verde', 'azul', 'amarillo', 'morado', 'fucsia'];
const RUBBER_TYPES = [
  { value: 'liso', label: 'Liso' },
  { value: 'pupo_largo', label: 'Pupo Largo' },
  { value: 'pupo_corto', label: 'Pupo Corto' },
  { value: 'antitopspin', label: 'Antitopspin' }
];
const SPONGE_THICKNESSES = ['0.5', '0.7', '1.5', '1.6', '1.8', '1.9', '2', '2.1', '2.2', 'sin esponja'];
const HARDNESS_LEVELS = ['h42', 'h44', 'h46', 'h48', 'h50'];

const RegistroRapidoClient: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationCode, setRegistrationCode] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCustomRacketBrand, setShowCustomRacketBrand] = useState(false);
  const [showCustomDriveRubber, setShowCustomDriveRubber] = useState(false);
  const [showCustomBackhandRubber, setShowCustomBackhandRubber] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistroRapidoFormValues>({
    resolver: zodResolver(registroRapidoSchema),
    defaultValues: {
      country: 'Ecuador',
    },
  });

  const watchedProvince = watch('province');
  const watchedClubName = watch('club_name');
  const selectedProvince = ECUADOR_PROVINCES.find(p => p.name === watchedProvince);
  const selectedClub = TT_CLUBS_ECUADOR.find(c => c.name === watchedClubName);

  // Auto-set federation when club is selected
  React.useEffect(() => {
    if (selectedClub) {
      setValue('federation', selectedClub.federation);
    }
  }, [selectedClub, setValue]);

  // Handle photo selection
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RegistroRapidoFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add all form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      // Add photo if selected
      if (selectedPhoto) {
        formData.append('photo', selectedPhoto);
      }

      const response = await axios.post('/api/registro-rapido', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRegistrationCode(response.data.registration_code);
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
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  // Estilos mejorados para mejor visibilidad
  const inputStyles = "w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 font-semibold placeholder-gray-600 bg-white hover:border-gray-400";
  const inputErrorStyles = "border-red-400 bg-red-50 text-red-900 font-semibold placeholder-red-500";
  const inputNormalStyles = "border-gray-300 hover:border-gray-400";
  const labelStyles = "block text-sm font-bold text-gray-800 mb-1";
  const sectionTitleStyles = "text-xl font-bold text-gray-900 border-b-2 border-gray-300 pb-3 mb-6";

  if (isSuccess) {
    return (
      <ThemeProvider theme={authTheme}>
        <CssBaseline />
        <AuthLayout>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registro Exitoso</h2>
            <p className="text-gray-700 font-semibold mb-4">
              Tu código de registro es: <span className="font-bold text-green-600 text-lg">{registrationCode}</span>
            </p>
            <p className="text-gray-700 font-medium mb-6">
              Te has registrado exitosamente en el censo de tenis de mesa. Pronto nos pondremos en contacto contigo.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/waiting-room')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-colors duration-200 font-bold"
              >
                Ir a Sala de Espera
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-bold"
              >
                Volver al Inicio
              </button>
            </div>
          </motion.div>
        </AuthLayout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        preventDuplicate
        dense
        autoHideDuration={4000}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <AuthHeader
                title="Censo de Tenis de Mesa"
                subtitle="593 Liga Amateur de Tenis de Mesa (LATEM)"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 mt-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Foto */}
                <div className="flex justify-center">
                  <div className="relative">
                    {photoPreview ? (
                      <img
                        className="h-32 w-32 object-cover rounded-full border-4 border-gray-400"
                        src={photoPreview}
                        alt="Vista previa"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-400">
                        <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <label
                      htmlFor="photo"
                      className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="sr-only"
                    />
                  </div>
                </div>

                {/* Información Personal */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="first_name" className={labelStyles}>
                        Nombres <span className="text-red-600 font-bold">*</span>
                      </label>
                      <input
                        {...register('first_name')}
                        type="text"
                        id="first_name"
                        placeholder="Luis Abelardo"
                        className={`${inputStyles} ${errors.first_name ? inputErrorStyles : inputNormalStyles}`}
                      />
                      {errors.first_name && (
                        <p className="text-sm text-red-700 font-semibold">{errors.first_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="last_name" className={labelStyles}>
                        Apellido <span className="text-red-600 font-bold">*</span>
                      </label>
                      <input
                        {...register('last_name')}
                        type="text"
                        id="last_name"
                        placeholder="Vale Zurita"
                        className={`${inputStyles} ${errors.last_name ? inputErrorStyles : inputNormalStyles}`}
                      />
                      {errors.last_name && (
                        <p className="text-sm text-red-700 font-semibold">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="doc_id" className={labelStyles}>Cédula</label>
                      <input
                        {...register('doc_id')}
                        type="text"
                        id="doc_id"
                        placeholder="913909999"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="birth_date" className={labelStyles}>Fecha de Nacimiento</label>
                      <input
                        {...register('birth_date')}
                        type="date"
                        id="birth_date"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="gender" className={labelStyles}>Sexo</label>
                      <select
                        {...register('gender')}
                        id="gender"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className={labelStyles}>
                        Email <span className="text-red-600 font-bold">*</span>
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        placeholder="correo@hotmail.com"
                        className={`${inputStyles} ${errors.email ? inputErrorStyles : inputNormalStyles}`}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-700 font-semibold">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className={labelStyles}>
                        Celular <span className="text-red-600 font-bold">*</span>
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        placeholder="994818999"
                        className={`${inputStyles} ${errors.phone ? inputErrorStyles : inputNormalStyles}`}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-700 font-semibold">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Ubicación
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="country" className={labelStyles}>País</label>
                      <input
                        {...register('country')}
                        type="text"
                        id="country"
                        defaultValue="Ecuador"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="province" className={labelStyles}>
                        Provincia <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        {...register('province')}
                        id="province"
                        className={`${inputStyles} ${errors.province ? inputErrorStyles : inputNormalStyles}`}
                      >
                        <option value="">Seleccionar provincia</option>
                        {ECUADOR_PROVINCES.map((province) => (
                          <option key={province.name} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                      {errors.province && (
                        <p className="text-sm text-red-700 font-semibold">{errors.province.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="city" className={labelStyles}>
                        Ciudad <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        {...register('city')}
                        id="city"
                        disabled={!selectedProvince}
                        className={`${inputStyles} ${errors.city ? inputErrorStyles : inputNormalStyles} ${!selectedProvince ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                      >
                        <option value="">Seleccionar ciudad</option>
                        {selectedProvince?.cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="text-sm text-red-700 font-semibold">{errors.city.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Club y Federación */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Club y Federación
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="club_name" className={labelStyles}>Club</label>
                      <select
                        {...register('club_name')}
                        id="club_name"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar club</option>
                        {TT_CLUBS_ECUADOR.map((club) => (
                          <option key={club.name} value={club.name}>
                            {club.name}
                          </option>
                        ))}
                        <option value="otro">Otro (no listado)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="federation" className={labelStyles}>Federación</label>
                      <input
                        {...register('federation')}
                        type="text"
                        id="federation"
                        placeholder="Fede Guayas"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Estilo de Juego */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Estilo de Juego
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="playing_side" className={labelStyles}>Lado de Juego</label>
                      <select
                        {...register('playing_side')}
                        id="playing_side"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar</option>
                        <option value="derecho">Derecho</option>
                        <option value="zurdo">Zurdo</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="playing_style" className={labelStyles}>Tipo de Juego</label>
                      <select
                        {...register('playing_style')}
                        id="playing_style"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar</option>
                        <option value="clasico">Clásico</option>
                        <option value="lapicero">Lapicero</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Raqueta - Palo */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Raqueta - Palo
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="racket_brand" className={labelStyles}>Marca</label>
                      <select
                        {...register('racket_brand')}
                        id="racket_brand"
                        onChange={(e) => {
                          setShowCustomRacketBrand(e.target.value === 'custom');
                          if (e.target.value !== 'custom') {
                            setValue('racket_custom_brand', '');
                          }
                        }}
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar marca</option>
                        {POPULAR_BRANDS.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                        <option value="custom">Otra marca (personalizada)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="racket_model" className={labelStyles}>Modelo</label>
                      <input
                        {...register('racket_model')}
                        type="text"
                        id="racket_model"
                        placeholder="5L carbono+"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      />
                    </div>

                    {showCustomRacketBrand && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="racket_custom_brand" className={labelStyles}>Marca Personalizada</label>
                          <input
                            {...register('racket_custom_brand')}
                            type="text"
                            id="racket_custom_brand"
                            placeholder="Ingresa la marca"
                            className="w-full px-4 py-3 rounded-xl border border-yellow-400 bg-yellow-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 hover:border-yellow-500 text-gray-900 font-semibold placeholder-yellow-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="racket_custom_model" className={labelStyles}>Modelo Personalizado</label>
                          <input
                            {...register('racket_custom_model')}
                            type="text"
                            id="racket_custom_model"
                            placeholder="Ingresa el modelo"
                            className="w-full px-4 py-3 rounded-xl border border-yellow-400 bg-yellow-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 hover:border-yellow-500 text-gray-900 font-semibold placeholder-yellow-700"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Caucho del Drive */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Caucho del Drive
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="drive_rubber_brand" className={labelStyles}>Marca</label>
                      <select
                        {...register('drive_rubber_brand')}
                        id="drive_rubber_brand"
                        onChange={(e) => {
                          setShowCustomDriveRubber(e.target.value === 'custom');
                          if (e.target.value !== 'custom') {
                            setValue('drive_rubber_custom_brand', '');
                          }
                        }}
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar marca</option>
                        {POPULAR_BRANDS.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                        <option value="custom">Otra marca (personalizada)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="drive_rubber_model" className={labelStyles}>Modelo</label>
                      <input
                        {...register('drive_rubber_model')}
                        type="text"
                        id="drive_rubber_model"
                        placeholder="Cross 729"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="drive_rubber_type" className={labelStyles}>Tipo</label>
                      <select
                        {...register('drive_rubber_type')}
                        id="drive_rubber_type"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar tipo</option>
                        {RUBBER_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="drive_rubber_color" className={labelStyles}>Color</label>
                      <select
                        {...register('drive_rubber_color')}
                        id="drive_rubber_color"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar color</option>
                        {RUBBER_COLORS.map((color) => (
                          <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="drive_rubber_sponge" className={labelStyles}>Esponja</label>
                      <select
                        {...register('drive_rubber_sponge')}
                        id="drive_rubber_sponge"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar esponja</option>
                        {SPONGE_THICKNESSES.map((thickness) => (
                          <option key={thickness} value={thickness}>
                            {thickness} {thickness !== 'sin esponja' && 'mm'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="drive_rubber_hardness" className={labelStyles}>Hardness</label>
                      <select
                        {...register('drive_rubber_hardness')}
                        id="drive_rubber_hardness"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar hardness</option>
                        {HARDNESS_LEVELS.map((hardness) => (
                          <option key={hardness} value={hardness}>
                            {hardness}
                          </option>
                        ))}
                      </select>
                    </div>

                    {showCustomDriveRubber && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="drive_rubber_custom_brand" className={labelStyles}>Marca Personalizada</label>
                          <input
                            {...register('drive_rubber_custom_brand')}
                            type="text"
                            id="drive_rubber_custom_brand"
                            placeholder="Ingresa la marca"
                            className="w-full px-4 py-3 rounded-xl border border-yellow-400 bg-yellow-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 hover:border-yellow-500 text-gray-900 font-semibold placeholder-yellow-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="drive_rubber_custom_model" className={labelStyles}>Modelo Personalizado</label>
                          <input
                            {...register('drive_rubber_custom_model')}
                            type="text"
                            id="drive_rubber_custom_model"
                            placeholder="Ingresa el modelo"
                            className="w-full px-4 py-3 rounded-xl border border-yellow-400 bg-yellow-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 hover:border-yellow-500 text-gray-900 font-semibold placeholder-yellow-700"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Caucho del Back */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Caucho del Back
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="backhand_rubber_brand" className={labelStyles}>Marca</label>
                      <select
                        {...register('backhand_rubber_brand')}
                        id="backhand_rubber_brand"
                        onChange={(e) => {
                          setShowCustomBackhandRubber(e.target.value === 'custom');
                          if (e.target.value !== 'custom') {
                            setValue('backhand_rubber_custom_brand', '');
                          }
                        }}
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar marca</option>
                        {POPULAR_BRANDS.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                        <option value="custom">Otra marca (personalizada)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="backhand_rubber_model" className={labelStyles}>Modelo</label>
                      <input
                        {...register('backhand_rubber_model')}
                        type="text"
                        id="backhand_rubber_model"
                        placeholder="Vpupo"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="backhand_rubber_type" className={labelStyles}>Tipo</label>
                      <select
                        {...register('backhand_rubber_type')}
                        id="backhand_rubber_type"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar tipo</option>
                        {RUBBER_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="backhand_rubber_color" className={labelStyles}>Color</label>
                      <select
                        {...register('backhand_rubber_color')}
                        id="backhand_rubber_color"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar color</option>
                        {RUBBER_COLORS.map((color) => (
                          <option key={color} value={color}>
                            {color.charAt(0).toUpperCase() + color.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="backhand_rubber_sponge" className={labelStyles}>Esponja</label>
                      <select
                        {...register('backhand_rubber_sponge')}
                        id="backhand_rubber_sponge"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar esponja</option>
                        {SPONGE_THICKNESSES.map((thickness) => (
                          <option key={thickness} value={thickness}>
                            {thickness} {thickness !== 'sin esponja' && 'mm'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="backhand_rubber_hardness" className={labelStyles}>Hardness</label>
                      <select
                        {...register('backhand_rubber_hardness')}
                        id="backhand_rubber_hardness"
                        className={`${inputStyles} ${inputNormalStyles}`}
                      >
                        <option value="">Seleccionar hardness</option>
                        {HARDNESS_LEVELS.map((hardness) => (
                          <option key={hardness} value={hardness}>
                            {hardness}
                          </option>
                        ))}
                      </select>
                    </div>

                    {showCustomBackhandRubber && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="backhand_rubber_custom_brand" className={labelStyles}>Marca Personalizada</label>
                          <input
                            {...register('backhand_rubber_custom_brand')}
                            type="text"
                            id="backhand_rubber_custom_brand"
                            placeholder="Ingresa la marca"
                            className="w-full px-4 py-3 rounded-xl border border-yellow-400 bg-yellow-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 hover:border-yellow-500 text-gray-900 font-semibold placeholder-yellow-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="backhand_rubber_custom_model" className={labelStyles}>Modelo Personalizado</label>
                          <input
                            {...register('backhand_rubber_custom_model')}
                            type="text"
                            id="backhand_rubber_custom_model"
                            placeholder="Ingresa el modelo"
                            className="w-full px-4 py-3 rounded-xl border border-yellow-400 bg-yellow-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 hover:border-yellow-500 text-gray-900 font-semibold placeholder-yellow-700"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Información Adicional */}
                <div className="space-y-6">
                  <h3 className={sectionTitleStyles}>
                    Información Adicional
                  </h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className={labelStyles}>
                      Comentarios Adicionales
                    </label>
                    <textarea
                      {...register('notes')}
                      id="notes"
                      rows={4}
                      placeholder="Información adicional sobre tu juego, logros, observaciones..."
                      className={`${inputStyles} ${inputNormalStyles} resize-none`}
                    />
                  </div>
                </div>

                {/* Información del Censo */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-3">Información del Censo</h4>
                  <div className="text-sm text-blue-800 font-medium space-y-2">
                    <p><strong>593 Liga Amateur de Tenis de Mesa (LATEM)</strong></p>
                    <p>Este censo nos ayuda a conocer mejor a la comunidad de tenis de mesa en Ecuador.</p>
                    <p>Tu código de registro será generado automáticamente al completar el formulario.</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-semibold">
                      <div><strong>Marcas:</strong> Butterfly, DHS, Sanwei, Nittaku, Yasaka, Stiga, Victas, Joola, Xiom, Saviga, Friendship, Dr. Neubauer, Double Fish</div>
                      <div><strong>Colores:</strong> Negro, Rojo, Verde, Azul, Amarillo, Morado, Fucsia</div>
                      <div><strong>Esponja:</strong> 0.5, 0.7, 1.5, 1.6, 1.8, 1.9, 2, 2.1, 2.2 mm, sin esponja</div>
                      <div><strong>Hardness:</strong> h42, h44, h46, h48, h50</div>
                    </div>
                    <div className="mt-4 text-xs font-semibold">
                      <p><strong>Tipos de Cauchos:</strong> Liso, Pupo Largo, Pupo Corto, Antitopspin</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 flex items-center justify-center gap-3 text-lg font-bold shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registrando en el Censo...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completar Registro en el Censo
                      </>
                    )}
                  </button>
                </div>

                {/* Footer Info */}
                <div className="text-center pt-4 border-t-2 border-gray-200">
                  <p className="text-sm text-gray-700 font-semibold">
                    Al registrarte, formas parte del censo oficial de tenis de mesa de Ecuador.
                    <br />
                    <span className="text-blue-600 font-bold">Sin contraseña</span> • <span className="font-bold">Proceso simplificado</span> • <span className="font-bold">Código automático</span>
                  </p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default RegistroRapidoClient;
