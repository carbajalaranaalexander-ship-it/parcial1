import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, Send, CornerDownRight } from 'lucide-react';
import type { Examen, IntentoExamen, Certificado, Usuario } from '../types';

interface ExamRunnerProps {
  examen: Examen;
  usuario: Usuario;
  onSubmitExam: (intento: IntentoExamen, certificado?: Certificado) => void;
  onCancel: () => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({
  examen,
  usuario,
  onSubmitExam,
  onCancel,
}) => {
  // Map to store user answers: questionId -> optionIndex (for MC) or string (for open)
  const [respuestas, setRespuestas] = useState<Record<string, string | number>>({});
  
  // Timer State - 10 minutes (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600); 
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto submit when time runs out
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelectOption = (preguntaId: string, optionIndex: number) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: optionIndex }));
  };

  const handleTextChange = (preguntaId: string, text: string) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: text }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Automated evaluation logic
  const evaluateExam = (): { puntaje: number; aprobado: boolean; hash?: string; cert?: Certificado } => {
    let totalPuntos = 0;
    let puntosObtenidos = 0;

    examen.preguntas.forEach((q) => {
      totalPuntos += q.puntos;
      const respuesta = respuestas[q.id];

      if (q.tipo === 'multiple') {
        if (respuesta !== undefined && Number(respuesta) === q.respuestaCorrecta) {
          puntosObtenidos += q.puntos;
        }
      } else if (q.tipo === 'abierta') {
        // Simulated AI evaluation based on keyword presence
        const ansText = (respuesta as string || '').toLowerCase().trim();
        if (ansText && q.palabrasClave && q.palabrasClave.length > 0) {
          let matches = 0;
          q.palabrasClave.forEach((keyword) => {
            if (ansText.includes(keyword.toLowerCase())) {
              matches++;
            }
          });

          // Score based on percentage of keywords found
          const matchRatio = matches / q.palabrasClave.length;
          if (matchRatio >= 0.7) {
            puntosObtenidos += q.puntos; // Full points
          } else if (matchRatio >= 0.3) {
            puntosObtenidos += q.puntos * 0.5; // Half points
          }
          // Otherwise 0 points
        }
      }
    });

    const porcentaje = Math.round((puntosObtenidos / totalPuntos) * 100) || 0;
    const aprobado = porcentaje >= examen.porcentajeAprobacion;

    let hash: string | undefined;
    let cert: Certificado | undefined;

    if (aprobado) {
      // Generate a unique 12-char certificate hash
      hash = `crt-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      cert = {
        hash,
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombreCompleto,
        documentoUsuario: usuario.documento,
        examenId: examen.id,
        nombreExamen: examen.titulo,
        fechaEmision: new Date().toISOString().split('T')[0],
        urlVerificacion: `${window.location.origin}${window.location.pathname}?verify=${hash}`,
      };
    }

    return { puntaje: porcentaje, aprobado, hash, cert };
  };

  const handleAutoSubmit = () => {
    const { puntaje, aprobado, hash, cert } = evaluateExam();
    
    const intento: IntentoExamen = {
      id: `int-${Date.now()}`,
      usuarioId: usuario.id,
      examenId: examen.id,
      respuestas,
      puntajeObtenido: puntaje,
      aprobado,
      fecha: new Date().toISOString().split('T')[0],
      ...(hash ? { certificadoHash: hash } : {}),
    };

    onSubmitExam(intento, cert);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any question was left unanswered
    const totalPreguntas = examen.preguntas.length;
    const respondidas = Object.keys(respuestas).length;

    if (respondidas < totalPreguntas) {
      if (!confirm(`Has respondido ${respondidas} de ${totalPreguntas} preguntas. ¿Estás seguro de que quieres finalizar el examen?`)) {
        return;
      }
    } else {
      if (!confirm('¿Desea enviar y calificar su examen? Esta acción es irreversible.')) {
        return;
      }
    }

    if (timerRef.current) clearInterval(timerRef.current);
    handleAutoSubmit();
  };

  const isLowTime = timeLeft < 60;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Sticky Header with Timer */}
      <div className="timer-banner">
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rindiendo Examen como:</span>
          <strong style={{ display: 'block', fontSize: '1rem' }}>{usuario.nombreCompleto}</strong>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>{examen.titulo}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mínimo para aprobar: {examen.porcentajeAprobacion}%</span>
        </div>

        <div className={`timer-text ${isLowTime ? 'danger' : ''}`}>
          <Clock size={20} className={isLowTime ? 'animate-float' : ''} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {isLowTime && (
        <div style={{ padding: '0.75rem 1rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <AlertTriangle size={18} /> ¡Atención! Queda menos de un minuto. El examen se enviará automáticamente al expirar el tiempo.
        </div>
      )}

      {/* Questions list */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {examen.preguntas.map((pregunta, index) => {
            const currentAnswer = respuestas[pregunta.id];

            return (
              <div key={pregunta.id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span className="badge badge-primary">Pregunta {index + 1}</span>
                  <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                    {pregunta.puntos} puntos
                  </span>
                </div>

                <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
                  {pregunta.texto}
                </p>

                {pregunta.tipo === 'multiple' && pregunta.opciones && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pregunta.opciones.map((opcion, optIndex) => {
                      const optLetter = String.fromCharCode(65 + optIndex);
                      const isChecked = currentAnswer === optIndex;

                      return (
                        <label
                          key={optIndex}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}`,
                            backgroundColor: isChecked ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <input
                            type="radio"
                            name={`pregunta-${pregunta.id}`}
                            checked={isChecked}
                            onChange={() => handleSelectOption(pregunta.id, optIndex)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          <span style={{ fontWeight: '600', color: isChecked ? 'var(--primary)' : 'var(--text-secondary)' }}>
                            {optLetter}.
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>{opcion}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {pregunta.tipo === 'abierta' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Escriba su respuesta a continuación:</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Redacte su respuesta detalladamente..."
                      value={(currentAnswer as string) || ''}
                      onChange={(e) => handleTextChange(pregunta.id, e.target.value)}
                      style={{ minHeight: '120px' }}
                      required
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      <CornerDownRight size={12} />
                      <span>Nota: Su respuesta será analizada automáticamente mediante detección de conceptos clave.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '3rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => {
            if (confirm('¿Desea salir del examen? Se perderá todo su progreso.')) {
              onCancel();
            }
          }}>
            Abandonar Examen
          </button>
          
          <button type="submit" className="btn btn-success">
            <Send size={18} /> Finalizar y Enviar Examen
          </button>
        </div>
      </form>
    </div>
  );
};
export default ExamRunner;
