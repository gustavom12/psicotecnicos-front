import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import SurveyView from "../../views/interviewers-view/survey-view/SurveyView";
import IntervieweeAuthGuard from "@/components/IntervieweeAuthGuard";
import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";

interface SurveyPageProps {
  surveyId: string;
  intervieweeId?: string;
  token?: string;
}

export default function SurveyPage({
  surveyId,
  intervieweeId,
  token,
}: SurveyPageProps) {
  const { authenticated, checkAuth } = useIntervieweeAuthContext();
  const [autoLoginAttempted, setAutoLoginAttempted] = useState(false);
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);

  useEffect(() => {
    // El token del mail ya es la sesión del entrevistado: se guarda y se
    // valida contra /interviewee-auth/check.
    const attemptAutoLogin = async () => {
      if (!token || authenticated || autoLoginAttempted) return;

      setAutoLoginAttempted(true);
      setAutoLoginLoading(true);

      localStorage.setItem("intervieweeAccessToken", token);
      await checkAuth();

      // Saca el token de la URL para que no quede en el historial.
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());

      setAutoLoginLoading(false);
    };

    attemptAutoLogin();
  }, [token, authenticated, autoLoginAttempted, checkAuth]);

  // Show loading while attempting auto-login
  if (token && !authenticated && autoLoginLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Iniciando sesión automáticamente...</p>
        </div>
      </div>
    );
  }

  return (
    <IntervieweeAuthGuard>
      <SurveyView surveyId={surveyId} intervieweeId={intervieweeId} />
    </IntervieweeAuthGuard>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, intervieweeId, token } = context.query;

  if (!id || typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      surveyId: id,
      intervieweeId: intervieweeId || null,
      token: token || null,
    },
  };
};
