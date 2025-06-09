import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthFormWrapper
      title="Crear Cuenta"
      subtitle="Únete a nosotros y comienza a gestionar tu frutería"
    >
      <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
    </AuthFormWrapper>
  );
};

export default RegisterPage;