import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Calendar,
  User,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { Incident, IncidentStatus, IncidentType } from '../../data/mockNominaData';
import { ImportModalFake } from './ImportModalFake';

interface IncidentCenterProps {
  incidents: Incident[];
  onAuthorizeIncident: (id: string) => void;
  onRejectIncident: (id: string) => void;
  onTriggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const IncidentCenter: React.FC<IncidentCenterProps> = ({
  incidents,
  onAuthorizeIncident,
  onRejectIncident,
  onTriggerToast,
}) => {
  const [selectedType, setSelectedType] = useState<string>('TODOS');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedIncidentDetail, setSelectedIncidentDetail] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesType = selectedType === 'TODOS' || inc.tipo === selectedType;
    const matchesStatus = selectedStatus === 'TODOS' || inc.estado === selectedStatus;
    return matchesType && matchesStatus;
  });

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'autorizada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-emerald-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Autorizada</span>
          </span>
        );
      case 'pendiente_revision':
      case 'detectada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-amber-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Pendiente Revisión</span>
          </span>
        );
      case 'rechazada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-rose-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Rechazada</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-blue-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Aplicada a Nómina</span>
          </span>
        );
    }
  };

  const getTypeName = (tipo: IncidentType) => {
    switch (tipo) {
      case 'hora_adicional': return 'Hora Adicional / Extra';
      case 'retardo': return 'Retardo Justificado/Injustificado';
      case 'permiso_con_reposicion': return 'Permiso con Reposición (RTM)';
      case 'checada_incompleta': return 'Checada Incompleta';
      case 'vacaciones': return 'Vacaciones';
      case 'incapacidad': return 'Incapacidad IMSS';
      case 'falta': return 'Falta Injustificada';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Toolbar Superior */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-zinc-950">Centro de Incidencias y Novedades</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-900 border border-zinc-300 shadow-2xs">
              {incidents.length} registradas
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gestión de horas extras, permisos con reposición RTM, retardos, omisiones de checada e incapacidades
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => onTriggerToast('Plantilla de incidencias descargada · RTM_Plantilla_Incidencias.xlsx', 'success')}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Plantilla</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-theme-primary" />
            <span>Importar incidencias</span>
          </button>

          <button
            onClick={() => onTriggerToast('Captura manual de incidencia demo iniciada', 'info')}
            className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Incidencia</span>
          </button>
        </div>
      </div>

      {/* Regla Especial RTM Banner Destacado (Sección 10.2) */}
      <div className="p-4 rounded-2xl bg-white border-2 border-theme-primary shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-theme-primary/10 border border-theme-primary/20 flex items-center justify-center text-theme-primary shrink-0 mt-0.5">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-zinc-950 uppercase tracking-wider">
                Regla Particular RTM: Permiso con Reposición de Horas
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                ACTIVO EN PERIODO
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 leading-relaxed max-w-3xl">
              RTM permite a operadores operativos solicitar permisos personales sin descuento inmediato, pactando la reposición de horas en turnos posteriores. En este periodo: <strong>Jesús Alberto Peña (RTM-005)</strong> solicitó 2.0 h el 04-sep y repuso 1.0 h el 05-sep y 1.0 h el 06-sep en piso. Saldo remanente: <strong className="text-emerald-700 font-mono">0.0 h</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-600">Filtrar por tipo:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="hora_adicional">Horas adicionales</option>
            <option value="retardo">Retardos</option>
            <option value="permiso_con_reposicion">Permiso con reposición</option>
            <option value="checada_incompleta">Checada incompleta</option>
            <option value="vacaciones">Vacaciones</option>
            <option value="incapacidad">Incapacidad</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-600">Estado de autorización:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-xs font-medium focus:ring-2 focus:ring-theme-primary/20 outline-none"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="pendiente_revision">Pendientes de revisión</option>
            <option value="autorizada">Autorizadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Lista de Incidencias */}
      <div className="space-y-3">
        {filteredIncidents.map((inc) => {
          const isReposition = inc.tipo === 'permiso_con_reposicion';
          const isPending = inc.estado === 'pendiente_revision' || inc.estado === 'detectada';

          return (
            <div
              key={inc.id}
              className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-2xs hover:border-zinc-300 transition-all space-y-3"
            >
              {/* Header card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 font-mono font-bold text-xs">
                    {inc.empleadoId.replace('RTM-', '')}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-950">
                      {inc.empleadoNombre} · <span className="text-zinc-500 font-normal">{inc.puesto} ({inc.departamento})</span>
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-0.5">
                      <span>Folio: <strong>{inc.id}</strong></span>
                      <span>·</span>
                      <span>Fecha: <strong>{inc.fecha}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                    {getTypeName(inc.tipo)}
                  </span>
                  {getStatusBadge(inc.estado)}
                </div>
              </div>

              {/* Body motive */}
              <div className="text-xs text-zinc-700">
                <p><strong>Motivo / Justificación:</strong> {inc.motivo}</p>
                {inc.horas && (
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Tiempo involucrado: <strong className="font-mono text-zinc-900">{inc.horas} horas</strong>
                    {inc.monto ? ` · Importe estimado: $${inc.monto.toFixed(2)} MXN` : ''}
                  </p>
                )}
              </div>

              {/* RTM Reposition Mini-Historial (Sección 10.2) */}
              {isReposition && inc.reposicion && (
                <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-zinc-900 uppercase tracking-wider">
                      Control de Reposición de Horas en Piso
                    </span>
                    <span className="font-mono font-bold text-emerald-700">
                      Saldo por reponer: {inc.reposicion.saldoPorReponer.toFixed(1)} h (Cubierto 100%)
                    </span>
                  </div>

                  <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-lg overflow-hidden bg-white text-[11px]">
                    {inc.reposicion.historial.map((h, hIdx) => (
                      <div key={hIdx} className="px-3 py-1.5 flex justify-between items-center">
                        <span className="font-mono text-zinc-500">{h.fecha}:</span>
                        <span className="font-medium text-zinc-800">{h.registradoPor}</span>
                        {h.opRelacionada && (
                          <span className="font-mono text-theme-primary font-bold text-[10px]">{h.opRelacionada}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer authorization */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 text-[11px]">
                {inc.autorizadoPor ? (
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Autorizado por: <strong className="text-zinc-800">{inc.autorizadoPor}</strong> ({inc.fechaAutorizacion})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pendiente de autorización por Supervisor / RH</span>
                  </div>
                )}

                {/* Actions if pending */}
                {isPending && (
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => onRejectIncident(inc.id)}
                      className="px-3 py-1 rounded-xl border border-zinc-200 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-zinc-600 transition-colors cursor-pointer"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => onAuthorizeIncident(inc.id)}
                      className="px-4 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Autorizar Incidencia</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Fake de Importación de Incidencias */}
      <ImportModalFake
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Incidencias de Producción y RH"
        subtitle="Carga de permisos, horas extras y retardos desde Excel o formato de supervisor"
        templateFileName="RTM_Incidencias_Semana36.xlsx"
        sampleColumns={['Folio', 'No. Emp', 'Tipo Incidencia', 'Fecha', 'Horas', 'Autorizado Por', 'Motivo']}
        sampleRows={[
          ['INC-901', 'RTM-001', 'Hora adicional', '03/09/2026', '1.5', 'Roberto Castillo', 'Tiraje urgente Pharma OP-95842'],
          ['INC-902', 'RTM-002', 'Hora adicional', '02/09/2026', '2.0', 'Roberto Castillo', 'Calibración rodillo anilox'],
          ['INC-903', 'RTM-005', 'Permiso reposición', '04/09/2026', '2.0', 'Roberto Castillo', 'Cita médica / Repuso en fin de semana'],
          ['INC-904', 'RTM-007', 'Vacaciones', '31/08/2026', '48.0', 'Andrea Salazar', 'Periodo anual'],
          ['INC-905', 'RTM-011', 'Incapacidad', '01/09/2026', '48.0', 'Andrea Salazar', 'Incapacidad IMSS EG-2026-904'],
        ]}
        onSuccessMessage="9 incidencias importadas y validadas correctamente"
        onSuccess={() => {
          onTriggerToast('9 incidencias importadas y conciliadas correctamente con la nómina', 'success');
        }}
      />
    </div>
  );
};
