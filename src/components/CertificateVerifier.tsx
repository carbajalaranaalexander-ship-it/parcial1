import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import type { Certificado } from '../types';

interface CertificateVerifierProps {
  onSearchHash: (hash: string) => Certificado | undefined;
  onViewCertificate: (certificado: Certificado) => void;
  initialHash?: string;
}

export const CertificateVerifier: React.FC<CertificateVerifierProps> = ({
  onSearchHash,
  onViewCertificate,
  initialHash,
}) => {
  const [hashInput, setHashInput] = useState(initialHash || '');
  const [result, setResult] = useState<{ status: 'idle' | 'found' | 'not_found'; cert?: Certificado }>({
    status: 'idle',
  });

  useEffect(() => {
    if (initialHash) {
      handleVerify(initialHash);
    }
  }, [initialHash]);

  const handleVerify = (searchHash?: string) => {
    const query = (searchHash || hashInput).trim();
    if (!query) return;

    const cert = onSearchHash(query);
    if (cert) {
      setResult({ status: 'found', cert });
    } else {
      setResult({ status: 'not_found' });
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Page Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ justifyContent: 'center' }}>
          <ShieldCheck size={28} style={{ color: 'var(--primary)' }} />
          Verificación Pública de Certificados
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Valide la autenticidad e integridad de los certificados profesionales emitidos por nuestra institución.
        </p>
      </div>

      {/* Input Group */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Ingrese el Código de Verificación (HASH)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <input
                type="text"
                className="form-input"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Ej. crt-XXXX-XXXX"
                style={{ paddingLeft: '2.5rem' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify();
                }}
              />
              <Search
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
              />
            </div>
            <button className="btn btn-primary" onClick={() => handleVerify()}>
              Verificar
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result.status === 'found' && result.cert && (
        <div className="glass-card animate-fade-in" style={{ border: '2px solid var(--success)', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(17,24,39,0.6) 100%)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShieldCheck size={28} />
            <div>
              <strong style={{ fontSize: '1.1rem', display: 'block' }}>CERTIFICADO DE VALIDEZ CONFIRMADA</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Este certificado es oficial y se encuentra registrado en el sistema.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>ACREDITADO</span>
              <strong>{result.cert.nombreUsuario}</strong> (DNI: {result.cert.documentoUsuario})
            </div>
            
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>ESPECIALIZACIÓN / EXAMEN</span>
              <strong>{result.cert.nombreExamen}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>FECHA DE EMISIÓN</span>
                <strong>{result.cert.fechaEmision}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>CÓDIGO HASH</span>
                <strong style={{ fontFamily: 'monospace' }}>{result.cert.hash}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            <button className="btn btn-success btn-sm" onClick={() => onViewCertificate(result.cert!)}>
              Visualizar Diploma <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {result.status === 'not_found' && (
        <div className="glass-card animate-fade-in" style={{ border: '2px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(239,68,68,0.04)' }}>
          <ShieldAlert size={36} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--danger)', marginBottom: '0.25rem' }}>
              DOCUMENTO NO VÁLIDO / NO REGISTRADO
            </strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              El código hash proporcionado no coincide con ningún registro de certificación emitido en nuestra base de datos. Verifique que esté escrito de forma exacta.
            </p>
          </div>
        </div>
      )}

      {result.status === 'idle' && (
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderStyle: 'dashed' }}>
          <FileText size={24} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Puede probar el validador copiando el HASH del certificado generado al aprobar cualquiera de los exámenes disponibles.
          </span>
        </div>
      )}
    </div>
  );
};
export default CertificateVerifier;
