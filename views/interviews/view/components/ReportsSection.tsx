import React from "react";
import { Button } from "@heroui/react";

interface ReportsSectionProps {
  interviewId: string;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ interviewId }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Informes y Análisis
          </h2>
          <Button
            color="primary"
            variant="flat"
            size="sm"
            isDisabled
          >
            Generar Informe
          </Button>
        </div>

        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Sección de Informes
          </h3>

          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Esta sección estará disponible próximamente. Aquí podrás generar y visualizar
            informes detallados sobre el desempeño y resultados de la entrevista.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6.5a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 014 11.5V5z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Análisis de Respuestas</h4>
              <p className="text-xs text-gray-500">Estadísticas detalladas de las respuestas</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Gráficos y Métricas</h4>
              <p className="text-xs text-gray-500">Visualizaciones interactivas</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Exportar Datos</h4>
              <p className="text-xs text-gray-500">PDF, Excel y otros formatos</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Próximamente:</strong> Análisis automático de respuestas,
              generación de informes personalizados y exportación de datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
