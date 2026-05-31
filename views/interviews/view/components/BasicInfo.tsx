import React from "react";
import { Chip } from "@heroui/react";

interface BasicInfoProps {
  title: string;
  description: string;
  position: string;
  positionDescription?: string;
  scheduledAt: string;
  status: string;
  survey?: {
    _id: string;
    title: string;
  };
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  title,
  description,
  position,
  positionDescription,
  scheduledAt,
  status,
  survey,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "default";
      case "IN_PROGRESS":
        return "warning";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "No iniciada";
      case "IN_PROGRESS":
        return "En progreso";
      case "COMPLETED":
        return "Completada";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No programada";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Información General
          </h2>
          <Chip color={getStatusColor(status)} variant="flat">
            {getStatusText(status)}
          </Chip>
        </div>

        <div className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">{title}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posición
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">{position}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">
              {description || "Sin descripción"}
            </div>
          </div>

          {positionDescription && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de puesto
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border min-h-[80px]">
                {positionDescription}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha programada
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {formatDate(scheduledAt)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Encuesta asociada
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                {survey?.title || "Sin encuesta asociada"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;
