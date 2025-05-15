import InputForms from "@/common/inputForms";
import NavbarApp from "@/common/navbar";
import MenuLeft from "@/layouts/menu/MenuLeft";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup, Input } from "@heroui/react";
import React from "react"
import { Form } from "@heroui/react";
import TextAreaForm from "@/common/textAreaForm";

const InformationEvaluationsView = () => {
  return (
    <div className="flex flex-row w-full ">
      <div>
        <MenuLeft />
      </div>

      <div className="w-full ml-10 mr-10">
        <NavbarApp />

        <div className="flex-col">
          <div className="flex flex-row space-x-4 mt-4 ">
            <button
              onClick={() => {
                window.history.back();
              }}
              className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-[22px]">
              Mariano Alvarado - 20/5/2024
            </h1>
          </div>

          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[17%] mt-8 mb-6 h-[36px] rounded-xl">
            <Button className="rounded-sm bg-white   h-[28px]">
              Información
            </Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">
              Modulos
            </Button>

          </ButtonGroup>

          <hr />

          <Form className="flex flex-col mt-8 justify-around h-auto">
            <InputForms
              label={"Titulo"}
              placeholder={"Arcor 2024 - Postulantes Junior"}
              required={true} />

            <InputForms
              label={"Empresa"}
              placeholder={"Arcor "}
              required={true} />

            <InputForms
              label={"Puesto"}
              placeholder={"Opreario "}
              required={true} />

            <TextAreaForm
              label={"Descripcion"}
              placeholder={"Descripcion de la evaluacion "}
            />
          </Form>
        </div>
      </div>
    </div>
  )
}

export default InformationEvaluationsView
