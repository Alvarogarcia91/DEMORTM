import { ProductionOrder, RoutingStep, ProductionMaterialItem } from './mockProduccionData';
import { SalesOrder } from './mockSalesData';

export type ProductionCostPeriodFilter = '7d' | '30d' | '60d' | '90d';

export interface MachineCostRate {
  machineName: string;
  area: string;
  hourlyRate: number; // MXN / hora
  setupHourlyRate: number; // MXN / hora
}

export interface MaterialCostReference {
  pattern: string; // substring match or exact sku
  name: string;
  unit: string;
  unitCost: number; // MXN por unidad (m, pliego, kg, etc.)
}

export interface ProductionCostConfig {
  laborHourlyRate: number; // Tarifa estándar demo configurable de MOD ($/hora)
  overheadPercentage: number; // Carga fabril demo configurable (% sobre conversión)
  defaultScrapCostPerUnit: number; // Costo estimado de scrap por unidad
  machineRates: MachineCostRate[];
  materialReferences: MaterialCostReference[];
}

export const DEFAULT_PRODUCTION_COST_CONFIG: ProductionCostConfig = {
  laborHourlyRate: 120.0, // $120 MXN / hora de mano de obra
  overheadPercentage: 8.5, // 8.5% de carga fabril indirecta
  defaultScrapCostPerUnit: 2.8, // $2.80 MXN por unidad de merma
  machineRates: [
    { machineName: 'Heidelberg Speedmaster', area: 'Offset', hourlyRate: 580, setupHourlyRate: 620 },
    { machineName: 'Conserver 8 colores', area: 'Offset', hourlyRate: 550, setupHourlyRate: 600 },
    { machineName: 'Conserver 3–4', area: 'Offset', hourlyRate: 460, setupHourlyRate: 500 },
    { machineName: 'Conserver 1–2', area: 'Offset', hourlyRate: 420, setupHourlyRate: 450 },
    { machineName: 'DiDDE 860', area: 'Offset', hourlyRate: 480, setupHourlyRate: 520 },
    { machineName: 'Ryobi 1–2', area: 'Offset', hourlyRate: 360, setupHourlyRate: 400 },
    { machineName: 'Mark Andy 830 10”', area: 'Flexografía', hourlyRate: 470, setupHourlyRate: 510 },
    { machineName: 'Mark Andy 830 7”', area: 'Flexografía', hourlyRate: 410, setupHourlyRate: 450 },
    { machineName: 'Mark Andy Scout 10”', area: 'Flexografía', hourlyRate: 450, setupHourlyRate: 490 },
    { machineName: 'Mark Andy 4120 17”', area: 'Flexografía', hourlyRate: 620, setupHourlyRate: 680 },
    { machineName: 'Allied Gear', area: 'Flexografía', hourlyRate: 390, setupHourlyRate: 430 },
    { machineName: 'Rotoflex I', area: 'Acabados', hourlyRate: 260, setupHourlyRate: 280 },
    { machineName: 'BGM 2', area: 'Acabados', hourlyRate: 240, setupHourlyRate: 260 },
    { machineName: 'Guillotina 2', area: 'Acabados', hourlyRate: 220, setupHourlyRate: 240 },
    { machineName: 'Stahl 2', area: 'Acabados', hourlyRate: 250, setupHourlyRate: 270 },
    { machineName: 'Muller Martini', area: 'Acabados', hourlyRate: 310, setupHourlyRate: 340 },
    { machineName: 'CTP Agfa', area: 'Preprensa', hourlyRate: 180, setupHourlyRate: 180 },
    { machineName: 'Mesa Empaque', area: 'Acabados', hourlyRate: 110, setupHourlyRate: 110 },
    { machineName: 'Estación Empaque', area: 'Acabados', hourlyRate: 110, setupHourlyRate: 110 },
  ],
  materialReferences: [
    { pattern: 'BOPP', name: 'Película BOPP Autoadherible', unit: 'm', unitCost: 4.12 },
    { pattern: 'Bond 60g', name: 'Papel Bond 60g', unit: 'pliego', unitCost: 0.46 },
    { pattern: 'Bond 75g', name: 'Papel Bond 75g', unit: 'pliego', unitCost: 0.58 },
    { pattern: 'Bond', name: 'Papel Bond Estándar', unit: 'pliego', unitCost: 0.50 },
    { pattern: 'Couché', name: 'Papel Couché Brillante', unit: 'pliego', unitCost: 1.15 },
    { pattern: 'Tinta UV', name: 'Tinta UV Flexográfica', unit: 'kg', unitCost: 225.0 },
    { pattern: 'Tinta Offset', name: 'Tinta Offset Negra/Color', unit: 'kg', unitCost: 165.0 },
    { pattern: 'Tinta', name: 'Tinta Industrial', unit: 'kg', unitCost: 180.0 },
    { pattern: 'Barniz', name: 'Barniz Sobreimpresión UV', unit: 'kg', unitCost: 185.0 },
    { pattern: 'Laminado', name: 'Película de Laminación', unit: 'm', unitCost: 1.45 },
    { pattern: 'Placa', name: 'Placa CTP Agfa', unit: 'placa', unitCost: 65.0 },
    { pattern: 'Cliché', name: 'Grabado Fotopolímero', unit: 'juego', unitCost: 450.0 },
    { pattern: 'Suaje', name: 'Suaje Rotativo/Plano', unit: 'cilindro', unitCost: 1200.0 },
    { pattern: 'Alambre', name: 'Alambre Grapado', unit: 'rollo', unitCost: 320.0 },
  ],
};

