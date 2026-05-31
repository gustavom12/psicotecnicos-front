import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";

interface Interviewee {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
  };
  email: string;
  companyName?: string;
  status: string;
  invitationInfo?: {
    expiresAt: Date;
    acceptedAt?: Date;
  };
}

const AcceptInvitation = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [interviewee, setInterviewee] = useState<Interviewee | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      setLoading(true);
      setError("");

      // Intentar obtener información de la invitación
      const response = await apiConnection.get(
        `/interviewees/accept-invitation/${token}`,
      );
      setInterviewee(response.data);
    } catch (error: any) {
      console.error("Error validating token:", error);
      if (error?.response?.status === 400) {
        setError("Token de invitación inválido o expirado");
      } else {
        setError("Error al validar la invitación");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!token) return;

    try {
      setAccepting(true);
      await apiConnection.get(`/interviewees/accept-invitation/${token}`);

      Notification("¡Invitación aceptada exitosamente!", "success");

      // Redirigir a la página de entrevista o dashboard
      setTimeout(() => {
        router.push("/interview/start"); // Ajustar según la ruta de entrevistas
      }, 2000);
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      const errorMessage =
        error?.response?.data?.message || "Error al aceptar la invitación";
      Notification(errorMessage, "error");
      setError(errorMessage);
    } finally {
      setAccepting(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#635BFF] mx-auto mb-4" />
          <p className="text-gray-600">Validando invitación...</p>
        </div>
      </div>
    );
  }

  if (error && !interviewee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-full">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invitación Inválida
              </h1>
            </div>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-gray-600 mb-6">{error}</p>
            <p className="text-sm text-gray-500">
              Si crees que esto es un error, contacta al administrador del
              sistema.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!interviewee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const isExpired =
    interviewee.invitationInfo?.expiresAt &&
    new Date(interviewee.invitationInfo.expiresAt) < new Date();
  const isAlreadyAccepted = interviewee.invitationInfo?.acceptedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center bg-[#635BFF] text-white rounded-t-lg">
          <div className="w-full py-6">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-3xl font-bold">
              Invitación para Entrevista Psicotécnica
            </h1>
            <p className="text-blue-100 mt-2">
              {interviewee.companyName && `${interviewee.companyName}`}
            </p>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Hola {interviewee.personalInfo.firstName}{" "}
              {interviewee.personalInfo.lastName}
            </h2>
            <p className="text-gray-600">
              Has sido invitado/a a participar en una entrevista psicotécnica.
            </p>
          </div>

          {isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Invitación Expirada
              </h3>
              <p className="text-red-600 mb-4">
                Esta invitación expiró el{" "}
                {formatDate(interviewee.invitationInfo!.expiresAt)}
              </p>
              <p className="text-sm text-red-500">
                Por favor, contacta al administrador para solicitar una nueva
                invitación.
              </p>
            </div>
          ) : isAlreadyAccepted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Invitación Ya Aceptada
              </h3>
              <p className="text-green-600 mb-4">
                Ya has aceptado esta invitación el{" "}
                {formatDate(interviewee.invitationInfo!.acceptedAt!)}
              </p>
              <Button
                color="primary"
                className="bg-[#635BFF]"
                onClick={() => router.push("/interview/start")}
              >
                Continuar con la Entrevista
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Información de la Invitación
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{interviewee.email}</span>
                  </div>
                  {interviewee.companyName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Empresa:</span>
                      <span className="font-medium">
                        {interviewee.companyName}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expira:</span>
                    <span className="font-medium text-orange-600">
                      {formatDate(interviewee.invitationInfo!.expiresAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">⚠️</div>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">
                      Importante
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Al aceptar esta invitación, podrás acceder al proceso de
                      entrevista psicotécnica. Asegúrate de tener tiempo
                      suficiente para completar el proceso.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  color="primary"
                  size="lg"
                  className="bg-[#635BFF] px-8"
                  onClick={handleAcceptInvitation}
                  isLoading={accepting}
                  disabled={accepting}
                >
                  {accepting ? "Aceptando..." : "Aceptar Invitación"}
                </Button>

                <Button
                  variant="bordered"
                  size="lg"
                  onClick={() => router.push("/")}
                  disabled={accepting}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Si tienes alguna pregunta o problema técnico, contacta al
              administrador del sistema.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AcceptInvitation;
