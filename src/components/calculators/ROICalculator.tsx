import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { X } from '@phosphor-icons/react';

interface ROICalculatorProps {
  open: boolean;
  onClose: () => void;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Calculadora de ROI</Typography>
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>Contenido de la calculadora ROI</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ROICalculator;