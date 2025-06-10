import ButtonAssessment from "@/common/buttonInterviesAssessment";
import NavbarApp from "@/common/navbar";
import PrimaryButton from "@/common/PrimaryButton";
import MenuLeft from "@/layouts/menu/MenuLeft";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/react";
import React from "react";

const ModuleEvaluationsView = () => {
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
              Arcor2024-Postulantes Junior Operario
            </h1>
          </div>

          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[17%] mt-8 mb-3 h-[36px] rounded-xl">
            <Button className="rounded-sm bg-[#F4F4F5] text-[#71717A]  h-[28px]">
              Información
            </Button>
            <Button className="bg-white  h-[28px]">
              Modulos
            </Button>
          </ButtonGroup>

          <hr />

          <div>

            <ButtonAssessment
              title="Cuestionario personal"
              text="Evaluación previa"
            />

            <ButtonAssessment title="Cuestionario Personal" text="Evaluacion Previa" />

            <ButtonAssessment title="Portada" text="Personalizados" />

            <ButtonAssessment title="Test de Rorschart" text="1 slide" />

            <ButtonAssessment title="Cierre" text="Personalizado" />
            <Button className="bg-[#635BFF] rounded-md mb-6 w-[40%] text-white">Agregar Modulo</Button>
            <PrimaryButton text={"Agregar Modulo"} />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ModuleEvaluationsView;
