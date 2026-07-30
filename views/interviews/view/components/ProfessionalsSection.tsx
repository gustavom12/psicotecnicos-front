import React from "react";

interface Professional {
  _id: string;
  fullname?: string;
  firstName?: string;
  email?: string;
  phoneNumber?: string;
  speciality?: string;
  roles?: string[];
  teamId?: string;
}

interface ProfessionalsSectionProps {
  // Puede llegar como documento o, en respuestas viejas, como id plano.
  professionals: Array<Professional | string>;
}

const getProfessionalId = (professional: Professional | string) =>
  typeof professional === "string" ? professional : professional._id;

const getProfessionalName = (professional: Professional | string) => {
  if (typeof professional === "string") return "Sin nombre";
  return (
    professional.fullname ||
    professional.firstName ||
    professional.email ||
    "Sin nombre"
  );
};

const getProfessionalEmail = (professional: Professional | string) =>
  typeof professional === "string" ? "" : professional.email || "";

const getProfessionalInitials = (professional: Professional | string) => {
  const name = getProfessionalName(professional);
  if (!name || name === "Sin nombre") return "P";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({
  professionals,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Profesionales Asignados
          </h2>
          <span className="text-sm text-gray-500">
            {professionals.length} profesional
            {professionals.length !== 1 ? "es" : ""}
          </span>
        </div>

        <div className="space-y-3">
          {professionals && professionals.length > 0 ? (
            professionals.map((professional) => {
              const id = getProfessionalId(professional);
              const name = getProfessionalName(professional);
              const email = getProfessionalEmail(professional);
              const phone =
                typeof professional === "string"
                  ? undefined
                  : professional.phoneNumber;
              const speciality =
                typeof professional === "string"
                  ? undefined
                  : professional.speciality;

              return (
              <div
                key={id}
                className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                  {getProfessionalInitials(professional)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  {email && (
                    <p className="text-sm text-gray-600">{email}</p>
                  )}
                  {phone && (
                    <p className="text-xs text-gray-500 mt-1">
                      📞 {phone}
                    </p>
                  )}
                  {speciality && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      🎯 {speciality}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <p className="text-xs text-gray-500 mt-1">Activo</p>
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay profesionales asignados
              </h3>
              <p className="text-gray-500">
                Esta entrevista no tiene profesionales asignados aún.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsSection;
