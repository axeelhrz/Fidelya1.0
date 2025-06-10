'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ActionBarProps {
  onCameraClick?: () => void;
  onSearchClick?: () => void;
  onFileClick?: () => void;
  onSaveClick?: () => void;
  className?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({
  onCameraClick,
  onSearchClick,
  onFileClick,
  onSaveClick,
  className = ""
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const CameraIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 15.2l3.2-2.7L12 9.8 8.8 12.5 12 15.2zM9 2l-1.83 2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-2.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  );

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  );

  const FileIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );

  const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
    </svg>
  );

  const actions = [
    {
      id: 'camera',
      icon: CameraIcon,
      label: 'Cámara',
      onClick: onCameraClick,
      color: '#FF6B6B'
    },
    {
      id: 'search',
      icon: SearchIcon,
      label: 'Buscar',
      onClick: onSearchClick,
      color: '#4ECDC4'
    },
    {
      id: 'file',
      icon: FileIcon,
      label: 'Archivo',
      onClick: onFileClick,
      color: '#45B7D1'
    },
    {
      id: 'save',
      icon: SaveIcon,
      label: 'Guardar',
      onClick: onSaveClick,
      color: '#FFD600'
    }
  ];

  const handleActionClick = (action: typeof actions[0]) => {
    setActiveAction(action.id);
    if (action.onClick) {
      action.onClick();
    }
    
    // Reset active state after animation
    setTimeout(() => setActiveAction(null), 200);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action) => {
        const IconComponent = action.icon;
        const isActive = activeAction === action.id;
        
        return (
          <motion.button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`relative p-3 rounded-lg transition-all duration-200 group ${
              isActive 
                ? 'bg-white text-black shadow-lg' 
                : 'bg-[#404040] text-white hover:bg-[#4A4A4A]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-tooltip={action.label}
          >
            <IconComponent />
            
            {/* Indicador de color */}
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#2E2E2E]"
              style={{ backgroundColor: action.color }}
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              {action.label}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ActionBar;
