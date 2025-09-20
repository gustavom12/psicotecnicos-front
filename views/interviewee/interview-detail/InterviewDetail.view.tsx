import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import IntervieweeNavbar from "@/common/interviewee-navbar";
import IntervieweeLayout from "@/layouts/interviewee.layout";
import Link from "next/link";
import { useRouter } from "next/router";
import apiConnection from "@/pages/api/api";
import {
  Calendar,
  Clock,
  FileText,
  Play,
  CheckCircle,
  ArrowLeft,
  User,
  Building,
  MapPin
} from "lucide-react";

interface InterviewDetailProps {
  interviewId: string;
}

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
  };
  professionals?: Array<{
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  }>;
  totalInterviewTimeSeconds?: number;
  completedAt?: string;
  startedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const IntervieweeInterviewDetail: React.FC<InterviewDetailProps> = ({ interviewId }) => {
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInterview = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with actual endpoint for getting interview details for interviewee
      const response = await apiConnection.get(`/interviews/${interviewId}`);

      setInterview(response.data);
    } catch (err: any) {
      console.error("Error loading interview:", err);
      setError("Error al cargar los detalles de la entrevista");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

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

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES");
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

  if (loading) {
    return (
      <IntervieweeLayout title="Detalles de Entrevista" description="Información detallada de la entrevista">
        <IntervieweeNavbar links={[
          { label: "Mis Entrevistas", href: "/interviewee" },
          { label: "Detalles", href: "#" }
        ]} />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Cargando detalles...</span>
          </div>
        </div>
      </IntervieweeLayout>
    );
  }

  if (error || !interview) {
    return (
      <IntervieweeLayout title="Error" description="Error al cargar la entrevista">
        <IntervieweeNavbar links={[
          { label: "Mis Entrevistas", href: "/interviewee" },
          { label: "Detalles", href: "#" }
        ]} />
        <div className="container mx-auto px-6 py-8">
          <Card className="p-8">
            <CardBody className="text-center">
              <div className="text-red-500 mb-4">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Error al cargar la entrevista
                </h3>
                <p className="text-gray-600 mb-4">
                  {error || "No se pudo encontrar la entrevista solicitada"}
                </p>
                <Link href="/interviewee">
                  <Button color="primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver a Mis Entrevistas
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </IntervieweeLayout>
    );
  }

  const statusConfig = getStatusConfig(interview.status);

  return (
    <IntervieweeLayout title={interview.title} description={`Detalles de la entrevista: ${interview.title}`}>
        <IntervieweeNavbar links={[
        { label: "Mis Entrevistas", href: "/interviewee" },
        { label: interview.title, href: "#" }
      ]} />

      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/interviewee">
            <Button
              variant="light"
              startContent={<ArrowLeft className="w-4 h-4" />}
              className="text-gray-600 hover:text-gray-900"
            >
              Volver a Mis Entrevistas
            </Button>
          </Link>
        </div>

        {/* Header Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start w-full">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {interview.title}
                  </h1>
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
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Building className="w-4 h-4" />
                    <span className="font-medium">Posición: {interview.position}</span>
                  </div>
                )}

                {interview.description && (
                  <p className="text-gray-600">
                    {interview.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardBody className="pt-0">
            {/* Action Buttons */}
            <div className="flex gap-3">
              {canStartInterview(interview) ? (
                <Link href={`/survey/${interview.surveyId._id}`}>
                  <Button
                    color="primary"
                    size="lg"
                    startContent={<Play className="w-5 h-5" />}
                    className="font-medium"
                  >
                    {interview.status === 'IN_PROGRESS' ? 'Continuar Entrevista' : 'Iniciar Entrevista'}
                  </Button>
                </Link>
              ) : interview.status === 'CLOSED' ? (
                <Button
                  color="success"
                  size="lg"
                  variant="flat"
                  startContent={<CheckCircle className="w-5 h-5" />}
                  disabled
                >
                  Entrevista Completada
                </Button>
              ) : (
                <Button
                  color="default"
                  size="lg"
                  variant="flat"
                  disabled
                >
                  No Disponible
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Schedule Information */}
          <Card className="shadow-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Información de Programación
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha programada
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDate(interview.scheduledAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Hora programada
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatTime(interview.scheduledAt)}
                  </p>
                </div>

                {interview.startedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Iniciada el
                    </label>
                    <p className="text-gray-900 font-medium">
                      {formatDateTime(interview.startedAt)}
                    </p>
                  </div>
                )}

                {interview.completedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Completada el
                    </label>
                    <p className="text-gray-900 font-medium">
                      {formatDateTime(interview.completedAt)}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Survey Information */}
          <Card className="shadow-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información de la Evaluación
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nombre de la evaluación
                  </label>
                  <p className="text-gray-900 font-medium">
                    {interview.surveyId.name || interview.surveyId.title}
                  </p>
                </div>

                {interview.surveyId.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Descripción
                    </label>
                    <p className="text-gray-600">
                      {interview.surveyId.description}
                    </p>
                  </div>
                )}

                {interview.surveyId.duration && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Duración estimada
                    </label>
                    <p className="text-gray-900 font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {interview.surveyId.duration} minutos
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Professional Information */}
          {interview.professionals && interview.professionals.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profesionales Asignados
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {interview.professionals.map((professional, index) => (
                    <div key={professional._id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {professional.firstName && professional.lastName
                            ? `${professional.firstName} ${professional.lastName}`
                            : professional.email
                          }
                        </p>
                        <p className="text-sm text-gray-500">{professional.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="shadow-md">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información Adicional
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Fecha de creación
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDateTime(interview.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Última actualización
                  </label>
                  <p className="text-gray-900 font-medium">
                    {formatDateTime(interview.updatedAt)}
                  </p>
                </div>

                {interview.totalInterviewTimeSeconds && interview.totalInterviewTimeSeconds > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tiempo total de entrevista
                    </label>
                    <p className="text-gray-900 font-medium">
                      {Math.floor(interview.totalInterviewTimeSeconds / 60)} minutos
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Status-specific Information */}
        {interview.status === 'CLOSED' && interview.completedAt && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardBody className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ¡Entrevista Completada!
              </h3>
              <p className="text-green-700">
                Has completado exitosamente esta entrevista el {formatDate(interview.completedAt)} a las {formatTime(interview.completedAt)}.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </IntervieweeLayout>
  );
};

export default IntervieweeInterviewDetail;
