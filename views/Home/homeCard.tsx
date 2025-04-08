import Man from "@/public/icons/ManIcon";
import React from "react";



const HomeCard = ({text , number}:{text:string , number:number}) => {
  return (
    <div className="flex  flex-row border border-2 border-[#E4E4E7] w-full h-[130px] rounded-lg items-center justify-center">
      <div className="flex  items-center justify-center bg-[#E4E4E7] rounded-full w-[50px] h-[50px]">
      <Man />
      </div>
      <div className="flex flex-col ml-4 mt-2">
        <p className="text-[30px] font-medium">{number}</p>
        <p className="text-[14px] font-light text-[#9E9E9E]">{text}</p>
      </div>
    </div>
  )
}

export default HomeCard;
