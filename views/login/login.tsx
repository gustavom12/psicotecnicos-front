import ButtonSocial from "@/common/buttonRedSocial";
import Bell from "@/public/icons/Bell";
import Man from "@/public/icons/ManIcon";
import Star from "@/public/icons/Star";
import { Button, Input } from "@heroui/react";
import React from "react";

function LoginView() {
  return (
    <div className="flex justify-center items-center bg-gray-600 h-screen">
      <div className="flex flex-col items-center justify-center w-[400px] h-[520px] bg-white rounded-lg shadow-lg justify-center">
        <div className="flex flex-row items-center justify-start space-x-2 mb-4">
          <Star />
          <p className="text-[20px] text-[#635BFF] font-medium ">Psicotecnicos</p>
        </div>
        <h1 className="text-[#3F3F46] text-[30px] font-semibold ">Iniciar sesión</h1>
        <p className="text-[#A1A1AA] text-[14px] font-light mt-2 mb-4">Ingresa tus datos</p>
        <div className="flex flex-col space-y-14">
          <Input isRequired label="E-mail" labelPlacement="outside" className="color-[#F4F4F5] w-[320px] " placeholder="gonzalo.perez@empresa.com.ar" />
          <Input isRequired label="Contraseña" labelPlacement="outside" className="color-[#F4F4F5] w-[320px] " placeholder="*********" type="password" />
        </div>
        <p className="flex text-[#A1A1AA] text-[14px] font-light w-full mt-3 pr-10 justify-end items-end">¿Olvidaste tu contraseña?</p>

        <Button className="bg-[#635BFF] mt-6 w-[320px] text-white rounded-md">Iniciar sesión</Button>
        <hr className="w-[320px] border border-[#D4D4D8] mt-4" />
        <div className="flex flex-row  w-[340px] space-x-2">
          <ButtonSocial
            icon={<Man />}
            text="Google  "
          />
          <ButtonSocial
            icon={<Man />}
            text="Facebook"
          />
        </div>
      </div>
    </div>
  )

}

export default LoginView;
