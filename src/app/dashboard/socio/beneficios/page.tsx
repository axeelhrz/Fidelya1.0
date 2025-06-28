'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SocioSidebar } from '@/components/layout/SocioSidebar';
import { BenefitsTabs } from '@/components/socio/BenefitsTabs';
import { BenefitsCard } from '@/components/socio/BenefitsCard';
import { Gift } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

// Mock data
const mockBeneficios = [
  {
    id: '1',
    titulo: '20% de descuento en toda la tienda',
    descripcion: 'Válido en todos los productos excepto ofertas especiales',
    descuento: 20,
    tipo: 'porcentaje' as const,
    comercioId: 'comercio1',
    comercioNombre: 'Tienda Fashion',
    comercioLogo: '',
    asociacionesDisponibles: ['asociacion1'],
    fechaInicio: Timestamp.fromDate(new Date()),
    fechaFin: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    estado: 'activo' as const,
    usosActuales: 5,
    categoria: 'Retail',
    creadoEn: Timestamp.fromDate(new Date()),
    actualizadoEn: Timestamp.fromDate(new Date())
  },
  {
    id: '2',
    titulo: 'Café gratis con cualquier compra',
    descripcion: 'Un café americano gratis al comprar cualquier producto de panadería',
    descuento: 0,
    tipo: 'producto_gratis' as const,
    comercioId: 'comercio2',
    comercioNombre: 'Café Central',
    comercioLogo: '',
    asociacionesDisponibles: ['asociacion1'],
    fechaInicio: Timestamp.fromDate(new Date()),
    fechaFin: Timestamp.fromDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    estado: 'activo' as const,
    usosActuales: 12,
    categoria: 'Restaurantes',
    creadoEn: Timestamp.fromDate(new Date()),
    actualizadoEn: Timestamp.fromDate(new Date())
  }
];

export default function SocioBeneficiosPage() {
  const [activeTab, setActiveTab] = useState<'disponibles' | 'usados'>('disponibles');

  const handleUseBenefit = (beneficioId: string) => {
    console.log('Using benefit:', beneficioId);
  };

  return (
    <DashboardLayout
      activeSection="beneficios"
      sidebarComponent={SocioSidebar}
    >
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Beneficios</h1>
          <p className="text-gray-600">
            Descubre y utiliza todos los descuentos y ofertas especiales disponibles para ti.
          </p>
        </motion.div>

        <BenefitsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={{
            disponibles: mockBeneficios.length,
            usados: 12,
            ahorroTotal: 2450
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'disponibles' ? (
            mockBeneficios.map((beneficio) => (
              <BenefitsCard
                key={beneficio.id}
                beneficio={beneficio}
                tipo="disponible"
                onUse={handleUseBenefit}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Gift size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No has usado beneficios aún</p>
              <p className="text-sm text-gray-400">
                Cuando uses un beneficio, aparecerá aquí con los detalles del ahorro.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
