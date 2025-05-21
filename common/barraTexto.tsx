import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  SmilePlus,
  Undo,
  Redo
} from 'lucide-react';

export default function TextEditor() {
  const [activeButtons, setActiveButtons] = useState({});

  const toggleButton = (button) => {
    setActiveButtons(prev => ({
      ...prev,
      [button]: !prev[button]
    }));
  };

  const textFormatButtons = [
    { icon: <Bold size={18} />, name: 'bold', tooltip: 'Negrita (Ctrl+B)' },
    { icon: <Italic size={18} />, name: 'italic', tooltip: 'Cursiva (Ctrl+I)' },
    { icon: <Underline size={18} />, name: 'underline', tooltip: 'Subrayado (Ctrl+U)' },
    { icon: <Code size={18} />, name: 'code', tooltip: 'Código' },
    { divider: true },
    { icon: <Heading1 size={18} />, name: 'heading', tooltip: 'Encabezado' },
    { divider: true },
    { icon: <List size={18} />, name: 'bullet-list', tooltip: 'Lista con viñetas' },
    { icon: <ListOrdered size={18} />, name: 'ordered-list', tooltip: 'Lista numerada' },
    { divider: true },
    { icon: <AlignLeft size={18} />, name: 'align-left', tooltip: 'Alinear a la izquierda' },
    { icon: <AlignCenter size={18} />, name: 'align-center', tooltip: 'Centrar' },
    { icon: <AlignRight size={18} />, name: 'align-right', tooltip: 'Alinear a la derecha' },
    { divider: true },
    { icon: <Link size={18} />, name: 'link', tooltip: 'Insertar enlace' },
    { icon: <Image size={18} />, name: 'image', tooltip: 'Insertar imagen' },
    { icon: <SmilePlus size={18} />, name: 'emoji', tooltip: 'Insertar emoji' },
    { divider: true },
    { icon: <Undo size={18} />, name: 'undo', tooltip: 'Deshacer' },
    { icon: <Redo size={18} />, name: 'redo', tooltip: 'Rehacer' }
  ];

  const fontOptions = ['Normal', '16', 'Roboto'];

  return (
    <div className="w-full mt-2 rounded-t-lg shadow-sm">
      {/* Barra de herramientas de formato */}
      <div className="flex flex-wrap items-center p-2 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex flex-wrap items-center space-x-1">
          {textFormatButtons.map((button, index) =>
            button.divider ? (
              <div key={`divider-${index}`} className="h-6 w-px bg-gray-300 mx-1"></div>
            ) : (
              <button
                key={button.name}
                className={`p-1.5 rounded hover:bg-gray-100 ${activeButtons[button.name] ? 'bg-gray-200' : ''}`}
                title={button.tooltip}
                onClick={() => toggleButton(button.name)}
              >
                {button.icon}
              </button>
            )
          )}
        </div>

        {/* Selector de fuente y tamaño */}
        <div className="flex ml-auto space-x-2">
          {fontOptions.map((option, index) => (
            <div key={index} className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded px-2 py-1 text-sm">
                <option>{option}</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Área de contenido del editor */}
      <div className="p-4 min-h-32 bg-white">
        <h1 className="text-[80px] font-bold text-gray-800 ">Test de aptitudes psicotécnicas</h1>
      </div>
    </div>
  );
}
