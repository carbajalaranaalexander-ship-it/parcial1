import React from 'react';
import { Award, ShieldAlert, Users, Settings } from 'lucide-react';
import type { Usuario } from '../types';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  usuarios: Usuario[];
  currentUserId: string;
  onUserChange: (userId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  usuarios,
  currentUserId,
  onUserChange,
}) => {
  const currentUser = usuarios.find((u) => u.id === currentUserId);

  return (
    <nav className="navbar no-print">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Award className="animate-float" size={24} style={{ color: 'var(--primary)' }} />
          <span>CertiDAW</span>
        </div>

        <div className="navbar-menu">
          <button
            className={`navbar-item ${currentView === 'comite' ? 'active' : ''}`}
            onClick={() => onViewChange('comite')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Settings size={16} />
              Comité Técnico
            </span>
          </button>
          <button
            className={`navbar-item ${currentView === 'usuarios' || currentView === 'cv' || currentView === 'exam' || currentView === 'resultado' ? 'active' : ''}`}
            onClick={() => onViewChange('usuarios')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} />
              Portal de Usuarios
            </span>
          </button>
          <button
            className={`navbar-item ${currentView === 'verificacion' ? 'active' : ''}`}
            onClick={() => onViewChange('verificacion')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={16} />
              Verificar Certificado
            </span>
          </button>
        </div>

        <div className="navbar-user-section">
          {currentUser && (
            <div className="user-selector-container">
              <span className="form-label" style={{ margin: 0, fontSize: '0.8rem' }}>
                Usuario Activo:
              </span>
              <select
                className="form-select"
                style={{ padding: '0.25rem 0.5rem', width: 'auto', fontSize: '0.85rem' }}
                value={currentUserId}
                onChange={(e) => onUserChange(e.target.value)}
              >
                {usuarios.map((usr) => (
                  <option key={usr.id} value={usr.id}>
                    {usr.nombreCompleto} ({usr.especialidad})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
