"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import AuthLayout from "@/layouts/auth.layout";
import { Button } from "@heroui/react";
import EditorWrapper, {
  defaultSlide,
} from "./components/htmlEditor/editorWrapper";

const FormEditor = dynamic(() => import("./components/FormEditor/formEditor"), {
  ssr: false,
});

interface ModuleProps {
  id?: string;
}

export default function Module({ id }: ModuleProps = {}) {
  const [state, setState] = useState({
    slides: [defaultSlide],
    title: "Módulo",
  });

  const titleRef = useRef<HTMLDivElement>(null);

  // Mantén el título sincronizado cuando cambie desde el formulario
  useEffect(() => {
    if (titleRef.current && titleRef.current.innerText !== state.title) {
      titleRef.current.innerText = state.title;
    }
  }, [state.title]);

  const onSubmit = async () => {

  };

  return (
    <AuthLayout>
      <div className="flex h-full w-full flex-col">
        <div className="mx-auto w-full max-w-7xl">
          <div
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={() =>
              setState({ ...state, title: titleRef.current?.innerText || "" })
            }
            className="text-2xl w-fit font-semibold text-gray-800 outline-none border-b border-transparent hover:border-gray-300 focus:border-indigo-400 transition-colors pb-1"
          >
            {state.title}
          </div>
          <h2 className="text-lg font-medium text-gray-700">Contenido</h2>
          <div className="grid grid-cols-12 gap-6">
            <EditorWrapper state={state} setState={setState} />
            {/* Separator for small screens */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              {/* <MenuSeparator className="block lg:hidden" /> */}
              <h2 className="text-lg font-medium text-gray-700">
                Configuración de slide
              </h2>
              <FormEditor />
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
