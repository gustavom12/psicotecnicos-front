import { useState, useEffect, useRef, useCallback } from "react";
import { SlideTimeData } from "../../../../types/survey.types";

interface UseTimeTrackerProps {
  currentSlideIndex: number;
  currentFormId: string;
  totalSlides: number;
}

export const useTimeTracker = ({
  currentSlideIndex,
  currentFormId,
  totalSlides,
}: UseTimeTrackerProps) => {
  const [slideTimeData, setSlideTimeData] = useState<SlideTimeData[]>([]);
  const [currentSlideTime, setCurrentSlideTime] = useState(0);
  const [totalInterviewTime, setTotalInterviewTime] = useState(0);
  const [interviewStartTime] = useState(new Date());

  const currentSlideStartTime = useRef<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // El slide que se está cronometrando. Hace falta guardarlo porque el efecto
  // de cambio de slide corre cuando el índice nuevo ya se aplicó, y el tiempo
  // transcurrido pertenece al slide anterior.
  const trackedSlide = useRef<{ slideIndex: number; formId: string } | null>(
    null,
  );

  // Función para cerrar el tiempo acumulado de un slide
  const finishSlide = useCallback(
    (slide: { slideIndex: number; formId: string } | null) => {
      if (!slide) return;

      const endTime = new Date();
      const timeSpent = Math.floor(
        (endTime.getTime() - currentSlideStartTime.current.getTime()) / 1000,
      );

      setSlideTimeData((prev) => {
        const existingSlideIndex = prev.findIndex(
          (entry) =>
            entry.slideIndex === slide.slideIndex &&
            entry.formId === slide.formId,
        );

        if (existingSlideIndex >= 0) {
          // Actualizar slide existente
          const updatedSlides = [...prev];
          updatedSlides[existingSlideIndex] = {
            ...updatedSlides[existingSlideIndex],
            endTime,
            totalTimeSeconds:
              updatedSlides[existingSlideIndex].totalTimeSeconds + timeSpent,
            visitCount: updatedSlides[existingSlideIndex].visitCount + 1,
          };
          return updatedSlides;
        }

        // Crear nuevo registro de slide
        const newSlideData: SlideTimeData = {
          slideIndex: slide.slideIndex,
          formId: slide.formId,
          startTime: currentSlideStartTime.current,
          endTime,
          totalTimeSeconds: timeSpent,
          visitCount: 1,
        };
        return [...prev, newSlideData];
      });
    },
    [],
  );

  // Función para iniciar el seguimiento de un nuevo slide
  const startNewSlide = useCallback(() => {
    currentSlideStartTime.current = new Date();
    setCurrentSlideTime(0);

    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Iniciar nuevo intervalo para el slide actual
    intervalRef.current = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor(
        (now.getTime() - currentSlideStartTime.current.getTime()) / 1000,
      );
      setCurrentSlideTime(elapsed);
    }, 1000);
  }, []);

  // Efecto para manejar cambios de slide
  useEffect(() => {
    if (currentFormId) {
      // Cerrar el slide que se venía cronometrando antes de arrancar el nuevo
      finishSlide(trackedSlide.current);

      trackedSlide.current = {
        slideIndex: currentSlideIndex,
        formId: currentFormId,
      };
      startNewSlide();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSlideIndex, currentFormId]);

  // Efecto para el tiempo total de la entrevista
  useEffect(() => {
    totalIntervalRef.current = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor(
        (now.getTime() - interviewStartTime.getTime()) / 1000,
      );
      setTotalInterviewTime(elapsed);
    }, 1000);

    return () => {
      if (totalIntervalRef.current) {
        clearInterval(totalIntervalRef.current);
      }
    };
  }, [interviewStartTime]);

  // Función para finalizar la entrevista completa
  const finishInterview = useCallback(() => {
    finishSlide(trackedSlide.current);
    // Evita sumar el mismo tramo dos veces si el envío falla y se reintenta.
    trackedSlide.current = null;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (totalIntervalRef.current) {
      clearInterval(totalIntervalRef.current);
    }
  }, [finishSlide]);

  // Función para formatear tiempo en formato legible
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Función para obtener estadísticas del slide actual
  const getCurrentSlideStats = useCallback(() => {
    const existingSlide = slideTimeData.find(
      (slide) =>
        slide.slideIndex === currentSlideIndex &&
        slide.formId === currentFormId,
    );

    return {
      currentTime: currentSlideTime,
      totalTimeOnSlide:
        (existingSlide?.totalTimeSeconds || 0) + currentSlideTime,
      visitCount: (existingSlide?.visitCount || 0) + 1,
      formattedCurrentTime: formatTime(currentSlideTime),
      formattedTotalTime: formatTime(
        (existingSlide?.totalTimeSeconds || 0) + currentSlideTime,
      ),
    };
  }, [
    slideTimeData,
    currentSlideIndex,
    currentFormId,
    currentSlideTime,
    formatTime,
  ]);

  return {
    slideTimeData,
    currentSlideTime,
    totalInterviewTime,
    interviewStartTime,
    finishInterview,
    formatTime,
    getCurrentSlideStats,
  };
};
