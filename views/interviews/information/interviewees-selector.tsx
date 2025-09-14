import React, { useEffect, useState } from "react";
import apiConnection from "@/pages/api/api";
import { Select, SelectItem, Chip } from "@heroui/react";
import Link from "next/link";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone?: string;
  position?: string;
  department?: string;
}

interface Interviewee {
  _id: string;
  personalInfo: PersonalInfo;
  email: string;
  companyName?: string;
  status: string;
}

interface Props {
  value?: string[]; // Array de IDs de entrevistados seleccionados
  onChange(intervieweeIds: string[]): void; // callback al padre
}

const IntervieweesSelector: React.FC<Props> = ({ value = [], onChange }) => {
  const [interviewees, setInterviewees] = useState<Interviewee[]>([]);
  const [loading, setLoading] = useState(true);

  /* cargar entrevistados disponibles */
  const fetchInterviewees = async () => {
    try {
      setLoading(true);
      const { data } = await apiConnection.get("/interviewees/filtered");
      console.log("Interviewees data:", data);
      // La respuesta puede venir en data.data o directamente en data
      const intervieweesData = data.data || data;
      setInterviewees(intervieweesData);
    } catch (error) {
      console.error("Error loading interviewees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewees();
  }, []);

  // Refrescar cuando se regrese al componente
  useEffect(() => {
    const handleFocus = () => {
      fetchInterviewees();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleSelectionChange = (keys: any) => {
    const selectedKeys = Array.from(keys) as string[];
    onChange(selectedKeys);
  };

  const getSelectedInterviewees = () => {
    return interviewees.filter(interviewee => value.includes(interviewee._id));
  };

  return (
    <div className="w-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Entrevistados</h3>
          <Link
            href="/interviewed/edit"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            + Crear nuevo entrevistado
          </Link>
        </div>
        <Select
          radius="sm"
          placeholder={loading ? "Cargando entrevistados..." : "Selecciona entrevistados…"}
          className="w-full"
          selectionMode="multiple"
          selectedKeys={new Set(value)}
          onSelectionChange={handleSelectionChange}
          isDisabled={loading}
        >
          {interviewees.map((interviewee) => (
            <SelectItem key={interviewee._id}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {interviewee.personalInfo.firstName} {interviewee.personalInfo.lastName}
                </span>
                <span className="text-sm text-gray-500">
                  {interviewee.email}
                  {interviewee.personalInfo.position ? ` - ${interviewee.personalInfo.position}` : ''}
                  {interviewee.companyName ? ` (${interviewee.companyName})` : ''}
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>

        {/* Mostrar entrevistados seleccionados */}
        {value.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Entrevistados seleccionados:</h4>
            <div className="flex flex-wrap gap-2">
              {getSelectedInterviewees().map((interviewee) => (
                <Chip
                  key={interviewee._id}
                  onClose={() => {
                    const newSelection = value.filter(id => id !== interviewee._id);
                    onChange(newSelection);
                  }}
                  variant="flat"
                  color="secondary"
                >
                  {interviewee.personalInfo.firstName} {interviewee.personalInfo.lastName}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntervieweesSelector;
