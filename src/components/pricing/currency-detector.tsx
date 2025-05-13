'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Tooltip, CircularProgress, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PublicIcon from '@mui/icons-material/Public';
import { motion } from 'framer-motion';
import { 
  detectUserCountry, 
  getExchangeRates, 
  GeoLocationResponse, 
  ExchangeRates 
} from '@/lib/geo/country-detection';

interface CurrencyDetectorProps {
  onCurrencyChange?: (currency: string, symbol: string, rate: number) => void;
  showSelector?: boolean;
}

export function CurrencyDetector({ onCurrencyChange, showSelector = true }: CurrencyDetectorProps) {
  const [geoData, setGeoData] = useState<GeoLocationResponse | null>(null);
  const [rates, setRates] = useState<ExchangeRates | null>(null);
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
        const exchangeRates = await getExchangeRates();
        setRates(exchangeRates);
        
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
  const handleCurrencyChange = (event: SelectChangeEvent<string>) => {
    const newCurrency = event.target.value;
    setSelectedCurrency(newCurrency);
    
    // Encontrar el símbolo de la moneda seleccionada
    const currencyInfo = currencyOptions.find(option => option.value === newCurrency);
    
    // Notificar al componente padre sobre el cambio de moneda
    if (onCurrencyChange && rates && currencyInfo) {
      onCurrencyChange(
        newCurrency, 
        currencyInfo.symbol, 
        rates[newCurrency] || 1
      );
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 1, sm: 2 },
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PublicIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {geoData.flag} {geoData.country}
          </Typography>
        </Box>
        
        {showSelector ? (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="currency-select-label">Moneda</InputLabel>
            <Select
              labelId="currency-select-label"
              id="currency-select"
              value={selectedCurrency}
              label="Moneda"
              onChange={handleCurrencyChange}
              sx={{ height: 40 }}
            >
              {currencyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Precios mostrados en {selectedCurrency}
            </Typography>
            <Tooltip title="Detectamos automáticamente tu ubicación para mostrarte los precios en tu moneda local">
              <InfoOutlinedIcon 
                fontSize="small" 
                sx={{ color: 'text.secondary', cursor: 'help' }} 
              />
            </Tooltip>
          </Box>
        )}
      </Box>
    </motion.div>
  );
}