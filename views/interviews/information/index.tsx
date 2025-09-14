import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Form } from "@heroui/react";
import InputForms from "@/common/inputForms";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";
import SurveySelector from "./survey-selector";
import ProfessionalsSelector from "./professionals-selector";
import IntervieweesSelector from "./interviewees-selector";
import { Notification } from "@/common/notification";
import { useRouter } from "next/router";

interface InterviewDTO {
  title: string;
  description: string;
  surveyId?: string;
  position: string;
  scheduledAt: string;
  professionals?: string[];
  interviewees?: string[];
  status?: string;
}

const EMPTY: InterviewDTO = {
  title: "",
  description: "",
  position: "",
  scheduledAt: "",
  professionals: [],
  interviewees: [],
  status: "NOT_STARTED"
};


const InformationView = ({ id }: { id?: string }) => {
  const [data, setData] = useState<InterviewDTO>(EMPTY);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  /* --- traer datos cuando hay id --- */
  useEffect(() => {
    const fetchOne = async () => {
      try {
        if (!id) return;
        const { data } = await apiConnection.get(`/interviews/${id}`);
        setData({
          ...data,
          title: data.title || data.name,
          description: data.description ?? "",
          position: data.position ?? "",
          surveyId: data.surveyId ?? "",
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : "",
          professionals: data.professionals ?? [],
          interviewees: data.interviewees ?? [],
          status: data.status ?? "NOT_STARTED",
        });
      } catch (err) {
        console.error("Error loading interview", err);
      }
    };
    fetchOne();
  }, [id]);

  /* --- handlers --- */
  const handleChange =
    (field: keyof InterviewDTO) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setData({ ...data, [field]: e.target.value });

  const save = async () => {
    if (!data.title || !data.description || !data.position || !data.scheduledAt || !data.surveyId ||
        !data.professionals?.length || !data.interviewees?.length) {
      Notification("Debe completar todos los campos requeridos y seleccionar al menos un profesional y un entrevistado", "error");
      return;
    }
    try {
      setSaving(true);
      if (id) {
        await apiConnection.patch(`/interviews/${id}`, {
          title: data.title,
          description: data.description,
          surveyId: data.surveyId,
          position: data.position,
          scheduledAt: data.scheduledAt,
          professionals: data.professionals || [],
          interviewees: data.interviewees || [],
          status: data.status || "NOT_STARTED",
        });
      } else {
        await apiConnection.post("/interviews", {
          title: data.title,
          description: data.description,
          surveyId: data.surveyId,
          position: data.position,
          scheduledAt: data.scheduledAt,
          professionals: data.professionals || [],
          interviewees: data.interviewees || [],
          status: data.status || "NOT_STARTED",
        });
      }
      Notification(
        id ? "Entrevista actualizada exitosamente" : "Entrevista creada exitosamente",
        "success"
      );
      router.push("/interviews/table");
    } catch (err: any) {
      console.error("Error saving interview", err);
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.errorMessage ||
                          "Error al guardar la entrevista";
      Notification(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout links={[{ label: "Entrevistas", href: "/interviews/table" }]}>
      <div className="flex-col pb-10">
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#D4D4D8]"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-[22px] font-bold">
            {id ? `Entrevista ${data.title}` : "Nueva entrevista"}
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
            placeholder="Título de la entrevista"
            required
            value={data.title}
            onChange={handleChange("title")}
          />
          <InputForms
            label="Descripción"
            placeholder="Descripción"
            required
            value={data.description}
            onChange={handleChange("description")}
          />
          <InputForms
            label="Posición"
            placeholder="Posición"
            required
            value={data.position}
            onChange={handleChange("position")}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha y hora programada *
            </label>
            <input
              type="datetime-local"
              required
              value={data.scheduledAt}
              onChange={(e) => setData({ ...data, scheduledAt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <SurveySelector
              value={data.surveyId}
              onChange={(surveyId) => setData({ ...data, surveyId })}
            />
            {!data.surveyId && (
              <p className="text-sm text-red-500 mt-1">* Campo requerido</p>
            )}
          </div>

          <div>
            <ProfessionalsSelector
              value={data.professionals}
              onChange={(professionals) => setData({ ...data, professionals })}
            />
            {(!data.professionals || data.professionals.length === 0) && (
              <p className="text-sm text-red-500 mt-1">* Debe seleccionar al menos un profesional</p>
            )}
          </div>

          <div>
            <IntervieweesSelector
              value={data.interviewees}
              onChange={(interviewees) => setData({ ...data, interviewees })}
            />
            {(!data.interviewees || data.interviewees.length === 0) && (
              <p className="text-sm text-red-500 mt-1">* Debe seleccionar al menos un entrevistado</p>
            )}
          </div>


          {/* Resumen de la entrevista */}
          {(data.surveyId || data.professionals?.length || data.interviewees?.length) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Resumen de la entrevista</h4>
              <div className="space-y-2 text-sm">
                {data.surveyId && (
                  <p><span className="font-medium">Evaluación:</span> Seleccionada</p>
                )}
                {data.professionals?.length && (
                  <p><span className="font-medium">Profesionales:</span> {data.professionals.length} seleccionado(s)</p>
                )}
                {data.interviewees?.length && (
                  <p><span className="font-medium">Entrevistados:</span> {data.interviewees.length} seleccionado(s)</p>
                )}
                {data.scheduledAt && (
                  <p><span className="font-medium">Fecha programada:</span> {new Date(data.scheduledAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#635BFF] text-white"
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Link href="/interviews/table">
              <Button>Cancelar</Button>
            </Link>
          </div>
        </Form>
      </div>
    </AuthLayout>
  );
};

export default InformationView;
