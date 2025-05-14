import { 
  MOCK_EXCHANGE_RATES,
  getCurrencyConfig
} from './currency-config';

// Tipos para la respuesta de la API de geolocalización
export interface GeoLocationResponse {
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
  flag: string;
}

// Tipos para las tasas de cambio
export interface ExchangeRates {
  [currency: string]: number;
}

// Mapa de códigos de país a monedas
const COUNTRY_CURRENCY_MAP: Record<string, { currency: string; symbol: string }> = {
  US: { currency: 'USD', symbol: '$' },
  ES: { currency: 'EUR', symbol: '€' },
  GB: { currency: 'GBP', symbol: '£' },
  MX: { currency: 'MXN', symbol: '$' },
  AR: { currency: 'ARS', symbol: '$' },
  CL: { currency: 'CLP', symbol: '$' },
  CO: { currency: 'COP', symbol: '$' },
  PE: { currency: 'PEN', symbol: 'S/' },
  BR: { currency: 'BRL', symbol: 'R$' },
  // Añadir más países según sea necesario
};

// Mapa de códigos de país a banderas (emoji)
const COUNTRY_FLAG_MAP: Record<string, string> = {
  US: '🇺🇸',
  ES: '🇪🇸',
  GB: '🇬🇧',
  MX: '🇲🇽',
  AR: '🇦🇷',
  CL: '🇨🇱',
  CO: '🇨🇴',
  PE: '🇵🇪',
  BR: '🇧🇷',
  // Añadir más países según sea necesario
};

// Nombres de países en español
const COUNTRY_NAMES_ES: Record<string, string> = {
  US: 'Estados Unidos',
  ES: 'España',
  GB: 'Reino Unido',
  MX: 'México',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Perú',
  BR: 'Brasil',
  // Añadir más países según sea necesario
};

/**
 * Detecta la ubicación del usuario basada en su IP
 * En producción, esto usaría una API real como ipapi.co o ip-api.com
 */
export async function detectUserCountry(): Promise<GeoLocationResponse> {
  try {
    // En un entorno real, aquí haríamos una llamada a una API de geolocalización
    // Por ejemplo: const response = await fetch('https://ipapi.co/json/');
    
    // Simulamos una respuesta para desarrollo
    // En producción, esto sería reemplazado por una llamada real a la API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular latencia de red
    
    // Por defecto, asumimos España como ubicación
    const defaultCountry = 'ES';
    
    // Obtener información de la moneda para el país detectado
    const currencyInfo = COUNTRY_CURRENCY_MAP[defaultCountry] || COUNTRY_CURRENCY_MAP.ES;
    
    return {
      country: COUNTRY_NAMES_ES[defaultCountry] || 'España',
      countryCode: defaultCountry,
      currency: currencyInfo.currency,
      currencySymbol: currencyInfo.symbol,
      flag: COUNTRY_FLAG_MAP[defaultCountry] || '🇪🇸',
    };
  } catch (error) {
    console.error('Error detectando país:', error);
    
    // En caso de error, devolver valores por defecto (España/EUR)
    return {
      country: 'España',
      countryCode: 'ES',
      currency: 'EUR',
      currencySymbol: '€',
      flag: '🇪🇸',
    };
  }
}

/**
 * Obtiene las tasas de cambio actuales
 * En producción, esto usaría una API real como exchangeratesapi.io o similar
 */
export async function getExchangeRates(baseCurrency: string = 'EUR'): Promise<ExchangeRates> {
  try {
    // En un entorno real, aquí haríamos una llamada a una API de tasas de cambio
    // Por ejemplo: const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`);
    
    // Simulamos una respuesta para desarrollo
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular latencia de red
    
    // Si la moneda base no es EUR, necesitamos convertir las tasas
    if (baseCurrency !== 'EUR') {
      const baseRate = MOCK_EXCHANGE_RATES[baseCurrency];
      if (!baseRate) return MOCK_EXCHANGE_RATES;
      
      const convertedRates: ExchangeRates = {};
      Object.entries(MOCK_EXCHANGE_RATES).forEach(([currency, rate]) => {
        convertedRates[currency] = rate / baseRate;
      });
      
      return convertedRates;
    }
    
    return MOCK_EXCHANGE_RATES;
  } catch (error) {
    console.error('Error obteniendo tasas de cambio:', error);
    return MOCK_EXCHANGE_RATES;
  }
}

/**
 * Convierte un precio de una moneda a otra
 */
export function convertPrice(
  amount: number,
  fromCurrency: string = 'EUR',
  toCurrency: string = 'EUR',
  rates: ExchangeRates = MOCK_EXCHANGE_RATES
): number {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  
  if (!fromRate || !toRate) return amount;
  
  // Convertir a la moneda base (EUR) y luego a la moneda destino
  return (amount / fromRate) * toRate;
}

/**
 * Formatea un precio según la moneda y el locale
 */
export function formatPriceForCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'es-ES'
): string {
  // Obtener la configuración de la moneda
  const currencyConfig = getCurrencyConfig(currency);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currencyConfig.decimals,
    maximumFractionDigits: currencyConfig.decimals,
  }).format(amount);
}

/**
 * Hook personalizado para usar la detección de país y conversión de moneda
 */
export function useCountryDetection() {
  return {
    detectUserCountry,
    getExchangeRates,
    convertPrice,
    formatPriceForCurrency,
  };
}