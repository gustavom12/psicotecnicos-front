import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Input } from "@heroui/input";
import React from "react";

const ProfessionDetail = () => {
  return (
    <div className="flex flex-row w-full ">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />
        <div className="flex-col mt-10 ">
          <div className="flex flex-row space-x-4 ">
            <button className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer">
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-[22px]">Laura González</h1>
          </div>

          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[340px] mt-8 mb-6 h-[36px] rounded-xl">
            <Button className="rounded-sm bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Información</Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Entrevistados</Button>
            <Button className="bg-white  h-[28px]">Entrevistas</Button>
          </ButtonGroup>

          <hr />

          <Input className='mt-6' />
          <hr className='mt-12' />
          <hr className='mt-12' />
          <hr className='mt-12' />
          <hr className='mt-12' />

        </div>
      </div>
    </div>

  )
}

export default ProfessionDetail;
