import React from 'react';
import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { Slide, InterviewResponse, FieldType } from '../../../../types/survey.types';
import QuestionRenderer from './QuestionRenderer';
import TimeDisplay from './TimeDisplay';

interface SlideViewProps {
  slide: Slide;
  formId: string;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any, questionType: FieldType) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  errors: Record<string, string>;
  // Props para el tiempo
  timeStats?: {
    currentTime: number;
    totalTimeOnSlide: number;
    visitCount: number;
    formattedCurrentTime: string;
    formattedTotalTime: string;
  };
  totalInterviewTime?: string;
  slideNumber?: number;
  totalSlides?: number;
}

export default function SlideView({
  slide,
  formId,
  responses,
  onResponseChange,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  errors,
  timeStats,
  totalInterviewTime,
  slideNumber,
  totalSlides
}: SlideViewProps) {

  const interviewerQuestions = slide.interviewer || [];
  // Generar IDs únicos para las preguntas
  const getQuestionId = (questionIndex: number) =>
    `${formId}_${slide.index}_${questionIndex}`;

  const handleNext = () => {
    // Solo validar si hay preguntas para el entrevistado
    if (interviewerQuestions.length > 0) {
      // Validar que todas las preguntas requeridas estén respondidas
      const hasErrors = interviewerQuestions.some((_, index) => {
        const questionId = getQuestionId(index);
        const response = responses[questionId];
        return !response || response === '';
      });

      if (hasErrors) {
        return; // No continuar si hay errores
      }
    }

    // Continuar al siguiente slide
    onNext();
  };

  return (
    <>
      {/* Indicador de tiempo flotante y discreto */}
      {timeStats && totalInterviewTime && slideNumber && totalSlides && (
        <TimeDisplay
          currentSlideTime={timeStats.formattedCurrentTime}
          totalSlideTime={timeStats.formattedTotalTime}
          totalInterviewTime={totalInterviewTime}
          visitCount={timeStats.visitCount}
          slideNumber={slideNumber}
          totalSlides={totalSlides}
        />
      )}

      <div className="max-w-4xl mx-auto p-6">
        <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="w-full">
            {slide.title && (
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {slide.title}
              </h1>
            )}

            {/* Renderizar HTML del slide si existe */}
            {slide.html && (
              <div
                className="prose prose-sm max-w-none mb-4 text-gray-600"
                dangerouslySetInnerHTML={{ __html: slide.html }}
              />
            )}

            {slide.comments && (
              <p className="text-sm text-gray-500 italic mb-4">
                {slide.comments}
              </p>
            )}
          </div>
        </CardHeader>

        <CardBody className="pt-0">
          {/* Preguntas para el entrevistado - solo mostrar si hay preguntas */}
          {interviewerQuestions.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Preguntas
              </h2>

              {interviewerQuestions.map((question, index) => {
                const questionId = getQuestionId(index);
                return (
                  <QuestionRenderer
                    key={questionId}
                    question={question}
                    value={responses[questionId]}
                    onChange={(value) => onResponseChange(questionId, value, question.type)}
                    error={errors[questionId]}
                  />
                );
              })}
            </div>
          )}

          {/* Botones de navegación */}
          <div className={`flex justify-between items-center ${interviewerQuestions.length > 0 ? 'mt-8 pt-6 border-t' : 'mt-4'}`}>
            <Button
              variant="bordered"
              onPress={onPrevious}
              isDisabled={isFirst}
              className="min-w-[100px]"
            >
              Anterior
            </Button>

            <div className="text-sm text-gray-500">
              Slide {slide.index + 1}
            </div>

            <Button
              color="primary"
              onPress={handleNext}
              className="min-w-[100px]"
            >
              {isLast ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
        </CardBody>
      </Card>
      </div>
    </>
  );
}
