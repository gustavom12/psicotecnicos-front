import Photo from '@/public/icons/photo';
import { Button } from '@heroui/button';
import react from 'react';


const ButtonSubmitPhoto = () => {
  return (
    <Button className="flex flex-row align-middle cursor-pointer bg-transparent w-auto ">
      <Photo />
      <p className="w-auto text-[#3F3F46] text-[14px] p-0 m-0">Subir nueva foto</p>
    </Button>
  )
}

export default ButtonSubmitPhoto;
