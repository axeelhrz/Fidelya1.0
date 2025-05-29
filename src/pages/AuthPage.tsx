import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';

export const AuthPage: React.FC = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
  };

  return <LoginForm onToggleMode={toggleMode} isRegisterMode={isRegisterMode} />;
};