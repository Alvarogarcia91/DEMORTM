export interface SummaryKpi {
  id: string;
  label: string;
  count: number;
  subtext: string;
  tone: 'neutral' | 'attention' | 'danger' | 'success';
  tabTarget: 'inbound' | 'putaway' | 'picking' | 'outbound' | 'incidents' | 'reprint';
}

export interface SummaryPendingItem {
  id: string;
  folio: string;
  type: string;
  description: string;
  age: string;
  priority: 'Normal' | 'Atención' | 'Alta' | 'Crítica';
  tabTarget: 'inbound' | 'putaway' | 'picking' | 'outbound' | 'incidents';
  actionLabel: string;
}

export interface SummaryAuditEvent {
  id: string;
  time: string;
  activity: string;
  reference: string;
  context: string;
  user: string;
  badgeType: 'inbound' | 'putaway' | 'picking' | 'outbound' | 'incidents' | 'reprint';
  warehouseId?: string;
}

export interface StagingLaneSummary {
  code: string;
  status: 'Disponible' | 'Preparando salida' | 'Ocupado' | 'Reservado';
  unitsCount?: number;
  orderRef?: string;
}

export interface InboundBaySummary {
  code: string;
  unitsCount: number;
  pendingPutawayCount: number;
  orderRef: string;
}

export interface AgingUnitSummary {
  uid: string;
  productName: string;
  stage: 'Acomodo' | 'Recolección' | 'Verificación de Salida';
  timeInProcess: string;
  referenceOrder: string;
  location: string;
}

export interface SummaryDataset {
  kpis: SummaryKpi[];
  flow: { inbound: number; putaway: number; picking: number; outbound: number; readyForLoading: number };
  pending: SummaryPendingItem[];
  urgentAlerts: { id: string; message: string; severity: 'critical' | 'warning' | 'info'; tabTarget: 'inbound' | 'putaway' | 'picking' | 'outbound' | 'incidents' }[];
  agingUnits: AgingUnitSummary[];
}

