import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Star from "@/public/icons/Star";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/router";
import { User, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

const IntervieweeLoginView = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login, authenticated } = useIntervieweeAuthContext();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (authenticated) {
      router.push("/interviewee");
    }
  }, [authenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      // Redirect is handled in the login function
    } catch (error) {
      // Error notification is handled in the login function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md border border-gray-100">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Star />
            <p className="text-[20px] text-[#635BFF] font-semibold">Psicotécnicos</p>
          </div>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-[#3F3F46] text-[28px] font-semibold mb-2">Portal de Entrevistados</h1>
          <p className="text-[#A1A1AA] text-[14px] font-light text-center">
            Ingresa tus credenciales para acceder a tus entrevistas
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div>
              <Input
                id="email"
                type="email"
                label="Correo electrónico"
                labelPlacement="outside"
                placeholder="tu.email@empresa.com"
                {...register("email", {
                  required: "El correo electrónico es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido"
                  }
                })}
                className="w-full"
                classNames={{
                  label: "text-[#3F3F46] text-sm font-medium mb-2",
                  input: "text-[#3F3F46]",
                  inputWrapper: "border-gray-200 hover:border-[#635BFF] focus-within:border-[#635BFF]"
                }}
                startContent={<User className="w-4 h-4 text-gray-400" />}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                isRequired
              />
            </div>

            <div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                labelPlacement="outside"
                placeholder="Ingresa tu contraseña"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
                className="w-full"
                classNames={{
                  label: "text-[#3F3F46] text-sm font-medium",
                  input: "text-[#3F3F46]",
                  inputWrapper: "border-gray-200 hover:border-[#635BFF] focus-within:border-[#635BFF]"
                }}
                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                isRequired
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">¿No tienes credenciales?</p>
                <p className="text-blue-600">
                  Si no has recibido tus credenciales de acceso, contacta al administrador
                  de tu empresa o al profesional que programó tu entrevista.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de login */}
          <Button
            type="submit"
            className="w-full bg-[#635BFF] hover:bg-[#534bf0] text-white font-medium h-12 rounded-lg transition-colors"
            isLoading={loading}
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        {/* Enlaces adicionales */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link
              href="/auth/login"
              className="hover:text-[#635BFF] transition-colors"
            >
              ¿Eres profesional?
            </Link>
            <span>•</span>
            <Link
              href="/"
              className="hover:text-[#635BFF] transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Portal seguro para candidatos • Psicotécnicos 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntervieweeLoginView;

