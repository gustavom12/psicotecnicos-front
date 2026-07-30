import {
  Survey,
  Form,
  Slide,
  FieldType,
  InterviewResponse,
} from "../types/survey.types";

export type SequencedSlide = Slide & {
  formId: string;
  moduleOrder: number;
};

/** Campo del slide según el rol que responde. */
export type SlideRoleField = "interviewer" | "professional";

export const buildQuestionId = (
  formId: string,
  slideIndex: number,
  questionIndex: number,
): string => `${formId}_${slideIndex}_${questionIndex}`;

/**
 * Convierte el registro local de respuestas ({ questionId: value }) al array
 * que persiste el backend, resolviendo el tipo de cada pregunta desde el
 * campo correspondiente al rol (interviewer o professional).
 */
export const answersToResponses = (
  answers: Record<string, any>,
  slides: SequencedSlide[],
  role: SlideRoleField,
): InterviewResponse[] =>
  Object.entries(answers).map(([questionId, answer]) => {
    const [formId, slideIndexStr, questionIndexStr] = questionId.split("_");
    const slideIndex = parseInt(slideIndexStr, 10);
    const slide = slides.find(
      (item) => item.formId === formId && item.index === slideIndex,
    );
    const question = slide?.[role]?.[parseInt(questionIndexStr, 10)];
    return {
      questionId,
      slideIndex,
      formId,
      answer,
      questionType: question?.type || FieldType.SHORT_TEXT,
    };
  });

/** Inverso: del array persistido al registro local que consumen las vistas. */
export const responsesToAnswers = (
  responses: InterviewResponse[] = [],
): Record<string, any> => {
  const record: Record<string, any> = {};
  responses.forEach((response) => {
    record[response.questionId] = response.answer;
  });
  return record;
};

/**
 * Arma la secuencia global de slides de un survey a partir de sus módulos y
 * de los forms ya cargados. Profesional y entrevistado la calculan con esta
 * misma función para que un mismo índice signifique el mismo slide en ambos.
 */
export const buildSlideSequence = (
  survey: Survey | null,
  forms: Form[],
): SequencedSlide[] => {
  if (!survey?.modules) return [];

  const moduleOrderMap = new Map<string, number>();
  survey.modules.forEach((module) => {
    moduleOrderMap.set(module.id, module.order);
  });

  return forms
    .map((form) => ({
      form,
      moduleOrder: moduleOrderMap.get(form?._id) || 0,
    }))
    .sort((a, b) => a.moduleOrder - b.moduleOrder)
    .flatMap(({ form, moduleOrder }) =>
      [...form.slides]
        .sort((a, b) => a.index - b.index)
        .map((slide) => ({
          ...slide,
          formId: form._id,
          moduleOrder,
        })),
    );
};
