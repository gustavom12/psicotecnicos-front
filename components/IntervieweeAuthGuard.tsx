import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useIntervieweeAuthContext } from "@/contexts/interviewee-auth.context";
import IntervieweeLayout from "@/layouts/interviewee.layout";

interface IntervieweeAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const IntervieweeAuthGuard: React.FC<IntervieweeAuthGuardProps> = ({
  children,
  fallback,
}) => {
  const { authenticated, checkAuth } = useIntervieweeAuthContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!loading && !authenticated) {
      // Redirect to login if not authenticated
      router.push("/interviewee/login");
    }
  }, [loading, authenticated, router]);

  if (loading) {
    return (
      fallback || (
        <IntervieweeLayout title="Cargando..." description="Verificando autenticación">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-gray-600">Verificando acceso...</span>
            </div>
          </div>
        </IntervieweeLayout>
      )
    );
  }

  if (!authenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default IntervieweeAuthGuard;

