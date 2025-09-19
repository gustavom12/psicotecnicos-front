import TrashRed from "@/public/icons/trashred";
import { Button } from "@heroui/button";
import React from "react";

interface ButtonDeleteProps {
  onDelete?: () => void;
  disabled?: boolean;
  hasImage?: boolean;
}

const ButtonDelete: React.FC<ButtonDeleteProps> = ({ 
  onDelete, 
  disabled = false,
  hasImage = false 
}) => {
  const handleClick = () => {
    if (disabled || !hasImage) return;
    
    if (confirm("¿Estás seguro de que deseas eliminar la foto de perfil?")) {
      onDelete?.();
    }
  };

  return (
    <Button 
      className={`flex flex-row align-middle cursor-pointer bg-transparent w-auto ${
        disabled || !hasImage ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      disabled={disabled || !hasImage}
    >
      <TrashRed />
      <p className="text-[14px] text-[#F31260]">Eliminar foto</p>
    </Button>
  );
};

export default ButtonDelete;







