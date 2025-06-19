import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Tables from "@/common/table";
import Addition from "@/public/icons/addition";
import { Button } from "@heroui/button";
import React, { use, useEffect } from "react";
import { set } from "react-hook-form";
import apiConnection from "@/pages/api/api";
import Link from "next/link";
const InterviewTableView = () => {

  const [data, setData] = React.useState([]);

  useEffect(() => {
    apiConnection.get('/interviewees/filtered').then((response) => {
      console.log(data)
      setData(response.data)
    })
  }, []);


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
                <Link href="/interviewed/edit">
                  <Button radius="none" className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md ">
                    <Addition fill={'#635BFF'} />
                    <p className="">Enviar invitación</p>
                  </Button>
                </Link>
                <Link href="/interviewed/edit">
                  <Button radius="none" className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md ">
                    <Addition fill={'#635BFF'} />
                    <p className="">Nuevo Entrevistado</p>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <Tables
                data={data}
                columns={[
                  {
                    key: "name",
                    label: "Nombre",
                  },
                  {
                    key: "company",
                    label: "Empresa",
                  },
                  {
                    key: "interviews",
                    label: "Entrevistas",
                  },
                  {
                    key: "email",
                    label: "E-mail",
                  },
                  {
                    key: "actions",
                    label: "Acciones",
                  },]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default InterviewTableView;
