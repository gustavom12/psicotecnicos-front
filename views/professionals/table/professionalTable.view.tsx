import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import ProfessionalTableCommon from "@/views/professionals/profesionaltable";
import Tables from "@/common/table";
import Addition from "@/public/icons/addition";
import { Button } from "@heroui/button";
import React from "react";
import Link from "next/link";

const ProfessionalTableView = () => {
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
              <h1 className="font-inter font-semibold text-[22px]">
                Profesionales
              </h1>
              {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
              <Link href="/professional/create">
                <Button
                  radius="none"
                  className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
                >
                  <Addition />
                  <p className="">Nuevo profesional</p>
                </Button>
              </Link>
            </div>

            <div className="mt-8">
              <ProfessionalTableCommon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTableView;
