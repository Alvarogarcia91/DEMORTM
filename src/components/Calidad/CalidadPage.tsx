import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Download,
  FileSearch,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import {
  NON_CONFORMANCES,
  NonConformance,
  OPERATION_CHECKLISTS,
  PERIODIC_CONTROLS,
  PREPRESS_CHECKS,
  PeriodicControl,
  QUALITY_AUDITS,
  QUALITY_RELEASES,
  QualityAuditItem,
  QualityRelease,
  QualityStatus,
  ZebraLabelConfig,
} from '../../data/mockCalidadData';
import { PRODUCTION_ORDERS, ProductionOrder } from '../../data/mockProduccionData';
import { CalidadDashboard } from './CalidadDashboard';
import { CapturasWorkspace } from './CapturasWorkspace';
import { CapturaMedicionModal } from './CapturaMedicionModal';
import { AuditoriasWorkspace } from './AuditoriasWorkspace';
import { NuevaAuditoriaWizardModal } from './NuevaAuditoriaWizardModal';
import { LiberacionesWorkspace } from './LiberacionesWorkspace';
import { NoConformesWorkspace } from './NoConformesWorkspace';
import { ZebraLabelPreviewModal } from './ZebraLabelPreviewModal';

type CalidadTab =
  | 'Dashboard'
  | 'Captura'
  | 'Auditorías'
  | 'Liberaciones'
  | 'Trazabilidad'
  | 'No conformes'
  | 'Gestión SGC';

interface CalidadPageProps {
  productionOrders?: ProductionOrder[];
  onUpdateProductionOrder?: (id: string, patch: Partial<ProductionOrder>) => void;
  onNavigateToProduccion?: (opFolio?: string) => void;
}

