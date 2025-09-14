import { useAuthContext } from "@/contexts/auth.context";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Star from "@/public/icons/Star";
import React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

const LoginView = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuthContext();

  const onSubmit = async (data) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md border border-gray-100">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Star />
            <p className="text-[20px] text-[#635BFF] font-semibold">Psicotécnicos</p>
          </div>
          <h1 className="text-[#3F3F46] text-[28px] font-semibold mb-2">Iniciar sesión</h1>
          <p className="text-[#A1A1AA] text-[14px] font-light">Ingresa tus datos para acceder</p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <Input
              id="email"
              type="email"
              label="E-mail"
              labelPlacement="outside"
              placeholder="gonzalo.perez@empresa.com.ar"
              {...register("email", { required: true })}
              className="w-full"
              classNames={{
                label: "text-[#3F3F46] text-sm font-medium mb-2",
                input: "text-[#3F3F46]",
                inputWrapper: "border-gray-200 hover:border-[#635BFF] focus-within:border-[#635BFF]"
              }}
              isRequired
            />
            <Input
              id="password"
              type="password"
              label="Contraseña"
              labelPlacement="outside"
              placeholder="*********"
              {...register("password", { required: true })}
              className="w-full my-6"
              classNames={{
                label: "text-[#3F3F46] text-sm font-medium",
                input: "text-[#3F3F46]",
                inputWrapper: "border-gray-200 mt-6 hover:border-[#635BFF] focus-within:border-[#635BFF]"
              }}
              isRequired
            />
          </div>

          {/* Enlace olvidaste contraseña */}
          <div className="flex justify-end">
            <Link href="/auth/reset-password">
              <button type="button" className="text-[#A1A1AA] text-[14px] font-light hover:text-[#635BFF] transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </Link>
          </div>

          {/* Botón de login */}
          <Button
            type="submit"
            className="w-full bg-[#635BFF] hover:bg-[#534bf0] text-white font-medium h-12 rounded-lg transition-colors"
          >
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
