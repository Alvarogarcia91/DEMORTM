// ============================================================================
// MODELO Y DATASET ANALÍTICO DE CALIDAD — 7D, 30D, 60D, 90D
// ============================================================================

export type PeriodOption = '7d' | '30d' | '60d' | '90d' | 'custom';
export type IncidenceTab = 'clientes' | 'partes' | 'procesos' | 'lineas' | 'defectos';

export interface IncidenceItem {
  id: string;
  name: string;
  subtitle?: string;
  ncCount: number;
  totalPercent: number;
  trend: 'up' | 'down' | 'neutral';
  trendVal: string;
  topDefects?: { defect: string; count: number }[];
  affectedParts?: { part: string; count: number }[];
}

export interface ParetoDefectItem {
  defect: string;
  count: number;
  percent: number;
  cumulativePercent: number;
  diffVsPrev: string;
}

export interface QualityTrendPoint {
  label: string;
  date: string;
  conformityPercent: number;
  ncCount: number;
  avgReleaseMinutes: number;
}

export interface ProcessPerformanceItem {
  process: string;
  area: string;
  auditsCount: number;
  conformityPercent: number;
  ncCount: number;
  avgReleaseMinutes: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface DefectHeatmapRow {
  defect: string;
  counts: Record<string, number>; // process -> count
}

export interface ReincidenceAlert {
  id: string;
  title: string;
  eventsCount: number;
  opsCount: number;
  clientsCount: number;
  subtitle: string;
  icarId?: string;
  deviationId?: string;
  actionLabel: string;
  actionType: 'analysis' | 'icar' | 'audit';
}

export interface SmartQualitySuggestion {
  id: string;
  title: string;
  reason: string;
  impactNote?: string;
  targetFilter?: {
    area?: string;
    process?: string;
    client?: string;
    defect?: string;
  };
  primaryActionLabel: string;
  primaryActionType: 'filter-area' | 'filter-process' | 'filter-client' | 'view-pareto' | 'view-audits' | 'view-plan';
  secondaryActionLabel?: string;
  secondaryActionType?: 'view-pareto' | 'view-audits' | 'view-plan' | 'open-icar';
}

export interface QualityAnalyticsKPIs {
  auditCompliancePercent: number;
  auditComplianceDiff: string;
  auditsExecuted: number;
  conformingAudits: number;
  nonConformances: number;
  nonConformancesDiff: string;
  holdItemsCount: number;
  holdPiecesCount: number;
  deviationsCount: number;
  deviationsRequireAction: number;
  avgReleaseMinutes: number;
  avgReleaseDiff: string;
}

// ----------------------------------------------------------------------------
// DATASETS POR PERIODO
// ----------------------------------------------------------------------------

export const ANALYTICS_DATA_BY_PERIOD: Record<
  PeriodOption,
  {
    kpis: QualityAnalyticsKPIs;
    incidence: Record<IncidenceTab, IncidenceItem[]>;
    pareto: ParetoDefectItem[];
    trend: QualityTrendPoint[];
    processes: ProcessPerformanceItem[];
    heatmap: DefectHeatmapRow[];
    reincidencias: ReincidenceAlert[];
    suggestions: SmartQualitySuggestion[];
  }
> = {
  '30d': {
    kpis: {
      auditCompliancePercent: 94.8,
      auditComplianceDiff: '↑ 2.1 pts vs anterior',
      auditsExecuted: 184,
      conformingAudits: 173,
      nonConformances: 11,
      nonConformancesDiff: '↓ 3 vs anterior',
      holdItemsCount: 4,
      holdPiecesCount: 18420,
      deviationsCount: 7,
      deviationsRequireAction: 3,
      avgReleaseMinutes: 18,
      avgReleaseDiff: 'objetivo < 20 min',
    },
    incidence: {
      clientes: [
        {
          id: 'cli-1',
          name: 'Panasonic Industrial',
          subtitle: 'División Electrónica / Baterías',
          ncCount: 12,
          totalPercent: 28,
          trend: 'up',
          trendVal: '↑ 4 eventos',
          topDefects: [
            { defect: 'Registro / Color', count: 5 },
            { defect: 'Troquelado', count: 3 },
            { defect: 'Dimensional', count: 2 },
            { defect: 'Texto / Revisión', count: 2 },
          ],
          affectedParts: [
            { part: '526412 | G |', count: 6 },
            { part: 'PN-48201', count: 4 },
            { part: 'LBL-PAN-09', count: 2 },
          ],
        },
        {
          id: 'cli-2',
          name: 'BLACK & DECKER',
          subtitle: 'Herramientas Eléctricas',
          ncCount: 9,
          totalPercent: 21,
          trend: 'down',
          trendVal: '↓ 2 eventos',
          topDefects: [
            { defect: 'Revisión incorrecta', count: 4 },
            { defect: 'Dimensional / Corte', count: 3 },
            { defect: 'Empaque', count: 2 },
          ],
          affectedParts: [
            { part: 'NA472050', count: 5 },
            { part: 'BD-MAN-102', count: 4 },
          ],
        },
        {
          id: 'cli-3',
          name: 'TYCO Electronics',
          subtitle: 'Arneses y Sensores',
          ncCount: 7,
          totalPercent: 16,
          trend: 'neutral',
          trendVal: '→ sin cambio',
          topDefects: [
            { defect: 'Registro impresión', count: 4 },
            { defect: 'Troquel incompleto', count: 3 },
          ],
          affectedParts: [
            { part: 'IS-2420', count: 4 },
            { part: 'TYC-8812', count: 3 },
          ],
        },
        {
          id: 'cli-4',
          name: 'Fresenius Medical Care',
          subtitle: 'Farmacéutica & Dispositivos',
          ncCount: 5,
          totalPercent: 12,
          trend: 'up',
          trendVal: '↑ 1 evento',
          topDefects: [
            { defect: 'Variación de tono Pantone', count: 3 },
            { defect: 'Lectura código 2D', count: 2 },
          ],
          affectedParts: [{ part: 'ET-FRES-301', count: 5 }],
        },
        {
          id: 'cli-5',
          name: 'Pentair Water México',
          subtitle: 'Equipos Hidráulicos',
          ncCount: 4,
          totalPercent: 9,
          trend: 'down',
          trendVal: '↓ 1 evento',
          topDefects: [{ defect: 'Corte guillotina', count: 4 }],
          affectedParts: [{ part: 'FOL-PENT-08', count: 4 }],
        },
      ],
      partes: [
        {
          id: 'part-1',
          name: '526412 | G |',
          subtitle: 'Panasonic · Etiqueta BoPP Blanco',
          ncCount: 6,
          totalPercent: 24,
          trend: 'up',
          trendVal: '↑ 2',
          topDefects: [
            { defect: 'Descalce de registro', count: 4 },
            { defect: 'Desglose troquel', count: 2 },
          ],
        },
        {
          id: 'part-2',
          name: 'NA472050',
          subtitle: 'BLACK & DECKER · Instructivo Doblado',
          ncCount: 5,
          totalPercent: 20,
          trend: 'down',
          trendVal: '↓ 1',
          topDefects: [
            { defect: 'Salto de estación refile', count: 3 },
            { defect: 'Revisión arte', count: 2 },
          ],
        },
        {
          id: 'part-3',
          name: 'IS-2420',
          subtitle: 'TYCO · Etiqueta Poliéster Térmico',
          ncCount: 4,
          totalPercent: 16,
          trend: 'neutral',
          trendVal: '→',
          topDefects: [{ defect: 'Desgaste filo suaje', count: 4 }],
        },
        {
          id: 'part-4',
          name: 'ET-FRES-301',
          subtitle: 'Fresenius · Etiqueta Grado Médico',
          ncCount: 3,
          totalPercent: 12,
          trend: 'up',
          trendVal: '↑ 1',
          topDefects: [{ defect: 'ΔE fuera de tolerancia', count: 3 }],
        },
      ],
      procesos: [
        {
          id: 'proc-1',
          name: 'Offset Plano',
          subtitle: 'Heidelberg Speedmaster SM 74',
          ncCount: 6,
          totalPercent: 54,
          trend: 'up',
          trendVal: '↑ 2',
          topDefects: [
            { defect: 'Revisión de arte incorrecta', count: 3 },
            { defect: 'Dimensiones corte pliego', count: 3 },
          ],
        },
        {
          id: 'proc-2',
          name: 'Flexografía Rotativa',
          subtitle: 'Mark Andy Scout 10" / 2200',
          ncCount: 3,
          totalPercent: 27,
          trend: 'down',
          trendVal: '↓ 1',
          topDefects: [{ defect: 'Registro de color en cambio de rollo', count: 3 }],
        },
        {
          id: 'proc-3',
          name: 'Acabados & Plegado',
          subtitle: 'Stahlfolder Ti-52 / Guillotina',
          ncCount: 2,
          totalPercent: 19,
          trend: 'neutral',
          trendVal: '→',
          topDefects: [{ defect: 'Desfase en doblez 16p', count: 2 }],
        },
      ],
      lineas: [
        {
          id: 'lin-1',
          name: 'Heidelberg SM 74',
          subtitle: 'Prensa Offset 4 colores',
          ncCount: 5,
          totalPercent: 45,
          trend: 'up',
          trendVal: '↑ 2',
        },
        {
          id: 'lin-2',
          name: 'Mark Andy Scout 10"',
          subtitle: 'Flexografía 6 tintas UV',
          ncCount: 3,
          totalPercent: 27,
          trend: 'down',
          trendVal: '↓ 1',
        },
        {
          id: 'lin-3',
          name: 'Plegadora Stahl TH-82',
          subtitle: 'Doblado continuo',
          ncCount: 2,
          totalPercent: 18,
          trend: 'neutral',
          trendVal: '→',
        },
        {
          id: 'lin-4',
          name: 'Rotoflex Inspección',
          subtitle: 'Rebobinado y conteo',
          ncCount: 1,
          totalPercent: 10,
          trend: 'down',
          trendVal: '↓ 1',
        },
      ],
      defectos: [
        {
          id: 'def-1',
          name: 'Registro / Color',
          subtitle: 'Descalce entre estaciones o ΔE',
          ncCount: 14,
          totalPercent: 31,
          trend: 'up',
          trendVal: '↑ 3',
        },
        {
          id: 'def-2',
          name: 'Revisión incorrecta',
          subtitle: 'Arte desactualizado vs máster',
          ncCount: 10,
          totalPercent: 23,
          trend: 'up',
          trendVal: '↑ 2',
        },
        {
          id: 'def-3',
          name: 'Troquelado',
          subtitle: 'Kiss-cut irregular o filo mellado',
          ncCount: 8,
          totalPercent: 17,
          trend: 'neutral',
          trendVal: '→',
        },
        {
          id: 'def-4',
          name: 'Dimensional',
          subtitle: 'Ancho/largo fuera de ±0.5 mm',
          ncCount: 6,
          totalPercent: 13,
          trend: 'down',
          trendVal: '↓ 1',
        },
        {
          id: 'def-5',
          name: 'Empaque / Identificación',
          subtitle: 'Falta de etiqueta Zebra o fleje',
          ncCount: 4,
          totalPercent: 9,
          trend: 'down',
          trendVal: '↓ 2',
        },
        {
          id: 'def-6',
          name: 'Otros',
          subtitle: 'Defectos menores aislados',
          ncCount: 3,
          totalPercent: 7,
          trend: 'neutral',
          trendVal: '→',
        },
      ],
    },
    pareto: [
      { defect: 'Registro / Color', count: 14, percent: 31, cumulativePercent: 31, diffVsPrev: '+3 vs mes anterior' },
      { defect: 'Revisión incorrecta', count: 10, percent: 23, cumulativePercent: 54, diffVsPrev: '+2 vs mes anterior' },
      { defect: 'Troquelado', count: 8, percent: 17, cumulativePercent: 71, diffVsPrev: '-1 vs mes anterior' },
      { defect: 'Dimensional / Corte', count: 6, percent: 13, cumulativePercent: 84, diffVsPrev: '-2 vs mes anterior' },
      { defect: 'Empaque / Conteo', count: 4, percent: 9, cumulativePercent: 93, diffVsPrev: '-1 vs mes anterior' },
      { defect: 'Otros menores', count: 3, percent: 7, cumulativePercent: 100, diffVsPrev: '→ sin cambio' },
    ],
    trend: [
      { label: 'Semana 1', date: '08-14 Ago', conformityPercent: 92.1, ncCount: 5, avgReleaseMinutes: 23 },
      { label: 'Semana 2', date: '15-21 Ago', conformityPercent: 94.0, ncCount: 3, avgReleaseMinutes: 19 },
      { label: 'Semana 3', date: '22-28 Ago', conformityPercent: 95.8, ncCount: 2, avgReleaseMinutes: 17 },
      { label: 'Semana 4', date: '29 Ago - 07 Sep', conformityPercent: 96.4, ncCount: 1, avgReleaseMinutes: 16 },
    ],
    processes: [
      { process: 'Flexografía', area: 'Rotativa', auditsCount: 68, conformityPercent: 96.2, ncCount: 3, avgReleaseMinutes: 14, trend: 'up' },
      { process: 'Offset', area: 'Plana', auditsCount: 55, conformityPercent: 91.8, ncCount: 6, avgReleaseMinutes: 21, trend: 'down' },
      { process: 'Acabados', area: 'Plegado/Grapado', auditsCount: 38, conformityPercent: 94.7, ncCount: 2, avgReleaseMinutes: 17, trend: 'neutral' },
      { process: 'Serigrafía', area: 'Especial', auditsCount: 23, conformityPercent: 95.6, ncCount: 1, avgReleaseMinutes: 16, trend: 'up' },
    ],
    heatmap: [
      { defect: 'Color / Densidad', counts: { 'Impresión': 12, 'Corte': 0, 'Doblado': 0, 'Troquel': 0, 'Rebobinado': 0 } },
      { defect: 'Dimensión / Escuadra', counts: { 'Impresión': 2, 'Corte': 8, 'Doblado': 3, 'Troquel': 5, 'Rebobinado': 1 } },
      { defect: 'Revisión / Arte', counts: { 'Impresión': 6, 'Corte': 1, 'Doblado': 0, 'Troquel': 2, 'Rebobinado': 0 } },
      { defect: 'Registro de Colores', counts: { 'Impresión': 9, 'Corte': 0, 'Doblado': 0, 'Troquel': 4, 'Rebobinado': 0 } },
      { defect: 'Empaque / Conteo', counts: { 'Impresión': 0, 'Corte': 0, 'Doblado': 0, 'Troquel': 0, 'Rebobinado': 6 } },
    ],
    reincidencias: [
      {
        id: 'reinc-1',
        title: 'Registro de color en Flexo',
        eventsCount: 8,
        opsCount: 4,
        clientsCount: 3,
        subtitle: '8 eventos en 30 días · 4 OP afectadas · Mayor concentración en cambios de empalme.',
        icarId: 'ICAR-2026-031',
        deviationId: 'DEV-2026-082',
        actionLabel: 'Ver análisis 4M',
        actionType: 'analysis',
      },
      {
        id: 'reinc-2',
        title: 'Revisión incorrecta de arte en Offset',
        eventsCount: 5,
        opsCount: 3,
        clientsCount: 2,
        subtitle: '5 eventos · misma parte NA472050 en 3 ocasiones · Tercera reincidencia consecutiva.',
        icarId: 'ICAR-2026-033',
        actionLabel: 'Abrir ICAR',
        actionType: 'icar',
      },
      {
        id: 'reinc-3',
        title: 'Dimensión fuera de tolerancia en Guillotina 2',
        eventsCount: 4,
        opsCount: 3,
        clientsCount: 2,
        subtitle: '4 eventos en Acabados · +37% vs periodo anterior · Cuchilla con 80,000 golpes.',
        actionLabel: 'Analizar Causa',
        actionType: 'audit',
      },
    ],
    suggestions: [
      {
        id: 'sug-1',
        title: 'Registro de color aumentó 37% en Flexografía',
        reason:
          '4 de los 7 casos recientes ocurrieron inmediatamente después de un cambio de bobina en Mark Andy Scout. El sistema sugiere verificar el freno magnético del desbobinador y calibración de tacómetro.',
        impactNote: 'Ahorro potencial: 180 m de sustrato por turno',
        targetFilter: { area: 'Flexografía', process: 'Flexografía' },
        primaryActionLabel: 'Filtrar Flexografía',
        primaryActionType: 'filter-area',
        secondaryActionLabel: 'Ver Pareto',
        secondaryActionType: 'view-pareto',
      },
      {
        id: 'sug-2',
        title: 'Offset concentra 54% de las No Conformidades del periodo',
        reason:
          'La mayor recurrencia está en revisión incorrecta de arte y dimensiones de corte de pliego en guillotinado previo al doblado. Se recomienda implementar gate CTP estricto antes de quemar placas.',
        impactNote: 'Impacto: 6 OPs involucradas',
        targetFilter: { area: 'Offset', process: 'Offset' },
        primaryActionLabel: 'Filtrar Offset',
        primaryActionType: 'filter-area',
        secondaryActionLabel: 'Ver Plan de Control',
        secondaryActionType: 'view-plan',
      },
      {
        id: 'sug-3',
        title: 'Liberaciones de la línea Conserver 3–4 promedian 28 min',
        reason:
          '10 min por encima del promedio general de planta (< 20 min). La principal demora se registra en la prueba de anclaje de tinta y curado UV con cinta ASTM D3359.',
        impactNote: 'Objetivo de planta: < 20 min',
        primaryActionLabel: 'Ver Auditorías',
        primaryActionType: 'view-audits',
        secondaryActionLabel: 'Abrir ICAR',
        secondaryActionType: 'open-icar',
      },
      {
        id: 'sug-4',
        title: '2 controles fuera de rango utilizaron el higrómetro QA-HG-004',
        reason:
          'El instrumento presenta lecturas atípicas de humedad (+12% vs patrón). Se aconseja verificación metrológica en laboratorio antes de la ronda ambiental de las 15:00.',
        impactNote: 'Metrología: Calibración preventiva sugerida',
        primaryActionLabel: 'Ver Capturas',
        primaryActionType: 'view-audits',
      },
      {
        id: 'sug-5',
        title: 'Panasonic presenta 3 reincidencias sobre la parte 526412 | G |',
        reason:
          'Conviene auditar el Plan de Control y la prueba de desmalle de primera pieza en la Mark Andy Scout para evitar retenciones de material en cuarentena.',
        impactNote: 'Cliente crítico B2B',
        targetFilter: { client: 'Panasonic Industrial' },
        primaryActionLabel: 'Filtrar Panasonic',
        primaryActionType: 'filter-client',
        secondaryActionLabel: 'Ver Plan de Control',
        secondaryActionType: 'view-plan',
      },
    ],
  },
  '7d': {
    kpis: {
      auditCompliancePercent: 96.2,
      auditComplianceDiff: '↑ 1.4 pts vs semana ant.',
      auditsExecuted: 44,
      conformingAudits: 42,
      nonConformances: 2,
      nonConformancesDiff: '↓ 2 vs semana ant.',
      holdItemsCount: 1,
      holdPiecesCount: 4500,
      deviationsCount: 2,
      deviationsRequireAction: 1,
      avgReleaseMinutes: 16,
      avgReleaseDiff: 'objetivo < 20 min',
    },
    incidence: {
      clientes: [
        {
          id: 'cli-1',
          name: 'Panasonic Industrial',
          subtitle: 'División Electrónica',
          ncCount: 3,
          totalPercent: 40,
          trend: 'down',
          trendVal: '↓ 1',
          topDefects: [{ defect: 'Registro de color', count: 2 }, { defect: 'Troquel', count: 1 }],
          affectedParts: [{ part: '526412 | G |', count: 2 }],
        },
        {
          id: 'cli-2',
          name: 'BLACK & DECKER',
          subtitle: 'Herramientas Eléctricas',
          ncCount: 2,
          totalPercent: 30,
          trend: 'down',
          trendVal: '↓ 2',
          topDefects: [{ defect: 'Dimensional', count: 2 }],
          affectedParts: [{ part: 'NA472050', count: 2 }],
        },
      ],
      partes: [
        { id: 'part-1', name: '526412 | G |', subtitle: 'Panasonic', ncCount: 2, totalPercent: 50, trend: 'neutral', trendVal: '→' },
        { id: 'part-2', name: 'NA472050', subtitle: 'B&D', ncCount: 2, totalPercent: 50, trend: 'down', trendVal: '↓ 1' },
      ],
      procesos: [
        { id: 'proc-1', name: 'Offset Plano', subtitle: 'Heidelberg', ncCount: 2, totalPercent: 60, trend: 'down', trendVal: '↓ 1' },
        { id: 'proc-2', name: 'Flexografía', subtitle: 'Mark Andy', ncCount: 1, totalPercent: 40, trend: 'down', trendVal: '↓ 1' },
      ],
      lineas: [
        { id: 'lin-1', name: 'Heidelberg SM 74', ncCount: 2, totalPercent: 66, trend: 'down', trendVal: '↓ 1' },
        { id: 'lin-2', name: 'Mark Andy Scout', ncCount: 1, totalPercent: 34, trend: 'down', trendVal: '↓ 1' },
      ],
      defectos: [
        { id: 'def-1', name: 'Registro / Color', ncCount: 2, totalPercent: 40, trend: 'down', trendVal: '↓ 1' },
        { id: 'def-2', name: 'Dimensional', ncCount: 2, totalPercent: 40, trend: 'down', trendVal: '↓ 1' },
        { id: 'def-3', name: 'Troquelado', ncCount: 1, totalPercent: 20, trend: 'neutral', trendVal: '→' },
      ],
    },
    pareto: [
      { defect: 'Registro / Color', count: 2, percent: 40, cumulativePercent: 40, diffVsPrev: '-1' },
      { defect: 'Dimensional / Corte', count: 2, percent: 40, cumulativePercent: 80, diffVsPrev: '-1' },
      { defect: 'Troquelado', count: 1, percent: 20, cumulativePercent: 100, diffVsPrev: '→' },
    ],
    trend: [
      { label: 'Lun 01', date: '01 Sep', conformityPercent: 95.0, ncCount: 1, avgReleaseMinutes: 18 },
      { label: 'Mar 02', date: '02 Sep', conformityPercent: 97.5, ncCount: 0, avgReleaseMinutes: 15 },
      { label: 'Mié 03', date: '03 Sep', conformityPercent: 96.0, ncCount: 1, avgReleaseMinutes: 16 },
      { label: 'Jue 04', date: '04 Sep', conformityPercent: 98.0, ncCount: 0, avgReleaseMinutes: 14 },
      { label: 'Vie 05', date: '05 Sep', conformityPercent: 96.5, ncCount: 0, avgReleaseMinutes: 15 },
      { label: 'Sáb 06', date: '06 Sep', conformityPercent: 95.5, ncCount: 0, avgReleaseMinutes: 16 },
      { label: 'Dom 07', date: '07 Sep', conformityPercent: 98.5, ncCount: 0, avgReleaseMinutes: 14 },
    ],
    processes: [
      { process: 'Flexografía', area: 'Rotativa', auditsCount: 18, conformityPercent: 97.2, ncCount: 1, avgReleaseMinutes: 13, trend: 'up' },
      { process: 'Offset', area: 'Plana', auditsCount: 14, conformityPercent: 94.5, ncCount: 1, avgReleaseMinutes: 18, trend: 'up' },
      { process: 'Acabados', area: 'Plegado', auditsCount: 8, conformityPercent: 96.0, ncCount: 0, avgReleaseMinutes: 15, trend: 'up' },
      { process: 'Serigrafía', area: 'Especial', auditsCount: 4, conformityPercent: 100, ncCount: 0, avgReleaseMinutes: 14, trend: 'up' },
    ],
    heatmap: [
      { defect: 'Color / Densidad', counts: { 'Impresión': 2, 'Corte': 0, 'Doblado': 0, 'Troquel': 0, 'Rebobinado': 0 } },
      { defect: 'Dimensión / Escuadra', counts: { 'Impresión': 0, 'Corte': 2, 'Doblado': 0, 'Troquel': 1, 'Rebobinado': 0 } },
    ],
    reincidencias: [
      {
        id: 'reinc-7d-1',
        title: 'Registro en Mark Andy Scout',
        eventsCount: 2,
        opsCount: 2,
        clientsCount: 1,
        subtitle: '2 eventos esta semana en tiraje inicial.',
        actionLabel: 'Ver detalle',
        actionType: 'analysis',
      },
    ],
    suggestions: [
      {
        id: 'sug-7d-1',
        title: 'Semana con tendencia favorable (96.2% conformidad)',
        reason: 'Solo 2 eventos registrados en los últimos 7 días. Ambos fueron contenidos en primera pieza sin material fugado a cliente.',
        primaryActionLabel: 'Ver Auditorías',
        primaryActionType: 'view-audits',
      },
    ],
  },
  '60d': {
    kpis: {
      auditCompliancePercent: 94.1,
      auditComplianceDiff: '↑ 1.1 pts vs bim. ant.',
      auditsExecuted: 362,
      conformingAudits: 339,
      nonConformances: 23,
      nonConformancesDiff: '↓ 5 vs bim. ant.',
      holdItemsCount: 6,
      holdPiecesCount: 28900,
      deviationsCount: 14,
      deviationsRequireAction: 5,
      avgReleaseMinutes: 19,
      avgReleaseDiff: 'objetivo < 20 min',
    },
    incidence: {
      clientes: [
        { id: 'cli-60-1', name: 'Panasonic Industrial', ncCount: 22, totalPercent: 29, trend: 'up', trendVal: '↑ 5' },
        { id: 'cli-60-2', name: 'BLACK & DECKER', ncCount: 18, totalPercent: 23, trend: 'neutral', trendVal: '→' },
        { id: 'cli-60-3', name: 'TYCO Electronics', ncCount: 14, totalPercent: 18, trend: 'down', trendVal: '↓ 2' },
        { id: 'cli-60-4', name: 'Fresenius Medical', ncCount: 11, totalPercent: 14, trend: 'up', trendVal: '↑ 3' },
      ],
      partes: [
        { id: 'p-60-1', name: '526412 | G |', ncCount: 11, totalPercent: 26, trend: 'up', trendVal: '↑ 3' },
        { id: 'p-60-2', name: 'NA472050', ncCount: 9, totalPercent: 21, trend: 'neutral', trendVal: '→' },
      ],
      procesos: [
        { id: 'pr-60-1', name: 'Offset', ncCount: 13, totalPercent: 52, trend: 'up', trendVal: '↑ 3' },
        { id: 'pr-60-2', name: 'Flexografía', ncCount: 8, totalPercent: 32, trend: 'down', trendVal: '↓ 1' },
      ],
      lineas: [
        { id: 'l-60-1', name: 'Heidelberg SM 74', ncCount: 11, totalPercent: 48, trend: 'up', trendVal: '↑ 3' },
        { id: 'l-60-2', name: 'Mark Andy Scout', ncCount: 7, totalPercent: 30, trend: 'neutral', trendVal: '→' },
      ],
      defectos: [
        { id: 'd-60-1', name: 'Registro / Color', ncCount: 26, totalPercent: 32, trend: 'up', trendVal: '↑ 4' },
        { id: 'd-60-2', name: 'Revisión incorrecta', ncCount: 18, totalPercent: 22, trend: 'up', trendVal: '↑ 2' },
      ],
    },
    pareto: [
      { defect: 'Registro / Color', count: 26, percent: 32, cumulativePercent: 32, diffVsPrev: '+4' },
      { defect: 'Revisión incorrecta', count: 18, percent: 22, cumulativePercent: 54, diffVsPrev: '+2' },
      { defect: 'Troquelado', count: 15, percent: 18, cumulativePercent: 72, diffVsPrev: '-2' },
      { defect: 'Dimensional / Corte', count: 12, percent: 15, cumulativePercent: 87, diffVsPrev: '-3' },
      { defect: 'Otros', count: 10, percent: 13, cumulativePercent: 100, diffVsPrev: '-1' },
    ],
    trend: [
      { label: 'Quincena 1', date: '01-15 Jul', conformityPercent: 91.5, ncCount: 8, avgReleaseMinutes: 24 },
      { label: 'Quincena 2', date: '16-31 Jul', conformityPercent: 93.2, ncCount: 6, avgReleaseMinutes: 21 },
      { label: 'Quincena 3', date: '01-15 Ago', conformityPercent: 94.8, ncCount: 5, avgReleaseMinutes: 18 },
      { label: 'Quincena 4', date: '16 Ago - 07 Sep', conformityPercent: 96.1, ncCount: 4, avgReleaseMinutes: 16 },
    ],
    processes: [
      { process: 'Flexografía', area: 'Rotativa', auditsCount: 135, conformityPercent: 95.8, ncCount: 7, avgReleaseMinutes: 15, trend: 'up' },
      { process: 'Offset', area: 'Plana', auditsCount: 110, conformityPercent: 91.2, ncCount: 12, avgReleaseMinutes: 22, trend: 'down' },
      { process: 'Acabados', area: 'Plegado', auditsCount: 75, conformityPercent: 94.2, ncCount: 4, avgReleaseMinutes: 18, trend: 'neutral' },
    ],
    heatmap: [
      { defect: 'Color / Densidad', counts: { 'Impresión': 22, 'Corte': 0, 'Doblado': 0, 'Troquel': 0, 'Rebobinado': 0 } },
      { defect: 'Dimensión / Escuadra', counts: { 'Impresión': 4, 'Corte': 14, 'Doblado': 5, 'Troquel': 9, 'Rebobinado': 2 } },
    ],
    reincidencias: [
      {
        id: 'reinc-60-1',
        title: 'Registro de color en Flexo (Bimestral)',
        eventsCount: 15,
        opsCount: 7,
        clientsCount: 4,
        subtitle: '15 eventos en 60 días · Plan de acción ICAR-2026-019 en ejecución.',
        icarId: 'ICAR-2026-019',
        actionLabel: 'Ver ICAR',
        actionType: 'icar',
      },
    ],
    suggestions: [
      {
        id: 'sug-60-1',
        title: 'Mejora sostenida de 4.6 pts en conformidad a 60 días',
        reason: 'El índice de liberación conforme subió de 91.5% a 96.1% gracias a la contención en primeras piezas de Alicia Ramírez.',
        primaryActionLabel: 'Ver Tendencia',
        primaryActionType: 'view-pareto',
      },
    ],
  },
  '90d': {
    kpis: {
      auditCompliancePercent: 93.6,
      auditComplianceDiff: '↑ 2.8 pts vs trim. ant.',
      auditsExecuted: 540,
      conformingAudits: 504,
      nonConformances: 36,
      nonConformancesDiff: '↓ 8 vs trim. ant.',
      holdItemsCount: 8,
      holdPiecesCount: 41200,
      deviationsCount: 21,
      deviationsRequireAction: 7,
      avgReleaseMinutes: 20,
      avgReleaseDiff: 'en límite objetivo',
    },
    incidence: {
      clientes: [
        { id: 'cli-90-1', name: 'Panasonic Industrial', ncCount: 32, totalPercent: 30, trend: 'up', trendVal: '↑ 7' },
        { id: 'cli-90-2', name: 'BLACK & DECKER', ncCount: 25, totalPercent: 23, trend: 'neutral', trendVal: '→' },
        { id: 'cli-90-3', name: 'TYCO Electronics', ncCount: 20, totalPercent: 19, trend: 'down', trendVal: '↓ 3' },
      ],
      partes: [
        { id: 'p-90-1', name: '526412 | G |', ncCount: 16, totalPercent: 28, trend: 'up', trendVal: '↑ 4' },
      ],
      procesos: [
        { id: 'pr-90-1', name: 'Offset', ncCount: 20, totalPercent: 55, trend: 'up', trendVal: '↑ 4' },
      ],
      lineas: [
        { id: 'l-90-1', name: 'Heidelberg SM 74', ncCount: 17, totalPercent: 50, trend: 'up', trendVal: '↑ 4' },
      ],
      defectos: [
        { id: 'd-90-1', name: 'Registro / Color', ncCount: 38, totalPercent: 33, trend: 'up', trendVal: '↑ 6' },
      ],
    },
    pareto: [
      { defect: 'Registro / Color', count: 38, percent: 33, cumulativePercent: 33, diffVsPrev: '+6' },
      { defect: 'Revisión incorrecta', count: 26, percent: 23, cumulativePercent: 56, diffVsPrev: '+3' },
      { defect: 'Troquelado', count: 21, percent: 18, cumulativePercent: 74, diffVsPrev: '-2' },
      { defect: 'Dimensional / Corte', count: 17, percent: 15, cumulativePercent: 89, diffVsPrev: '-4' },
      { defect: 'Otros', count: 13, percent: 11, cumulativePercent: 100, diffVsPrev: '-3' },
    ],
    trend: [
      { label: 'Mes 1 (Jun)', date: 'Junio 2026', conformityPercent: 90.8, ncCount: 15, avgReleaseMinutes: 25 },
      { label: 'Mes 2 (Jul)', date: 'Julio 2026', conformityPercent: 93.4, ncCount: 12, avgReleaseMinutes: 20 },
      { label: 'Mes 3 (Ago)', date: 'Agosto 2026', conformityPercent: 95.8, ncCount: 9, avgReleaseMinutes: 17 },
    ],
    processes: [
      { process: 'Flexografía', area: 'Rotativa', auditsCount: 202, conformityPercent: 95.2, ncCount: 11, avgReleaseMinutes: 16, trend: 'up' },
      { process: 'Offset', area: 'Plana', auditsCount: 165, conformityPercent: 90.5, ncCount: 18, avgReleaseMinutes: 23, trend: 'down' },
      { process: 'Acabados', area: 'Plegado', auditsCount: 112, conformityPercent: 93.8, ncCount: 7, avgReleaseMinutes: 19, trend: 'neutral' },
    ],
    heatmap: [
      { defect: 'Color / Densidad', counts: { 'Impresión': 34, 'Corte': 0, 'Doblado': 0, 'Troquel': 0, 'Rebobinado': 0 } },
      { defect: 'Dimensión / Escuadra', counts: { 'Impresión': 6, 'Corte': 21, 'Doblado': 8, 'Troquel': 14, 'Rebobinado': 3 } },
    ],
    reincidencias: [
      {
        id: 'reinc-90-1',
        title: 'Registro de color acumulado trimestral',
        eventsCount: 22,
        opsCount: 11,
        clientsCount: 5,
        subtitle: '22 eventos en 90 días · Tendencia a la baja tras ajuste de racletas.',
        actionLabel: 'Ver ICAR',
        actionType: 'icar',
      },
    ],
    suggestions: [
      {
        id: 'sug-90-1',
        title: 'Reducción de 40% en NCs de Acabados a lo largo del trimestre',
        reason: 'El mantenimiento preventivo a guillotinas de corte redujo significativamente el desgarre de pliego.',
        primaryActionLabel: 'Ver Desempeño',
        primaryActionType: 'view-pareto',
      },
    ],
  },
  'custom': {
    kpis: {
      auditCompliancePercent: 95.0,
      auditComplianceDiff: 'Rango personalizado',
      auditsExecuted: 120,
      conformingAudits: 114,
      nonConformances: 6,
      nonConformancesDiff: 'Período custom',
      holdItemsCount: 2,
      holdPiecesCount: 8200,
      deviationsCount: 4,
      deviationsRequireAction: 2,
      avgReleaseMinutes: 17,
      avgReleaseDiff: 'objetivo < 20 min',
    },
    incidence: {
      clientes: [
        { id: 'cli-c-1', name: 'Panasonic Industrial', ncCount: 4, totalPercent: 40, trend: 'neutral', trendVal: '→' },
        { id: 'cli-c-2', name: 'BLACK & DECKER', ncCount: 3, totalPercent: 30, trend: 'down', trendVal: '↓ 1' },
      ],
      partes: [{ id: 'p-c-1', name: '526412 | G |', ncCount: 3, totalPercent: 50, trend: 'neutral', trendVal: '→' }],
      procesos: [{ id: 'pr-c-1', name: 'Offset', ncCount: 4, totalPercent: 66, trend: 'neutral', trendVal: '→' }],
      lineas: [{ id: 'l-c-1', name: 'Heidelberg SM 74', ncCount: 4, totalPercent: 66, trend: 'neutral', trendVal: '→' }],
      defectos: [{ id: 'd-c-1', name: 'Registro / Color', ncCount: 4, totalPercent: 50, trend: 'neutral', trendVal: '→' }],
    },
    pareto: [
      { defect: 'Registro / Color', count: 4, percent: 50, cumulativePercent: 50, diffVsPrev: '→' },
      { defect: 'Revisión incorrecta', count: 2, percent: 25, cumulativePercent: 75, diffVsPrev: '→' },
      { defect: 'Otros', count: 2, percent: 25, cumulativePercent: 100, diffVsPrev: '→' },
    ],
    trend: [
      { label: 'Semana A', date: 'Período 1', conformityPercent: 94.0, ncCount: 3, avgReleaseMinutes: 18 },
      { label: 'Semana B', date: 'Período 2', conformityPercent: 96.0, ncCount: 3, avgReleaseMinutes: 16 },
    ],
    processes: [
      { process: 'Flexografía', area: 'Rotativa', auditsCount: 45, conformityPercent: 96.0, ncCount: 2, avgReleaseMinutes: 14, trend: 'neutral' },
      { process: 'Offset', area: 'Plana', auditsCount: 40, conformityPercent: 93.0, ncCount: 3, avgReleaseMinutes: 19, trend: 'neutral' },
    ],
    heatmap: [
      { defect: 'Color / Densidad', counts: { 'Impresión': 4, 'Corte': 0, 'Doblado': 0, 'Troquel': 0, 'Rebobinado': 0 } },
    ],
    reincidencias: [
      {
        id: 'reinc-c-1',
        title: 'Registro de color en periodo custom',
        eventsCount: 4,
        opsCount: 2,
        clientsCount: 2,
        subtitle: '4 eventos en el intervalo personalizado seleccionado.',
        actionLabel: 'Ver detalle',
        actionType: 'analysis',
      },
    ],
    suggestions: [
      {
        id: 'sug-c-1',
        title: 'Filtro personalizado aplicado',
        reason: 'Mostrando métricas ajustadas al intervalo personalizado seleccionado por el usuario.',
        primaryActionLabel: 'Restablecer 30 días',
        primaryActionType: 'filter-area',
      },
    ],
  },
};
