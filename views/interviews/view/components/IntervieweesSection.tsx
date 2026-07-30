import React from "react";
import { Chip } from "@heroui/react";

interface Interviewee {
  _id: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
  };
  // Campo legacy de algunos documentos.
  name?: string;
  email?: string;
  mail?: string;
  status?: string;
  completedAt?: string;
  startedAt?: string;
}

interface IntervieweesSectionProps {
  // Puede llegar como documento o, en respuestas viejas, como id plano.
  interviewees: Array<Interviewee | string>;
}

const IntervieweesSection: React.FC<IntervieweesSectionProps> = ({
  interviewees,
}) => {
  const normalizeStatus = (status?: string) =>
    (status || "").toUpperCase().replace(/-/g, "_");

  const getStatusColor = (status?: string) => {
    switch (normalizeStatus(status)) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      case "NOT_STARTED":
      case "PENDING":
      case "INVITED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status?: string) => {
    switch (normalizeStatus(status)) {
      case "COMPLETED":
        return "Completado";
      case "IN_PROGRESS":
        return "En progreso";
      case "NOT_STARTED":
        return "No iniciado";
      case "INVITED":
        return "Invitado";
      case "PENDING":
        return "Pendiente";
      default:
        return status || "Pendiente";
    }
  };

  const getIntervieweeId = (interviewee: Interviewee | string) =>
    typeof interviewee === "string" ? interviewee : interviewee._id;

  const getIntervieweeName = (interviewee: Interviewee | string) => {
    if (typeof interviewee === "string") return "Sin nombre";
    const first = interviewee.personalInfo?.firstName?.trim();
    const last = interviewee.personalInfo?.lastName?.trim();
    if (first || last) return [first, last].filter(Boolean).join(" ");
    return (
      interviewee.name ||
      interviewee.email ||
      interviewee.mail ||
      "Sin nombre"
    );
  };

  const getIntervieweeEmail = (interviewee: Interviewee | string) => {
    if (typeof interviewee === "string") return "";
    return interviewee.email || interviewee.mail || "";
  };

  const getInitials = (interviewee: Interviewee | string) => {
    if (typeof interviewee === "string") return "E";
    const first = interviewee.personalInfo?.firstName?.[0];
    const last = interviewee.personalInfo?.lastName?.[0];
    if (first || last) {
      return `${first || ""}${last || ""}`.toUpperCase();
    }
    const name = getIntervieweeName(interviewee);
    if (name && name !== "Sin nombre") return name[0].toUpperCase();
    return (
      interviewee.email?.[0]?.toUpperCase() ||
      interviewee.mail?.[0]?.toUpperCase() ||
      "E"
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Entrevistados</h2>
          <span className="text-sm text-gray-500">
            {interviewees.length} entrevistado
            {interviewees.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {interviewees && interviewees.length > 0 ? (
            interviewees.map((interviewee) => {
              const id = getIntervieweeId(interviewee);
              const email = getIntervieweeEmail(interviewee);
              const status =
                typeof interviewee === "string"
                  ? undefined
                  : interviewee.status;
              const completedAt =
                typeof interviewee === "string"
                  ? undefined
                  : interviewee.completedAt;
              const startedAt =
                typeof interviewee === "string"
                  ? undefined
                  : interviewee.startedAt;

              return (
              <div
                key={id}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {getInitials(interviewee)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {getIntervieweeName(interviewee)}
                  </h3>
                  {email && (
                    <p className="text-sm text-gray-600">{email}</p>
                  )}
                  {completedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      Completado:{" "}
                      {new Date(completedAt).toLocaleDateString("es-ES")}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Chip
                    color={getStatusColor(status)}
                    variant="flat"
                    size="sm"
                  >
                    {getStatusText(status)}
                  </Chip>
                  {startedAt && (
                    <p className="text-xs text-gray-500">
                      Iniciado:{" "}
                      {new Date(startedAt).toLocaleDateString("es-ES")}
                    </p>
                  )}
                </div>
              </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay entrevistados asignados
              </h3>
              <p className="text-gray-500">
                Esta entrevista no tiene entrevistados asignados aún.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntervieweesSection;
