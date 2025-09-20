import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Form, Checkbox, Tooltip } from "@heroui/react";
import InputForms from "@/common/inputForms";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";
import ModulesSelector from "./modules";
import { Notification } from "@/common/notification";
import { useRouter } from "next/router";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface SurveyDTO {
  title: string;
  description: string;
  modules?: Array<{ order: number; id: string }>;
  previousEvaluations?: boolean;
}

const EMPTY: SurveyDTO = { title: "", description: "" };

const InformationView = ({ id }: { id?: string }) => {
  const [data, setData] = useState<SurveyDTO>(EMPTY);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  /* --- traer datos cuando hay id --- */
  useEffect(() => {
    const fetchOne = async () => {
      try {
        if (!id) return;
        const { data } = await apiConnection.get(`/surveys/${id}`);
        setData({
          ...data,
          title: data.name,
          description: data.description ?? "",
          previousEvaluations: data.previousEvaluations ?? false,
        });
      } catch (err) {
        console.error("Error loading survey", err);
      }
    };
    fetchOne();
  }, [id]);

  /* --- handlers --- */
  const handleChange =
    (field: keyof SurveyDTO) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setData({ ...data, [field]: e.target.value });

  const save = async () => {
    if (!data.title  || !data.description) {
      Notification("Debe completar todos los campos requeridos", "error");
      return;
    }
    try {
      setSaving(true);
      if (id) {
        await apiConnection.patch(`/surveys/${id}`, {
          name: data.title,
          description: data.description,
          modules: data.modules,
          previousEvaluations: data.previousEvaluations,
        });
      } else {
        await apiConnection.post("/surveys", {
          name: data.title,
          description: data.description,
          modules: data.modules,
          previousEvaluations: data.previousEvaluations,
        });
      }
      router.push("/surveys/table");
    } catch (err) {
      console.error("Error saving survey", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout links={[{ label: "Evaluaciones", href: "/surveys/table" }]}>
      <div className="flex-col pb-10">
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#D4D4D8]"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-[22px] font-bold">
            {id ? `Evaluación ${data.title}` : "Nueva evaluación"}
          </h1>
        </div>

        {/* steps */}

        {/* form */}
        <Form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <InputForms
            label="Título"
            placeholder="Título"
            required
            value={data.title}
            onChange={handleChange("title")}
          />
          <InputForms
            label="Descripción"
            placeholder="Individual"
            required
            value={data.description}
            onChange={handleChange("description")}
          />
          <div className="flex items-center gap-2">
            <Checkbox
              isSelected={data.previousEvaluations}
              onValueChange={(value) => setData({ ...data, previousEvaluations: value })}
            >
              ¿Es una evaluación previa?
            </Checkbox>
            <Tooltip
              content="Formulario que se envía al candidato antes de la entrevista para que pueda completarlo previamente y agilizar el proceso."
              placement="right"
            >
              <InformationCircleIcon className="w-5 h-5 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <ModulesSelector
            value={data.modules}
            onChange={(modules) => setData({ ...data, modules })}
          />
          <div className="mt-6 flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#635BFF] text-white"
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Link href="/surveys/table">
              <Button>Cancelar</Button>
            </Link>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default InformationView;
