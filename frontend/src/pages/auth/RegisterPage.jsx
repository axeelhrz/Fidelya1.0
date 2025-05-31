import React from 'react';
import AuthFormWrapper from '../../components/auth/AuthFormWrapper';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = ({ onSwitchToLogin }) => {
  return (
    <AuthFormWrapper
      title="Crear Cuenta"
      subtitle="Únete a nosotros y comienza a gestionar tu frutería"
    >
      <RegisterForm onSwitchToLogin={onSwitchToLogin} />
    </AuthFormWrapper>
  );
};

export default RegisterPage;