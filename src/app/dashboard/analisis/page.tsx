'use client';
export const dynamic = 'force-dynamic';


import React from 'react';
import { AnalysisPage } from '@/components/dashboard/analytics/analysis-page';
import { AuthProvider } from '@/context/auth-context';


export default function AnalysisPageWrapper() {
  return (
    <AuthProvider>
      <AnalysisPage />
    </AuthProvider>
  );}