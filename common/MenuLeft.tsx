// import StarIcon from "@/public/icons/Star";
import Home from "@/public/icons/home";
import LogoToyota from "@/public/icons/logoToyota";
import Man from "@/public/icons/ManIcon";
import Messages from "@/public/icons/messages";
import Modulo from "@/public/icons/modulo";
import Note from "@/public/icons/note";
import Girl from "@/public/icons/photogirl";
import Profesional from "@/public/icons/profesional";
import Star from "@/public/icons/Star";
import { Button } from "@heroui/button";
import { Module } from "module";
import React from "react";

export default function MenuLeft() {
  return (<div className="flex flex-col  rounded-lg  h-screen " style={{ width: "240px", backgroundColor: "#F4F4F5" }}>

    <div className="flex flex-row align-middle p-4 justify-center text-center">
      <Star />
      <h2 className="text-[#635BFF] font-semibold text-xl px-2 text-start">Psicotécnicos</h2>
    </div>

    <div className="flex flex-col p-4">

      <div className="flex text-center px-2  py-2 w-[200px]">
        <Home />
        <p className="mx-4 size-[16px] font-normal text-[#3F3F46] px-2">Inicio</p>
      </div>

      <div className="flex text-center px-2  py-2 w-[200px]">
        <Modulo />
        <p className="mx-4 size-[16px] font-normal text-[#3F3F46] px-2">Módulos</p>
      </div>

      <div className="flex text-center px-2  py-2 w-[200px]">
        <Messages />
        <p className="mx-4 size-[16px] font-normal text-[#3F3F46] px-2">Entrevistas</p>
      </div>

      <div className="flex text-center px-2  py-2 w-[200px]">
        <Profesional />
        <p className="mx-4 size-[16px] font-normal text-[#3F3F46] px-2">Profesionales</p>
      </div>

      <div className="flex text-center px-2  py-2 w-[200px]">
        <Man />
        <p className="mx-4 text-[16px] font-normal text-[#3F3F46] px-2">Entrevistados</p>
      </div>

      <div className="flex text-center px-2  py-2 w-[200px]">
        <Note />
        <p className="mx-4 size-[16px] font-normal text-[#3F3F46] px-2">Empresas</p>
      </div>



    </div>
    <div className="absolute bottom-0  w-full p-4 left-[200px]">

      <Button radius="sm"   variant="bordered"   className="flex flex-row bg-[#D4D4D8] h-14  " >
        <Girl/>
        Carmina Espósito
      </Button>
    </div>


  </div>
  )
}
