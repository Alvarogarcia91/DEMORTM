import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileSearch,
  FileText,
  Filter,
  HardDrive,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  Tag,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react';
import {
  BACKUP_LOGS,
  CONTROL_PLANS,
  CONTROLLED_DOCUMENTS,
  CROSS_CONSULTATIONS,
  CUSTOMER_REQUIREMENTS,
  ICAR_ACTIONS,
  MASTER_AUDIT_TRAIL,
  QUALITY_DEVIATIONS,
  ControlPlanItem,
  CustomerQualityRequirement,
  IcarAction,
  QualityDeviation,
} from '../../data/mockCalidadData';

type SgcSubTab =
  | 'Revisión mensual'
  | 'Desviaciones & 4M'
  | 'Plan de Control'
  | 'Requisitos Cliente'
  | 'Audit Trail & Roles'
  | 'Integridad & Docs';

interface Props {
  deviations: QualityDeviation[];
  icars: IcarAction[];
  onOpenDeviationAnalysis: (deviation: QualityDeviation) => void;
  onOpenNewIcarModal?: () => void;
  onToast: (msg: string) => void;
  activeRole: string;
  onChangeRole: (newRole: string) => void;
}

export const GestionSGCWorkspace: React.FC<Props> = ({
  deviations,
  icars,
  onOpenDeviationAnalysis,
  onOpenNewIcarModal,
  onToast,
  activeRole,
  onChangeRole,
}) => {
  const [subTab, setSubTab] = useState<SgcSubTab>('Revisión mensual');
  const [selectedPeriod, setSelectedPeriod] = useState('Septiembre 2026 (Mes Actual)');
  const [selectedPlanPart, setSelectedPlanPart] = useState('526412 | G |');

  const filteredControlPlans = CONTROL_PLANS.filter((p) =>
    selectedPlanPart === 'Todas' ? true : p.partNumber.includes(selectedPlanPart)
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200 text-xs">
      {/* Header SGC y Selector de SubTabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-theme-subtle bg-theme-surface p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-theme-primary" />
            <h2 className="text-base font-black text-theme-main">
              Gestión Integral SGC (ISO 9001 / IATF 16949)
            </h2>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Gobernanza operativa: revisión mensual gerencial, análisis 4M, planes de control, requerimientos de cliente e integridad del sistema.
          </p>
        </div>

        {/* Selector de Rol Activo (Requisito P2) */}
        <div className="flex items-center gap-2 rounded-2xl border border-theme-subtle bg-theme-muted/10 p-2">
          <UserCheck className="h-4 w-4 text-theme-primary shrink-0" />
          <div>
            <small className="text-[10px] text-theme-muted uppercase font-bold block">
              Rol Activo en Sesión:
            </small>
            <select
              value={activeRole}
              onChange={(e) => {
                onChangeRole(e.target.value);
                onToast(`Perfil cambiado a: ${e.target.value}. Permisos de acción actualizados.`);
              }}
              className="bg-transparent font-bold text-theme-main text-xs focus:outline-none cursor-pointer"
            >
              <option value="Aseguramiento de Calidad (Alicia Ramírez)">Calidad (Alicia Ramírez)</option>
              <option value="Supervisor de Turno">Supervisor de Turno</option>
              <option value="Operador de Piso">Operador de Piso</option>
              <option value="Planeador de Producción">Planeador de Producción</option>
              <option value="Administrador SGC (Jorge Márquez)">Administrador SGC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub-Tabs de Navegación Compactas */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-theme-subtle pb-2">
        {(
          [
            'Revisión mensual',
            'Desviaciones & 4M',
            'Plan de Control',
            'Requisitos Cliente',
            'Audit Trail & Roles',
            'Integridad & Docs',
          ] as SgcSubTab[]
        ).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSubTab(item)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              subTab === item
                ? 'bg-theme-primary text-white shadow-xs'
                : 'bg-theme-surface text-theme-muted hover:text-theme-main hover:bg-theme-muted/30 border border-theme-subtle'
            }`}
          >
            {item}
            {item === 'Desviaciones & 4M' && (
              <span className="ml-1.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.2 text-[9px] font-black">
                {deviations.filter((d) => d.status === 'Activa').length}
              </span>
            )}
            {item === 'Requisitos Cliente' && (
              <span className="ml-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.2 text-[9px] font-black">
                {CUSTOMER_REQUIREMENTS.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 1. REVISIÓN MENSUAL SGC (Sección 15 del documento) */}
      {subTab === 'Revisión mensual' && (
        <div className="space-y-5">
          {/* Header de periodo y exportar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-theme-primary" />
              <span className="font-bold text-theme-main">Periodo de Evaluación SGC:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 font-bold text-theme-main"
              >
                <option value="Septiembre 2026 (Mes Actual)">Septiembre 2026 (Mes Actual)</option>
                <option value="Agosto 2026">Agosto 2026</option>
                <option value="Julio 2026">Julio 2026</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => onToast('✓ Informe Mensual de Calidad SGC exportado en PDF para la reunión gerencial.')}
              className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main hover:bg-theme-muted/30 shadow-2xs"
            >
              <Download className="h-4 w-4 text-theme-primary" />
              Exportar Informe Mensual SGC
            </button>
          </div>

          {/* Grid de KPIs de Revisión Gerencial */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              { label: '% Conforme Global', val: '97.4%', note: 'Meta: > 96.5%', tone: 'text-emerald-600' },
              { label: 'Liberaciones Conformes', val: '42 / 45', note: '3 no conformes en HOLD', tone: 'text-theme-main' },
              { label: 'Minutos 4M Perdidos', val: '185 min', note: '3 paros en el mes', tone: 'text-amber-600' },
              { label: 'Acciones Correctivas', val: '4 Abiertas', note: '12 cerradas eficazmente', tone: 'text-rose-600' },
              { label: 'Calibración Metrológica', val: '100%', note: '5 instrumentos vigentes', tone: 'text-emerald-600' },
              { label: 'Cumplimiento Clientes', val: '98.2%', note: '6 requerimientos auditados', tone: 'text-emerald-600' },
            ].map((kpi, idx) => (
              <div key={idx} className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-muted block">
                  {kpi.label}
                </span>
                <b className={`mt-1.5 block font-mono text-xl font-black ${kpi.tone}`}>{kpi.val}</b>
                <small className="text-[10px] text-theme-muted mt-0.5 block">{kpi.note}</small>
              </div>
            ))}
          </div>

          {/* Gráficos / Distribuciones Visuales: Pareto y 4M */}
          <div className="grid gap-5 xl:grid-cols-2">
            {/* Pareto de Defectos en Planta */}
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                <b className="text-theme-main text-xs font-black uppercase tracking-wider">
                  Pareto de Causas de No Conformidad (Mes en Curso)
                </b>
                <span className="text-[10px] text-theme-muted font-mono">Total defectos: 235 ejs</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { cause: 'Texto / Revisión desactualizada de arte', count: 145, pct: 62, tone: 'bg-rose-500' },
                  { cause: 'Variación de tono ΔE > 2.0 (Flexo)', count: 62, pct: 26, tone: 'bg-amber-500' },
                  { cause: 'Troquel incompleto / Desgaste de filo', count: 28, pct: 12, tone: 'bg-blue-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-theme-main font-bold">{item.cause}</span>
                      <span className="font-mono text-theme-muted">
                        {item.count} ejs ({item.pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-theme-muted/20 overflow-hidden">
                      <div className={`h-full ${item.tone} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución de Tiempos Perdidos por 4M */}
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-theme-subtle pb-2">
                <b className="text-theme-main text-xs font-black uppercase tracking-wider">
                  Distribución 4M de Minutos Perdidos en Piso
                </b>
                <span className="text-[10px] text-theme-muted font-mono">Total: 185 min</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  { name: 'Método (Ruta / Procedimiento)', min: '75 min', pct: '40%', desc: 'Secuencia omitida de corte' },
                  { name: 'Material (Variación BoPP)', min: '55 min', pct: '30%', desc: 'Freno y ajuste de tensión' },
                  { name: 'Máquina (Ajuste Rasqueta)', min: '47 min', pct: '25%', desc: 'Fuga en portarrasqueta' },
                  { name: 'Mano de obra (Reempaque)', min: '8 min', pct: '5%', desc: 'Etiquetado de sobrante' },
                ].map((m, idx) => (
                  <div key={idx} className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3">
                    <b className="text-theme-main block text-xs">{m.name}</b>
                    <span className="font-mono text-lg font-black text-theme-primary block mt-1">
                      {m.min}
                    </span>
                    <small className="text-[10px] text-theme-muted block">{m.desc}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DESVIACIONES AUTOMÁTICAS & 4M (Sección 13 y 14) */}
      {subTab === 'Desviaciones & 4M' && (
        <div className="space-y-5">
          {/* Tabla de Desviaciones */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
              <div>
                <h3 className="font-black text-sm text-theme-main">
                  Desviaciones Operativas Detectadas Automáticamente en Planta
                </h3>
                <p className="text-xs text-theme-muted">
                  Detección en tiempo real: órdenes detenidas &gt; 30 min, saltos de secuencia de routing y demoras vs estándar.
                </p>
              </div>
              <span className="rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-3 py-1 font-bold text-[10px]">
                {deviations.filter((d) => d.status === 'Activa').length} anomalías activas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-xs">
                <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                  <tr>
                    <th className="p-3 text-left">Folio / Tipo</th>
                    <th className="p-3 text-left">Orden & Máquina</th>
                    <th className="p-3 text-left">Esperado vs Ejecutado</th>
                    <th className="p-3 text-left">Minutos / 4M</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {deviations.map((dev) => (
                    <tr key={dev.id} className="hover:bg-theme-muted/10 transition-colors">
                      <td className="p-3">
                        <b className="font-mono text-theme-primary font-black block">{dev.id}</b>
                        <span className="font-bold text-theme-main">{dev.type}</span>
                      </td>

                      <td className="p-3 font-mono">
                        <b className="text-theme-main block">{dev.opFolio}</b>
                        <small className="text-theme-muted block">{dev.machine}</small>
                      </td>

                      <td className="p-3 max-w-xs">
                        <small className="text-emerald-700 dark:text-emerald-300 block font-mono">
                          Esp: {dev.expected}
                        </small>
                        <small className="text-rose-700 dark:text-rose-300 block font-mono font-bold mt-0.5">
                          Eje: {dev.actual}
                        </small>
                      </td>

                      <td className="p-3 font-mono">
                        <span className="text-rose-600 font-bold block">{dev.stoppedMinutes} min</span>
                        <span className="rounded-md bg-theme-muted/20 px-1.5 py-0.2 text-[10px] font-bold text-theme-main">
                          4M: {dev.category4M}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            dev.status === 'Activa'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                              : dev.status === 'En análisis 4M'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          ● {dev.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => onOpenDeviationAnalysis(dev)}
                          className="rounded-xl bg-theme-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-theme-primary/90"
                        >
                          [Analizar 4M]
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de Acciones Correctivas (ICAR) */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div>
                <h3 className="font-black text-sm text-theme-main">
                  Registro de Acciones Correctivas (ICAR / CAPA)
                </h3>
                <p className="text-xs text-theme-muted">
                  Causa raíz analizada mediante 5 Porqués, planes de acción preventiva y verificación de eficacia.
                </p>
              </div>
              <span className="text-[10px] font-bold text-theme-muted font-mono">
                {icars.length} acciones registradas
              </span>
            </div>

            <div className="space-y-3">
              {icars.map((icar) => (
                <div
                  key={icar.id}
                  className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-2 hover:bg-theme-muted/20 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <b className="font-mono text-xs font-black text-theme-primary">{icar.id}</b>
                      <span className="text-theme-muted">·</span>
                      <b className="text-theme-main text-xs">{icar.title}</b>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        icar.status === 'Abierta'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : icar.status === 'En contención'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      ● {icar.status}
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 text-[11px]">
                    <p>
                      <b className="text-theme-muted">Causa Raíz (5 Porqués):</b> {icar.rootCause}
                    </p>
                    <p>
                      <b className="text-theme-muted">Acción Correctiva:</b> {icar.correctiveAction}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-theme-subtle pt-2 text-[10px] text-theme-muted">
                    <span>
                      Responsable: <b className="text-theme-main">{icar.responsible}</b> · Área: {icar.area} (4M: {icar.category4M})
                    </span>
                    <span>
                      Verificación de Eficacia Due: <b className="font-mono text-theme-main">{icar.verificationDue}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. PLAN DE CONTROL POR ARTÍCULO / REVISIÓN (Sección 17) */}
      {subTab === 'Plan de Control' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-theme-subtle bg-theme-surface p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-theme-primary" />
              <span className="font-bold text-theme-main">Seleccionar Número de Parte / Revisión:</span>
              <select
                value={selectedPlanPart}
                onChange={(e) => setSelectedPlanPart(e.target.value)}
                className="rounded-xl border border-theme-subtle bg-theme-surface px-3 py-1.5 font-bold text-theme-main"
              >
                <option value="526412 | G |">526412 | G | · Panasonic Industrial (Flexo)</option>
                <option value="NA472050">NA472050 · BLACK & DECKER Manual 64p (Offset)</option>
                <option value="A163833BHA">A163833BHA · Pentair (Offset & Corte)</option>
                <option value="Todas">Ver Todos los Artículos</option>
              </select>
            </div>
            <span className="text-theme-muted text-xs">
              Explica <b>por qué</b> surge cada auditoría y frecuencia en piso
            </span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-theme-subtle bg-theme-surface shadow-2xs">
            <table className="w-full min-w-[1000px] text-xs">
              <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                <tr>
                  <th className="p-3 text-left">Proceso & Característica</th>
                  <th className="p-3 text-left">Especificación / Tolerancia</th>
                  <th className="p-3 text-left">Método & Frecuencia Mandatoria</th>
                  <th className="p-3 text-left">Instrumento de Medición</th>
                  <th className="p-3 text-left">Plan de Reacción (Falla)</th>
                  <th className="p-3 text-left">Req. Cliente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {filteredControlPlans.map((cp) => (
                  <tr key={cp.id} className="hover:bg-theme-muted/10 transition-colors">
                    <td className="p-3">
                      <b className="text-theme-main block font-bold">{cp.characteristic}</b>
                      <small className="text-theme-muted block">{cp.process}</small>
                    </td>

                    <td className="p-3 font-mono">
                      <span className="text-theme-main block font-bold text-[11px]">{cp.specTolerance}</span>
                    </td>

                    <td className="p-3">
                      <span className="text-theme-main block font-medium">{cp.inspectionMethod}</span>
                      <span className="rounded-md bg-theme-primary/10 px-1.5 py-0.2 text-[10px] font-bold text-theme-primary block w-fit mt-0.5">
                        {cp.frequency}
                      </span>
                    </td>

                    <td className="p-3 font-mono">
                      <span className="text-theme-main block">{cp.instrument}</span>
                    </td>

                    <td className="p-3 text-rose-700 dark:text-rose-300 font-medium">
                      {cp.reactionPlan}
                    </td>

                    <td className="p-3">
                      <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-bold font-mono">
                        {cp.customerReqCode}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. REQUISITOS ESPECÍFICOS DEL CLIENTE (CSR) (Sección 16) */}
      {subTab === 'Requisitos Cliente' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
            <h3 className="font-black text-sm text-theme-main">
              Matriz de Requisitos Específicos de Clientes (CSR / Customer Specific Requirements)
            </h3>
            <p className="text-xs text-theme-muted">
              Requisitos contractuales que activan checklists, retenciones de muestra y evidencias mandatorias en las órdenes de producción.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {CUSTOMER_REQUIREMENTS.map((csr) => (
                <div
                  key={csr.id}
                  className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 space-y-2 hover:bg-theme-muted/20 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-theme-primary shrink-0" />
                      <b className="text-theme-main text-xs font-bold">{csr.client}</b>
                      <span className="font-mono text-[10px] text-theme-muted">({csr.code})</span>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                      {csr.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-theme-main font-medium">{csr.requirement}</p>

                  <div className="border-t border-theme-subtle pt-2 text-[10px] space-y-1">
                    <p className="text-theme-muted">
                      <b>Norma de Referencia:</b> {csr.standard} · <b>Dueño:</b> {csr.owner}
                    </p>
                    <p className="text-theme-muted">
                      <b>Evidencia Auditable:</b> {csr.auditEvidence}
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-theme-muted">OPs Aplicables:</span>
                      {csr.applicableOps.map((op) => (
                        <span key={op} className="rounded-md bg-theme-surface px-1.5 py-0.2 font-mono font-bold text-theme-primary border border-theme-subtle">
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. AUDIT TRAIL MAESTRO & ROLES (Sección 18 y 19) */}
      {subTab === 'Audit Trail & Roles' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-theme-subtle pb-3">
              <div>
                <h3 className="font-black text-sm text-theme-main">
                  Audit Trail Maestro & Control de Cambios Inmutable
                </h3>
                <p className="text-xs text-theme-muted">
                  Registro detallado de cambios antes / después, usuario ejecutor, rol, motivo técnico y aprobador.
                </p>
              </div>
              <span className="text-[10px] font-mono text-theme-muted">Auditoría SGC 21 CFR Part 11 / ISO</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-xs">
                <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                  <tr>
                    <th className="p-3 text-left">Registro & Módulo</th>
                    <th className="p-3 text-left">Campo Modificado</th>
                    <th className="p-3 text-left">Valor Anterior</th>
                    <th className="p-3 text-left">Valor Nuevo</th>
                    <th className="p-3 text-left">Usuario & Rol</th>
                    <th className="p-3 text-left">Motivo & Aprobador</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {MASTER_AUDIT_TRAIL.map((at) => (
                    <tr key={at.id} className="hover:bg-theme-muted/10 transition-colors">
                      <td className="p-3">
                        <b className="text-theme-main block font-bold">{at.record}</b>
                        <small className="text-theme-muted block font-mono">{at.module} · {at.id}</small>
                      </td>

                      <td className="p-3 font-medium text-theme-main">
                        {at.field}
                      </td>

                      <td className="p-3 font-mono text-theme-muted">
                        <span className="line-through">{at.previousValue}</span>
                      </td>

                      <td className="p-3 font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                        {at.newValue}
                      </td>

                      <td className="p-3">
                        <b className="text-theme-main block">{at.user}</b>
                        <span className="rounded-md bg-theme-muted/20 px-1.5 py-0.2 text-[9px] font-bold text-theme-muted">
                          {at.role}
                        </span>
                        <small className="text-theme-muted block mt-0.5">{at.timestamp}</small>
                      </td>

                      <td className="p-3 max-w-xs">
                        <p className="text-[11px] text-theme-main italic">{at.motive}</p>
                        <small className="text-theme-muted block mt-0.5">
                          Aprobó: <b className="text-theme-main">{at.approver}</b> ({at.version})
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. INTEGRIDAD, DOCUMENTOS & CONSULTAS TRANSVERSALES (Sección 20, 21, 22) */}
      {subTab === 'Integridad & Docs' && (
        <div className="space-y-5">
          {/* Card de Integridad & Respaldo */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-theme-subtle pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-theme-primary" />
                <div>
                  <h3 className="font-black text-sm text-theme-main">
                    Integridad del Sistema y Respaldo Automático
                  </h3>
                  <p className="text-xs text-theme-muted">
                    Verificación de no repudio, hash SHA-256 de base de datos y simulaciones de recuperación ante desastres.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 font-bold text-[10px]">
                Estado: 100% Íntegro
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {BACKUP_LOGS.map((log) => (
                <div key={log.id} className="rounded-2xl border border-theme-subtle bg-theme-muted/10 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <b className="text-theme-main font-bold text-xs">{log.type}</b>
                    <span className="font-mono text-[10px] text-theme-muted">{log.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-theme-muted">{log.scope}</p>
                  <p className="text-[10px] font-mono text-emerald-600 font-bold">{log.hash}</p>
                  <small className="text-theme-muted block">Resp: {log.auditor}</small>
                </div>
              ))}
            </div>
          </div>

          {/* Control Documental */}
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-3">
            <h3 className="font-black text-sm text-theme-main">
              Control Documental Vigente (Formatos, WIs y Planos)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-xs">
                <thead className="bg-theme-muted/30 text-[10px] uppercase font-bold text-theme-muted border-b border-theme-subtle">
                  <tr>
                    <th className="p-2.5 text-left">Código & Tipo</th>
                    <th className="p-2.5 text-left">Título del Documento</th>
                    <th className="p-2.5 text-left">Revisión Vigente</th>
                    <th className="p-2.5 text-left">Fecha Efectiva</th>
                    <th className="p-2.5 text-left">Propietario / Área</th>
                    <th className="p-2.5 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-subtle">
                  {CONTROLLED_DOCUMENTS.map((doc) => (
                    <tr key={doc.code} className="hover:bg-theme-muted/10 transition-colors">
                      <td className="p-2.5 font-mono">
                        <b className="text-theme-main block">{doc.code}</b>
                        <small className="text-theme-muted">{doc.type}</small>
                      </td>
                      <td className="p-2.5 font-bold text-theme-main">{doc.title}</td>
                      <td className="p-2.5 font-mono">{doc.revision}</td>
                      <td className="p-2.5 font-mono text-theme-muted">{doc.effectiveDate}</td>
                      <td className="p-2.5 text-theme-muted">
                        {doc.owner} ({doc.applicableArea})
                      </td>
                      <td className="p-2.5">
                        <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.2 text-[9px] font-bold">
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consultas Transversales (RH, Proveedores, Mantenimiento) */}
          <div className="grid gap-5 xl:grid-cols-3">
            {/* RH Competencias */}
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
              <b className="text-theme-main text-xs font-bold flex items-center gap-1.5 border-b border-theme-subtle pb-2">
                <Users className="h-4 w-4 text-theme-primary" />
                Consulta RH: Competencias de Operador
              </b>
              <div className="space-y-2 text-[11px]">
                {CROSS_CONSULTATIONS.rh.map((r, idx) => (
                  <div key={idx} className="rounded-xl border border-theme-subtle p-2.5 bg-theme-muted/10">
                    <b className="text-theme-main block">{r.employee} · {r.role}</b>
                    <p className="text-theme-muted text-[10px] mt-0.5">
                      Habilidades: {r.certifiedIn.join(', ')}
                    </p>
                    <span className="text-[9px] font-mono text-emerald-600 block mt-0.5">
                      Certificación vigente hasta: {r.certificationDue}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proveedores Scorecards */}
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
              <b className="text-theme-main text-xs font-bold flex items-center gap-1.5 border-b border-theme-subtle pb-2">
                <Award className="h-4 w-4 text-blue-500" />
                Consulta Compras: Scorecard Proveedores
              </b>
              <div className="space-y-2 text-[11px]">
                {CROSS_CONSULTATIONS.suppliers.map((s, idx) => (
                  <div key={idx} className="rounded-xl border border-theme-subtle p-2.5 bg-theme-muted/10">
                    <div className="flex items-center justify-between">
                      <b className="text-theme-main">{s.supplier}</b>
                      <span className="font-mono text-emerald-600 font-bold">{s.qualityScore} pts</span>
                    </div>
                    <p className="text-theme-muted text-[10px]">{s.category}</p>
                    <small className="text-[10px] text-theme-muted block mt-0.5">
                      Entrega a tiempo: {s.onTimeDelivery}% · {s.status}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            {/* Mantenimiento Prensas */}
            <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-4 space-y-2">
              <b className="text-theme-main text-xs font-bold flex items-center gap-1.5 border-b border-theme-subtle pb-2">
                <Wrench className="h-4 w-4 text-amber-500" />
                Consulta Mantenimiento: Estado Prensas
              </b>
              <div className="space-y-2 text-[11px]">
                {CROSS_CONSULTATIONS.maintenance.map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-theme-subtle p-2.5 bg-theme-muted/10">
                    <div className="flex items-center justify-between">
                      <b className="text-theme-main">{m.machine}</b>
                      <span className="font-mono text-theme-primary font-bold">OEE: {m.oee}</span>
                    </div>
                    <p className="text-theme-muted text-[10px]">{m.type} · {m.status}</p>
                    <small className="text-[10px] text-theme-muted block mt-0.5">
                      Próximo preventivo: {m.nextDue}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
