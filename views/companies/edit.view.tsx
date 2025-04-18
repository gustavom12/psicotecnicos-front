import ButtonDelete from "@/common/buttondelete";
import ButtonSubmitPhoto from "@/common/buttonSubmitPhoto";
import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import ArrowLeft from "@/public/icons/arrowleft";
import Photo from "@/public/icons/photo";
import Trash from "@/public/icons/trashgrey";
import TrashRed from "@/public/icons/trashred";
import { Button, ButtonGroup } from "@heroui/button";
import { Form, Input } from "@heroui/react";
import React from "react";


const EditCompany = () => {
  return (
    <div className="flex flex-row w-full ">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />
        <div className="flex-col  ">
          <div className="flex flex-row space-x-4 ">
            <button className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer">
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-[22px]">Toyota</h1>
          </div>

          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[340px] mt-10 mb-6 h-[36px] rounded-xl">
            <Button className="rounded-sm bg-white h-[28px]">Información</Button>
            <Button className="bg-[#F4F4F5] text-[#71717A]  h-[28px]">Entrevistados</Button>
            <Button className="bg-[#F4F4F5] text-[#71717A]  h-[28px]">Entrevistas</Button>
          </ButtonGroup>

          <hr />

          <div className="flex flex-row   mt-8 ">

            <circle className="w-[100px] h-[100px] border rounded-full" />

            <div>
              <div className="flex flex-row space-x-1 ml-4 mt-7">
                <ButtonSubmitPhoto />
                <ButtonDelete />
              </div>
              <div className=" ml-8 mt-1">
                <p className="text-[#A1A1AA] font-light text-[12px] w-auto">La imagen será visible dentro de la plataforma.</p>
              </div>
            </div>

          </div>
          <Form className="flex flex-col mt-8 justify-around h-auto">
            <Input isRequired label="Nombre" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Toyota " />
            <Input isRequired label="Estado" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Activo " />
            <Input isRequired label="Sector" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Automovilístico " />
            <Input isRequired label="Ubicación" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Córdoba, Argentina " />
            <Input isRequired label="Fecha de registro" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="23/7/2023 " />
            <Input isRequired label="Responsable" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="José González " />
            <Input isRequired label="E-mail" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="jose.gonzalez@gmail.com " />
            <Input isRequired label="Teléfono" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="+54 11 8888 5555 " />
            <Input isRequired label="Observaciones" labelPlacement="outside" className="color-[#F4F4F5] w-[340px] my-6 " placeholder="Observaciones de la empresa" />



          </Form>
        </div>
      </div>

    </div>
  )
}


export default EditCompany;
