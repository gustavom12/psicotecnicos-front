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
  scaleMin?: number;
  scaleMax?: number;
  scaleLabel?: string;
  numberValue?: string;
  fileTypes?: string;
  maxFileSize?: number;
  multipleFiles?: boolean;
  selectedFiles?: File[];
  required?: boolean;
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

      {/* Campo de pregunta para todos los tipos */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Pregunta/Etiqueta</label>
        <Input
          placeholder="Escribe la pregunta o etiqueta del campo"
          {...register(`${namePrefix}.${index}.question` as const, {
            onChange: onFieldChange,
          })}
        />
      </div>

      {/* Configuración específica según tipo */}
      {currentType === "options" && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Opciones múltiples</label>
          
          <Controller
            control={control}
            name={`${namePrefix}.${index}.options` as const}
            render={({ field: fld }) => {
              const options = fld.value || [];
              
              const addOption = () => {
                const newOptions = [...options, ""];
                fld.onChange(newOptions);
                onFieldChange({
                  target: { name: `${namePrefix}.${index}.options`, value: newOptions },
                });
              };
              
              const removeOption = (optionIndex: number) => {
                const newOptions = options.filter((_, idx) => idx !== optionIndex);
                fld.onChange(newOptions);
                onFieldChange({
                  target: { name: `${namePrefix}.${index}.options`, value: newOptions },
                });
              };
              
              const updateOption = (optionIndex: number, value: string) => {
                const newOptions = options.map((opt, idx) => idx === optionIndex ? value : opt);
                fld.onChange(newOptions);
                onFieldChange({
                  target: { name: `${namePrefix}.${index}.options`, value: newOptions },
                });
              };
              
              return (
                <div className="space-y-2">
                  {/* Lista de opciones */}
                  {options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-8">
                        {optionIndex + 1}.
                      </span>
                      <Input
                        placeholder={`Opción ${optionIndex + 1}`}
                        value={option}
                        size="sm"
                        onChange={(e) => updateOption(optionIndex, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(optionIndex)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Botón agregar opción */}
                  <Button
                    type="button"
                    variant="bordered"
                    size="sm"
                    onClick={addOption}
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar opción
                  </Button>
                  
                  {/* Vista previa */}
                  {options.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <p className="text-xs font-medium text-gray-700 mb-2">Vista previa:</p>
                      <div className="space-y-1">
                        {options.filter(opt => opt.trim()).map((option, idx) => (
                          <label key={idx} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="w-3 h-3 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              disabled
                            />
                            <span className="text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      )}

      {currentType === "scale" && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Valor mínimo</label>
              <Controller
                control={control}
                name={`${namePrefix}.${index}.scaleMin` as const}
                defaultValue={1}
                render={({ field: fld }) => (
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={fld.value || 1}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      fld.onChange(val);
                      onFieldChange({
                        target: { name: `${namePrefix}.${index}.scaleMin`, value: val },
                      });
                    }}
                  />
                )}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Valor máximo</label>
              <Controller
                control={control}
                name={`${namePrefix}.${index}.scaleMax` as const}
                defaultValue={10}
                render={({ field: fld }) => (
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={fld.value || 10}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      fld.onChange(val);
                      onFieldChange({
                        target: { name: `${namePrefix}.${index}.scaleMax`, value: val },
                      });
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Etiqueta de la escala</label>
            <Input
              placeholder="ej: Muy malo - Excelente"
              {...register(`${namePrefix}.${index}.scaleLabel` as const, {
                onChange: onFieldChange,
              })}
            />
          </div>
        </div>
      )}

      {currentType === "number" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Vista previa del campo</label>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <Controller
              control={control}
              name={`${namePrefix}.${index}.numberValue` as const}
              render={({ field: fld }) => (
                <Input
                  type="number"
                  placeholder="Ingresa un número"
                  value={fld.value || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Solo permitir números, punto decimal y signo negativo
                    if (val === "" || /^-?\d*\.?\d*$/.test(val)) {
                      fld.onChange(val);
                      onFieldChange({
                        target: { name: `${namePrefix}.${index}.numberValue`, value: val },
                      });
                    }
                  }}
                  onKeyPress={(e) => {
                    // Permitir solo números, punto decimal, signo negativo y teclas de control
                    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                    if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full"
                />
              )}
            />
            <p className="text-xs text-gray-500 mt-1">
              Solo acepta números (enteros o decimales)
            </p>
          </div>
        </div>
      )}

      {currentType === "file" && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Configuración de archivos</label>
          
          {/* Selector de archivos funcional */}
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Vista previa del campo</label>
            <Controller
              control={control}
              name={`${namePrefix}.${index}.selectedFiles` as const}
              render={({ field: fld }) => {
                const fileTypes = field.fileTypes || "";
                const acceptTypes = fileTypes ? fileTypes.split(',').map(t => t.trim()).join(',') : "*/*";
                const isMultiple = field.multipleFiles || false;
                
                return (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <input
                      type="file"
                      id={`file-${field.id}`}
                      accept={acceptTypes}
                      multiple={isMultiple}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        fld.onChange(files);
                        onFieldChange({
                          target: { name: `${namePrefix}.${index}.selectedFiles`, value: files },
                        });
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`file-${field.id}`}
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {isMultiple ? 'Seleccionar archivos' : 'Seleccionar archivo'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fileTypes ? `Tipos: ${fileTypes}` : 'Cualquier tipo de archivo'}
                        </p>
                        {field.maxFileSize && (
                          <p className="text-xs text-gray-500">
                            Máximo: {field.maxFileSize}MB
                          </p>
                        )}
                      </div>
                    </label>
                    
                    {/* Mostrar archivos seleccionados */}
                    {fld.value && fld.value.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium text-gray-700">Archivos seleccionados:</p>
                        {fld.value.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white px-2 py-1 rounded text-xs">
                            <span className="truncate">{file.name}</span>
                            <span className="text-gray-500 ml-2">
                              {(file.size / 1024 / 1024).toFixed(2)}MB
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>

          {/* Configuración */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">Tipos permitidos</label>
              <Input
                placeholder=".pdf,.doc,.jpg"
                size="sm"
                {...register(`${namePrefix}.${index}.fileTypes` as const, {
                  onChange: onFieldChange,
                })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Tamaño máx (MB)</label>
              <Controller
                control={control}
                name={`${namePrefix}.${index}.maxFileSize` as const}
                render={({ field: fld }) => (
                  <Input
                    type="number"
                    placeholder="5"
                    size="sm"
                    min={1}
                    max={100}
                    value={fld.value || ""}
                    onChange={(e) => {
                      const val = e.target.value === "" ? undefined : Number(e.target.value);
                      fld.onChange(val);
                      onFieldChange({
                        target: { name: `${namePrefix}.${index}.maxFileSize`, value: val },
                      });
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name={`${namePrefix}.${index}.multipleFiles` as const}
              render={({ field: fld }) => (
                <input
                  type="checkbox"
                  id={`multiple-${field.id}`}
                  checked={fld.value || false}
                  onChange={(e) => {
                    fld.onChange(e.target.checked);
                    onFieldChange({
                      target: { name: `${namePrefix}.${index}.multipleFiles`, value: e.target.checked },
                    });
                  }}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              )}
            />
            <label htmlFor={`multiple-${field.id}`} className="text-xs text-gray-600">
              Permitir múltiples archivos
            </label>
          </div>
        </div>
      )}

      {/* Campo requerido para todos los tipos */}
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name={`${namePrefix}.${index}.required` as const}
          render={({ field: fld }) => (
            <input
              type="checkbox"
              id={`required-${field.id}`}
              checked={fld.value || false}
              onChange={(e) => {
                fld.onChange(e.target.checked);
                onFieldChange({
                  target: { name: `${namePrefix}.${index}.required`, value: e.target.checked },
                });
              }}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
          )}
        />
        <label htmlFor={`required-${field.id}`} className="text-sm text-gray-700">
          Campo requerido
        </label>
      </div>
    </div>
  );
}
