import React, { useEffect, useState } from "react";
import Link from "next/link";
import ArrowLeft from "@/public/icons/arrowleft";
import { Chip, Tabs, Tab } from "@heroui/react";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";
import { useRouter } from "next/router";
import BasicInfo from "./components/BasicInfo";
import ProfessionalsSection from "./components/ProfessionalsSection";
import IntervieweesSection from "./components/IntervieweesSection";
import ResponsesSection from "./components/ResponsesSection";
import ReportsSection from "./components/ReportsSection";

interface InterviewData {
  _id: string;
  title: string;
  description: string;
  position: string;
  positionDescription?: string;
  scheduledAt: string;
  status: string;
  survey?: {
    _id: string;
    title: string;
    description?: string;
  };
  surveyId?: {
    _id: string;
    title: string;
    description?: string;
  };
  professionals?: Array<{
    _id: string;
    fullname: string;
    email: string;
    phoneNumber?: string;
    speciality?: string;
    roles?: string[];
    teamId?: string;
  }>;
  interviewees?: Array<{
    _id: string;
    personalInfo?: {
      firstName: string;
      lastName: string;
    };
    email: string;
    status?: string;
    completedAt?: string;
    startedAt?: string;
  }>;
}

const ViewInterviewPage = ({ id }: { id?: string }) => {
  const [data, setData] = useState<InterviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("general");
  const router = useRouter();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const { data: interviewData } = await apiConnection.get(`/interviews/${id}`);
        setData(interviewData);
      } catch (err) {
        console.error("Error loading interview", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "default";
      case "IN_PROGRESS":
        return "warning";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "No iniciada";
      case "IN_PROGRESS":
        return "En progreso";
      case "COMPLETED":
        return "Completada";
      case "CANCELLED":
        return "Cancelada";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <AuthLayout links={[]}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AuthLayout>
    );
  }

  if (!data) {
    return (
      <AuthLayout links={[]}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Entrevista no encontrada
            </h2>
            <p className="text-gray-600 mb-4">
              La entrevista que buscas no existe o no tienes permisos para verla.
            </p>
            <Link href="/interviews/table">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Volver a la lista
              </button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout links={[]}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/interviews/table">
              <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
                <ArrowLeft />
                Volver a la lista
              </button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                <p className="text-gray-600 mt-1">Detalles completos de la entrevista</p>
              </div>
              <div className="flex items-center gap-3">
                <Chip color={getStatusColor(data.status)} variant="flat">
                  {getStatusText(data.status)}
                </Chip>
                <Link href={`/interviews/information/${data._id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Editar
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-6">
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              color="primary"
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-primary"
              }}
            >
              <Tab key="general" title="Información General" />
              <Tab key="participants" title="Participantes" />
              <Tab key="responses" title="Respuestas" />
              <Tab key="reports" title="Informes" />
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {selectedTab === "general" && (
              <BasicInfo
                title={data.title}
                description={data.description}
                position={data.position}
                positionDescription={data.positionDescription}
                scheduledAt={data.scheduledAt}
                status={data.status}
                survey={data.surveyId || data.survey}
              />
            )}

            {selectedTab === "participants" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProfessionalsSection professionals={data.professionals || []} />
                <IntervieweesSection interviewees={data.interviewees || []} />
              </div>
            )}

            {selectedTab === "responses" && (
              <ResponsesSection interviewId={data._id} />
            )}

            {selectedTab === "reports" && (
              <ReportsSection
                interviewId={data._id}
                interviewPosition={data.position}
                interviewScheduledAt={data.scheduledAt}
                intervieweeNames={
                  data.interviewees
                    ?.map((ie) =>
                      ie.personalInfo
                        ? `${ie.personalInfo.firstName} ${ie.personalInfo.lastName}`.trim()
                        : "",
                    )
                    .filter(Boolean) ?? []
                }
                professionalNames={
                  data.professionals?.map((p) => p.fullname).filter(Boolean) ??
                  []
                }
              />
            )}
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ViewInterviewPage;
