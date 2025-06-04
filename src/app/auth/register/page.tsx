"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, MenuItem, Alert } from '@mui/material';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  curso: z.string().min(1, 'Curso requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    const { email, password, nombre, curso } = data;
    const supabase = supabaseBrowser();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    const user = signUpData.user;
    if (user) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        nombre,
        curso,
        email,
        rol: 'user',
      });
      if (insertError) {
        setError(insertError.message);
      } else {
        router.push('/auth/check-email');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField
          label="Nombre del estudiante"
          {...register('nombre')}
          error={!!errors.nombre}
          helperText={errors.nombre?.message}
        />
        <TextField
          select
          label="Curso"
          {...register('curso')}
          error={!!errors.curso}
          helperText={errors.curso?.message}
        >
          {[1,2,3,4,5,6].map((c) => (
            <MenuItem key={c} value={`${c}`}>{`${c}º`}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Email del tutor"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Contraseña"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained">
          Registrarse
        </Button>
      </form>
    </div>
  );
}
