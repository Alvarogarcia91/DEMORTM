import React, { useState } from 'react';
import {
  X,
  Building2,
  Calendar,
  Clock,
  CircleDollarSign,
  FileText,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Tag,
  Layers,
  AlertTriangle,
  History,
} from 'lucide-react';
import { ModalPortal } from '../../common/ModalPortal';
import { SalesCustomer } from '../../../data/mockSalesData';
import { CrmOpportunity, CrmStage, formatMxn, getOpportunityHealth, getHealthLabel } from '../../../data/mockCrmData';

interface OpportunityDetailModalProps {
  opportunity: CrmOpportunity;
  customers: SalesCustomer[];
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<CrmOpportunity>) => void;
  onNavigate: (tab: 'cotizaciones' | 'pedidos' | 'clientes', customerId?: string) => void;
  onStartQuote: (customerId: string, opportunity: { id: string; folio: string }) => void;
  onOpenQuote: (folio: string) => void;
  onRegisterActivity?: (account: string, oppFolio: string) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  customers,
  onClose,
  onUpdate,
  onNavigate,
  onStartQuote,
  onOpenQuote,
  onRegisterActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'Resumen' | 'Actividad' | 'Cotización' | 'Pedido' | 'Historial'>('Resumen');
  const [isLostModalOpen, setIsLostModalOpen] = useState(false);
  const [lostReason, setLostReason] = useState('Precio');

  const customer = customers.find(
    (c) =>
      c.id === opportunity.customerId ||
      c.name.toLowerCase().includes(opportunity.account.toLowerCase()) ||
      opportunity.account.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
  );

  const healthScore = getOpportunityHealth(opportunity);
  const healthBadge = getHealthLabel(healthScore);

  const stages: CrmStage[] = ['Calificado', 'Levantamiento', 'Cotización', 'Negociación', 'Ganada'];

  const handleMarkWon = () => {
    onUpdate(opportunity.id, {
      stage: 'Ganada',
      probability: 100,
      risk: 'Bajo',
      next: 'Pedido listo para generar / coordinar con Ventas',
    });
  };

  const handleMarkLost = () => {
    onUpdate(opportunity.id, {
      stage: 'Perdida',
      probability: 0,
      lostReason,
      next: 'Oportunidad archivada / reenganche futuro',
    });
    setIsLostModalOpen(false);
  };

  return (
    <ModalPortal onClose={onClose} closeOnBackdropClick>
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-theme-surface border border-theme-subtle shadow-2xl overflow-hidden flex flex-col animate-in fade-in duration-150">
        {/* Sticky Header */}
        <div className="p-6 border-b border-theme-subtle bg-theme-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-theme-primary">
                OPORTUNIDAD COMERCIAL &middot; {opportunity.folio}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  healthBadge === 'Buena'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                    : healthBadge === 'Atención'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                }`}
              >
                Salud: {healthScore} ({healthBadge})
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-theme-muted text-theme-main">
                {opportunity.line}
              </span>
            </div>
            <h2 className="text-xl font-black text-theme-main">{opportunity.title}</h2>
            <p className="text-xs text-theme-muted">
              {opportunity.account} &middot; Ejecutivo: <strong className="text-theme-main">{opportunity.seller}</strong> &middot; Cierre estimado: {opportunity.close}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] font-bold text-theme-muted uppercase block">Monto Pipeline</span>
              <strong className="text-xl font-mono font-black text-theme-primary">
                {formatMxn(opportunity.amount)}
              </strong>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-theme-muted hover:text-theme-main p-2 rounded-xl hover:bg-theme-muted transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level-2 Sub-tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-theme-subtle bg-theme-muted/20 text-xs font-bold overflow-x-auto">
          {(['Resumen', 'Actividad', 'Cotización', 'Pedido', 'Historial'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-theme-primary text-theme-primary'
                  : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: RESUMEN */}
          {activeTab === 'Resumen' && (
            <div className="space-y-6">
              {/* Top 4 Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Etapa Actual</span>
                  <strong className="text-sm font-bold text-theme-main block mt-1">
                    {opportunity.stage}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Probabilidad</span>
                  <strong className="text-sm font-mono font-bold text-theme-primary block mt-1">
                    {opportunity.probability}%
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Ponderado</span>
                  <strong className="text-sm font-mono font-bold text-emerald-600 block mt-1">
                    {formatMxn((opportunity.amount * opportunity.probability) / 100)}
                  </strong>
                </div>

                <div className="p-3.5 rounded-2xl bg-theme-muted/40 border border-theme-subtle">
                  <span className="text-[10px] uppercase font-bold text-theme-muted block">Días en Etapa</span>
                  <strong
                    className={`text-sm font-mono font-bold block mt-1 ${
                      opportunity.days >= 8 ? 'text-amber-600' : 'text-theme-main'
                    }`}
                  >
                    {opportunity.days} días
                  </strong>
                </div>
              </div>

              {/* 2 Columns: Requerimiento & Acciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Card: Detalle del Proyecto */}
                <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-wider text-theme-main">
                    Detalle del Requerimiento
                  </h3>

                  <div className="space-y-2 text-theme-muted">
                    <p>
                      <strong className="text-theme-main">Línea de producción: </strong>
                      {opportunity.line}
                    </p>
                    <p>
                      <strong className="text-theme-main">Siguiente acción programada: </strong>
                      {opportunity.next}
                    </p>
                    <p>
                      <strong className="text-theme-main">Nivel de riesgo comercial: </strong>
                      <span
                        className={`font-bold ${
                          opportunity.risk === 'Crítico'
                            ? 'text-rose-600'
                            : opportunity.risk === 'Alto'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {opportunity.risk}
                      </span>
                    </p>
                    {opportunity.notes && (
                      <div className="p-3 rounded-xl bg-theme-muted/30 border border-theme-subtle mt-3">
                        <span className="font-bold text-theme-main block mb-1">Notas:</span>
                        <p className="text-[11px] leading-relaxed">{opportunity.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Stage Switcher Selector */}
                  <div className="pt-2 border-t border-theme-subtle space-y-1.5">
                    <label className="font-bold text-theme-main block">Avanzar o mover etapa:</label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {stages.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() =>
                            onUpdate(opportunity.id, {
                              stage: st,
                              probability: st === 'Ganada' ? 100 : opportunity.probability,
                            })
                          }
                          className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                            opportunity.stage === st
                              ? 'bg-theme-main text-white'
                              : 'bg-theme-muted/50 hover:bg-theme-muted text-theme-muted hover:text-theme-main border border-theme-subtle'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Card: Acciones Comerciales Directas */}
                <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-black text-sm uppercase tracking-wider text-theme-main">
                      Acciones Comerciales
                    </h3>

                    <div className="grid gap-2">
                      {/* Abrir cuenta cliente */}
                      {customer ? (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate('clientes', customer.id);
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-theme-subtle hover:bg-theme-muted/40 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-theme-primary" />
                            <span>Ver Ficha de Cliente ({customer.name})</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-theme-muted" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate('clientes');
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-theme-subtle hover:bg-theme-muted/40 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-theme-muted" />
                            <span>Vincular / Abrir Catálogo Clientes</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-theme-muted" />
                        </button>
                      )}

                      {/* Cotización */}
                      {opportunity.quote ? (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenQuote(opportunity.quote!);
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-theme-primary/30 bg-theme-primary/5 hover:bg-theme-primary/10 text-theme-primary font-semibold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Abrir Cotización {opportunity.quote}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onStartQuote(opportunity.customerId || 'cli-001', {
                              id: opportunity.id,
                              folio: opportunity.folio,
                            });
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-theme-subtle hover:bg-theme-muted/40 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-theme-primary" />
                            <span>Generar Nueva Cotización</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-theme-muted" />
                        </button>
                      )}

                      {/* Registrar actividad */}
                      {onRegisterActivity && (
                        <button
                          type="button"
                          onClick={() => onRegisterActivity(opportunity.account, opportunity.folio)}
                          className="w-full text-left p-2.5 rounded-xl border border-theme-subtle hover:bg-theme-muted/40 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-theme-primary" />
                            <span>Registrar Llamada / Tarea</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-theme-muted" />
                        </button>
                      )}

                      {/* Pedido si ya existe */}
                      {opportunity.order && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigate('pedidos');
                          }}
                          className="w-full text-left p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Ver Pedido {opportunity.order}</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cierre definitivo: Ganada o Perdida */}
                  <div className="pt-3 border-t border-theme-subtle flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleMarkWon}
                      className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-center transition-colors shadow-xs cursor-pointer"
                    >
                      ✓ Marcar Ganada
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLostModalOpen(true)}
                      className="px-4 py-2 rounded-xl border border-rose-400/40 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 font-bold transition-colors cursor-pointer"
                    >
                      Marcar Perdida
                    </button>
                  </div>
                </div>
              </div>

              {/* Selector de motivo de pérdida si se activó */}
              {isLostModalOpen && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <strong className="text-rose-800 dark:text-rose-300 font-bold">
                      Registrar Causa Raíz de Pérdida (Alimenta Analítica Win/Loss)
                    </strong>
                    <button
                      type="button"
                      onClick={() => setIsLostModalOpen(false)}
                      className="text-rose-700 hover:text-rose-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={lostReason}
                      onChange={(e) => setLostReason(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-rose-300 bg-theme-surface font-semibold text-xs cursor-pointer"
                    >
                      <option value="Precio">Precio más alto que competidor</option>
                      <option value="Tiempo de entrega">Tiempo de entrega / Lead time excedido</option>
                      <option value="Competencia">Competencia con mejor especificación</option>
                      <option value="Proyecto detenido">Proyecto detenido por el cliente</option>
                      <option value="Sin presupuesto">Cliente sin presupuesto asignado</option>
                      <option value="Requisito técnico">Requisito técnico no soportado</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleMarkLost}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                    >
                      Confirmar Pérdida
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVIDAD / TIMELINE */}
          {activeTab === 'Actividad' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wider text-theme-main">
                  Historial de Interacciones con {opportunity.account}
                </h3>
                {onRegisterActivity && (
                  <button
                    type="button"
                    onClick={() => onRegisterActivity(opportunity.account, opportunity.folio)}
                    className="px-3 py-1.5 rounded-xl bg-theme-primary text-white font-bold text-xs"
                  >
                    + Registrar Actividad
                  </button>
                )}
              </div>

              <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4">
                {[
                  {
                    date: '05 Sep · 14:30',
                    type: 'Llamada telefónica',
                    desc: 'Se discutió el ajuste de especificación de papel y condiciones de entrega.',
                    by: opportunity.seller,
                  },
                  {
                    date: '02 Sep · 11:00',
                    type: 'Cotización enviada',
                    desc: `Propuesta formal generada con folio ${opportunity.quote || 'COT-2026-0098'}.`,
                    by: 'Ventas RTM',
                  },
                  {
                    date: '28 Ago · 16:00',
                    type: 'Reunión de levantamiento',
                    desc: 'Revisión en sitio de muestras y requerimientos de troquel rotativo.',
                    by: opportunity.seller,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 pt-3 border-t border-theme-subtle first:border-none first:pt-0">
                    <div className="w-8 h-8 rounded-xl bg-theme-muted/50 flex items-center justify-center text-theme-primary shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-theme-main font-semibold">{item.type}</strong>
                        <span className="font-mono text-[10px] text-theme-muted">{item.date}</span>
                      </div>
                      <p className="text-theme-muted text-[11px] leading-relaxed">{item.desc}</p>
                      <span className="text-[10px] text-theme-primary font-medium block">
                        Por: {item.by}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COTIZACIÓN */}
          {activeTab === 'Cotización' && (
            <div className="p-6 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-theme-primary/10 text-theme-primary mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-theme-main">
                  {opportunity.quote ? `Cotización ${opportunity.quote}` : 'Sin Cotización Formal Vinculada'}
                </h3>
                <p className="text-theme-muted text-xs max-w-md mx-auto">
                  {opportunity.quote
                    ? 'Esta oportunidad ya cuenta con una cotización activa en el módulo de Ventas. Puedes abrirla para editar partidas, condiciones comerciales o generar PDF.'
                    : 'Crea una cotización en Ventas Básico heredando automáticamente los datos de la cuenta y el monto estimado.'}
                </p>
              </div>

              <div className="pt-2">
                {opportunity.quote ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenQuote(opportunity.quote!);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-theme-primary text-white font-bold shadow-md hover:bg-theme-primary/90 transition-all cursor-pointer"
                  >
                    Abrir Cotización {opportunity.quote} &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onStartQuote(opportunity.customerId || 'cli-001', {
                        id: opportunity.id,
                        folio: opportunity.folio,
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-theme-primary text-white font-bold shadow-md hover:bg-theme-primary/90 transition-all cursor-pointer"
                  >
                    + Crear Cotización desde Oportunidad
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PEDIDO */}
          {activeTab === 'Pedido' && (
            <div className="p-6 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-theme-main">
                  {opportunity.order ? `Pedido Autorizado: ${opportunity.order}` : 'Sin Pedido Asociado'}
                </h3>
                <p className="text-theme-muted text-xs max-w-md mx-auto">
                  {opportunity.order
                    ? 'La orden ya fue convertida a pedido formal de venta y se encuentra en etapa de programación y producción.'
                    : 'Una vez ganada la oportunidad y aprobada la cotización, se genera la orden de venta que pasará a Producción.'}
                </p>
              </div>

              {opportunity.order && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate('pedidos');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-all cursor-pointer"
                  >
                    Ver Pedidos en Ventas &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HISTORIAL */}
          {activeTab === 'Historial' && (
            <div className="p-5 rounded-3xl bg-theme-surface border border-theme-subtle shadow-xs space-y-3">
              <h3 className="font-black text-sm uppercase tracking-wider text-theme-main">
                Auditoría y Trazabilidad de Estados
              </h3>
              <div className="space-y-2 text-theme-muted text-[11px]">
                <div className="flex justify-between p-2 rounded-xl bg-theme-muted/30">
                  <span>Creación de oportunidad ({opportunity.folio})</span>
                  <span className="font-mono text-theme-main font-bold">25 Ago 2026 &middot; 09:15</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-theme-muted/30">
                  <span>Cambio de etapa: Calificado &rarr; Levantamiento</span>
                  <span className="font-mono text-theme-main font-bold">28 Ago 2026 &middot; 14:00</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-theme-muted/30">
                  <span>Cotización vinculada (COT-2026-0098)</span>
                  <span className="font-mono text-theme-main font-bold">02 Sep 2026 &middot; 11:30</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-theme-muted/30">
                  <span>Avance a etapa actual ({opportunity.stage})</span>
                  <span className="font-mono text-theme-main font-bold">04 Sep 2026 &middot; 10:20</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalPortal>
  );
};
