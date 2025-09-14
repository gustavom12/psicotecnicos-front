import SurveysTable from "@/common/InterviewsTable";
import Addition from "@/public/icons/addition";
import { Button } from "@heroui/button";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";
import Pencil2 from "@/public/icons/pencil2";
import Trash from "@/public/icons/trashgrey";

const SurveysTableView = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    apiConnection
      .get(`/surveys`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log("data: ", data);

  const columns = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "modules",
      label: "Módulos",
    },
    {
      key: "description",
      label: "Descripción",
    },
    {
      key: "actions",
      label: "Acciones",
      render: (key, record) => (
        <div className="flex gap-2">
          <Link href={`/surveys/${record._id}`}>
            <button className="text-blue-500 hover:text-blue-700">
              <Pencil2 />
            </button>
          </Link>
          {/*<button className="text-red-500 hover:text-red-700">
            <Trash />
          </button>*/}
        </div>
      ),
    },
  ];

  return (
    <AuthLayout links={[{ label: "Evaluaciones", href: "/surveys/table" }]}>
      <div className=" flex justify-around">
        <div className="flex-col w-[1190px]  ">
          <div className=" flex justify-between ">
            <h1 className="font-inter font-semibold text-[22px]">
              Evaluaciones
            </h1>
            {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
            <Link href="/surveys/create">
              <Button
                radius="none"
                className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
              >
                <Addition fill="#635BFF" />
                <p className="">Nueva evaluación</p>
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            <SurveysTable
              columns={columns}
              data={data.map((e, i) => ({ ...e, key: i }))}
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SurveysTableView;
