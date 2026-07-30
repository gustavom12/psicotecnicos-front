import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import AuthLayout from "@/layouts/auth.layout";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import { Survey, Form, FieldType } from "@/types/survey.types";
import {
  buildSlideSequence,
  answersToResponses,
  responsesToAnswers,
  SequencedSlide,
} from "@/common/interview-slides";
import { useLiveSession, LiveSessionState } from "@/hooks/useLiveSession";
import LiveSlideView, {
  IntervieweePanel,
} from "@/views/interviewers-view/survey-view/components/LiveSlideView";

interface LiveInterviewViewProps {
  interviewId: string;
}

export default function LiveInterviewView({
  interviewId,
}: LiveInterviewViewProps) {
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [slides, setSlides] = useState<SequencedSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [intervieweePanels, setIntervieweePanels] = useState<
    IntervieweePanel[]
  >([]);

  // Nombres de los entrevistados para el panel read-only.
  const nameMapRef = useRef<Map<string, string>>(new Map());
  const slidesRef = useRef<SequencedSlide[]>([]);
  slidesRef.current = slides;
  const answersRef = useRef<Record<string, any>>(answers);
  answersRef.current = answers;
  const indexRef = useRef(currentSlideIndex);
  indexRef.current = currentSlideIndex;

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);

        // Estado de la sesión: nos da surveyId y los módulos en vivo.
        const { data: session } = await apiConnection.get(
          `/interview-sessions/${interviewId}`,
        );
        const surveyId = session?.surveyId;
        const moduleIds: string[] = session?.moduleIds ?? [];

        if (!surveyId || moduleIds.length === 0) {
          setLoading(false);
          return;
        }

        const [{ data: surveyData }, interviewRes] = await Promise.all([
          apiConnection.get(`/surveys/${surveyId}`),
          apiConnection.get(`/interviews/${interviewId}`),
        ]);
        setSurvey(surveyData);

        // Cargar los forms de los módulos en vivo, en orden.
        const formsData = await Promise.all(
          moduleIds.map(async (moduleId) => {
            try {
              const { data } = await apiConnection.get(`/forms/${moduleId}`);
              return data;
            } catch {
              return null;
            }
          }),
        );
        const validForms = formsData.filter(Boolean) as Form[];
        setForms(validForms);
        setSlides(buildSlideSequence(surveyData, validForms));

        // Mapa de nombres de entrevistados.
        try {
          const intervieweeIds: string[] = (
            interviewRes.data?.interviewees ?? []
          ).map((item: any) => item?._id ?? item);
          const { data: allInterviewees } = await apiConnection.get(
            "/interviewees/filtered",
          );
          const list = allInterviewees?.data || allInterviewees || [];
          const map = new Map<string, string>();
          (Array.isArray(list) ? list : []).forEach((ie: any) => {
            const first =
              ie.personalInfo?.firstName || ie.firstName || "";
            const last = ie.personalInfo?.lastName || ie.lastName || "";
            const name =
              `${first} ${last}`.trim() || ie.email || "Entrevistado";
            map.set(ie._id, name);
          });
          intervieweeIds.forEach((id) => {
            if (!map.has(id)) map.set(id, "Entrevistado");
          });
          nameMapRef.current = map;
        } catch {
          // Sin nombres seguimos con el fallback genérico.
        }

        // Retomar donde estaba la sesión.
        if (typeof session.currentSlideIndex === "number") {
          setCurrentSlideIndex(session.currentSlideIndex);
        }
        setAnswers(responsesToAnswers(session.professionalAnswers ?? []));
      } catch (error) {
        console.error("Error bootstrapping live interview:", error);
        Notification(
          "No pudimos cargar la sesión de entrevista. Iniciá la entrevista desde el listado.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) bootstrap();
  }, [interviewId]);

  const getLocalPayload = useCallback(() => {
    const currentSlides = slidesRef.current;
    const slide = currentSlides[indexRef.current];
    return {
      currentSlideIndex: indexRef.current,
      currentSlide: slide
        ? { formId: slide.formId, slideIndex: slide.index }
        : null,
      professionalAnswers: answersToResponses(
        answersRef.current,
        currentSlides,
        "professional",
      ),
    };
  }, []);

  const handleRemote = useCallback((session: LiveSessionState) => {
    // El profesional solo toma del server las respuestas del entrevistado.
    const panels: IntervieweePanel[] = (session.intervieweeAnswers ?? []).map(
      (entry) => {
        const id = entry.intervieweeId?.toString?.() ?? String(entry.intervieweeId);
        return {
          intervieweeId: id,
          name: nameMapRef.current.get(id) || "Entrevistado",
          answers: responsesToAnswers(entry.responses ?? []),
        };
      },
    );
    setIntervieweePanels(panels);
  }, []);

  const { patchNow, finish } = useLiveSession({
    interviewId,
    role: "professional",
    enabled: !loading && slides.length > 0,
    getLocalPayload,
    onRemote: handleRemote,
  });

  const handleAnswerChange = useCallback(
    (questionId: string, value: any, _type: FieldType) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [],
  );

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentSlideIndex(index);
      indexRef.current = index;
      // Empujar el cambio de slide al instante para mover al entrevistado.
      patchNow();
    },
    [patchNow],
  );

  const handleNext = useCallback(async () => {
    if (currentSlideIndex < slides.length - 1) {
      goToSlide(currentSlideIndex + 1);
      return;
    }
    // Último slide: finalizar la entrevista.
    try {
      setFinishing(true);
      await finish();
      Notification("Entrevista finalizada", "success");
      router.push(`/interviews/view/${interviewId}`);
    } catch (error: any) {
      Notification(
        error?.response?.data?.message ||
          "No pudimos finalizar la entrevista. Intentá de nuevo.",
        "error",
      );
    } finally {
      setFinishing(false);
    }
  }, [currentSlideIndex, slides.length, goToSlide, finish, router, interviewId]);

  const handlePrevious = useCallback(() => {
    if (currentSlideIndex > 0) goToSlide(currentSlideIndex - 1);
  }, [currentSlideIndex, goToSlide]);

  const currentSlide = useMemo(
    () => slides[currentSlideIndex],
    [slides, currentSlideIndex],
  );

  if (loading) {
    return (
      <AuthLayout links={[]}>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </AuthLayout>
    );
  }

  if (!survey || slides.length === 0) {
    return (
      <AuthLayout links={[]}>
        <div className="flex justify-center items-center min-h-screen px-6">
          <Card className="max-w-md">
            <CardBody className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                No hay módulos de entrevista
              </h2>
              <p className="text-gray-600 mb-4">
                Esta entrevista no tiene módulos en vivo o la sesión no está
                iniciada.
              </p>
              <Button
                color="primary"
                onPress={() => router.push(`/interviews/view/${interviewId}`)}
              >
                Volver a la entrevista
              </Button>
            </CardBody>
          </Card>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout links={[]}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6 mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800">{survey.name}</h1>
          <p className="text-sm text-gray-500">
            Sesión en vivo — vos conducís los slides
          </p>
        </div>

        {currentSlide && (
          <LiveSlideView
            slide={currentSlide}
            mode="professional"
            answers={answers}
            onAnswerChange={handleAnswerChange}
            slideNumber={currentSlideIndex + 1}
            totalSlides={slides.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentSlideIndex === 0}
            isLast={currentSlideIndex === slides.length - 1}
            finishing={finishing}
            intervieweePanels={intervieweePanels}
          />
        )}
      </div>
    </AuthLayout>
  );
}
