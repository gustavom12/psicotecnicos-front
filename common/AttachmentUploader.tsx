/**
 * AttachmentUploader
 *
 * Manages a list of image attachments with real file upload to POST /files
 * (Cloudinary via the backend). Returns the persisted URL once uploaded.
 */
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { ImagePlus, Trash2, Loader2 } from "lucide-react";
import apiConnection from "@/pages/api/api";

export interface Attachment {
  id: string;
  url: string;
  description: string;
}

interface Props {
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  hint?: string;
}

async function uploadToBackend(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", `${crypto.randomUUID()}-${file.name}`);
  const res = await apiConnection.post("/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const data = res.data?.data ?? res.data;
  const url = data?.url;
  if (!url) throw new Error("La respuesta del servidor no contiene una URL");
  return url;
}

const AttachmentUploader: React.FC<Props> = ({
  attachments,
  onChange,
  disabled = false,
  label = "Imágenes adjuntas",
  hint = "Imágenes de pruebas, dibujos proyectivos o resultados de tests.",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());

  // Keep a live ref so async upload callbacks always see the latest list
  const currentRef = useRef<Attachment[]>(attachments);
  useEffect(() => {
    currentRef.current = attachments;
  }, [attachments]);

  const setUploading = (id: string, loading: boolean) =>
    setUploadingIds((prev) => {
      const next = new Set(prev);
      loading ? next.add(id) : next.delete(id);
      return next;
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    e.target.value = "";

    const newItems: Attachment[] = files.map((f) => ({
      id: crypto.randomUUID(),
      url: "",
      description: f.name.replace(/\.[^.]+$/, ""),
    }));

    onChange([...attachments, ...newItems]);

    for (const item of newItems) {
      const file = files[newItems.indexOf(item)];
      setUploading(item.id, true);
      try {
        const url = await uploadToBackend(file);
        const updated = currentRef.current.map((a) =>
          a.id === item.id ? { ...a, url } : a,
        );
        onChange(updated);
      } catch (err: any) {
        console.error("Error subiendo imagen:", err);
        const filtered = currentRef.current.filter((a) => a.id !== item.id);
        onChange(filtered);
      } finally {
        setUploading(item.id, false);
      }
    }
  };

  const updateDescription = (id: string, description: string) =>
    onChange(attachments.map((a) => (a.id === id ? { ...a, description } : a)));

  const remove = (id: string) =>
    onChange(attachments.filter((a) => a.id !== id));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {hint && <p className="text-xs text-gray-400">{hint}</p>}
        </div>
        <Button
          size="sm"
          variant="flat"
          startContent={<ImagePlus size={13} />}
          isDisabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          Agregar imagen
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map((a) => {
            const isUploading = uploadingIds.has(a.id);
            return (
              <li
                key={a.id}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-2"
              >
                {/* Thumbnail / loader */}
                <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 size={18} className="text-indigo-500 animate-spin" />
                  ) : a.url ? (
                    <img
                      src={a.url}
                      alt={a.description}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={18} className="text-gray-400" />
                  )}
                </div>

                {/* Description + status */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={a.description}
                    onChange={(e) => updateDescription(a.id, e.target.value)}
                    placeholder="Descripción (opcional)"
                    disabled={isUploading || disabled}
                    className="w-full border-0 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none disabled:opacity-60"
                  />
                  <p className="text-xs text-gray-400 truncate">
                    {isUploading
                      ? "Subiendo…"
                      : a.url
                        ? "✓ Subida correctamente"
                        : "Error al subir"}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => remove(a.id)}
                  disabled={isUploading || disabled}
                  className="text-gray-400 hover:text-red-500 disabled:opacity-40 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AttachmentUploader;
