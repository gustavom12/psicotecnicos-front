import { useCallback, useEffect, useRef, useState } from "react";
import apiConnection from "@/pages/api/api";
import { LIVE_SYNC_INTERVAL_MS } from "@/common/interview-access";

export type LiveRole = "professional" | "interviewee";

export interface LiveSessionState {
  status: "LIVE" | "FINISHED" | null;
  currentSlideIndex: number;
  currentSlide?: { formId: string; slideIndex: number } | null;
  moduleIds?: string[];
  surveyId?: string;
  professionalAnswers?: any[];
  intervieweeAnswers?: { intervieweeId: any; responses: any[] }[];
  myResponses?: any[];
}

interface UseLiveSessionParams {
  interviewId?: string | null;
  role: LiveRole;
  enabled?: boolean;
  // Devuelve el payload local a enviar en cada ciclo (o null para no enviar).
  getLocalPayload: () => any | null;
  // Se llama con el estado remoto tras cada lectura.
  onRemote?: (session: LiveSessionState) => void;
}

/**
 * Sincroniza una sesión de entrevista en vivo por polling: lee el estado del
 * backend y empuja los cambios locales cada LIVE_SYNC_INTERVAL_MS. El
 * profesional además puede forzar un envío inmediato (patchNow) al cambiar de
 * slide para que el entrevistado no espere el ciclo completo.
 */
export const useLiveSession = ({
  interviewId,
  role,
  enabled = true,
  getLocalPayload,
  onRemote,
}: UseLiveSessionParams) => {
  const [session, setSession] = useState<LiveSessionState | null>(null);
  const [loading, setLoading] = useState(true);

  const payloadRef = useRef(getLocalPayload);
  payloadRef.current = getLocalPayload;
  const onRemoteRef = useRef(onRemote);
  onRemoteRef.current = onRemote;

  const readUrl =
    role === "professional"
      ? `/interview-sessions/${interviewId}`
      : `/interview-sessions/interviewee/${interviewId}`;
  const writeUrl =
    role === "professional"
      ? `/interview-sessions/${interviewId}`
      : `/interview-sessions/interviewee/${interviewId}`;

  const fetchState = useCallback(async () => {
    if (!interviewId) return;
    try {
      const { data } = await apiConnection.get(readUrl);
      setSession(data);
      onRemoteRef.current?.(data);
    } catch (error) {
      console.error("Error fetching live session:", error);
    } finally {
      setLoading(false);
    }
  }, [interviewId, readUrl]);

  const patchNow = useCallback(async () => {
    if (!interviewId) return;
    const payload = payloadRef.current?.();
    if (!payload) return;
    try {
      await apiConnection.patch(writeUrl, payload);
    } catch (error) {
      console.error("Error pushing live session:", error);
    }
  }, [interviewId, writeUrl]);

  const finish = useCallback(async () => {
    if (!interviewId) return;
    // Antes de cerrar, empuja el último estado local para no perder respuestas.
    await patchNow();
    await apiConnection.post(`/interview-sessions/${interviewId}/finish`);
    await fetchState();
  }, [interviewId, patchNow, fetchState]);

  useEffect(() => {
    if (!enabled || !interviewId) return;

    fetchState();
    const readInterval = setInterval(fetchState, LIVE_SYNC_INTERVAL_MS);
    const writeInterval = setInterval(patchNow, LIVE_SYNC_INTERVAL_MS);

    return () => {
      clearInterval(readInterval);
      clearInterval(writeInterval);
    };
  }, [enabled, interviewId, fetchState, patchNow]);

  return { session, loading, patchNow, finish, refresh: fetchState };
};
