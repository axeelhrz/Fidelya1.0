'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  detectUserCountry, 
  getExchangeRates, 
  convertPrice, 
  formatPriceForCurrency,
  GeoLocationResponse,
  ExchangeRates
} from '@/lib/geo/country-detection';
import { SUPPORTED_CURRENCIES, getCurrencyConfig } from '@/lib/geo/currency-config';

// Tipos para el contexto
interface CurrencyContextType {
  geoData: GeoLocationResponse | null;
  rates: ExchangeRates | null;
  currency: string;
  currencySymbol: string;
  loading: boolean;
  error: string | null;
  setCurrency: (currency: string) => void;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  formatPrice: (amount: number, fromCurrency?: string) => string;
  supportedCurrencies: typeof SUPPORTED_CURRENCIES;
}

// Crear el contexto
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Proveedor del contexto
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [geoData, setGeoData] = useState<GeoLocationResponse | null>(null);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [currency, setCurrency] = useState<string>('EUR');
  const [currencySymbol, setCurrencySymbol] = useState<string>('€');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar la detección de país y tasas de cambio
  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        
        // Detectar país del usuario
        const countryData = await detectUserCountry();
        setGeoData(countryData);
        
        // Establecer la moneda detectada
        setCurrency(countryData.currency);
        setCurrencySymbol(countryData.currencySymbol);
        
        // Obtener tasas de cambio
        const exchangeRates = await getExchangeRates();
        setRates(exchangeRates);
        
        setLoading(false);
      } catch (err) {
        console.error('Error inicializando contexto de moneda:', err);
        setError('No se pudo detectar la ubicación o las tasas de cambio');
        setLoading(false);
      }
    }
    
    initialize();
  }, []);

  // Actualizar el símbolo de la moneda cuando cambia la moneda
  useEffect(() => {
    const currencyConfig = getCurrencyConfig(currency);
    setCurrencySymbol(currencyConfig.symbol);
  }, [currency]);

  // Función para convertir precios a la moneda actual
  const convertPriceToCurrentCurrency = (amount: number, fromCurrency: string = 'EUR'): number => {
    if (!rates) return amount;
    return convertPrice(amount, fromCurrency, currency, rates);
  };

  // Función para formatear precios en la moneda actual
  const formatPriceInCurrentCurrency = (amount: number, fromCurrency: string = 'EUR'): string => {
    if (!geoData) return `${amount}`;
    
    const convertedAmount = convertPriceToCurrentCurrency(amount, fromCurrency);
    return formatPriceForCurrency(convertedAmount, currency, geoData.locale);
  };

  // Valor del contexto
  const value: CurrencyContextType = {
    geoData,
    rates,
    currency,
    currencySymbol,
    loading,
    error,
    setCurrency,
    convertPrice: convertPriceToCurrentCurrency,
    formatPrice: formatPriceInCurrentCurrency,
    supportedCurrencies: SUPPORTED_CURRENCIES
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency debe ser usado dentro de un CurrencyProvider');
  }
  return context;
}