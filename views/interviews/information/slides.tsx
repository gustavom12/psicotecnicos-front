// slides-selector.tsx
import React, { useEffect, useState } from "react";
import apiConnection from "@/pages/api/api";
import { Select, SelectItem } from "@heroui/react";

interface Module {
  _id: string;
  title: string;
}

interface Props {
  value: string[]; // ids de módulos en orden
  onChange(slides: string[]): void; // callback al padre
}

const SlidesSelector: React.FC<Props> = ({ value, onChange }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [slides, setSlides] = useState<string[]>(value);

  /* cargar módulos disponibles */
  useEffect(() => {
    (async () => {
      const { data } = await apiConnection.get("/forms/filtered");
      console.log("Modules data:", data);

      setModules(data);
    })();
  }, []);

  /* prop → state sync */
  useEffect(() => setSlides(value), [value]);

  const add = (id: string) => {};

  const title = (id: string) => {
    const module = modules.find((m) => m._id === id);
    return module.title;
  };

  return (
    <div className="w-[340px]">
      {/* slides seleccionados */}
      <div className="w-full">
        <ul className="space-y-1">
          {slides?.map((id, idx) => (
            <div
              key={id}
              className="w-full flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              {/* contenido */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {title(id)}
                </span>
              </div>
            </div>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Módulos</h3>
        <Select
          radius="sm"
          placeholder="Selecciona un módulo…"
          className="w-full max-w-xs"
          onChange={(e) => {
            add(e.target.value); // heroui devuelve el value
          }}
        >
          {modules.map((m) => (
            <SelectItem key={m._id}>
              {m.title}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default SlidesSelector;
