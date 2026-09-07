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
  'alm-rtm-mp': {
    today: {
      kpis: [
        { id: 'kpi-inbound', label: 'RECEPCIÓN MATERIA PRIMA', count: 18, subtext: '2 órdenes en andén', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 6, subtext: 'Tarimas Couché y BOPP', tone: 'attention', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A PRENSAS (OP)', count: 14, subtext: 'OP-0882 y OP-0891', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'REMANENTES / DEVOLUCIONES', count: 4, subtext: 'Bobinas retornadas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'CUARENTENA / QA ABIERTO', count: 2, subtext: '1 por viscosidad tinta', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIÓN QR / LOTE', count: 5, subtext: 'Últimas 24 h', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: {
        inbound: 18,
        putaway: 12,
        picking: 14,
        outbound: 10,
        readyForLoading: 10,
      },
      pending: [
        { id: 'p-1', folio: 'OC-2026-0081', type: 'Recepción Bio-Pappel', description: '4 tarimas Couché 90g arribando en rampa REC-01', age: 'Hace 45 min', priority: 'Atención', tabTarget: 'inbound', actionLabel: 'Abrir recepción' },
        { id: 'p-2', folio: 'OA-2026-0031', type: 'Acomodo en Proceso', description: 'Tarima TAR-RTM-2026-00101 por ubicar en Pasillo A', age: 'Hace 30 min', priority: 'Normal', tabTarget: 'putaway', actionLabel: 'Continuar' },
        { id: 'p-3', folio: 'OP-2026-0882', type: 'Surtido Prensa Flexo 1', description: 'Bobina BOPP BOB-RTM-2026-00041 para Nilpeter', age: 'Hace 20 min', priority: 'Alta', tabTarget: 'picking', actionLabel: 'Continuar' },
        { id: 'p-4', folio: 'REM-2026-0041', type: 'Remanente de Bobina', description: '680 m BOPP devueltos de Línea Flexo 1', age: 'Hace 15 min', priority: 'Alta', tabTarget: 'outbound', actionLabel: 'Continuar' },
        { id: 'p-5', folio: 'INC-2026-0034', type: 'Diferencia de Conteo Cíclico', description: 'Diferencia -19,500 pliegos en A-B-03 Couché 90g', age: 'Hace 24 min', priority: 'Crítica', tabTarget: 'incidents', actionLabel: 'Atender' },
      ],
      urgentAlerts: [
        { id: 'u-1', message: 'Diferencia de conteo cíclico en investigación: -19,500 pliegos Couché 90g (A-B-03)', severity: 'critical', tabTarget: 'incidents' },
        { id: 'u-2', message: 'Bobina BOPP BOB-RTM-2026-00041 pendiente de liberación formal QA para grado farmacéutico', severity: 'warning', tabTarget: 'putaway' },
        { id: 'u-3', message: 'Cubeta de Tinta Pantone Red 186 C con desviación de viscosidad en laboratorio', severity: 'warning', tabTarget: 'incidents' },
        { id: 'u-4', message: 'Surtido urgente de cartulina SBS 14pts programado para Prensa Bobst a las 15:00', severity: 'info', tabTarget: 'picking' },
      ],
      agingUnits: [
        { uid: 'TAR-RTM-2026-00101', productName: 'Papel Couché Brillante 90g - 70x100 cm', stage: 'Acomodo', timeInProcess: '48 min', referenceOrder: 'OA-2026-0031', location: 'REC-01' },
        { uid: 'BOB-RTM-2026-00041', productName: 'Película BOPP Blanco Brillante 60 mic', stage: 'Recolección', timeInProcess: '35 min', referenceOrder: 'OP-2026-0882', location: 'A-A-01' },
        { uid: 'TAR-RTM-2026-00151', productName: 'Cartulina SBS Calibre 14 pts - 70x95 cm', stage: 'Verificación de Salida', timeInProcess: '25 min', referenceOrder: 'OP-2026-0904', location: 'C-A-01' },
      ],
    },
    yesterday: {
      kpis: [
        { id: 'kpi-inbound', label: 'RECEPCIÓN MATERIA PRIMA', count: 16, subtext: '0 pendientes', tone: 'success', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 2, subtext: 'Turno vespertino', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A PRENSAS', count: 22, subtext: '100% completado', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'REMANENTES / DEVOLUCIONES', count: 3, subtext: 'Reingresadas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'CUARENTENA QA', count: 1, subtext: 'En análisis', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 3, subtext: 'Auditoría regular', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 16, putaway: 16, picking: 22, outbound: 3, readyForLoading: 3 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '7d': {
      kpis: [
        { id: 'kpi-inbound', label: 'RECEPCIÓN MATERIA PRIMA', count: 112, subtext: 'Semanal', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 6, subtext: 'En flujo diario', tone: 'attention', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A PRENSAS', count: 148, subtext: 'Órdenes surtidas', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'REMANENTES / DEVOLUCIONES', count: 19, subtext: 'Control de metraje', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS QA', count: 4, subtext: 'Tasa 1.2%', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 14, subtext: 'Semanal', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 112, putaway: 106, picking: 148, outbound: 19, readyForLoading: 19 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '30d': {
      kpis: [
        { id: 'kpi-inbound', label: 'RECEPCIÓN MATERIA PRIMA', count: 480, subtext: 'Mensual', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ACOMODO', count: 6, subtext: 'Flujo activo', tone: 'attention', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A PRENSAS', count: 620, subtext: 'Mensual', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'REMANENTES / DEVOLUCIONES', count: 78, subtext: 'Reincorporadas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS QA', count: 5, subtext: 'Resueltas 42', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 46, subtext: 'Mensual', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 480, putaway: 474, picking: 620, outbound: 78, readyForLoading: 78 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
  },
  'alm-rtm-pt': {
    today: {
      kpis: [
        { id: 'kpi-inbound', label: 'PRODUCTO TERMINADO RECIBIDO', count: 28, subtext: 'Desde líneas de empaque', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ESTIBA PT', count: 4, subtext: 'En rampa REC-02 PT', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A EMBARQUES B2B', count: 16, subtext: '3 rutas programadas', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'LISTAS PARA DESPACHO', count: 12, subtext: 'Tarimas con fleje y COA', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'CUARENTENA PT', count: 1, subtext: 'Etiqueta de caja', tone: 'danger', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIÓN ETIQUETA PT', count: 2, subtext: 'Últimas 24 h', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: {
        inbound: 28,
        putaway: 24,
        picking: 16,
        outbound: 12,
        readyForLoading: 12,
      },
      pending: [
        { id: 'p-s1', folio: 'PT-2026-0915', type: 'Ingreso Línea Empaque', description: '12 cajas etiquetas farmacéuticas en rampa REC-02 PT', age: 'Hace 35 min', priority: 'Normal', tabTarget: 'inbound', actionLabel: 'Validar ingreso' },
        { id: 'p-s2', folio: 'PED-2026-0410', type: 'Despacho Medifarma', description: '3 tarimas etiquetas viales con certificado COA', age: 'Hace 25 min', priority: 'Alta', tabTarget: 'picking', actionLabel: 'Continuar' },
        { id: 'p-s3', folio: 'PED-2026-0398', type: 'Despacho Delphi Technologies', description: 'Tarimas corrugadas en andén EMB-02 PT', age: 'Hace 15 min', priority: 'Alta', tabTarget: 'outbound', actionLabel: 'Continuar' },
      ],
      urgentAlerts: [
        { id: 'u-s1', message: 'Despacho a Laboratorios Medifarma programado para 16:30 h en Rampa EMB-01 PT', severity: 'info', tabTarget: 'outbound' },
        { id: 'u-s2', message: '1 caja de folletos médicos en revisión de suaje y sangrado por QA', severity: 'warning', tabTarget: 'incidents' },
      ],
      agingUnits: [
        { uid: 'CJ-RTM-2026-00211', productName: 'Etiqueta Farmacéutica Vial 10ml - PT', stage: 'Verificación de Salida', timeInProcess: '30 min', referenceOrder: 'PED-2026-0410', location: 'EMB-01' },
      ],
    },
    yesterday: {
      kpis: [
        { id: 'kpi-inbound', label: 'PRODUCTO TERMINADO RECIBIDO', count: 24, subtext: 'Al día', tone: 'success', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ESTIBA PT', count: 0, subtext: 'Sin pendientes', tone: 'success', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A EMBARQUES', count: 18, subtext: 'Completadas', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'DESPACHOS COMPLETADOS', count: 18, subtext: '3 rutas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS PT', count: 0, subtext: 'Sin incidencias', tone: 'success', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 1, subtext: 'Regular', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 24, putaway: 24, picking: 18, outbound: 18, readyForLoading: 18 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '7d': {
      kpis: [
        { id: 'kpi-inbound', label: 'PRODUCTO TERMINADO RECIBIDO', count: 165, subtext: 'Semanal', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ESTIBA PT', count: 4, subtext: 'Flujo activo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A EMBARQUES', count: 135, subtext: 'Semanal', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'DESPACHOS COMPLETADOS', count: 130, subtext: '18 rutas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS PT', count: 2, subtext: 'Resueltas', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 8, subtext: 'Semanal', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 165, putaway: 161, picking: 135, outbound: 130, readyForLoading: 130 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
    '30d': {
      kpis: [
        { id: 'kpi-inbound', label: 'PRODUCTO TERMINADO RECIBIDO', count: 720, subtext: 'Mensual', tone: 'neutral', tabTarget: 'inbound' },
        { id: 'kpi-putaway', label: 'PENDIENTES DE ESTIBA PT', count: 4, subtext: 'Flujo activo', tone: 'neutral', tabTarget: 'putaway' },
        { id: 'kpi-picking', label: 'SURTIDO A EMBARQUES', count: 590, subtext: 'Mensual', tone: 'neutral', tabTarget: 'picking' },
        { id: 'kpi-outbound', label: 'DESPACHOS COMPLETADOS', count: 580, subtext: '64 rutas', tone: 'success', tabTarget: 'outbound' },
        { id: 'kpi-incidents', label: 'INCIDENCIAS PT', count: 3, subtext: 'Resueltas 18', tone: 'attention', tabTarget: 'incidents' },
        { id: 'kpi-reprint', label: 'REIMPRESIONES', count: 24, subtext: 'Mensual', tone: 'neutral', tabTarget: 'reprint' },
      ],
      flow: { inbound: 720, putaway: 716, picking: 590, outbound: 580, readyForLoading: 580 },
      pending: [],
      urgentAlerts: [],
      agingUnits: [],
    },
  },
};

export const getSummaryDataForCedis = (period: string, warehouseId: string): SummaryDataset => {
  const cedisMap = CEDIS_SUMMARY_DATA[warehouseId] || CEDIS_SUMMARY_DATA['alm-rtm-mp'];
  return cedisMap[period] || cedisMap.today;
};

export const MOCK_RECENT_AUDIT_EVENTS: SummaryAuditEvent[] = [
  // 1-10: Recepción & Entrada
  { id: 'e-1', time: '14:20', activity: 'Remanente registrado', reference: 'REM-2026-0041', context: 'BOB-RTM-2026-00041 · 680 m BOPP retornado de Flexo 1', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'alm-rtm-mp' },
  { id: 'e-2', time: '13:50', activity: 'Surtido OP asignado', reference: 'OP-2026-0882', context: '2 bobinas BOPP · Rampa OP-01', user: 'Carlos Medina', badgeType: 'picking', warehouseId: 'alm-rtm-mp' },
  { id: 'e-3', time: '13:40', activity: 'Incidencia QA de viscosidad', reference: 'REM-2026-0045', context: 'CUB-RTM-2026-00018 · Pantone Red 186 C', user: 'Laboratorio QA', badgeType: 'incidents', warehouseId: 'alm-rtm-mp' },
  { id: 'e-4', time: '13:20', activity: 'Acomodo en ALM-PT', reference: 'OA-2026-0038', context: 'CJ-RTM-2026-00211 · Pasillo A-A-01 PT', user: 'Valeria Torres', badgeType: 'putaway', warehouseId: 'alm-rtm-pt' },
  { id: 'e-5', time: '13:05', activity: 'Despacho validado en andén PT', reference: 'PED-2026-0410', context: 'Medifarma · Andén EMB-01 PT', user: 'Valeria Torres', badgeType: 'outbound', warehouseId: 'alm-rtm-pt' },
  { id: 'e-6', time: '12:45', activity: 'Surtido de tinta en proceso', reference: 'OP-2026-0891', context: '2 cubetas Process Black · Pasillo B', user: 'Carlos Medina', badgeType: 'picking', warehouseId: 'alm-rtm-mp' },
  { id: 'e-7', time: '12:40', activity: 'Incidencia por fleje roto', reference: 'INC-2026-0037', context: 'OC-2026-0085 · Tarima cajas Smurfit', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'alm-rtm-mp' },
  { id: 'e-8', time: '12:35', activity: 'Salida validada en rampa', reference: 'PED-2026-0398', context: 'TAR-RTM-2026-00401 · Delphi Planta 2', user: 'Valeria Torres', badgeType: 'outbound', warehouseId: 'alm-rtm-pt' },
  { id: 'e-9', time: '12:00', activity: 'Etiqueta de tarima reimpresa', reference: 'REP-2026-0012', context: 'TAR-RTM-2026-00102 · Couché 90g', user: 'Carlos Medina', badgeType: 'reprint', warehouseId: 'alm-rtm-mp' },
  { id: 'e-10', time: '11:55', activity: 'Acomodo de Couché', reference: 'OA-2026-0037', context: 'TAR-RTM-2026-00103 · Pasillo A-B-02', user: 'Carlos Medina', badgeType: 'putaway', warehouseId: 'alm-rtm-mp' },

  // 11-20: Acomodo, Picking y Salidas
  { id: 'e-11', time: '11:45', activity: 'Etiqueta de bobina reimpresa', reference: 'REP-2026-0005', context: 'BOB-RTM-2026-00041 · QR actualizado con 680m', user: 'Carlos Medina', badgeType: 'reprint', warehouseId: 'alm-rtm-mp' },
  { id: 'e-12', time: '11:42', activity: 'Surtido registrado', reference: 'OP-2026-0882', context: 'BOB-RTM-2026-00041 · Pasillo A Nivel A', user: 'Carlos Medina', badgeType: 'picking', warehouseId: 'alm-rtm-mp' },
  { id: 'e-13', time: '11:32', activity: 'Ingreso PT de Prensa Offset', reference: 'PT-2026-0891', context: '4 tarimas folletos terminados en ALM-PT', user: 'Valeria Torres', badgeType: 'inbound', warehouseId: 'alm-rtm-pt' },
  { id: 'e-14', time: '11:15', activity: 'Acomodo registrado', reference: 'OA-2026-0033', context: 'TAR-RTM-2026-00151 · REC-01 → C-A-01', user: 'Carlos Medina', badgeType: 'putaway', warehouseId: 'alm-rtm-mp' },
  { id: 'e-15', time: '11:00', activity: 'Liberación QA de Lote', reference: 'COA-2026-011', context: 'Lote RTM-PT-260905-001 liberado con COA', user: 'Ing. Químico QA', badgeType: 'incidents', warehouseId: 'alm-rtm-pt' },
  { id: 'e-16', time: '10:48', activity: 'Acomodo registrado', reference: 'OA-2026-0031', context: 'TAR-RTM-2026-00101 · REC-01 → A-B-01', user: 'Carlos Medina', badgeType: 'putaway', warehouseId: 'alm-rtm-mp' },
  { id: 'e-17', time: '10:42', activity: 'Acomodo registrado', reference: 'OA-2026-0031', context: 'TAR-RTM-2026-00102 · REC-01 → A-B-02', user: 'Carlos Medina', badgeType: 'putaway', warehouseId: 'alm-rtm-mp' },
  { id: 'e-18', time: '10:30', activity: 'Etiqueta reimpresa por código ilegible', reference: 'REP-2026-0011', context: 'TAR-RTM-2026-00401 · Cartulina SBS', user: 'Carlos Medina', badgeType: 'reprint', warehouseId: 'alm-rtm-mp' },
  { id: 'e-19', time: '10:20', activity: 'Discrepancia en conteo cíclico', reference: 'INC-2026-0034', context: 'Diferencia -19,500 pliegos en A-B-03 Couché 90g', user: 'Auditor de Calidad', badgeType: 'incidents', warehouseId: 'alm-rtm-mp' },
  { id: 'e-20', time: '10:15', activity: 'Incidencia por fleje roto', reference: 'INC-2026-0042', context: 'OC-2026-0085 · Tarima cajas Smurfit', user: 'Carlos Medina', badgeType: 'incidents', warehouseId: 'alm-rtm-mp' },
];

export const MOCK_CEDIS_STAGING_LANES_SUMMARY: Record<string, StagingLaneSummary[]> = {
  'alm-rtm-mp': [
    { code: 'STG-OP-01', status: 'Ocupado', unitsCount: 2, orderRef: 'OP-2026-0882' },
    { code: 'STG-OP-02', status: 'Preparando salida', unitsCount: 4, orderRef: 'OP-2026-0891' },
    { code: 'STG-OP-03', status: 'Disponible' },
    { code: 'STG-REM-01', status: 'Ocupado', unitsCount: 1, orderRef: 'REM-2026-0041' },
  ],
  'alm-rtm-pt': [
    { code: 'EMB-01', status: 'Ocupado', unitsCount: 3, orderRef: 'PED-2026-0410' },
    { code: 'EMB-02', status: 'Preparando salida', unitsCount: 3, orderRef: 'PED-2026-0398' },
    { code: 'EMB-03', status: 'Disponible' },
  ],
};

export const MOCK_CEDIS_INBOUND_BAYS_SUMMARY: Record<string, InboundBaySummary[]> = {
  'alm-rtm-mp': [
    { code: 'REC-01', unitsCount: 6, pendingPutawayCount: 4, orderRef: 'OC-2026-0081' },
    { code: 'REC-02', unitsCount: 4, pendingPutawayCount: 2, orderRef: 'OC-2026-0083' },
  ],
  'alm-rtm-pt': [
    { code: 'REC-01 PT', unitsCount: 12, pendingPutawayCount: 2, orderRef: 'PT-2026-0915' },
  ],
};
