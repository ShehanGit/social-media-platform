// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../../api/auth';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';
import React from 'react';

interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = data;
      await authAPI.register(registerData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <Input
        label="First Name"
        {...register('firstname', { required: 'First name is required' })}
        error={errors.firstname?.message}
      />
      <Input
        label="Last Name"
        {...register('lastname', { required: 'Last name is required' })}
        error={errors.lastname?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password', { 
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          }
        })}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        {...register('confirmPassword', { 
          required: 'Please confirm your password',
          validate: (value) => value === watch('password') || 'Passwords do not match'
        })}
        error={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
      >
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;