export interface CostComponentDetail {
  quoted: number; // Cotizado comercial ($)
  standard: number; // Estándar de ingeniería ($)
  actual: number; // Real acumulado ($)
  projected: number; // Proyectado al cierre ($)
  variancePct: number; // % vs estándar
  varianceAmount: number; // $ vs estándar (+/-)
}

export interface ProductionOrderCostSnapshot {
  orderId: string;
  orderFolio: string;
  salesOrderFolio?: string;
  originQuoteFolio?: string;
  client: string;
  partNumber: string;
  revision: string;
  area: string;
  machine: string;
  quantity: number;
  status: string;
  progress: number;
  isClosed: boolean; // true if Terminada / Liberada

  // Commercial Values
  commercialSaleTotal: number;
  commercialMarginAmount: number;
  commercialMarginPct: number;

  // 6 Cost Components
  materials: CostComponentDetail;
  machineProcess: CostComponentDetail;
  directLabor: CostComponentDetail;
  setup: CostComponentDetail;
  overhead: CostComponentDetail;
  incrementalScrap: CostComponentDetail;

  // Aggregated Cost Totals
  totalQuotedCost: number;
  totalStandardCost: number;
  totalActualCost: number;
  totalProjectedCost: number;
  totalCostVarianceAmount: number;
  totalCostVariancePct: number;

  // Unit Costs
  unitCostStandard: number;
  unitCostProjected: number;
  unitCostVariancePct: number;

  // Projected Financial Margin
  projectedMarginAmount: number;
  projectedMarginPct: number;
  marginErosionPct: number; // estimatedMarginPct - projectedMarginPct (positive = erosion)
  marginStatus: 'Saludable' | 'En Riesgo' | 'Erosión Crítica' | 'Ahorro';

  // Variance Drivers (Top causes ranked by dollar impact)
  drivers: {
    id: string;
    category: 'Material' | 'Setup' | 'Scrap' | 'Máquina' | 'Mano de obra' | 'Carga fabril';
    title: string;
    description: string;
    impactAmount: number;
    targetTab: 'Materiales' | 'Routing' | 'Incidencias' | 'Scrap y pérdidas';
  }[];

  // Economic Timeline (Cost accumulation events)
  economicTimeline: {
    id: string;
    time: string;
    event: string;
    detail: string;
    accumulatedCost: number;
    varianceImpact?: number;
    tone: 'primary' | 'warning' | 'danger' | 'success';
  }[];

  // Materials Consumption Breakdown
  materialsBreakdown: {
    id: string;
    name: string;
    type: string;
    standardQty: number;
    deliveredQty: number;
    consumedQty: number;
    unit: string;
    unitPriceRef: number;
    standardCost: number;
    actualCost: number;
    varianceAmount: number;
    variancePct: number;
    lot?: string;
  }[];
}

export interface CostSmartSuggestion {
  id: string;
  orderFolio: string;
  client: string;
  type: 'material' | 'setup' | 'scrap' | 'margen' | 'ahorro';
  title: string;
  description: string;
  recommendation: string;
  impactAmount: number;
  primaryActionLabel: string;
  primaryActionTarget: 'Materiales' | 'Routing' | 'Incidencias' | 'Scrap y pérdidas' | 'Costeo';
  secondaryActionLabel?: string;
  secondaryActionTarget?: 'Costeo' | 'Ordenes' | 'Routing';
}

export interface ProductionCostExecutiveKpis {
  accumulatedPeriodCost: number;
  accumulatedCostDiffPct: number;
  standardPeriodCost: number;
  varianceVsStandardPct: number;
  averageUnitCost: number;
  averageUnitCostDiff: number;
  outOfSpecScrapAmount: number;
  outOfSpecScrapCount: number;
  projectedPeriodMarginPct: number;
  projectedPeriodMarginDiffPts: number;
  ordersWithMarginErosionCount: number;
  criticalErosionCount: number;
}

// ---------------------------------------------------------------------------
// HELPER CALCULATORS
// ---------------------------------------------------------------------------

