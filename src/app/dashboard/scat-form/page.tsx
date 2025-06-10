'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FormStepper } from '../../../components/FormStepper';

export default function SCATFormPage() {
  const router = useRouter();

  const handleComplete = () => {
    // Mostrar mensaje de éxito y redirigir
    alert('¡Análisis SCAT completado exitosamente! Redirigiendo al dashboard...');
    router.push('/dashboard');
  };

  const handleSave = () => {
    console.log('Progreso guardado automáticamente');
  };

  const handleExit = () => {
    const confirmExit = window.confirm(
      '¿Estás seguro de que quieres salir? Tu progreso se guardará automáticamente.'
    );
    
    if (confirmExit) {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      <FormStepper
        onComplete={handleComplete}
        onSave={handleSave}
        onExit={handleExit}
      />
    </main>
  );
}
