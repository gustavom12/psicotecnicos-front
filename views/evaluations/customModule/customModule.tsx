import NavbarApp from '@/common/navbar';
import MenuLeft from '@/layouts/menu/MenuLeft';
import ArrowLeft from '@/public/icons/arrowleft';
import { Button, ButtonGroup } from '@heroui/react';
import React from 'react'
import BoxCustomModule from './boxCustomModule';
import PrimaryButton from '@/common/PrimaryButton';

const CustomModuleView = () => {
  return (
    <div className="flex flex-row w-full ">
      <div>
        <MenuLeft />
      </div>

      <div className="w-full ml-10 mr-10">
        <NavbarApp />

        <div className="flex-col">
          <div className="flex flex-row space-x-4 mt-4 ">
            <button
              onClick={() => {
                window.history.back();
              }}
              className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft />
            </button>
            <h1 className="font-bold text-[22px]">
              Arcor2024-Postulantes Junior Operario
            </h1>
          </div>

            <BoxCustomModule />
          <div className='flex justify-end items-end mb-10' >
            <PrimaryButton text="Agregar módulo"/>
          </div>


        </div>
      </div>
    </div>
  )
}

export default CustomModuleView
