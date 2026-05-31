import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ArrowLeft from "@/public/icons/arrowleft";
import { Button } from "@heroui/button";
import { Form, DateInput } from "@heroui/react";
import {
  parseDateTime,
  getLocalTimeZone,
  DateValue,
} from "@internationalized/date";
import InputForms from "@/common/inputForms";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";
import SurveySelector from "./survey-selector";
import ProfessionalsSelector from "./professionals-selector";
import IntervieweesSelector from "./interviewees-selector";
import CompanySelector from "./company-selector";
import { Notification } from "@/common/notification";
import { useRouter } from "next/router";

interface InterviewDTO {
  title: string;
  description: string;
  surveyId?: string;
  companyId?: string;
  position: string;
  positionDescription?: string;
  scheduledAt: DateValue | null;
  professionals?: string[];
  interviewees?: string[];
  status?: string;
}

const EMPTY: InterviewDTO = {
  title: "",
  description: "",
  position: "",
  positionDescription: "",
  scheduledAt: null,
  professionals: [],
  interviewees: [],
  status: "NOT_STARTED",
};

interface CreatedInterview {
  _id: string;
  shortId: string;
  title: string;
  scheduledAt: string;
  attendeeEmails: string[];
}

/**
 * Lista de emails que SIEMPRE se incluyen como invitados en el evento
 * pre-rellenado de Google Calendar. Se configura con la variable de
 * entorno NEXT_PUBLIC_DEFAULT_INVITEE_EMAILS (admite varios separados
 * por coma).
 */
const DEFAULT_INVITEE_EMAILS: string[] = (
  process.env.NEXT_PUBLIC_DEFAULT_INVITEE_EMAILS ??
  "gustavo.n.mercado2@gmail.com"
)
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

/* --- helpers para Google Calendar / Meet --- */

const formatGCalDate = (date: Date) =>
  date.toISOString().replace(/[-:]|\.\d{3}/g, "");

const buildEventTitle = (title: string, shortId: string) =>
  `Entrevista psicotécnica - ${title} [ID:${shortId}]`;

