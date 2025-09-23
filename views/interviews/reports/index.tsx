import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { ButtonGroup, Select, SelectItem } from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Textarea } from "@heroui/react";
import NavbarApp from "@/common/navbar";
import MenuLeft from "@/layouts/menu/MenuLeft";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import Document from "@/public/icons/document";
import Addition from "@/public/icons/addition";
import AuthLayout from "@/layouts/auth.layout";
import { ArrowLeft, Download, FileText } from "lucide-react";

interface Interview {
  _id: string;
  title: string;
  status: string;
  scheduledAt: string;
  completedAt?: string;
  interviewees: Array<{
    _id: string;
    personalInfo: {
      firstName: string;
      lastName: string;
    };
  }>;
  professionals: Array<{
    _id: string;
    fullname: string;
  }>;
  survey: {
    _id: string;
    name: string;
  };
}

interface Report {
  _id: string;
  interviewId: string;
  title: string;
  type: 'general' | 'individual' | 'comparative';
  status: 'pending' | 'generating' | 'completed' | 'error';
  createdAt: string;
  completedAt?: string;
  fileUrl?: string;
}

interface ReportContent {
  content: string;
}

const ReportsView = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<string>("");
  const [reportType, setReportType] = useState<string>("general");
  const [reportTitle, setReportTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<ReportContent>({
    content: ''
  });
  const [currentReportId, setCurrentReportId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const interviewsRes = await apiConnection.get("/interviews/filtered");
      const interviewsData = Array.isArray(interviewsRes.data?.data) ?
        interviewsRes.data.data :
        Array.isArray(interviewsRes.data) ? interviewsRes.data : [];

      const completedInterviews = interviewsData.filter(interview =>
        interview.status === 'completed' || interview.status === 'finalizada'
      );

      setInterviews(completedInterviews);

      try {
        const reportsRes = await apiConnection.get("/reports");
        const reportsData = Array.isArray(reportsRes.data?.data) ?
          reportsRes.data.data :
          Array.isArray(reportsRes.data) ? reportsRes.data : [];
        setReports(reportsData);
      } catch (reportsError) {
        console.log("Reports endpoint not available yet");
        setReports([]);
      }

    } catch (error) {
      console.error("Error loading data:", error);
      Notification("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedInterview || !reportTitle.trim()) {
      Notification("Por favor selecciona una entrevista y proporciona un título", "error");
      return;
    }

    try {
      setGenerating(true);
      const reportData = {
        interviewId: selectedInterview,
        title: reportTitle.trim(),
        type: reportType
      };

      await apiConnection.post("/reports", reportData);
      Notification("Reporte solicitado exitosamente", "success");

      setSelectedInterview("");
      setReportTitle("");
      setReportType("general");

      loadData();
    } catch (error) {
      console.error("Error generating report:", error);
      Notification("Error al generar el reporte", "error");
    } finally {
      setGenerating(false);
    }
  };

  const saveReport = async () => {
    try {
      setGenerating(true);

      const endpoint = currentReportId ?
        `/reports/${currentReportId}/content` :
        '/reports/content';

      const method = currentReportId ? 'patch' : 'post';

      const reportData = {
        content: reportContent,
        title: reportTitle || 'Nuevo Informe',
        type: reportType
      };

      const response = await apiConnection[method](endpoint, reportData);

      if (response.data) {
        Notification("Informe guardado exitosamente", "success");
        if (!currentReportId) {
          setCurrentReportId(response.data._id);
        }
        loadData(); // Recargar la lista
      }
    } catch (error: any) {
      console.error("Error saving report:", error);
      const errorMessage = error?.response?.data?.message || "Error al guardar el informe";
      Notification(errorMessage, "error");
    } finally {
      setGenerating(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setGenerating(true);

      // Si no hay un reporte guardado, guardarlo primero
      if (!currentReportId) {
        await saveReport();
        if (!currentReportId) {
          Notification("Error al guardar el informe antes de exportar", "error");
          return;
        }
      }

      const response = await apiConnection.post(`/reports/export-pdf`, {
        content: reportContent,
        title: reportTitle || 'Informe',
        reportId: currentReportId
      }, {
        responseType: 'blob'
      });

      // Crear un blob y descargar el PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `informe_${reportTitle || 'documento'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Notification("PDF exportado exitosamente", "success");
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      const errorMessage = error?.response?.data?.message || "Error al exportar el PDF";
      Notification(errorMessage, "error");
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = async (reportId: string, title: string) => {
    try {
      const response = await apiConnection.get(`/reports/${reportId}/download`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Notification("Reporte descargado exitosamente", "success");
    } catch (error) {
      console.error("Error downloading report:", error);
      Notification("Error al descargar el reporte", "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'generating': return 'warning';
      case 'pending': return 'default';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'generating': return 'Generando';
      case 'pending': return 'Pendiente';
      case 'error': return 'Error';
      default: return status;
    }
  };

  return (
    <AuthLayout links={[{ label: "Reports", href: "/reports" }]}>

      <div className=" ">
        <div className="flex flex-row space-x-4 mt-4 ">
          <button
            onClick={() => {
              window.history.back();
            }}
            className=" rounded-full w-[30px] h-[30px]  border border-color-[#D4D4D8] flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h1 className="font-bold text-[22px]">
            Mariano Alvarado - 20/5/2024
          </h1>
        </div>

        {/* Tabs de navegación principal */}
        <ButtonGroup className="bg-[#F4F4F5] font-inter text-[14px] text-[#71717A] w-[400px] mt-8 mb-3 h-[36px] rounded-xl">
          <Button className="rounded-sm bg-[#F4F4F5] text-[#71717A]  h-[28px]">
            Información
          </Button>
          <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">Evaluacion</Button>
          <Button className="bg-[#F4F4F5]  text-[#71717A]  h-[28px]">
            Ev. previa
          </Button>
          <Button className="bg-white  t  h-[28px]">
            Informe
          </Button>
        </ButtonGroup>

        <hr />
        {/* Layout de dos columnas */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* Columna izquierda - Editor de Texto */}

          <div className="col-span-8 ">
             {/* Botones superiores del editor */}
             <div className="flex space-x-3 mb-4">
                 <Button
                   size="sm"
                   className="bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors border border-blue-200"
                 >
                   Ver informe de IA
                 </Button>
                 <Button
                   size="sm"
                   variant="flat"
                   className="bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors border border-blue-200"
                 >
                   Ver transcripción
                 </Button>
               </div>
            <div className="bg-white rounded-lg border border-gray-800 p-6 space-y-6">
              

              {/* Barra de herramientas simulada */}
              <div className="border-b  border-gray-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <button className="font-bold px-2 py-1 hover:bg-gray-100 rounded">B</button>
                      <button className="italic px-2 py-1 hover:bg-gray-100 rounded">I</button>
                      <button className="underline px-2 py-1 hover:bg-gray-100 rounded">U</button>
                      <button className="px-2 py-1 hover:bg-gray-100 rounded">S</button>
                    </div>
                    <div className="border-l h-4"></div>
                    <div className="flex items-center space-x-2">
                      <select className="text-sm border rounded px-2 py-1">
                        <option>Normal</option>
                      </select>
                      <select className="text-sm border rounded px-2 py-1">
                        <option>16</option>
                      </select>
                      <select className="text-sm border rounded px-2 py-1">
                        <option>Roboto</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor de Texto Libre */}
              <div className="w-full">
                <Textarea
                  value={reportContent.content}
                  onChange={(e) => setReportContent({ content: e.target.value })}
                  placeholder="Escribe tu informe aquí..."
                  minRows={20}
                  className="w-full text-sm leading-relaxed bg-white"
                  classNames={{
                    input: "min-h-[500px] text-gray-800 leading-relaxed resize-none bg-white",
                    inputWrapper: "border-none shadow-none bg-white"
                  }}
                />
              </div>

             
            </div>
             {/* Botones del editor */}
             <div className="flex justify-end gap-2 pt-4 mb-6">
                <Button
                  variant="flat"
                  onClick={exportToPDF}
                  disabled={generating}
                  startContent={<Download size={16} />}
                  className="bg-gray-100 hover:bg-gray-200"
                >
                  Exportar PDF
                </Button>
                <Button
                  color="primary"
                  onClick={saveReport}
                  disabled={generating}
                  startContent={<FileText size={16} />}
                >
                  {generating ? "Guardando..." : "Guardar informe"}
                </Button>
              </div>
          </div>

          {/* Columna derecha - Panel de Test de Rorschach */}
          <div className="col-span-4">
            <div className="bg-gray-100 rounded-lg p-6 h-full">
              <div className=" rounded-lg p-4 space-y-4 h-full">
                <h3 className="font-semibold text-gray-900 text-lg">Test de Rorschach</h3>
                <p className="text-sm text-gray-600 font-medium">Escenario negro</p>
                <p className="text-sm text-gray-700">
                  Tener en consideración las aptitudes resolutivas del entrevistado.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Respuesta del entrevistado
                    </label>
                    <Input
                      placeholder="Una computadora cuántica"
                      className="w-full bg-white"
                      size="sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <Textarea
                      placeholder=""
                      minRows={4}
                      className="w-full bg-white"
                      size="sm"
                    />
                  </div>
                </div>

                {/* Espacio flexible para empujar el contenido hacia abajo */}
                <div className="flex-1 mt-10"></div>

                {/* Imagen del test y botones de navegación en la misma fila */}
                <div className="flex justify-between items-end mt-10 ">
                  {/* Imagen del test */}
                  <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-sm">
                    <div className="w-12 h-12 bg-black rounded-full opacity-90" style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      borderRadius: '50%'
                    }}></div>
                  </div>

                  {/* Botones de navegación */}
                  <div className="flex gap-3">
                    <button className="w-10 h-10 bg-gray-400 text-white rounded-sm flex items-center justify-center hover:bg-gray-500 transition-colors">
                      <span className="text-lg font-bold">‹</span>
                    </button>
                    <button className="w-10 h-10 bg-gray-400 text-white rounded-sm flex items-center justify-center hover:bg-gray-500 transition-colors">
                      <span className="text-lg font-bold">›</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>



    </AuthLayout>
  );
};

export default ReportsView;
