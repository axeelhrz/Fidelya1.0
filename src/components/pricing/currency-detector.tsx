'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, CircularProgress } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { motion } from 'framer-motion';
import { 
  detectUserCountry, 
  getExchangeRates, 
  GeoLocationResponse, 
} from '@/lib/geo/country-detection';

interface CurrencyDetectorProps {
  onCurrencyChange?: (currency: string, symbol: string, rate: number) => void;
  showSelector?: boolean;
}

export function CurrencyDetector({ onCurrencyChange, showSelector = true }: CurrencyDetectorProps) {
  const [geoData, setGeoData] = useState<GeoLocationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  // Opciones de moneda para el selector
  const currencyOptions = [
    { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
    { value: 'USD', label: 'USD - Dólar estadounidense', symbol: '$' },
    { value: 'GBP', label: 'GBP - Libra esterlina', symbol: '£' },
    { value: 'MXN', label: 'MXN - Peso mexicano', symbol: '$' },
    { value: 'ARS', label: 'ARS - Peso argentino', symbol: '$' },
    { value: 'CLP', label: 'CLP - Peso chileno', symbol: '$' },
    { value: 'COP', label: 'COP - Peso colombiano', symbol: '$' },
    { value: 'PEN', label: 'PEN - Sol peruano', symbol: 'S/' },
    { value: 'BRL', label: 'BRL - Real brasileño', symbol: 'R$' },
  ];

  useEffect(() => {
    async function initialize() {
      try {
        setLoading(true);
        
        // Detectar país del usuario
        const countryData = await detectUserCountry();
        setGeoData(countryData);
        
        // Obtener tasas de cambio
        // Obtener tasas de cambio
        const exchangeRates = await getExchangeRates();
        
        // Establecer la moneda detectada como seleccionada
        setSelectedCurrency(countryData.currency);
        
        // Notificar al componente padre sobre la moneda detectada
        if (onCurrencyChange && exchangeRates) {
          onCurrencyChange(
            countryData.currency, 
            countryData.currencySymbol, 
            exchangeRates[countryData.currency] || 1
          );
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error inicializando detector de moneda:', err);
        setError('No se pudo detectar tu ubicación');
        setLoading(false);
      }
    }
    
    initialize();
  }, [onCurrencyChange]);

  // Manejar cambio de moneda en el selector
  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);
    
    const selectedOption = currencyOptions.find(option => option.value === newCurrency);
    if (selectedOption && onCurrencyChange && geoData) {
      // We would need exchange rates here, but for now passing 1 as default rate
      onCurrencyChange(newCurrency, selectedOption.symbol, 1);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1 }}>
        <CircularProgress size={20} sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Detectando ubicación...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1 }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!geoData) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {geoData.flag} Precios mostrados en {selectedCurrency} para {geoData.country}
        </Typography>
        <Tooltip title="Detectamos automáticamente tu ubicación para mostrarte los precios en tu moneda local">
          <InfoOutlinedIcon fontSize="small" sx={{ color: 'text.secondary', cursor: 'help' }} />
        </Tooltip>
        {showSelector && (
          <select 
            value={selectedCurrency} 
            onChange={handleCurrencyChange}
            style={{ marginLeft: '10px', padding: '4px' }}
          >
            {currencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Box>
    </motion.div>
  );
}