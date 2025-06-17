import TableInterviews from "@/common/InterviewsTable";
import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Tables from "@/common/table";
import Addition from "@/public/icons/addition";
import { Button } from "@heroui/button";
import React, { useEffect } from "react";
import Link from "next/link";
import apiConnection from "@/pages/api/api";

const TableInterviewsView = () => {
  const [data, setData] = React.useState([]);
  useEffect(() => {
    apiConnection.get('/interviews/filtered').then((response) => {
      console.log(data)
      setData(response.data)
    })
  }, [])

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
                Entrevistas
              </h1>
              {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
              <Link href="/interviews/information">
                <Button
                  radius="none"
                  className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
                >
                  <Addition fill={"#635BFF"} />
                  <p className="">Nueva entrevista</p>
                </Button>
              </Link>
            </div>

            <div className="mt-8">
              <TableInterviews data={data}
                columns={[
                  {
                    key: "fecha",
                    label: "Fecha",
                  },
                  {
                    key: "horario",
                    label: "Horario",
                  },
                  {
                    key: "duracion",
                    label: "Duración",
                  },
                  {
                    key: "estado",
                    label: "Estado",
                  },
                  {
                    key: "entrevistado",
                    label: "Entrevistado",
                  },
                  {
                    key: "profesional",
                    label: "Profesional",
                  },
                  {
                    key: "actions",
                    label: "Acciones",
                    render: () => <></>,
                  },
                ]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableInterviewsView;
