import React, { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { FileDown } from "lucide-react";
import { Notification } from "@/common/notification";
import AttachmentUploader, { Attachment } from "@/common/AttachmentUploader";
import { InterviewMeta, Report, ReportContent } from "./reports.types";
import {
  buildReportTitle,
  formatDate,
  getLastVersion,
  statusColor,
} from "./reports.utils";
import ReportDetails from "./ReportDetails";

interface NoteInput {
  id: string;
  text: string;
}

interface Props {
  report: Report;
  interview?: InterviewMeta;
  onSubmitFeedback: (
    reportId: string,
    feedback: string,
    notes?: { text: string }[],
    attachments?: { url: string; description: string }[],
  ) => Promise<Report | null>;
  onExportPdf?: () => void;
}

const ReportCard: React.FC<Props> = ({
  report,
  interview,
  onSubmitFeedback,
  onExportPdf,
}) => {
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [notes, setNotes] = useState<NoteInput[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [noteInput, setNoteInput] = useState("");

  const c = report.content || ({} as ReportContent);
  const lastVersion = getLastVersion(report);
  const headerTitle = buildReportTitle(report, interview);
  const versionsCount = report.versions?.length ?? 0;

  const addNote = () => {
    if (!noteInput.trim()) return;
    setNotes((p) => [...p, { id: crypto.randomUUID(), text: noteInput.trim() }]);
    setNoteInput("");
  };

  const handleSubmit = async () => {
    const hasFeedback = feedback.trim();
    const hasNotes = notes.length > 0;
    const hasAttachments = attachments.some((a) => a.url.trim());

    if (!hasFeedback && !hasNotes && !hasAttachments) {
      Notification(
        "Agregá al menos una corrección, nota o adjunto",
        "error",
      );
      return;
    }
    setSubmitting(true);
    const result = await onSubmitFeedback(
      report._id,
      feedback,
      notes.map((n) => ({ text: n.text })),
      attachments
        .filter((a) => a.url.trim())
        .map((a) => ({ url: a.url.trim(), description: a.description })),
    );
    setSubmitting(false);
    if (result) {
      setFeedback("");
      setNotes([]);
      setAttachments([]);
      setNoteInput("");
      setFeedbackOpen(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 truncate">
            {headerTitle}
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {interview?.position && <span>{interview.position}</span>}
            {interview?.scheduledAt && (
              <span>{formatDate(interview.scheduledAt)}</span>
            )}
            {interview?.shortId && (
              <span className="font-mono">ID:{interview.shortId}</span>
            )}
            <span>Actualizado: {formatDate(report.updatedAt)}</span>
            {lastVersion?.model && (
              <span className="font-mono">{lastVersion.model}</span>
            )}
            <span>v{versionsCount}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
              report.status,
            )}`}
          >
            {report.status}
          </span>
        </div>
      </div>

      {/* Resumen + acciones */}
      <div className="p-5">
        {c.sintesis?.veredicto && (
          <div
            className={`inline-block mb-3 px-3 py-1 rounded-full text-xs font-bold ${
              c.sintesis.veredicto === "RECOMENDABLE"
                ? "bg-green-100 text-green-800 border border-green-200"
                : c.sintesis.veredicto === "RECOMENDABLE CON RESERVAS"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {c.sintesis.veredicto}
          </div>
        )}
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {c.sintesis?.narrativa
            ? c.sintesis.narrativa.slice(0, 300) +
              (c.sintesis.narrativa.length > 300 ? "…" : "")
            : c.presentacion?.narrativa
              ? c.presentacion.narrativa.slice(0, 300) +
                (c.presentacion.narrativa.length > 300 ? "…" : "")
              : "Sin resumen disponible."}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="bordered"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Ocultar detalles" : "Ver detalles"}
          </Button>
          {onExportPdf && (
            <Button
              size="sm"
              variant="flat"
              startContent={<FileDown size={13} />}
              onClick={onExportPdf}
              className="text-indigo-700"
            >
              Descargar PDF
            </Button>
          )}
          <Button
            size="sm"
            className="bg-[#635BFF] text-white"
            onClick={() => setFeedbackOpen((v) => !v)}
          >
            {feedbackOpen ? "Cancelar" : "Corregir informe"}
          </Button>
          {versionsCount > 1 && (
            <Button
              size="sm"
              variant="light"
              onClick={() => setHistoryOpen((v) => !v)}
            >
              {historyOpen
                ? "Ocultar historial"
                : `Historial (${versionsCount})`}
            </Button>
          )}
        </div>
      </div>

      {/* Detalles colapsables */}
      {open && (
        <div className="px-5 pb-5">
          <ReportDetails content={c} />
        </div>
      )}

      {/* Panel de correcciones */}
      {feedbackOpen && (
        <div className="px-5 pb-5 border-t border-gray-100 space-y-5">
          {/* Correcciones */}
          <div className="mt-4">
            <h5 className="font-medium text-gray-900 mb-1">
              Correcciones al informe
            </h5>
            <p className="text-xs text-gray-500 mb-2">
              Describí en texto libre qué querés cambiar. La IA regenerará el
              informe tomándolo en cuenta.
            </p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ej: 'Suavizá el tono de la síntesis' o 'Incluí liderazgo en fortalezas basándote en lo que dijo al final'."
              minRows={3}
              isDisabled={submitting}
            />
          </div>

          {/* Notas adicionales */}
          <div>
            <h5 className="font-medium text-gray-900 mb-1">
              Notas adicionales
            </h5>
            <p className="text-xs text-gray-500 mb-2">
              Observaciones del profesional que no quedaron en la transcripción.
            </p>
            <div className="flex gap-2">
              <Textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Escribí una nota u observación…"
                minRows={2}
                className="flex-1"
                isDisabled={submitting}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) addNote();
                }}
              />
              <Button
                size="sm"
                variant="flat"
                onClick={addNote}
                className="self-end"
                isDisabled={submitting}
              >
                Agregar
              </Button>
            </div>
            {notes.length > 0 && (
              <ul className="mt-2 space-y-1">
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-2 bg-blue-50 rounded-md px-3 py-2 text-sm"
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
            disabled={submitting}
            label="Imágenes adjuntas"
            hint="Pruebas proyectivas, resultados de tests o dibujos a incluir en el análisis."
          />

          {/* Confirmar */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              className="bg-[#635BFF] text-white"
              onClick={handleSubmit}
              isLoading={submitting}
            >
              {submitting ? "Aplicando…" : "Aplicar correcciones"}
            </Button>
            <span className="text-xs text-gray-500">
              Puede tardar 30–90 segundos.
            </span>
          </div>
        </div>
      )}

      {/* Historial */}
      {historyOpen && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <h5 className="font-medium text-gray-900 mt-4 mb-2">
            Historial de versiones
          </h5>
          <ol className="space-y-3">
            {[...report.versions].reverse().map((v, i) => {
              const realIndex = versionsCount - i;
              return (
                <li
                  key={v._id}
                  className="text-sm border border-gray-100 rounded-md p-3"
                >
                  <div className="flex flex-wrap justify-between gap-2 mb-1">
                    <span className="font-medium">
                      v{realIndex}{" "}
                      {realIndex === versionsCount && "(actual)"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(v.generatedAt)} · {v.model}
                    </span>
                  </div>
                  {v.feedback ? (
                    <div className="text-xs text-gray-700 italic">
                      Corrección aplicada: "{v.feedback}"
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Generación inicial / regeneración.
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ReportCard;
