/**
 * Tipos del contrato de la API de reportes.
 * Fuente de verdad: psico-api/src/reports/usecases/report.prompt.ts
 */

export type ReportStatus = "DRAFT" | "IN_PROGRESS" | "FINISHED" | "ARCHIVED";

export type Veredicto =
  | "RECOMENDABLE"
  | "RECOMENDABLE CON RESERVAS"
  | "NO RECOMENDABLE";

export type DisposicionEntrevista =
  | "muy buena"
  | "buena"
  | "regular"
  | "escasa";
export type NivelCapacidad =
  | "por debajo del promedio"
  | "promedio"
  | "por encima del promedio";
export type EstiloCognitivo =
  | "analítico"
  | "sintético"
  | "analítico-sintético"
  | "concreto"
  | "abstracto";
export type PreferenciaLaboral =
  | "individual"
  | "grupal"
  | "ambos según contexto";
export type GestionConflictos =
  | "evitativa"
  | "frontal-directa"
  | "asertiva"
  | "diplomática"
  | "mixta";
export type RelacionJerarquia = "adecuada" | "con reservas" | "desafiante";
export type EstiloEjecucion =
  | "ágil-dinámico"
  | "metódico-prolijo"
  | "mixto"
  | "variable";
export type NivelOrganizacion = "bajo" | "medio" | "alto";
export type AdaptacionAlCambio = "baja" | "media" | "alta";

export interface Presentacion {
  narrativa: string;
  datosRelevantes: {
    disposicionEnEntrevista: DisposicionEntrevista;
    estilosComunicativos: string[];
    antecedentesLaboralesDestacados: string;
    motivacionPostulacion: string;
  };
}

export interface AspectosIntelectuales {
  narrativa: string;
  nivelCapacidad: NivelCapacidad;
  estiloCognitivo: EstiloCognitivo;
  puntosDestacados: string[];
}

export interface ModalidadVinculacion {
  narrativa: string;
  preferenciaLaboral: PreferenciaLaboral;
  gestionConflictos: GestionConflictos;
  relacionConJerarquia: RelacionJerarquia;
  puntosDestacados: string[];
}

export interface ModalidadLaboral {
  narrativa: string;
  estiloEjecucion: EstiloEjecucion;
  nivelOrganizacion: NivelOrganizacion;
  adaptacionAlCambio: AdaptacionAlCambio;
  aspiraciones: string;
  puntosDestacados: string[];
}

export interface Sintesis {
  veredicto: Veredicto;
  narrativa: string;
  fortalezasClave: string[];
  areasDeDesarrollo: string[];
  riesgosYAlertas: string[];
  recomendacionesParaLaOrganizacion: string[];
}

export interface ReportContent {
  presentacion: Presentacion;
  aspectosIntelectuales: AspectosIntelectuales;
  modalidadVinculacion: ModalidadVinculacion;
  modalidadLaboral: ModalidadLaboral;
  sintesis: Sintesis;
  limitations: string;
}

export interface ReportVersion {
  _id: string;
  content: ReportContent;
  generatedAt: string;
  model: string;
  feedback?: string;
  generationContext?: Record<string, any>;
}

export interface ReportNote {
  _id: string;
  text: string;
  authorId?: string;
  createdAt: string;
}

export interface ReportAttachment {
  _id: string;
  url: string;
  type: string;
  description?: string;
  addedBy?: string;
  addedAt: string;
}

export interface Report {
  _id: string;
  title?: string;
  status: ReportStatus;
  interviewId: string;
  grainEventId?: string;
  content: ReportContent;
  versions: ReportVersion[];
  notes: ReportNote[];
  attachments: ReportAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewMeta {
  _id: string;
  title?: string;
  position?: string;
  scheduledAt?: string;
  shortId?: string;
}
