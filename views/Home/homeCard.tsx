import React from "react";
import { LucideIcon } from "lucide-react";

const HomeCard = ({
  text,
  number,
  icon: Icon,
}: {
  text: string;
  number: number;
  icon: LucideIcon;
}) => {
  return (
    <div className="flex w-full max-w-sm min-h-[120px] items-center gap-5 p-5 bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition duration-200">
      <div className="flex items-center justify-center bg-[#efefff] rounded-full w-14 h-14">
        <Icon className="w-6 h-6 text-[#635bff]" />
      </div>
      <div className="flex flex-col">
        <p className="text-3xl font-bold text-gray-800 leading-7">{number}</p>
        <p className="text-sm text-gray-500 mt-1">{text}</p>
      </div>
    </div>
  );
};

export default HomeCard;