export const CEDIS_SUMMARY_DATA: Record<string, Record<string, SummaryDataset>> = {
  'wh-mty-norte': {
    today: {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 48, subtext: '8 pendientes', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 16, subtext: '3 con más de 1 h', tone: 'attention', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 36, subtext: '12 pendientes', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 28, subtext: '3 órdenes en rampa', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 8, subtext: '2 críticas', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 6, subtext: 'Últimas 24 h', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: {
        inbound: 48,
        putaway: 38,
        picking: 36,
        outbound: 28,
        readyForLoading: 28,
      },
      pending: [
        { id: 'p-1', folio: 'OC-2026-0081', type: 'Recepción Nayt', description: '19 unidades arribando en rampa REC-01', age: 'Hace 45 min', priority: 'Atención', tabTarget: 'inbound', actionLabel: 'Abrir recepción' },
        { id: 'p-2', folio: 'OA-2026-0031', type: 'Acomodo en Proceso', description: '3 unidades pendientes en Pasillo A', age: 'Hace 30 min', priority: 'Normal', tabTarget: 'putaway', actionLabel: 'Continuar' },
        { id: 'p-3', folio: 'OR-2026-0118', type: 'Recolección en Proceso', description: '4 / 6 unidades pendientes para Sucursal VO', age: 'Hace 20 min', priority: 'Alta', tabTarget: 'picking', actionLabel: 'Continuar' },
        { id: 'p-4', folio: 'VS-2026-0041', type: 'Verificación en Rampa', description: '4 / 6 unidades validadas en EMB-03', age: 'Hace 15 min', priority: 'Alta', tabTarget: 'outbound', actionLabel: 'Continuar' },
        { id: 'p-5', folio: 'INC-2026-0034', type: 'Unidad No Localizada', description: 'SC-UID-2026-000184 no encontrada en A-B-03', age: 'Hace 24 min', priority: 'Crítica', tabTarget: 'incidents', actionLabel: 'Atender' },
      ],
      urgentAlerts: [
        { id: 'u-1', message: '1 incidencia crítica por atender (Daño operativo en Pasillo A)', severity: 'critical', tabTarget: 'incidents' },
        { id: 'u-2', message: '3 unidades llevan más de 1 h pendientes de acomodo en REC-01', severity: 'warning', tabTarget: 'putaway' },
        { id: 'u-3', message: '1 orden de salida con discrepancia serial en EMB-02', severity: 'warning', tabTarget: 'outbound' },
        { id: 'u-4', message: 'Traspaso a Sucursal Valle Oriente con salida programada a las 14:00', severity: 'info', tabTarget: 'picking' },
      ],
      agingUnits: [
        { uid: 'SC-UID-2026-000184', productName: 'Nayt Flow Basic White Matrimonial', stage: 'Acomodo', timeInProcess: '1 h 18 min', referenceOrder: 'OA-2026-0031', location: 'REC-01' },
        { uid: 'SC-UID-2026-000211', productName: 'Restonic Ortopedic Matrimonial', stage: 'Recolección', timeInProcess: '52 min', referenceOrder: 'OR-2026-0118', location: 'A-B-03' },
        { uid: 'SC-UID-2026-000121', productName: 'Spring Air Record Individual', stage: 'Verificación de Salida', timeInProcess: '45 min', referenceOrder: 'VS-2026-0041', location: 'EMB-03' },
      ],
    },
    yesterday: {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 42, subtext: '0 pendientes', tone: 'success', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 4, subtext: 'Turno vespertino', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 48, subtext: 'Completadas', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 45, subtext: '4 órdenes embarcadas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 2, subtext: 'En atención', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 4, subtext: 'Auditoría regular', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 42, putaway: 42, picking: 48, outbound: 45, readyForLoading: 45 },
      pending: [
        { id: 'p-1', folio: 'INC-2026-0030', type: 'QR Ilegible', description: 'Reimpresión autorizada de SC-UID-2026-000121', age: 'Ayer', priority: 'Normal', tabTarget: 'incidents', actionLabel: 'Ver' },
      ],
      urgentAlerts: [],
      agingUnits: [],
    },
    '7d': {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 284, subtext: '98.5% a tiempo', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 16, subtext: 'En flujo diario', tone: 'attention', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 260, subtext: 'Semanal', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 240, subtext: '24 rutas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 8, subtext: 'Tasa 1.6%', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 18, subtext: 'Semanal', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 284, putaway: 268, picking: 260, outbound: 240, readyForLoading: 240 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '30d': {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 1240, subtext: 'Consolidado mensual', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 16, subtext: 'Flujo activo', tone: 'attention', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 1180, subtext: 'Consolidado mensual', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 1110, subtext: '102 rutas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 8, subtext: 'Resueltas 48', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 54, subtext: 'Mensual', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 1240, putaway: 1224, picking: 1180, outbound: 1110, readyForLoading: 1110 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
  },
  'wh-mty-sur': {
    today: {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 24, subtext: '6 pendientes', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 9, subtext: 'En flujo matutino', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 18, subtext: '4 pendientes', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 14, subtext: '2 órdenes en rampa', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 5, subtext: '1 crítica', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 4, subtext: 'Últimas 24 h', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: {
        inbound: 24,
        putaway: 18,
        picking: 18,
        outbound: 14,
        readyForLoading: 14,
      },
      pending: [
        { id: 'p-s1', folio: 'OC-2026-0083', type: 'Recepción Spring Air', description: '24 unidades en rampa REC-02', age: 'Hace 35 min', priority: 'Normal', tabTarget: 'inbound', actionLabel: 'Abrir recepción' },
        { id: 'p-s2', folio: 'OA-2026-0033', type: 'Acomodo en Proceso', description: '3 unidades por estibar en Pasillo B', age: 'Hace 25 min', priority: 'Normal', tabTarget: 'putaway', actionLabel: 'Continuar' },
        { id: 'p-s3', folio: 'OR-2026-0125', type: 'Recolección Traspaso', description: '3 / 4 unidades pendientes para Sucursal Cumbres', age: 'Hace 15 min', priority: 'Alta', tabTarget: 'picking', actionLabel: 'Continuar' },
        { id: 'p-s4', folio: 'VS-2026-0043', type: 'Verificación en Rampa', description: '2 / 4 unidades validadas en EMB-01', age: 'Hace 10 min', priority: 'Alta', tabTarget: 'outbound', actionLabel: 'Continuar' },
      ],
      urgentAlerts: [
        { id: 'u-s1', message: 'Ruta Guadalupe #04 completada al 100% en EMB-01', severity: 'info', tabTarget: 'outbound' },
        { id: 'u-s2', message: '1 bulto con deformación estructural en Pasillo B', severity: 'critical', tabTarget: 'incidents' },
      ],
      agingUnits: [
        { uid: 'SC-UID-2026-000301', productName: 'Sealy Celebration Plus King Size', stage: 'Acomodo', timeInProcess: '45 min', referenceOrder: 'OA-2026-0033', location: 'REC-02' },
      ],
    },
    yesterday: {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 20, subtext: '0 pendientes', tone: 'success', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 0, subtext: 'Al día', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 22, subtext: 'Completadas', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 20, subtext: '2 rutas completas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 1, subtext: 'Resuelta', tone: 'success', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 2, subtext: 'Regular', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 20, putaway: 20, picking: 22, outbound: 20, readyForLoading: 20 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '7d': {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 140, subtext: 'Semanal', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 9, subtext: 'En flujo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 130, subtext: 'Semanal', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 120, subtext: '14 rutas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 5, subtext: 'En proceso', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 12, subtext: 'Semanal', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 140, putaway: 135, picking: 130, outbound: 120, readyForLoading: 120 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '30d': {
      kpis: [
        { id: 'kpi-inbound', label: 'ENTRADAS RECIBIDAS', count: 580, subtext: 'Mensual', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 9, subtext: 'Flujo activo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'UNIDADES RECOLECTADAS', count: 540, subtext: 'Mensual', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA CARGA', count: 510, subtext: '48 rutas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS ABIERTAS', count: 5, subtext: 'Resueltas 22', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 32, subtext: 'Mensual', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 580, putaway: 571, picking: 540, outbound: 510, readyForLoading: 510 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
  },
  'wh-suc-valle-oriente': {
    today: {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 2, subtext: '10 u. en camino', tone: 'attention', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 3, subtext: 'En REC-SUC-VO', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 6, subtext: 'Bahías 01-06 activas', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 32, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 1, subtext: 'Resuelta', tone: 'success', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 2, subtext: 'Últimas 24 h', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 6, putaway: 4, picking: 2, outbound: 2, readyForLoading: 2 },
      pending: [
        { id: 'p-vo-1', folio: 'OTP-2026-0044', type: 'Recepción de Traspaso', description: '4 unidades pendientes de validar en REC-SUC-VO', age: 'Hoy, 11:30', priority: 'Alta', tabTarget: 'inbound', actionLabel: 'Abrir recepción' },
        { id: 'p-vo-2', folio: 'OA-2026-0037', type: 'Acomodo en Sucursal', description: '2 unidades por acomodar en bodega local', age: 'Hace 30 min', priority: 'Normal', tabTarget: 'putaway', actionLabel: 'Acomodar' },
      ],
      urgentAlerts: [
        { id: 'u-vo-1', message: 'Camión #05 descargando 6 colchones en rampa de sucursal', severity: 'info', tabTarget: 'inbound' },
      ],
      agingUnits: [
        { uid: 'SC-UID-2026-000182', productName: 'Nayt Colchón Flow Basic Individual', stage: 'Acomodo', timeInProcess: '20 min', referenceOrder: 'OTP-2026-0044', location: 'REC-SUC-VO' },
      ],
    },
    yesterday: {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 0, subtext: 'Al día', tone: 'success', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 0, subtext: 'Al día', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 6, subtext: 'Exhibición', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 32, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 0, subtext: 'Sin incidencias', tone: 'success', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 1, subtext: 'Regular', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 6, putaway: 6, picking: 4, outbound: 4, readyForLoading: 4 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '7d': {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 3, subtext: 'Semanal', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 3, subtext: 'Flujo activo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 6, subtext: 'Exhibición', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 32, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 1, subtext: 'Semanal', tone: 'success', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 3, subtext: 'Semanal', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 24, putaway: 21, picking: 16, outbound: 16, readyForLoading: 16 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '30d': {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 12, subtext: 'Mensual', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 3, subtext: 'Flujo activo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 6, subtext: 'Exhibición', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 32, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 2, subtext: 'Resueltas', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 8, subtext: 'Mensual', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 98, putaway: 95, picking: 74, outbound: 74, readyForLoading: 74 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
  },
  'wh-suc-cumbres': {
    today: {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 2, subtext: '8 u. en tránsito (OTP-0045)', tone: 'attention', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 2, subtext: 'En REC-SUC-CUM', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 5, subtext: 'Bahías 01-05 activas', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 26, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 1, subtext: 'En atención', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 1, subtext: 'Últimas 24 h', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 4, putaway: 3, picking: 2, outbound: 2, readyForLoading: 2 },
      pending: [
        { id: 'p-cum-1', folio: 'OTP-2026-0045', type: 'Recepción de Traspaso', description: '8 unidades en tránsito desde CEDIS Sur', age: 'Hoy, 10:00', priority: 'Alta', tabTarget: 'inbound', actionLabel: 'Iniciar recepción' },
        { id: 'p-cum-2', folio: 'OA-2026-0038', type: 'Acomodo en Sucursal', description: '1 unidad ortopédica para exhibición en SHOW-03', age: 'Hace 20 min', priority: 'Normal', tabTarget: 'putaway', actionLabel: 'Acomodar' },
      ],
      urgentAlerts: [
        { id: 'u-cum-1', message: 'Camión #09 arribando con traspaso OTP-2026-0045 (8 colchones)', severity: 'info', tabTarget: 'inbound' },
      ],
      agingUnits: [
        { uid: 'SC-UID-2026-000192', productName: 'Spring Air Record Individual', stage: 'Acomodo', timeInProcess: '25 min', referenceOrder: 'OTP-2026-0045', location: 'REC-SUC-CUM' },
      ],
    },
    yesterday: {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 0, subtext: 'Al día', tone: 'success', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 0, subtext: 'Sin pendientes', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 5, subtext: 'Exhibición', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 26, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 0, subtext: 'Sin incidencias', tone: 'success', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 0, subtext: 'Sin reimpresiones', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 4, putaway: 4, picking: 3, outbound: 3, readyForLoading: 3 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '7d': {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 2, subtext: 'Semanal', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 2, subtext: 'Flujo activo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 5, subtext: 'Exhibición', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 26, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 1, subtext: 'Resuelta', tone: 'success', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 2, subtext: 'Semanal', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 18, putaway: 16, picking: 14, outbound: 14, readyForLoading: 14 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '30d': {
      kpis: [
        { id: 'kpi-transfers', label: 'TRASP. POR RECIBIR', count: 9, subtext: 'Mensual', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 2, subtext: 'Flujo activo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-showroom', label: 'EN SHOWROOM', count: 5, subtext: 'Exhibición', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-stock', label: 'INVENTARIO LOCAL', count: 26, subtext: 'Colchones físicos', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS', count: 2, subtext: 'Resueltas', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 6, subtext: 'Mensual', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 76, putaway: 74, picking: 60, outbound: 60, readyForLoading: 60 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
  },
};

export const getSummaryDataForCedis = (period: string, warehouseId: string): SummaryDataset => {
  const cedisMap = CEDIS_SUMMARY_DATA[warehouseId] || CEDIS_SUMMARY_DATA['wh-mty-norte'];
  return cedisMap[period] || cedisMap.today;
};

export const MOCK_RECENT_AUDIT_EVENTS: SummaryAuditEvent[] = [
  // 1-10: Recepción & Entrada
  { id: 'e-1', time: '14:20', activity: 'Devolución registrada', reference: 'DEV-2026-0021', context: 'SC-UID-2026-000184 · Empaque dañado', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'wh-mty-norte' },
  { id: 'e-2', time: '13:50', activity: 'Salida pendiente asignada', reference: 'VS-2026-0044', context: '4 unidades · Carril EMB-05', user: 'Roberto Garza', badgeType: 'outbound', warehouseId: 'wh-mty-norte' },
  { id: 'e-3', time: '13:40', activity: 'Devolución con incidencia', reference: 'DEV-2026-0025', context: 'SC-UID-2026-000199 · Mancha en cubierta', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'wh-mty-norte' },
  { id: 'e-4', time: '13:20', activity: 'Acomodo en Showroom', reference: 'OA-2026-0038', context: 'SC-UID-2026-000191 · Bahía SHOW-03', user: 'Jorge Villarreal', badgeType: 'putaway', warehouseId: 'wh-suc-cumbres' },
  { id: 'e-5', time: '13:05', activity: 'Salida validada en rampa', reference: 'VS-2026-0043', context: 'SC-UID-2026-000135 · EMB-01 Sur', user: 'Valeria Torres', badgeType: 'outbound', warehouseId: 'wh-mty-sur' },
  { id: 'e-6', time: '12:45', activity: 'Recolección en proceso', reference: 'OR-2026-0125', context: '4 unidades · Pasillo B Sur', user: 'Valeria Torres', badgeType: 'picking', warehouseId: 'wh-mty-sur' },
  { id: 'e-7', time: '12:40', activity: 'Incidencia por artículo incorrecto', reference: 'INC-2026-0037', context: 'OC-2026-0092 · Medida incorrecta en tarima', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'wh-mty-norte' },
  { id: 'e-8', time: '12:35', activity: 'Salida validada en rampa', reference: 'VS-2026-0041', context: 'SC-UID-2026-000101 · EMB-03 Norte', user: 'Carlos Medina', badgeType: 'outbound', warehouseId: 'wh-mty-norte' },
  { id: 'e-9', time: '12:00', activity: 'Etiqueta de showroom reimpresa', reference: 'REP-VO-002', context: 'SHOW-02 · Bahía de Exhibición VO', user: 'Brenda Cavazos', badgeType: 'reprint', warehouseId: 'wh-suc-valle-oriente' },
  { id: 'e-10', time: '11:55', activity: 'Acomodo en Showroom', reference: 'OA-2026-0037', context: 'SC-UID-2026-000181 · Bahía SHOW-02', user: 'Brenda Cavazos', badgeType: 'putaway', warehouseId: 'wh-suc-valle-oriente' },

  // 11-20: Acomodo, Picking y Salidas
  { id: 'e-11', time: '11:45', activity: 'Etiqueta de unidad reimpresa', reference: 'REP-2026-0005', context: 'SC-UID-2026-000301 · Sealy King Size', user: 'Valeria Torres', badgeType: 'reprint', warehouseId: 'wh-mty-sur' },
  { id: 'e-12', time: '11:42', activity: 'Recolección registrada', reference: 'OR-2026-0118', context: 'SC-UID-2026-000101 · Pasillo A Nivel A', user: 'Carlos Medina', badgeType: 'picking', warehouseId: 'wh-mty-norte' },
  { id: 'e-13', time: '11:32', activity: 'Traspaso recibido en sucursal', reference: 'OTP-2026-0044', context: '6 unidades recibidas en REC-SUC-VO', user: 'Brenda Cavazos', badgeType: 'inbound', warehouseId: 'wh-suc-valle-oriente' },
  { id: 'e-14', time: '11:15', activity: 'Acomodo registrado', reference: 'OA-2026-0033', context: 'SC-UID-2026-000303 · REC-02 → A-B-03', user: 'Valeria Torres', badgeType: 'putaway', warehouseId: 'wh-mty-sur' },
  { id: 'e-15', time: '11:00', activity: 'Incidencia por sobrante físico', reference: 'INC-2026-0053', context: 'OC-2026-0082 · +1 unidad América Monaco', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'wh-mty-norte' },
  { id: 'e-16', time: '10:48', activity: 'Acomodo registrado', reference: 'OA-2026-0031', context: 'SC-UID-2026-000174 · REC-01 → A-B-02', user: 'Carlos Medina', badgeType: 'putaway', warehouseId: 'wh-mty-norte' },
  { id: 'e-17', time: '10:42', activity: 'Acomodo registrado', reference: 'OA-2026-0031', context: 'SC-UID-2026-000173 · REC-01 → A-B-01', user: 'Carlos Medina', badgeType: 'putaway', warehouseId: 'wh-mty-norte' },
  { id: 'e-18', time: '10:30', activity: 'Etiqueta reimpresa por QR ilegible', reference: 'REP-2026-0011', context: 'SC-UID-2026-000302 · Restonic King Size', user: 'Valeria Torres', badgeType: 'reprint', warehouseId: 'wh-mty-sur' },
  { id: 'e-19', time: '10:20', activity: 'Discrepancia serial detectada', reference: 'VS-2026-0042', context: 'UID SC-UID-2026-000109 en rampa EMB-02', user: 'Carlos Medina', badgeType: 'outbound', warehouseId: 'wh-mty-norte' },
  { id: 'e-20', time: '10:15', activity: 'Incidencia por empaque dañado', reference: 'INC-2026-0042', context: 'OC-2026-0091 · Bulto #8 rasgado', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'wh-mty-norte' },

  // 21-30: Recepciones tempranas, conteos y auditorías
  { id: 'e-21', time: '10:05', activity: 'Recepción iniciada en rampa', reference: 'OC-2026-0085', context: '9 unidades Sealy · Andén REC-01', user: 'Carlos Medina', badgeType: 'inbound', warehouseId: 'wh-mty-norte' },
  { id: 'e-22', time: '09:45', activity: 'Incidencia por daño operativo', reference: 'INC-2026-0057', context: 'Perforación por uña de montacargas', user: 'Roberto Garza', badgeType: 'incidents', warehouseId: 'wh-mty-norte' },
  { id: 'e-23', time: '09:40', activity: 'Sustitución en recolección', reference: 'OR-2026-0120', context: 'SC-UID-2026-000105 asignada por sustitución', user: 'Carlos Medina', badgeType: 'picking', warehouseId: 'wh-mty-norte' },
  { id: 'e-24', time: '09:30', activity: 'Ubicación cambiada en acomodo', reference: 'OA-2026-0035', context: 'Reubicación a A-B-05 por bloqueo de A-A-04', user: 'Carlos Medina', badgeType: 'putaway', warehouseId: 'wh-mty-norte' },
  { id: 'e-25', time: '09:10', activity: 'Etiqueta reimpresa por error', reference: 'REP-2026-0007', context: 'SC-UID-2026-000172 · Nayt Individual', user: 'Admin Demo', badgeType: 'reprint', warehouseId: 'wh-mty-norte' },
  { id: 'e-26', time: '09:00', activity: 'Recepción activa en CEDIS Sur', reference: 'OC-2026-0083', context: 'Spring Air · 24 unidades en REC-02', user: 'Valeria Torres', badgeType: 'inbound', warehouseId: 'wh-mty-sur' },
  { id: 'e-27', time: '08:45', activity: 'Reubicación de inventario', reference: 'INC-2026-0049', context: 'SC-UID-2026-000135 corregido a B-B-01', user: 'Valeria Torres', badgeType: 'putaway', warehouseId: 'wh-mty-sur' },
  { id: 'e-28', time: '08:30', activity: 'Diferencia en conteo cíclico', reference: 'INC-2026-0038', context: 'Pasillo A · -2 unidades detectadas', user: 'Auditor de Calidad', badgeType: 'incidents', warehouseId: 'wh-mty-norte' },
  { id: 'e-29', time: '08:15', activity: 'Apertura de Mesa de Verificación', reference: 'SISTEMA', context: 'Turno matutino iniciado en CEDIS Norte y Sur', user: 'Admin Demo', badgeType: 'inbound', warehouseId: 'wh-mty-norte' },

  // 30-36: Historial de Ayer
  { id: 'e-30', time: 'Ayer 18:10', activity: 'Devolución completa recibida', reference: 'DEV-2026-0020', context: 'SC-UID-2026-000121 en buen estado', user: 'Carlos Medina', badgeType: 'inbound', warehouseId: 'wh-mty-norte' },
  { id: 'e-31', time: 'Ayer 17:15', activity: 'Etiqueta reimpresa', reference: 'INC-2026-0030', context: 'SC-UID-2026-000121 · QR ilegible resuelto', user: 'Carlos Medina', badgeType: 'reprint', warehouseId: 'wh-mty-norte' },
  { id: 'e-32', time: 'Ayer 16:30', activity: 'Acomodo completado', reference: 'OA-2026-0030', context: '4 unidades en Pasillos A y B de CEDIS Sur', user: 'Valeria Torres', badgeType: 'putaway', warehouseId: 'wh-mty-sur' },
  { id: 'e-33', time: 'Ayer 16:25', activity: 'Salida validada 100%', reference: 'VS-2026-0039', context: '4 unidades · EMB-01 Norte (Lista para carga)', user: 'Carlos Medina', badgeType: 'outbound', warehouseId: 'wh-mty-norte' },
  { id: 'e-34', time: 'Ayer 15:45', activity: 'Salida validada 100%', reference: 'VS-2026-0040', context: '3 unidades · EMB-01 Sur (Lista para carga)', user: 'Valeria Torres', badgeType: 'outbound', warehouseId: 'wh-mty-sur' },
  { id: 'e-35', time: 'Ayer 15:10', activity: 'Recolección completada', reference: 'OR-2026-0117', context: '3 unidades · Ruta Guadalupe #04', user: 'Valeria Torres', badgeType: 'picking', warehouseId: 'wh-mty-sur' },
  { id: 'e-36', time: 'Ayer 13:10', activity: 'Acomodo en Sucursal VO', reference: 'OA-2026-0028', context: '2 unidades en Showroom y Bodega VO', user: 'Brenda Cavazos', badgeType: 'putaway', warehouseId: 'wh-suc-valle-oriente' },
];

export const MOCK_CEDIS_STAGING_LANES_SUMMARY: Record<string, StagingLaneSummary[]> = {
  'wh-mty-norte': [
    { code: 'EMB-01', status: 'Ocupado', unitsCount: 4, orderRef: 'VS-2026-0039' },
    { code: 'EMB-02', status: 'Preparando salida', unitsCount: 3, orderRef: 'VS-2026-0042' },
    { code: 'EMB-03', status: 'Ocupado', unitsCount: 6, orderRef: 'VS-2026-0041' },
    { code: 'EMB-04', status: 'Reservado' },
    { code: 'EMB-05', status: 'Preparando salida', unitsCount: 4, orderRef: 'VS-2026-0044' },
  ],
  'wh-mty-sur': [
    { code: 'EMB-01', status: 'Ocupado', unitsCount: 4, orderRef: 'VS-2026-0043' },
    { code: 'EMB-02', status: 'Preparando salida', unitsCount: 3, orderRef: 'VS-2026-0046' },
    { code: 'EMB-03', status: 'Ocupado', unitsCount: 3, orderRef: 'VS-2026-0045' },
  ],
};

export const MOCK_CEDIS_INBOUND_BAYS_SUMMARY: Record<string, InboundBaySummary[]> = {
  'wh-mty-norte': [
    { code: 'REC-01', unitsCount: 19, pendingPutawayCount: 5, orderRef: 'OC-2026-0081' },
    { code: 'REC-02', unitsCount: 9, pendingPutawayCount: 3, orderRef: 'OC-2026-0085' },
  ],
  'wh-mty-sur': [
    { code: 'REC-02', unitsCount: 24, pendingPutawayCount: 4, orderRef: 'OC-2026-0083' },
  ],
};
