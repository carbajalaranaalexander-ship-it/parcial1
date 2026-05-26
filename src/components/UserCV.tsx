import React, { useState } from 'react';
import { Briefcase, GraduationCap, Award, Mail, Plus, Trash, Edit, Save, X, FileCheck, ArrowLeft } from 'lucide-react';
import type { Usuario, ExperienciaLaboral, FormacionAcademica, Certificado } from '../types';

interface UserCVProps {
  usuario: Usuario;
  certificados: Certificado[];
  isCurrentUser: boolean;
  onSaveUser: (usuario: Usuario) => void;
  onViewCertificate: (hash: string) => void;
  onClose: () => void;
}

export const UserCV: React.FC<UserCVProps> = ({
  usuario,
  certificados,
  isCurrentUser,
  onSaveUser,
  onViewCertificate,
  onClose,
}) => {
  // Bio State
  const [bioInput, setBioInput] = useState(usuario.bio || '');
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Forms Modals State
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienciaLaboral | null>(null);
  const [editingEdu, setEditingEdu] = useState<FormacionAcademica | null>(null);

  // Experience Form Fields
  const [empresa, setEmpresa] = useState('');
  const [puesto, setPuesto] = useState('');
  const [expInicio, setExpInicio] = useState('');
  const [expFin, setExpFin] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Education Form Fields
  const [institucion, setInstitucion] = useState('');
  const [titulo, setTitulo] = useState('');
  const [eduGrado, setEduGrado] = useState('');

  const handleSaveBio = () => {
    onSaveUser({ ...usuario, bio: bioInput.trim() });
    setIsEditingBio(false);
  };

  const handleOpenExp = (exp?: ExperienciaLaboral) => {
    if (exp) {
      setEditingExp(exp);
      setEmpresa(exp.empresa);
      setPuesto(exp.puesto);
      setExpInicio(exp.fechaInicio);
      setExpFin(exp.fechaFin);
      setExpDesc(exp.descripcion);
    } else {
      setEditingExp(null);
      setEmpresa('');
      setPuesto('');
      setExpInicio('');
      setExpFin('');
      setExpDesc('');
    }
    setShowExpModal(true);
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresa.trim() || !puesto.trim() || !expInicio.trim() || !expFin.trim()) return;

    let updatedExp: ExperienciaLaboral[];
    if (editingExp) {
      updatedExp = usuario.experiencia.map(item =>
        item.id === editingExp.id
          ? { ...item, empresa, puesto, fechaInicio: expInicio, fechaFin: expFin, descripcion: expDesc }
          : item
      );
    } else {
      const nuevo: ExperienciaLaboral = {
        id: `exp-${Date.now()}`,
        empresa: empresa.trim(),
        puesto: puesto.trim(),
        fechaInicio: expInicio,
        fechaFin: expFin,
        descripcion: expDesc.trim(),
      };
      updatedExp = [...usuario.experiencia, nuevo];
    }

    onSaveUser({ ...usuario, experiencia: updatedExp });
    setShowExpModal(false);
  };

  const handleDeleteExp = (id: string) => {
    if (confirm('¿Eliminar esta experiencia laboral?')) {
      const updated = usuario.experiencia.filter(exp => exp.id !== id);
      onSaveUser({ ...usuario, experiencia: updated });
    }
  };

  const handleOpenEdu = (edu?: FormacionAcademica) => {
    if (edu) {
      setEditingEdu(edu);
      setInstitucion(edu.institucion);
      setTitulo(edu.titulo);
      setEduGrado(edu.fechaGrado);
    } else {
      setEditingEdu(null);
      setInstitucion('');
      setTitulo('');
      setEduGrado('');
    }
    setShowEduModal(true);
  };

  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institucion.trim() || !titulo.trim() || !eduGrado.trim()) return;

    let updatedEdu: FormacionAcademica[];
    if (editingEdu) {
      updatedEdu = usuario.educacion.map(item =>
        item.id === editingEdu.id
          ? { ...item, institucion, titulo, fechaGrado: eduGrado }
          : item
      );
    } else {
      const nuevo: FormacionAcademica = {
        id: `edu-${Date.now()}`,
        institucion: institucion.trim(),
        titulo: titulo.trim(),
        fechaGrado: eduGrado,
      };
      updatedEdu = [...usuario.educacion, nuevo];
    }

    onSaveUser({ ...usuario, educacion: updatedEdu });
    setShowEduModal(false);
  };

  const handleDeleteEdu = (id: string) => {
    if (confirm('¿Eliminar esta formación académica?')) {
      const updated = usuario.educacion.filter(edu => edu.id !== id);
      onSaveUser({ ...usuario, educacion: updated });
    }
  };

  // Get initials for avatar
  const initials = usuario.nombreCompleto
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="animate-fade-in">
      
      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }} className="no-print">
        <button className="btn btn-secondary btn-sm" onClick={onClose}>
          <ArrowLeft size={16} /> Volver al Portal
        </button>

        {isCurrentUser ? (
          <span className="badge badge-success">
            Modo de Edición Activo
          </span>
        ) : (
          <span className="badge badge-primary">
            Perfil Público
          </span>
        )}
      </div>

      <div className="cv-container">
        
        {/* Left Side: Personal Info & Certificates */}
        <div className="cv-sidebar">
          <div className="glass-card cv-header-info">
            <div className="cv-avatar">{initials}</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{usuario.nombreCompleto}</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
              {usuario.especialidad}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <Mail size={14} />
              <span>{usuario.email}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              DNI: {usuario.documento}
            </div>
          </div>

          {/* About / Bio */}
          <div className="glass-card">
            <div className="cv-section-title" style={{ border: 'none', margin: 0, paddingBottom: 0 }}>
              <span>Sobre Mí</span>
              {isCurrentUser && !isEditingBio && (
                <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem' }} onClick={() => setIsEditingBio(true)}>
                  <Edit size={12} />
                </button>
              )}
            </div>

            {isEditingBio ? (
              <div style={{ marginTop: '0.5rem' }}>
                <textarea
                  className="form-textarea"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Escriba un resumen profesional..."
                  rows={4}
                />
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setBioInput(usuario.bio || ''); setIsEditingBio(false); }}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={handleSaveBio}>
                    <Save size={12} /> Guardar
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', whiteSpace: 'pre-line' }}>
                {usuario.bio || 'Sin biografía profesional todavía.'}
              </p>
            )}
          </div>

          {/* Certificates (Acreditaciones) */}
          <div className="glass-card">
            <h3 className="cv-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={16} style={{ color: 'var(--success)' }} />
                Certificaciones
              </span>
            </h3>

            {certificados.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {certificados.map((cert) => (
                  <div
                    key={cert.hash}
                    className="cert-card-link"
                    onClick={() => onViewCertificate(cert.hash)}
                    title="Haga clic para ver el certificado completo"
                  >
                    <div>
                      <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-primary)' }}>
                        {cert.nombreExamen}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Emitido: {cert.fechaEmision}
                      </span>
                    </div>
                    <FileCheck size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                No tiene certificaciones registradas todavía.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Experience & Education */}
        <div className="cv-main">
          
          {/* Work Experience */}
          <div className="glass-card">
            <div className="cv-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={18} style={{ color: 'var(--primary)' }} />
                Experiencia Laboral
              </span>
              {isCurrentUser && (
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenExp()}>
                  <Plus size={12} /> Añadir
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {usuario.experiencia.map((exp) => (
                <div key={exp.id} className="cv-item">
                  
                  {isCurrentUser && (
                    <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', gap: '0.25rem' }} className="no-print">
                      <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem' }} onClick={() => handleOpenExp(exp)}>
                        <Edit size={12} />
                      </button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem' }} onClick={() => handleDeleteExp(exp.id)}>
                        <Trash size={12} />
                      </button>
                    </div>
                  )}

                  <h4 className="cv-item-title">{exp.puesto}</h4>
                  <div className="cv-item-subtitle">{exp.empresa}</div>
                  <div className="cv-item-date">{exp.fechaInicio} - {exp.fechaFin}</div>
                  <p className="cv-item-desc" style={{ whiteSpace: 'pre-line' }}>{exp.descripcion}</p>
                </div>
              ))}

              {usuario.experiencia.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                  No ha registrado información de experiencia laboral.
                </p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="glass-card">
            <div className="cv-section-title">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} style={{ color: 'var(--primary)' }} />
                Formación Académica
              </span>
              {isCurrentUser && (
                <button className="btn btn-primary btn-sm" onClick={() => handleOpenEdu()}>
                  <Plus size={12} /> Añadir
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {usuario.educacion.map((edu) => (
                <div key={edu.id} className="cv-item">
                  
                  {isCurrentUser && (
                    <div style={{ position: 'absolute', right: 0, top: 0, display: 'flex', gap: '0.25rem' }} className="no-print">
                      <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem' }} onClick={() => handleOpenEdu(edu)}>
                        <Edit size={12} />
                      </button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem' }} onClick={() => handleDeleteEdu(edu.id)}>
                        <Trash size={12} />
                      </button>
                    </div>
                  )}

                  <h4 className="cv-item-title">{edu.titulo}</h4>
                  <div className="cv-item-subtitle">{edu.institucion}</div>
                  <div className="cv-item-date">Graduación: {edu.fechaGrado}</div>
                </div>
              ))}

              {usuario.educacion.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                  No ha registrado información de formación académica.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Experience Modal */}
      {showExpModal && (
        <div className="modal-overlay no-print">
          <div className="glass-card modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                {editingExp ? 'Editar Experiencia Laboral' : 'Añadir Experiencia Laboral'}
              </h3>
              <button className="btn btn-secondary" style={{ padding: '0.25rem' }} onClick={() => setShowExpModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExp}>
              <div className="form-group">
                <label className="form-label">Nombre de la Empresa</label>
                <input
                  type="text"
                  className="form-input"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Ej. Google, UNCP"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cargo / Puesto</label>
                <input
                  type="text"
                  className="form-input"
                  value={puesto}
                  onChange={(e) => setPuesto(e.target.value)}
                  placeholder="Ej. Desarrollador Frontend"
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Fecha de Inicio</label>
                  <input
                    type="month"
                    className="form-input"
                    value={expInicio}
                    onChange={(e) => setExpInicio(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Fin (o escriba "Presente")</label>
                  <input
                    type="text"
                    className="form-input"
                    value={expFin}
                    onChange={(e) => setExpFin(e.target.value)}
                    placeholder="Ej. 2026-03 o Presente"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción de Actividades</label>
                <textarea
                  className="form-textarea"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Describa las responsabilidades o proyectos clave..."
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEduModal && (
        <div className="modal-overlay no-print">
          <div className="glass-card modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                {editingEdu ? 'Editar Formación Académica' : 'Añadir Formación Académica'}
              </h3>
              <button className="btn btn-secondary" style={{ padding: '0.25rem' }} onClick={() => setShowEduModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdu}>
              <div className="form-group">
                <label className="form-label">Institución Educativa</label>
                <input
                  type="text"
                  className="form-input"
                  value={institucion}
                  onChange={(e) => setInstitucion(e.target.value)}
                  placeholder="Ej. Universidad Nacional del Centro del Perú"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Título / Grado / Especialización</label>
                <input
                  type="text"
                  className="form-input"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Licenciado en Administración de Sistemas"
                  required
                />
              </div>

              <div className="form-group" style={{ width: '200px' }}>
                <label className="form-label">Fecha de Graduación</label>
                <input
                  type="month"
                  className="form-input"
                  value={eduGrado}
                  onChange={(e) => setEduGrado(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEduModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserCV;