export const CalidadPage: React.FC<CalidadPageProps> = ({
  productionOrders: externalOrders,
  onUpdateProductionOrder,
  onNavigateToProduccion,
}) => {
  const [tab, setTab] = useState<CalidadTab>('Dashboard');

  // Estado local o compartido de Producción
  const [localOrders, setLocalOrders] = useState<ProductionOrder[]>(PRODUCTION_ORDERS);
  const orders = externalOrders || localOrders;

  const updateOrder = (id: string, patch: Partial<ProductionOrder>) => {
    if (onUpdateProductionOrder) {
      onUpdateProductionOrder(id, patch);
    } else {
      setLocalOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...patch } : o))
      );
    }
  };

  // Estados de Calidad
  const [audits, setAudits] = useState<QualityAuditItem[]>(QUALITY_AUDITS);
  const [controls, setControls] = useState<PeriodicControl[]>(PERIODIC_CONTROLS);
  const [releases, setReleases] = useState<QualityRelease[]>(QUALITY_RELEASES);
  const [nonConformances, setNonConformances] = useState<NonConformance[]>(NON_CONFORMANCES);
  const [toast, setToast] = useState('');

  // Modales
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialType, setWizardInitialType] = useState<QualityAuditItem['type'] | undefined>(undefined);
  const [wizardInitialOp, setWizardInitialOp] = useState<string | undefined>(undefined);

  const [activeControlForCapture, setActiveControlForCapture] = useState<PeriodicControl | null>(null);

  const [activeLabelConfig, setActiveLabelConfig] = useState<Partial<ZebraLabelConfig> | null>(null);

  // Handlers operativos
  const handleOpenWizard = (type?: QualityAuditItem['type'], opFolio?: string) => {
    setWizardInitialType(type);
    setWizardInitialOp(opFolio);
    setIsWizardOpen(true);
  };

  const handleSaveMeasurement = (
    controlId: string,
    value: number,
    observation: string,
    generateAlert: boolean
  ) => {
    setControls((prev) =>
      prev.map((c) => {
        if (c.id !== controlId) return c;
        const isOutOfRange = value < c.minVal || value > c.maxVal;
        const newReading = {
          id: `h-${Date.now()}`,
          value,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          auditor: 'Alicia Ramírez',
          status: isOutOfRange ? ('Fuera de rango' as const) : ('Conforme' as const),
          observation: observation || (isOutOfRange ? 'Desviación registrada por inspector' : 'Medición rutinaria conforme'),
        };
        return {
          ...c,
          lastValue: value,
          lastCapturedAt: `Hoy · ${newReading.timestamp}`,
          status: isOutOfRange ? 'Fuera de rango' : 'Al corriente',
          history: [newReading, ...c.history],
        };
      })
    );

    setActiveControlForCapture(null);
    setToast(
      generateAlert
        ? `⚠️ Medición (${value}) registrada FUERA DE RANGO. Alerta preventiva generada en SGC y mantenimiento.`
        : `✓ Medición (${value}) guardada exitosamente. Control al corriente.`
    );
  };

  const handleCompleteAudit = (
    audit: QualityAuditItem,
    effect: 'approve' | 'reject' | 'draft'
  ) => {
    // 1. Guardar auditoría en listado de Calidad
    setAudits((prev) => [audit, ...prev.filter((a) => a.id !== audit.id)]);

    // Actualizar también releases
    setReleases((prev) => [
      {
        id: audit.id.replace('aud-', 'QA-260907-08'),
        event: audit.type,
        op: audit.origin,
        pedido: 'PED-RTM-2026-86153',
        cliente: audit.client,
        part: audit.part,
        revision: audit.revision,
        area: audit.area,
        line: audit.line,
        operator: audit.operator,
        shift: 'A',
        status: audit.status,
        waiting: 'Cerrado',
        auditor: audit.auditor,
        lot: `PT-${audit.folio}`,
        priority: 'Media',
      },
      ...prev.filter((r) => r.op !== audit.origin || r.event !== audit.type),
    ]);

    setIsWizardOpen(false);

    // 2. EFECTO REAL SOBRE PRODUCCIÓN / INVENTARIO / HOLD (Sección 12)
    const matchedOrder = orders.find((o) => o.folio === audit.origin);

    if (effect === 'approve') {
      if (matchedOrder) {
        if (audit.type === 'Primera pieza') {
          updateOrder(matchedOrder.id, {
            status: 'En proceso',
            qualityGates: {
              ...(matchedOrder.qualityGates || { prepressReleased: true, finalAuditApproved: false }),
              firstPieceReleased: true,
              firstPieceRequested: false,
              firstPieceApprover: 'Alicia Ramírez (Calidad)',
            },
            progress: Math.max(matchedOrder.progress, 15),
            traceability: [
              {
                id: `tr-qp-rel-${Date.now()}`,
                timestamp: '07 Sep · 11:45',
                user: 'Alicia Ramírez (Calidad)',
                station: matchedOrder.machine,
                event: 'Primera Pieza Liberada por Calidad',
                notes: 'Aprobación dimensional, registro y tono conforme a máster aprobado. Autorizado arranque de corrida.',
                badgeTone: 'success',
              },
              ...(matchedOrder.traceability || []),
            ],
          });
        } else if (audit.type === 'Auditoría final') {
          updateOrder(matchedOrder.id, {
            status: 'Liberada',
            progress: 100,
            good: matchedOrder.quantity,
            qualityGates: {
              ...(matchedOrder.qualityGates || { prepressReleased: true, firstPieceReleased: true }),
              finalAuditApproved: true,
            },
            traceability: [
              {
                id: `tr-fin-rel-${Date.now()}`,
                timestamp: '07 Sep · 12:10',
                user: 'Alicia Ramírez (Calidad)',
                station: 'Mesa de Calidad Final',
                event: 'Lote PT Liberado por Calidad Final',
                notes: 'Inspección de baches AQL 0.65 conforme. Traspaso formal a Almacén de Producto Terminado.',
                badgeTone: 'success',
              },
              ...(matchedOrder.traceability || []),
            ],
          });
        } else {
          // Evento en proceso
          updateOrder(matchedOrder.id, {
            traceability: [
              {
                id: `tr-proc-${Date.now()}`,
                timestamp: '07 Sep · 12:00',
                user: 'Alicia Ramírez (Calidad)',
                station: matchedOrder.machine,
                event: `Auditoría Conforme: ${audit.type}`,
                notes: 'Verificación de parámetros operativos conforme a estándar.',
                badgeTone: 'primary',
              },
              ...(matchedOrder.traceability || []),
            ],
          });
        }
      }

      setToast(
        `✓ ${audit.folio} Aprobada (${audit.type} · ${audit.origin}). Efecto reflejado inmediatamente en Producción.`
      );

      // Ofrecer preview de etiqueta Zebra
      setActiveLabelConfig({
        type: audit.type === 'Primera pieza' ? 'Primera Pieza Aprobada' : 'Identificación de Caja',
        opFolio: audit.origin,
        client: audit.client,
        partNumber: audit.part,
        revision: audit.revision,
        lotNumber: `PT-${audit.folio}`,
        quantity: matchedOrder?.quantity || 1000,
      });
    } else if (effect === 'reject') {
      if (matchedOrder) {
        updateOrder(matchedOrder.id, {
          status: 'Detenida',
          stopMinutes: (matchedOrder.stopMinutes || 0) + 45,
          traceability: [
            {
              id: `tr-rej-${Date.now()}`,
              timestamp: '07 Sep · 11:45',
              user: 'Alicia Ramírez (Calidad)',
              station: matchedOrder.machine,
              event: 'Auditoría Rechazada por Calidad - EN HOLD',
              notes: `Desviación no conforme (${audit.defectCount} defectos). Orden detenida en piso. Folio MNC generado.`,
              badgeTone: 'danger',
            },
            ...(matchedOrder.traceability || []),
          ],
        });
      }

      const newMnc: NonConformance = {
        id: `MNC-${Math.floor(100000 + Math.random() * 900000)}`,
        op: audit.origin,
        client: audit.client,
        area: audit.area,
        location: 'Cuarentena / Almacén No Conforme',
        defect: `Hallazgo en ${audit.type}: desviación técnica de especificación`,
        quantity: audit.defectCount || 100,
        status: 'Hold',
        severity: 'Crítico',
        disposition: 'En contención. Esperando reunión técnica de disposición con Alicia Ramírez.',
        date: '07 Sep · 11:45',
        auditor: 'Alicia Ramírez',
      };

      setNonConformances((prev) => [newMnc, ...prev]);

      setToast(
        `⚠️ ${audit.folio} Rechazada. ${audit.origin} ha sido BLOQUEADA (HOLD) en Piso de Planta y se generó el folio ${newMnc.id}.`
      );
    } else {
      setToast(`Borrador de auditoría ${audit.folio} guardado.`);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Superior con CTAs Protagonistas */}
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-black tracking-widest text-theme-primary">CALIDAD · RTM</p>
          <h1 className="text-2xl font-black text-theme-main">
            Control de Calidad, Capturas y Auditorías
          </h1>
          <p className="text-xs text-theme-muted">
            Herramienta operativa para el auditor: capturas de cuarto controlado, gates de primera pieza, muestreo AQL y liberaciones.
          </p>
        </div>

        {/* Botones de Acción Inmediata */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveControlForCapture(controls[0])}
            className="flex items-center gap-1.5 rounded-xl border border-theme-subtle bg-theme-surface px-3.5 py-2 text-xs font-bold text-theme-main shadow-2xs hover:bg-theme-muted/30"
          >
            <Activity className="h-4 w-4 text-theme-primary" />
            Capturar Medición
          </button>

          <button
            type="button"
            onClick={() => handleOpenWizard()}
            className="flex items-center gap-1.5 rounded-xl bg-theme-primary px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-theme-primary/90 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Nueva Auditoría
          </button>
        </div>
      </header>

      {/* Tabs de Navegación Refinada (Sección 2) */}
      <div className="flex gap-1 overflow-x-auto border-b border-theme-subtle">
        {(
          [
            'Dashboard',
            'Captura',
            'Auditorías',
            'Liberaciones',
            'Trazabilidad',
            'No conformes',
            'Gestión SGC',
          ] as CalidadTab[]
        ).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`shrink-0 border-b-2 px-4 py-3 text-xs font-bold transition-colors ${
              tab === item
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-muted hover:text-theme-main'
            }`}
          >
            {item}
            {item === 'Captura' && (
              <span className="ml-1.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 px-1.5 py-0.2 text-[9px] font-black">
                1
              </span>
            )}
            {item === 'Auditorías' && (
              <span className="ml-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 px-1.5 py-0.2 text-[9px] font-black">
                {audits.filter((a) => a.status === 'Pendiente').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notificación Toast Banner */}
      {toast && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-400 bg-theme-surface p-3 text-xs shadow-xs animate-in fade-in">
          <span className="text-theme-main font-bold">{toast}</span>
          <button
            type="button"
            onClick={() => setToast('')}
            className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Contenido según pestaña activa */}
      {tab === 'Dashboard' && (
        <CalidadDashboard
          audits={audits}
          controls={controls}
          nonConformances={nonConformances}
          onOpenAudit={(audit) => {
            handleOpenWizard(audit.type, audit.origin);
          }}
          onOpenControl={(ctrl) => setActiveControlForCapture(ctrl)}
          onStartNewAudit={(type) => handleOpenWizard(type)}
        />
      )}

      {tab === 'Captura' && (
        <CapturasWorkspace
          controls={controls}
          onOpenControl={(ctrl) => setActiveControlForCapture(ctrl)}
        />
      )}

      {tab === 'Auditorías' && (
        <AuditoriasWorkspace
          audits={audits}
          onOpenAudit={(audit) => handleOpenWizard(audit.type, audit.origin)}
          onStartNewAudit={() => handleOpenWizard()}
          onOpenLabelPreview={(op, cli, part, lot) =>
            setActiveLabelConfig({ opFolio: op, client: cli, partNumber: part, lotNumber: lot })
          }
        />
      )}

      {tab === 'Liberaciones' && (
        <LiberacionesWorkspace
          releases={releases}
          onOpenRelease={(rel) => handleOpenWizard(rel.event as any, rel.op)}
          onOpenLabelPreview={(op, cli, part, lot) =>
            setActiveLabelConfig({ opFolio: op, client: cli, partNumber: part, lotNumber: lot })
          }
        />
      )}

      {tab === 'Trazabilidad' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-5 space-y-4">
            <div className="flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-theme-primary" />
              <div>
                <h3 className="font-black text-sm text-theme-main">
                  Expediente de Trazabilidad Digital 360°
                </h3>
                <p className="text-xs text-theme-muted">
                  Inspecciona el historial de preimpresión, primera pieza, insumos, baches y auditoría final ligados a la OP.
                </p>
              </div>
            </div>

            <div className="divide-y divide-theme-subtle rounded-2xl border border-theme-subtle bg-theme-muted/10 p-4 text-xs space-y-3">
              {[
                { title: 'OP-2026-95250 · Panasonic 526412 | G |', detail: 'Preimpresión conforme · Primera pieza con BOB-REM-042 conforme · Control >2h programado' },
                { title: 'OP-2026-95249 · BLACK & DECKER NA472050', detail: 'Auditoría final rechazada · 145 folletos en HOLD (MNC-000348) por revisión desactualizada' },
                { title: 'OP-2026-95256 · Pentair A163833BHA', detail: 'Lote 100% liberado · 500 pliegos · Etiquetas Zebra FM-QA-153 emitidas' },
              ].map((item, idx) => (
                <div key={idx} className="pt-2">
                  <b className="text-theme-main font-mono text-xs">{item.title}</b>
                  <p className="text-theme-muted text-[11px] mt-0.5">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'No conformes' && (
        <NoConformesWorkspace
          nonConformances={nonConformances}
          onOpenLabelPreview={(op, cli, part, lot) =>
            setActiveLabelConfig({
              type: 'Material en HOLD',
              opFolio: op,
              client: cli,
              partNumber: part,
              lotNumber: lot,
            })
          }
          onToast={setToast}
        />
      )}

      {tab === 'Gestión SGC' && (
        <div className="rounded-3xl border border-theme-subtle bg-theme-surface p-6 space-y-4 text-xs">
          <div className="border-b border-theme-subtle pb-3">
            <h3 className="text-base font-black text-theme-main uppercase tracking-wider">
              Sistema de Gestión de Calidad (SGC / ISO 9001 / IATF)
            </h3>
            <p className="text-theme-muted">
              Módulos de apoyo: control de cambios, acciones correctivas (ICAR), metrología y alertas operativas.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Acciones Correctivas (ICAR)', desc: '4 acciones en contención y análisis de 5 Porqués con Alicia Ramírez.', badge: '4 abiertas' },
              { title: 'Metrología & Calibración', desc: 'Higrómetro QA-HG-004 y Copa Zahn #2 con calibración vigente.', badge: 'Al corriente' },
              { title: 'Alertas de Calidad en Piso', desc: '2 alertas activas para verificación de revisión de arte en B&D.', badge: '2 activas' },
              { title: 'Requisitos Específicos Cliente', desc: 'Panasonic exige trazabilidad de bobinas y retención de muestra testigo.', badge: 'Actualizado' },
              { title: 'Control de Cambios (ECN)', desc: 'Actualización de herramental suaje troquel para línea Flexo 10”.', badge: 'En revisión' },
              { title: 'Auditorías Internas', desc: 'Auditoría interna programada para Proceso de Impresión Offset.', badge: 'Próxima semana' },
            ].map((card, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-theme-subtle bg-theme-surface p-4 shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <b className="text-theme-main font-bold">{card.title}</b>
                  <span className="rounded-full bg-theme-muted/20 px-2 py-0.2 text-[10px] font-bold text-theme-muted">
                    {card.badge}
                  </span>
                </div>
                <p className="text-[11px] text-theme-muted leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Wizard de Nueva Auditoría */}
      {isWizardOpen && (
        <NuevaAuditoriaWizardModal
          onClose={() => setIsWizardOpen(false)}
          productionOrders={orders}
          initialAuditType={wizardInitialType}
          initialOpFolio={wizardInitialOp}
          onCompleteAudit={handleCompleteAudit}
          onOpenLabelPreview={(op, cli, part, lot) =>
            setActiveLabelConfig({ opFolio: op, client: cli, partNumber: part, lotNumber: lot })
          }
        />
      )}

      {/* Modal Captura de Medición Periódica */}
      {activeControlForCapture && (
        <CapturaMedicionModal
          control={activeControlForCapture}
          onClose={() => setActiveControlForCapture(null)}
          onSave={handleSaveMeasurement}
        />
      )}

      {/* Modal Preview de Etiquetas Térmicas Zebra */}
      {activeLabelConfig && (
        <ZebraLabelPreviewModal
          initialConfig={activeLabelConfig}
          onClose={() => setActiveLabelConfig(null)}
          onPrint={(cfg) => {
            setToast(`✓ Etiqueta ${cfg.standardCode} enviada a Zebra QA-02 para ${cfg.opFolio}.`);
          }}
        />
      )}
    </div>
  );
};
