import ButtonAssessment from "@/common/buttonInterviesAssessment";
import MenuLeft from "@/common/MenuLeft";
import NavbarApp from "@/common/navbar";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button } from "@heroui/button";
import { ButtonGroup } from "@heroui/react";
import React from "react";


const AssessmentView = () => {
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

          <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[400px] mt-8 mb-3 h-[36px] rounded-xl">
            <Button className="rounded-sm bg-[#F4F4F5] text-[#71717A]  h-[28px]">Información</Button>
            <Button className="bg-white   h-[28px]">Evaluacion</Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Ev. previa</Button>
            <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Informe</Button>
          </ButtonGroup>

          <hr />

          <div >
            <p className="my-4">Arcor 2024 - Postulantes Junior - Operario</p>

            <ButtonAssessment
              title="Cuestionario personal"
              text="Evaluación previa"
            />

            <ButtonAssessment
              title="Portada"
              text="Personalizado"
            />

            <ButtonAssessment
              title="Test de Rorschach"
              text="5 slides"
            />

            <ButtonAssessment
              title="Pantallas universales"
              text="1 slide"
            />

            <ButtonAssessment
              title="Cierre"
              text="Personalizado"
            />


          </div>

        </div>
      </div>

    </div>
  )
}

export default AssessmentView;
