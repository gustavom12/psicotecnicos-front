import { useAuthContext } from "@/contexts/auth.context";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React from "react";
import { useForm } from "react-hook-form";

const LoginView = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuthContext();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-[#635bff] mb-1">Iniciar sesión</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Accedé a tu cuenta</p>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="text-sm text-gray-700">Email</label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: true })}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-gray-700">Contraseña</label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: true })}
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-[#635bff] hover:bg-[#534bf0] text-white font-medium"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
