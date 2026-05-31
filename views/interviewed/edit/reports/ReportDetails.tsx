import React from "react";
import { ReportContent, Veredicto } from "./reports.types";

/* -----------------------------------------------------------------------------
 * Primitivos de UI compartidos por la vista de detalle.
 * --------------------------------------------------------------------------- */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h6 className="font-semibold text-gray-800 uppercase tracking-wide text-xs mb-3 border-b border-gray-100 pb-1">
      {title}
    </h6>
    {children}
  </div>
);

const Narrative: React.FC<{ text: string }> = ({ text }) => (
  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{text}</p>
);

const BadgeRow: React.FC<{
  label: string;
  value: string;
  colorClass?: string;
}> = ({ label, value, colorClass = "bg-gray-100 text-gray-700" }) => (
  <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
    <span className="text-gray-500 text-xs">{label}</span>
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {value}
    </span>
  </div>
);

const ListItems: React.FC<{ items: string[]; icon: string }> = ({
  items,
  icon,
}) => (
  <ul className="space-y-1">
    {items.map((it, i) => (
      <li key={i} className="text-gray-700 flex items-start gap-2">
        <span className="shrink-0 mt-0.5">{icon}</span>
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const veredictoStyle = (v: Veredicto) => {
  if (v === "RECOMENDABLE")
    return "bg-green-100 text-green-800 border border-green-200";
  if (v === "RECOMENDABLE CON RESERVAS")
    return "bg-yellow-100 text-yellow-800 border border-yellow-200";
  return "bg-red-100 text-red-800 border border-red-200";
};

/* -----------------------------------------------------------------------------
 * Vista del content estructurado del reporte.
 * --------------------------------------------------------------------------- */

interface Props {
  content: ReportContent;
}

const ReportDetails: React.FC<Props> = ({ content }) => {
  if (!content) return null;
  const c = content;

  return (
    <div className="space-y-6 text-sm">
      {/* 1. PRESENTACIÓN */}
      {c.presentacion && (
        <Section title="Presentación">
          <Narrative text={c.presentacion.narrativa} />
          {c.presentacion.datosRelevantes && (
            <div className="mt-3 border border-gray-100 rounded-md p-3 space-y-1 bg-gray-50">
              <BadgeRow
                label="Disposición en entrevista"
                value={c.presentacion.datosRelevantes.disposicionEnEntrevista}
              />
              {c.presentacion.datosRelevantes.estilosComunicativos?.length >
                0 && (
                <div className="flex items-start justify-between py-1">
                  <span className="text-gray-500 text-xs shrink-0">
                    Estilo comunicativo
                  </span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {c.presentacion.datosRelevantes.estilosComunicativos.map(
                      (e, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                        >
                          {e}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
              {c.presentacion.datosRelevantes
                .antecedentesLaboralesDestacados && (
                <div className="pt-1 text-xs text-gray-600">
                  <span className="font-medium">Trayectoria destacada: </span>
                  {
                    c.presentacion.datosRelevantes
                      .antecedentesLaboralesDestacados
                  }
                </div>
              )}
              {c.presentacion.datosRelevantes.motivacionPostulacion && (
                <div className="pt-1 text-xs text-gray-600">
                  <span className="font-medium">Motivación: </span>
                  {c.presentacion.datosRelevantes.motivacionPostulacion}
                </div>
              )}
            </div>
          )}
        </Section>
      )}

      {/* 2. ASPECTOS INTELECTUALES */}
      {c.aspectosIntelectuales && (
        <Section title="Aspectos Intelectuales">
          <Narrative text={c.aspectosIntelectuales.narrativa} />
          <div className="mt-3 border border-gray-100 rounded-md p-3 space-y-1 bg-gray-50">
            <BadgeRow
              label="Nivel de capacidad"
              value={c.aspectosIntelectuales.nivelCapacidad}
            />
            <BadgeRow
              label="Estilo cognitivo"
              value={c.aspectosIntelectuales.estiloCognitivo}
            />
          </div>
          {c.aspectosIntelectuales.puntosDestacados?.length > 0 && (
            <div className="mt-3">
              <ListItems
                items={c.aspectosIntelectuales.puntosDestacados}
                icon="•"
              />
            </div>
          )}
        </Section>
      )}

      {/* 3. MODALIDAD DE VINCULACIÓN */}
      {c.modalidadVinculacion && (
        <Section title="Modalidad de Vinculación">
          <Narrative text={c.modalidadVinculacion.narrativa} />
          <div className="mt-3 border border-gray-100 rounded-md p-3 space-y-1 bg-gray-50">
            <BadgeRow
              label="Preferencia laboral"
              value={c.modalidadVinculacion.preferenciaLaboral}
            />
            <BadgeRow
              label="Gestión de conflictos"
              value={c.modalidadVinculacion.gestionConflictos}
            />
            <BadgeRow
              label="Relación con jerarquía"
              value={c.modalidadVinculacion.relacionConJerarquia}
            />
          </div>
          {c.modalidadVinculacion.puntosDestacados?.length > 0 && (
            <div className="mt-3">
              <ListItems
                items={c.modalidadVinculacion.puntosDestacados}
                icon="•"
              />
            </div>
          )}
        </Section>
      )}

      {/* 4. MODALIDAD LABORAL */}
      {c.modalidadLaboral && (
        <Section title="Modalidad Laboral">
          <Narrative text={c.modalidadLaboral.narrativa} />
          <div className="mt-3 border border-gray-100 rounded-md p-3 space-y-1 bg-gray-50">
            <BadgeRow
              label="Estilo de ejecución"
              value={c.modalidadLaboral.estiloEjecucion}
            />
            <BadgeRow
              label="Organización"
              value={c.modalidadLaboral.nivelOrganizacion}
            />
            <BadgeRow
              label="Adaptación al cambio"
              value={c.modalidadLaboral.adaptacionAlCambio}
            />
            {c.modalidadLaboral.aspiraciones && (
              <div className="pt-1 text-xs text-gray-600">
                <span className="font-medium">Aspiraciones: </span>
                {c.modalidadLaboral.aspiraciones}
              </div>
            )}
          </div>
          {c.modalidadLaboral.puntosDestacados?.length > 0 && (
            <div className="mt-3">
              <ListItems items={c.modalidadLaboral.puntosDestacados} icon="•" />
            </div>
          )}
        </Section>
      )}

      {/* 5. SÍNTESIS */}
      {c.sintesis && (
        <Section title="Síntesis">
          {c.sintesis.veredicto && (
            <div
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${veredictoStyle(c.sintesis.veredicto)}`}
            >
              {c.sintesis.veredicto}
            </div>
          )}
          <Narrative text={c.sintesis.narrativa} />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {c.sintesis.fortalezasClave?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Fortalezas clave
                </p>
                <ListItems items={c.sintesis.fortalezasClave} icon="✅" />
              </div>
            )}
            {c.sintesis.areasDeDesarrollo?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Áreas de desarrollo
                </p>
                <ListItems items={c.sintesis.areasDeDesarrollo} icon="🛠️" />
              </div>
            )}
            {c.sintesis.riesgosYAlertas?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Riesgos y alertas
                </p>
                <ListItems items={c.sintesis.riesgosYAlertas} icon="⚠️" />
              </div>
            )}
            {c.sintesis.recomendacionesParaLaOrganizacion?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Recomendaciones
                </p>
                <ListItems
                  items={c.sintesis.recomendacionesParaLaOrganizacion}
                  icon="💡"
                />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Limitaciones */}
      {c.limitations && c.limitations.trim() && (
        <Section title="Limitaciones">
          <p className="text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md p-3">
            {c.limitations}
          </p>
        </Section>
      )}
    </div>
  );
};

export default ReportDetails;
