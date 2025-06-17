import React, { useEffect, useState } from "react";
import apiConnection from "@/pages/api/api";
import { Button, Select, SelectItem } from "@heroui/react";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";

interface Module {
  _id: string;
  title: string;
}

interface Props {
  value: { order: number; id: string }[]; // ids de módulos en orden
  onChange(modules: { order: number; id: string }[]): void; // callback al padre
}

const ModulesSelector: React.FC<Props> = ({ value, onChange }) => {
  const [totalModules, setTotalModules] = useState<Module[]>([]);
  const [modules, setModules] = useState<{ order: number; id: string }[]>(
    value || [],
  );

  /* cargar módulos disponibles */
  useEffect(() => {
    (async () => {
      const { data } = await apiConnection.get("/forms/filtered");
      console.log("Modules data:", data);

      setTotalModules(data);
    })();
  }, []);

  /* prop → state sync */
  useEffect(() => setModules(value), [value]);

  const move = (idx: number, dir: -1 | 1) => {
    const newIndex = idx + dir;
    if (newIndex < 0 || newIndex >= modules.length) return; // Prevent out-of-bounds

    const updatedSlides = [...modules];
    const [movedSlide] = updatedSlides.splice(idx, 1);
    updatedSlides.splice(newIndex, 0, movedSlide);

    // Update order based on new position
    const reorderedSlides = updatedSlides.map((slide, index) => ({
      ...slide,
      order: index + 1,
    }));

    setModules(reorderedSlides);
    onChange(reorderedSlides);
  };

  return (
    <div className="w-[340px]">
      <div>
        <h3 className="mb-2 font-semibold">Módulos</h3>
        <Select
          radius="sm"
          placeholder="Selecciona un módulo…"
          className="w-full max-w-xs"
          selectionMode="multiple"
          selectedKeys={modules?.map((s) => s.id)}
          onChange={(e) => {
            const selectedModules = e.target.value.split(",");

            console.log("selectedModules", selectedModules);

            const newSlides = selectedModules.map((moduleId, index) => ({
              order: index + 1,
              id: moduleId,
            }));

            setModules(newSlides);
            onChange(newSlides);
          }}
        >
          {totalModules.map((m) => (
            <SelectItem key={m._id}>{m.title}</SelectItem>
          ))}
        </Select>
        <ul className="space-y-1 mt-10">
          {totalModules
            .filter((m) => modules?.some((s) => s.id === m._id))
            .sort((a, b) => {
              const slideA = modules?.find((s) => s.id === a._id);
              const slideB = modules?.find((s) => s.id === b._id);
              return (slideA?.order || 0) - (slideB?.order || 0);
            })
            .map((id, idx) => (
              <li
                key={idx}
                className="mt-4 flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm"
              >
                <span className="text-sm font-medium text-gray-800">
                  {id.title}
                </span>

                <div className="flex gap-1">
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => move(idx, -1)}
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => move(idx, 1)}
                  >
                    <ArrowDown size={16} />
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ModulesSelector;
