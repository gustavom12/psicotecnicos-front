import React, { useEffect, useMemo, useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { Save } from "lucide-react";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import AttachmentUploader, { Attachment } from "@/common/AttachmentUploader";

export interface AnnotationImage {
  url: string;
  description?: string;
}

export interface Annotations {
  text?: string;
  images?: AnnotationImage[];
  updatedAt?: string;
}

interface AnnotationsSectionProps {
  interviewId: string;
  annotations?: Annotations;
  /** Permite al padre quedarse con lo último guardado. */
  onSaved?: (annotations: Annotations) => void;
}

/** Las imágenes guardadas no tienen id local; se genera para poder editarlas. */
const toAttachments = (images: AnnotationImage[] = []): Attachment[] =>
  images.map((image) => ({
    id: crypto.randomUUID(),
    url: image.url,
    description: image.description ?? "",
  }));

const AnnotationsSection: React.FC<AnnotationsSectionProps> = ({
  interviewId,
  annotations,
  onSaved,
}) => {
  const [text, setText] = useState(annotations?.text ?? "");
  const [attachments, setAttachments] = useState<Attachment[]>(() =>
    toAttachments(annotations?.images),
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | undefined>(
    annotations?.updatedAt,
  );

  // El detalle se carga async, así que las anotaciones pueden llegar después
  // del primer render.
  useEffect(() => {
    setText(annotations?.text ?? "");
    setAttachments(toAttachments(annotations?.images));
    setSavedAt(annotations?.updatedAt);
  }, [annotations?.text, annotations?.updatedAt]);

  // Snapshot de lo guardado para saber si hay cambios sin guardar.
  const savedSnapshot = useMemo(
    () =>
      JSON.stringify({
        text: annotations?.text ?? "",
        images: (annotations?.images ?? []).map((image) => ({
          url: image.url,
          description: image.description ?? "",
        })),
      }),
    [annotations?.text, annotations?.images],
  );

  const currentSnapshot = JSON.stringify({
    text,
    images: attachments
      .filter((a) => a.url)
      .map((a) => ({ url: a.url, description: a.description ?? "" })),
  });

  const hasChanges = savedSnapshot !== currentSnapshot;
  const uploading = attachments.some((a) => !a.url);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        text,
        images: attachments
          .filter((a) => a.url)
          .map((a) => ({ url: a.url, description: a.description ?? "" })),
      };
      const { data } = await apiConnection.patch(
        `/interviews/${interviewId}/annotations`,
        payload,
      );

      const saved: Annotations = data?.annotations ?? {
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      setSavedAt(saved.updatedAt);
      onSaved?.(saved);
      Notification("Anotaciones guardadas", "success");
    } catch (error: any) {
      Notification(
        error?.response?.data?.message ||
          "No pudimos guardar las anotaciones. Intentá de nuevo.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Anotaciones</h2>
            <p className="text-sm text-gray-500 mt-1">
              Notas libres e imágenes sobre la entrevista. Solo las ve el
              profesional.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Button
              color="primary"
              startContent={<Save className="w-4 h-4" />}
              isLoading={saving}
              isDisabled={!hasChanges || uploading}
              onPress={handleSave}
            >
              Guardar
            </Button>
            {uploading ? (
              <span className="text-xs text-gray-400">
                Esperando que terminen de subir las imágenes…
              </span>
            ) : hasChanges ? (
              <span className="text-xs text-amber-600">Cambios sin guardar</span>
            ) : savedAt ? (
              <span className="text-xs text-gray-400">
                Guardado: {new Date(savedAt).toLocaleString("es-ES")}
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribí acá tus observaciones, hipótesis, comentarios de la entrevista…"
            minRows={8}
            className="w-full"
          />
        </div>

        <AttachmentUploader
          attachments={attachments}
          onChange={setAttachments}
          disabled={saving}
          label="Imágenes"
          hint="Dibujos, tests, capturas o cualquier imagen que quieras adjuntar."
        />

        {attachments.some((a) => a.url) && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {attachments
                .filter((a) => a.url)
                .map((a) => (
                  <a
                    key={a.id}
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={a.url}
                      alt={a.description || "Anotación"}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                    />
                    {a.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {a.description}
                      </p>
                    )}
                  </a>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnotationsSection;
