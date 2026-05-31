import { useCallback, useEffect, useState } from "react";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import { InterviewMeta, Report } from "./reports.types";

/* -----------------------------------------------------------------------------
 * Helpers locales (defensivos contra distintas formas de respuesta del backend)
 * --------------------------------------------------------------------------- */

const unwrap = <T>(data: any): T => (data?.data ?? data) as T;

const toArray = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray(data?.data)) return data.data as T[];
  return [];
};

/* -----------------------------------------------------------------------------
 * Llamadas crudas al backend
 * --------------------------------------------------------------------------- */

export const reportsApi = {
  /** GET /reports?intervieweeId=... */
  async listByInterviewee(intervieweeId: string): Promise<Report[]> {
    const { data } = await apiConnection.get("/reports", {
      params: { intervieweeId },
    });
    return toArray<Report>(data);
  },

  /** GET /interviews/filtered?intervieweeId=... */
  async listInterviewsByInterviewee(
    intervieweeId: string,
  ): Promise<InterviewMeta[]> {
    const { data } = await apiConnection.get("/interviews/filtered", {
      params: { intervieweeId },
    });
    return toArray<InterviewMeta>(data);
  },

  /** POST /reports/:id/feedback */
  async submitFeedback(
    reportId: string,
    feedback: string,
    notes?: { text: string }[],
    attachments?: { url: string; description: string }[],
  ): Promise<Report> {
    const { data } = await apiConnection.post(`/reports/${reportId}/feedback`, {
      feedback: feedback.trim(),
      ...(notes?.length ? { notes } : {}),
      ...(attachments?.length
        ? { attachments: attachments.map((a) => ({ ...a, type: "image" })) }
        : {}),
    });
    return unwrap<Report>(data);
  },
};

/* -----------------------------------------------------------------------------
 * Hook con estado + acciones
 * --------------------------------------------------------------------------- */

export interface UseReportsResult {
  loading: boolean;
  reports: Report[];
  interviewsById: Record<string, InterviewMeta>;
  refresh: () => Promise<void>;
  applyFeedback: (
    reportId: string,
    feedback: string,
    notes?: { text: string }[],
    attachments?: { url: string; description: string }[],
  ) => Promise<Report | null>;
  updateLocalReport: (updated: Report) => void;
}

export const useReports = (intervieweeId: string): UseReportsResult => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [interviewsById, setInterviewsById] = useState<
    Record<string, InterviewMeta>
  >({});

  const refresh = useCallback(async () => {
    if (!intervieweeId) return;
    try {
      setLoading(true);
      const [list, interviews] = await Promise.all([
        reportsApi.listByInterviewee(intervieweeId),
        reportsApi.listInterviewsByInterviewee(intervieweeId),
      ]);
      setReports(list);
      const map: Record<string, InterviewMeta> = {};
      for (const i of interviews) map[i._id] = i;
      setInterviewsById(map);
    } catch (err) {
      console.error("Error cargando reportes", err);
      Notification("Error al cargar los reportes", "error");
    } finally {
      setLoading(false);
    }
  }, [intervieweeId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateLocalReport = useCallback((updated: Report) => {
    setReports((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r)),
    );
  }, []);

  const applyFeedback = useCallback(
    async (
      reportId: string,
      feedback: string,
      notes?: { text: string }[],
      attachments?: { url: string; description: string }[],
    ): Promise<Report | null> => {
      try {
        const updated = await reportsApi.submitFeedback(
          reportId,
          feedback,
          notes,
          attachments,
        );
        Notification("Reporte regenerado con tus sugerencias", "success");
        updateLocalReport(updated);
        return updated;
      } catch (err: any) {
        console.error("Error enviando feedback", err);
        Notification(
          err?.response?.data?.message ||
            "No se pudo aplicar el feedback. Intentá nuevamente.",
          "error",
        );
        return null;
      }
    },
    [updateLocalReport],
  );

  return {
    loading,
    reports,
    interviewsById,
    refresh,
    applyFeedback,
    updateLocalReport,
  };
};
