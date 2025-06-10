import SurveysTable from "@/common/InterviewsTable";
import MenuLeft from "@/layouts/menu/MenuLeft";
import NavbarApp from "@/common/navbar";
import Addition from "@/public/icons/addition";
import { Button } from "@heroui/button";
import React from "react";
import Link from "next/link";
import AuthLayout from "@/layouts/auth.layout";

const SurveysTableView = () => {
  return (
    <AuthLayout links={[{ label: "Evaluaciones", href: "/surveys/table" }]}>
      <div className=" flex justify-around">
        <div className="flex-col w-[1190px]  ">
          <div className=" flex justify-between ">
            <h1 className="font-inter font-semibold text-[22px]">
              Evaluaciones
            </h1>
            {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
            <Link href="/interviews/information">
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
            <SurveysTable />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SurveysTableView;
