import { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import type { Usuario, Examen, IntentoExamen, Certificado } from './types';
import Navbar from './components/Navbar';
import ComiteDashboard from './components/ComiteDashboard';
import ExamEditor from './components/ExamEditor';
import UserPortal from './components/UserPortal';
import ExamRunner from './components/ExamRunner';
import ExamResult from './components/ExamResult';
import CertificateView from './components/CertificateView';
import CertificateVerifier from './components/CertificateVerifier';
import UserCV from './components/UserCV';
import { ShieldCheck } from 'lucide-react';

export function App() {
  // Initialize storage seeds
  useEffect(() => {
    storage.init();
  }, []);

  // Core App State
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    storage.init();
    return storage.getUsuarios();
  });

  const [examenes, setExamenes] = useState<Examen[]>(() => {
    storage.init();
    return storage.getExamenes();
  });

  const [intentos, setIntentos] = useState<IntentoExamen[]>(() => {
    storage.init();
    return storage.Intentos.get();
  });

  const [certificados, setCertificados] = useState<Certificado[]>(() => {
    storage.init();
    return storage.Certificados.get();
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    storage.init();
    return storage.getCurrentUserId();
  });

  // Routing and Selection State
  const [currentView, setCurrentView] = useState<string>('usuarios');
  const [selectedExam, setSelectedExam] = useState<Examen | null>(null);
  const [selectedExamToEdit, setSelectedExamToEdit] = useState<Examen | null>(null);
  const [currentIntento, setCurrentIntento] = useState<IntentoExamen | null>(null);
  const [currentCertificate, setCurrentCertificate] = useState<Certificado | null>(null);
  const [viewingCVUserId, setViewingCVUserId] = useState<string | null>(null);
  
  // URL verification query
  const [initialHashQuery, setInitialHashQuery] = useState<string | undefined>(undefined);

  // Sync state to local storage and hook URL changes
  useEffect(() => {
    // Parse URL query strings for public URL simulation
    const params = new URLSearchParams(window.location.search);
    const verifyHash = params.get('verify');
    const view = params.get('view');
    const userId = params.get('userId');
    const certHash = params.get('certHash');

    if (verifyHash) {
      setCurrentView('verificacion');
      setInitialHashQuery(verifyHash);
    } else if (view === 'cv' && userId) {
      setViewingCVUserId(userId);
      setCurrentView('cv');
    } else if (view === 'certificate' && certHash) {
      const cert = storage.Certificados.getByHash(certHash);
      if (cert) {
        setCurrentCertificate(cert);
        setCurrentView('certificado');
      }
    }
  }, []);

  const handleUserChange = (userId: string) => {
    setCurrentUserId(userId);
    storage.setCurrentUserId(userId);
  };

  // State Updaters
  const handleRegisterUser = (newUser: Usuario): boolean => {
    const success = storage.addUsuario(newUser);
    if (success) {
      setUsuarios(storage.getUsuarios());
      setCurrentUserId(newUser.id);
    }
    return success;
  };

  const handleSaveUser = (updatedUser: Usuario) => {
    storage.updateUsuario(updatedUser);
    setUsuarios(storage.getUsuarios());
  };

  const handleSaveExam = (exam: Examen) => {
    const exists = examenes.some((e) => e.id === exam.id);
    if (exists) {
      storage.updateExamen(exam);
    } else {
      storage.addExamen(exam);
    }
    setExamenes(storage.getExamenes());
    setSelectedExamToEdit(null);
    setCurrentView('comite');
  };

  const handleDeleteExam = (id: string) => {
    storage.deleteExamen(id);
    setExamenes(storage.getExamenes());
  };

  const handleSubmitExam = (intento: IntentoExamen, cert?: Certificado) => {
    storage.Intentos.add(intento);
    setIntentos(storage.Intentos.get());

    if (cert) {
      storage.Certificados.add(cert);
      setCertificados(storage.Certificados.get());
    }

    const exam = examenes.find((e) => e.id === intento.examenId);
    if (exam) {
      setSelectedExam(exam);
    }
    setCurrentIntento(intento);
    setCurrentView('resultado');
  };

  // View switchers
  const handleViewChange = (view: string) => {
    // Clear selections when switching main tabs
    setSelectedExam(null);
    setSelectedExamToEdit(null);
    setCurrentIntento(null);
    setCurrentCertificate(null);
    setViewingCVUserId(null);
    setInitialHashQuery(undefined);
    
    // Clear query parameter visually
    if (window.location.search) {
      window.history.pushState({}, '', window.location.pathname);
    }

    setCurrentView(view);
  };

  const handleViewCertificateFromHash = (hash: string) => {
    const cert = certificados.find((c) => c.hash === hash);
    if (cert) {
      setCurrentCertificate(cert);
      setCurrentView('certificado');
    }
  };

  const handleViewCertificateObj = (cert: Certificado) => {
    setCurrentCertificate(cert);
    setCurrentView('certificado');
  };

  const handleViewResult = (intento: IntentoExamen) => {
    const exam = examenes.find((e) => e.id === intento.examenId);
    if (exam) {
      setSelectedExam(exam);
    }
    setCurrentIntento(intento);
    setCurrentView('resultado');
  };

  const handleViewCV = (userId: string) => {
    setViewingCVUserId(userId);
    setCurrentView('cv');
  };

  return (
    <div className="app-container">
      {/* Header / Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        usuarios={usuarios}
        currentUserId={currentUserId}
        onUserChange={handleUserChange}
      />

      {/* Main Body */}
      <main className="main-content">
        {currentView === 'comite' && !selectedExamToEdit && (
          <ComiteDashboard
            examenes={examenes}
            onCreateExam={() => {
              setSelectedExamToEdit(null);
              setCurrentView('editorExamen');
            }}
            onEditExam={(exam) => {
              setSelectedExamToEdit(exam);
              setCurrentView('editorExamen');
            }}
            onDeleteExam={handleDeleteExam}
          />
        )}

        {currentView === 'editorExamen' && (
          <ExamEditor
            onSave={handleSaveExam}
            onCancel={() => setCurrentView('comite')}
            initialExam={selectedExamToEdit || undefined}
          />
        )}

        {currentView === 'usuarios' && (
          <UserPortal
            usuarios={usuarios}
            examenes={examenes}
            intentos={intentos}
            certificados={certificados}
            currentUserId={currentUserId}
            onSelectUser={handleUserChange}
            onRegisterUser={handleRegisterUser}
            onTakeExam={(exam) => {
              setSelectedExam(exam);
              setCurrentView('exam');
            }}
            onViewCV={handleViewCV}
            onViewCertificate={handleViewCertificateFromHash}
            onViewResult={handleViewResult}
          />
        )}

        {currentView === 'exam' && selectedExam && (
          <ExamRunner
            examen={selectedExam}
            usuario={usuarios.find((u) => u.id === currentUserId)!}
            onSubmitExam={handleSubmitExam}
            onCancel={() => setCurrentView('usuarios')}
          />
        )}

        {currentView === 'resultado' && currentIntento && selectedExam && (
          <ExamResult
            intento={currentIntento}
            examen={selectedExam}
            usuario={usuarios.find((u) => u.id === currentIntento.usuarioId)!}
            onViewCertificate={handleViewCertificateFromHash}
            onClose={() => handleViewChange('usuarios')}
          />
        )}

        {currentView === 'certificado' && currentCertificate && (
          <CertificateView
            certificado={currentCertificate}
            onClose={() => {
              if (viewingCVUserId) {
                setCurrentView('cv');
              } else {
                setCurrentView('usuarios');
              }
            }}
          />
        )}

        {currentView === 'verificacion' && (
          <CertificateVerifier
            onSearchHash={(hash) => certificados.find((c) => c.hash.toUpperCase() === hash.toUpperCase())}
            onViewCertificate={handleViewCertificateObj}
            initialHash={initialHashQuery}
          />
        )}

        {currentView === 'cv' && viewingCVUserId && (
          <UserCV
            usuario={usuarios.find((u) => u.id === viewingCVUserId)!}
            certificados={certificados.filter((c) => c.usuarioId === viewingCVUserId)}
            isCurrentUser={viewingCVUserId === currentUserId}
            onSaveUser={handleSaveUser}
            onViewCertificate={handleViewCertificateFromHash}
            onClose={() => handleViewChange('usuarios')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={16} style={{ color: 'var(--primary)' }} />
          <strong>Universidad Nacional del Centro del Perú</strong>
        </div>
        <p style={{ margin: '0.2rem 0' }}>
          Facultad de Ingeniería de Sistemas | Curso: Desarrollo de Aplicaciones Web (IX Ciclo)
        </p>
        <p style={{ margin: '0.2rem 0', fontWeight: '500', color: 'var(--primary)' }}>
          Desarrollado por Estudiante de Sistemas &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
export default App;
