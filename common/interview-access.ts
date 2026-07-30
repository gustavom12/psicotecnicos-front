/** Marca en la URL de /survey/[id] que se responden los módulos de la entrevista. */
export const INTERVIEW_STAGE = "interview";

/** Cada cuánto se sincronizan cliente y backend durante la sesión en vivo. */
export const LIVE_SYNC_INTERVAL_MS = 5000;

/** Ruta de la vista en vivo del profesional para una entrevista. */
export const buildProfessionalLivePath = (interviewId: string): string =>
  `/interviews/live/${interviewId}`;

/**
 * Los módulos que no son evaluación previa se responden durante la entrevista,
 * así que recién quedan disponibles a la hora agendada. Una entrevista sin
 * fecha válida no tiene restricción temporal que aplicar.
 */
export const isInterviewStageOpen = (
  scheduledAt?: string | Date | null,
): boolean => {
  if (!scheduledAt) return true;

  const scheduled = new Date(scheduledAt);
  if (Number.isNaN(scheduled.getTime())) return true;

  return scheduled.getTime() <= Date.now();
};

export const buildInterviewSessionPath = (
  surveyId: string,
  interviewId: string,
): string =>
  `/survey/${surveyId}?stage=${INTERVIEW_STAGE}&interviewId=${interviewId}`;

export const buildInterviewSessionUrl = (
  surveyId: string,
  interviewId: string,
): string => {
  const path = buildInterviewSessionPath(surveyId, interviewId);
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
};

export const formatScheduledAt = (scheduledAt?: string | Date | null): string => {
  if (!scheduledAt) return "fecha a confirmar";

  const scheduled = new Date(scheduledAt);
  if (Number.isNaN(scheduled.getTime())) return "fecha a confirmar";

  return scheduled.toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
