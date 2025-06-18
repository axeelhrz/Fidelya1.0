import axios from 'axios';
import config from '../config/config';

class CierreCajaService {
  constructor() {
    this.baseURL = `${config.API_BASE_URL}/api/cierre-caja`;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Configurar interceptores de axios
  setupInterceptors() {
    axios.interceptors.request.use(
      (requestConfig) => {
        const token = localStorage.getItem(config.JWT_STORAGE_KEY || 'token');
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem(config.JWT_STORAGE_KEY || 'token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Gestión de caché
  getCacheKey(endpoint, params = {}) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  clearCache() {
    this.cache.clear();
  }

  // Validaciones de permisos
  validarPermisosCierreCaja() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const rolesPermitidos = ['administrador', 'cajero', 'gerente'];
    return rolesPermitidos.includes(user.rol?.toLowerCase());
  }

  // Obtener resumen de ventas del día
  async obtenerResumenVentasHoy() {
    const cacheKey = this.getCacheKey('resumen_ventas_hoy');
    const cached = this.getCache(cacheKey);
    if (cached) return cached;
    try {
      const response = await axios.get(`${this.baseURL}/resumen-ventas-hoy`);
      const data = {
        resumen_ventas: {
          numero_ventas: response.data.numero_ventas || 0,
          total_efectivo: response.data.total_efectivo || 0,
          total_tarjeta: response.data.total_tarjeta || 0,
          total_transferencia: response.data.total_transferencia || 0,
          total_ventas: response.data.total_ventas || 0,
          venta_promedio: response.data.venta_promedio || 0,
          comparacion_ayer: response.data.comparacion_ayer || {},
          tendencia_semanal: response.data.tendencia_semanal || [],
          productos_top: response.data.productos_top || [],
          metricas_tiempo: response.data.metricas_tiempo || {}
        },
        cierre_existente: response.data.cierre_existente || null,
        puede_cerrar: response.data.puede_cerrar || false
      };

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error obteniendo resumen de ventas:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener el resumen de ventas del día'
      );
    }
  }

  // Registrar cierre de caja
  async registrarCierreCaja(datosCompletos) {
    try {
      // Validar datos antes de enviar
      this.validarDatosCierre(datosCompletos);

      const response = await axios.post(`${this.baseURL}/registrar`, {
        total_efectivo_contado: datosCompletos.total_efectivo_contado,
        observaciones: datosCompletos.observaciones,
        tiempo_conteo: datosCompletos.tiempo_conteo || 0,
        denominaciones_detalle: datosCompletos.denominaciones_detalle || null,
        verificacion_seguridad: datosCompletos.verificacion_seguridad || false,
        metadata: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          ip_address: 'client_side' // Se obtiene en el backend
        }
      });

      // Limpiar caché después de registrar
      this.clearCache();

      return {
        cierre: response.data.cierre,
        mensaje: response.data.mensaje || 'Cierre registrado exitosamente'
      };
    } catch (error) {
      console.error('Error registrando cierre:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al registrar el cierre de caja'
      );
    }
  }

  // Validar datos del cierre
  validarDatosCierre(datos) {
    if (typeof datos.total_efectivo_contado !== 'number' || datos.total_efectivo_contado < 0) {
      throw new Error('El total de efectivo contado debe ser un número válido mayor o igual a 0');
    }

    if (datos.observaciones && datos.observaciones.length > 500) {
      throw new Error('Las observaciones no pueden exceder 500 caracteres');
    }

    if (!datos.verificacion_seguridad) {
      throw new Error('Debe verificar la seguridad del conteo antes de proceder');
    }

    return true;
  }

  // Obtener historial de cierres
  async obtenerHistorialCierres(filtros = {}) {
    const cacheKey = this.getCacheKey('historial_cierres', filtros);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams();
      
      if (filtros.limite) params.append('limite', filtros.limite);
      if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros.usuario) params.append('usuario', filtros.usuario);
      if (filtros.estado_diferencia && filtros.estado_diferencia !== 'todos') {
        params.append('estado_diferencia', filtros.estado_diferencia);
      }
      if (filtros.precision_min) params.append('precision_min', filtros.precision_min);

      const response = await axios.get(`${this.baseURL}/historial?${params.toString()}`);
      
      const historial = response.data.map(cierre => ({
        ...cierre,
        diferencia: cierre.diferencia || 0,
        precision: this.calcularPrecision(cierre.diferencia, cierre.total_ventas_esperado)
      }));

      this.setCache(cacheKey, historial);
      return historial;
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener el historial de cierres'
      );
    }
  }

  // Obtener métricas del cajero
  async obtenerMetricasCajero() {
    const cacheKey = this.getCacheKey('metricas_cajero');
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.baseURL}/metricas-cajero`);
      const metricas = {
        precision_promedio: response.data.precision_promedio || 0,
        total_cierres: response.data.total_cierres || 0,
        racha_actual: response.data.racha_actual || 0,
        cierres_perfectos: response.data.cierres_perfectos || 0,
        diferencia_promedio: response.data.diferencia_promedio || 0,
        tiempo_promedio_conteo: response.data.tiempo_promedio_conteo || 0,
        tendencia_precision: response.data.tendencia_precision || []
      };

      this.setCache(cacheKey, metricas);
      return metricas;
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      return {
        precision_promedio: 0,
        total_cierres: 0,
        racha_actual: 0,
        cierres_perfectos: 0,
        diferencia_promedio: 0,
        tiempo_promedio_conteo: 0,
        tendencia_precision: []
      };
    }
  }

  // Obtener notificaciones de cierre
  async obtenerNotificacionesCierre() {
    try {
      const response = await axios.get(`${this.baseURL}/notificaciones`);
      return response.data || [];
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error);
      return [];
    }
  }

  // Obtener detalle de un cierre específico
  async obtenerDetalleCierre(cierreId) {
    const cacheKey = this.getCacheKey('detalle_cierre', { id: cierreId });
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${this.baseURL}/detalle/${cierreId}`);
      const detalle = {
        ...response.data,
        precision: this.calcularPrecision(response.data.diferencia, response.data.total_ventas_esperado)
      };

      this.setCache(cacheKey, detalle);
      return detalle;
    } catch (error) {
      console.error('Error obteniendo detalle del cierre:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener el detalle del cierre'
      );
    }
  }

  // Exportar cierre a PDF
  async exportarCierrePDF(cierreId, configuracion = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/exportar-pdf/${cierreId}`, {
        configuracion: {
          plantilla: configuracion.plantilla || 'completa',
          incluir_graficos: configuracion.incluirGraficos || true,
          incluir_firma_digital: configuracion.incluirFirmaDigital || true,
          incluir_codigo_qr: configuracion.incluirCodigoQR || true,
          incluir_detalle_ventas: configuracion.incluirDetalleVentas || true,
          incluir_comparacion: configuracion.incluirComparacion || true,
          incluir_recomendaciones: configuracion.incluirRecomendaciones || false,
          formato: configuracion.formato || 'A4',
          orientacion: configuracion.orientacion || 'vertical',
          idioma: configuracion.idioma || 'es'
        }
      }, {
        responseType: 'blob' // Para manejar archivos binarios
      });

      // Crear URL para descarga
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      return {
        url_descarga: url,
        nombre_archivo: `cierre_caja_${cierreId}_${new Date().toISOString().split('T')[0]}.pdf`,
        size: blob.size
      };
    } catch (error) {
      console.error('Error exportando PDF:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al generar el PDF del cierre'
      );
    }
  }

  // Enviar cierre por email
  async enviarCierrePorEmail(cierreId, configuracion = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/enviar-email/${cierreId}`, {
        configuracion,
        destinatarios: configuracion.destinatarios || []
      });

      return {
        mensaje: response.data.mensaje || 'Email enviado exitosamente',
        destinatarios: response.data.destinatarios || []
      };
    } catch (error) {
      console.error('Error enviando email:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al enviar el PDF por email'
      );
    }
  }

  // Exportar historial a Excel
  async exportarHistorialExcel(filtros = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/exportar-excel`, {
        filtros
      }, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      
      return {
        url_descarga: url,
        nombre_archivo: `historial_cierres_${new Date().toISOString().split('T')[0]}.xlsx`
      };
    } catch (error) {
      console.error('Error exportando Excel:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al generar el archivo Excel'
      );
    }
  }

  // Sincronizar datos
  async sincronizarDatos() {
    try {
      const response = await axios.post(`${this.baseURL}/sincronizar`);
      this.clearCache(); // Limpiar caché después de sincronizar
      return response.data;
    } catch (error) {
      console.error('Error sincronizando datos:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al sincronizar los datos'
      );
    }
  }

  // Generar vista previa de PDF
  async generarVistaPreviaPDF(cierreId, configuracion = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/vista-previa-pdf/${cierreId}`, {
        configuracion
      });

      return response.data;
    } catch (error) {
      console.error('Error generando vista previa:', error);
      throw new Error(
        error.response?.data?.message || 
        'Error al generar la vista previa'
      );
    }
  }

  // Utilidades de cálculo
  calcularPrecision(diferencia, totalEsperado) {
    if (totalEsperado <= 0) return 100;
    return Math.max(0, 100 - (Math.abs(diferencia) / totalEsperado * 100));
  }

  calcularEstadoDiferencia(diferencia) {
    if (diferencia === 0) {
      return {
        estado: 'correcto',
        color: 'success',
        mensaje: 'Caja balanceada correctamente'
      };
    } else if (diferencia < 0) {
      return {
        estado: 'faltante',
        color: 'error',
        mensaje: `Faltante de $${Math.abs(diferencia).toFixed(2)}`
      };
    } else {
      return {
        estado: 'sobrante',
        color: 'info',
        mensaje: `Sobrante de $${diferencia.toFixed(2)}`
      };
    }
  }

  // Utilidades de formato
  formatearFechaCierre(fecha) {
    return new Date(fecha).toLocaleDateString('es-UY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHoraCierre(hora) {
    return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-UY', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearMoneda(monto) {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU'
    }).format(monto);
  }

  // Validaciones de negocio
  validarHorarioCierre() {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    
    // Permitir cierre solo después de las 18:00 o antes de las 6:00 (para turnos nocturnos)
    return horaActual >= 18 || horaActual < 6;
  }

  validarCierreYaRealizado(cierreExistente) {
    return cierreExistente && cierreExistente.estado === 'cerrado';
  }

  // Métricas y análisis
  calcularTendenciaPrecision(historial) {
    if (!historial || historial.length < 2) return 'estable';
    
    const ultimosCinco = historial.slice(-5);
    const promedio = ultimosCinco.reduce((acc, cierre) => acc + cierre.precision, 0) / ultimosCinco.length;
    
    if (promedio >= 98) return 'excelente';
    if (promedio >= 95) return 'buena';
    if (promedio >= 90) return 'regular';
    return 'necesita_mejora';
  }

  calcularRiesgoOperacional(diferencia, totalEsperado) {
    if (totalEsperado <= 0) return 'bajo';
    
    const porcentajeDiferencia = (Math.abs(diferencia) / totalEsperado) * 100;
    
    if (porcentajeDiferencia >= 10) return 'alto';
    if (porcentajeDiferencia >= 5) return 'medio';
    return 'bajo';
  }

  // Configuración y preferencias
  guardarConfiguracionExportacion(configuracion) {
    localStorage.setItem('cierre_caja_export_config', JSON.stringify(configuracion));
  }

  obtenerConfiguracionExportacion() {
    const configData = localStorage.getItem('cierre_caja_export_config');
    return configData ? JSON.parse(configData) : {
      plantilla: 'completa',
      incluirGraficos: true,
      incluirFirmaDigital: true,
      incluirCodigoQR: true,
      incluirDetalleVentas: true,
      incluirComparacion: true,
      incluirRecomendaciones: false,
      formato: 'A4',
      orientacion: 'vertical',
      idioma: 'es'
    };
  }
}

// Crear instancia única del servicio
const cierreCajaService = new CierreCajaService();

// Configurar interceptores al crear la instancia
cierreCajaService.setupInterceptors();
export { cierreCajaService };