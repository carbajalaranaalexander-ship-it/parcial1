import React from 'react';
import { Download, X, Globe, ShieldCheck } from 'lucide-react';
import type { Certificado } from '../types';
import { jsPDF } from 'jspdf';

interface CertificateViewProps {
  certificado: Certificado;
  onClose: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  certificado,
  onClose,
}) => {
  
  const handleDownloadPDF = () => {
    // A4 dimensions landscape: 297mm x 210mm
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Outer double border
    doc.setDrawColor(59, 130, 246); // Blue
    doc.setLineWidth(1.5);
    doc.rect(10, 10, 277, 190);
    
    doc.setDrawColor(147, 197, 253); // Light Blue inner line
    doc.setLineWidth(0.5);
    doc.rect(12, 12, 273, 186);

    // Decorative corners
    doc.rect(14, 14, 6, 6);
    doc.rect(277, 14, 6, 6);
    doc.rect(14, 190, 6, 6);
    doc.rect(277, 190, 6, 6);

    // Title / Institution
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138); // Navy blue
    doc.text('UNIVERSIDAD NACIONAL DEL CENTRO DEL PERU', 148.5, 30, { align: 'center' });
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text('FACULTAD DE INGENIERÍA DE SISTEMAS   |   COMITÉ DE ACREDITACIÓN', 148.5, 36, { align: 'center' });

    // Main header
    doc.setFont('Times-BoldItalic', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(217, 119, 6); // Amber
    doc.text('Certificado de Acreditación Profesional', 148.5, 52, { align: 'center' });

    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('Se otorga con distinción el presente diploma a:', 148.5, 68, { align: 'center' });

    // Name
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // Charcoal
    doc.text(certificado.nombreUsuario, 148.5, 82, { align: 'center' });
    
    doc.setDrawColor(203, 213, 225); // Underline for name
    doc.setLineWidth(0.75);
    doc.line(70, 86, 227, 86);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Identificado con Documento de Identidad N° ${certificado.documentoUsuario}`, 148.5, 92, { align: 'center' });

    // Body text
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    doc.text('Por haber demostrado aptitudes sobresalientes y aprobado satisfactoriamente la evaluación:', 148.5, 108, { align: 'center' });
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(30, 58, 138);
    doc.text(certificado.nombreExamen, 148.5, 118, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Cumpliendo con todos los criterios y estándares académicos establecidos por el comité.', 148.5, 126, { align: 'center' });

    // Date
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Emitido el día ${certificado.fechaEmision}`, 148.5, 140, { align: 'center' });

    // Signatures
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    
    // Left signature
    doc.line(45, 168, 105, 168);
    doc.setFont('Helvetica', 'bold');
    doc.text('Mg. Ing. Presidente del Comité', 75, 172, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.text('Presidente del Comité', 75, 176, { align: 'center' });

    // Right signature
    doc.line(192, 168, 252, 168);
    doc.setFont('Helvetica', 'bold');
    doc.text('FACULTAD DE INGENIERÍA', 222, 172, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.text('Director de Acreditación', 222, 176, { align: 'center' });

    // Seal shape (vector circle)
    doc.setDrawColor(217, 119, 6);
    doc.setFillColor(255, 251, 235);
    doc.setLineWidth(0.5);
    doc.circle(148.5, 165, 10, 'FD');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(5);
    doc.setTextColor(217, 119, 6);
    doc.text('VALIDADO', 148.5, 164.5, { align: 'center' });
    doc.text('UNCP-FIS', 148.5, 167.5, { align: 'center' });

    // Hash text at bottom center
    doc.setFont('Courier', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`VERIFY HASH: ${certificado.hash}`, 148.5, 194, { align: 'center' });

    // Save PDF
    doc.save(`Certificado_${certificado.nombreUsuario.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="certificate-container animate-fade-in no-print">
      
      {/* Top action bar */}
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem' }}>
          <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
          Vista del Certificado Digital
        </h3>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            <Download size={16} /> Descargar PDF
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={onClose} title="Cerrar">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* HTML Diploma View */}
      <div className="certificate-paper" id="certificate-html-view">
        
        {/* Seal element in background */}
        <div className="certificate-seal animate-float" style={{ position: 'absolute', right: '4rem', top: '3rem' }}>
          UNCP FIS
        </div>

        <div className="certificate-header">
          <div className="certificate-logo">UNIVERSIDAD NACIONAL DEL CENTRO DEL PERU</div>
          <div className="certificate-subtitle">Facultad de Ingeniería de Sistemas</div>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>
            Comité Técnico de Acreditación Profesional
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="certificate-title">Certificado de Acreditación</h2>
          <span className="certificate-present">Se otorga el presente diploma de validez nacional a:</span>
          <h1 className="certificate-name">{certificado.nombreUsuario}</h1>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.1rem' }}>
            Documento de Identidad N°: <strong>{certificado.documentoUsuario}</strong>
          </p>
        </div>

        <div className="certificate-body">
          Por haber demostrado un desempeño sobresaliente y aprobado con éxito la evaluación curricular correspondiente a la especialización en: <br />
          <strong>{certificado.nombreExamen}</strong>, de conformidad con las exigencias académicas fijadas por este comité.
        </div>

        <div className="certificate-footer">
          <div className="certificate-sig">
            <div className="sig-line"></div>
            <div className="sig-name">Mg. Ing. Presidente del Comité</div>
            <div className="sig-title">Presidente del Comité</div>
          </div>

          <div className="certificate-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem' }}>
              <ShieldCheck size={14} /> ACREDITADO
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>Fecha: {certificado.fechaEmision}</span>
            <span className="certificate-hash">HASH: {certificado.hash}</span>
          </div>

          <div className="certificate-sig">
            <div className="sig-line"></div>
            <div className="sig-name">FACULTAD DE INGENIERÍA</div>
            <div className="sig-title">Director de Acreditación</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Globe size={14} style={{ color: 'var(--primary)' }} />
        <span>URL Pública de Verificación: </span>
        <a href={certificado.urlVerificacion} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontFamily: 'monospace' }}>
          {certificado.urlVerificacion}
        </a>
      </div>
    </div>
  );
};
export default CertificateView;
