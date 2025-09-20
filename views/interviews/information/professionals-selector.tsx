import React, { useEffect, useState } from "react";
import apiConnection from "@/pages/api/api";
import { Select, SelectItem, Chip } from "@heroui/react";

interface Professional {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullname?: string;
  email: string;
  position?: string;
  roles?: string[];
}

interface Props {
  value?: string[]; // Array de IDs de profesionales seleccionados
  onChange(professionalIds: string[]): void; // callback al padre
}

const ProfessionalsSelector: React.FC<Props> = ({ value = [], onChange }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  /* cargar profesionales disponibles */
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const { data } = await apiConnection.get("/users/table");

        // Verificar si los datos están en el formato correcto
        if (Array.isArray(data)) {
          setProfessionals(data);
        } else {
          console.error("Data is not an array:", typeof data);
          setProfessionals([]);
        }
      } catch (error) {
        console.error("Error loading professionals:", error);
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const handleSelectionChange = (keys: any) => {
    const selectedKeys = Array.from(keys) as string[];
    onChange(selectedKeys);
  };

  const getSelectedProfessionals = () => {
    return professionals.filter(prof => value.includes(prof._id));
  };

  // Helper function para obtener el nombre completo
  const getDisplayName = (professional: Professional) => {
    let firstName = professional.firstName || '';
    let lastName = professional.lastName || '';

    // Si no hay firstName/lastName, intentar extraer de fullname
    if (!firstName && !lastName && professional.fullname) {
      const nameParts = professional.fullname.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    return firstName && lastName
      ? `${firstName} ${lastName}`
      : professional.fullname || professional.email;
  };

  return (
    <div className="w-full">
      <div>
        <h3 className="mb-2 font-semibold">Profesionales</h3>
        <Select
          radius="sm"
          placeholder={
            loading
              ? "Cargando profesionales..."
              : professionals.length === 0
                ? "No hay profesionales disponibles"
                : "Selecciona profesionales…"
          }
          className="w-full"
          selectionMode="multiple"
          selectedKeys={new Set(value)}
          onSelectionChange={handleSelectionChange}
          isDisabled={loading || professionals.length === 0}
        >
          {professionals.map((professional) => (
            <SelectItem key={professional._id} value={professional._id} textValue={getDisplayName(professional)}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {getDisplayName(professional)}
                </span>
                <span className="text-sm text-gray-500">
                  {professional.email}
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>

        {/* Mostrar profesionales seleccionados */}
        {value.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">Profesionales seleccionados:</h4>
            <div className="flex flex-wrap gap-2">
              {getSelectedProfessionals().map((professional) => (
                <Chip
                  key={professional._id}
                  onClose={() => {
                    const newSelection = value.filter(id => id !== professional._id);
                    onChange(newSelection);
                  }}
                  variant="flat"
                  color="primary"
                >
                  {getDisplayName(professional)}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalsSelector;
