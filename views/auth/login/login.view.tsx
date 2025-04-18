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
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full mt-10 max-w-md mx-auto">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h4>Bienvenido de nuevo!</h4>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Contraseña</label>
            <Input
              id="password"
              {...register("password", { required: true })}
            />
          </div>
          <Button className="w-full mt-10" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;
