import React from "react";
import { Chip } from "@heroui/react";

interface Interviewee {
  _id: string;
  personalInfo?: {
    firstName: string;
    lastName: string;
  };
  email: string;
  status?: string;
  completedAt?: string;
  startedAt?: string;
}

interface IntervieweesSectionProps {
  interviewees: Interviewee[];
}

const IntervieweesSection: React.FC<IntervieweesSectionProps> = ({
  interviewees,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "not_started":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "in_progress":
        return "En progreso";
      case "not_started":
        return "No iniciado";
      default:
        return "Pendiente";
    }
  };

  const getIntervieweeName = (interviewee: Interviewee) => {
    if (
      interviewee.personalInfo?.firstName &&
      interviewee.personalInfo?.lastName
    ) {
      return `${interviewee.personalInfo.firstName} ${interviewee.personalInfo.lastName}`;
    }
    return interviewee.email || "Sin nombre";
  };

  const getInitials = (interviewee: Interviewee) => {
    if (
      interviewee.personalInfo?.firstName &&
      interviewee.personalInfo?.lastName
    ) {
      return `${interviewee.personalInfo.firstName[0]}${interviewee.personalInfo.lastName[0]}`.toUpperCase();
    }
    return interviewee.email?.[0]?.toUpperCase() || "E";
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
            interviewees.map((interviewee) => (
              <div
                key={interviewee._id}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {getInitials(interviewee)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {getIntervieweeName(interviewee)}
                  </h3>
                  <p className="text-sm text-gray-600">{interviewee.email}</p>
                  {interviewee.completedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      Completado:{" "}
                      {new Date(interviewee.completedAt).toLocaleDateString(
                        "es-ES",
                      )}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Chip
                    color={getStatusColor(interviewee.status)}
                    variant="flat"
                    size="sm"
                  >
                    {getStatusText(interviewee.status)}
                  </Chip>
                  {interviewee.startedAt && (
                    <p className="text-xs text-gray-500">
                      Iniciado:{" "}
                      {new Date(interviewee.startedAt).toLocaleDateString(
                        "es-ES",
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))
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
