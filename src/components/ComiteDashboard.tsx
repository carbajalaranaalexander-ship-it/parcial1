import React from 'react';
import { Plus, Edit, Trash, BookOpen, Award, FileText, ClipboardList } from 'lucide-react';
import type { Examen } from '../types';

interface ComiteDashboardProps {
  examenes: Examen[];
  onCreateExam: () => void;
  onEditExam: (examen: Examen) => void;
  onDeleteExam: (id: string) => void;
}

export const ComiteDashboard: React.FC<ComiteDashboardProps> = ({
  examenes,
  onCreateExam,
  onEditExam,
  onDeleteExam,
}) => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="section-title">
            <ClipboardList size={28} style={{ color: 'var(--primary)' }} />
            Gestión de Exámenes
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Cree, edite y configure las evaluaciones académicas y criterios de certificación profesional.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onCreateExam}>
          <Plus size={20} /> Crear Examen
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Exámenes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{examenes.length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--success-light)', color: 'var(--success)' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Certificaciones Activas</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {examenes.filter(e => e.preguntas.length > 0).length}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Promedio Aprobación</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {examenes.length > 0
                ? Math.round(examenes.reduce((sum, e) => sum + e.porcentajeAprobacion, 0) / examenes.length)
                : 0}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Exam List */}
      <div className="grid-2">
        {examenes.map((exam) => (
          <div key={exam.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">{exam.areaTematica}</span>
                <span className={`badge ${
                  exam.tipoPredominante === 'multiple'
                    ? 'badge-success'
                    : exam.tipoPredominante === 'abierta'
                    ? 'badge-warning'
                    : 'badge-primary'
                }`}>
                  {exam.tipoPredominante === 'multiple'
                    ? 'Opción Múltiple'
                    : exam.tipoPredominante === 'abierta'
                    ? 'Preguntas Abiertas'
                    : 'Mixto'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                {exam.titulo}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Creado el: {exam.creadoEn}
              </p>

              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <div>
                  <strong>Preguntas:</strong> {exam.preguntas.length}
                </div>
                <div>
                  <strong>Puntaje Max:</strong> {exam.preguntas.reduce((sum, q) => sum + q.puntos, 0)} pts
                </div>
                <div>
                  <strong>Aprobación:</strong> {exam.porcentajeAprobacion}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onEditExam(exam)}
              >
                <Edit size={14} /> Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (confirm(`¿Está seguro de eliminar el examen "${exam.titulo}"?`)) {
                    onDeleteExam(exam.id);
                  }
                }}
              >
                <Trash size={14} /> Eliminar
              </button>
            </div>
          </div>
        ))}

        {examenes.length === 0 && (
          <div className="glass-card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              No hay exámenes registrados en el sistema.
            </p>
            <button className="btn btn-primary" onClick={onCreateExam}>
              Crear Primer Examen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ComiteDashboard;
