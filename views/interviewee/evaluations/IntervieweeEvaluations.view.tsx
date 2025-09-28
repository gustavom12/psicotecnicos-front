import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import IntervieweeNavbar from "@/common/interviewee-navbar";
import IntervieweeLayout from "@/layouts/interviewee.layout";
import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";
import Link from "next/link";
import { useRouter } from "next/router";
import apiConnection from "@/pages/api/api";
import { Calendar, Clock, FileText, Play, CheckCircle, BookOpen } from "lucide-react";

// Interface for Interview data with surveys
interface Interview {
  _id: string;
  title: string;
  description: string;
  position: string;
  scheduledAt: string;
  status: 'DRAFT' | 'NOT_STARTED' | 'IN_PROGRESS' | 'CLOSED';
  surveyId: {
    _id: string;
    name: string;
    title?: string;
    description?: string;
    duration?: number;
    previousEvaluations?: boolean;
    modules?: Array<{
      _id: string;
      name: string;
    }>;
  };
  totalInterviewTimeSeconds?: number;
  completedAt?: string;
  startedAt?: string;
}

// Interface for evaluation status
interface EvaluationStatus {
  surveyId: string;
  completed: boolean;
  completedAt?: string;
  progress?: number;
}

const IntervieweeEvaluations = () => {
  const { authenticated, interviewee } = useIntervieweeAuthContext();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [evaluationStatuses, setEvaluationStatuses] = useState<EvaluationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real evaluation statuses from interview responses
  const loadEvaluationStatuses = async (interviews: Interview[]) => {
    if (!interviewee || interviews.length === 0) return;

    try {
      // Get all responses for this interviewee
      const response = await apiConnection.get(`/interview-responses/interviewee/${interviewee._id}`);
      const responses = response.data || [];

      console.log('Loaded interview responses for evaluations:', responses);

      // Create evaluation statuses based on real data
      const statuses: EvaluationStatus[] = interviews.map((interview: Interview) => {
        // Find response for this survey
        const surveyResponse = responses.find((r: any) =>
          r.surveyId === interview.surveyId._id ||
          r.surveyId._id === interview.surveyId._id
        );

        if (surveyResponse) {
          return {
            surveyId: interview.surveyId._id,
            completed: surveyResponse.status === 'COMPLETED',
            completedAt: surveyResponse.completedAt,
            progress: surveyResponse.status === 'COMPLETED' ? 100 :
                     surveyResponse.status === 'IN_PROGRESS' ?
                     Math.round((surveyResponse.responses?.length || 0) * 10) : 0 // Rough progress estimation
          };
        } else {
          // No response found, evaluation not started
          return {
            surveyId: interview.surveyId._id,
            completed: false,
            completedAt: undefined,
            progress: 0
          };
        }
      });

      setEvaluationStatuses(statuses);
      console.log('Evaluation statuses updated:', statuses);

    } catch (error) {
      console.error('Error loading evaluation statuses:', error);
      // If we can't load statuses, initialize with empty statuses
      const emptyStatuses: EvaluationStatus[] = interviews.map((interview: Interview) => ({
        surveyId: interview.surveyId._id,
        completed: false,
        completedAt: undefined,
        progress: 0
      }));
      setEvaluationStatuses(emptyStatuses);
    }
  };

  // Load assigned interviews and evaluation statuses
  const loadInterviewsAndEvaluations = async () => {
    if (!authenticated || !interviewee) return;

    try {
      setLoading(true);
      setError(null);

      // Get interviews where the current interviewee is assigned
      const response = await apiConnection.get("/interviews/interviewee/filtered");
      console.log("interviews response: ", response);

      // Filter interviews to only show those assigned to current interviewee
      const allInterviews = response.data || [];
      const myInterviews = allInterviews.filter((interview: any) =>
        interview.interviewees &&
        interview.interviewees.includes(interviewee._id)
      );

      setInterviews(myInterviews);

      // TODO: Load evaluation completion status for each survey
      // For now, we'll mock this data
      // Load real evaluation statuses from interview responses
      await loadEvaluationStatuses(myInterviews);
    } catch (err: any) {
      console.error("Error loading interviews and evaluations:", err);
      setError("Error al cargar las entrevistas y evaluaciones");
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && interviewee) {
      loadInterviewsAndEvaluations();
    }
  }, [authenticated, interviewee]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no programada";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "--:--";
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getEvaluationStatus = (surveyId: string) => {
    return evaluationStatuses.find(status => status.surveyId === surveyId);
  };

  const getStatusConfig = (completed: boolean) => {
    if (completed) {
      return {
        label: "Completada",
        color: "success" as const,
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      };
    } else {
      return {
        label: "Pendiente",
        color: "warning" as const,
        icon: <Clock className="w-4 h-4" />,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <IntervieweeNavbar links={[
          { label: "Mis Entrevistas", href: "/interviewee" },
          { label: "Evaluaciones", href: "/interviewee/evaluations" }
        ]} />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Cargando evaluaciones...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <IntervieweeLayout title="Mis Evaluaciones" description="Evaluaciones previas para entrevistas">
      <IntervieweeNavbar links={[
        { label: "Mis Entrevistas", href: "/interviewee" },
        { label: "Evaluaciones", href: "/interviewee/evaluations" }
      ]} />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Mis Evaluaciones Previas
          </h1>
          <p className="text-gray-600">
            Completa las evaluaciones requeridas antes de tus entrevistas programadas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Evaluaciones</p>
                  <p className="text-2xl font-bold">{interviews.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {evaluationStatuses.filter(s => !s.completed).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completadas</p>
                  <p className="text-2xl font-bold">
                    {evaluationStatuses.filter(s => s.completed).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Evaluations List */}
        {interviews.length === 0 ? (
          <Card className="p-8">
            <CardBody className="text-center">
              <div className="mb-4">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No tienes evaluaciones asignadas
                </h3>
                <p className="text-gray-500">
                  Cuando tengas entrevistas programadas con evaluaciones previas, aparecerán aquí.
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-6">
            {interviews.map((interview) => {
              const evaluationStatus = getEvaluationStatus(interview.surveyId._id);
              const statusConfig = getStatusConfig(evaluationStatus?.completed || false);

              return (
                <Card key={interview._id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {interview.surveyId.name || interview.surveyId.title || 'Evaluación'}
                          </h3>
                          <Chip
                            color={statusConfig.color}
                            variant="flat"
                            startContent={statusConfig.icon}
                            className={`${statusConfig.bgColor} ${statusConfig.textColor}`}
                          >
                            {statusConfig.label}
                          </Chip>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Para la entrevista:</strong> {interview.title}
                        </p>

                        {interview.position && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Posición:</strong> {interview.position}
                          </p>
                        )}

                        {interview.surveyId.description && (
                          <p className="text-gray-600 mb-4">
                            {interview.surveyId.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Interview Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="font-medium">Entrevista programada</p>
                          <p>{formatDate(interview.scheduledAt)}</p>
                          <p>{formatTime(interview.scheduledAt)}</p>
                        </div>
                      </div>

                      {/* Duration */}
                      {interview.surveyId.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <div>
                            <p className="font-medium">Duración estimada</p>
                            <p>{interview.surveyId.duration} minutos</p>
                          </div>
                        </div>
                      )}

                      {/* Progress */}
                      {evaluationStatus && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <div>
                            <p className="font-medium">Progreso</p>
                            <p>{evaluationStatus.completed ? '100%' : `${evaluationStatus.progress}%`}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {evaluationStatus?.completed ? (
                        <Button
                          color="success"
                          variant="flat"
                          startContent={<CheckCircle className="w-4 h-4" />}
                          disabled
                        >
                          Evaluación Completada
                        </Button>
                      ) : (
                        <Link href={`/survey/${interview.surveyId._id}`}>
                          <Button
                            color="primary"
                            variant="solid"
                            startContent={<Play className="w-4 h-4" />}
                            className="font-medium"
                          >
                            {evaluationStatus?.progress && evaluationStatus.progress > 0
                              ? 'Continuar Evaluación'
                              : 'Iniciar Evaluación'}
                          </Button>
                        </Link>
                      )}

                      <Link href={`/interviewee/interview/${interview._id}`}>
                        <Button
                          color="default"
                          variant="bordered"
                          startContent={<FileText className="w-4 h-4" />}
                        >
                          Ver Entrevista
                        </Button>
                      </Link>
                    </div>

                    {/* Completion Info */}
                    {evaluationStatus?.completed && evaluationStatus.completedAt && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Completada el {formatDate(evaluationStatus.completedAt)} a las {formatTime(evaluationStatus.completedAt)}
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </IntervieweeLayout>
  );
};

export default IntervieweeEvaluations;
