import MenuLeft from '@/common/MenuLeft';
import NavbarApp from '@/common/navbar';
import LogoToyota from '@/public/icons/logoToyota';
import React from 'react';
import { PopupContainer } from 'survey-react-ui/typings/src/components/popup/popup';

const Detail = () => {
  return (
    <div className="flex flex-row w-full ">
      <MenuLeft />
      <div>
      <NavbarApp />
      <div className="flex flex-col items-center justify-center h-full">
        <LogoToyota />
        <h1 className="text-4xl font-bold text-gray-900">Toyota</h1>
        <p className="text-lg text-gray-700">Toyota Motor Corporation is a Japanese multinational automotive manufacturer headquartered in Toyota, Aichi, Japan.</p>
      </div>
      </div>

    </div>
  )
}

export default Detail;
