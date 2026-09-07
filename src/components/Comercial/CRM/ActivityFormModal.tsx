import React, { useState } from 'react';
import { X, Calendar, Activity, Building2, User, Clock, Flag, FileText } from 'lucide-react';
import { ModalPortal } from '../../common/ModalPortal';
import { CrmActivity } from '../../../data/mockCrmData';

interface ActivityFormModalProps {
  onClose: () => void;
  onSave: (activity: CrmActivity) => void;
  defaultAccount?: string;
  defaultOpportunityFolio?: string;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  onClose,
  onSave,
  defaultAccount = '',
  defaultOpportunityFolio = '',
}) => {
  const [type, setType] = useState<CrmActivity['type']>('Llamada');
  const [account, setAccount] = useState(defaultAccount || 'BLACK & DECKER');
  const [opportunityFolio, setOpportunityFolio] = useState(defaultOpportunityFolio);
  const [subject, setSubject] = useState('');
  const [whenDate, setWhenDate] = useState('08 Sep · 11:00');
  const [owner, setOwner] = useState('Lucía Torres');
  const [priority, setPriority] = useState<CrmActivity['priority']>('Alta');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError('El asunto de la actividad es obligatorio.');
      return;
    }

    const newActivity: CrmActivity = {
      id: `act-${Date.now()}`,
      type,
      account: account.trim(),
      opportunityFolio: opportunityFolio.trim() || undefined,
      subject: subject.trim(),
      when: whenDate,
      owner,
      status: 'Hoy',
      priority,
      notes: notes.trim(),
    };

    onSave(newActivity);
  };

  return (
    <ModalPortal onClose={onClose} closeOnBackdropClick>
      <div className="w-full max-w-lg rounded-3xl bg-theme-surface border border-theme-subtle shadow-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
                CRM COMERCIAL &middot; CADENCIA
              </p>
              <h2 className="text-lg font-black text-theme-main">Nueva Actividad Comercial</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main">Tipo de Actividad</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-theme-base font-semibold text-theme-main cursor-pointer"
              >
                <option value="Llamada">Llamada telefónica</option>
                <option value="Correo">Correo electrónico</option>
                <option value="Reunión">Reunión / Videollamada</option>
                <option value="Visita">Visita en planta</option>
                <option value="Seguimiento">Seguimiento técnico</option>
                <option value="Tarea">Tarea interna</option>
              </select>
            </div>

            {/* Prioridad */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-theme-base font-semibold text-theme-main cursor-pointer"
              >
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>

            {/* Cuenta */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-theme-primary" />
                <span>Cuenta / Cliente *</span>
              </label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Ej. TYCO"
                className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-theme-base font-semibold text-theme-main"
                required
              />
            </div>

            {/* Oportunidad Folio */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main">Oportunidad (Opcional)</label>
              <input
                type="text"
                value={opportunityFolio}
                onChange={(e) => setOpportunityFolio(e.target.value)}
                placeholder="Ej. OPP-2026-0041"
                className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-theme-base font-mono text-theme-main"
              />
            </div>

            {/* Fecha / Hora */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-theme-primary" />
                <span>Fecha y Hora Programada</span>
              </label>
              <input
                type="text"
                value={whenDate}
                onChange={(e) => setWhenDate(e.target.value)}
                placeholder="Ej. 08 Sep · 11:30"
                className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-theme-base font-mono text-theme-main"
              />
            </div>

            {/* Responsable */}
            <div className="space-y-1.5">
              <label className="font-bold text-theme-main flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-theme-primary" />
                <span>Ejecutivo Responsable</span>
              </label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-theme-subtle bg-theme-base font-semibold text-theme-main cursor-pointer"
              >
                <option>Lucía Torres</option>
                <option>Marco Salinas</option>
                <option>Andrea Peña</option>
              </select>
            </div>
          </div>

          {/* Asunto */}
          <div className="space-y-1.5">
            <label className="font-bold text-theme-main">Asunto / Objetivo Comercial *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setError('');
              }}
              placeholder="Ej. Revisar cotización y confirmar fecha de autorización"
              className="w-full px-3.5 py-2.5 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none font-semibold text-theme-main"
              required
            />
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="font-bold text-theme-main flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-theme-muted" />
              <span>Notas o Preparación Previa</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles sobre puntos a discutir, objeciones esperadas o acuerdos."
              className="w-full p-3 rounded-xl border border-theme-subtle bg-theme-base focus:border-theme-primary focus:outline-none text-theme-main resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-theme-subtle flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-subtle font-bold text-theme-muted hover:text-theme-main cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary/90 text-white font-bold shadow-md transition-all cursor-pointer"
            >
              Agendar Actividad
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};
