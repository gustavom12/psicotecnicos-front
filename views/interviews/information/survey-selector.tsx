import React, { useEffect, useState } from "react";
import apiConnection from "@/pages/api/api";
import { Select, SelectItem } from "@heroui/react";

interface Survey {
  _id: string;
  name: string;
  position: string;
  description: string;
}

interface Props {
  value?: string; // id de la encuesta seleccionada
  onChange(surveyId: string): void; // callback al padre
}

const SurveySelector: React.FC<Props> = ({ value, onChange }) => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  /* cargar encuestas disponibles */
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        const { data } = await apiConnection.get("/surveys");
        console.log("Surveys data:", data);
        setSurveys(data);
      } catch (error) {
        console.error("Error loading surveys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="w-full">
      <div>
        <h3 className="mb-2 font-semibold">Encuesta</h3>
        <Select
          radius="sm"
          placeholder={loading ? "Cargando encuestas..." : "Selecciona una encuesta…"}
          className="w-full"
          selectedKeys={value ? [value] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            if (selectedKey) {
              onChange(selectedKey);
            }
          }}
          isDisabled={loading}
        >
          {surveys.map((survey) => (
            <SelectItem key={survey._id} value={survey._id}>
              <div className="flex flex-col">
                <span className="font-medium">{survey.name}</span>
                <span className="text-sm text-gray-500">
                  {survey.position} - {survey.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </Select>

        {/* Mostrar información de la encuesta seleccionada */}
        {value && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            {(() => {
              const selectedSurvey = surveys.find(s => s._id === value);
              if (selectedSurvey) {
                return (
                  <div>
                    <h4 className="font-medium text-gray-800">{selectedSurvey.name}</h4>
                    <p className="text-sm text-gray-600">Puesto: {selectedSurvey.position}</p>
                    <p className="text-sm text-gray-600">Descripción: {selectedSurvey.description}</p>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveySelector;
