// Configuración de monedas y países soportados

// Tipos para la configuración de monedas
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

// Configuración de monedas soportadas
export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimals: 2
  },
  MXN: {
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    decimals: 2
  },
  ARS: {
    code: 'ARS',
    symbol: '$',
    name: 'Argentine Peso',
    decimals: 2
  },
  CLP: {
    code: 'CLP',
    symbol: '$',
    name: 'Chilean Peso',
    decimals: 0
  },
  COP: {
    code: 'COP',
    symbol: '$',
    name: 'Colombian Peso',
    decimals: 0
  },
  PEN: {
    code: 'PEN',
    symbol: 'S/',
    name: 'Peruvian Sol',
    decimals: 2
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    decimals: 2
  }
};

// Función para obtener la configuración de una moneda por su código
export function getCurrencyConfig(currencyCode: string): CurrencyConfig {
  return SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.EUR;
}

// Tasas de cambio de ejemplo (en producción, estas se obtendrían de una API)
// Valores relativos al EUR (Euro como base)
export const MOCK_EXCHANGE_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  MXN: 18.5,
  ARS: 950,
  CLP: 950,
  COP: 4200,
  PEN: 4.1,
  BRL: 5.4,
};

// Función para obtener la tasa de cambio entre dos monedas
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  const fromRate = MOCK_EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = MOCK_EXCHANGE_RATES[toCurrency] || 1;
  
  return toRate / fromRate;
}