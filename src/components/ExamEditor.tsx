import React, { useState } from 'react';
import { Plus, Trash, Edit, Save, ArrowLeft, HelpCircle } from 'lucide-react';
import type { Examen, Pregunta, TipoPregunta } from '../types';
import QuestionForm from './QuestionForm';

interface ExamEditorProps {
  onSave: (examen: Examen) => void;
  onCancel: () => void;
  initialExam?: Examen;
}

export const ExamEditor: React.FC<ExamEditorProps> = ({
  onSave,
  onCancel,
  initialExam,
}) => {
  const [titulo, setTitulo] = useState(initialExam?.titulo || '');
  const [areaTematica, setAreaTematica] = useState(initialExam?.areaTematica || '');
  const [porcentajeAprobacion, setPorcentajeAprobacion] = useState<number>(
    initialExam?.porcentajeAprobacion || 70
  );
  const [preguntas, setPreguntas] = useState<Pregunta[]>(initialExam?.preguntas || []);
  const [editingQuestion, setEditingQuestion] = useState<Pregunta | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddOrUpdateQuestion = (q: Pregunta) => {
    if (editingQuestion) {
      setPreguntas(prev => prev.map(item => (item.id === q.id ? q : item)));
      setEditingQuestion(null);
    } else {
      setPreguntas(prev => [...prev, q]);
      setIsAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setPreguntas(prev => prev.filter(q => q.id !== id));
  };

  const handleEditQuestion = (q: Pregunta) => {
    setEditingQuestion(q);
    setIsAddingQuestion(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!titulo.trim()) newErrors.titulo = 'El título del examen es obligatorio.';
    if (!areaTematica.trim()) newErrors.areaTematica = 'El área temática es obligatoria.';
    if (porcentajeAprobacion < 1 || porcentajeAprobacion > 100) {
      newErrors.porcentaje = 'El porcentaje debe estar entre 1 y 100.';
    }
    if (preguntas.length === 0) {
      newErrors.preguntas = 'El examen debe tener al menos una pregunta.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveExam = () => {
    if (!validate()) return;

    // Determinar tipo dominante
    const types = preguntas.map(p => p.tipo);
    const hasMultiple = types.includes('multiple');
    const hasOpen = types.includes('abierta');
    let tipoPredominante: TipoPregunta | 'mixto' = 'multiple';
    if (hasMultiple && hasOpen) {
      tipoPredominante = 'mixto';
    } else if (hasOpen) {
      tipoPredominante = 'abierta';
    }

    const examen: Examen = {
      id: initialExam?.id || `exm-${Date.now()}`,
      titulo: titulo.trim(),
      areaTematica: areaTematica.trim(),
      tipoPredominante,
      preguntas,
      porcentajeAprobacion,
      creadoEn: initialExam?.creadoEn || new Date().toISOString().split('T')[0],
    };

    onSave(examen);
  };

  const totalPoints = preguntas.reduce((sum, q) => sum + q.puntos, 0);

  return (
    <div className="glass-card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          <ArrowLeft size={16} /> Volver
        </button>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
          {initialExam ? 'Editar Examen' : 'Crear Nuevo Examen'}
        </h2>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Título del Examen</label>
          <input
            type="text"
            className="form-input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej. Certificación Frontend React"
          />
          {errors.titulo && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.titulo}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Área Temática</label>
          <input
            type="text"
            className="form-input"
            value={areaTematica}
            onChange={(e) => setAreaTematica(e.target.value)}
            placeholder="Ej. Desarrollo Web"
          />
          {errors.areaTematica && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.areaTematica}</span>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Porcentaje Mínimo de Aprobación (%)</label>
          <input
            type="number"
            className="form-input"
            value={porcentajeAprobacion}
            onChange={(e) => setPorcentajeAprobacion(parseInt(e.target.value) || 0)}
            min="1"
            max="100"
          />
          {errors.porcentaje && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{errors.porcentaje}</span>}
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
          <div>
            <span className="form-label" style={{ marginBottom: '0.25rem' }}>Total de Preguntas</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{preguntas.length}</span>
          </div>
          <div>
            <span className="form-label" style={{ marginBottom: '0.25rem' }}>Puntaje Total Máximo</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {totalPoints} pts
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} /> Preguntas del Examen
          </h3>
          {!isAddingQuestion && !editingQuestion && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsAddingQuestion(true)}>
              <Plus size={16} /> Agregar Pregunta
            </button>
          )}
        </div>

        {errors.preguntas && (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', padding: '0.5rem', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)' }}>
            {errors.preguntas}
          </div>
        )}

        {isAddingQuestion && (
          <QuestionForm
            onSave={handleAddOrUpdateQuestion}
            onCancel={() => setIsAddingQuestion(false)}
          />
        )}

        {editingQuestion && (
          <QuestionForm
            onSave={handleAddOrUpdateQuestion}
            onCancel={() => setEditingQuestion(null)}
            initialQuestion={editingQuestion}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {preguntas.map((q, idx) => (
            <div key={q.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flexGrow: 1, paddingRight: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="badge badge-primary">Pregunta {idx + 1}</span>
                  <span className={`badge ${q.tipo === 'multiple' ? 'badge-success' : 'badge-warning'}`}>
                    {q.tipo === 'multiple' ? 'Opción Múltiple' : 'Desarrollo'}
                  </span>
                  <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>{q.puntos} pts</span>
                </div>
                <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>{q.texto}</p>
                {q.tipo === 'multiple' && q.opciones && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {q.opciones.map((opt, i) => (
                      <div key={i} style={i === q.respuestaCorrecta ? { color: 'var(--success)', fontWeight: 'bold' } : {}}>
                        {String.fromCharCode(65 + i)}) {opt} {i === q.respuestaCorrecta && '✓'}
                      </div>
                    ))}
                  </div>
                )}
                {q.tipo === 'abierta' && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong>Palabras clave: </strong> {q.palabrasClave?.join(', ')}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem' }}
                  onClick={() => handleEditQuestion(q)}
                  title="Editar Pregunta"
                >
                  <Edit size={14} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.35rem' }}
                  onClick={() => handleDeleteQuestion(q.id)}
                  title="Eliminar Pregunta"
                >
                  <Trash size={14} />
                </button>
              </div>
            </div>
          ))}

          {preguntas.length === 0 && !isAddingQuestion && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No hay preguntas agregadas todavía. Haga clic en "Agregar Pregunta" para comenzar.
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-success" onClick={handleSaveExam}>
          <Save size={18} /> Guardar Examen
        </button>
      </div>
    </div>
  );
};
export default ExamEditor;
