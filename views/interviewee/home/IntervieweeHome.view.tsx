import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
} from "@heroui/react";
import IntervieweeNavbar from "@/common/interviewee-navbar";
import IntervieweeLayout from "@/layouts/interviewee.layout";
import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";
import Link from "next/link";
import { useRouter } from "next/router";
import apiConnection from "@/pages/api/api";
import {
  Calendar,
  Clock,
  FileText,
  Play,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Users,
  Target,
  Mail,
  Phone,
  User,
} from "lucide-react";

// Interface for Module data
interface Module {
  _id: string;
  order: number;
  id: string;
  name?: string;
  category?: string;
  description?: string;
  progress?: number;
  status?: "DRAFT" | "NOT_STARTED" | "IN_PROGRESS" | "FINISHED";
}

// Interface for Professional data
interface Professional {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
}

// Interface for Interview data
interface Interview {
  _id: string;
  title: string;
  description: string;
  position: string;
  scheduledAt: string;
  status: "DRAFT" | "NOT_STARTED" | "IN_PROGRESS" | "CLOSED";
  professionals?: Professional[];
  surveyId: {
    _id: string;
    name: string;
    title?: string;
    description?: string;
    duration?: number;
    previousEvaluations?: boolean;
    modules?: Module[];
  };
  totalInterviewTimeSeconds?: number;
  completedAt?: string;
  startedAt?: string;
}

