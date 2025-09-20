import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import IntervieweeNavbar from "@/common/interviewee-navbar";
import IntervieweeLayout from "@/layouts/interviewee.layout";
import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";
import Link from "next/link";
import { useRouter } from "next/router";
import apiConnection from "@/pages/api/api";
import { Calendar, Clock, FileText, Play, CheckCircle } from "lucide-react";

// Interface for Interview data
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
    duration?: number;
  };
  totalInterviewTimeSeconds?: number;
  completedAt?: string;
  startedAt?: string;
}

const IntervieweeHome = () => {
  const { authenticated, interviewee, checkAuth } = useIntervieweeAuthContext();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Component is already protected by IntervieweeAuthGuard

  // Load assigned interviews for the current interviewee
  const loadInterviews = async () => {
    console.log("loadInterviews");
    if (!authenticated || !interviewee) return;

    try {
      setLoading(true);
      setError(null);

      // Get interviews where the current interviewee is assigned
      const response = await apiConnection.get("/interviews/interviewee/filtered");
      console.log("response: ", response);
      console.log("interviewee: ", interviewee);

      // Filter interviews to only show those assigned to current interviewee
      const allInterviews = response.data || [];
      const myInterviews = allInterviews.filter((interview: any) =>
        interview.interviewees &&
        interview.interviewees.includes(interviewee._id)
      );

      setInterviews(myInterviews);
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
    return interview.status === 'NOT_STARTED' || interview.status === 'IN_PROGRESS';
  };

  // Authentication is handled by IntervieweeAuthGuard

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <IntervieweeNavbar links={[{ label: "Mis Entrevistas", href: "/interviewee" }]} />
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
    <IntervieweeLayout title="Mis Entrevistas" description="Portal de entrevistas para candidatos">
      <IntervieweeNavbar links={[{ label: "Mis Entrevistas", href: "/interviewee" }]} />

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Entrevistas
          </h1>
          <p className="text-gray-600">
            Aquí puedes ver y acceder a todas las entrevistas que tienes asignadas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total</p>
                  <p className="text-2xl font-bold">{interviews.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {interviews.filter(i => i.status === 'NOT_STARTED').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">En Progreso</p>
                  <p className="text-2xl font-bold">
                    {interviews.filter(i => i.status === 'IN_PROGRESS').length}
                  </p>
                </div>
                <Play className="w-8 h-8 text-blue-200" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Completadas</p>
                  <p className="text-2xl font-bold">
                    {interviews.filter(i => i.status === 'CLOSED').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Interviews List */}
        {interviews.length === 0 ? (
          <Card className="p-8">
            <CardBody className="text-center">
              <div className="mb-4">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No tienes entrevistas asignadas
                </h3>
                <p className="text-gray-500">
                  Cuando se te asignen entrevistas, aparecerán aquí para que puedas acceder a ellas.
                </p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-6">
            {interviews.map((interview) => {
              const statusConfig = getStatusConfig(interview.status);

              return (
                <Card key={interview._id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {interview.title}
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

                        {interview.position && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Posición:</strong> {interview.position}
                          </p>
                        )}

                        {interview.description && (
                          <p className="text-gray-600 mb-4">
                            {interview.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Date and Time */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{formatDate(interview.scheduledAt)}</p>
                          <p>{formatTime(interview.scheduledAt)}</p>
                        </div>
                      </div>

                      {/* Survey Info */}
                      {interview.surveyId && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <div>
                            <p className="font-medium">Evaluación</p>
                            <p>{interview.surveyId.name || interview.surveyId.title}</p>
                          </div>
                        </div>
                      )}

                      {/* Duration */}
                      {interview.surveyId?.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <div>
                            <p className="font-medium">Duración estimada</p>
                            <p>{interview.surveyId.duration} minutos</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {canStartInterview(interview) ? (
                        <Link href={`/survey/${interview.surveyId._id}`}>
                          <Button
                            color="primary"
                            variant="solid"
                            startContent={<Play className="w-4 h-4" />}
                            className="font-medium"
                          >
                            {interview.status === 'IN_PROGRESS' ? 'Continuar Entrevista' : 'Iniciar Entrevista'}
                          </Button>
                        </Link>
                      ) : interview.status === 'CLOSED' ? (
                        <Button
                          color="success"
                          variant="flat"
                          startContent={<CheckCircle className="w-4 h-4" />}
                          disabled
                        >
                          Entrevista Completada
                        </Button>
                      ) : (
                        <Button
                          color="default"
                          variant="flat"
                          disabled
                        >
                          No Disponible
                        </Button>
                      )}

                      <Link href={`/interviewee/interview/${interview._id}`}>
                        <Button
                          color="default"
                          variant="bordered"
                          startContent={<FileText className="w-4 h-4" />}
                        >
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>

                    {/* Completion Info */}
                    {interview.status === 'CLOSED' && interview.completedAt && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Completada el {formatDate(interview.completedAt)} a las {formatTime(interview.completedAt)}
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

export default IntervieweeHome;
