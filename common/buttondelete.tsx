import TrashRed from "@/public/icons/trashred";
import { Button } from "@heroui/button";
import React from "react";


const ButtonDelete = () => {
  return (
    <Button className="flex flex-row algin-middle cursor-pointer bg-transparent w-auto  ">
      <TrashRed />
      <p className="w-auto p-0 text-[#F31260] text-[14px]">Eliminar foto</p>
    </Button>
  )
}


export default ButtonDelete;







