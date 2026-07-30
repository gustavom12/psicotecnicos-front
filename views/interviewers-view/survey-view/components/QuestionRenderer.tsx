import React, { useState } from "react";
import { Input, Textarea, Radio, RadioGroup } from "@heroui/react";
import { Question, FieldType } from "../../../../types/survey.types";
import apiConnection from "@/pages/api/api";
import { Notification } from "@/common/notification";
import { isImageUrl } from "@/common/answer-format";

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  id?: string;
}

const DEFAULT_SCALE_VALUE = 5;

const isAnswered = (value: any) =>
  value !== undefined && value !== null && value !== "";

/**
 * Campo de archivo: sube el archivo a POST /files apenas se elige y guarda como
 * respuesta la URL persistida (string), no el File crudo. Así la respuesta se
 * puede sincronizar/guardar y luego mostrarse (imagen o link).
 */
function FileQuestionInput({
  value,
  onChange,
  error,
}: {
  value: any;
  onChange: (value: any) => void;
  error?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const url = typeof value === "string" ? value : value?.url;

  const handleFile = async (file: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", `${Date.now()}-${file.name}`);
      const res = await apiConnection.post("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data?.data ?? res.data;
      const uploadedUrl = data?.url || data?.fileUrl || data?.link;
      if (!uploadedUrl) {
        throw new Error("La respuesta del servidor no contiene una URL");
      }
      onChange(uploadedUrl);
    } catch (e: any) {
      Notification(
        e?.response?.data?.message ||
          e?.message ||
          "No pudimos subir el archivo. Intentá de nuevo.",
        "error",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        disabled={uploading}
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {uploading && (
        <p className="text-sm text-gray-500 mt-2">Subiendo archivo…</p>
      )}
      {!uploading && url && (
        <div className="mt-3">
          {isImageUrl(url) ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <img
                src={url}
                alt="Archivo subido"
                className="max-h-48 rounded-lg border border-gray-200 object-contain"
              />
            </a>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline break-all"
            >
              Ver archivo subido
            </a>
          )}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  error,
  id,
}: QuestionRendererProps) {
  const renderInput = () => {
    switch (question.type) {
      case FieldType.SHORT_TEXT:
        return (
          <Input
            placeholder="Tu respuesta..."
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          />
        );

      case FieldType.PARAGRAPH:
        return (
          <Textarea
            placeholder="Tu respuesta..."
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full min-h-[100px]"
            rows={4}
          />
        );

      case FieldType.NUMBER:
        return (
          <Input
            type="number"
            placeholder="Ingresa un número..."
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          />
        );

      case FieldType.OPTIONS:
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          >
            {question.options?.map((option, index) => (
              <Radio key={index} value={option} className="mb-2">
                {option}
              </Radio>
            ))}
          </RadioGroup>
        );

      case FieldType.FILE:
        return (
          <FileQuestionInput value={value} onChange={onChange} error={error} />
        );

      case FieldType.SCALE: {
        const answered = isAnswered(value);
        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">1</span>
              <span
                className={
                  answered
                    ? "text-sm font-medium"
                    : "text-sm font-medium text-gray-400 italic"
                }
              >
                {answered ? `Valor: ${value}` : "Sin responder"}
              </span>
              <span className="text-sm text-gray-500">10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={answered ? value : DEFAULT_SCALE_VALUE}
              onChange={(e) => onChange(Number(e.target.value))}
              // Soltar el slider donde ya estaba no dispara change, así que sin
              // esto el valor que muestra por defecto nunca se puede elegir.
              onPointerUp={(e) => onChange(Number(e.currentTarget.value))}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
                answered ? "bg-gray-200" : "bg-gray-100"
              }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      }

      default:
        return (
          <Input
            placeholder="Tu respuesta..."
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            isInvalid={!!error}
            errorMessage={error}
            className="w-full"
          />
        );
    }
  };

  return (
    <div id={id} className="mb-6 scroll-mt-24">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {question.question}
      </label>
      {renderInput()}
    </div>
  );
}
