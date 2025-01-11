// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '../../api/auth';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';
import React from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(data);
      localStorage.setItem('token', response.token);
      toast.success('Login successful!');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
      <Input
        label="Email"
        type="email"
        {...register('email', { required: 'Email is required' })}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message}
      />
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;