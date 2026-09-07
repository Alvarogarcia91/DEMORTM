// ============================================================================
// MODELO DE DATOS Y SELECTORES CRM COMERCIAL V2 ENTERPRISE
// ============================================================================

export type CrmTab =
  | 'dashboard'
  | 'today'
  | 'prospects'
  | 'opportunities'
  | 'pipeline'
  | 'accounts'
  | 'activities'
  | 'analytics';

export type CrmStage =
  | 'Calificado'
  | 'Levantamiento'
  | 'Cotización'
  | 'Negociación'
  | 'Ganada'
  | 'Perdida';

export type CrmRisk = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

export type CrmLine = 'Offset' | 'Flexografía' | 'Serigrafía' | 'Acabados / conversión';

export type CrmPeriod =
  | 'Hoy'
  | '7 días'
  | '30 días'
  | '60 días'
  | '90 días'
  | '6 meses'
  | '12 meses'
  | '7d'
  | '30d'
  | '60d'
  | '90d'
  | '6m'
  | '12m';

export interface CrmOpportunity {
  id: string;
  folio: string;
  account: string;
  customerId?: string;
  title: string;
  line: CrmLine;
  stage: CrmStage;
  amount: number;
  probability: number;
  close: string;
  estimatedCloseDate?: string;
  seller: string;
  next: string;
  nextAction?: string;
  nextActionDate?: string;
  days: number;
  daysInStage?: number;
  risk: CrmRisk;
  quote?: string;
  quoteId?: string;
  quoteFolio?: string;
  order?: string;
  orderFolio?: string;
  lostReason?: string;
  lossReason?: string;
  createdAt?: string;
  notes?: string;
  currency?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface CrmProspect {
  id: string;
  folio?: string;
  company: string;
  contact: string;
  contactName?: string;
  email: string;
  phone?: string;
  industry: string;
  source: 'Referido' | 'Sitio web' | 'Prospección' | 'Evento / feria' | 'Cliente existente';
  interest: string;
  line: CrmLine;
  seller: string;
  score: number;
  scoreReasons?: string[];
  scoreFactors?: string[];
  last: string;
  lastContactDate?: string;
  next: string;
  nextFollowUp?: string;
  status: 'Nuevo' | 'Contactado' | 'En calificación' | 'En contacto' | 'Calificado' | 'Convertido' | 'Descartado';
  notes?: string;
  createdAt?: string;
}

export interface CrmActivity {
  id: string;
  type: 'Llamada' | 'Correo' | 'Reunión' | 'Visita' | 'Seguimiento' | 'Tarea' | 'Reunión / Visita técnica' | 'Levantamiento' | 'Seguimiento de cotización';
  account: string;
  opportunityFolio?: string;
  subject: string;
  when: string;
  scheduledDate?: string;
  time?: string;
  owner: string;
  seller?: string;
  status: 'Hoy' | 'Vencida' | 'Próxima' | 'Completada' | 'Pendiente';
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  notes?: string;
}

export interface CrmSmartSuggestion {
  id: string;
  category: 'recovery' | 'cross-sell' | 'stale-quote' | 'credit-risk' | 'forecast-gap' | 'seller-balance';
  title: string;
  reason: string;
  recommendation: string;
  impactNote: string;
  primaryActionLabel: string;
  targetTab: CrmTab;
  targetPayload?: string;
  secondaryActionLabel?: string;
}

export interface CrmKpis {
  openPipeline: number;
  openPipelineDelta: number;
  weightedPipeline: number;
  weightedPipelineDelta: number;
  forecastAmount: number;
  wonAmount: number;
  wonAmountDelta: number;
  winRate: number;
  winRateDelta: number;
  riskCount: number;
  riskAmount: number;
  overdueActivitiesCount: number;
  avgCycleDays: number;
  avgTicket: number;
  pipelineVelocity: number;
  leadConversionRate: number;
  oppToWonConversionRate: number;
  stalledCount: number;
}

// ----------------------------------------------------------------------------
// SEEDS INICIALES COHERENTES
// ----------------------------------------------------------------------------

export const INITIAL_PROSPECTS: CrmProspect[] = [
  {
    id: 'lead-01',
    company: 'ENTAIL',
    contact: 'Mariana Ríos',
    email: 'mrios@entail-demo.com',
    phone: '+52 (81) 8290-1120',
    industry: 'Manufactura electrónica',
    source: 'Referido',
    interest: 'Manuales de ensamble y tags',
    line: 'Offset',
    seller: 'Lucía Torres',
    score: 86,
    scoreReasons: ['Cliente industrial objetivo (+30)', 'Contacto tomador de decisión (+25)', 'Interés definido en Offset (+20)', 'Actividad reciente (+11)'],
    last: '06 Sep',
    next: '08 Sep',
    status: 'En calificación',
    notes: 'Requieren 25,000 manuales técnicos con plegado especial.',
  },
  {
    id: 'lead-02',
    company: 'ILSCO',
    contact: 'Daniel Vázquez',
    email: 'dvazquez@ilsco-demo.com',
    phone: '+52 (81) 8150-4490',
    industry: 'Componentes eléctricos',
    source: 'Sitio web',
    interest: 'Etiquetas autoadheribles',
    line: 'Flexografía',
    seller: 'Marco Salinas',
    score: 74,
    scoreReasons: ['Perfil B2B compatible (+25)', 'Interés recurrente (+20)', 'Validación técnica en curso (+15)', 'Lead web calificado (+14)'],
    last: '05 Sep',
    next: '09 Sep',
    status: 'Contactado',
    notes: 'Interesados en bobinas de etiquetas con laminado mate para intemperie.',
  },
  {
    id: 'lead-03',
    company: 'INVACARE',
    contact: 'Patricia Soto',
    email: 'psoto@invacare-demo.com',
    phone: '+52 (81) 8345-9922',
    industry: 'Equipo médico',
    source: 'Evento / feria',
    interest: 'Instructivos bilingües farmacéuticos',
    line: 'Serigrafía',
    seller: 'Lucía Torres',
    score: 91,
    scoreReasons: ['Sector médico regulado (+35)', 'Presupuesto asignado (+25)', 'Reunión de levantamiento agendada (+20)', 'Alta urgencia de entrega (+11)'],
    last: '07 Sep',
    next: '10 Sep',
    status: 'Calificado',
    notes: 'Pliegos en papel biblia con alta densidad de información médica.',
  },
  {
    id: 'lead-04',
    company: 'TYCO',
    contact: 'Jorge Guerra',
    email: 'jguerra@tyco-demo.com',
    phone: '+52 (81) 8901-3344',
    industry: 'Seguridad industrial',
    source: 'Cliente existente',
    interest: 'Etiquetas UL térmicas',
    line: 'Flexografía',
    seller: 'Andrea Peña',
    score: 81,
    scoreReasons: ['Cuenta estratégica con historial (+35)', 'Recompra trimestral (+25)', 'Seguimiento comercial vencido (-10)', 'Volumen alto (+31)'],
    last: '26 Ago',
    next: 'Vencida',
    status: 'En calificación',
    notes: 'Licitación anual de etiquetas de código de barras para tableros de alarma.',
  },
  {
    id: 'lead-05',
    company: 'Panasonic Automotive',
    contact: 'Sofía Leal',
    email: 'sleal@panasonic-demo.com',
    phone: '+52 (81) 8000-2211',
    industry: 'Electrónica y automotriz',
    source: 'Prospección',
    interest: 'Blister cards y empaque plegable',
    line: 'Acabados / conversión',
    seller: 'Marco Salinas',
    score: 68,
    scoreReasons: ['Cuenta Tier 1 automotriz (+30)', 'Prospección directa (+15)', 'Pendiente definir tirajes (+15)', 'Sin respuesta en 8 días (+8)'],
    last: '03 Sep',
    next: '11 Sep',
    status: 'Nuevo',
    notes: 'Proyecto de empaque secundario para arneses y sensores.',
  },
  {
    id: 'lead-06',
    company: 'Fresenius Medical Care',
    contact: 'Carlos Mendiola',
    email: 'cmendiola@fresenius-demo.com',
    phone: '+52 (81) 8770-5500',
    industry: 'Farmacéutica',
    source: 'Referido',
    interest: 'Etiquetas para bolsas de diálisis',
    line: 'Flexografía',
    seller: 'Lucía Torres',
    score: 88,
    scoreReasons: ['Cliente estratégico grado médico (+35)', 'Contacto de compras formal (+25)', 'Requisito de trazabilidad estricta (+15)', 'Alta frecuencia (+13)'],
    last: '04 Sep',
    next: '09 Sep',
    status: 'En calificación',
    notes: 'Sustrato BoPP blanco con adhesivo grado alimenticio/médico.',
  },
  {
    id: 'lead-07',
    company: 'Bissell México',
    contact: 'Ernesto Ramos',
    email: 'eramos@bissell-demo.com',
    phone: '+52 (81) 8111-9988',
    industry: 'Electrodomésticos',
    source: 'Cliente existente',
    interest: 'Manuales de ensamble y cajas plegadizas',
    line: 'Offset',
    seller: 'Marco Salinas',
    score: 84,
    scoreReasons: ['Historial de pago impecable (+30)', 'Campaña Q4 programada (+25)', 'Interés confirmado (+20)', 'Contacto directo (+9)'],
    last: '05 Sep',
    next: '12 Sep',
    status: 'Contactado',
    notes: 'Manuales de 48 páginas engrapados al lomo para aspiradoras.',
  },
];

export const INITIAL_OPPORTUNITIES: CrmOpportunity[] = [
  {
    id: 'opp-41',
    folio: 'OPP-2026-0041',
    account: 'TYCO',
    title: 'Etiquetas UL para línea de seguridad',
    line: 'Flexografía',
    stage: 'Negociación',
    amount: 210000,
    probability: 70,
    close: '12 Sep',
    seller: 'Andrea Peña',
    next: 'Seguimiento vencido',
    days: 12,
    risk: 'Crítico',
    quote: 'COT-2026-0098',
    createdAt: '25 Ago',
    notes: 'Cliente solicitó ajuste de término de pago a 60 días antes de emitir orden de compra.',
  },
  {
    id: 'opp-42',
    folio: 'OPP-2026-0042',
    account: 'BLACK & DECKER',
    customerId: 'cli-001',
    title: 'Manual técnico NA472050',
    line: 'Offset',
    stage: 'Levantamiento',
    amount: 385000,
    probability: 45,
    close: '25 Sep',
    seller: 'Lucía Torres',
    next: 'Visita 09 Sep',
    days: 4,
    risk: 'Bajo',
    createdAt: '01 Sep',
    notes: 'Tiraje de 65,000 instructivos bilingües con prueba de color requerida.',
  },
  {
    id: 'opp-43',
    folio: 'OPP-2026-0043',
    account: 'BISSELL',
    title: 'Blister cards campaña Q4',
    line: 'Acabados / conversión',
    stage: 'Negociación',
    amount: 286000,
    probability: 80,
    close: '15 Sep',
    seller: 'Marco Salinas',
    next: 'Revisión comercial 08 Sep',
    days: 7,
    risk: 'Medio',
    quote: 'COT-2026-0093',
    order: 'PED-2026-0142',
    createdAt: '28 Ago',
    notes: 'Acabado termoformado con barniz termosellante sobre cartulina sulfatada 18 pts.',
  },
  {
    id: 'opp-44',
    folio: 'OPP-2026-0044',
    account: 'TRICO TECHNOLOGIES CORPORATION',
    customerId: 'cli-002',
    title: 'Etiqueta IS-2420 automotriz',
    line: 'Flexografía',
    stage: 'Cotización',
    amount: 178000,
    probability: 60,
    close: '20 Sep',
    seller: 'Andrea Peña',
    next: 'Llamada 08 Sep',
    days: 6,
    risk: 'Alto',
    quote: 'COT-2026-0096',
    createdAt: '30 Ago',
    notes: 'Cotización enviada. Cliente solicitó descuento por volumen de 150,000 unidades.',
  },
  {
    id: 'opp-45',
    folio: 'OPP-2026-0045',
    account: 'INVACARE',
    title: 'Instructivo de uso bilingüe',
    line: 'Offset',
    stage: 'Calificado',
    amount: 142000,
    probability: 30,
    close: '30 Sep',
    seller: 'Lucía Torres',
    next: 'Definir tiraje',
    days: 2,
    risk: 'Bajo',
    createdAt: '05 Sep',
    notes: 'Validando especificación de doblado tipo mapa en máquina Stahlfolder.',
  },
  {
    id: 'opp-46',
    folio: 'OPP-2026-0046',
    account: 'ENTAIL',
    title: 'Tags de identificación industrial',
    line: 'Serigrafía',
    stage: 'Cotización',
    amount: 96000,
    probability: 50,
    close: '18 Sep',
    seller: 'Marco Salinas',
    next: 'Enviar prueba de color',
    days: 9,
    risk: 'Medio',
    quote: 'COT-2026-0101',
    createdAt: '27 Ago',
    notes: 'Sustrato de policarbonato con tintas resistentes a solventes.',
  },
  {
    id: 'opp-47',
    folio: 'OPP-2026-0047',
    account: 'Panasonic Automotive',
    title: 'Etiquetas para empaque electrónico',
    line: 'Flexografía',
    stage: 'Perdida',
    amount: 154000,
    probability: 0,
    close: '28 Ago',
    seller: 'Andrea Peña',
    next: '—',
    days: 0,
    risk: 'Bajo',
    lostReason: 'Precio',
    createdAt: '15 Ago',
    notes: 'Competidor local ofreció 8% menor precio. Oportunidad de reactivación por servicio.',
  },
  {
    id: 'opp-48',
    folio: 'OPP-2026-0048',
    account: 'BLACK & DECKER',
    customerId: 'cli-001',
    title: 'Instructivo NA698298',
    line: 'Offset',
    stage: 'Ganada',
    amount: 324000,
    probability: 100,
    close: '04 Sep',
    seller: 'Lucía Torres',
    next: 'Pedido en producción',
    days: 0,
    risk: 'Bajo',
    quote: 'COT-2026-0089',
    order: 'PED-2026-0148',
    createdAt: '20 Ago',
    notes: 'Ganada. Pedido liberado a taller offset en Heidelberg SM 74.',
  },
  {
    id: 'opp-49',
    folio: 'OPP-2026-0049',
    account: 'ILSCO',
    title: 'Etiquetas de producto terminales',
    line: 'Flexografía',
    stage: 'Ganada',
    amount: 118000,
    probability: 100,
    close: '01 Sep',
    seller: 'Marco Salinas',
    next: 'Pedido liberado',
    days: 0,
    risk: 'Bajo',
    order: 'PED-2026-0139',
    createdAt: '18 Ago',
    notes: 'Cerrado con éxito tras aprobación de muestra de troquel.',
  },
  {
    id: 'opp-50',
    folio: 'OPP-2026-0050',
    account: 'TYCO',
    title: 'Manual de instalación sensores',
    line: 'Offset',
    stage: 'Perdida',
    amount: 89000,
    probability: 0,
    close: '30 Ago',
    seller: 'Andrea Peña',
    next: '—',
    days: 0,
    risk: 'Bajo',
    lostReason: 'Proyecto detenido',
    createdAt: '10 Ago',
    notes: 'Cliente pospuso el lanzamiento del producto hasta Q1 2027.',
  },
];

export const INITIAL_ACTIVITIES: CrmActivity[] = [
  {
    id: 'act-01',
    type: 'Llamada',
    account: 'TYCO',
    opportunityFolio: 'OPP-2026-0041',
    subject: 'Definir condiciones de entrega y término 60 días',
    when: '07 Sep · 10:00',
    owner: 'Andrea Peña',
    status: 'Vencida',
    priority: 'Crítica',
    notes: 'Llamar a Jorge Guerra para confirmar si autorización de finanzas ya quedó firmada.',
  },
  {
    id: 'act-02',
    type: 'Visita',
    account: 'BLACK & DECKER',
    opportunityFolio: 'OPP-2026-0042',
    subject: 'Levantamiento instructivo NA472050 en planta',
    when: '09 Sep · 11:30',
    owner: 'Lucía Torres',
    status: 'Próxima',
    priority: 'Alta',
    notes: 'Llevar catálogo de sustratos de papel bond 60g y muestra de encuadernación.',
  },
  {
    id: 'act-03',
    type: 'Correo',
    account: 'TRICO TECHNOLOGIES CORPORATION',
    opportunityFolio: 'OPP-2026-0044',
    subject: 'Seguimiento a cotización COT-2026-0096',
    when: '08 Sep · 09:00',
    owner: 'Andrea Peña',
    status: 'Hoy',
    priority: 'Alta',
    notes: 'Enviar comparativa de costos unitarios por escala de 100k y 150k etiquetas.',
  },
  {
    id: 'act-04',
    type: 'Reunión',
    account: 'BISSELL',
    opportunityFolio: 'OPP-2026-0043',
    subject: 'Revisión final de propuesta blister cards Q4',
    when: '08 Sep · 16:00',
    owner: 'Marco Salinas',
    status: 'Hoy',
    priority: 'Alta',
    notes: 'Confirmar fecha de entrega de prueba piloto para línea de empaque.',
  },
  {
    id: 'act-05',
    type: 'Seguimiento',
    account: 'ENTAIL',
    opportunityFolio: 'OPP-2026-0046',
    subject: 'Confirmar recepción de prueba de color serigráfica',
    when: '06 Sep · 14:00',
    owner: 'Marco Salinas',
    status: 'Completada',
    priority: 'Media',
    notes: 'Cliente aprobó el tono Pantone 286 C sin observaciones.',
  },
  {
    id: 'act-06',
    type: 'Llamada',
    account: 'Fresenius Medical Care',
    subject: 'Confirmar especificaciones de etiqueta para diálisis',
    when: '09 Sep · 10:30',
    owner: 'Lucía Torres',
    status: 'Próxima',
    priority: 'Alta',
  },
  {
    id: 'act-07',
    type: 'Visita',
    account: 'Panasonic Automotive',
    subject: 'Revisión técnica de empaques para nuevos sensores',
    when: '11 Sep · 15:00',
    owner: 'Marco Salinas',
    status: 'Próxima',
    priority: 'Media',
  },
];

// ----------------------------------------------------------------------------
// SELECTORES Y LÓGICA DE CÁLCULO
// ----------------------------------------------------------------------------

export const formatMxn = (amount: number): string => {
  return amount.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  });
};

