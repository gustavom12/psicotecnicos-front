import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardBody, Spinner, Button } from "@heroui/react";
import {
  Survey,
  Form,
  Slide,
  InterviewResponse,
  InterviewSubmission,
  FieldType,
  Module,
} from "../../../types/survey.types";
import SlideView from "./components/SlideView";
import apiConnection from "../../../pages/api/api";
import { useTimeTracker } from "./hooks/useTimeTracker";
import { useIntervieweeAuthContext } from "../../../contexts/interviewee-auth.context";
import { Notification } from "../../../common/notification";

interface SurveyViewProps {
  surveyId: string;
  intervieweeId?: string;
  interviewId?: string;
}

export default function SurveyView({
  surveyId,
  intervieweeId,
  interviewId,
}: SurveyViewProps) {
  const router = useRouter();
  const moduleId = router.query.moduleId as string | undefined;
  const { interviewee } = useIntervieweeAuthContext();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(
    interviewId || null,
  );

  // Obtener todos los slides ordenados por módulo y luego por slide index
  const allSlides: (Slide & { formId: string; moduleOrder: number })[] =
    (() => {
      if (!survey?.modules) return [];

      // Crear un mapa de formId a moduleOrder para mantener el orden
      const moduleOrderMap = new Map<string, number>();
      survey.modules.forEach((module) => {
        moduleOrderMap.set(module.id, module.order);
      });

      // Obtener slides con información de módulo y ordenar correctamente
      return forms
        .map((form) => ({
          form,
          moduleOrder: moduleOrderMap.get(form?._id) || 0,
        }))
        .sort((a, b) => a.moduleOrder - b.moduleOrder) // Primero ordenar por módulo
        .flatMap(({ form, moduleOrder }) =>
          form.slides
            .sort((a, b) => a.index - b.index) // Luego ordenar slides dentro del módulo
            .map((slide) => ({
              ...slide,
              formId: form._id,
              moduleOrder,
            })),
        );
    })();

  const currentSlide = allSlides[currentSlideIndex];

  // Hook para seguimiento de tiempo
  const {
    slideTimeData,
    totalInterviewTime,
    interviewStartTime,
    finishInterview,
    formatTime,
    getCurrentSlideStats,
  } = useTimeTracker({
    currentSlideIndex,
    currentFormId: currentSlide?.formId || "",
    totalSlides: allSlides.length,
  });

  useEffect(() => {
    // Sin isReady, moduleId todavía no está disponible y se cargaría el survey
    // completo en lugar del módulo pedido.
    if (!router.isReady) return;
    fetchSurveyData();
  }, [surveyId, moduleId, router.isReady]);

  // La sesión del entrevistado puede resolverse después del primer render, y
  // sin ella la búsqueda de la entrevista queda sin hacer.
  useEffect(() => {
    if (!currentInterviewId && interviewee?._id) {
      resolveInterviewId();
    }
  }, [interviewee?._id]);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);

      // Fetch survey
      const surveyResponse = await apiConnection.get(`/surveys/${surveyId}`);
      const surveyData = surveyResponse.data;
      console.log("Survey data loaded:", surveyData);
      setSurvey(surveyData);

      // Fetch forms from modules or forms array
      let formIds: string[] = [];

      if (surveyData.modules && surveyData.modules.length > 0) {
        // Si tiene modules, usar los IDs de los modules ordenados
        const sortedModules = [...surveyData.modules].sort(
          (a, b) => a.order - b.order,
        );
        formIds = sortedModules.map((module: Module) => module.id);
      } else if (surveyData.forms && surveyData.forms.length > 0) {
        // Fallback: si tiene forms directamente
        formIds = Array.isArray(surveyData.forms)
          ? surveyData.forms
          : [surveyData.forms];
      }

      // Cada módulo se responde y se guarda como una entrega independiente, así
      // que cuando la URL apunta a uno solo se recorren sus slides: si no,
      // se completarían los tres y todo quedaría registrado contra un módulo.
      if (moduleId) {
        const requestedModule = formIds.filter((id) => id === moduleId);
        formIds = requestedModule.length > 0 ? requestedModule : [moduleId];
      }

      if (formIds.length > 0) {
        console.log("Loading forms for IDs:", formIds);
        const formsPromises = formIds.map(
          async (formId: string, index: number) => {
            try {
              const formResponse = await apiConnection.get(`/forms/${formId}`);
              console.log(`Form ${formId} loaded:`, formResponse.data);
              return {
                ...formResponse.data,
                _originalOrder: index, // Mantener el orden original
              };
            } catch (error) {
              console.error(`Error loading form ${formId}:`, error);
              return null;
            }
          },
        );

        const formsData = await Promise.all(formsPromises);
        const validForms = formsData
          .filter((form) => form !== null)
          .sort((a, b) => a._originalOrder - b._originalOrder); // Mantener orden original

        console.log("Valid forms loaded in order:", validForms);
        console.log("Form IDs in order:", formIds);
        setForms(validForms);
      } else {
        console.log("No form IDs found in survey data");
      }

      // Obtener interviewId si no se proporciona
      if (!currentInterviewId && (interviewee?._id || intervieweeId)) {
        await resolveInterviewId();
      }
    } catch (error) {
      console.error("Error fetching survey data:", error);
      // TODO: Show error notification
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resuelve la entrevista a la que pertenece este survey. Sin ella la
   * respuesta se guarda huérfana y el portal del entrevistado nunca la
   * cuenta como completada, así que se reintenta antes de enviar.
   */
  const resolveInterviewId = async (): Promise<string | null> => {
    if (currentInterviewId) return currentInterviewId;

    const actualIntervieweeId = interviewee?._id || intervieweeId;

    if (!actualIntervieweeId || actualIntervieweeId === "anonymous") {
      console.log(
        "No intervieweeId provided or anonymous user, skipping interview lookup",
      );
      return null;
    }

    try {
      // Buscar entrevistas del interviewee que usen este survey
      const response = await apiConnection.get(
        "/interviews/interviewee/filtered",
      );
      const interviews = response.data || [];

      // Encontrar la entrevista que corresponde a este survey. Los ids pueden
      // venir como string o como documento poblado según el endpoint.
      const matchingInterview = interviews.find((interview: any) => {
        const interviewSurveyId = String(
          interview.surveyId?._id ?? interview.surveyId ?? "",
        );
        const belongsToInterviewee = (interview.interviewees || []).some(
          (candidate: any) =>
            String(candidate?._id ?? candidate) === String(actualIntervieweeId),
        );
        return interviewSurveyId === surveyId && belongsToInterviewee;
      });

      if (matchingInterview) {
        setCurrentInterviewId(matchingInterview._id);
        return matchingInterview._id;
      }

      console.log("No matching interview found for survey", surveyId);
      return null;
    } catch (error) {
      console.error("Error fetching interview ID:", error);
      return null;
    }
  };

  const handleResponseChange = (
    questionId: string,
    value: any,
    questionType: FieldType,
  ) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear error when user provides response
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentSlide = (): boolean => {
    if (!currentSlide) return true;

    const interviewerQuestions = currentSlide.interviewer || [];

    // Si no hay preguntas para el entrevistado, no hay nada que validar
    if (interviewerQuestions.length === 0) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};

    interviewerQuestions.forEach((question, index) => {
      const questionId = `${currentSlide.formId}_${currentSlide.index}_${index}`;
      const response = responses[questionId];

      // Un 0 es una respuesta válida, así que no alcanza con evaluar falsy.
      if (response === undefined || response === null || response === "") {
        newErrors[questionId] = "Esta pregunta es requerida";
      }
    });

    setErrors(newErrors);

    const missingIds = Object.keys(newErrors);
    if (missingIds.length > 0) {
      Notification(
        missingIds.length === 1
          ? "Falta responder 1 pregunta de esta pantalla"
          : `Faltan responder ${missingIds.length} preguntas de esta pantalla`,
        "warning",
      );
      document
        .getElementById(missingIds[0])
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentSlide()) return;

    if (currentSlideIndex < allSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Sin entrevista asociada la respuesta queda huérfana y el portal la
      // sigue mostrando como pendiente, así que se corta antes de enviar.
      const resolvedInterviewId = await resolveInterviewId();
      if (!resolvedInterviewId) {
        Notification(
          "No pudimos identificar la entrevista de esta evaluación. Volvé a entrar desde el listado de formularios e intentá de nuevo.",
          "error",
        );
        return;
      }

      // Preparar respuestas para envío
      const interviewResponses: InterviewResponse[] = Object.entries(
        responses,
      ).map(([questionId, answer]) => {
        const [formId, slideIndex, questionIndex] = questionId.split("_");
        const slide = allSlides.find(
          (s) => s.formId === formId && s.index === parseInt(slideIndex),
        );
        const question = slide?.interviewer[parseInt(questionIndex)];

        return {
          questionId,
          slideIndex: parseInt(slideIndex),
          formId,
          answer,
          questionType: question?.type || FieldType.SHORT_TEXT,
        };
      });

      // Finalizar el seguimiento de tiempo
      finishInterview();

      const submission: InterviewSubmission = {
        interviewId: resolvedInterviewId,
        surveyId,
        intervieweeId: interviewee?._id || intervieweeId || "anonymous",
        moduleId, // Obtener moduleId de la URL
        responses: interviewResponses,
        slideTimeData,
        totalInterviewTimeSeconds: totalInterviewTime,
        completedAt: new Date(),
        startedAt: interviewStartTime,
      };

      console.log("Submitting interview response:", submission);

      // Enviar a API usando el endpoint de interview-responses
      await apiConnection.post("/interview-responses", {
        ...submission,
        // El backend y los reportes leen totalTimeSeconds; sin este nombre el
        // tiempo se descarta y siempre queda en 0.
        totalTimeSeconds: totalInterviewTime,
        status: "COMPLETED",
      });

      // Redirect to success page
      router.push("/interviewed/success");
    } catch (error: any) {
      console.error("Error submitting interview:", error);
      Notification(
        error?.response?.data?.message ||
          "No pudimos guardar tus respuestas. Revisá tu conexión e intentá de nuevo.",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!survey || allSlides.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <h2 className="text-xl font-semibold mb-2">Survey no encontrado</h2>
            <p className="text-gray-600 mb-4">
              No se pudo cargar la encuesta o no tiene slides disponibles.
            </p>
            <Button color="primary" onPress={() => router.back()}>
              Volver
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <Spinner size="lg" className="mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Enviando respuestas...
            </h2>
            <p className="text-gray-600">
              Por favor espera mientras procesamos tu entrevista.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header con información del survey */}
      <div className="max-w-4xl mx-auto px-6 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {survey.name}
          </h1>
          {survey.description && (
            <p className="text-gray-600 mb-4">{survey.description}</p>
          )}
          {survey.position && (
            <p className="text-sm text-gray-500">Posición: {survey.position}</p>
          )}
        </div>
      </div>

      {/* Slide actual */}
      {currentSlide && (
        <SlideView
          slide={currentSlide}
          formId={currentSlide.formId}
          responses={responses}
          onResponseChange={handleResponseChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={currentSlideIndex === 0}
          isLast={currentSlideIndex === allSlides.length - 1}
          errors={errors}
          timeStats={getCurrentSlideStats()}
          totalInterviewTime={formatTime(totalInterviewTime)}
          slideNumber={currentSlideIndex + 1}
          totalSlides={allSlides.length}
        />
      )}
    </div>
  );
}
