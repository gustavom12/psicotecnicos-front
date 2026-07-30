import React from "react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { FieldType } from "../../../../types/survey.types";
import { SequencedSlide, buildQuestionId } from "@/common/interview-slides";
import {
  extractFileUrl,
  isImageUrl,
  formatTextAnswer,
} from "@/common/answer-format";
import QuestionRenderer from "./QuestionRenderer";

export interface IntervieweePanel {
  intervieweeId: string;
  name: string;
  answers: Record<string, any>;
}

interface LiveSlideViewProps {
  slide: SequencedSlide;
  mode: "professional" | "interviewee";
  answers: Record<string, any>;
  onAnswerChange: (
    questionId: string,
    value: any,
    questionType: FieldType,
  ) => void;
  slideNumber: number;
  totalSlides: number;
  // Solo profesional:
  onNext?: () => void;
  onPrevious?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  finishing?: boolean;
  intervieweePanels?: IntervieweePanel[];
}

/** Muestra una respuesta del entrevistado: imagen, link a archivo o texto. */
function AnswerValue({ value }: { value: any }) {
  const fileUrl = extractFileUrl(value);

  if (fileUrl && isImageUrl(fileUrl)) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={fileUrl}
          alt="Respuesta del entrevistado"
          className="max-h-64 rounded-md border bg-white object-contain mt-1"
        />
      </a>
    );
  }

  if (fileUrl) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline break-all bg-white rounded-md border px-3 py-2 mt-1 inline-block"
      >
        Ver archivo
      </a>
    );
  }

  return (
    <p className="text-sm text-gray-900 bg-white rounded-md border px-3 py-2 mt-1">
      {formatTextAnswer(value)}
    </p>
  );
}

export default function LiveSlideView({
  slide,
  mode,
  answers,
  onAnswerChange,
  slideNumber,
  totalSlides,
  onNext,
  onPrevious,
  isFirst,
  isLast,
  finishing,
  intervieweePanels = [],
}: LiveSlideViewProps) {
  const professionalQuestions = slide.professional || [];
  const interviewerQuestions = slide.interviewer || [];

  const ownQuestions =
    mode === "professional" ? professionalQuestions : interviewerQuestions;
  const ownRole = mode === "professional" ? "professional" : "interviewer";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                Slide {slideNumber} de {totalSlides}
              </span>
              {mode === "interviewee" && (
                <Chip color="primary" variant="flat" size="sm">
                  El profesional conduce la entrevista
                </Chip>
              )}
            </div>
            {slide.title && (
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {slide.title}
              </h1>
            )}
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
          {ownQuestions.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                {mode === "professional"
                  ? "Tus campos (profesional)"
                  : "Preguntas"}
              </h2>
              {ownQuestions.map((question, index) => {
                const questionId = buildQuestionId(
                  slide.formId,
                  slide.index,
                  index,
                );
                return (
                  <QuestionRenderer
                    key={`${ownRole}-${questionId}`}
                    id={questionId}
                    question={question}
                    value={answers[questionId]}
                    onChange={(value) =>
                      onAnswerChange(questionId, value, question.type)
                    }
                  />
                );
              })}
            </div>
          )}

          {/* Panel read-only: lo que responde el entrevistado (solo profesional). */}
          {mode === "professional" && interviewerQuestions.length > 0 && (
            <div className="mt-8 pt-6 border-t space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Respuestas del entrevistado
              </h2>
              {intervieweePanels.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Todavía no hay respuestas del entrevistado.
                </p>
              ) : (
                intervieweePanels.map((panel) => (
                  <div
                    key={panel.intervieweeId}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <p className="font-medium text-gray-800 mb-3">
                      {panel.name}
                    </p>
                    <div className="space-y-3">
                      {interviewerQuestions.map((question, index) => {
                        const questionId = buildQuestionId(
                          slide.formId,
                          slide.index,
                          index,
                        );
                        return (
                          <div key={`ie-${questionId}`}>
                            <p className="text-sm font-medium text-gray-600">
                              {question.question}
                            </p>
                            <AnswerValue value={panel.answers[questionId]} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {mode === "professional" && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                variant="bordered"
                onPress={onPrevious}
                isDisabled={isFirst}
                className="min-w-[100px]"
              >
                Anterior
              </Button>
              <Button
                color={isLast ? "success" : "primary"}
                onPress={onNext}
                isLoading={finishing}
                className="min-w-[100px]"
              >
                {isLast ? "Finalizar entrevista" : "Siguiente"}
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
