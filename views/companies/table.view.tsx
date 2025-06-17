import React from "react";
import Tables from "../../common/table";
import { Button } from "@heroui/button";
import NavbarApp from "@/common/navbar";
import MenuLeft from "@/layouts/menu/MenuLeft";
import Addition from "@/public/icons/addition";
import Link from "next/link";

const CompaniesTable = () => {
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
              <h1 className="font-inter font-semibold text-[22px]">Empresas</h1>
              {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
              <Link href="/companies/create">
                <Button
                  radius="none"
                  className="flex flex-row bg-[#635BFF1A] text-[#635BFF] rounded-md "
                >
                  <Addition fill={"#635BFF"} />
                  <p className="">Nueva empresa</p>
                </Button>
              </Link>
            </div>

            <div className="mt-8">
              <Tables />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesTable;
