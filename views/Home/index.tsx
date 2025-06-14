import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Tables from "@/common/table";
import React from "react";
import HomeCard from "./homeCard";
import TableHome from "@/views/Home/tableHome";

const HomeView = () => {
  return (
    <div className="flex flex-row w-full">
      <div>
        <MenuLeft />
      </div>
      <div className="w-full ml-10 mr-10">
        <NavbarApp />
        <div className=" ">
          <h2 className="font-semibold text-[22px] mt-4 mb-2">Inicio</h2>
          <div className="flex flex-row gap-4">
            <HomeCard text={"evaluaciones pendientes"} number={80} />
            <HomeCard number={20} text={"profesionales"} />
            <HomeCard number={140} text={"entrevistados"} />
            <HomeCard number={15} text={"empresas activas"} />
          </div>
          <p className="font-semibold text-[18px] my-3">
            Próximas evaluaciones
          </p>
          <TableHome />
        </div>
      </div>
    </div>
  );
};

export default HomeView;
