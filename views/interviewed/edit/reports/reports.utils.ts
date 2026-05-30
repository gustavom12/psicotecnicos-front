import {
  Report,
  ReportStatus,
  InterviewMeta,
} from "./reports.types";

/** Color tailwind para el badge de estado del reporte. */
export const statusColor = (status: ReportStatus): string => {
  switch (status) {
    case "FINISHED":
      return "bg-green-100 text-green-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "DRAFT":
      return "bg-yellow-100 text-yellow-800";
    case "ARCHIVED":
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/** Formatea una fecha ISO a "DD MMM YYYY HH:mm" en es-AR. */
export const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

/** Decide el título a mostrar para un reporte. */
export const buildReportTitle = (
  report: Pick<Report, "_id" | "title">,
  interview?: Pick<InterviewMeta, "title">,
): string =>
  interview?.title ||
  report.title ||
  `Informe ${report._id.slice(-6).toUpperCase()}`;

/** Última versión del reporte (la vigente). */
export const getLastVersion = (report: Report) =>
  report.versions?.[report.versions.length - 1];
