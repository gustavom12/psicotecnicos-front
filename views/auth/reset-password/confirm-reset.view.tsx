import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Star from "@/public/icons/Star";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";

interface FormData {
  password: string;
  confirmPassword: string;
}

const ConfirmResetView = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    if (!token) {
      Notification("Token de recuperación no válido", "error");
      return;
    }

    setIsLoading(true);
    try {
      await apiConnection.post("/auth/reset-password-confirm", {
        token: token as string,
        newPassword: data.password,
      });

      setIsSuccess(true);
      Notification("Contraseña actualizada exitosamente", "success");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Error al actualizar la contraseña";
      Notification(errorMessage, "error");
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
            <h1 className="text-[#3F3F46] text-[24px] font-semibold mb-2 text-center">¡Contraseña actualizada!</h1>
            <p className="text-[#A1A1AA] text-[14px] font-light text-center">
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full bg-[#635BFF] hover:bg-[#534bf0] text-white font-medium h-12 rounded-lg transition-colors">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F5] px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md border border-gray-100">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Star />
              <p className="text-[20px] text-[#635BFF] font-semibold">Psicotécnicos</p>
            </div>
            <div className="flex items-center justify-center bg-red-100 rounded-full w-16 h-16 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-[#3F3F46] text-[24px] font-semibold mb-2 text-center">Enlace inválido</h1>
            <p className="text-[#A1A1AA] text-[14px] font-light text-center">
              El enlace de recuperación no es válido o ha expirado.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/auth/reset-password">
              <Button className="w-full bg-[#635BFF] hover:bg-[#534bf0] text-white font-medium h-12 rounded-lg transition-colors">
                Solicitar nuevo enlace
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="light"
                className="w-full text-[#635BFF] hover:bg-[#635BFF]/10 font-medium h-12 rounded-lg transition-colors"
              >
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
          <h1 className="text-[#3F3F46] text-[28px] font-semibold mb-2">Nueva contraseña</h1>
          <p className="text-[#A1A1AA] text-[14px] font-light text-center">
            Ingresa tu nueva contraseña
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <Input
              id="password"
              type="password"
              label="Nueva contraseña"
              labelPlacement="outside"
              placeholder="Ingresa tu nueva contraseña"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres"
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
                }
              })}
              className="w-full"
              classNames={{
                label: "text-[#3F3F46] text-sm font-medium mb-2",
                input: "text-[#3F3F46]",
                inputWrapper: "border-gray-200 hover:border-[#635BFF] focus-within:border-[#635BFF]"
              }}
              isRequired
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message as string}
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirmar contraseña"
              labelPlacement="outside"
              placeholder="Confirma tu nueva contraseña"
              {...register("confirmPassword", {
                required: "Debes confirmar tu contraseña",
                validate: (value) => value === password || "Las contraseñas no coinciden"
              })}
              className="w-full"
              classNames={{
                label: "text-[#3F3F46] text-sm font-medium",
                input: "text-[#3F3F46]",
                inputWrapper: "border-gray-200 mt-6 hover:border-[#635BFF] focus-within:border-[#635BFF]"
              }}
              isRequired
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message as string}
            />
          </div>

          {/* Botones */}
          <div className="space-y-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-[#635BFF] hover:bg-[#534bf0] text-white font-medium h-12 rounded-lg transition-colors"
            >
              {isLoading ? "Actualizando..." : "Actualizar contraseña"}
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

export default ConfirmResetView;
