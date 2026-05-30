import React, { useState, useEffect, useCallback } from "react";
import { Button, Textarea } from "@heroui/react";
import { FileText, Plus, RefreshCw } from "lucide-react";
import { Notification } from "@/common/notification";
import apiConnection from "@/pages/api/api";
import ReportCard from "@/views/interviewed/edit/reports/ReportCard";
import { Report } from "@/views/interviewed/edit/reports/reports.types";
import { buildReportPdfHtml, PdfMeta } from "./reportPdfExport";
import AttachmentUploader, { Attachment } from "@/common/AttachmentUploader";

interface NoteInput {
  id: string;
  text: string;
}

export interface ReportsSectionProps {
  interviewId: string;
  interviewPosition?: string;
  interviewScheduledAt?: string;
  intervieweeNames?: string[];
  professionalNames?: string[];
  companyName?: string;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({
  interviewId,
  interviewPosition,
  interviewScheduledAt,
  intervieweeNames = [],
  professionalNames = [],
  companyName,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState<NoteInput[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const pdfMeta: PdfMeta = {
    interviewPosition,
    interviewScheduledAt,
    intervieweeNames,
    professionalNames,
    companyName,
  };

  const interviewMeta = {
    _id: interviewId,
    position: interviewPosition,
    scheduledAt: interviewScheduledAt,
  };

  /* ── API calls ──────────────────────────────────────────────────────────── */

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiConnection.get("/reports", {
        params: { interviewId },
      });
      const raw = res.data;
      const list: Report[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : [];
      setReports(list);
    } catch {
      // silent – empty state handles it
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await apiConnection.post("/reports/generate", {
        interviewId,
        notes: notes.map((n) => ({ text: n.text })),
        attachments: attachments
          .filter((a) => a.url)
          .map((a) => ({ url: a.url, type: "image", description: a.description })),
      });
      Notification("Informe generado correctamente", "success");
      setNotes([]);
      setAttachments([]);
      setNoteInput("");
      setShowPanel(false);
      await loadReports();
    } catch (err: any) {
      Notification(
        err?.response?.data?.message ||
          "Error al generar el informe. Verificá que la entrevista tenga una grabación vinculada en Grain.",
        "error",
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleFeedback = async (
    reportId: string,
    feedback: string,
    notes?: { text: string }[],
    attachments?: { url: string; description: string }[],
  ): Promise<Report | null> => {
    try {
      const res = await apiConnection.post(`/reports/${reportId}/feedback`, {
        feedback,
        ...(notes?.length ? { notes } : {}),
        ...(attachments?.length
          ? {
              attachments: attachments.map((a) => ({
                ...a,
                type: "image",
              })),
            }
          : {}),
      });
      Notification("Informe actualizado con tus correcciones", "success");
      await loadReports();
      return (res.data?.data ?? res.data) as Report;
    } catch (err: any) {
      Notification(
        err?.response?.data?.message || "Error al aplicar las correcciones",
        "error",
      );
      return null;
    }
  };

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes((p) => [
      ...p,
      { id: crypto.randomUUID(), text: noteInput.trim() },
    ]);
    setNoteInput("");
  };

  const handleExportPdf = (report: Report) => {
    if (typeof window === "undefined") return;
    const html = buildReportPdfHtml(report, pdfMeta);
    const win = window.open("", "_blank");
    if (!win) {
      Notification(
        "Habilitá ventanas emergentes en el navegador para exportar el PDF",
        "error",
      );
      return;
    }
    win.document.write(html);
    win.document.close();
    win.addEventListener("load", () => setTimeout(() => { win.focus(); win.print(); }, 400));
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Barra superior ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Informes Psicolaborales
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {reports.length > 0
                ? `${reports.length} informe${reports.length > 1 ? "s" : ""} generado${reports.length > 1 ? "s" : ""}`
                : "Sin informes generados aún"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {reports.length > 0 && (
              <Button
                size="sm"
                variant="flat"
                startContent={<RefreshCw size={13} />}
                onClick={loadReports}
              >
                Actualizar
              </Button>
            )}
            <Button
              color="primary"
              size="sm"
              startContent={<Plus size={14} />}
              onClick={() => setShowPanel((v) => !v)}
              isDisabled={generating}
            >
              {showPanel ? "Cancelar" : "Generar informe"}
            </Button>
          </div>
        </div>

        {/* ── Panel de generación ── */}
        {showPanel && (
          <div className="mt-5 pt-5 border-t border-gray-100 space-y-5">
            <p className="text-sm text-gray-600">
              La IA utilizará la grabación de Grain vinculada a esta entrevista
              como fuente principal. Podés agregar notas e imágenes para
              enriquecer el análisis.
            </p>

            {/* Notas */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">
                Notas del profesional{" "}
                <span className="font-normal text-gray-400">(opcional)</span>
              </h5>
              <div className="flex gap-2">
                <Textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Observaciones, contexto adicional o aspectos a destacar…"
                  minRows={2}
                  className="flex-1"
                  isDisabled={generating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) addNote();
                  }}
                />
                <Button
                  size="sm"
                  variant="flat"
                  onClick={addNote}
                  className="self-end"
                  isDisabled={generating}
                >
                  Agregar
                </Button>
              </div>
              {notes.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {notes.map((n) => (
                    <li
                      key={n.id}
                      className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-md px-3 py-2 text-sm"
                    >
                      <span className="flex-1 text-gray-700">{n.text}</span>
                      <button
                        onClick={() =>
                          setNotes((p) => p.filter((x) => x.id !== n.id))
                        }
                        className="text-gray-400 hover:text-red-500 shrink-0 mt-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Adjuntos */}
            <AttachmentUploader
              attachments={attachments}
              onChange={setAttachments}
              disabled={generating}
              label={
                <>
                  Imágenes adjuntas{" "}
                  <span className="font-normal text-gray-400">(opcional)</span>
                </>
              }
              hint="Pruebas proyectivas, resultados de tests, dibujos u otras evidencias visuales."
            />

            {/* Confirmar */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                color="primary"
                onClick={handleGenerate}
                isLoading={generating}
                startContent={!generating ? <FileText size={14} /> : undefined}
              >
                {generating ? "Generando con IA…" : "Confirmar generación"}
              </Button>
              <span className="text-xs text-gray-400">
                Puede tardar entre 30 y 90 segundos.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Empty state ── */}
      {reports.length === 0 && !showPanel && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-14 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin informes generados
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
            Hacé clic en "Generar informe" para que la IA analice la grabación
            de la entrevista y produzca un informe psicolaboral completo.
          </p>
          <Button
            color="primary"
            startContent={<Plus size={14} />}
            onClick={() => setShowPanel(true)}
          >
            Generar primer informe
          </Button>
        </div>
      )}

      {/* ── Lista de informes ── */}
      {reports.map((report) => (
        <ReportCard
          key={report._id}
          report={report}
          interview={interviewMeta}
          onSubmitFeedback={handleFeedback}
          onExportPdf={() => handleExportPdf(report)}
        />
      ))}
    </div>
  );
};

export default ReportsSection;
