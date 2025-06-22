import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { ZodTypeAny, TypeOf } from 'zod';

interface AuthFormProps<TSchema extends ZodTypeAny> {
  schema: TSchema;
  onSubmit: (data: TypeOf<TSchema>) => Promise<void>;
  fields: Array<{
    name: import('react-hook-form').Path<TypeOf<TSchema>>;
    label: string;
    type: string;
    icon?: React.ReactNode;
    placeholder?: string;
  }>;
  submitText: string;
  loading?: boolean;
}

export function AuthForm<TSchema extends ZodTypeAny>({ schema, onSubmit, fields, submitText, loading }: AuthFormProps<TSchema>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<TypeOf<TSchema>>({
    resolver: zodResolver(schema)
  });

  const handleFormSubmit = async (data: TypeOf<TSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error: unknown) {
      let message = 'Ha ocurrido un error. Inténtalo de nuevo.';
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        message = (error as { message: string }).message;
      }
      setError('root', {
        message
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {fields.map((field) => (
        <Input
          key={field.name}
          {...register(field.name)}
          type={field.type}
          label={field.label}
          placeholder={field.placeholder}
          icon={field.icon}
          error={errors[field.name]?.message as string}
        />
      ))}
      
      {errors.root && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{errors.root.message as string}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={isSubmitting || loading}
      >
        {submitText}
      </Button>
    </form>
  );
}
