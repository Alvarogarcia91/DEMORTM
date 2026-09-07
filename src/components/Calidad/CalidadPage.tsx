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
  QUALITY_DEVIATIONS,
  QUALITY_RELEASES,
  ICAR_ACTIONS,
  IcarAction,
  QualityAuditItem,
  QualityDeviation,
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
import { GestionSGCWorkspace } from './GestionSGCWorkspace';
import { AnalizarDesviacionModal } from './AnalizarDesviacionModal';
import { PisoQaWorkspace } from './PisoQaWorkspace';

type CalidadTab =
  | 'Dashboard'
  | 'Piso QA'
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
  const [deviations, setDeviations] = useState<QualityDeviation[]>(QUALITY_DEVIATIONS);
  const [icars, setIcars] = useState<IcarAction[]>(ICAR_ACTIONS);
  const [toast, setToast] = useState('');

  // Modales y roles
  const [activeRole, setActiveRole] = useState<string>('Aseguramiento de Calidad (Alicia Ramírez)');
  const [selectedDeviationForAnalysis, setSelectedDeviationForAnalysis] = useState<QualityDeviation | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardInitialType, setWizardInitialType] = useState<QualityAuditItem['type'] | undefined>(undefined);
  const [wizardInitialOp, setWizardInitialOp] = useState<string | undefined>(undefined);

  const [activeControlForCapture, setActiveControlForCapture] = useState<PeriodicControl | null>(null);

  const [activeLabelConfig, setActiveLabelConfig] = useState<Partial<ZebraLabelConfig> | null>(null);

  // Handlers de Desviaciones & ICAR (P1)
  const handleOpenIcarFromDeviation = (deviation: QualityDeviation, icarData: Partial<IcarAction>) => {
    const newIcar: IcarAction = {
      id: `ICAR-2026-0${Math.floor(20 + Math.random() * 80)}`,
      title: icarData.title || `Acción Correctiva para ${deviation.opFolio}`,
      source: icarData.source || deviation.id,
      area: icarData.area || 'Flexografía',
      category4M: icarData.category4M || deviation.category4M,
      responsible: icarData.responsible || 'Alicia Ramírez / Supervisor',
      rootCause: icarData.rootCause || 'Análisis de causa raíz completado.',
      correctiveAction: icarData.correctiveAction || 'Acción preventiva aplicada.',
      openedDate: 'Hoy · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verificationDue: '25 Sep 2026',
      status: 'Abierta',
      evidence: 'Registro digital vinculado en el expediente SGC.',
    };

    setIcars((prev) => [newIcar, ...prev]);
    setDeviations((prev) =>
      prev.map((d) => (d.id === deviation.id ? { ...d, status: 'ICAR Abierto', icarId: newIcar.id } : d))
    );
    setSelectedDeviationForAnalysis(null);
    setToast(`✓ Acción Correctiva ${newIcar.id} abierta para ${deviation.opFolio} (4M: ${newIcar.category4M}). Registrada en SGC.`);
  };

  const handleResolveDeviation = (deviationId: string, resolutionNote: string) => {
    setDeviations((prev) =>
      prev.map((d) => (d.id === deviationId ? { ...d, status: 'Resuelta' } : d))
    );
    setSelectedDeviationForAnalysis(null);
    setToast(`✓ Desviación ${deviationId} resuelta en piso. Contención verificada: ${resolutionNote}`);
  };

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
            onClick={() => setTab('Piso QA')}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/50 dark:bg-indigo-950/40 px-3.5 py-2 text-xs font-black text-indigo-700 dark:text-indigo-300 shadow-2xs hover:bg-indigo-100 transition-all"
          >
            <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Consola Piso QA
          </button>

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
            'Piso QA',
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
            {item === 'Piso QA' && (
              <span className="ml-1.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 px-1.5 py-0.2 text-[9px] font-black">
                {orders.filter((o) => (o.status === 'En preparación' || o.status === 'Pendiente de calidad') && !o.qualityGates?.firstPieceReleased).length + controls.filter((c) => c.status === 'Vencida').length}
              </span>
            )}
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
          deviations={deviations}
          onOpenAudit={(audit) => {
            handleOpenWizard(audit.type, audit.origin);
          }}
          onOpenControl={(ctrl) => setActiveControlForCapture(ctrl)}
          onStartNewAudit={(type) => handleOpenWizard(type)}
          onOpenDeviation={(dev) => setSelectedDeviationForAnalysis(dev)}
          onNavigateTab={(targetTab) => setTab(targetTab as any)}
        />
      )}

      {tab === 'Piso QA' && (
        <PisoQaWorkspace
          orders={orders}
          audits={audits}
          controls={controls}
          onUpdateProductionOrder={updateOrder}
          onCompleteAudit={handleCompleteAudit}
          onOpenControl={(ctrl) => setActiveControlForCapture(ctrl)}
          onOpenLabelPreview={(op, cli, part, lot) =>
            setActiveLabelConfig({ opFolio: op, client: cli, partNumber: part, lotNumber: lot })
          }
          onNavigateTab={(targetTab) => setTab(targetTab as any)}
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
          onToast={setToast}
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
        <GestionSGCWorkspace
          deviations={deviations}
          icars={icars}
          onOpenDeviationAnalysis={(dev) => setSelectedDeviationForAnalysis(dev)}
          onToast={setToast}
          activeRole={activeRole}
          onChangeRole={setActiveRole}
        />
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
          onOpenDeviation={(ctrl, val, obs) => {
            const newDev: QualityDeviation = {
              id: `DEV-ENV-${Date.now().toString().slice(-4)}`,
              opFolio: 'OP-2026-95250',
              client: 'Panasonic Industrial',
              partNumber: '526412 | G |',
              machine: ctrl.location,
              type: 'Parámetro ambiental fuera de rango',
              expected: `${ctrl.minVal} – ${ctrl.maxVal} ${ctrl.unit}`,
              actual: `${val} ${ctrl.unit}`,
              stoppedMinutes: 25,
              severity: 'Media',
              category4M: 'Máquina',
              operatorComment: obs || `Medición fuera de rango: ${val} ${ctrl.unit}.`,
              suggestedResponsible: 'Mantenimiento / Calidad',
              containmentAction: 'Revisión técnica inmediata del área climatizada y verificación de termohigrómetro.',
              status: 'Activa',
              detectedAt: '07 Sep · 12:05',
            };
            setDeviations((prev) => [newDev, ...prev]);
            setActiveControlForCapture(null);
            setSelectedDeviationForAnalysis(newDev);
            setToast(`⚠️ Desviación generada para ${ctrl.name}. Abriendo análisis 4M e Ishikawa.`);
          }}
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

      {/* Modal Análisis de Desviaciones 4M & Causa Raíz */}
      {selectedDeviationForAnalysis && (
        <AnalizarDesviacionModal
          deviation={selectedDeviationForAnalysis}
          onClose={() => setSelectedDeviationForAnalysis(null)}
          onOpenIcar={handleOpenIcarFromDeviation}
          onResolveDeviation={handleResolveDeviation}
        />
      )}
    </div>
  );
};