export const getOpportunityHealth = (opp: CrmOpportunity): number => {
  let score = opp.probability;
  if (opp.quote) score += 12;
  if (opp.order) score += 15;
  if (opp.days > 8) score -= 22;
  if (opp.risk === 'Crítico') score -= 20;
  if (opp.risk === 'Alto') score -= 10;
  return Math.max(20, Math.min(98, score));
};

export const getHealthLabel = (score: number): 'Buena' | 'Atención' | 'Riesgo' => {
  if (score >= 75) return 'Buena';
  if (score >= 50) return 'Atención';
  return 'Riesgo';
};

// Export initial seed aliases
export const initialProspects = INITIAL_PROSPECTS;
export const initialOpportunities = INITIAL_OPPORTUNITIES;
export const initialActivities = INITIAL_ACTIVITIES;

// Filtro universal
export const filterOpportunities = (
  opps: CrmOpportunity[],
  filtersOrPeriod:
    | {
        period?: CrmPeriod;
        seller?: string;
        line?: string;
        stage?: string;
        risk?: string;
        search?: string;
      }
    | CrmPeriod = '30 días',
  sellerParam?: string,
  lineParam?: string
): CrmOpportunity[] => {
  const filters =
    typeof filtersOrPeriod === 'string'
      ? {
          period: filtersOrPeriod,
          seller: sellerParam || 'Todos',
          line: lineParam || 'Todas',
        }
      : filtersOrPeriod;

  return opps.filter((opp) => {
    if (filters.seller && filters.seller !== 'Todos' && opp.seller !== filters.seller) {
      return false;
    }
    if (filters.line && filters.line !== 'Todas' && opp.line !== filters.line) {
      return false;
    }
    if (filters.stage && filters.stage !== 'Todas' && opp.stage !== filters.stage) {
      return false;
    }
    if (filters.risk && filters.risk !== 'Todos' && opp.risk !== filters.risk) {
      return false;
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        opp.folio.toLowerCase().includes(q) ||
        opp.account.toLowerCase().includes(q) ||
        opp.title.toLowerCase().includes(q) ||
        opp.seller.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};

export const calculateCrmKpis = (
  opps: CrmOpportunity[],
  activitiesOrPeriod?: CrmActivity[] | CrmPeriod,
  periodParam?: CrmPeriod
): any => {
  const activities = Array.isArray(activitiesOrPeriod) ? activitiesOrPeriod : INITIAL_ACTIVITIES;
  const period = typeof activitiesOrPeriod === 'string' ? activitiesOrPeriod : (periodParam || '30 días');

  const openOpps = opps.filter((o) => !['Ganada', 'Perdida'].includes(o.stage));
  const wonOpps = opps.filter((o) => o.stage === 'Ganada');
  const closedOpps = opps.filter((o) => ['Ganada', 'Perdida'].includes(o.stage));

  const openPipeline = openOpps.reduce((sum, o) => sum + o.amount, 0);
  const weightedPipeline = openOpps.reduce((sum, o) => sum + (o.amount * o.probability) / 100, 0);
  const wonAmount = wonOpps.reduce((sum, o) => sum + o.amount, 0);

  const winRate = closedOpps.length > 0 ? (wonOpps.length / closedOpps.length) * 100 : 50;

  const criticalOpps = openOpps.filter((o) => o.risk === 'Crítico' || o.risk === 'Alto');
  const overdueActivities = activities.filter((a) => a.status === 'Vencida');

  const avgTicket = opps.length > 0 ? opps.reduce((sum, o) => sum + o.amount, 0) / opps.length : 0;
  const avgCycleDays = 19;
  const pipelineVelocity = (openPipeline * (winRate / 100)) / (avgCycleDays || 1);

  const stalledOpps = openOpps.filter((o) => (o.daysInStage || o.days || 0) >= 8);

  // Variaciones simuladas coherentes según periodo
  const factor = (period === '7 días' || period === '7d') ? 0.3 : (period === '90 días' || period === '90d') ? 1.8 : 1.0;

  return {
    openPipeline: openPipeline * factor,
    pipelineValue: openPipeline * factor,
    openPipelineDelta: 8.4,
    weightedPipeline: weightedPipeline * factor,
    weightedValue: weightedPipeline * factor,
    weightedPipelineDelta: 6.2,
    forecastAmount: (weightedPipeline + wonAmount) * factor,
    wonAmount: wonAmount * factor,
    wonValue: wonAmount * factor,
    wonCount: wonOpps.length,
    activeCount: openOpps.length,
    wonAmountDelta: 12.5,
    winRate: Math.round(winRate),
    winRateDelta: 3.2,
    riskCount: criticalOpps.length,
    riskAmount: criticalOpps.reduce((sum, o) => sum + o.amount, 0),
    atRiskValue: criticalOpps.reduce((sum, o) => sum + o.amount, 0),
    atRiskCount: criticalOpps.length,
    overdueActivitiesCount: overdueActivities.length,
    avgCycleDays: 19,
    salesCycleDays: 19,
    avgTicket,
    averageDealSize: avgTicket,
    pipelineVelocity,
    leadConversionRate: 42.5,
    oppToWonConversionRate: 31.8,
    stalledCount: stalledOpps.length,
  };
};

export const getTopAccountsByPipeline = (
  opps: CrmOpportunity[],
  limit = 5
): any[] => {
  const map = new Map<string, { pipeline: number; count: number; totalHealth: number }>();
  const totalOpen = opps.filter((o) => !['Ganada', 'Perdida'].includes(o.stage)).reduce((s, o) => s + o.amount, 0) || 1;

  opps
    .filter((o) => !['Ganada', 'Perdida'].includes(o.stage))
    .forEach((o) => {
      const existing = map.get(o.account) || { pipeline: 0, count: 0, totalHealth: 0 };
      const h = getOpportunityHealth(o);
      map.set(o.account, {
        pipeline: existing.pipeline + o.amount,
        count: existing.count + 1,
        totalHealth: existing.totalHealth + h,
      });
    });

  return Array.from(map.entries())
    .map(([account, data]) => ({
      account,
      pipeline: data.pipeline,
      amount: data.pipeline,
      oppsCount: data.count,
      oppCount: data.count,
      health: Math.round(data.totalHealth / data.count),
      percent: Math.round((data.pipeline / totalOpen) * 100),
    }))
    .sort((a, b) => b.pipeline - a.pipeline)
    .slice(0, limit);
};

export const getSellerPerformanceData = (
  opps: CrmOpportunity[],
  activities?: CrmActivity[]
): any[] => {
  const sellers = ['Lucía Torres', 'Marco Salinas', 'Andrea Peña'];
  const actList = activities || INITIAL_ACTIVITIES;

  return sellers.map((seller) => {
    const sellerOpps = opps.filter((o) => o.seller === seller);
    const sellerOpen = sellerOpps.filter((o) => !['Ganada', 'Perdida'].includes(o.stage));
    const sellerWon = sellerOpps.filter((o) => o.stage === 'Ganada');
    const sellerClosed = sellerOpps.filter((o) => ['Ganada', 'Perdida'].includes(o.stage));

    const pipeline = sellerOpen.reduce((sum, o) => sum + o.amount, 0);
    const won = sellerWon.reduce((sum, o) => sum + o.amount, 0);
    const winRate = sellerClosed.length > 0 ? (sellerWon.length / sellerClosed.length) * 100 : 50;

    const overdueCount = actList.filter(
      (a) => a.owner === seller && a.status === 'Vencida'
    ).length;

    const avgTicket = sellerOpps.length > 0 ? sellerOpps.reduce((s, o) => s + o.amount, 0) / sellerOpps.length : 0;

    return {
      seller,
      pipeline,
      won,
      wonAmount: won,
      winRate: Math.round(winRate),
      openCount: sellerOpen.length,
      activeOpps: sellerOpen.length,
      overdueCount,
      avgTicket,
      quotaAttainment: Math.min(130, Math.round(((won || 250000) / 350000) * 100)),
    };
  });
};

export const getPipelineByLineData = (
  opps: CrmOpportunity[]
): { line: CrmLine; amount: number; percentage: number; count: number }[] => {
  const lines: CrmLine[] = ['Offset', 'Flexografía', 'Serigrafía', 'Acabados / conversión'];
  const openOpps = opps.filter((o) => !['Ganada', 'Perdida'].includes(o.stage));
  const total = openOpps.reduce((sum, o) => sum + o.amount, 0) || 1;

  return lines.map((line) => {
    const matching = openOpps.filter((o) => o.line === line);
    const amount = matching.reduce((sum, o) => sum + o.amount, 0);
    return {
      line,
      amount,
      percentage: Math.round((amount / total) * 100),
      count: matching.length,
    };
  });
};

export const getSmartSuggestions = (
  opps: CrmOpportunity[],
  activitiesOrKpis?: any
): any[] => {
  const suggestions: CrmSmartSuggestion[] = [
    {
      id: 'sug-crm-01',
      category: 'recovery',
      title: 'TYCO · Oportunidad en negociación con seguimiento vencido',
      reason: 'OPP-2026-0041 acumula $210,000 en etapa de Negociación. Lleva 12 días en etapa y su última actividad expiró.',
      recommendation: 'Contactar hoy al director de compras y confirmar si ya autorizaron el crédito de 60 días.',
      impactNote: 'Representa el 18% del pipeline de Flexografía del mes.',
      primaryActionLabel: 'Ver oportunidad',
      targetTab: 'opportunities',
      targetPayload: 'OPP-2026-0041',
      secondaryActionLabel: 'Registrar llamada',
    },
    {
      id: 'sug-crm-02',
      category: 'recovery',
      title: 'Panasonic Automotive · Oportunidad perdida reactivable',
      reason: 'Se perdió OPP-2026-0047 ($154,000) por precio hace 10 días, pero la planta del cliente reportó problemas de entrega con el proveedor actual.',
      recommendation: 'Presentar contrapropuesta enfocada en tiempo de respuesta de 48h y garantía de stock de seguridad.',
      impactNote: 'Permite reenganchar una cuenta Tier 1 automotriz.',
      primaryActionLabel: 'Reactivar en pipeline',
      targetTab: 'pipeline',
      targetPayload: 'OPP-2026-0047',
      secondaryActionLabel: 'Ver historial',
    },
    {
      id: 'sug-crm-03',
      category: 'cross-sell',
      title: 'BLACK & DECKER · Expansión a Flexografía',
      reason: 'Cuenta estratégica activa en Offset (instructivos). Tienen licitación abierta de etiquetas de código de barras para cajas.',
      impactNote: 'Potencial de venta cruzada estimado en ~$180,000 MXN trimestrales.',
      recommendation: 'Aprovechar la visita del 09 Sep para presentar muestras de etiquetas BoPP térmicas.',
      primaryActionLabel: 'Ver Cuenta 360',
      targetTab: 'accounts',
      targetPayload: 'cli-001',
      secondaryActionLabel: 'Crear oportunidad',
    },
    {
      id: 'sug-crm-04',
      category: 'stale-quote',
      title: 'TRICO · Cotización COT-2026-0096 sin respuesta',
      reason: 'Propuesta de $178,000 enviada hace 6 días. La fecha proyectada de cierre es el 20 de Septiembre.',
      recommendation: 'Enviar correo de seguimiento y ofrecer reunión técnica de validación de troquel.',
      impactNote: 'Acelera el ciclo de cierre antes del corte de mes.',
      primaryActionLabel: 'Abrir cotización',
      targetTab: 'opportunities',
      targetPayload: 'OPP-2026-0044',
      secondaryActionLabel: 'Registrar correo',
    },
    {
      id: 'sug-crm-05',
      category: 'seller-balance',
      title: 'Andrea Peña concentra 3 oportunidades críticas en riesgo',
      reason: 'Andrea tiene 4 actividades vencidas y el 44% de su pipeline en riesgo alto por falta de contacto en los últimos 7 días.',
      recommendation: 'Redistribuir o agendar sesión de desbloqueo comercial para priorizar TYCO y TRICO.',
      impactNote: 'Previene caída en el forecast global de planta.',
      primaryActionLabel: 'Ver agenda de Andrea',
      targetTab: 'activities',
      secondaryActionLabel: 'Filtrar vendedor',
    },
  ];

  return suggestions;
};
