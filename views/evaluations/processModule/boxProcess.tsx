import Document from '@/public/icons/document'
import React from 'react'

const BoxProcess = ({ text }) => {
  return (
    <div
      className='border-[2px] border-dashed rounded-md mt-4 h-[80px]  border-[#E4E4E7] w-[100%] mb-4 '>
      <div className=' flex flex-row space-x-2 items-center justify-start mt-6 ml-4'>
        <Document />
        <p className='text-[#A1A1AA] font-light'>{text}</p>
      </div>
    </div>
  )
}

export default BoxProcess
