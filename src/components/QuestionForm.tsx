import React, { useState } from 'react';
import { Save } from 'lucide-react';
import type { Pregunta, TipoPregunta } from '../types';

interface QuestionFormProps {
  onSave: (pregunta: Pregunta) => void;
  onCancel: () => void;
  initialQuestion?: Pregunta;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  onSave,
  onCancel,
  initialQuestion,
}) => {
  const [texto, setTexto] = useState(initialQuestion?.texto || '');
  const [tipo, setTipo] = useState<TipoPregunta>(initialQuestion?.tipo || 'multiple');
  const [opciones, setOpciones] = useState<string[]>(
    initialQuestion?.opciones || ['', '', '', '']
  );
  const [respuestaCorrecta, setRespuestaCorrecta] = useState<number>(
    initialQuestion?.respuestaCorrecta !== undefined ? initialQuestion.respuestaCorrecta : 0
  );
  const [respuestaModelo, setRespuestaModelo] = useState(
    initialQuestion?.respuestaModelo || ''
  );
  const [palabrasClaveStr, setPalabrasClaveStr] = useState(
    initialQuestion?.palabrasClave?.join(', ') || ''
  );
  const [puntos, setPuntos] = useState<number>(initialQuestion?.puntos || 4);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...opciones];
    updated[index] = val;
    setOpciones(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!texto.trim()) newErrors.texto = 'El enunciado de la pregunta es obligatorio.';
    if (puntos <= 0) newErrors.puntos = 'Los puntos deben ser mayores a 0.';
    
    if (tipo === 'multiple') {
      const vacias = opciones.some(opt => !opt.trim());
      if (vacias) newErrors.opciones = 'Debe completar las 4 opciones de respuesta.';
    } else {
      if (!respuestaModelo.trim()) {
        newErrors.respuestaModelo = 'La respuesta modelo es requerida para autoevaluación.';
      }
      if (!palabrasClaveStr.trim()) {
        newErrors.palabrasClave = 'Ingrese al menos una palabra clave separada por comas.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const palabrasClave = palabrasClaveStr
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    const pregunta: Pregunta = {
      id: initialQuestion?.id || `q-${Date.now()}`,
      texto: texto.trim(),
      tipo,
      puntos,
      ...(tipo === 'multiple'
        ? { opciones, respuestaCorrecta }
        : { respuestaModelo: respuestaModelo.trim(), palabrasClave }),
    };

    onSave(pregunta);
  };

  return (
    <div className="glass-card animate-fade-in" style={{ marginTop: '1rem', border: '1px dashed var(--primary)' }}>
      <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {initialQuestion ? 'Editar Pregunta' : 'Nueva Pregunta'}
      </h4>

      <div className="form-group">
        <label className="form-label">Tipo de Pregunta</label>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="tipoPregunta"
              checked={tipo === 'multiple'}
              onChange={() => setTipo('multiple')}
            />
            Opción Múltiple
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="tipoPregunta"
              checked={tipo === 'abierta'}
              onChange={() => setTipo('abierta')}
            />
            Pregunta Abierta / Desarrollo
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Enunciado de la Pregunta</label>
        <textarea
          className="form-textarea"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escriba la pregunta aquí..."
          style={{ minHeight: '60px' }}
        />
        {errors.texto && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.texto}</span>}
      </div>

      {tipo === 'multiple' ? (
        <div className="form-group" style={{ padding: '0.5rem 0' }}>
          <label className="form-label">Opciones de Respuesta</label>
          {opciones.map((opcion, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                {String.fromCharCode(65 + index)}.
              </span>
              <input
                type="text"
                className="form-input"
                value={opcion}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Opción ${String.fromCharCode(65 + index)}`}
              />
              <input
                type="radio"
                name="correctOption"
                checked={respuestaCorrecta === index}
                onChange={() => setRespuestaCorrecta(index)}
                title="Marcar como respuesta correcta"
              />
            </div>
          ))}
          {errors.opciones && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.opciones}</span>}
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            * Seleccione el botón circular a la derecha para indicar la respuesta correcta.
          </p>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label className="form-label">Respuesta Modelo / Rúbrica</label>
            <textarea
              className="form-textarea"
              value={respuestaModelo}
              onChange={(e) => setRespuestaModelo(e.target.value)}
              placeholder="Escriba la respuesta ideal para que el alumno pueda autoevaluarse..."
              style={{ minHeight: '70px' }}
            />
            {errors.respuestaModelo && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.respuestaModelo}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Palabras Clave para Autocalificación (separadas por comas)</label>
            <input
              type="text"
              className="form-input"
              value={palabrasClaveStr}
              onChange={(e) => setPalabrasClaveStr(e.target.value)}
              placeholder="ejemplo: observer, notificar, suscriptor"
            />
            {errors.palabrasClave && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.palabrasClave}</span>}
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              * El sistema buscará estas palabras para otorgar puntaje inicial simulado.
            </p>
          </div>
        </>
      )}

      <div className="form-group" style={{ width: '150px' }}>
        <label className="form-label">Puntaje / Valor</label>
        <input
          type="number"
          className="form-input"
          value={puntos}
          onChange={(e) => setPuntos(parseInt(e.target.value) || 0)}
          min="1"
        />
        {errors.puntos && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.puntos}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          <Save size={14} /> Guardar Pregunta
        </button>
      </div>
    </div>
  );
};
export default QuestionForm;
