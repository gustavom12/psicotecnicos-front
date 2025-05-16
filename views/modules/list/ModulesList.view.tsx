import Addition from "@/public/icons/addition";
import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";
import ModuleCard from "./moduleCard.view";

const ModulesList = () => {
  return (
    <div>
      <div className="flex">
        <h1>Módulos</h1>
        <div>
          <Link href="/modules/new">
            <Button
              radius="none"
              className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
            >
              <Addition fill={'#635BFF'} />
              <p className="">Nuevo módulo</p>
            </Button>
          </Link>
          <Link href="/modules/new?previousForm=true">
            <Button
              radius="none"
              className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
            >
              <Addition fill={'#635BFF'}/>
              <p className="">Nuevo formulario</p>
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <h2>Categoría</h2>
        <ModuleCard />
      </div>
    </div>
  );
};

export default ModulesList;
