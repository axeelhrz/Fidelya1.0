import BeneficiosService from '@/services/beneficios.service';
import { BeneficioFormData } from '@/types/beneficio';

// Función para crear beneficios de prueba
export const crearBeneficiosDePrueba = async (comercioId: string) => {
  const beneficiosPrueba: BeneficioFormData[] = [
    {
      titulo: '20% de descuento en toda la tienda',
      descripcion: 'Obtén un 20% de descuento en todos nuestros productos. Válido para compras superiores a $500.',
      tipo: 'porcentaje',
      descuento: 20,
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      categoria: 'Retail y Moda',
      tags: ['descuento', 'promoción', 'moda'],
      destacado: true,
      condiciones: 'Válido para compras superiores a $500. No acumulable con otras promociones.',
      limitePorSocio: 1,
      limiteTotal: 100,
      asociacionesDisponibles: []
    },
    {
      titulo: 'Café gratis con cualquier compra',
      descripcion: 'Recibe un café completamente gratis con cualquier compra que realices en nuestra tienda.',
      tipo: 'producto_gratis',
      descuento: 0,
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días
      categoria: 'Alimentación',
      tags: ['gratis', 'café', 'promoción'],
      destacado: false,
      condiciones: 'Válido con cualquier compra. Un café por cliente.',
      limitePorSocio: 2,
      limiteTotal: 50,
      asociacionesDisponibles: []
    },
    {
      titulo: '$100 de descuento en servicios',
      descripcion: 'Descuento fijo de $100 en cualquiera de nuestros servicios profesionales.',
      tipo: 'monto_fijo',
      descuento: 100,
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 días
      categoria: 'Servicios Profesionales',
      tags: ['descuento', 'servicios', 'profesional'],
      destacado: false,
      condiciones: 'Aplicable a servicios con valor superior a $300.',
      limitePorSocio: 3,
      limiteTotal: 200,
      asociacionesDisponibles: []
    }
  ];

  try {
    console.log('🎯 Creando beneficios de prueba para comercio:', comercioId);
    
    for (const beneficio of beneficiosPrueba) {
      const beneficioId = await BeneficiosService.crearBeneficio(beneficio, comercioId, 'comercio');
      console.log('✅ Beneficio de prueba creado:', beneficioId, beneficio.titulo);
    }
    
    console.log('🎉 Todos los beneficios de prueba han sido creados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error creando beneficios de prueba:', error);
    return false;
  }
};

// Función para limpiar beneficios de prueba (opcional)
export const limpiarBeneficiosDePrueba = async (comercioId: string) => {
  try {
    console.log('🧹 Limpiando beneficios de prueba para comercio:', comercioId);
    
    const beneficios = await BeneficiosService.obtenerBeneficiosPorComercio(comercioId);
    
    for (const beneficio of beneficios) {
      await BeneficiosService.eliminarBeneficio(beneficio.id);
      console.log('🗑️ Beneficio eliminado:', beneficio.id, beneficio.titulo);
    }
    
    console.log('🎉 Todos los beneficios de prueba han sido eliminados');
    return true;
  } catch (error) {
    console.error('❌ Error eliminando beneficios de prueba:', error);
    return false;
  }
};