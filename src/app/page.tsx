"use client";

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const { register, handleSubmit, formState: { isValid, errors } } = useForm({ mode: 'onChange' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

  // Datos de prueba
  const users = [
    { email: 'prueba1@hotmail.com', password: 'test1' },
    { email: 'prueba2@hotmail.com', password: 'test2' },
  ];

  const onSubmit = (data: any) => {
    const user = users.find(user => user.email === data.email && user.password === data.password);
    
    if (user) {
      router.push('/home');
    } else {
      setLoginError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center w-1/2 bg-black p-8">
        <img src="/img/logobarber.png" alt="Logo Barbería" className="mb-10 w-[292px] h-[120px]" />
        <h2 className="text-white text-2xl font-semibold mb-10 text-center">Inicio de sesión.</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16 w-full max-w-md">
          {/* Correo electrónico */}
          <div className="flex flex-col">
            <label className="block text-white text-sm mb-2 font-light" htmlFor="email">Correo electrónico</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                maxLength={50}  // Límite de caracteres para el correo
                {...register('email', { 
                  required: 'Este campo es obligatorio.',
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: 'No coincide con el formato.'
                  }
                })}
                placeholder="Escribe tu correo aquí"
                className="w-full max-w-[460px] p-2 pl-10 border border-[#2B2E3B] rounded-md bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <img src="/img/mail.svg" alt="Email Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{(errors.email.message as string) || 'Error'}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="flex flex-col">
            <label className="block text-white text-sm mb-2 font-light" htmlFor="password">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                maxLength={20}  // Límite de caracteres para la contraseña
                {...register('password', { required: 'Este campo es obligatorio.' })}
                className="w-full max-w-[460px] p-2 pl-10 border border-[#2B2E3B] rounded-md bg-transparent text-white placeholder-gray-500 focus:outline-none"
              />
              <img src="/img/lock.svg" alt="Lock Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <img
                  src={showPassword ? '/img/viewpass.svg' : '/img/notviewpass.svg'}
                  alt="Toggle Password"
                  className="w-6 h-6"
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{(errors.password.message as string) || 'Error'}</p>
            )}
            <p className="text-right text-gray-400 text-sm mt-1">
              <a href="/reestablecer-contraseña" className="hover:underline">¿Olvidaste tu contraseña?</a>
            </p>
          </div>

          {/* Mensaje de error */}
          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          {/* Botón de inicio de sesión */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-[260px] py-2 rounded-md mx-auto ${isValid ? 'bg-white text-black' : 'bg-gray-500 text-gray-300 cursor-not-allowed'} transition duration-300`}
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-xs">Powered by</p>
          <img src="/img/logodiv.svg" alt="Logo Div" className="w-[42px] h-[42px] mx-auto" />
          <p className="text-gray-400 text-xs">Divlabs</p>
        </div>
      </div>

      <div className="w-1/2 bg-cover bg-no-repeat" style={{ backgroundImage: "url('/img/barbercover.png')" }}>
        <div className="bg-gradient-to-r from-black to-transparent h-full"></div>
      </div>
    </div>
  );
};

export default HomePage;
