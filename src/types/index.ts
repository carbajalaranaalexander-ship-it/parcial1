export interface Usuario {
  id: string;
  nombreCompleto: string;
  email: string;
  documento: string; // único
  especialidad: string;
  bio?: string;
  experiencia: ExperienciaLaboral[];
  educacion: FormacionAcademica[];
}

export interface ExperienciaLaboral {
  id: string;
  empresa: string;
  puesto: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
}

export interface FormacionAcademica {
  id: string;
  institucion: string;
  titulo: string;
  fechaGrado: string;
}

export type TipoPregunta = 'multiple' | 'abierta';

export interface Pregunta {
  id: string;
  texto: string;
  tipo: TipoPregunta;
  // Para opción múltiple
  opciones?: string[]; // típicamente 4
  respuestaCorrecta?: number; // índice 0-3
  // Para preguntas abiertas
  respuestaModelo?: string; // Respuesta de referencia para autoevaluación o guía
  palabrasClave?: string[]; // palabras clave para simulación de auto-evaluación inteligente
  puntos: number;
}

export interface Examen {
  id: string;
  titulo: string;
  areaTematica: string;
  tipoPredominante: TipoPregunta | 'mixto';
  preguntas: Pregunta[];
  porcentajeAprobacion: number; // Porcentaje mínimo para aprobar, e.g., 70
  creadoEn: string;
}

export interface IntentoExamen {
  id: string;
  usuarioId: string;
  examenId: string;
  respuestas: Record<string, string | number>; // preguntaId -> respuesta
  puntajeObtenido: number; // Porcentaje (0-100)
  aprobado: boolean;
  fecha: string;
  certificadoHash?: string; // hash único si aprobó
}

export interface Certificado {
  hash: string;
  usuarioId: string;
  nombreUsuario: string;
  documentoUsuario: string;
  examenId: string;
  nombreExamen: string;
  fechaEmision: string;
  urlVerificacion: string;
}
