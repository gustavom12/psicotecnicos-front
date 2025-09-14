import { useState, useEffect, useRef, useCallback } from 'react';
import { SlideTimeData } from '../../../../types/survey.types';

interface UseTimeTrackerProps {
  currentSlideIndex: number;
  currentFormId: string;
  totalSlides: number;
}

export const useTimeTracker = ({ currentSlideIndex, currentFormId, totalSlides }: UseTimeTrackerProps) => {
  const [slideTimeData, setSlideTimeData] = useState<SlideTimeData[]>([]);
  const [currentSlideTime, setCurrentSlideTime] = useState(0);
  const [totalInterviewTime, setTotalInterviewTime] = useState(0);
  const [interviewStartTime] = useState(new Date());

  const currentSlideStartTime = useRef<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener el identificador único del slide
  const getSlideKey = useCallback((slideIndex: number, formId: string) => {
    return `${formId}_${slideIndex}`;
  }, []);

  // Función para finalizar el tiempo del slide actual
  const finishCurrentSlide = useCallback(() => {
    if (!currentFormId) return;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - currentSlideStartTime.current.getTime()) / 1000);
    const slideKey = getSlideKey(currentSlideIndex, currentFormId);

    setSlideTimeData(prev => {
      const existingSlideIndex = prev.findIndex(
        slide => slide.slideIndex === currentSlideIndex && slide.formId === currentFormId
      );

      if (existingSlideIndex >= 0) {
        // Actualizar slide existente
        const updatedSlides = [...prev];
        updatedSlides[existingSlideIndex] = {
          ...updatedSlides[existingSlideIndex],
          endTime,
          totalTimeSeconds: updatedSlides[existingSlideIndex].totalTimeSeconds + timeSpent,
          visitCount: updatedSlides[existingSlideIndex].visitCount + 1
        };
        return updatedSlides;
      } else {
        // Crear nuevo registro de slide
        const newSlideData: SlideTimeData = {
          slideIndex: currentSlideIndex,
          formId: currentFormId,
          startTime: currentSlideStartTime.current,
          endTime,
          totalTimeSeconds: timeSpent,
          visitCount: 1
        };
        return [...prev, newSlideData];
      }
    });
  }, [currentSlideIndex, currentFormId, getSlideKey]);

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
      const elapsed = Math.floor((now.getTime() - currentSlideStartTime.current.getTime()) / 1000);
      setCurrentSlideTime(elapsed);
    }, 1000);
  }, []);

  // Efecto para manejar cambios de slide
  useEffect(() => {
    if (currentFormId) {
      // Si no es el primer slide, finalizar el anterior
      if (slideTimeData.length > 0 || currentSlideIndex > 0) {
        finishCurrentSlide();
      }

      // Iniciar el nuevo slide
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
      const elapsed = Math.floor((now.getTime() - interviewStartTime.getTime()) / 1000);
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
    finishCurrentSlide();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (totalIntervalRef.current) {
      clearInterval(totalIntervalRef.current);
    }
  }, [finishCurrentSlide]);

  // Función para formatear tiempo en formato legible
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Función para obtener estadísticas del slide actual
  const getCurrentSlideStats = useCallback(() => {
    const existingSlide = slideTimeData.find(
      slide => slide.slideIndex === currentSlideIndex && slide.formId === currentFormId
    );

    return {
      currentTime: currentSlideTime,
      totalTimeOnSlide: (existingSlide?.totalTimeSeconds || 0) + currentSlideTime,
      visitCount: (existingSlide?.visitCount || 0) + 1,
      formattedCurrentTime: formatTime(currentSlideTime),
      formattedTotalTime: formatTime((existingSlide?.totalTimeSeconds || 0) + currentSlideTime)
    };
  }, [slideTimeData, currentSlideIndex, currentFormId, currentSlideTime, formatTime]);

  return {
    slideTimeData,
    currentSlideTime,
    totalInterviewTime,
    interviewStartTime,
    finishInterview,
    formatTime,
    getCurrentSlideStats
  };
};
