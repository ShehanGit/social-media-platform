// // // src/components/auth/LoginForm.tsx
// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useForm } from 'react-hook-form';
// // import { authAPI } from '../../api/auth';
// // import Button from '../common/Button';
// // import Input from '../common/Input';
// // import toast from 'react-hot-toast';
// // import React from 'react';

// // interface LoginFormData {
// //   email: string;
// //   password: string;
// // }

// // const LoginForm = () => {
// //   const [isLoading, setIsLoading] = useState(false);
// //   const navigate = useNavigate();
// //   const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

// //   const onSubmit = async (data: LoginFormData) => {
// //     try {
// //       setIsLoading(true);
// //       const response = await authAPI.login(data);
// //       localStorage.setItem('token', response.token);
// //       toast.success('Login successful!');
// //       navigate('/', { replace: true });
// //     } catch (error) {
// //       toast.error('Invalid email or password');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
// //       <Input
// //         label="Email"
// //         type="email"
// //         {...register('email', { required: 'Email is required' })}
// //         error={errors.email?.message}
// //       />
// //       <Input
// //         label="Password"
// //         type="password"
// //         {...register('password', { required: 'Password is required' })}
// //         error={errors.password?.message}
// //       />
// //       <Button
// //         type="submit"
// //         isLoading={isLoading}
// //         className="w-full"
// //       >
// //         Login
// //       </Button>
// //     </form>
// //   );
// // };

// // export default LoginForm;

// // src/components/auth/LoginForm.tsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { authAPI } from '../../api/auth';
// import { usersAPI } from '../../api/users';
// import Button from '../common/Button';
// import Input from '../common/Input';
// import toast from 'react-hot-toast';
// import React from 'react';

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const LoginForm = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       setIsLoading(true);
//       // Login and get token
//       const response = await authAPI.login(data);
//       localStorage.setItem('token', response.token);

//       // Fetch user data to verify token is working
//       await usersAPI.getCurrentUser();
      
//       toast.success('Login successful!');
//       navigate('/', { replace: true });
//     } catch (error) {
//       localStorage.removeItem('token');
//       toast.error('Invalid email or password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
//       <Input
//         label="Email"
//         type="email"
//         {...register('email', { 
//           required: 'Email is required',
//           pattern: {
//             value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//             message: 'Invalid email address'
//           }
//         })}
//         error={errors.email?.message}
//       />
//       <Input
//         label="Password"
//         type="password"
//         {...register('password', { 
//           required: 'Password is required',
//           minLength: {
//             value: 6,
//             message: 'Password must be at least 6 characters'
//           }
//         })}
//         error={errors.password?.message}
//       />
//       <Button
//         type="submit"
//         isLoading={isLoading}
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
//         disabled={isLoading}
//       >
//         {isLoading ? 'Logging in...' : 'Login'}
//       </Button>
//     </form>
//   );
// };

// export default LoginForm;

// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../contexts/AuthContext';  // Import useAuth
import { Link } from 'react-router-dom';
import React from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Use the login function from context

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password); // Use context's login function
      // Navigation is handled in the AuthContext
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.password?.message}
          />
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;