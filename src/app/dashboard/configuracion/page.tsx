'use client';

import React from 'react';
import SettingsPage from '@/components/dashboard/settings/settingPage';
import { AuthProvider } from '@/context/auth-context';

export default function ConfiguracionPage() {
  return (
    <AuthProvider>
      <SettingsPage />
    </AuthProvider>
  );
}