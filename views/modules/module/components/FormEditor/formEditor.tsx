"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/24/outline";
import { v4 as uuid } from "uuid";
import { Button, Divider, Input, Textarea } from "@heroui/react";
import DynamicInput, { DynamicField } from "./DynamicField";
import { FormValues } from "../../types/form.types";
import { useEffect, useState } from "react";

export default function FormPanel({ onSubmit, activeIndex, state, setState }) {
  const activeSlide = state.slides[activeIndex];
  const [i, setI] = useState(activeIndex);
  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: activeSlide || {
      title: "",
      comments: "",
      professional: [],
      interviewer: [],
    },
  });

  const {
    fields: proFields,
    append: appendPro,
    remove: removePro,
    replace: replacePro,
  } = useFieldArray({ control, name: "professional" });
  const {
    fields: intFields,
    append: appendInt,
    remove: removeInt,
    replace: replaceInt,
  } = useFieldArray({ control, name: "interviewer" });

  const addField = (target: "professional" | "interviewer") => {
    const base: DynamicField = { 
      id: uuid(), 
      label: "", 
      type: "shortText", 
      question: "",
      options: [],
      scaleMin: 1,
      scaleMax: 10,
      scaleLabel: "",
      numberValue: "",
      maxFileSize: undefined,
      multipleFiles: false,
      selectedFiles: [],
      required: false
    };

    if (target === "professional") {
      appendPro(base);
      setState((v) => {
        const newSlides = [...v.slides];
        if (!newSlides[i].professional) newSlides[i].professional = [];
        newSlides[i].professional.push(base);
        return { ...v, slides: newSlides };
      });
    } else {
      appendInt(base);
      setState((v) => {
        const newSlides = [...v.slides];
        if (!newSlides[i].interviewer) newSlides[i].interviewer = [];
        newSlides[i].interviewer.push(base);
        return { ...v, slides: newSlides };
      });
    }
  };

  const removeField = (target: "professional" | "interviewer", index: number) => {
    if (target === "professional") {
      removePro(index);
      setState((v) => {
        const newSlides = [...v.slides];
        newSlides[i].professional.splice(index, 1);
        return { ...v, slides: newSlides };
      });
    } else {
      removeInt(index);
      setState((v) => {
        const newSlides = [...v.slides];
        newSlides[i].interviewer.splice(index, 1);
        return { ...v, slides: newSlides };
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } },
  ) => {
    const { name, value } = e.target;
    const [list, idx, field] = name.split(".");

    setState((v) => {
      const newSlides = [...v.slides];
      const activeSlide = newSlides.find((slide) => slide.index === activeIndex) || newSlides[activeIndex];

      if (!activeSlide) return v;

      if (!idx) {
        // Campo de nivel superior (title, comments)
        activeSlide[list] = value;
      } else if (list && idx && field) {
        // Campo anidado (professional.0.question, etc.)
        if (!activeSlide[list]) activeSlide[list] = [];
        
        activeSlide[list] = activeSlide[list].map((item, i) => {
          return i === parseInt(idx)
            ? {
                ...(item || {}),
                [field]: value,
              }
            : item;
        });
      }

      return {
        ...v,
        slides: newSlides.map((slide, index) =>
          index === activeIndex ? activeSlide : slide,
        ),
      };
    });
  };

  useEffect(() => {
    const activeSlide = state.slides[activeIndex];
    console.log("activeSlide: ", activeSlide);

    reset(activeSlide); // repuebla el form

    replacePro(activeSlide.professional); // actualiza arrays
    replaceInt(activeSlide.interviewer);
    setI(activeIndex);
  }, [activeIndex, reset]);

  return (
    <form
      key={i}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 rounded-2xl border bg-white p-8 shadow-xl text-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Panel del profesional
      </h2>

      <Input
        placeholder="Título slide"
        {...register("title", { required: true, onChange: handleChange })}
      />

      <Textarea
        placeholder="Comentarios (sobre este slide)"
        {...register("comments", { onChange: handleChange })}
        className="h-28 overflow-hidden"
      />
      <Divider className="!mt-5" />
      {/* Campos dinámicos */}
      <h6>Campos del profesional:</h6>
      {proFields.map((f, idx) => (
        <DynamicInput
          key={f.id}
          field={f as DynamicField}
          index={idx}
          register={register}
          control={control}
          remove={(index) => removeField("professional", index)}
          namePrefix="professional"
          onFieldChange={handleChange}
        />
      ))}

      <Divider className="!mt-7" />
      <h6>Campos del entrevistado:</h6>
      {intFields.map((f, idx) => (
        <DynamicInput
          key={f.id}
          field={f as DynamicField}
          index={idx}
          register={register}
          control={control}
          remove={(index) => removeField("interviewer", index)}
          namePrefix="interviewer"
          onFieldChange={handleChange}
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
          onClick={() => addField("interviewer")}
        >
          <PlusIcon className="h-4 w-4" /> Campo entrevistado
        </Button>
      </div>

      <Button
        onClick={onSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
      >
        Guardar
      </Button>
    </form>
  );
}
