import Trash from '@/public/icons/trashgrey';
import React from 'react';


interface ButtonAssessmentProps {
  title: string;
  text: string;
}

const ButtonAssessment = ({ title, text }: ButtonAssessmentProps) => {
  return (
    <button className="w-[40%] flex flex-row  items-center border rounded-xl mt-3 mb-4 cursor-pointer">
      <div className="border w-[30%] h-[100px] bg-[#8d4b4b] ml-3 mr-3 " />
      <div className=' flex flex-row items-center justify-around w-full'>
      <div className='flex flex-col justify-start items-start ml-4'>
        <p className="text-[#3F3F46] text-[14px] font-medium">{title}</p>
        <p className="text-[#A1A1AA] text-[14px] font-light p-0 m-0">{text}</p>
      </div>

        <div className=''>
          <Trash />
        </div>
</div>
    </button>
  );
};

export default ButtonAssessment;
