"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Listbox, Menu, MenuButton, Transition } from "@headlessui/react";
import {
  PlusIcon,
  ChevronUpDownIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { v4 as uuid } from "uuid";
import { Button, Input, Textarea } from "@heroui/react";
import DynamicInput from "./DynamicField";
import { cx } from "@/common/utils";

// -------------------- constantes -------------------- //
const fieldTypes = [
  { value: "shortText", label: "Texto corto" },
  { value: "paragraph", label: "Párrafo" },
  { value: "number", label: "Respuesta numérica" },
  { value: "options", label: "Opciones múltiples" },
  { value: "file", label: "Carga de archivos" },
  { value: "scale", label: "Escala lineal" },
] as const;

type FieldType = (typeof fieldTypes)[number]["value"];

interface DynamicField {
  id: string;
  type: FieldType;
  label: string;
  options?: string[]; // solo para options | scale
}

interface FormValues {
  title: string;
  comments: string;
  timeSpent: string;
  screens: number | "";
  professional: DynamicField[];
  interviewee: DynamicField[];
}

// -------------------- util -------------------- //

// -------------------- FormPanel -------------------- //
export default function FormPanel() {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: "",
      comments: "",
      timeSpent: "10 minutos",
      screens: "",
      professional: [],
      interviewee: [],
    },
  });

  const {
    fields: proFields,
    append: appendPro,
    remove: removePro,
  } = useFieldArray({ control, name: "professional" });
  const {
    fields: intFields,
    append: appendInt,
    remove: removeInt,
  } = useFieldArray({ control, name: "interviewee" });

  const addField = (target: "professional" | "interviewee") => {
    const base: DynamicField = { id: uuid(), label: "", type: "shortText" };
    target === "professional" ? appendPro(base) : appendInt(base);
  };

  const times = ["5 minutos", "10 minutos", "15 minutos", "30 minutos"];

  const onSubmit = (data: FormValues) => {
    console.log("payload", data);
  };
  const handleAction = (action: "finish" | "next") =>
    handleSubmit((d) => onSubmit(d))();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-8 shadow-xl text-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Panel del profesional
      </h2>

      <Input
        placeholder="Título slide"
        {...register("title", { required: true })}
      />

      <Textarea
        placeholder="Comentarios (sobre este slide)"
        {...register("comments")}
        className="h-28"
      />
      {/* Campos dinámicos */}
      {proFields.map((f, idx) => (
        <DynamicInput
          key={f.id}
          field={f as DynamicField}
          index={idx}
          register={register}
          control={control}
          remove={removePro}
          namePrefix="professional"
        />
      ))}

      {intFields.map((f, idx) => (
        <DynamicInput
          key={f.id}
          field={f as DynamicField}
          index={idx}
          register={register}
          control={control}
          remove={removeInt}
          namePrefix="interviewee"
        />
      ))}

      {/* botones agregar */}
      <div className="flex gap-3">
        <Button
          variant="bordered"
          size="sm"
          className="inline-flex items-center gap-1"
          type="button"
          onClick={() => addField("professional")}
        >
          <PlusIcon className="h-4 w-4" /> Campo profesional
        </Button>
        <Button
          variant="bordered"
          size="sm"
          className="inline-flex items-center gap-1"
          type="button"
          onClick={() => addField("interviewee")}
        >
          <PlusIcon className="h-4 w-4" /> Campo entrevistado
        </Button>
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1">
        Guardar
      </Button>
    </form>
  );
}