const buildGoogleCalendarUrl = (interview: CreatedInterview) => {
  const start = new Date(interview.scheduledAt);
  // Duración por defecto: 1 hora.
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  params.set("text", buildEventTitle(interview.title, interview.shortId));
  params.set("dates", `${formatGCalDate(start)}/${formatGCalDate(end)}`);
  params.set(
    "details",
    [
      `Entrevista psicotécnica generada desde la plataforma.`,
      ``,
      `ID de entrevista: ${interview.shortId}`,
    ].join("\n"),
  );
  if (interview.attendeeEmails.length > 0) {
    params.set("add", interview.attendeeEmails.join(","));
  }
  // Sugerencia de ubicación: el organizador deberá agregar Google Meet
  // desde el editor de evento. Calendar lo crea con un click.
  params.set("location", "Google Meet (agregar conferencia al evento)");

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const InformationView = ({ id }: { id?: string }) => {
  const [data, setData] = useState<InterviewDTO>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<CreatedInterview | null>(null);
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
          positionDescription: data.positionDescription ?? "",
          surveyId: data.surveyId ?? "",
          companyId: data.companyId ?? "",
          scheduledAt: data.scheduledAt
            ? parseDateTime(
                new Date(data.scheduledAt).toISOString().slice(0, 19),
              )
            : null,
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

  /**
   * Tras crear la entrevista, traemos los emails de profesionales y
   * entrevistados seleccionados para pre-rellenar los invitados del evento.
   */
  const fetchAttendeeEmails = async (
    professionalIds: string[],
    intervieweeIds: string[],
  ): Promise<string[]> => {
    const emails: string[] = [...DEFAULT_INVITEE_EMAILS];
    try {
      const [professionalsRes, intervieweesRes] = await Promise.all([
        apiConnection.get("/users/table"),
        apiConnection.get("/interviewees/filtered"),
      ]);

      const professionals = Array.isArray(professionalsRes.data)
        ? professionalsRes.data
        : [];
      const interviewees = Array.isArray(intervieweesRes.data)
        ? intervieweesRes.data
        : (intervieweesRes.data?.data ?? []);

      for (const p of professionals) {
        if (professionalIds.includes(p._id) && p.email) emails.push(p.email);
      }
      for (const i of interviewees) {
        if (intervieweeIds.includes(i._id) && i.email) emails.push(i.email);
      }
    } catch (err) {
      console.warn("No se pudieron obtener los emails de los invitados", err);
    }
    // Dedupe preservando el orden (los defaults quedan al inicio).
    return Array.from(new Set(emails));
  };

  const save = async () => {
    if (
      !data.title ||
      !data.description ||
      !data.position ||
      !data.scheduledAt ||
      !data.companyId ||
      !data.professionals?.length ||
      !data.interviewees?.length
    ) {
      Notification(
        "Debe completar todos los campos requeridos (incluida la empresa) y seleccionar al menos un profesional y un entrevistado",
        "error",
      );
      return;
    }
    try {
      setSaving(true);
      const scheduledAtISO = data.scheduledAt
        ? data.scheduledAt.toDate(getLocalTimeZone()).toISOString()
        : null;

      const payload: any = {
        title: data.title,
        description: data.description,
        position: data.position,
        positionDescription: data.positionDescription || "",
        scheduledAt: scheduledAtISO,
        companyId: data.companyId,
        professionals: data.professionals || [],
        interviewees: data.interviewees || [],
        status: data.status || "NOT_STARTED",
      };
      // surveyId es opcional: solo lo enviamos si se eligió uno.
      if (data.surveyId) payload.surveyId = data.surveyId;

      if (id) {
        await apiConnection.patch(`/interviews/${id}`, payload);
        Notification("Entrevista actualizada exitosamente", "success");
        router.push("/interviews/table");
      } else {
        const { data: createdRaw } = await apiConnection.post(
          "/interviews",
          payload,
        );
        // Algunos endpoints pueden devolver { data: ... } o el doc directo.
        const createdInterview = createdRaw?.data ?? createdRaw;

        let shortId: string | undefined = createdInterview?.shortId;
        const newId: string | undefined = createdInterview?._id;

        // Fallback: si por algún motivo la respuesta no incluyó shortId
        // (p.ej. backend desactualizado), lo buscamos releyendo el doc.
        if (!shortId && newId) {
          try {
            const { data: refetched } = await apiConnection.get(
              `/interviews/${newId}`,
            );
            shortId = refetched?.shortId;
          } catch (e) {
            console.warn(
              "No se pudo releer la entrevista para obtener shortId",
              e,
            );
          }
        }

        if (!shortId) {
          Notification(
            "La entrevista se creó pero el backend no devolvió un shortId. Verificá que el backend esté actualizado.",
            "error",
          );
          router.push("/interviews/table");
          return;
        }

        const attendeeEmails = await fetchAttendeeEmails(
          data.professionals || [],
          data.interviewees || [],
        );

        Notification("Entrevista creada exitosamente", "success");

        setCreated({
          _id: newId ?? "",
          shortId,
          title: data.title,
          scheduledAt: scheduledAtISO ?? new Date().toISOString(),
          attendeeEmails,
        });
      }
    } catch (err: any) {
      console.error("Error saving interview", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errorMessage ||
        "Error al guardar la entrevista";
      Notification(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  /* --- pantalla post-creación con link a Google Meet --- */
  if (created) {
    return (
      <PostCreate
        created={created}
        onBack={() => router.push("/interviews/table")}
      />
    );
  }

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
          <InputForms
            label="Descripción de puesto"
            placeholder="Descripción del puesto (opcional)"
            value={data.positionDescription ?? ""}
            onChange={handleChange("positionDescription")}
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
            <CompanySelector
              value={data.companyId}
              onChange={(companyId) => setData({ ...data, companyId })}
            />
            {!data.companyId && (
              <p className="text-sm text-red-500 mt-1">* Campo requerido</p>
            )}
          </div>

          <div className="w-[340px]">
            <ProfessionalsSelector
              value={data.professionals}
              onChange={(professionals) => setData({ ...data, professionals })}
            />
            {(!data.professionals || data.professionals.length === 0) && (
              <p className="text-sm text-red-500 mt-1">
                * Debe seleccionar al menos un profesional
              </p>
            )}
          </div>

          <div className="w-[340px]">
            <IntervieweesSelector
              value={data.interviewees}
              onChange={(interviewees) => setData({ ...data, interviewees })}
            />
            {(!data.interviewees || data.interviewees.length === 0) && (
              <p className="text-sm text-red-500 mt-1">
                * Debe seleccionar al menos un entrevistado
              </p>
            )}
          </div>

          <div className="w-[340px]">
            <SurveySelector
              value={data.surveyId}
              onChange={(surveyId) => setData({ ...data, surveyId })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Opcional. Podés vincular una evaluación más tarde.
            </p>
          </div>

          {/* Resumen de la entrevista */}
          {(data.surveyId ||
            data.companyId ||
            data.professionals?.length ||
            data.interviewees?.length) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">
                Resumen de la entrevista
              </h4>
              <div className="space-y-2 text-sm">
                {data.companyId && (
                  <p>
                    <span className="font-medium">Empresa:</span> Seleccionada
                  </p>
                )}
                {data.surveyId && (
                  <p>
                    <span className="font-medium">Evaluación:</span>{" "}
                    Seleccionada
                  </p>
                )}
                {data.professionals?.length ? (
                  <p>
                    <span className="font-medium">Profesionales:</span>{" "}
                    {data.professionals.length} seleccionado(s)
                  </p>
                ) : null}
                {data.interviewees?.length ? (
                  <p>
                    <span className="font-medium">Entrevistados:</span>{" "}
                    {data.interviewees.length} seleccionado(s)
                  </p>
                ) : null}
                {data.scheduledAt && (
                  <p>
                    <span className="font-medium">Fecha programada:</span>{" "}
                    {data.scheduledAt
                      .toDate(getLocalTimeZone())
                      .toLocaleString()}
                  </p>
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

interface PostCreateProps {
  created: CreatedInterview;
  onBack: () => void;
}

const PostCreate: React.FC<PostCreateProps> = ({ created, onBack }) => {
  const calendarUrl = useMemo(() => buildGoogleCalendarUrl(created), [created]);
  const eventTitle = buildEventTitle(created.title, created.shortId);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(calendarUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Notification("No se pudo copiar el enlace", "error");
    }
  };

  return (
    <AuthLayout links={[{ label: "Entrevistas", href: "/interviews/table" }]}>
      <div className="flex-col pb-10 max-w-[760px]">
        <div className="mt-4 flex items-center gap-4">
          <h1 className="text-[22px] font-bold">¡Entrevista creada!</h1>
        </div>

        <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900">
            La entrevista <strong>{created.title}</strong> se creó
            correctamente.
          </p>
          <div className="mt-3">
            <p className="text-xs uppercase tracking-wide text-gray-600">
              ID de entrevista
            </p>
            <p className="text-2xl font-mono font-bold text-gray-900">
              {created.shortId}
            </p>
          </div>
        </div>

        <div className="mt-6 p-5 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>Importante:</strong> al crear el evento en Google Calendar
            no modifiques el <em>ID</em> del título (
            <code className="px-1 py-0.5 bg-yellow-100 rounded">
              [ID:{created.shortId}]
            </code>
            ). Se utiliza para vincular automáticamente la grabación de Grain
            con esta entrevista.
          </p>
        </div>

        <div className="mt-6 p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900">
            Crear evento de Google Meet
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            El siguiente enlace abre Google Calendar con el evento pre-rellenado
            (título, fecha, invitados). Una vez en Calendar, agregá la
            videollamada de Google Meet con un click en{" "}
            <em>“Añadir videollamada de Google Meet”</em>.
          </p>

          <div className="mt-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Título del evento
            </p>
            <p className="font-mono text-sm text-gray-800 break-all">
              {eventTitle}
            </p>
          </div>

          {created.attendeeEmails.length > 0 && (
            <div className="mt-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Invitados
              </p>
              <p className="text-sm text-gray-800 break-all">
                {created.attendeeEmails.join(", ")}
              </p>
            </div>
          )}

          <div className="mt-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Enlace pre-rellenado
            </p>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {calendarUrl}
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-[#635BFF] text-white">
                Abrir en Google Calendar
              </Button>
            </a>
            <Button onClick={handleCopy}>
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </Button>
            <Button onClick={onBack} variant="light">
              Volver al listado
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default InformationView;
