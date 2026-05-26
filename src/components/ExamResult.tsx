import React from 'react';
import { Award, Check, X, AlertCircle, FileText } from 'lucide-react';
import type { IntentoExamen, Examen, Usuario } from '../types';

interface ExamResultProps {
  intento: IntentoExamen;
  examen: Examen;
  usuario: Usuario;
  onViewCertificate: (hash: string) => void;
  onClose: () => void;
}

export const ExamResult: React.FC<ExamResultProps> = ({
  intento,
  examen,
  usuario,
  onViewCertificate,
  onClose,
}) => {
  const isAprobado = intento.aprobado;

  // Auxiliary function to render open questions AI evaluation
  const renderOpenQuestionEval = (q: any, userAnswer: string) => {
    if (!q.palabrasClave) return null;
    
    const ansText = userAnswer.toLowerCase();
    const detected: string[] = [];
    const missing: string[] = [];

    q.palabrasClave.forEach((kw: string) => {
      if (ansText.includes(kw.toLowerCase())) {
        detected.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const ratio = q.palabrasClave.length > 0 ? detected.length / q.palabrasClave.length : 0;
    let feedback = '';
    let puntosAsignados = 0;

    if (ratio >= 0.7) {
      feedback = 'Excelente respuesta. Identifica y explica con precisión los conceptos principales.';
      puntosAsignados = q.puntos;
    } else if (ratio >= 0.3) {
      feedback = 'Respuesta aceptable. Menciona algunos elementos clave, pero carece de un desarrollo completo o profundidad.';
      puntosAsignados = q.puntos * 0.5;
    } else {
      feedback = 'Respuesta insuficiente. No se detectaron suficientes conceptos clave asociados al tema.';
      puntosAsignados = 0;
    }

    return (
      <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Resultado de Evaluación Inteligente (Simulado)
        </span>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          <strong>Puntos:</strong> {puntosAsignados} / {q.puntos}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          <strong>Palabras clave detectadas:</strong>{' '}
          {detected.map(w => (
            <span key={w} style={{ color: 'var(--success)', marginRight: '0.5rem', fontWeight: '500' }}>✓ {w}</span>
          ))}
          {missing.map(w => (
            <span key={w} style={{ color: 'var(--text-muted)', marginRight: '0.5rem', textDecoration: 'line-through' }}>✗ {w}</span>
          ))}
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          <strong>Retroalimentación:</strong> {feedback}
        </p>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
          <strong>Respuesta modelo del comité:</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{q.respuestaModelo}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '750px', margin: '0 auto' }}>
      
      {/* Result Card */}
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: `2px solid ${isAprobado ? 'var(--success)' : 'var(--danger)'}` }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: isAprobado ? 'var(--success-light)' : 'var(--danger-light)',
          color: isAprobado ? 'var(--success)' : 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem',
          boxShadow: isAprobado ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
        }}>
          {isAprobado ? <Award size={48} /> : <AlertCircle size={48} />}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
          {isAprobado ? '¡Felicitaciones, Aprobaste!' : 'Examen Desaprobado'}
        </h1>
        
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
          <strong>Postulante: {usuario.nombreCompleto}</strong> <br />
          {isAprobado
            ? `Has alcanzado los criterios mínimos de acreditación para el examen "${examen.titulo}". Tu certificado ya se encuentra disponible.`
            : `Lamentablemente no has alcanzado el porcentaje mínimo del ${examen.porcentajeAprobacion}% requerido para certificar en "${examen.titulo}".`}
        </p>

        <div style={{ display: 'flex', gap: '2rem', margin: '1rem 0' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>TU PUNTAJE</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: isAprobado ? 'var(--success)' : 'var(--danger)' }}>
              {intento.puntajeObtenido}%
            </span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>REQUERIDO</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {examen.porcentajeAprobacion}%
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Volver al Portal
          </button>
          {isAprobado && intento.certificadoHash && (
            <button className="btn btn-success" onClick={() => onViewCertificate(intento.certificadoHash!)}>
              <Award size={18} /> Ver Certificado
            </button>
          )}
        </div>
      </div>

      {/* Review Details */}
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileText size={18} /> Desglose de Evaluación
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        {examen.preguntas.map((q, index) => {
          const userAnswer = intento.respuestas[q.id];
          const isCorrect = q.tipo === 'multiple' && Number(userAnswer) === q.respuestaCorrecta;

          return (
            <div key={q.id} className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">Pregunta {index + 1}</span>
                {q.tipo === 'multiple' ? (
                  isCorrect ? (
                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: '600' }}>
                      <Check size={14} /> Correcto (+{q.puntos} pts)
                    </span>
                  ) : (
                    <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem', fontWeight: '600' }}>
                      <X size={14} /> Incorrecto (0 / {q.puntos} pts)
                    </span>
                  )
                ) : (
                  <span className="badge badge-warning">Desarrollo ({q.puntos} pts máx.)</span>
                )}
              </div>

              <p style={{ fontWeight: '500', fontSize: '0.95rem', marginBottom: '0.75rem' }}>{q.texto}</p>

              {q.tipo === 'multiple' && q.opciones && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  {q.opciones.map((opt, i) => {
                    const isSelected = userAnswer === i;
                    const isRight = q.respuestaCorrecta === i;
                    
                    let style: React.CSSProperties = { padding: '0.4rem 0.6rem', borderRadius: '4px' };
                    if (isSelected) {
                      style.backgroundColor = isRight ? 'var(--success-light)' : 'var(--danger-light)';
                      style.color = isRight ? 'var(--success)' : 'var(--danger)';
                      style.fontWeight = 'bold';
                    } else if (isRight) {
                      style.color = 'var(--success)';
                      style.fontWeight = 'bold';
                    } else {
                      style.color = 'var(--text-secondary)';
                    }

                    return (
                      <div key={i} style={style}>
                        {String.fromCharCode(65 + i)}) {opt}{' '}
                        {isSelected && !isRight && ' (Tu respuesta - Incorrecta)'}
                        {isSelected && isRight && ' (Tu respuesta - Correcta)'}
                        {!isSelected && isRight && ' (Respuesta Correcta)'}
                      </div>
                    );
                  })}
                </div>
              )}

              {q.tipo === 'abierta' && renderOpenQuestionEval(q, (userAnswer as string) || '')}
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default ExamResult;
