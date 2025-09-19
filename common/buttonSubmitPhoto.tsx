import Photo from '@/public/icons/photo';
import { Button } from '@heroui/button';
import React, { useRef, useState } from 'react';
import apiConnection from '@/pages/api/api';
import { Notification } from './notification';

interface ButtonSubmitPhotoProps {
  onImageUploaded?: (imageUrl: string) => void;
  disabled?: boolean;
  currentImage?: string;
}

const ButtonSubmitPhoto: React.FC<ButtonSubmitPhotoProps> = ({ 
  onImageUploaded, 
  disabled = false,
  currentImage 
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    const allowedImageTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp'
    ];

    if (!allowedImageTypes.includes(file.type)) {
      Notification('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP, BMP)', 'error');
      return;
    }

    // Validar tamaño (máximo 5MB para perfiles)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      Notification('El archivo es demasiado grande. Máximo 5MB permitido', 'error');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `profile_${Date.now()}_${file.name}`);

      const response = await apiConnection.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url || response.data.fileUrl || response.data.link;
      
      if (imageUrl) {
        Notification('Imagen subida exitosamente', 'success');
        onImageUploaded?.(imageUrl);
      } else {
        throw new Error('No se recibió URL de la imagen');
      }

    } catch (error: any) {
      console.error('Error uploading image:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.errorMessage || 
                          'Error al subir la imagen';
      Notification(errorMessage, 'error');
    } finally {
      setUploading(false);
      // Limpiar el input para permitir subir el mismo archivo otra vez
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />
      <Button 
        className={`flex flex-row align-middle cursor-pointer bg-transparent w-auto ${
          disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleButtonClick}
        disabled={disabled || uploading}
      >
        <Photo />
        <p className="w-auto text-[#3F3F46] text-[14px] p-0 m-0">
          {uploading ? 'Subiendo...' : 'Subir nueva foto'}
        </p>
      </Button>
    </>
  );
};

export default ButtonSubmitPhoto;
