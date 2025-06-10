import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Form } from "@heroui/react";
import InputForms from "@/common/inputForms";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";
import SlidesSelector from "./slides";

interface SurveyDTO {
  title: string;
  position: string;
  description: string;
  slides?: Array<any>;
}

const EMPTY: SurveyDTO = { title: "", position: "", description: "" };

const InformationView = ({ id }: { id?: string }) => {
  const [data, setData] = useState<SurveyDTO>(EMPTY);
  const [saving, setSaving] = useState(false);

  /* --- traer datos cuando hay id --- */
  useEffect(() => {
    const fetchOne = async () => {
      try {
        if (!id) return;
        const { data } = await apiConnection.get(`/surveys/${id}`);
        setData({
          title: data.name,
          position: data.position ?? "",
          description: data.description ?? "",
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
    try {
      setSaving(true);
      if (id) {
        await apiConnection.patch(`/surveys/${id}`, {
          name: data.title,
          position: data.position,
          description: data.description,
        });
      } else {
        await apiConnection.post("/surveys", {
          name: data.title,
          position: data.position,
          description: data.description,
        });
      }
      window.history.back();
    } catch (err) {
      console.error("Error saving survey", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout links={[{ label: "Evaluaciones", href: "/surveys/table" }]}>
      <div className="flex-col">
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#D4D4D8]"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-[22px] font-bold">
            {id ? `Evaluación ${id}` : "Nueva evaluación"}
          </h1>
        </div>

        {/* steps */}
        <ButtonGroup className="my-6 h-[36px] w-[200px] rounded-xl bg-[#F4F4F5] text-[14px] text-[#71717A]">
          <Button className="h-[28px] rounded-sm bg-white">Información</Button>
          <Button className="h-[28px] bg-[#F4F4F5]">Módulos</Button>
        </ButtonGroup>

        <hr />

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
            placeholder="Título de la encuesta"
            required
            value={data.title}
            onChange={handleChange("title")}
          />
          <InputForms
            label="Puesto"
            placeholder="Operario"
            required
            value={data.position}
            onChange={handleChange("position")}
          />
          <InputForms
            label="Descripción"
            placeholder="Individual"
            required
            value={data.description}
            onChange={handleChange("description")}
          />
          <SlidesSelector
            value={data.slides}
            onChange={(slides) => setData({ ...data, slides })}
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
