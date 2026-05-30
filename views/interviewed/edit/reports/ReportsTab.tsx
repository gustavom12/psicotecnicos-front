import React from "react";
import { Button } from "@heroui/react";
import { useReports } from "./useReports";
import ReportCard from "./ReportCard";

interface Props {
  intervieweeId: string;
}

const ReportsTab: React.FC<Props> = ({ intervieweeId }) => {
  const { loading, reports, interviewsById, refresh, applyFeedback } =
    useReports(intervieweeId);

  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        <span className="ml-2 text-gray-600">Cargando reportes...</span>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Informes</h3>
          <p className="text-gray-500">
            Informes psicotécnicos del entrevistado. Podés sugerir cambios para
            generar una nueva versión.
          </p>
        </div>
        <Button variant="bordered" onClick={refresh}>
          Refrescar
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Sin informes disponibles
          </h4>
          <p className="text-gray-500 max-w-lg mx-auto">
            Aún no se ha generado ningún informe para este entrevistado.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <ReportCard
              key={report._id}
              report={report}
              interview={interviewsById[report.interviewId]}
              onSubmitFeedback={applyFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
