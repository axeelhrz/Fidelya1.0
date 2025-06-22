import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

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

export function AuthForm<TSchema extends ZodTypeAny>({ 
  schema, 
  onSubmit, 
  fields, 
  submitText, 
  loading 
}: AuthFormProps<TSchema>) {
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
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Input
            {...register(field.name)}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            icon={field.icon}
            error={errors[field.name]?.message as string}
            autoComplete={
              field.type === 'email' ? 'email' : 
              field.type === 'password' ? 'current-password' : 
              'off'
            }
          />
        </motion.div>
      ))}
      
      {errors.root && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-red-50 border border-red-200 p-4"
        >
          <p className="text-sm text-red-600 font-medium">{errors.root.message as string}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: fields.length * 0.1 }}
      >
        <Button
          type="submit"
          fullWidth
          loading={isSubmitting || loading}
          className="mt-2"
        >
          {submitText}
        </Button>
      </motion.div>
    </motion.form>
  );
}