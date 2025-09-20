import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button, ButtonGroup } from "@heroui/button";
import { Form, DateInput } from "@heroui/react";
import { parseDateTime, now, getLocalTimeZone, DateValue } from "@internationalized/date";
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
  scheduledAt: DateValue | null;
  professionals?: string[];
  interviewees?: string[];
  status?: string;
}

const EMPTY: InterviewDTO = {
  title: "",
  description: "",
  position: "",
  scheduledAt: null,
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
          scheduledAt: data.scheduledAt ? parseDateTime(new Date(data.scheduledAt).toISOString().slice(0, 19)) : null,
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
      const scheduledAtISO = data.scheduledAt ? data.scheduledAt.toDate(getLocalTimeZone()).toISOString() : null;

      if (id) {
        await apiConnection.patch(`/interviews/${id}`, {
          title: data.title,
          description: data.description,
          surveyId: data.surveyId,
          position: data.position,
          scheduledAt: scheduledAtISO,
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
          scheduledAt: scheduledAtISO,
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

          <DateInput
            label="Fecha y hora programada"
            labelPlacement="outside"
            value={data.scheduledAt}
            onChange={(value) => setData({ ...data, scheduledAt: value })}
            granularity="minute"
            hourCycle={24}
            isRequired
            className="color-[#F4F4F5] w-[340px] my-6"
          />

          <div className="w-[340px]">
            <SurveySelector
              value={data.surveyId}
              onChange={(surveyId) => setData({ ...data, surveyId })}
            />
            {!data.surveyId && (
              <p className="text-sm text-red-500 mt-1">* Campo requerido</p>
            )}
          </div>

          <div className="w-[340px]">
            <ProfessionalsSelector
              value={data.professionals}
              onChange={(professionals) => setData({ ...data, professionals })}
            />
            {(!data.professionals || data.professionals.length === 0) && (
              <p className="text-sm text-red-500 mt-1">* Debe seleccionar al menos un profesional</p>
            )}
          </div>

          <div className="w-[340px]">
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
                  <p><span className="font-medium">Fecha programada:</span> {data.scheduledAt.toDate(getLocalTimeZone()).toLocaleString()}</p>
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
