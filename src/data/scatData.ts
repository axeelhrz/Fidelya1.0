import { SCATSection } from '../types/scatForm';

export const SCAT_SECTIONS: SCATSection[] = [
  {
    id: 'ci',
    name: 'CI',
    title: 'Causas Inmediatas o Directas',
    description: 'Identifica las causas inmediatas que llevaron directamente al incidente',
    totalCauses: 7,
    causes: [
      {
        id: 'ci-1',
        number: '1',
        title: 'Actos Inseguros',
        description: 'Comportamientos o acciones que pueden resultar en un accidente',
        subcauses: [
          { id: 'ci-1-1', number: '1.1', text: 'Operar sin autorización' },
          { id: 'ci-1-2', number: '1.2', text: 'No advertir o asegurar' },
          { id: 'ci-1-3', number: '1.3', text: 'Operar a velocidad inadecuada' },
          { id: 'ci-1-4', number: '1.4', text: 'Poner fuera de servicio dispositivos de seguridad' },
          { id: 'ci-1-5', number: '1.5', text: 'Usar equipo defectuoso' },
          { id: 'ci-1-6', number: '1.6', text: 'Usar de manera inadecuada el equipo' },
          { id: 'ci-1-7', number: '1.7', text: 'No usar el equipo de protección personal' },
          { id: 'ci-1-8', number: '1.8', text: 'Carga inadecuada' },
          { id: 'ci-1-9', number: '1.9', text: 'Ubicación inadecuada' },
          { id: 'ci-1-10', number: '1.10', text: 'Levantamiento inadecuado' },
          { id: 'ci-1-11', number: '1.11', text: 'Posición inadecuada para la tarea' },
          { id: 'ci-1-12', number: '1.12', text: 'Mantenimiento inadecuado del equipo en marcha' },
          { id: 'ci-1-13', number: '1.13', text: 'Bromas pesadas' },
          { id: 'ci-1-14', number: '1.14', text: 'Bajo la influencia del alcohol y/o drogas' }
        ]
      },
      {
        id: 'ci-2',
        number: '2',
        title: 'Condiciones Inseguras',
        description: 'Condiciones físicas o ambientales peligrosas',
        subcauses: [
          { id: 'ci-2-1', number: '2.1', text: 'Protecciones y resguardos inadecuados' },
          { id: 'ci-2-2', number: '2.2', text: 'Equipos de protección inadecuados o insuficientes' },
          { id: 'ci-2-3', number: '2.3', text: 'Herramientas, equipos o materiales defectuosos' },
          { id: 'ci-2-4', number: '2.4', text: 'Espacio limitado para desenvolverse' },
          { id: 'ci-2-5', number: '2.5', text: 'Sistemas de advertencia inadecuados' },
          { id: 'ci-2-6', number: '2.6', text: 'Peligro de incendio y explosión' },
          { id: 'ci-2-7', number: '2.7', text: 'Orden y limpieza deficientes' },
          { id: 'ci-2-8', number: '2.8', text: 'Condiciones ambientales peligrosas' },
          { id: 'ci-2-9', number: '2.9', text: 'Iluminación deficiente' },
          { id: 'ci-2-10', number: '2.10', text: 'Ventilación deficiente' }
        ]
      },
      {
        id: 'ci-3',
        number: '3',
        title: 'Factores del Trabajo',
        description: 'Aspectos relacionados con la organización del trabajo',
        subcauses: [
          { id: 'ci-3-1', number: '3.1', text: 'Supervisión inadecuada' },
          { id: 'ci-3-2', number: '3.2', text: 'Ingeniería inadecuada' },
          { id: 'ci-3-3', number: '3.3', text: 'Adquisiciones inadecuadas' },
          { id: 'ci-3-4', number: '3.4', text: 'Mantenimiento inadecuado' },
          { id: 'ci-3-5', number: '3.5', text: 'Herramientas y equipos inadecuados' },
          { id: 'ci-3-6', number: '3.6', text: 'Estándares de trabajo inadecuados' },
          { id: 'ci-3-7', number: '3.7', text: 'Uso y desgaste' },
          { id: 'ci-3-8', number: '3.8', text: 'Abuso o mal uso' }
        ]
      },
      {
        id: 'ci-4',
        number: '4',
        title: 'Factores Personales',
        description: 'Características individuales que pueden influir en el incidente',
        subcauses: [
          { id: 'ci-4-1', number: '4.1', text: 'Capacidad física/fisiológica inadecuada' },
          { id: 'ci-4-2', number: '4.2', text: 'Capacidad mental/psicológica inadecuada' },
          { id: 'ci-4-3', number: '4.3', text: 'Tensión física o fisiológica' },
          { id: 'ci-4-4', number: '4.4', text: 'Tensión mental o psicológica' },
          { id: 'ci-4-5', number: '4.5', text: 'Falta de conocimiento' },
          { id: 'ci-4-6', number: '4.6', text: 'Falta de habilidad' },
          { id: 'ci-4-7', number: '4.7', text: 'Motivación incorrecta' }
        ]
      },
      {
        id: 'ci-5',
        number: '5',
        title: 'Factores de Gestión',
        description: 'Aspectos relacionados con la gestión y administración',
        subcauses: [
          { id: 'ci-5-1', number: '5.1', text: 'Liderazgo y/o supervisión inadecuados' },
          { id: 'ci-5-2', number: '5.2', text: 'Ingeniería inadecuada' },
          { id: 'ci-5-3', number: '5.3', text: 'Adquisiciones inadecuadas' },
          { id: 'ci-5-4', number: '5.4', text: 'Mantenimiento inadecuado' },
          { id: 'ci-5-5', number: '5.5', text: 'Herramientas y equipos inadecuados' },
          { id: 'ci-5-6', number: '5.6', text: 'Estándares de trabajo inadecuados' },
          { id: 'ci-5-7', number: '5.7', text: 'Uso y desgaste' },
          { id: 'ci-5-8', number: '5.8', text: 'Abuso o mal uso' }
        ]
      },
      {
        id: 'ci-6',
        number: '6',
        title: 'Factores Ambientales',
        description: 'Condiciones del entorno que pueden contribuir al incidente',
        subcauses: [
          { id: 'ci-6-1', number: '6.1', text: 'Condiciones meteorológicas adversas' },
          { id: 'ci-6-2', number: '6.2', text: 'Terreno irregular' },
          { id: 'ci-6-3', number: '6.3', text: 'Espacios confinados' },
          { id: 'ci-6-4', number: '6.4', text: 'Exposición a sustancias tóxicas' },
          { id: 'ci-6-5', number: '6.5', text: 'Ruido excesivo' },
          { id: 'ci-6-6', number: '6.6', text: 'Vibraciones' },
          { id: 'ci-6-7', number: '6.7', text: 'Temperaturas extremas' }
        ]
      },
      {
        id: 'ci-7',
        number: '7',
        title: 'Factores de Comunicación',
        description: 'Problemas en la comunicación que pueden llevar a incidentes',
        subcauses: [
          { id: 'ci-7-1', number: '7.1', text: 'Instrucciones inadecuadas' },
          { id: 'ci-7-2', number: '7.2', text: 'Advertencias inadecuadas' },
          { id: 'ci-7-3', number: '7.3', text: 'Procedimientos no comunicados' },
          { id: 'ci-7-4', number: '7.4', text: 'Idioma/lenguaje inadecuado' },
          { id: 'ci-7-5', number: '7.5', text: 'Retroalimentación inadecuada' }
        ]
      }
    ]
  },
  {
    id: 'cb',
    name: 'CB',
    title: 'Causas Básicas / Subyacentes',
    description: 'Identifica las causas fundamentales que originaron las causas inmediatas',
    totalCauses: 15,
    causes: [
      {
        id: 'cb-1',
        number: '1',
        title: 'Capacidad Física / Fisiológica Inadecuada',
        nacReferences: 'Ver NAC 6,9,12,15,18',
        subcauses: [
          { id: 'cb-1-1', number: '1.1', text: 'Estatura, peso, fuerza inadecuados' },
          { id: 'cb-1-2', number: '1.2', text: 'Rango de movimiento corporal limitado' },
          { id: 'cb-1-3', number: '1.3', text: 'Capacidad limitada para mantener posiciones corporales' },
          { id: 'cb-1-4', number: '1.4', text: 'Sensibilidad a ciertas sustancias o alergias' },
          { id: 'cb-1-5', number: '1.5', text: 'Sensibilidad a extremos sensoriales' },
          { id: 'cb-1-6', number: '1.6', text: 'Defecto de visión' },
          { id: 'cb-1-7', number: '1.7', text: 'Defecto de audición' },
          { id: 'cb-1-8', number: '1.8', text: 'Otras deficiencias sensoriales' },
          { id: 'cb-1-9', number: '1.9', text: 'Incapacidad respiratoria' },
          { id: 'cb-1-10', number: '1.10', text: 'Otras incapacidades físicas permanentes' },
          { id: 'cb-1-11', number: '1.11', text: 'Incapacidades temporales' }
        ]
      },
      {
        id: 'cb-2',
        number: '2',
        title: 'Capacidad Mental/Psicológica Inadecuada',
        nacReferences: 'Ver NAC 6,9,12,15,18',
        subcauses: [
          { id: 'cb-2-1', number: '2.1', text: 'Miedos y fobias' },
          { id: 'cb-2-2', number: '2.2', text: 'Problemas emocionales' },
          { id: 'cb-2-3', number: '2.3', text: 'Enfermedad mental' },
          { id: 'cb-2-4', number: '2.4', text: 'Nivel de inteligencia' },
          { id: 'cb-2-5', number: '2.5', text: 'Incapacidad de comprensión' },
          { id: 'cb-2-6', number: '2.6', text: 'Falta de juicio' },
          { id: 'cb-2-7', number: '2.7', text: 'Coordinación deficiente' },
          { id: 'cb-2-8', number: '2.8', text: 'Tiempo de reacción lento' },
          { id: 'cb-2-9', number: '2.9', text: 'Aptitud mecánica deficiente' },
          { id: 'cb-2-10', number: '2.10', text: 'Incapacidad de aprendizaje' },
          { id: 'cb-2-11', number: '2.11', text: 'Problemas de memoria' }
        ]
      },
      {
        id: 'cb-3',
        number: '3',
        title: 'Tensión Física o Fisiológica',
        nacReferences: 'Ver NAC 6,9,12,15,18',
        subcauses: [
          { id: 'cb-3-1', number: '3.1', text: 'Lesión o enfermedad' },
          { id: 'cb-3-2', number: '3.2', text: 'Fatiga debido a la carga o duración de la tarea' },
          { id: 'cb-3-3', number: '3.3', text: 'Fatiga debido a la falta de descanso' },
          { id: 'cb-3-4', number: '3.4', text: 'Fatiga debido a sobrecarga sensorial' },
          { id: 'cb-3-5', number: '3.5', text: 'Exposición a riesgos contra la salud' },
          { id: 'cb-3-6', number: '3.6', text: 'Exposición a temperaturas extremas' },
          { id: 'cb-3-7', number: '3.7', text: 'Insuficiencia de oxígeno' },
          { id: 'cb-3-8', number: '3.8', text: 'Variaciones en la presión atmosférica' },
          { id: 'cb-3-9', number: '3.9', text: 'Vibración' },
          { id: 'cb-3-10', number: '3.10', text: 'Insuficiencia de azúcar en sangre' },
          { id: 'cb-3-11', number: '3.11', text: 'Ingestión de drogas' }
        ]
      },
      {
        id: 'cb-4',
        number: '4',
        title: 'Tensión Mental o Psicológica',
        nacReferences: 'Ver NAC 6,9,12,15,18',
        subcauses: [
          { id: 'cb-4-1', number: '4.1', text: 'Sobrecarga emocional' },
          { id: 'cb-4-2', number: '4.2', text: 'Fatiga debido a la carga o duración de la tarea mental' },
          { id: 'cb-4-3', number: '4.3', text: 'Problemas financieros extremos' },
          { id: 'cb-4-4', number: '4.4', text: 'Problemas familiares' },
          { id: 'cb-4-5', number: '4.5', text: 'Problemas emocionales' },
          { id: 'cb-4-6', number: '4.6', text: 'Enfermedad en la familia' },
          { id: 'cb-4-7', number: '4.7', text: 'Muerte en la familia' },
          { id: 'cb-4-8', number: '4.8', text: 'Problemas maritales' },
          { id: 'cb-4-9', number: '4.9', text: 'Frustración' },
          { id: 'cb-4-10', number: '4.10', text: 'Conflictos de personalidad' },
          { id: 'cb-4-11', number: '4.11', text: 'Enfermedad mental' }
        ]
      },
      {
        id: 'cb-5',
        number: '5',
        title: 'Falta de Conocimientos',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-5-1', number: '5.1', text: 'Falta de experiencia' },
          { id: 'cb-5-2', number: '5.2', text: 'Orientación inadecuada' },
          { id: 'cb-5-3', number: '5.3', text: 'Entrenamiento inicial inadecuado' },
          { id: 'cb-5-4', number: '5.4', text: 'Reentrenamiento inadecuado' },
          { id: 'cb-5-5', number: '5.5', text: 'Instrucciones malentendidas' }
        ]
      },
      {
        id: 'cb-6',
        number: '6',
        title: 'Falta de Habilidad',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-6-1', number: '6.1', text: 'Instrucción inicial inadecuada' },
          { id: 'cb-6-2', number: '6.2', text: 'Práctica inadecuada' },
          { id: 'cb-6-3', number: '6.3', text: 'Operación esporádica' },
          { id: 'cb-6-4', number: '6.4', text: 'Falta de preparación' },
          { id: 'cb-6-5', number: '6.5', text: 'Falta de habilidades de liderazgo' }
        ]
      },
      {
        id: 'cb-7',
        number: '7',
        title: 'Motivación Incorrecta',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-7-1', number: '7.1', text: 'El desempeño incorrecto es premiado' },
          { id: 'cb-7-2', number: '7.2', text: 'El desempeño correcto no es premiado' },
          { id: 'cb-7-3', number: '7.3', text: 'El desempeño correcto es castigado' },
          { id: 'cb-7-4', number: '7.4', text: 'Falta de incentivos' },
          { id: 'cb-7-5', number: '7.5', text: 'Frustración excesiva' },
          { id: 'cb-7-6', number: '7.6', text: 'Agresión indebida' },
          { id: 'cb-7-7', number: '7.7', text: 'Intento indebido de ahorrar tiempo' },
          { id: 'cb-7-8', number: '7.8', text: 'Intento indebido de evitar esfuerzo' },
          { id: 'cb-7-9', number: '7.9', text: 'Intento indebido de evitar incomodidad' },
          { id: 'cb-7-10', number: '7.10', text: 'Intento indebido de llamar la atención' },
          { id: 'cb-7-11', number: '7.11', text: 'Presión indebida de los compañeros' },
          { id: 'cb-7-12', number: '7.12', text: 'Ejemplo personal deficiente por parte de la supervisión' },
          { id: 'cb-7-13', number: '7.13', text: 'Retroalimentación deficiente o incorrecta' },
          { id: 'cb-7-14', number: '7.14', text: 'Incentivos de producción incorrectos' }
        ]
      },
      {
        id: 'cb-8',
        number: '8',
        title: 'Liderazgo y/o Supervisión Inadecuados',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-8-1', number: '8.1', text: 'Relaciones jerárquicas confusas o conflictivas' },
          { id: 'cb-8-2', number: '8.2', text: 'Asignación de responsabilidades confusas o conflictivas' },
          { id: 'cb-8-3', number: '8.3', text: 'Delegación inadecuada o insuficiente' },
          { id: 'cb-8-4', number: '8.4', text: 'Definición inadecuada de políticas' },
          { id: 'cb-8-5', number: '8.5', text: 'Formulación inadecuada de objetivos' },
          { id: 'cb-8-6', number: '8.6', text: 'Formulación inadecuada de estándares de trabajo' },
          { id: 'cb-8-7', number: '8.7', text: 'Formulación inadecuada de procedimientos de trabajo' },
          { id: 'cb-8-8', number: '8.8', text: 'Programación o planificación inadecuada del trabajo' },
          { id: 'cb-8-9', number: '8.9', text: 'Instrucciones de trabajo inadecuadas' },
          { id: 'cb-8-10', number: '8.10', text: 'Orientación y entrenamiento inadecuados' },
          { id: 'cb-8-11', number: '8.11', text: 'Provisión inadecuada de referencias, documentos y guías' },
          { id: 'cb-8-12', number: '8.12', text: 'Identificación y evaluación inadecuadas de exposiciones a pérdidas' },
          { id: 'cb-8-13', number: '8.13', text: 'Falta de conocimiento del trabajo por parte de la supervisión' },
          { id: 'cb-8-14', number: '8.14', text: 'Ubicación inadecuada del trabajador' },
          { id: 'cb-8-15', number: '8.15', text: 'Medición y evaluación inadecuadas del desempeño' },
          { id: 'cb-8-16', number: '8.16', text: 'Retroalimentación inadecuada o incorrecta' }
        ]
      },
      {
        id: 'cb-9',
        number: '9',
        title: 'Ingeniería Inadecuada',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-9-1', number: '9.1', text: 'Evaluación inadecuada de exposiciones a pérdidas' },
          { id: 'cb-9-2', number: '9.2', text: 'Preocupación inadecuada por los factores humanos/ergonómicos' },
          { id: 'cb-9-3', number: '9.3', text: 'Estándares, especificaciones y/o criterios de diseño inadecuados' },
          { id: 'cb-9-4', number: '9.4', text: 'Monitoreo/inspección inadecuados de las construcciones' },
          { id: 'cb-9-5', number: '9.5', text: 'Evaluación inadecuada de la condición para el servicio' },
          { id: 'cb-9-6', number: '9.6', text: 'Evaluación inadecuada para el cambio' },
          { id: 'cb-9-7', number: '9.7', text: 'Deficiencia en las comunicaciones técnicas' }
        ]
      },
      {
        id: 'cb-10',
        number: '10',
        title: 'Adquisiciones Inadecuadas',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-10-1', number: '10.1', text: 'Especificaciones inadecuadas del artículo' },
          { id: 'cb-10-2', number: '10.2', text: 'Investigación inadecuada de materiales y equipos' },
          { id: 'cb-10-3', number: '10.3', text: 'Especificaciones inadecuadas para el vendedor' },
          { id: 'cb-10-4', number: '10.4', text: 'Modalidad o ruta de embarque inadecuada' },
          { id: 'cb-10-5', number: '10.5', text: 'Inspecciones inadecuadas y aceptación de artículos' },
          { id: 'cb-10-6', number: '10.6', text: 'Comunicación inadecuada de las necesidades de seguridad y salud' },
          { id: 'cb-10-7', number: '10.7', text: 'Manejo inadecuado de materiales' },
          { id: 'cb-10-8', number: '10.8', text: 'Almacenamiento inadecuado de materiales' },
          { id: 'cb-10-9', number: '10.9', text: 'Transporte inadecuado de materiales' },
          { id: 'cb-10-10', number: '10.10', text: 'Identificación inadecuada de artículos riesgosos' },
          { id: 'cb-10-11', number: '10.11', text: 'Sistemas inadecuados de eliminación y desecho' }
        ]
      },
      {
        id: 'cb-11',
        number: '11',
        title: 'Mantenimiento Inadecuado',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-11-1', number: '11.1', text: 'Aspectos preventivos inadecuados del programa de mantenimiento' },
          { id: 'cb-11-2', number: '11.2', text: 'Aspectos predictivos inadecuados del programa de mantenimiento' },
          { id: 'cb-11-3', number: '11.3', text: 'Lubricación y servicio inadecuados' },
          { id: 'cb-11-4', number: '11.4', text: 'Ajuste/ensamblaje inadecuado' },
          { id: 'cb-11-5', number: '11.5', text: 'Limpieza o pulimiento inadecuados' },
          { id: 'cb-11-6', number: '11.6', text: 'Reemplazo inadecuado de partes' },
          { id: 'cb-11-7', number: '11.7', text: 'Reparación inadecuada' },
          { id: 'cb-11-8', number: '11.8', text: 'Remoción inadecuada de materiales de desecho' },
          { id: 'cb-11-9', number: '11.9', text: 'Programación inadecuada del mantenimiento' },
          { id: 'cb-11-10', number: '11.10', text: 'Examen inadecuado de partes críticas' },
          { id: 'cb-11-11', number: '11.11', text: 'Reparación inadecuada por problemas de mantenimiento' }
        ]
      },
      {
        id: 'cb-12',
        number: '12',
        title: 'Herramientas y Equipos Inadecuados',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-12-1', number: '12.1', text: 'Evaluación inadecuada de necesidades y riesgos' },
          { id: 'cb-12-2', number: '12.2', text: 'Preocupación inadecuada por los factores humanos/ergonómicos' },
          { id: 'cb-12-3', number: '12.3', text: 'Estándares o especificaciones inadecuadas' },
          { id: 'cb-12-4', number: '12.4', text: 'Disponibilidad inadecuada' },
          { id: 'cb-12-5', number: '12.5', text: 'Ajustes/reparación/mantenimiento inadecuados' },
          { id: 'cb-12-6', number: '12.6', text: 'Sistema inadecuado de reparación y recuperación' },
          { id: 'cb-12-7', number: '12.7', text: 'Remoción y reemplazo inadecuados' }
        ]
      },
      {
        id: 'cb-13',
        number: '13',
        title: 'Estándares Inadecuados del Trabajo',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-13-1', number: '13.1', text: 'Desarrollo inadecuado de estándares para:' },
          { id: 'cb-13-2', number: '13.2', text: 'Inventario y evaluación inadecuados de exposiciones y necesidades' },
          { id: 'cb-13-3', number: '13.3', text: 'Coordinación inadecuada con quienes diseñan el proceso' },
          { id: 'cb-13-4', number: '13.4', text: 'Compromiso inadecuado del trabajador' },
          { id: 'cb-13-5', number: '13.5', text: 'Estándares incompletos o inadecuados para:' },
          { id: 'cb-13-6', number: '13.6', text: 'Comunicación inadecuada de los estándares existentes' },
          { id: 'cb-13-7', number: '13.7', text: 'Mantenimiento inadecuado de los estándares' }
        ]
      },
      {
        id: 'cb-14',
        number: '14',
        title: 'Uso y Desgaste',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-14-1', number: '14.1', text: 'Planificación inadecuada del uso' },
          { id: 'cb-14-2', number: '14.2', text: 'Prolongación inadecuada de la vida útil de los artículos' },
          { id: 'cb-14-3', number: '14.3', text: 'Inspección inadecuada' },
          { id: 'cb-14-4', number: '14.4', text: 'Carga o proporción de uso inadecuado' },
          { id: 'cb-14-5', number: '14.5', text: 'Mantenimiento inadecuado' },
          { id: 'cb-14-6', number: '14.6', text: 'Empleo inadecuado para otros propósitos' },
          { id: 'cb-14-7', number: '14.7', text: 'Eliminación y reemplazo inadecuado de artículos gastados' }
        ]
      },
      {
        id: 'cb-15',
        number: '15',
        title: 'Abuso o Mal Uso',
        nacReferences: 'Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20',
        subcauses: [
          { id: 'cb-15-1', number: '15.1', text: 'Permitido por la supervisión' },
          { id: 'cb-15-2', number: '15.2', text: 'Intencional' },
          { id: 'cb-15-3', number: '15.3', text: 'No intencional' }
        ]
      }
    ]
  },
  {
    id: 'nac',
    name: 'NAC',
    title: 'Necesidades de Acción de Control',
    description: 'Define las acciones necesarias para prevenir la recurrencia del incidente',
    totalCauses: 20,
    causes: [
      {
        id: 'nac-1',
        number: '1',
        title: 'Selección y Colocación de Personal',
        description: 'Mejorar los procesos de selección y ubicación del personal',
        subcauses: [
          { id: 'nac-1-1', number: '1.1', text: 'Exámenes médicos pre-empleo' },
          { id: 'nac-1-2', number: '1.2', text: 'Evaluación de capacidades físicas' },
          { id: 'nac-1-3', number: '1.3', text: 'Evaluación de capacidades mentales' },
          { id: 'nac-1-4', number: '1.4', text: 'Asignación apropiada de tareas' }
        ]
      },
      {
        id: 'nac-2',
        number: '2',
        title: 'Entrenamiento y Capacitación',
        description: 'Desarrollar programas de entrenamiento efectivos',
        subcauses: [
          { id: 'nac-2-1', number: '2.1', text: 'Entrenamiento inicial' },
          { id: 'nac-2-2', number: '2.2', text: 'Entrenamiento de actualización' },
          { id: 'nac-2-3', number: '2.3', text: 'Entrenamiento en seguridad' },
          { id: 'nac-2-4', number: '2.4', text: 'Certificación de competencias' }
        ]
      },
      {
        id: 'nac-3',
        number: '3',
        title: 'Motivación y Concientización',
        description: 'Implementar programas de motivación y concientización',
        subcauses: [
          { id: 'nac-3-1', number: '3.1', text: 'Programas de incentivos' },
          { id: 'nac-3-2', number: '3.2', text: 'Reconocimiento por desempeño seguro' },
          { id: 'nac-3-3', number: '3.3', text: 'Campañas de concientización' },
          { id: 'nac-3-4', number: '3.4', text: 'Comunicación efectiva' }
        ]
      },
      {
        id: 'nac-4',
        number: '4',
        title: 'Liderazgo y Supervisión',
        description: 'Mejorar las capacidades de liderazgo y supervisión',
        subcauses: [
          { id: 'nac-4-1', number: '4.1', text: 'Entrenamiento en liderazgo' },
          { id: 'nac-4-2', number: '4.2', text: 'Definición clara de responsabilidades' },
          { id: 'nac-4-3', number: '4.3', text: 'Supervisión efectiva' },
          { id: 'nac-4-4', number: '4.4', text: 'Retroalimentación constructiva' }
        ]
      },
      {
        id: 'nac-5',
        number: '5',
        title: 'Ingeniería de Diseño',
        description: 'Implementar mejoras en el diseño de procesos y equipos',
        subcauses: [
          { id: 'nac-5-1', number: '5.1', text: 'Diseño ergonómico' },
          { id: 'nac-5-2', number: '5.2', text: 'Análisis de riesgos en diseño' },
          { id: 'nac-5-3', number: '5.3', text: 'Estándares de diseño' },
          { id: 'nac-5-4', number: '5.4', text: 'Revisión de diseños' }
        ]
      },
      {
        id: 'nac-6',
        number: '6',
        title: 'Evaluación Médica',
        description: 'Establecer programas de evaluación médica continua',
        subcauses: [
          { id: 'nac-6-1', number: '6.1', text: 'Exámenes médicos periódicos' },
          { id: 'nac-6-2', number: '6.2', text: 'Evaluación de aptitud para el trabajo' },
          { id: 'nac-6-3', number: '6.3', text: 'Programas de salud ocupacional' },
          { id: 'nac-6-4', number: '6.4', text: 'Seguimiento médico' }
        ]
      },
      {
        id: 'nac-7',
        number: '7',
        title: 'Controles de Ingeniería',
        description: 'Implementar controles técnicos para reducir riesgos',
        subcauses: [
          { id: 'nac-7-1', number: '7.1', text: 'Sistemas de ventilación' },
          { id: 'nac-7-2', number: '7.2', text: 'Protecciones y resguardos' },
          { id: 'nac-7-3', number: '7.3', text: 'Sistemas de alarma' },
          { id: 'nac-7-4', number: '7.4', text: 'Automatización de procesos' }
        ]
      },
      {
        id: 'nac-8',
        number: '8',
        title: 'Equipo de Protección Personal',
        description: 'Mejorar la selección y uso de EPP',
        subcauses: [
          { id: 'nac-8-1', number: '8.1', text: 'Selección apropiada de EPP' },
          { id: 'nac-8-2', number: '8.2', text: 'Entrenamiento en uso de EPP' },
          { id: 'nac-8-3', number: '8.3', text: 'Mantenimiento de EPP' },
          { id: 'nac-8-4', number: '8.4', text: 'Supervisión del uso de EPP' }
        ]
      },
      {
        id: 'nac-9',
        number: '9',
        title: 'Evaluación de Salud',
        description: 'Establecer programas de evaluación de salud',
        subcauses: [
          { id: 'nac-9-1', number: '9.1', text: 'Monitoreo de exposición' },
          { id: 'nac-9-2', number: '9.2', text: 'Evaluación de riesgos para la salud' },
          { id: 'nac-9-3', number: '9.3', text: 'Programas de vigilancia médica' },
          { id: 'nac-9-4', number: '9.4', text: 'Controles de salud ocupacional' }
        ]
      },
      {
        id: 'nac-10',
        number: '10',
        title: 'Controles Administrativos',
        description: 'Implementar controles administrativos efectivos',
        subcauses: [
          { id: 'nac-10-1', number: '10.1', text: 'Procedimientos de trabajo' },
          { id: 'nac-10-2', number: '10.2', text: 'Permisos de trabajo' },
          { id: 'nac-10-3', number: '10.3', text: 'Rotación de personal' },
          { id: 'nac-10-4', number: '10.4', text: 'Límites de exposición' }
        ]
      },
      {
        id: 'nac-11',
        number: '11',
        title: 'Adquisiciones',
        description: 'Mejorar los procesos de adquisición',
        subcauses: [
          { id: 'nac-11-1', number: '11.1', text: 'Especificaciones de seguridad' },
          { id: 'nac-11-2', number: '11.2', text: 'Evaluación de proveedores' },
          { id: 'nac-11-3', number: '11.3', text: 'Inspección de materiales' },
          { id: 'nac-11-4', number: '11.4', text: 'Certificación de calidad' }
        ]
      },
      {
        id: 'nac-12',
        number: '12',
        title: 'Evaluación de Capacidad Física',
        description: 'Evaluar y mejorar la capacidad física del personal',
        subcauses: [
          { id: 'nac-12-1', number: '12.1', text: 'Evaluación de capacidades físicas' },
          { id: 'nac-12-2', number: '12.2', text: 'Programas de acondicionamiento' },
          { id: 'nac-12-3', number: '12.3', text: 'Adaptación de puestos de trabajo' },
          { id: 'nac-12-4', number: '12.4', text: 'Seguimiento de capacidades' }
        ]
      },
      {
        id: 'nac-13',
        number: '13',
        title: 'Mantenimiento',
        description: 'Mejorar los programas de mantenimiento',
        subcauses: [
          { id: 'nac-13-1', number: '13.1', text: 'Mantenimiento preventivo' },
          { id: 'nac-13-2', number: '13.2', text: 'Mantenimiento predictivo' },
          { id: 'nac-13-3', number: '13.3', text: 'Inspecciones regulares' },
          { id: 'nac-13-4', number: '13.4', text: 'Registros de mantenimiento' }
        ]
      },
      {
        id: 'nac-14',
        number: '14',
        title: 'Herramientas y Equipos',
        description: 'Mejorar la gestión de herramientas y equipos',
        subcauses: [
          { id: 'nac-14-1', number: '14.1', text: 'Selección apropiada de herramientas' },
          { id: 'nac-14-2', number: '14.2', text: 'Inspección de herramientas' },
          { id: 'nac-14-3', number: '14.3', text: 'Mantenimiento de equipos' },
          { id: 'nac-14-4', number: '14.4', text: 'Reemplazo oportuno' }
        ]
      },
      {
        id: 'nac-15',
        number: '15',
        title: 'Evaluación de Capacidad Mental',
        description: 'Evaluar y desarrollar capacidades mentales',
        subcauses: [
          { id: 'nac-15-1', number: '15.1', text: 'Evaluación psicológica' },
          { id: 'nac-15-2', number: '15.2', text: 'Programas de desarrollo mental' },
          { id: 'nac-15-3', number: '15.3', text: 'Manejo del estrés' },
          { id: 'nac-15-4', number: '15.4', text: 'Apoyo psicológico' }
        ]
      },
      {
        id: 'nac-16',
        number: '16',
        title: 'Estándares de Trabajo',
        description: 'Desarrollar y mantener estándares de trabajo',
        subcauses: [
          { id: 'nac-16-1', number: '16.1', text: 'Desarrollo de procedimientos' },
          { id: 'nac-16-2', number: '16.2', text: 'Comunicación de estándares' },
          { id: 'nac-16-3', number: '16.3', text: 'Actualización de procedimientos' },
          { id: 'nac-16-4', number: '16.4', text: 'Verificación de cumplimiento' }
        ]
      },
      {
        id: 'nac-17',
        number: '17',
        title: 'Inspecciones Planeadas',
        description: 'Implementar programas de inspección sistemática',
        subcauses: [
          { id: 'nac-17-1', number: '17.1', text: 'Inspecciones de seguridad' },
          { id: 'nac-17-2', number: '17.2', text: 'Auditorías de cumplimiento' },
          { id: 'nac-17-3', number: '17.3', text: 'Seguimiento de acciones correctivas' },
          { id: 'nac-17-4', number: '17.4', text: 'Reportes de inspección' }
        ]
      },
      {
        id: 'nac-18',
        number: '18',
        title: 'Evaluación de Exposición a la Salud',
        description: 'Evaluar y controlar exposiciones a riesgos de salud',
        subcauses: [
          { id: 'nac-18-1', number: '18.1', text: 'Monitoreo ambiental' },
          { id: 'nac-18-2', number: '18.2', text: 'Evaluación de exposición personal' },
          { id: 'nac-18-3', number: '18.3', text: 'Controles de exposición' },
          { id: 'nac-18-4', number: '18.4', text: 'Vigilancia de la salud' }
        ]
      },
      {
        id: 'nac-19',
        number: '19',
        title: 'Preparación para Emergencias',
        description: 'Desarrollar capacidades de respuesta a emergencias',
        subcauses: [
          { id: 'nac-19-1', number: '19.1', text: 'Planes de emergencia' },
          { id: 'nac-19-2', number: '19.2', text: 'Entrenamiento en emergencias' },
          { id: 'nac-19-3', number: '19.3', text: 'Equipos de emergencia' },
          { id: 'nac-19-4', number: '19.4', text: 'Simulacros y ejercicios' }
        ]
      },
      {
        id: 'nac-20',
        number: '20',
        title: 'Reglas de Trabajo',
        description: 'Establecer y hacer cumplir reglas de trabajo',
        subcauses: [
          { id: 'nac-20-1', number: '20.1', text: 'Desarrollo de reglas claras' },
          { id: 'nac-20-2', number: '20.2', text: 'Comunicación de reglas' },
          { id: 'nac-20-3', number: '20.3', text: 'Supervisión del cumplimiento' },
          { id: 'nac-20-4', number: '20.4', text: 'Acciones disciplinarias' }
        ]
      }
    ]
  }
];
