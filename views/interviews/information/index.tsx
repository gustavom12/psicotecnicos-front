import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Input } from "@heroui/input";
import { Form } from "@heroui/react";
import React from "react";


const InformationView = () => {
  return (
    <div className="flex flex-row w-full ">

      <div>
        <MenuLeft />
      </div>

      <div className="w-full ml-10 mr-10">
        <NavbarApp />

        <div className="flex-col">

          <div className="flex flex-row space-x-4 mt-4 ">
            <button className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer">
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-[22px]">Mariano Alvarado - 20/5/2024</h1>
          </div>

          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[400px] mt-8 mb-6 h-[36px] rounded-xl">
            <Button className="rounded-sm bg-white   h-[28px]">Información</Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Evaluacion</Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Ev. previa</Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Informe</Button>
          </ButtonGroup>

          <hr />


          <Form className="flex flex-col mt-8 justify-around h-auto">
            <Input isRequired label="Profesional asignado" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Arcor 2024 - Postulantes Junior " />
            <Input isRequired label="Entrevistado" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Arcor " />
            <Input isRequired label="Fecha" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Operario " />
            <Input isRequired label="Hora" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Descripción de la evaluación " />
            <Input isRequired label="Tipo de entrevista" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Individual" />



          </Form>
        </div>
      </div>

    </div>
  )
}


export default InformationView;
