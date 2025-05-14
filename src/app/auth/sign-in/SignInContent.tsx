'use client';

import SignInForm from '@/components/auth/sign-in-form';
import GuestGuard from '@/components/auth/guest-guard';

export default function SignInContent() {
  return (
    <GuestGuard>
      <SignInForm />
    </GuestGuard>
  );
}