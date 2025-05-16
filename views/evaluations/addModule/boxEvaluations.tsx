import React from 'react'
import ButtonAdd from './buttonAdd'



const BoxEvaluations = ({text}) => {
  return (
    <div>
    <div className='h-[180px] w-full border rounded-md border-[#CDCFD7] '>
      <div className='flex items-center justify-center '>
        <img
        className='h-[130px] w-auto mt-2'
        src="https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/5DF7/production/_94655042_thinkstockphotos-482728998.jpg.webp"
        alt="img" />
      </div>
        <div className='flex items-end justify-end mr-4'>
          <ButtonAdd />
        </div>
    </div>
    <p className='text-[#3F3F46] text-[14px] font-semibold mt-2'>{text}</p>
    </div>
  )
}

export default BoxEvaluations
