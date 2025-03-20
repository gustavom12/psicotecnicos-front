// import StarIcon from "@/public/icons/Star";
import Home from "@/public/icons/home";
import Man from "@/public/icons/ManIcon";
import Messages from "@/public/icons/messages";
import Modulo from "@/public/icons/modulo";
import Note from "@/public/icons/note";
import Profesional from "@/public/icons/profesional";
import { Button } from "@heroui/button";
import { Module } from "module";
import React from "react";

export default function MenuLeft() {
    return (<div className="flex flex-col  rounded-lg  h-screen " style={{ width: "240px", backgroundColor: "#F4F4F5" }}>

        <div className="flex text-center algin-center justify-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20px" color="#635BFF" fill="currentColor" className="size-6" >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>

            <h2 className="text-[#635BFF] font-semibold text-xl px-2">Psicotécnicos</h2>
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
                <p className="mx-4 size-[16px] font-normal text-[#3F3F46] px-2">Entrevistados</p>
            </div>

            <div className="flex text-center px-2  py-2 w-[200px]">
                <Note />
                <p className="mx-4 size-[16px] font-normal text-[#3F3F46] px-2">Empresas</p>
            </div>



        </div>
        <div className="absolute bottom-0  w-full p-4 left-[200px]">

            <Button radius="sm" variant="bordered" >Camila Exposito</Button>
        </div>


    </div>
    )
}