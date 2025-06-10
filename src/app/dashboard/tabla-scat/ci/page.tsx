'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSCAT } from '@/contexts/SCATContext';
import SCATHeader from '@/components/SCATHeader';
import SCATItemCard from '@/components/SCATItemCard';
import NavigationFooter from '@/components/NavigationFooter';

const CausasInmediatasPage: React.FC = () => {
  const router = useRouter();
  const { state } = useSCAT();

  const causasInmediatas = [
    {
      id: 1,
      title: 'Operación sin autorización',
      subtitle: 'Realizar trabajos sin los permisos correspondientes',
      description: 'Incluye trabajos sin autorización, no seguir procedimientos de bloqueo, operar sin permisos de trabajo.'
    },
    {
      id: 2,
      title: 'Operar a velocidad inadecuada',
      subtitle: 'Velocidad excesiva o insuficiente para las condiciones',
      description: 'Conducir muy rápido, alimentar muy rápido, trabajar muy lento, lanzar objetos.'
    },
    {
      id: 3,
      title: 'Anular dispositivos de seguridad',
      subtitle: 'Desactivar o remover sistemas de protección',
      description: 'Desconectar alarmas, remover guardas, bloquear dispositivos de seguridad.'
    },
    {
      id: 4,
      title: 'Usar equipo defectuoso',
      subtitle: 'Utilizar herramientas o equipos en mal estado',
      description: 'Usar equipos dañados, herramientas desgastadas, equipos sin mantenimiento.'
    },
    {
      id: 5,
      title: 'Usar equipo de manera incorrecta',
      subtitle: 'Uso inadecuado de herramientas y equipos',
      description: 'Usar herramientas para otros fines, técnicas incorrectas, sobrecarga de equipos.'
    },
    {
      id: 6,
      title: 'No usar equipo de protección personal',
      subtitle: 'Omitir el uso de EPP requerido',
      description: 'No usar casco, guantes, gafas de seguridad, calzado de seguridad cuando es requerido.'
    },
    {
      id: 7,
      title: 'Carga inadecuada',
      subtitle: 'Sobrecarga o distribución incorrecta de peso',
      description: 'Sobrecargar equipos, distribución desigual, carga mal asegurada.'
    }
  ];

  const handleItemClick = (id: number) => {
    router.push(`/dashboard/tabla-scat/ci/${id}`);
  };

  const handleBack = () => {
    router.push('/dashboard/tabla-scat');
  };

  const getItemProgress = (id: number) => {
    if (!state.currentProject) return 0;
    const ciProgress = state.currentProject.scatProgress.ci;
    return ciProgress[id.toString()] ? 100 : 0;
  };

  const isItemCompleted = (id: number) => {
    if (!state.currentProject) return false;
    const ciProgress = state.currentProject.scatProgress.ci;
    return !!ciProgress[id.toString()];
  };

  const completedCount = causasInmediatas.filter(causa => isItemCompleted(causa.id)).length;
  const progressPercentage = Math.round((completedCount / causasInmediatas.length) * 100);

  return (
    <div className="min-h-screen bg-[#3C3C3C]">
      {/* Header */}
      <SCATHeader
        title="Causas Inmediatas (CI)"
        subtitle="Actos y condiciones subestándar que conducen directamente al incidente"
        currentTab="ci"
        showTabs={false}
      />

      {/* Contenido principal */}
      <div className="px-8 py-8">
        {/* Estadísticas de progreso */}
        <motion.div
          className="bg-[#2E2E2E] rounded-xl p-6 mb-8 border border-[#555555]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Progreso de Análisis</h2>
              <p className="text-[#B3B3B3]">
                {completedCount} de {causasInmediatas.length} causas analizadas
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF6B6B] mb-1">
                  {progressPercentage}%
                </div>
                <div className="text-[#B3B3B3] text-sm">Completado</div>
              </div>
              
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="#404040"
                    strokeWidth="10"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="35"
                    stroke="#FF6B6B"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 35}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 35 * (1 - progressPercentage / 100)
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {completedCount}/{causasInmediatas.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-4 w-full bg-[#404040] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-[#FF6B6B] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Grid de causas inmediatas */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {causasInmediatas.map((causa, index) => (
            <motion.div
              key={causa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <SCATItemCard
                number={causa.id}
                title={causa.title}
                subtitle={causa.subtitle}
                isCompleted={isItemCompleted(causa.id)}
                progress={getItemProgress(causa.id)}
                onClick={() => handleItemClick(causa.id)}
                variant="detailed"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Información adicional */}
        <motion.div
          className="mt-12 bg-[#2E2E2E] rounded-xl p-6 border border-[#555555]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="text-white font-bold text-lg mb-4">Sobre las Causas Inmediatas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#B3B3B3] text-sm leading-relaxed">
            <div>
              <h4 className="text-white font-medium mb-2">¿Qué son?</h4>
              <p>
                Las causas inmediatas son los actos y condiciones subestándar que ocurren 
                inmediatamente antes del incidente. Son las causas más obvias y directas 
                que llevaron al evento no deseado.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">¿Cómo identificarlas?</h4>
              <p>
                Analiza las acciones específicas realizadas por las personas involucradas 
                y las condiciones físicas presentes en el momento del incidente. 
                Pregúntate: &quot;¿Qué pasó exactamente?&quot;
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navegación */}
      <NavigationFooter
        currentSection="ci"
        totalCauses={7}
        onGridView={handleBack}
        showSave={true}
      />
    </div>
  );
};

export default CausasInmediatasPage;
