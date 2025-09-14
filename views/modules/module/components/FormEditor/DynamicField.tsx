"use client";

import { useState, Fragment } from "react";
import { Controller } from "react-hook-form";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Button, Input, Textarea } from "@heroui/react";

// shadcn/ui components

// -------------------- constantes y tipos -------------------- //
export const fieldTypes = [
  { value: "shortText", label: "Texto corto" },
  { value: "paragraph", label: "Párrafo" },
  { value: "number", label: "Respuesta numérica" },
  { value: "options", label: "Opciones múltiples" },
  { value: "file", label: "Carga de archivos" },
  { value: "scale", label: "Escala lineal" },
] as const;

export type FieldType = (typeof fieldTypes)[number]["value"];

export interface DynamicField {
  id: string;
  type: FieldType;
  label: string;
  question?: string;
  options?: string[];
}

// -------------------- util -------------------- //
const cx = (...cls: (string | boolean | undefined)[]) =>
  cls.filter(Boolean).join(" ");

// -------------------- Componente -------------------- //
interface DynamicInputProps {
  field: DynamicField;
  register: any;
  control: any;
  index: number;
  remove: (i: number) => void;
  namePrefix: "professional" | "interviewer";
  onFieldChange;
}

export default function DynamicInput({
  field,
  register,
  control,
  index,
  remove,
  namePrefix,
  onFieldChange,
}: DynamicInputProps) {
  const [currentType, setCurrentType] = useState<FieldType>(field.type);

  return (
    <div className="space-y-3 rounded-xl border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        {/* Selector tipo */}
        <Controller
          control={control}
          name={`${namePrefix}.${index}.type` as const}
          render={({ field: { onChange, value } }) => (
            <Listbox
              value={value}
              onChange={(val: FieldType) => {
                onChange(val);
                onFieldChange({
                  target: { name: `${namePrefix}.${index}.type`, value: val },
                });
                setCurrentType(val);
              }}
            >
              <div className="relative ml-2 w-60 ">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg border bg-gray-50 py-2 pl-3 pr-10 text-left text-sm shadow-sm hover:bg-gray-100 focus:outline-none">
                  <span className="block truncate">
                    {fieldTypes.find((t) => t.value === value)?.label ?? "Tipo"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black/10 focus:outline-none">
                    {fieldTypes.map((t) => (
                      <Listbox.Option
                        key={t.value}
                        value={t.value}
                        className={({ active }) =>
                          cx(
                            active
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-900",
                            "relative cursor-pointer select-none py-2 pl-10 pr-4",
                          )
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={cx(
                                selected ? "font-medium" : "font-normal",
                                "block truncate",
                              )}
                            >
                              {t.label}
                            </span>
                            {selected && (
                              <span
                                className={cx(
                                  "absolute inset-y-0 left-0 flex items-center pl-3",
                                  active
                                    ? "text-indigo-600"
                                    : "text-indigo-600",
                                )}
                              >
                                <CheckIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => remove(index)}
        >
          <TrashIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Valor según tipo */}
      {currentType === "paragraph" && (
        <Textarea
          placeholder="Pregunta"
          {...register(`${namePrefix}.${index}.question`, {
            onChange: onFieldChange,
          })}
        />
      )}
      {currentType === "shortText" && (
        <Input
          placeholder="Pregunta"
          {...register(`${namePrefix}.${index}.question` as const, {
            onChange: onFieldChange,
          })}
        />
      )}
      {currentType === "number" && (
        <Input
          placeholder="Pregunta"
          {...register(`${namePrefix}.${index}.question` as const, {
            onChange: onFieldChange,
          })}
        />
      )}
      {currentType === "options" && (
        <Controller
          control={control}
          name={`${namePrefix}.${index}.options` as const}
          render={({ field: fld }) => (
            <Textarea
              placeholder="Opción por línea"
              className="text-xs"
              value={(fld.value || []).join("\n")}
              onChange={(e) => fld.onChange(e.target.value.split("\n"))}
            />
          )}
        />
      )}
      {currentType === "file" && (
        <Input
          type="file"
          {...register(`${namePrefix}.${index}.question` as const, {
            onChange: onFieldChange,
          })}
        />
      )}
      {currentType === "scale" && (
        <Controller
          control={control}
          name={`${namePrefix}.${index}.question` as const}
          defaultValue={5}
          render={({ field: fld }) => (
            <Input
              type="range"
              min={1}
              max={10}
              className="w-full"
              value={fld.value}
              onChange={(e) => {
                const val = Number(e.target.value);
                // tu tracker global
                onFieldChange({
                  target: { name: fld.name, value: val },
                } as any);

                fld.onChange(Number(e.target.value));
              }}
            />
          )}
        />
      )}
    </div>
  );
}
