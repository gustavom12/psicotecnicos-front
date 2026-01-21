import React, { useEffect, useState } from "react";
import { Chip, Accordion, AccordionItem } from "@heroui/react";
import apiConnection from "@/pages/api/api";

interface QuestionResponse {
  questionId: string;
  slideIndex: number;
  formId: string;
  answer: string;
  questionType: string;
}

interface SlideTimeData {
  slideIndex: number;
  formId: string;
  startTime: string;
  endTime?: string;
  totalTimeSeconds: number;
  visitCount: number;
}

interface InterviewResponse {
  _id: string;
  interviewId?: string;
  surveyId: string;
  intervieweeId: string | {
    _id: string;
    personalInfo?: {
      firstName: string;
      lastName: string;
    };
    email: string;
  };
  moduleId?: string;
  responses: QuestionResponse[];
  slideTimeData: SlideTimeData[];
  totalTimeSeconds: number;
  status: string;
  startedAt: string;
  completedAt?: string;
  interviewee?: {
    _id: string;
    personalInfo?: {
      firstName: string;
      lastName: string;
    };
    email: string;
  };
}

interface ResponsesSectionProps {
  interviewId: string;
}

const ResponsesSection: React.FC<ResponsesSectionProps> = ({ interviewId }) => {
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        setLoading(true);
        const { data } = await apiConnection.get(`/interview-responses/interview/${interviewId}`);
        console.log("Responses data:", data); // Debug log
        if (Array.isArray(data) && data.length > 0) {
          console.log("First response:", data[0]); // Debug log
          console.log("IntervieweeId type:", typeof data[0].intervieweeId); // Debug log
        }
        setResponses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching responses:", error);
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchResponses();
    }
  }, [interviewId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      case "SUBMITTED":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completado";
      case "IN_PROGRESS":
        return "En progreso";
      case "SUBMITTED":
        return "Enviado";
      default:
        return status;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getIntervieweeName = (response: InterviewResponse) => {
    // Primero intentar con el campo interviewee
    if (response.interviewee?.personalInfo?.firstName && response.interviewee?.personalInfo?.lastName) {
      return `${response.interviewee.personalInfo.firstName} ${response.interviewee.personalInfo.lastName}`;
    }
    if (response.interviewee?.email) {
      return response.interviewee.email;
    }

    // Luego intentar con intervieweeId si está populado
    if (typeof response.intervieweeId === 'object' && response.intervieweeId !== null) {
      const intervieweeData = response.intervieweeId as {
        _id: string;
        personalInfo?: { firstName: string; lastName: string };
        email: string;
      };

      if (intervieweeData.personalInfo?.firstName && intervieweeData.personalInfo?.lastName) {
        return `${intervieweeData.personalInfo.firstName} ${intervieweeData.personalInfo.lastName}`;
      }
      if (intervieweeData.email) {
        return intervieweeData.email;
      }
    }

    return "Entrevistado desconocido";
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "shortText":
        return "📝";
      case "paragraph":
        return "📄";
      case "number":
        return "🔢";
      case "options":
        return "☑️";
      case "file":
        return "📎";
      case "scale":
        return "📊";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Respuestas de Formularios
          </h2>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Respuestas de Formularios
          </h2>
          <span className="text-sm text-gray-500">
            {responses.length} respuesta{responses.length !== 1 ? 's' : ''}
          </span>
        </div>

        {responses.length > 0 ? (
          <Accordion variant="splitted">
            {responses.map((response, index) => (
              <AccordionItem
                key={response._id}
                aria-label={`Respuesta ${index + 1}`}
                title={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getIntervieweeName(response)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {response.responses.length} respuesta{response.responses.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip color={getStatusColor(response.status)} variant="flat" size="sm">
                        {getStatusText(response.status)}
                      </Chip>
                      <span className="text-xs text-gray-500">
                        {formatTime(response.totalTimeSeconds)}
                      </span>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  {/* Información general */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Iniciado</p>
                      <p className="text-sm font-medium">
                        {new Date(response.startedAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Completado</p>
                      <p className="text-sm font-medium">
                        {response.completedAt
                          ? new Date(response.completedAt).toLocaleDateString("es-ES")
                          : "No completado"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tiempo total</p>
                      <p className="text-sm font-medium">
                        {formatTime(response.totalTimeSeconds)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Módulo</p>
                      <p className="text-sm font-medium">
                        {response.moduleId || "General"}
                      </p>
                    </div>
                  </div>

                  {/* Respuestas */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Respuestas:</h4>
                    {response.responses.map((questionResponse, qIndex) => (
                      <div
                        key={`${questionResponse.questionId}-${qIndex}`}
                        className="p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg">
                            {getQuestionTypeIcon(questionResponse.questionType)}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-sm font-medium text-gray-700">
                                Pregunta {questionResponse.slideIndex + 1}
                              </p>
                              <Chip size="sm" variant="flat" color="default">
                                {questionResponse.questionType}
                              </Chip>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-900">
                                {questionResponse.answer || "Sin respuesta"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Datos de tiempo por slide */}
                  {response.slideTimeData.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Tiempo por slide:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {response.slideTimeData.map((slideData, sIndex) => (
                          <div
                            key={`${slideData.slideIndex}-${sIndex}`}
                            className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Slide {slideData.slideIndex + 1}
                              </span>
                              <span className="text-sm text-gray-600">
                                {formatTime(slideData.totalTimeSeconds)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Visitas: {slideData.visitCount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay respuestas disponibles
            </h3>
            <p className="text-gray-500">
              Los entrevistados aún no han completado los formularios.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsesSection;