const IntervieweeHome = () => {
  const { authenticated, interviewee, checkAuth } = useIntervieweeAuthContext();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [moduleProgress, setModuleProgress] = useState<{
    [key: string]: { completed: boolean; progress: number };
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component is already protected by IntervieweeAuthGuard

  // Load detailed form information for modules
  const loadModuleDetails = async (interviews: Interview[]) => {
    if (!interviews || interviews.length === 0) return interviews;

    try {
      const interviewsWithDetails = await Promise.all(
        interviews.map(async (interview) => {
          if (
            interview.surveyId?.modules &&
            interview.surveyId.modules.length > 0
          ) {
            // Get detailed information for each module/form
            const modulesWithDetails = await Promise.all(
              interview.surveyId.modules.map(async (module) => {
                try {
                  const formResponse = await apiConnection.get(
                    `/forms/${module.id}`,
                  );
                  const formData = formResponse.data;

                  return {
                    ...module,
                    ...formData,
                    name: formData.title || `Módulo ${module.order}`,
                    category: formData.category || "Evaluación",
                    description: formData.category || "Evaluación técnica",
                  };
                } catch (error) {
                  console.error(
                    `Error loading form details for module ${module.id}:`,
                    error,
                  );
                  // Return module with fallback data if form loading fails
                  return {
                    ...module,
                    name: `Módulo ${module.order}`,
                    category: "Evaluación",
                    description: "Evaluación técnica",
                  };
                }
              }),
            );

            return {
              ...interview,
              surveyId: {
                ...interview.surveyId,
                modules: modulesWithDetails,
              },
            };
          }
          return interview;
        }),
      );

      return interviewsWithDetails;
    } catch (error) {
      console.error("Error loading module details:", error);
      return interviews;
    }
  };

  // Load real module progress data from interview responses
  const loadModuleProgress = async (interviews: Interview[]) => {
    if (!interviewee || interviews.length === 0) return;

    try {
      const response = await apiConnection.get(
        `/interview-responses/interviewee/${interviewee._id}`,
      );
      const responses = response.data || [];

      // Create progress map based on real data
      const progressMap: {
        [key: string]: { completed: boolean; progress: number };
      } = {};

      // Initialize all modules as not started
      interviews.forEach((interview: Interview) => {
        if (interview.surveyId?.modules) {
          interview.surveyId.modules.forEach((module: Module) => {
            const moduleKey = `${interview._id}_${module.id}`;
            progressMap[moduleKey] = {
              completed: false,
              progress: 0,
            };
          });
        }
      });

      // Update progress based on actual responses
      responses.forEach((response: any) => {
        if (response.moduleId && response.interviewId) {
          const moduleKey = `${response.interviewId}_${response.moduleId}`;

          // Calculate progress based on response status and completion
          let progress = 0;
          let completed = false;

          if (response.status === "COMPLETED") {
            progress = 100;
            completed = true;
          } else if (response.status === "IN_PROGRESS") {
            // Calculate progress based on responses vs total questions
            const totalQuestions = response.responses?.length || 0;
            const answeredQuestions =
              response.responses?.filter(
                (r: any) => r.answer && r.answer !== "",
              ).length || 0;
            progress =
              totalQuestions > 0
                ? Math.round((answeredQuestions / totalQuestions) * 100)
                : 0;
          }

          progressMap[moduleKey] = {
            completed,
            progress,
          };
        }
      });

      setModuleProgress(progressMap);
    } catch (error) {
      console.error("Error loading module progress:", error);
      // If we can't load progress, initialize with empty progress
      const emptyProgress: {
        [key: string]: { completed: boolean; progress: number };
      } = {};
      interviews.forEach((interview: Interview) => {
        if (interview.surveyId?.modules) {
          interview.surveyId.modules.forEach((module: Module) => {
            const moduleKey = `${interview._id}_${module.id}`;
            emptyProgress[moduleKey] = {
              completed: false,
              progress: 0,
            };
          });
        }
      });
      setModuleProgress(emptyProgress);
    }
  };

  // Load assigned interviews for the current interviewee
  const loadInterviews = async () => {
    if (!authenticated || !interviewee) return;

    try {
      setLoading(true);
      setError(null);

      // Get interviews where the current interviewee is assigned
      const response = await apiConnection.get(
        "/interviews/interviewee/filtered",
      );

      // Filter interviews to only show those assigned to current interviewee
      const allInterviews = response.data || [];
      const myInterviews = allInterviews.filter(
        (interview: any) =>
          interview.interviewees &&
          interview.interviewees.includes(interviewee._id),
      );

      // Debug log to check professional data
      console.log('DEBUG - First interview professionals:', myInterviews[0]?.professionals);

      // Load detailed module information
      const interviewsWithDetails = await loadModuleDetails(myInterviews);
      setInterviews(interviewsWithDetails);

      // Load real module progress data
      await loadModuleProgress(interviewsWithDetails);
    } catch (err: any) {
      console.error("Error loading interviews:", err);
      setError("Error al cargar las entrevistas asignadas");
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated && interviewee) {
      loadInterviews();
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

  const getStatusConfig = (status: string) => {
    const configs = {
      DRAFT: {
        label: "Borrador",
        color: "default" as const,
        icon: <FileText className="w-4 h-4" />,
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
      },
      NOT_STARTED: {
        label: "Pendiente",
        color: "warning" as const,
        icon: <Clock className="w-4 h-4" />,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
      },
      IN_PROGRESS: {
        label: "En progreso",
        color: "primary" as const,
        icon: <Play className="w-4 h-4" />,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
      },
      CLOSED: {
        label: "Completada",
        color: "success" as const,
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      },
    };
    return configs[status] || configs.NOT_STARTED;
  };

  const canStartInterview = (interview: Interview) => {
    return (
      interview.status === "NOT_STARTED" || interview.status === "IN_PROGRESS"
    );
  };

  const getModuleProgress = (module: Module) => {
    return module.status === "FINISHED"
      ? { completed: true, progress: 100 }
      : { completed: false, progress: 0 };
  };

  const getInterviewProgress = (interview: Interview) => {
    if (
      !interview.surveyId?.modules ||
      interview.surveyId.modules.length === 0
    ) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const completed = interview.surveyId.modules.filter(
      (module) => getModuleProgress(module).completed,
    ).length;

    const total = interview.surveyId.modules.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const getModuleStatusConfig = (completed: boolean) => {
    if (completed) {
      return {
        label: "Completado",
        color: "success" as const,
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      };
    } else {
      return {
        label: "Pendiente",
        color: "warning" as const,
        icon: <Clock className="w-4 h-4" />,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
      };
    }
  };

  // Authentication is handled by IntervieweeAuthGuard

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <IntervieweeNavbar
          links={[
            { label: "Mis Entrevistas", href: "/interviewee" },
            { label: "Evaluaciones", href: "/interviewee/evaluations" },
          ]}
        />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Cargando entrevistas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <IntervieweeLayout
      title="Mis Entrevistas"
      description="Portal de entrevistas para candidatos"
    >
      <IntervieweeNavbar
        links={[
          { label: "Mis Entrevistas", href: "/interviewee" },
          { label: "Evaluaciones", href: "/interviewee/evaluations" },
        ]}
      />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Mis formularios de Evaluación
          </h1>
          <p className="text-gray-600">
            Completa los formularios previos a cada entrevista para estar preparado
          </p>
        </div>

        {/* Interviews and Modules List */}
        {interviews.length === 0 ? (
          <Card className="p-8">
            <CardBody className="text-center">
              <div className="mb-4">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No tienes entrevistas asignadas
                </h3>
                <p className="text-gray-500">
                  Cuando se te asignen entrevistas con formularios, aparecerán aquí
                  para que puedas completarlos.
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-8">
            {interviews.map((interview) => {
              const progress = getInterviewProgress(interview);
              const statusConfig = getStatusConfig(interview.status);

              return (
                <div
                  key={interview._id}
                  className="bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  {/* Interview Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Users className="w-6 h-6 text-blue-600" />
                          <h2 className="text-2xl font-bold text-gray-900">
                            {interview.title}
                          </h2>
                          <Chip
                            color={statusConfig.color}
                            variant="flat"
                            startContent={statusConfig.icon}
                            className={`${statusConfig.bgColor} ${statusConfig.textColor}`}
                          >
                            {statusConfig.label}
                          </Chip>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Target className="w-4 h-4" />
                            <span>
                              <strong>Posición:</strong> {interview.position}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              <strong>Fecha:</strong>{" "}
                              {formatDate(interview.scheduledAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              <strong>Hora:</strong>{" "}
                              {formatTime(interview.scheduledAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            <span>
                              <strong>Descripción:</strong> {interview.description || 'No especificada'}
                            </span>
                          </div>
                        </div>

                        {/* Professional Contact Information */}
                        {interview.professionals && interview.professionals.length > 0 && (
                          <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Información de Contacto - Profesionales
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {interview.professionals.map((professional, index) => (
                                <div key={professional._id} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-gray-800">
                                      {professional.fullname || 'Profesional'}
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    {professional.email && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="w-3 h-3" />
                                        <a
                                          href={`mailto:${professional.email}`}
                                          className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                          {professional.email}
                                        </a>
                                      </div>
                                    )}
                                    {professional.phoneNumber && (
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-3 h-3" />
                                        <a
                                          href={`tel:${professional.phoneNumber}`}
                                          className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                          {professional.phoneNumber}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Progress Overview */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Progreso de formularios: {progress.completed}/
                              {progress.total}
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              {progress.percentage}%
                            </span>
                          </div>
                          <Progress
                            value={progress.percentage}
                            className="w-full"
                            color={
                              progress.percentage === 100
                                ? "success"
                                : "primary"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modules List */}
                  <div className="p-6">
                    {interview.surveyId?.modules &&
                    interview.surveyId.modules.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          formularios de Evaluación (
                          {interview.surveyId.modules.length})
                        </h3>

                        <div className="grid gap-4">
                          {interview.surveyId.modules
                            .sort((a, b) => a.order - b.order)
                            .map((module: any, index) => {
                              const moduleProgress = getModuleProgress(module);
                              const moduleStatus = getModuleStatusConfig(
                                module.status === "FINISHED",
                              );

                              return (
                                <div
                                  key={module.id}
                                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${moduleStatus.borderColor} ${moduleStatus.bgColor}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300 font-semibold text-sm">
                                        {module.order || index + 1}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">
                                          {module.name ||
                                            `Módulo ${module.order || index + 1}`}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          {module.category ||
                                            "Evaluación técnica"}
                                        </p>
                                        {module.description &&
                                          module.description !==
                                            module.category && (
                                            <p className="text-xs text-gray-500 mt-1">
                                              {module.description}
                                            </p>
                                          )}
                                        {!moduleProgress.completed &&
                                          moduleProgress.progress > 0 && (
                                            <div className="mt-2">
                                              <Progress
                                                value={moduleProgress.progress}
                                                size="sm"
                                                color="primary"
                                                className="w-full max-w-xs"
                                              />
                                              <span className="text-xs text-gray-500">
                                                {moduleProgress.progress}%
                                                completado
                                              </span>
                                            </div>
                                          )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <Chip
                                        color={moduleStatus.color}
                                        variant="flat"
                                        startContent={moduleStatus.icon}
                                        size="sm"
                                        className={moduleStatus.textColor}
                                      >
                                        {moduleStatus.label}
                                      </Chip>

                                      {!moduleProgress.completed ? (
                                        <Link
                                          href={`/survey/${interview.surveyId._id}?moduleId=${module.id}`}
                                        >
                                          <Button
                                            color="primary"
                                            variant="solid"
                                            size="sm"
                                            startContent={
                                              moduleProgress.progress > 0 ? (
                                                <Play className="w-4 h-4" />
                                              ) : (
                                                <ArrowRight className="w-4 h-4" />
                                              )
                                            }
                                          >
                                            {moduleProgress.progress > 0
                                              ? "Continuar"
                                              : "Iniciar"}
                                          </Button>
                                        </Link>
                                      ) : (
                                        <Button
                                          color="success"
                                          variant="flat"
                                          size="sm"
                                          startContent={
                                            <CheckCircle className="w-4 h-4" />
                                          }
                                          disabled
                                        >
                                          Completado
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        {/* Interview Action */}
                        {/* <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-green-800">
                                Entrevista Principal
                              </h4>
                              <p className="text-sm text-green-700">
                                {progress.percentage === 100
                                  ? "¡Todos los formularios completados! Listo para la entrevista."
                                  : `Completa ${progress.total - progress.completed} formularios más para acceder a la entrevista.`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {progress.percentage === 100 &&
                                canStartInterview(interview) && (
                                  <Link
                                    href={`/survey/${interview.surveyId._id}`}
                                  >
                                    <Button
                                      color="success"
                                      variant="solid"
                                      startContent={
                                        <Play className="w-4 h-4" />
                                      }
                                    >
                                      Iniciar Entrevista
                                    </Button>
                                  </Link>
                                )}
                              <Link
                                href={`/interviewee/interview/${interview._id}`}
                              >
                                <Button
                                  color="default"
                                  variant="bordered"
                                  startContent={
                                    <FileText className="w-4 h-4" />
                                  }
                                >
                                  Ver Detalles
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Esta entrevista no tiene formularios previos configurados.
                        </p>
                        {/* <Link href={`/survey/${interview.surveyId._id}`}>
                          <Button
                            color="primary"
                            variant="solid"
                            className="mt-4"
                            startContent={<Play className="w-4 h-4" />}
                          >
                            Ir Directamente a la Entrevista
                          </Button>
                        </Link> */}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </IntervieweeLayout>
  );
};

export default IntervieweeHome;
