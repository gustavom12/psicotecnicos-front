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
    const base: DynamicField = { id: uuid(), label: "", type: "shortText", question: "" };

    if (target === "professional") {
      appendPro(base);
      setState((v) => {
        const newSlides = [...v.slides];
        newSlides[i].professional.push(base);
        return { ...v, slides: newSlides };
      });
    } else {
      appendInt(base);
      setState((v) => {
        const newSlides = [...v.slides];
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const [list, idx, field] = name.split(".");

    setState((v) => {
      const activeSlide = v.slides.find((e) => e.index === activeIndex);

      if (!idx) activeSlide[list] = value;
      if (list && idx) {
        activeSlide[list] = activeSlide[list].map((e, i) => {
          return i === parseInt(idx)
            ? {
                ...(e || {}),
                [field]: value,
              }
            : e;
        });
      }

      return {
        ...v,
        slides: v.slides.map((e, index) =>
          index === activeIndex ? activeSlide : e,
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
