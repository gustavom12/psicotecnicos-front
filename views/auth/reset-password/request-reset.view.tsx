import { useAuthContext } from "@/contexts/auth.context";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Star from "@/public/icons/Star";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

const RequestResetView = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { resetPassword } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      const success = await resetPassword(data.email);
      if (success) {
        setIsSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md border border-gray-100">
          {/* Logo y título */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Star />
              <p className="text-[20px] text-[#635BFF] font-semibold">Psicotécnicos</p>
            </div>
            <div className="flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-[#3F3F46] text-[24px] font-semibold mb-2 text-center">¡Correo enviado!</h1>
            <p className="text-[#A1A1AA] text-[14px] font-light text-center">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full bg-[#635BFF] hover:bg-[#534bf0] text-white font-medium h-12 rounded-lg transition-colors">
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5] px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md border border-gray-100">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Star />
            <p className="text-[20px] text-[#635BFF] font-semibold">Psicotécnicos</p>
          </div>
          <h1 className="text-[#3F3F46] text-[28px] font-semibold mb-2">Recuperar contraseña</h1>
          <p className="text-[#A1A1AA] text-[14px] font-light text-center">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              labelPlacement="outside"
              placeholder="gonzalo.perez@empresa.com.ar"
              {...register("email", {
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Ingresa un correo electrónico válido"
                }
              })}
              className="w-full"
              classNames={{
                label: "text-[#3F3F46] text-sm font-medium mb-2",
                input: "text-[#3F3F46]",
                inputWrapper: "border-gray-200 hover:border-[#635BFF] focus-within:border-[#635BFF]"
              }}
              isRequired
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message as string}
            />
          </div>

          {/* Botones */}
          <div className="space-y-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-[#635BFF] hover:bg-[#534bf0] text-white font-medium h-12 rounded-lg transition-colors"
            >
              {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
            </Button>

            <Link href="/auth/login">
              <Button
                variant="light"
                className="w-full text-[#635BFF] hover:bg-[#635BFF]/10 font-medium h-12 rounded-lg transition-colors"
              >
                Volver al inicio de sesión
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestResetView;
