# Survey View para Entrevistados

Esta vista permite a los entrevistados completar encuestas psicotécnicas de manera interactiva.

## Características

### 🎯 Funcionalidades Principales
- **Navegación por slides**: Los entrevistados pueden navegar entre diferentes slides de la encuesta
- **Solo preguntas de entrevistados**: Muestra únicamente las preguntas dirigidas a entrevistados (no las del profesional)
- **Interfaz adaptativa**: Oculta automáticamente la sección de preguntas cuando no hay preguntas para el entrevistado
- **Validación inteligente**: Solo valida respuestas cuando hay preguntas presentes
- **Progreso visual**: Barra de progreso que muestra el avance en la encuesta
- **Seguimiento de tiempo**: Contador automático del tiempo en cada slide y tiempo total de entrevista
- **Métricas de comportamiento**: Registra visitas múltiples a slides y tiempo acumulado
- **Envío automático**: Al completar todas las preguntas, las respuestas se envían automáticamente

### 📝 Tipos de Preguntas Soportadas
- **Texto corto** (`shortText`): Campo de entrada de texto simple
- **Párrafo** (`paragraph`): Área de texto para respuestas largas
- **Número** (`number`): Campo numérico
- **Opciones múltiples** (`options`): Radio buttons para selección única
- **Archivo** (`file`): Carga de archivos
- **Escala** (`scale`): Slider de 1 a 10

## Estructura de Archivos

```
survey-view/
├── SurveyView.tsx              # Componente principal
├── components/
│   ├── QuestionRenderer.tsx    # Renderiza diferentes tipos de preguntas
│   ├── SlideView.tsx          # Renderiza un slide completo
│   └── TimeDisplay.tsx        # Muestra información de tiempo
├── hooks/
│   └── useTimeTracker.ts      # Hook para seguimiento de tiempo
└── interviewer/
    └── index.tsx              # Punto de entrada para entrevistados
```

## ⏱️ Sistema de Seguimiento de Tiempo

### Métricas Registradas
- **Tiempo por slide**: Tiempo actual en el slide y tiempo total acumulado
- **Visitas múltiples**: Contador de cuántas veces se visitó cada slide
- **Tiempo total**: Duración completa de la entrevista
- **Timestamps**: Hora de inicio y finalización de cada slide

### Visualización Sutil en Tiempo Real
- **Indicador discreto**: Pequeño punto flotante en la esquina superior derecha
- **Vista mínima**: Solo muestra tiempo actual con punto pulsante
- **Vista expandida**: Al hacer hover muestra detalles completos
- **No intrusivo**: Diseño que no distrae durante la entrevista
- **Información completa**: Tiempo actual, acumulado, progreso y visitas

### Datos Enviados al Backend
```json
{
  "slideTimeData": [
    {
      "slideIndex": 0,
      "formId": "form-id",
      "startTime": "2023-12-01T10:00:00Z",
      "endTime": "2023-12-01T10:02:30Z",
      "totalTimeSeconds": 150,
      "visitCount": 1
    }
  ],
  "totalInterviewTimeSeconds": 1800,
  "startedAt": "2023-12-01T10:00:00Z",
  "completedAt": "2023-12-01T10:30:00Z"
}
```

## Uso

### 1. Acceso directo por URL
```
/survey/[surveyId]?intervieweeId=123
```

### 2. Desde el componente
```tsx
import SurveyView from './views/interviewers-view/survey-view/SurveyView';

<SurveyView 
  surveyId="survey-123"
  intervieweeId="interviewee-456"
/>
```

## Flujo de Datos

1. **Carga inicial**: Se obtiene el survey y sus modules/forms asociados
   - Si el survey tiene `modules`, se cargan los forms ordenados por `module.order`
   - Si el survey tiene `forms` directamente, se usan esos IDs
2. **Renderizado**: Se muestran solo las preguntas del entrevistado del slide actual
3. **Navegación**: El usuario puede navegar entre slides (con validación)
4. **Envío**: Al completar, las respuestas se envían al endpoint `/interviews`

## Estructura del Survey

El sistema soporta dos estructuras de survey:

### Estructura con Modules (Actual)
```json
{
  "_id": "68c59d38f630c047a5d782d9",
  "name": "Primer evaluacion completa, 2 modulos",
  "teamId": "680040a2cf48bd0a98beed4a",
  "position": "Programador web",
  "description": "Desarrollador junior",
  "modules": [
    {
      "order": 1,
      "id": "68c59aaef630c047a5d782c0"
    },
    {
      "order": 2,
      "id": "68c59cf5f630c047a5d782cb"
    }
  ]
}
```

### Estructura con Forms Directos (Fallback)
```json
{
  "_id": "survey-id",
  "name": "Survey Name",
  "forms": ["form-id-1", "form-id-2"]
}
```

## APIs Utilizadas

La aplicación utiliza `apiConnection` (axios) para comunicarse directamente con el backend:

### GET `/surveys/[id]`
Obtiene los datos del survey incluyendo forms asociados.

### GET `/forms/[id]`
Obtiene los slides y preguntas de un form específico.

### POST `/interviews`
Envía las respuestas completadas de la entrevista.

> **Nota**: Se utiliza `apiConnection` de `pages/api/api.ts` que maneja automáticamente:
> - Headers de autorización (Bearer token)
> - Base URL del backend
> - Interceptors para manejo de errores

**Estructura del payload:**
```json
{
  "surveyId": "survey-123",
  "intervieweeId": "interviewee-456", 
  "responses": [
    {
      "questionId": "form1_0_0",
      "slideIndex": 0,
      "formId": "form1",
      "answer": "Mi respuesta",
      "questionType": "shortText"
    }
  ],
  "completedAt": "2023-12-01T10:00:00Z"
}
```

## Personalización

### Estilos
Los componentes usan TailwindCSS y HeroUI. Puedes personalizar:
- Colores del tema
- Espaciado y layout
- Animaciones de transición

### Validación
Actualmente todas las preguntas son requeridas. Para hacer preguntas opcionales, modifica la función `validateCurrentSlide` en `SurveyView.tsx`.

### Tipos de Pregunta
Para agregar nuevos tipos de pregunta, edita:
1. `FieldType` enum en `types/survey.types.ts`
2. `QuestionRenderer.tsx` para el renderizado
3. Schema del backend si es necesario

## Comportamiento de Slides

### Slides con Preguntas
- Muestra la sección "Preguntas" con todas las preguntas del entrevistado
- Valida que todas las preguntas estén respondidas antes de continuar
- Aplica estilos con separadores y espaciado completo

### Slides sin Preguntas
- Oculta completamente la sección de preguntas
- No aplica validaciones (permite navegación libre)
- Reduce el espaciado para un diseño más compacto
- Solo muestra el contenido del slide (título, HTML, comentarios)

## Consideraciones

- Las respuestas se almacenan en estado local hasta el envío final
- No hay funcionalidad de guardado automático (draft)
- La navegación hacia atrás permite modificar respuestas anteriores
- Los archivos subidos se manejan como File objects hasta el envío
- Slides informativos (sin preguntas) permiten navegación inmediata
