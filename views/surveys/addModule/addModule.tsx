import NavbarApp from "@/common/navbar";
import MenuLeft from "@/layouts/menu/MenuLeft";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup, Input } from "@heroui/react";
import BoxEvaluations from './boxEvaluations'
import ListModules from "./listModules";
import PrimaryButton from "@/common/PrimaryButton";

const AddModuleView = () => {
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

          <Input placeholder="Busqueda" className="w-full mt-4 mb-4" />


          <PrimaryButton text={"Agregar modulo personalizado"} />
          <h2 className="font-medium text-[20px] mt-4 mb-2">Categoria</h2>
          <hr />

          <ListModules />
        </div>
      </div>
    </div>
  )
}

export default AddModuleView
