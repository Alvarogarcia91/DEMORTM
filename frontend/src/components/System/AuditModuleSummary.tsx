import React from 'react';
import {
  Boxes,
  Building2,
  CreditCard,
  Factory,
  FileText,
  Layers,
  Monitor,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  UserCheck,
  Wrench,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { AuditModuleKey, GlobalAuditEvent } from '../../data/mockAuditTrailData';

interface AuditModuleSummaryProps {
  events: GlobalAuditEvent[];
  onSelectModuleFilter: (module: AuditModuleKey) => void;
  onOpenEventDetail: (event: GlobalAuditEvent) => void;
}

interface ModuleMeta {
  key: AuditModuleKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const MODULE_METAS: ModuleMeta[] = [
  {
    key: 'Producción',
    label: 'Producción & Planta',
    description: 'Órdenes de producción, reprogramaciones, setups y cierres de bache.',
    icon: Factory,
    color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200',
  },
  {
    key: 'Calidad',
    label: 'Calidad & SGC',
    description: 'Liberaciones de primera pieza, auditorías finales, retenciones en HOLD y PPAP.',
    icon: ShieldCheck,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
  },
  {
    key: 'Nómina',
    label: 'Nómina & Asistencia',
    description: 'Aperturas y cierres de ciclo, autorización de incidencias y timbrado de dispersión.',
    icon: UserCheck,
    color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200',
  },
  {
    key: 'Compras',
    label: 'Compras & Abastecimiento',
    description: 'Requisiciones precargadas desde MRP, órdenes de compra y autorizaciones.',
    icon: ShoppingCart,
    color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200',
  },
  {
    key: 'Inventario',
    label: 'Inventario & Almacén',
    description: 'Surtido FIFO de sustratos, movimientos de bobinas y control de remanentes.',
    icon: Boxes,
    color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200',
  },
  {
    key: 'Comercial',
    label: 'Comercial & CRM',
    description: 'Oportunidades ganadas, pedidos autorizados y acuerdos con clientes clave.',
    icon: ShoppingBag,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200',
  },
  {
    key: 'Finanzas',
    label: 'Finanzas & Facturación',
    description: 'Timbrado CFDI 4.0, conciliación de cobranza y cuentas por cobrar.',
    icon: Receipt,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200',
  },
  {
    key: 'Mantenimiento',
    label: 'Mantenimiento de Planta',
    description: 'Órdenes de trabajo preventivas, paros por refacciones y calibración de prensas.',
    icon: Wrench,
    color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200',
  },
];

export const AuditModuleSummary: React.FC<AuditModuleSummaryProps> = ({
  events,
  onSelectModuleFilter,
  onOpenEventDetail,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in">
      {MODULE_METAS.map((m) => {
        const moduleEvents = events.filter((e) => e.module === m.key);
        const latestEvent = moduleEvents[0];
        const Icon = m.icon;

        return (
          <div
            key={m.key}
            className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header de la tarjeta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">
                      {m.label}
                    </h3>
                    <span className="text-[10px] text-zinc-400">{moduleEvents.length} movimientos</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {m.description}
              </p>

              {/* Último movimiento registrado */}
              {latestEvent ? (
                <div
                  onClick={() => onOpenEventDetail(latestEvent)}
                  className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>{latestEvent.occurredAt}</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{latestEvent.reference}</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                    {latestEvent.action}
                  </p>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">por {latestEvent.user}</p>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">Sin movimientos recientes registrados.</p>
              )}
            </div>

            {/* CTA */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => onSelectModuleFilter(m.key)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Ver historial de {m.key}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
