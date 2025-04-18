import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Tables from "@/common/table";
import Addition from "@/public/icons/addition";
import { Button } from "@heroui/button";
import React from "react";

const InterviewTableView = () => {
  return (
    <div className="flex flex-row w-full">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />

        <div className=" flex justify-around">


          <div className="flex-col w-[1190px]  ">
            <div className=" flex justify-between ">
              <h1 className="font-inter font-semibold text-[22px]">Entrevistados</h1>

              <div className="flex flex-row space-x-4">
                <Button radius="none" className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md ">
                  <Addition />
                  <p className="">Enviar invitación</p>
                </Button>
                <Button radius="none" className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md ">
                  <Addition />
                  <p className="">Nuevo Entrevistado</p>
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <Tables />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default InterviewTableView;
