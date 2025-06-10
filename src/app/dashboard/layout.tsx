'use client';
import React from 'react';
import { SCATProvider } from '@/contexts/SCATContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SCATProvider>
      <div className="min-h-screen bg-[#3C3C3C]">
        {children}
      </div>
    </SCATProvider>
  );
}
