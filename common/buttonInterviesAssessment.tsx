import React from 'react';


interface ButtonAssessmentProps {
  title: string;
  text: string;
}

const ButtonAssessment = ({ title, text }: ButtonAssessmentProps) => {
  return (
    <button className="w-[400px] h-[80px] flex flex-row justify-start items-center border border-1 rounded-xl mt-3 cursor-pointer">
      <div className="border w-[92px] h-[54px] bg-[#D9D9D9] ml-3 mr-3"></div>
      <div className='flex flex-col justify-start items-start'>
        <p className="text-[#3F3F46] text-[14px] font-medium">{title}</p>
        <p className="text-[#A1A1AA] text-[14px] font-light p-0 m-0">{text}</p>
      </div>
    </button>
  );
};

export default ButtonAssessment;
