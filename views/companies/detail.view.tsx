import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Input } from "@heroui/react";
import React from "react";
import AuthLayout from "@/layouts/auth.layout";
// import { PopupContainer } from 'survey-react-ui/typings/src/components/popup/popup';

const Detail = () => {
  return (
    <AuthLayout links={[{ label: "Módulos", href: "/modules" }]}>
      <div className="flex-col mt-10 ">
        <div className="flex flex-row space-x-4 ">
          <button className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer">
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-[22px]">Toyota</h1>
        </div>

        <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[340px] mt-8 mb-6 h-[36px] rounded-xl">
          <Button className="rounded-sm bg-[#F4F4F5] text-[#71717A]  h-[28px]">
            Información
          </Button>
          <Button className="bg-[#F4F4F5] text-[#71717A]  h-[28px]">
            Entrevistados
          </Button>
          <Button className="bg-white  text-[#71717A]  h-[28px]">
            Entrevistas
          </Button>
        </ButtonGroup>

        <hr />

        <Input className="mt-6" />
        <hr className="mt-12" />
        <hr className="mt-12" />
        <hr className="mt-12" />
        <hr className="mt-12" />
      </div>
    </AuthLayout>
  );
};

export default Detail;
