export const fieldTypes = [
  { value: "shortText", label: "Texto corto" },
  { value: "paragraph", label: "Párrafo" },
  { value: "number", label: "Respuesta numérica" },
  { value: "options", label: "Opciones múltiples" },
  { value: "file", label: "Carga de archivos" },
  { value: "scale", label: "Escala lineal" },
] as const;

export type FieldType = (typeof fieldTypes)[number]["value"];

export interface DynamicField {
  id: string;
  type: FieldType;
  label: string;
  options?: string[]; // solo para options | scale
}

export interface FormValues {
  title: string;
  comments: string;
  timeSpent: string;
  screens: number | "";
  professional: DynamicField[];
  interviewer: DynamicField[];
}
