import React from "react";
import Tables from "../../common/table";
import { Navbar } from "@heroui/navbar";
import MenuLeft from "@/common/MenuLeft";
import { Button } from "@heroui/button";
import App from "@/common/navbar";
import NavbarApp from "@/common/navbar";




const CompaniesTable = () => {
  return <div className="">
    <NavbarApp />
    <div className=" flex justify-around">
      <MenuLeft />

      <div className="flex-col w-[1190px]  ">
        <div className=" flex justify-between ">
          <h1 className="font-inter font-semibold text-[22px]">CompaniesTable</h1>
          {/* <button className="bg-[#635BFF1A] text-[#635BFF] font-light py-2 px-4 rounded cursor-pointer">  New Companie</button> */}
          <Button radius="none" color="secondary">New Companie</Button>
        </div>

        <div className="mt-8">
          <Tables />
        </div>
      </div>
    </div>
  </div>

}

export default CompaniesTable;
