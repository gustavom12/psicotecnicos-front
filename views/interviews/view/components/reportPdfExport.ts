import { Report } from "@/views/interviewed/edit/reports/reports.types";

export interface PdfMeta {
  interviewPosition?: string;
  interviewScheduledAt?: string;
  intervieweeNames?: string[];
  professionalNames?: string[];
  companyName?: string;
}

function esc(s?: string | null): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function narrative(text?: string): string {
  if (!text?.trim()) return "";
  return `<p class="narrative">${esc(text).replace(/\n/g, "<br/>")}</p>`;
}

function badge(label: string, value?: string): string {
  if (!value?.trim()) return "";
  return `<div class="badge-row"><strong>${label}:</strong> ${esc(value)}</div>`;
}

function bulletList(title: string, items?: string[]): string {
  if (!items?.length) return "";
  return `<div class="list-block">
    <div class="list-title">${title}</div>
    <ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  </div>`;
}

export function buildReportPdfHtml(report: Report, meta: PdfMeta = {}): string {
  const c = report.content;
  const {
    interviewPosition,
    interviewScheduledAt,
    intervieweeNames = [],
    professionalNames = [],
    companyName,
  } = meta;

  const candidateName = intervieweeNames.join(", ") || "—";
  const professional = professionalNames.join(", ") || "—";
  const position = interviewPosition || "—";
  const company = companyName || "—";
  const dateStr = interviewScheduledAt
    ? new Date(interviewScheduledAt).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  const veredicto = c?.sintesis?.veredicto ?? "";
  const veredictoClass =
    veredicto === "RECOMENDABLE"
      ? "veredicto-green"
      : veredicto === "RECOMENDABLE CON RESERVAS"
        ? "veredicto-yellow"
        : "veredicto-red";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Psicolaboral — ${esc(candidateName)}</title>
  <style>
    @page { margin: 2.5cm 2cm; size: A4 portrait; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      font-size: 11pt;
      color: #111;
      line-height: 1.7;
      background: white;
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header { text-align: center; margin-bottom: 32px; }
    .report-title {
      font-size: 20pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 3px;
      border-bottom: 3px double #111;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .consultora-name {
      font-size: 9.5pt;
      font-style: italic;
      color: #555;
      letter-spacing: 1.5px;
    }
    .info-table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 32px;
      font-size: 10.5pt;
    }
    .info-table td {
      padding: 5px 8px;
      border-bottom: 1px solid #ddd;
      vertical-align: top;
    }
    .info-table td.label {
      font-weight: bold;
      width: 38%;
      color: #333;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-bottom: 2px solid #111;
      padding-bottom: 4px;
      margin-top: 28px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }
    .narrative {
      text-align: justify;
      margin-bottom: 10px;
      font-size: 11pt;
    }
    .badge-row {
      font-size: 10.5pt;
      margin: 5px 0;
      color: #222;
    }
    .badge-row strong { color: #000; }
    .veredicto-block { margin: 14px 0 18px; }
    .veredicto {
      display: inline-block;
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      border: 2.5px solid #111;
      padding: 5px 18px;
    }
    .veredicto-green  { border-color: #166534; color: #166534; }
    .veredicto-yellow { border-color: #92400e; color: #92400e; }
    .veredicto-red    { border-color: #991b1b; color: #991b1b; }
    .lists-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 28px;
      margin-top: 16px;
    }
    .list-block { margin-bottom: 14px; }
    .list-title {
      font-weight: bold;
      font-size: 10pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #333;
      margin-bottom: 6px;
    }
    .list-block ul { padding-left: 18px; }
    .list-block li { margin-bottom: 4px; font-size: 10.5pt; }
    .limitations {
      font-size: 9.5pt;
      color: #555;
      border-left: 3px solid #ccc;
      padding: 8px 12px;
      margin-top: 20px;
      font-style: italic;
    }
    .footer {
      margin-top: 48px;
      border-top: 1px solid #ccc;
      padding-top: 10px;
      text-align: center;
      font-size: 9pt;
      color: #888;
    }
    @media print {
      body { padding: 0; max-width: none; }
      .section-title { page-break-after: avoid; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="report-title">Informe Psicolaboral</div>
    <div class="consultora-name">${esc(professional)}</div>
  </div>

  <table class="info-table">
    <tr><td class="label">Nombre y Apellido:</td><td>${esc(candidateName)}</td></tr>
    <tr><td class="label">Puesto a cubrir:</td><td>${esc(position)}</td></tr>
    <tr><td class="label">Empresa:</td><td>${esc(company)}</td></tr>
    <tr><td class="label">Fecha:</td><td>${esc(dateStr)}</td></tr>
  </table>

  <div class="section-title">Presentación</div>
  ${narrative(c?.presentacion?.narrativa)}

  <div class="section-title">Aspectos Intelectuales</div>
  ${narrative(c?.aspectosIntelectuales?.narrativa)}
  ${badge("Nivel de capacidad", c?.aspectosIntelectuales?.nivelCapacidad)}
  ${badge("Estilo cognitivo", c?.aspectosIntelectuales?.estiloCognitivo)}

  <div class="section-title">Modalidad de Vinculación</div>
  ${narrative(c?.modalidadVinculacion?.narrativa)}
  ${badge("Preferencia laboral", c?.modalidadVinculacion?.preferenciaLaboral)}
  ${badge("Gestión de conflictos", c?.modalidadVinculacion?.gestionConflictos)}
  ${badge("Relación con jerarquía", c?.modalidadVinculacion?.relacionConJerarquia)}

  <div class="section-title">Modalidad Laboral</div>
  ${narrative(c?.modalidadLaboral?.narrativa)}
  ${badge("Estilo de ejecución", c?.modalidadLaboral?.estiloEjecucion)}
  ${badge("Organización", c?.modalidadLaboral?.nivelOrganizacion)}
  ${badge("Adaptación al cambio", c?.modalidadLaboral?.adaptacionAlCambio)}

  <div class="section-title">Síntesis</div>
  ${veredicto ? `<div class="veredicto-block"><span class="veredicto ${veredictoClass}">${esc(veredicto)}</span></div>` : ""}
  ${narrative(c?.sintesis?.narrativa)}

  <div class="lists-grid">
    ${bulletList("Fortalezas clave", c?.sintesis?.fortalezasClave)}
    ${bulletList("Áreas de desarrollo", c?.sintesis?.areasDeDesarrollo)}
    ${bulletList("Riesgos y alertas", c?.sintesis?.riesgosYAlertas)}
    ${bulletList("Recomendaciones para la organización", c?.sintesis?.recomendacionesParaLaOrganizacion)}
  </div>

  ${c?.limitations?.trim() ? `<div class="limitations"><strong>Limitaciones:</strong> ${esc(c.limitations)}</div>` : ""}

  <div class="footer">
    Informe psicolaboral generado el ${new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
  </div>

</body>
</html>`;
}

export function openPdfPrintWindow(report: Report, meta: PdfMeta = {}): void {
  const html = buildReportPdfHtml(report, meta);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.addEventListener("load", () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 400);
  });
}
