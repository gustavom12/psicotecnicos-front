import { Button } from "@heroui/react";
import React from "react";


const ButtonSocial = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  return (
    <Button className="flex flex-row items-center justify-center bg-white border border-[#3a3c46] border-2 rounded-md w-full mt-4">
      {icon}
      <p className="text-[#AEB5C8] font-light">{text}</p>
    </Button>
  )
}

export default ButtonSocial;
