"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import AuthLayout from "@/layouts/auth.layout";
import EditorWrapper, {
  defaultSlide,
} from "./components/htmlEditor/editorWrapper";
import { createForm, getForm, updateForm } from "@/pages/api/forms";
import { Notification } from "@/common/notification";
import { useRouter } from "next/navigation";

const FormEditor = dynamic(() => import("./components/FormEditor/formEditor"), {
  ssr: false,
});

interface ModuleProps {
  id?: string;
}

export default function Module({ id }: ModuleProps = {}) {
  const [state, setState] = useState({
    slides: [{ ...defaultSlide }],
    title: "Módulo",
    category: "Categoría",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const titleRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Mantén el título sincronizado cuando cambie desde el formulario
  useEffect(() => {
    if (titleRef.current && titleRef.current.innerText !== state.title) {
      titleRef.current.innerText = state.title;
    }
  }, [state.title]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const data = await getForm(id);
        console.log("data id: ", data);

        setState({
          title: data.title,
          slides: data.slides,
          category: data.category,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async () => {
    try {
      console.log("stateL ", state);

      id ? await updateForm(id, state) : await createForm(state);
      Notification("Entrevista guardada con éxito", "success");
      router.push("/modules");
    } catch (error) {
      console.error({ error });
      Notification(`Error al guardar entrevista`, "error");
    }
  };

  console.log("state: ", state);

  return (
    <AuthLayout
      links={[
        { label: "Módulos", href: "/modules" },
        { label: id ? `Editar módulo` : "Nuevo módulo", href: "/modules/new" },
      ]}
    >
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
          <div
            ref={categoryRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={() =>
              setState({
                ...state,
                category: categoryRef.current?.innerText || "",
              })
            }
            className="text-lg w-fit font-medium text-gray-700 outline-none border-b border-transparent hover:border-gray-300 focus:border-indigo-400 transition-colors pb-1"
          >
            {state.category}
          </div>
          <div className="grid grid-cols-12 gap-6">
            <EditorWrapper state={state} setState={setState} />
            {/* Separator for small screens */}
            <div className="col-span-12 lg:col-span-5 space-y-4">
              {/* <MenuSeparator className="block lg:hidden" /> */}
              <h2 className="text-lg font-medium text-gray-700">
                Configuración de slide
              </h2>
              {!loading && (
                <FormEditor
                  state={state}
                  activeIndex={state.slides.find((e) => e.selected).index}
                  setState={setState}
                  onSubmit={onSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