function parseQuantityNumber(qtyStr?: string): number {
  if (!qtyStr) return 0;
  const num = parseFloat(qtyStr.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 0 : num;
}

function getMachineRates(machineName: string, config: ProductionCostConfig) {
  const found = config.machineRates.find(
    (m) => m.machineName.toLowerCase().includes(machineName.toLowerCase()) ||
           machineName.toLowerCase().includes(m.machineName.toLowerCase())
  );
  return found || { machineName, area: 'General', hourlyRate: 450, setupHourlyRate: 480 };
}

function getMaterialUnitPrice(materialName: string, config: ProductionCostConfig): number {
  const found = config.materialReferences.find((ref) =>
    materialName.toLowerCase().includes(ref.pattern.toLowerCase())
  );
  return found ? found.unitCost : 1.5;
}

// ---------------------------------------------------------------------------
// SNAPSHOT COST CALCULATOR PER ORDER
// ---------------------------------------------------------------------------
export function getProductionOrderCostSnapshot(
  order: ProductionOrder,
  salesOrders: SalesOrder[] = [],
  config: ProductionCostConfig = DEFAULT_PRODUCTION_COST_CONFIG
): ProductionOrderCostSnapshot {
  const isClosed = order.status === 'Terminada' || order.status === 'Liberada';
  const progressRatio = Math.max(0.05, Math.min(1.0, (order.progress || 10) / 100));

  // 1. Linked Sales Order
  const matchedOrder = salesOrders.find(
    (so) =>
      so.folio === order.pedido ||
      (order.cliente && so.customerName.toLowerCase().includes(order.cliente.toLowerCase()) && so.partNumber === order.partNumber)
  );

  const commercialSaleTotal = matchedOrder?.financials.subtotal || Math.round(order.quantity * 2.85);
  const commercialQuotedCost = matchedOrder?.financials.estimatedCost || Math.round(commercialSaleTotal * 0.68);
  const commercialMarginAmount = commercialSaleTotal - commercialQuotedCost;
  const commercialMarginPct = +( (commercialMarginAmount / commercialSaleTotal) * 100 ).toFixed(1);

  // 2. Machine & Labor Rates
  const machineRates = getMachineRates(order.machine, config);
  const laborRate = config.laborHourlyRate;

  // 3. Setup Calculations
  const stdSetupMinutes = order.setupMinutes || 35;
  // If order is OP-2026-95249 (Black & Decker), simulate setup incident: 67 min vs 40 min
  const isHighSetupCase = order.folio === 'OP-2026-95249' || (order.id === 'op-10' && order.status === 'Detenida');
  const actualSetupMinutes = isHighSetupCase
    ? 67
    : order.status === 'Detenida'
    ? stdSetupMinutes + 25
    : order.progress > 20
    ? stdSetupMinutes + (order.folio.charCodeAt(order.folio.length - 1) % 15) - 4
    : Math.round(stdSetupMinutes * 0.8);

  const setupHourlyRate = machineRates.setupHourlyRate + laborRate;
  const setupStandard = Math.round((stdSetupMinutes / 60) * setupHourlyRate);
  const setupActual = Math.round((actualSetupMinutes / 60) * setupHourlyRate);
  const setupProjected = setupActual; // setup is done upfront

  // 4. Machine Run Calculations
  const stdRunMinutes = order.standardMinutes || 120;
  const isHighMachineTimeCase = order.folio === 'OP-2026-95250' || order.status === 'Detenida';
  const projectedRunMinutes = isHighMachineTimeCase
    ? Math.round(stdRunMinutes * 1.18)
    : Math.round(stdRunMinutes * 1.03);
  const actualRunMinutes = Math.round(projectedRunMinutes * progressRatio);

  const machineStandard = Math.round((stdRunMinutes / 60) * machineRates.hourlyRate);
  const machineActual = Math.round((actualRunMinutes / 60) * machineRates.hourlyRate);
  const machineProjected = isClosed ? machineActual : Math.round((projectedRunMinutes / 60) * machineRates.hourlyRate);

  // 5. Direct Labor (MOD)
  const laborStandard = Math.round((stdRunMinutes / 60) * laborRate);
  const laborActual = Math.round((actualRunMinutes / 60) * laborRate);
  const laborProjected = isClosed ? laborActual : Math.round((projectedRunMinutes / 60) * laborRate);

  // 6. Materials Breakdown & Costs
  const materialsList = order.materials || [];
  let totalMaterialStd = 0;
  let totalMaterialAct = 0;
  let totalMaterialProj = 0;

  const materialsBreakdown = materialsList.map((m, idx) => {
    const unitPrice = getMaterialUnitPrice(m.item, config);
    const requiredQty = parseQuantityNumber(m.required) || 1000;
    
    // Check if high material consumption case (e.g. OP-2026-95250 Panasonic BOPP)
    const isMaterialExcess = (order.folio === 'OP-2026-95250' || order.id === 'op-11') && idx === 0;
    const excessFactor = isMaterialExcess ? 1.118 : 1.02;

    const stdCost = Math.round(requiredQty * unitPrice);
    const deliveredQty = Math.round(requiredQty * (progressRatio >= 0.5 ? excessFactor : 1.0));
    const consumedQty = Math.round(deliveredQty * progressRatio);
    const actualCost = Math.round(consumedQty * unitPrice);
    const projectedCost = isClosed ? actualCost : Math.round(requiredQty * excessFactor * unitPrice);

    totalMaterialStd += stdCost;
    totalMaterialAct += actualCost;
    totalMaterialProj += projectedCost;

    const varAmt = projectedCost - stdCost;
    const varPct = stdCost > 0 ? +((varAmt / stdCost) * 100).toFixed(1) : 0;

    return {
      id: m.id || `mat-bd-${idx}`,
      name: m.item,
      type: m.type,
      standardQty: requiredQty,
      deliveredQty,
      consumedQty,
      unit: m.type === 'Tinta' || m.type === 'Barniz' ? 'kg' : m.type === 'Papel/Bobina' ? 'm' : 'pza',
      unitPriceRef: unitPrice,
      standardCost: stdCost,
      actualCost,
      varianceAmount: varAmt,
      variancePct: varPct,
      lot: m.lot,
    };
  });

  // Fallback if no materials in order
  if (materialsBreakdown.length === 0) {
    totalMaterialStd = Math.round(commercialQuotedCost * 0.52);
    totalMaterialProj = Math.round(totalMaterialStd * (order.folio === 'OP-2026-95250' ? 1.12 : 1.03));
    totalMaterialAct = Math.round(totalMaterialProj * progressRatio);
  }

  // 7. Scrap / Merma Calculations
  const stdScrapQty = Math.round(order.quantity * 0.02); // 2% scrap estándar
  const actualScrapQty = order.scrap || Math.round(order.quantity * (order.status === 'Detenida' ? 0.048 : 0.024));
  const isHighScrapCase = actualScrapQty > stdScrapQty;
  const scrapIncrementalQty = Math.max(0, actualScrapQty - stdScrapQty);
  
  const scrapCostRate = config.defaultScrapCostPerUnit;
  const scrapStandard = 0; // Baseline scrap is integrated into standard materials/machine
  const scrapActual = Math.round(actualScrapQty * scrapCostRate);
  const scrapIncrementalProjected = Math.round(scrapIncrementalQty * scrapCostRate * (isClosed ? 1 : 1.15));

  // 8. Overhead (Carga fabril indirecta: 8.5% sobre conversión)
  const conversionStd = machineStandard + laborStandard + setupStandard;
  const conversionProj = machineProjected + laborProjected + setupProjected;
  const conversionAct = machineActual + laborActual + setupActual;

  const overheadStd = Math.round(conversionStd * (config.overheadPercentage / 100));
  const overheadProj = Math.round(conversionProj * (config.overheadPercentage / 100));
  const overheadAct = Math.round(conversionAct * (config.overheadPercentage / 100));

  // 9. Quoted Cost by components (derived proportionally from commercial quote)
  const matQuoted = Math.round(commercialQuotedCost * 0.54);
  const macQuoted = Math.round(commercialQuotedCost * 0.20);
  const labQuoted = Math.round(commercialQuotedCost * 0.11);
  const setQuoted = Math.round(commercialQuotedCost * 0.06);
  const ovhQuoted = Math.round(commercialQuotedCost * 0.09);

  // Helper builder for component detail
  const buildComp = (quoted: number, std: number, act: number, proj: number): CostComponentDetail => ({
    quoted,
    standard: std,
    actual: act,
    projected: proj,
    varianceAmount: proj - std,
    variancePct: std > 0 ? +(((proj - std) / std) * 100).toFixed(1) : 0,
  });

  const materialsComp = buildComp(matQuoted, totalMaterialStd, totalMaterialAct, totalMaterialProj);
  const machineComp = buildComp(macQuoted, machineStandard, machineActual, machineProjected);
  const laborComp = buildComp(labQuoted, laborStandard, laborActual, laborProjected);
  const setupComp = buildComp(setQuoted, setupStandard, setupActual, setupProjected);
  const overheadComp = buildComp(ovhQuoted, overheadStd, overheadAct, overheadProj);
  const scrapComp = buildComp(0, scrapStandard, scrapActual, scrapIncrementalProjected);

  // 10. Aggregated Totals
  const totalStandardCost = totalMaterialStd + machineStandard + laborStandard + setupStandard + overheadStd;
  const totalActualCost = totalMaterialAct + machineActual + laborActual + setupActual + overheadAct + scrapActual;
  const totalProjectedCost = isClosed
    ? totalActualCost
    : totalMaterialProj + machineProjected + laborProjected + setupProjected + overheadProj + scrapIncrementalProjected;

  const totalCostVarianceAmount = totalProjectedCost - totalStandardCost;
  const totalCostVariancePct = totalStandardCost > 0 ? +(((totalCostVarianceAmount) / totalStandardCost) * 100).toFixed(1) : 0;

  // 11. Unit Costs
  const qty = Math.max(1, order.quantity);
  const unitCostStandard = +(totalStandardCost / qty).toFixed(3);
  const unitCostProjected = +(totalProjectedCost / qty).toFixed(3);
  const unitCostVariancePct = unitCostStandard > 0 ? +(((unitCostProjected - unitCostStandard) / unitCostStandard) * 100).toFixed(1) : 0;

  // 12. Margins
  const projectedMarginAmount = commercialSaleTotal - totalProjectedCost;
  const projectedMarginPct = commercialSaleTotal > 0 ? +((projectedMarginAmount / commercialSaleTotal) * 100).toFixed(1) : 0;
  const marginErosionPct = +(commercialMarginPct - projectedMarginPct).toFixed(1);

  let marginStatus: ProductionOrderCostSnapshot['marginStatus'] = 'Saludable';
  if (marginErosionPct >= 8.0 || projectedMarginPct < 15.0) {
    marginStatus = 'Erosión Crítica';
  } else if (marginErosionPct >= 3.0 || projectedMarginPct < 22.0) {
    marginStatus = 'En Riesgo';
  } else if (marginErosionPct < -1.0) {
    marginStatus = 'Ahorro';
  }

  // 13. Variance Drivers (Ranked causes by $ impact)
  const drivers: ProductionOrderCostSnapshot['drivers'] = [];
  if (materialsComp.varianceAmount > 200) {
    drivers.push({
      id: 'drv-mat',
      category: 'Material',
      title: 'Sobrecosto en materia prima',
      description: `Consumo real excede estándar por +${materialsComp.variancePct}%.`,
      impactAmount: materialsComp.varianceAmount,
      targetTab: 'Materiales',
    });
  }
  if (setupComp.varianceAmount > 200) {
    drivers.push({
      id: 'drv-set',
      category: 'Setup',
      title: 'Tiempo de preparación extendido',
      description: `Setup real duró ${actualSetupMinutes} min vs ${stdSetupMinutes} min estándar (+${setupComp.variancePct}%).`,
      impactAmount: setupComp.varianceAmount,
      targetTab: 'Routing',
    });
  }
  if (scrapComp.varianceAmount > 150) {
    drivers.push({
      id: 'drv-scr',
      category: 'Scrap',
      title: 'Scrap fuera de parámetro de receta',
      description: `${scrapIncrementalQty.toLocaleString()} unidades/pliegos de merma no presupuestada.`,
      impactAmount: scrapComp.varianceAmount,
      targetTab: 'Scrap y pérdidas',
    });
  }
  if (machineComp.varianceAmount > 200) {
    drivers.push({
      id: 'drv-mac',
      category: 'Máquina',
      title: 'Horas máquina adicionales',
      description: `Velocidad de corrida menor a estándar (+${machineComp.variancePct}% en tiempo).`,
      impactAmount: machineComp.varianceAmount,
      targetTab: 'Routing',
    });
  }
  if (laborComp.varianceAmount > 150) {
    drivers.push({
      id: 'drv-lab',
      category: 'Mano de obra',
      title: 'Horas operativas extendidas',
      description: `Ajustes en línea y asistencia técnica prolongada.`,
      impactAmount: laborComp.varianceAmount,
      targetTab: 'Routing',
    });
  }

  // Sort drivers by descending impact amount
  drivers.sort((a, b) => b.impactAmount - a.impactAmount);

  // 14. Economic Timeline
  const economicTimeline: ProductionOrderCostSnapshot['economicTimeline'] = [
    {
      id: 'tl-1',
      time: '07:30',
      event: 'Setup y Montaje Iniciado',
      detail: `Asignado en ${order.machine}. Insumos de receta cargados a pie de máquina.`,
      accumulatedCost: Math.round(setupActual * 0.5),
      tone: 'primary',
    },
    {
      id: 'tl-2',
      time: '08:42',
      event: 'Setup Concluido',
      detail: actualSetupMinutes > stdSetupMinutes
        ? `Setup completado en ${actualSetupMinutes} min (+${actualSetupMinutes - stdSetupMinutes} min vs estándar). Impacto: +$${(setupActual - setupStandard).toLocaleString()} MXN.`
        : `Setup completado en tiempo estándar (${actualSetupMinutes} min).`,
      accumulatedCost: setupActual,
      varianceImpact: actualSetupMinutes > stdSetupMinutes ? (setupActual - setupStandard) : undefined,
      tone: actualSetupMinutes > stdSetupMinutes ? 'warning' : 'success',
    },
    {
      id: 'tl-3',
      time: '09:15',
      event: 'Primera Pieza Liberada',
      detail: 'Aprobación de tonos Delta E < 1.8 y calibración dimensional autorizada por Calidad.',
      accumulatedCost: Math.round(setupActual + totalMaterialAct * 0.15),
      tone: 'primary',
    },
    ...(isHighScrapCase ? [{
      id: 'tl-4',
      time: '10:40',
      event: 'Evento de Scrap Reportado',
      detail: `${actualScrapQty} ejs/pliegos de merma acumulados por ajuste fino de registro en prensa.`,
      accumulatedCost: Math.round(totalActualCost * 0.65),
      varianceImpact: scrapActual,
      tone: 'danger' as const,
    }] : []),
    {
      id: 'tl-5',
      time: 'En curso',
      event: isClosed ? 'Orden Concluida · Costo Final' : 'Avance Acumulado de Producción',
      detail: isClosed
        ? `Tiraje completado al 100%. Lote liberado a Producto Terminado con costo real de $${totalActualCost.toLocaleString()} MXN.`
        : `Avance al ${order.progress}%. Proyección al cierre estimada en $${totalProjectedCost.toLocaleString()} MXN.`,
      accumulatedCost: totalActualCost,
      tone: isClosed ? 'success' : marginStatus === 'Erosión Crítica' ? 'danger' : 'primary',
    },
  ];

  return {
    orderId: order.id,
    orderFolio: order.folio,
    salesOrderFolio: order.pedido || matchedOrder?.folio,
    originQuoteFolio: matchedOrder?.originQuoteFolio || 'COT-RTM-2026-0108',
    client: order.cliente,
    partNumber: order.partNumber,
    revision: order.revision,
    area: order.area,
    machine: order.machine,
    quantity: order.quantity,
    status: order.status,
    progress: order.progress,
    isClosed,
    commercialSaleTotal,
    commercialMarginAmount,
    commercialMarginPct,
    materials: materialsComp,
    machineProcess: machineComp,
    directLabor: laborComp,
    setup: setupComp,
    overhead: overheadComp,
    incrementalScrap: scrapComp,
    totalQuotedCost: commercialQuotedCost,
    totalStandardCost,
    totalActualCost,
    totalProjectedCost,
    totalCostVarianceAmount,
    totalCostVariancePct,
    unitCostStandard,
    unitCostProjected,
    unitCostVariancePct,
    projectedMarginAmount,
    projectedMarginPct,
    marginErosionPct,
    marginStatus,
    drivers,
    economicTimeline,
    materialsBreakdown,
  };
}

// ---------------------------------------------------------------------------
// AGGREGATED DASHBOARD CALCULATOR
// ---------------------------------------------------------------------------
export function calculateProductionCostDashboard(
  orders: ProductionOrder[],
  salesOrders: SalesOrder[] = [],
  period: ProductionCostPeriodFilter = '30d',
  filterArea: string = 'Todas',
  filterClient: string = 'Todos',
  filterStatus: string = 'Todos',
  config: ProductionCostConfig = DEFAULT_PRODUCTION_COST_CONFIG
): {
  snapshots: ProductionOrderCostSnapshot[];
  filteredSnapshots: ProductionOrderCostSnapshot[];
  kpis: ProductionCostExecutiveKpis;
  activeMarginControl: ProductionOrderCostSnapshot[];
  topErosion: ProductionOrderCostSnapshot[];
  topSavings: ProductionOrderCostSnapshot[];
  costAnatomy: { category: string; percentage: number; amount: number; color: string }[];
  materialVariances: { name: string; standardQty: string; actualQty: string; variancePct: number; impact: number }[];
  machineTimeVariances: { machine: string; standardMin: number; actualMin: number; diffMin: number; impact: number }[];
  scrapVariances: { area: string; scrapQty: number; standardScrapPct: number; actualScrapPct: number; impact: number }[];
  suggestions: CostSmartSuggestion[];
} {
  // 1. Calculate snapshots for all orders
  const snapshots = orders.map((o) => getProductionOrderCostSnapshot(o, salesOrders, config));

  // 2. Filter by period & criteria
  const periodMultiplier = period === '7d' ? 0.3 : period === '30d' ? 1.0 : period === '60d' ? 1.9 : 2.8;

  const filteredSnapshots = snapshots.filter((snap) => {
    if (filterArea !== 'Todas' && snap.area !== filterArea) return false;
    if (filterClient !== 'Todos' && !snap.client.toLowerCase().includes(filterClient.toLowerCase())) return false;
    if (filterStatus === 'Activas' && snap.isClosed) return false;
    if (filterStatus === 'Terminadas' && !snap.isClosed) return false;
    return true;
  });

  // 3. Executive KPIs
  const totalProjected = Math.round(filteredSnapshots.reduce((acc, s) => acc + s.totalProjectedCost, 0) * periodMultiplier);
  const totalStandard = Math.round(filteredSnapshots.reduce((acc, s) => acc + s.totalStandardCost, 0) * periodMultiplier);
  const totalSales = Math.round(filteredSnapshots.reduce((acc, s) => acc + s.commercialSaleTotal, 0) * periodMultiplier);
  
  const varianceVsStdPct = totalStandard > 0 ? +(((totalProjected - totalStandard) / totalStandard) * 100).toFixed(1) : 0;
  const projectedMarginPct = totalSales > 0 ? +(((totalSales - totalProjected) / totalSales) * 100).toFixed(1) : 26.5;

  const totalQty = Math.max(1, filteredSnapshots.reduce((acc, s) => acc + s.quantity, 0));
  const avgUnitCost = +(totalProjected / totalQty).toFixed(3);

  const outOfSpecScrapAmount = filteredSnapshots.reduce((acc, s) => acc + Math.max(0, s.incrementalScrap.actual), 0);
  const outOfSpecScrapCount = filteredSnapshots.filter((s) => s.incrementalScrap.actual > 0).length;

  const ordersWithMarginErosion = filteredSnapshots.filter((s) => s.marginErosionPct > 2.0);
  const criticalErosionCount = filteredSnapshots.filter((s) => s.marginStatus === 'Erosión Crítica').length;

  const kpis: ProductionCostExecutiveKpis = {
    accumulatedPeriodCost: totalProjected,
    accumulatedCostDiffPct: varianceVsStdPct,
    standardPeriodCost: totalStandard,
    varianceVsStandardPct: varianceVsStdPct,
    averageUnitCost: avgUnitCost,
    averageUnitCostDiff: +((avgUnitCost * 0.04)).toFixed(3),
    outOfSpecScrapAmount,
    outOfSpecScrapCount,
    projectedPeriodMarginPct: projectedMarginPct,
    projectedPeriodMarginDiffPts: -2.3,
    ordersWithMarginErosionCount: ordersWithMarginErosion.length,
    criticalErosionCount,
  };

  // 4. Protagonist Block: Active Margin Control
  const activeMarginControl = [...filteredSnapshots]
    .filter((s) => !s.isClosed)
    .sort((a, b) => b.marginErosionPct - a.marginErosionPct);

  // 5. Top 5 Erosion vs Top 5 Savings
  const topErosion = [...filteredSnapshots]
    .filter((s) => s.marginErosionPct > 0)
    .sort((a, b) => b.marginErosionPct - a.marginErosionPct)
    .slice(0, 5);

  const topSavings = [...filteredSnapshots]
    .filter((s) => s.totalCostVarianceAmount < 0 || s.marginErosionPct < 0)
    .sort((a, b) => a.totalCostVarianceAmount - b.totalCostVarianceAmount)
    .slice(0, 5);

  // 6. Cost Anatomy
  const matSum = filteredSnapshots.reduce((acc, s) => acc + s.materials.projected, 0);
  const macSum = filteredSnapshots.reduce((acc, s) => acc + s.machineProcess.projected, 0);
  const labSum = filteredSnapshots.reduce((acc, s) => acc + s.directLabor.projected, 0);
  const setSum = filteredSnapshots.reduce((acc, s) => acc + s.setup.projected, 0);
  const ovhSum = filteredSnapshots.reduce((acc, s) => acc + s.overhead.projected, 0);
  const scrSum = filteredSnapshots.reduce((acc, s) => acc + s.incrementalScrap.projected, 0);
  const grandTotal = Math.max(1, matSum + macSum + labSum + setSum + ovhSum + scrSum);

  const costAnatomy = [
    { category: 'Materia prima', percentage: Math.round((matSum / grandTotal) * 100), amount: matSum, color: 'bg-indigo-500' },
    { category: 'Hora máquina', percentage: Math.round((macSum / grandTotal) * 100), amount: macSum, color: 'bg-sky-500' },
    { category: 'Mano de obra (MOD)', percentage: Math.round((labSum / grandTotal) * 100), amount: labSum, color: 'bg-emerald-500' },
    { category: 'Setup y montaje', percentage: Math.round((setSum / grandTotal) * 100), amount: setSum, color: 'bg-amber-500' },
    { category: 'Carga fabril indirecta', percentage: Math.round((ovhSum / grandTotal) * 100), amount: ovhSum, color: 'bg-violet-500' },
    { category: 'Scrap incremental', percentage: Math.round((scrSum / grandTotal) * 100), amount: scrSum, color: 'bg-rose-500' },
  ];

  // 7. Material Variances
  const materialVariances = [
    { name: 'Bobina BOPP Blanco Brillante 7”', standardQty: '12,000 m', actualQty: '13,180 m', variancePct: 9.8, impact: 4860 },
    { name: 'Papel Bond 60g 57x87 cm', standardQty: '28,500 pliegos', actualQty: '29,800 pliegos', variancePct: 4.6, impact: 624 },
    { name: 'Tinta UV Cian Flexo', standardQty: '18.0 kg', actualQty: '18.6 kg', variancePct: 3.3, impact: 420 },
    { name: 'Barniz UV Sobreimpresión Gloss', standardQty: '14.0 kg', actualQty: '13.2 kg', variancePct: -5.7, impact: -296 },
  ];

  // 8. Machine Time Variances
  const machineTimeVariances = [
    { machine: 'Heidelberg Speedmaster', standardMin: 210, actualMin: 264, diffMin: 54, impact: 2180 },
    { machine: 'Mark Andy Scout 10”', standardMin: 185, actualMin: 196, diffMin: 11, impact: 320 },
    { machine: 'Conserver 8 colores', standardMin: 160, actualMin: 174, diffMin: 14, impact: 490 },
    { machine: 'Guillotina 2', standardMin: 60, actualMin: 58, diffMin: -2, impact: -65 },
  ];

  // 9. Scrap Variances
  const scrapVariances = [
    { area: 'Flexografía', scrapQty: 1840, standardScrapPct: 2.0, actualScrapPct: 3.6, impact: 4820 },
    { area: 'Offset', scrapQty: 920, standardScrapPct: 1.5, actualScrapPct: 2.2, impact: 2150 },
    { area: 'Acabados / Rebobinado', scrapQty: 310, standardScrapPct: 0.8, actualScrapPct: 0.9, impact: 580 },
  ];

  // 10. SMART System Suggestions
  const suggestions: CostSmartSuggestion[] = [
    {
      id: 'sug-mat-panasonic',
      orderFolio: 'OP-2026-95250',
      client: 'PANASONIC',
      type: 'material',
      title: 'Desviación en Materia Prima (+11.8% vs Estándar)',
      description: 'El consumo de película BOPP supera la receta en 1,180 m adicionales, provocando un sobrecosto de +$4,860 MXN.',
      recommendation: 'Verificar tensión de bobina y merma en troquel con el operador M. Ríos.',
      impactAmount: 4860,
      primaryActionLabel: 'Ver materiales',
      primaryActionTarget: 'Materiales',
      secondaryActionLabel: 'Analizar OP',
      secondaryActionTarget: 'Costeo',
    },
    {
      id: 'sug-set-bd',
      orderFolio: 'OP-2026-95249',
      client: 'BLACK & DECKER',
      type: 'setup',
      title: 'Setup Extendido en Heidelberg (+27 min vs Estándar)',
      description: 'La preparación tomó 67 min vs 40 min estándar. Impacto financiero estimado en +$1,420 MXN.',
      recommendation: 'Revisar reporte de incidencia por ajuste de placas registrado en turno matutino.',
      impactAmount: 1420,
      primaryActionLabel: 'Ver incidencia',
      primaryActionTarget: 'Incidencias',
      secondaryActionLabel: 'Ver routing',
      secondaryActionTarget: 'Routing',
    },
    {
      id: 'sug-scr-flexo',
      orderFolio: 'OP-2026-95241',
      client: 'TYCO',
      type: 'scrap',
      title: 'Scrap Acumulado por Encima de Tolerancia en Flexo',
      description: '3 OPs consecutivas de etiquetas presentan merma de arranque mayor al 3.5% presupuestado.',
      recommendation: 'Verificar anilox y nivel de viscosidad en tintas UV antes del próximo lote.',
      impactAmount: 8640,
      primaryActionLabel: 'Ver Scrap & pérdidas',
      primaryActionTarget: 'Scrap y pérdidas',
      secondaryActionLabel: 'Ver OP',
      secondaryActionTarget: 'Costeo',
    },
    {
      id: 'sug-mar-risk',
      orderFolio: 'OP-2026-95250',
      client: 'PANASONIC',
      type: 'margen',
      title: 'Riesgo de Margen Operativo (27.5% vs 36.1% Cotizado)',
      description: 'La caída de -8.6 puntos de margen proviene en un 72% de Material y 28% de Setup.',
      recommendation: 'Ajustar estándar de consumo para futuras cotizaciones de la parte 526412.',
      impactAmount: 5820,
      primaryActionLabel: 'Analizar OP',
      primaryActionTarget: 'Costeo',
    },
  ];

  return {
    snapshots,
    filteredSnapshots,
    kpis,
    activeMarginControl,
    topErosion,
    topSavings,
    costAnatomy,
    materialVariances,
    machineTimeVariances,
    scrapVariances,
    suggestions,
  };
}

// ---------------------------------------------------------------------------
// WHAT-IF MACHINE SIMULATOR (P2 Opcional)
// ---------------------------------------------------------------------------
export function simulateAlternativeMachineCost(
  order: ProductionOrder,
  targetMachineName: string,
  config: ProductionCostConfig = DEFAULT_PRODUCTION_COST_CONFIG
): {
  currentMachine: string;
  currentMachineRate: number;
  currentTotalCost: number;
  targetMachine: string;
  targetMachineRate: number;
  simulatedTotalCost: number;
  differenceAmount: number;
  differencePct: number;
  savingsDescription: string;
} {
  const currentSnapshot = getProductionOrderCostSnapshot(order, [], config);
  const currentMachineRate = getMachineRates(order.machine, config).hourlyRate;
  const targetRates = getMachineRates(targetMachineName, config);

  const runHours = (order.standardMinutes || 120) / 60;
  const currentMachineCost = runHours * currentMachineRate;
  const simulatedMachineCost = runHours * targetRates.hourlyRate;
  const diffMachine = simulatedMachineCost - currentMachineCost;

  const simulatedTotalCost = Math.round(currentSnapshot.totalProjectedCost + diffMachine);
  const differenceAmount = simulatedTotalCost - currentSnapshot.totalProjectedCost;
  const differencePct = currentSnapshot.totalProjectedCost > 0
    ? +((differenceAmount / currentSnapshot.totalProjectedCost) * 100).toFixed(1)
    : 0;

  const savingsDescription = differenceAmount < 0
    ? `Ahorro proyectado de $${Math.abs(differenceAmount).toLocaleString()} MXN produciendo en ${targetMachineName}.`
    : `Incremento de costo de +$${differenceAmount.toLocaleString()} MXN al utilizar ${targetMachineName}.`;

  return {
    currentMachine: order.machine,
    currentMachineRate,
    currentTotalCost: currentSnapshot.totalProjectedCost,
    targetMachine: targetMachineName,
    targetMachineRate: targetRates.hourlyRate,
    simulatedTotalCost,
    differenceAmount,
    differencePct,
    savingsDescription,
  };
}
