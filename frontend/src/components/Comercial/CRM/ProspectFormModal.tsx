import React, { useState } from 'react';
import { X, UserPlus, Building2, User, Mail, Phone, Tag, Layers, FileText } from 'lucide-react';
import { ModalPortal } from '../../common/ModalPortal';
import { CrmProspect, CrmLine } from '../../../data/mockCrmData';

interface ProspectFormModalProps {
  onClose: () => void;
  onSave: (prospect: CrmProspect) => void;
}

export const ProspectFormModal: React.FC<ProspectFormModalProps> = ({ onClose, onSave }) => {
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [industry, setIndustry] = useState('Manufactura industrial');
  const [source, setSource] = useState<'Referido' | 'Sitio web' | 'Prospección' | 'Evento / feria' | 'Cliente existente'>('Referido');
  const [interest, setInterest] = useState('');
  const [line, setLine] = useState<CrmLine>('Flexografía');
  const [seller, setSeller] = useState('Lucía Torres');
  const [notes, setNotes] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) {
      setError('El nombre de la empresa es obligatorio.');
      return;
    }
    if (!contact.trim()) {
      setError('El nombre del contacto principal es obligatorio.');
      return;
    }

    // Calcular lead score inicial coherente
    let score = 65;
    const reasons: string[] = [];

    if (industry.includes('Manufactura') || industry.includes('Médico') || industry.includes('Automotriz')) {
      score += 15;
      reasons.push('Sector industrial estratégico (+15)');
    }
    if (source === 'Referido' || source === 'Cliente existente') {
      score += 12;
      reasons.push('Fuente confiable (+12)');
    }
    if (email.includes('@') && phone.length > 5) {
      score += 8;
      reasons.push('Datos de contacto completos (+8)');
    }

    const newProspect: CrmProspect = {
      id: `lead-${Date.now()}`,
      company: company.trim(),
      contact: contact.trim(),
      email: email.trim() || 'contacto@demo.com',
      phone: phone.trim() || '+52 (81) 8000-0000',
      industry,
      source,
      interest: interest.trim() || 'Etiquetas y empaque industrial',
      line,
      seller,
      score: Math.min(95, score),
      scoreReasons: reasons.length ? reasons : ['Prospecto registrado en CRM (+65)'],
      last: 'Hoy',
      next: 'Programar llamada de calificación',
      status: 'Nuevo',
      notes: notes.trim(),
    };

    onSave(newProspect);
  };

  return (
    <ModalPortal onClose={onClose} closeOnBackdropClick>
      <div className="w-full max-w-xl rounded-3xl bg-theme-surface border border-theme-subtle shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
                CRM COMERCIAL &middot; ALTA DE LEAD
              </p>
              <h2 className="text-lg font-black text-theme-main">Nuevo Prospecto Comercial</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-theme-muted hover:text-theme-main p-1.5 rounded-xl hover:bg-theme-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Empresa */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-theme-primary" />
                <span>Empresa / Razón Social *</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setError('');
                }}
                placeholder="Ej. ACME Corporation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main"
                required
              />
            </div>

            {/* Contacto */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-theme-primary" />
                <span>Contacto Principal *</span>
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => {
                  setContact(e.target.value);
                  setError('');
                }}
                placeholder="Ej. Ing. Roberto Cantú"
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-theme-primary" />
                <span>Correo Electrónico</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rcantu@empresa.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-mono text-theme-main"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-theme-primary" />
                <span>Teléfono de Contacto</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+52 (81) 1234-5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-mono text-theme-main"
              />
            </div>

            {/* Industria */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main">Industria / Sector</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main cursor-pointer"
              >
                <option>Manufactura industrial</option>
                <option>Automotriz Tier 1/2</option>
                <option>Médico / Farmacéutico</option>
                <option>Electrónica / Eléctrico</option>
                <option>Alimentos y bebidas</option>
                <option>Comercio y retail</option>
              </select>
            </div>

            {/* Origen */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main">Origen / Fuente</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main cursor-pointer"
              >
                <option value="Referido">Referido comercial</option>
                <option value="Sitio web">Sitio web / Inbound</option>
                <option value="Prospección">Prospección en frío</option>
                <option value="Evento / feria">Evento / Expo industrial</option>
                <option value="Cliente existente">Cliente existente / Reactivación</option>
              </select>
            </div>

            {/* Línea Productiva */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-theme-primary" />
                <span>Línea Productiva Principal</span>
              </label>
              <select
                value={line}
                onChange={(e) => setLine(e.target.value as CrmLine)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main cursor-pointer"
              >
                <option value="Offset">Offset (Manuales / Instructivos)</option>
                <option value="Flexografía">Flexografía (Etiquetas / Bobinas)</option>
                <option value="Serigrafía">Serigrafía (Tags / Policarbonato)</option>
                <option value="Acabados / conversión">Acabados / Blister cards</option>
              </select>
            </div>

            {/* Vendedor Asignado */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main">Ejecutivo Asignado</label>
              <select
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main cursor-pointer"
              >
                <option>Lucía Torres</option>
                <option>Marco Salinas</option>
                <option>Andrea Peña</option>
              </select>
            </div>
          </div>

          {/* Interés específico */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-theme-main">Interés / Requerimiento Específico</label>
            <input
              type="text"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              placeholder="Ej. Etiquetas térmicas BoPP para producto de exportación"
              className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main"
            />
          </div>

          {/* Notas */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-theme-main flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-theme-muted" />
              <span>Notas Comerciales Iniciales</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles sobre volumen esperado, fecha de cierre estimada o requerimiento de muestras."
              className="w-full p-3 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none text-theme-main resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-theme-subtle flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-subtle font-bold text-xs text-theme-muted hover:text-theme-main cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Guardar Prospecto
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};
