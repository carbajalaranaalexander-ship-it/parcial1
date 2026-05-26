import React, { useState } from 'react';
import { UserPlus, BookOpen, AlertCircle, CheckCircle, XCircle, Award, FileText, User } from 'lucide-react';
import type { Usuario, Examen, IntentoExamen, Certificado } from '../types';

interface UserPortalProps {
  usuarios: Usuario[];
  examenes: Examen[];
  intentos: IntentoExamen[];
  certificados: Certificado[];
  currentUserId: string;
  onSelectUser: (id: string) => void;
  onRegisterUser: (usuario: Usuario) => boolean;
  onTakeExam: (examen: Examen) => void;
  onViewCV: (userId: string) => void;
  onViewCertificate: (hash: string) => void;
  onViewResult: (intento: IntentoExamen) => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  usuarios,
  examenes,
  intentos,
  certificados,
  currentUserId,
  onSelectUser,
  onRegisterUser,
  onTakeExam,
  onViewCV,
  onViewCertificate,
  onViewResult,
}) => {
  // Form State
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active User Info
  const activeUser = usuarios.find((u) => u.id === currentUserId);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nombreCompleto.trim() || !email.trim() || !documento.trim() || !especialidad.trim()) {
      setErrorMsg('Todos los campos son obligatorios.');
      return;
    }

    const nuevoUsuario: Usuario = {
      id: `usr-${Date.now()}`,
      nombreCompleto: nombreCompleto.trim(),
      email: email.trim(),
      documento: documento.trim(),
      especialidad: especialidad.trim(),
      experiencia: [],
      educacion: [],
    };

    const exito = onRegisterUser(nuevoUsuario);
    if (exito) {
      setSuccessMsg('Usuario registrado con éxito.');
      setNombreCompleto('');
      setEmail('');
      setDocumento('');
      setEspecialidad('');
      // Auto select newly registered user
      onSelectUser(nuevoUsuario.id);
    } else {
      setErrorMsg('El número de documento ya se encuentra registrado.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Active User Dashboard Banner */}
      {activeUser && (
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(17,24,39,0.8) 100%)' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Sesión de Postulante Activa
            </span>
            <h2 style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>{activeUser.nombreCompleto}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {activeUser.especialidad} | DNI: {activeUser.documento}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => onViewCV(activeUser.id)}>
              <User size={16} /> Ver/Editar CV
            </button>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
        
        {/* Left Side: Exams Catalog */}
        <div>
          <h2 className="section-title">
            <BookOpen size={24} style={{ color: 'var(--primary)' }} />
            Exámenes de Certificación
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Seleccione una evaluación disponible para rendir. Recuerde que solo se permite **un intento por usuario**.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {examenes.map((examen) => {
              // Check if active user took this exam
              const intento = intentos.find((i) => i.usuarioId === currentUserId && i.examenId === examen.id);
              const certificado = certificados.find((c) => c.usuarioId === currentUserId && c.examenId === examen.id);

              return (
                <div key={examen.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flexGrow: 1, paddingRight: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{examen.areaTematica}</span>
                      <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        {examen.preguntas.length} preguntas
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {examen.titulo}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Puntaje mínimo aprobatorio: {examen.porcentajeAprobacion}%
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', minWidth: '160px' }}>
                    {intento ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                          {intento.aprobado ? (
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                              <CheckCircle size={16} /> Aprobado ({intento.puntajeObtenido}%)
                            </span>
                          ) : (
                            <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                              <XCircle size={16} /> Desaprobado ({intento.puntajeObtenido}%)
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => onViewResult(intento)}>
                            <FileText size={12} /> Detalles
                          </button>
                          {certificado && (
                            <button className="btn btn-success btn-sm" onClick={() => onViewCertificate(certificado.hash)}>
                              <Award size={12} /> Certificado
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => onTakeExam(examen)}
                        disabled={!activeUser || examen.preguntas.length === 0}
                      >
                        Iniciar Examen
                      </button>
                    )}
                    {!activeUser && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
                        * Registre o elija un usuario activo
                      </span>
                    )}
                    {activeUser && examen.preguntas.length === 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>
                        * Examen sin preguntas
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {examenes.length === 0 && (
              <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No hay exámenes configurados en el sistema todavía.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Registration & Active User Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* User Registration Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} style={{ color: 'var(--primary)' }} />
              Registrar Postulante
            </h3>
            
            {errorMsg && (
              <div style={{ padding: '0.5rem 0.75rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '0.5rem 0.75rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
                <input
                  type="text"
                  className="form-input"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  placeholder="Ej. Briza Ramos"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="briza.ramos@gmail.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Número de Documento (DNI/ID)</label>
                <input
                  type="text"
                  className="form-input"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="8 dígitos"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Especialidad Profesional</label>
                <input
                  type="text"
                  className="form-input"
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  placeholder="Ej. Desarrollo Frontend"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Registrar y Activar
              </button>
            </form>
          </div>

          {/* List of Registered Users */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Postulantes Registrados</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {usuarios.map((usr) => {
                const userIntentos = intentos.filter(i => i.usuarioId === usr.id);
                const userCerts = certificados.filter(c => c.usuarioId === usr.id);
                const isSelected = usr.id === currentUserId;

                return (
                  <div
                    key={usr.id}
                    className="glass-card"
                    style={{
                      padding: '0.75rem',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.04)' : 'rgba(17, 24, 39, 0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{usr.nombreCompleto}</strong>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>DNI: {usr.documento}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {usr.especialidad}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>
                        Exámenes: <strong>{userIntentos.length}</strong> | Certificados: <strong>{userCerts.length}</strong>
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                          onClick={() => onViewCV(usr.id)}
                          title="Ver CV de usuario"
                        >
                          CV
                        </button>
                        {!isSelected && (
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                            onClick={() => onSelectUser(usr.id)}
                          >
                            Activar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default UserPortal;
