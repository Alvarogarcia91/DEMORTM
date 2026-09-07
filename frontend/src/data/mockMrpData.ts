// ====================================================
// MODELOS Y DATOS MOCK: MRP / PLANEACIÓN DE MATERIALES ENTERPRISE
// Demanda de OPs → Inventario Útil (HOLD fuera) → OCs abiertas → Cobertura → Gaps → Requisiciones
// ====================================================

export type MrpHorizon = '7d' | '14d' | '30d' | '60d' | '90d';
export type MrpArea = 'Todas' | 'Offset' | 'Flexografía' | 'Acabados';
export type MrpStatus = 'Todos' | 'Riesgo' | 'Faltante' | 'Cubierto' | 'Sobreinventario';

export type MrpMaterialCategory =
  | 'Sustrato / Bobina'
  | 'Papel Pliego'
  | 'Tinta'
  | 'Barniz'
  | 'Placa / Cyrel'
  | 'Suaje'
  | 'Empaque / Insumo';

export interface MrpOpenPurchaseOrder {
  poFolio: string;
  supplier: string;
  quantity: number;
  pendingQuantity: number;
  unit: string;
  promisedDate: string;
  status: 'Confirmada por proveedor' | 'En tránsito' | 'Emitida';
  deliversOnTime: boolean; // Si llega antes de la primera fecha requerida
  targetOps: string[];
}

export interface MrpDemandingOp {
  opFolio: string;
  client: string;
  partNumber: string;
  requiredDate: string;
  quantityRequired: number;
  unit: string;
  status: 'Cubierto' | 'En riesgo' | 'Faltante';
}

export interface MrpPhysicalLot {
  lotNumber: string;
  warehouse: string;
  location: string;
  quantity: number;
  unit: string;
  status: 'Disponible' | 'Comprometido' | 'Cuarentena / HOLD';
  qaNotes?: string;
  coaFolio?: string;
}

export interface MrpTimelineMilestone {
  date: string;
  title: string;
  event: string;
  type: 'demand' | 'supply' | 'stockout' | 'milestone';
  quantity?: string;
  referenceFolio?: string;
  opOrPo?: string;
  alert?: boolean;
}

export interface MrpCompatibleRemnant {
  remnantCode: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  lot: string;
  usableQualityPercent: number;
}

export interface MrpMaterialPlanningItem {
  sku: string;
  name: string;
  category: MrpMaterialCategory;
  area: 'Offset' | 'Flexografía' | 'Acabados';
  uom: string;
  // Inventarios
  physicalStock: number;
  committedStock: number;
  holdStock: number; // Retenido por Calidad (NO entra en útil)
  holdReason?: string;
  usefulStock: number; // max(0, physicalStock - committedStock - holdStock)
  // Demanda por horizonte
  demandsByHorizon: Record<MrpHorizon, number>;
  // Suministro
  openPurchaseOrders: MrpOpenPurchaseOrder[];
  confirmedSupply: number;
  // Cobertura
  dailyConsumption: number;
  coverageDays: number;
  firstNeedDate: string;
  temporalGapDays?: number; // Días que la OP esperará la OC
  netGapQuantity: number; // Faltante neto si útil + suministro < demanda
  status: 'Cubierto' | 'Próximo a mínimo' | 'Cobertura insuficiente' | 'Faltante' | 'Sobreinventario' | 'Riesgo';
  // Proveedor y costos
  preferredSupplier: string;
  supplierId: string;
  unitPrice: number;
  currency: 'MXN' | 'USD';
  leadTimeDays: number;
  moq: number;
  supplierQualityScore: number;
  // Desglose 360
  lots: MrpPhysicalLot[];
  demandingOps: MrpDemandingOp[];
  timeline: MrpTimelineMilestone[];
  compatibleRemnants?: MrpCompatibleRemnant[];
}

export interface MrpSystemSuggestion {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  explanation: string;
  sku: string;
  actionLabel: string;
  actionType: 'requisition' | 'delay_purchase' | 'consolidate' | 'remnant';
  prefillData?: {
    sku: string;
    productName: string;
    brand: string;
    quantity: number;
    note: string;
    targetWarehouseId?: string;
  };
}

// ----------------------------------------------------
// BASE MAESTRA DE 20 MATERIALES INDUSTRIALES PARA MRP
// ----------------------------------------------------

export const INITIAL_MRP_MATERIALS: MrpMaterialPlanningItem[] = [
  // 1. CASO PROTAGONISTA CRÍTICO: BOPP Blanco 50 micras (Gap temporal con OC que llega tarde)
  {
    sku: 'MP-BOPP-050',
    name: 'BOPP Blanco Brillante 50 micras 7”',
    category: 'Sustrato / Bobina',
    area: 'Flexografía',
    uom: 'm',
    physicalStock: 4800,
    committedStock: 3900,
    holdStock: 0,
    usefulStock: 900, // 4800 - 3900
    demandsByHorizon: {
      '7d': 2800,
      '14d': 6200,
      '30d': 11400,
      '60d': 21000,
      '90d': 32000,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0089',
        supplier: 'Avery Dennison México',
        quantity: 4000,
        pendingQuantity: 4000,
        unit: 'm',
        promisedDate: '13 Sep 2026',
        status: 'Confirmada por proveedor',
        deliversOnTime: false, // La primera OP lo requiere el 11 Sep
        targetOps: ['OP-2026-95250', 'OP-2026-95258'],
      },
    ],
    confirmedSupply: 4000,
    dailyConsumption: 380,
    coverageDays: 2.4,
    firstNeedDate: '11 Sep 2026',
    temporalGapDays: 2, // Del 11 al 13 Sep
    netGapQuantity: 1300, // Demanda 14d (6200) - (900 útil + 4000 OC) = 1300 m
    status: 'Cobertura insuficiente',
    preferredSupplier: 'Avery Dennison México',
    supplierId: 'SUP-001',
    unitPrice: 14.5,
    currency: 'MXN',
    leadTimeDays: 7,
    moq: 2000,
    supplierQualityScore: 99.1,
    lots: [
      { lotNumber: 'BOB-BOPP-0881', warehouse: 'ALM-RTM', location: 'FLX-A-01', quantity: 3900, unit: 'm', status: 'Comprometido', coaFolio: 'COA-AV-9912' },
      { lotNumber: 'BOB-BOPP-0902', warehouse: 'ALM-RTM', location: 'FLX-A-02', quantity: 900, unit: 'm', status: 'Disponible', coaFolio: 'COA-AV-9945' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95250', client: 'Panasonic Industrial', partNumber: '526412 | G |', requiredDate: '11 Sep 2026', quantityRequired: 2800, unit: 'm', status: 'En riesgo' },
      { opFolio: 'OP-2026-95258', client: 'Tyco Electronics', partNumber: 'IS-2420', requiredDate: '15 Sep 2026', quantityRequired: 3400, unit: 'm', status: 'Cubierto' },
      { opFolio: 'OP-2026-95264', client: 'Black & Decker', partNumber: 'NA472050', requiredDate: '24 Sep 2026', quantityRequired: 5200, unit: 'm', status: 'Faltante' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Inventario útil actual disponible', type: 'milestone', quantity: '900 m' },
      { date: '11 Sep', title: 'OP-2026-95250', event: 'Panasonic requiere sustrato para arranque', type: 'demand', quantity: '2,800 m', opOrPo: 'OP-2026-95250', alert: true },
      { date: '11 Sep', title: 'Stockout Temporal', event: 'Déficit de 1,900 m durante 48 hrs', type: 'stockout', quantity: '-1,900 m', alert: true },
      { date: '13 Sep', title: 'Llegada OC-2026-0089', event: 'Entrega confirmada de Avery Dennison', type: 'supply', quantity: '+4,000 m', opOrPo: 'OC-2026-0089' },
      { date: '15 Sep', title: 'OP-2026-95258', event: 'Tyco consume remanente cubierto', type: 'demand', quantity: '3,400 m', opOrPo: 'OP-2026-95258' },
    ],
    compatibleRemnants: [
      { remnantCode: 'REM-075-014', description: 'BOPP Blanco Bobina Ancho 101.6mm', quantity: 746, unit: 'm', location: 'Rack Remanentes R-1', lot: 'PPBC-260721', usableQualityPercent: 100 },
    ],
  },

  // 2. CASO SOBREINVENTARIO: Papel Bond 60g (41 días de cobertura)
  {
    sku: 'MP-BOND-060',
    name: 'Papel Bond Alta Opacidad 60 g/m² 57x87 cm',
    category: 'Papel Pliego',
    area: 'Offset',
    uom: 'pliegos',
    physicalStock: 85000,
    committedStock: 18000,
    holdStock: 0,
    usefulStock: 67000,
    demandsByHorizon: {
      '7d': 12000,
      '14d': 26000,
      '30d': 49000,
      '60d': 74000,
      '90d': 92000,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0074',
        supplier: 'Bio Pappel S.A.B.',
        quantity: 35000,
        pendingQuantity: 35000,
        unit: 'pliegos',
        promisedDate: '18 Sep 2026',
        status: 'En tránsito',
        deliversOnTime: true,
        targetOps: ['OP-2026-95249'],
      },
    ],
    confirmedSupply: 35000,
    dailyConsumption: 1630,
    coverageDays: 41.1,
    firstNeedDate: '10 Sep 2026',
    netGapQuantity: 0,
    status: 'Sobreinventario',
    preferredSupplier: 'Bio Pappel S.A.B.',
    supplierId: 'SUP-002',
    unitPrice: 1.15,
    currency: 'MXN',
    leadTimeDays: 5,
    moq: 10000,
    supplierQualityScore: 97.8,
    lots: [
      { lotNumber: 'BND-260815-A', warehouse: 'ALM-RTM', location: 'PAP-A-01', quantity: 45000, unit: 'pliegos', status: 'Disponible', coaFolio: 'COA-BP-781' },
      { lotNumber: 'BND-260815-B', warehouse: 'ALM-RTM', location: 'PAP-A-02', quantity: 22000, unit: 'pliegos', status: 'Disponible', coaFolio: 'COA-BP-782' },
      { lotNumber: 'BND-260812-C', warehouse: 'ALM-RTM', location: 'PAP-A-03', quantity: 18000, unit: 'pliegos', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95249', client: 'Black & Decker', partNumber: 'NA472050', requiredDate: '10 Sep 2026', quantityRequired: 18000, unit: 'pliegos', status: 'Cubierto' },
      { opFolio: 'OP-2026-95255', client: 'Siemens Healthcare', partNumber: 'MN-SIEM-01', requiredDate: '18 Sep 2026', quantityRequired: 14000, unit: 'pliegos', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Stock útil abundante', type: 'milestone', quantity: '67,000 pliegos' },
      { date: '10 Sep', title: 'OP-2026-95249', event: 'Tiraje Black & Decker', type: 'demand', quantity: '18,000 pliegos' },
      { date: '18 Sep', title: 'OC-2026-0074', event: 'Llegada programada de Bio Pappel', type: 'supply', quantity: '+35,000 pliegos' },
    ],
  },

  // 3. CASO LOTE RETENIDO POR CALIDAD (HOLD fuera de inventario útil)
  {
    sku: 'MP-BARN-UV01',
    name: 'Barniz UV Sobreimpresión Alto Brillo',
    category: 'Barniz',
    area: 'Flexografía',
    uom: 'kg',
    physicalStock: 480,
    committedStock: 120,
    holdStock: 280, // Retenido por Calidad por viscosidad fuera de rango (MNC-000342)
    holdReason: 'Cuarentena por MNC-000342: Lote BAR-UV-2608 con viscosidad 42s Zahn #2 (Max 28s)',
    usefulStock: 80, // 480 - 120 - 280 = 80 kg
    demandsByHorizon: {
      '7d': 110,
      '14d': 240,
      '30d': 460,
      '60d': 820,
      '90d': 1200,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0095',
        supplier: 'Flint Group México',
        quantity: 200,
        pendingQuantity: 200,
        unit: 'kg',
        promisedDate: '12 Sep 2026',
        status: 'Emitida',
        deliversOnTime: true,
        targetOps: ['OP-2026-95250'],
      },
    ],
    confirmedSupply: 200,
    dailyConsumption: 15.3,
    coverageDays: 5.2,
    firstNeedDate: '09 Sep 2026',
    netGapQuantity: 30, // 110 (demanda 7d) - 80 útil = 30 kg faltante antes de que llegue la OC
    status: 'Riesgo',
    preferredSupplier: 'Flint Group México',
    supplierId: 'SUP-003',
    unitPrice: 195.0,
    currency: 'MXN',
    leadTimeDays: 4,
    moq: 100,
    supplierQualityScore: 94.2,
    lots: [
      { lotNumber: 'BAR-UV-2608-QA', warehouse: 'ALM-RTM', location: 'RET-QA', quantity: 280, unit: 'kg', status: 'Cuarentena / HOLD', qaNotes: 'MNC-000342: En análisis con proveedor para diluyente compensador.' },
      { lotNumber: 'BAR-UV-2607-OK', warehouse: 'ALM-RTM', location: 'FLX-B-04', quantity: 80, unit: 'kg', status: 'Disponible', coaFolio: 'COA-FL-402' },
      { lotNumber: 'BAR-UV-2607-RES', warehouse: 'ALM-RTM', location: 'FLX-B-04', quantity: 120, unit: 'kg', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95250', client: 'Panasonic Industrial', partNumber: '526412 | G |', requiredDate: '09 Sep 2026', quantityRequired: 45, unit: 'kg', status: 'En riesgo' },
      { opFolio: 'OP-2026-95256', client: 'Tyco Electronics', partNumber: 'IS-2420', requiredDate: '10 Sep 2026', quantityRequired: 65, unit: 'kg', status: 'Faltante' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Stock útil reducido a 80 kg por 280 kg en HOLD', type: 'milestone', quantity: '80 kg' },
      { date: '09 Sep', title: 'OP-2026-95250', event: 'Demanda Panasonic', type: 'demand', quantity: '45 kg' },
      { date: '10 Sep', title: 'OP-2026-95256', event: 'Demanda Tyco agota el remanente útil', type: 'stockout', quantity: '-30 kg', alert: true },
      { date: '12 Sep', title: 'OC-2026-0095', event: 'Llegada prevista Flint Group', type: 'supply', quantity: '+200 kg' },
    ],
  },

  // 4. CASO CONSOLIDACIÓN DEMANDA: Cartulina Sulfatada 14 pts (3 OPs en la misma semana)
  {
    sku: 'MP-SULF-014',
    name: 'Cartulina Sulfatada 1 Cara 14 pts 70x95 cm',
    category: 'Papel Pliego',
    area: 'Offset',
    uom: 'pliegos',
    physicalStock: 14000,
    committedStock: 11500,
    holdStock: 0,
    usefulStock: 2500,
    demandsByHorizon: {
      '7d': 18500,
      '14d': 29000,
      '30d': 48000,
      '60d': 72000,
      '90d': 98000,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0081',
        supplier: 'Papelera Del Plata S.A.',
        quantity: 12000,
        pendingQuantity: 12000,
        unit: 'pliegos',
        promisedDate: '09 Sep 2026',
        status: 'En tránsito',
        deliversOnTime: true,
        targetOps: ['OP-2026-95252', 'OP-2026-95257'],
      },
    ],
    confirmedSupply: 12000,
    dailyConsumption: 1600,
    coverageDays: 1.6,
    firstNeedDate: '09 Sep 2026',
    netGapQuantity: 4000, // Demanda 7d (18500) - (2500 útil + 12000 OC) = 4,000 faltantes
    status: 'Faltante',
    preferredSupplier: 'Papelera Del Plata S.A.',
    supplierId: 'SUP-004',
    unitPrice: 4.85,
    currency: 'MXN',
    leadTimeDays: 6,
    moq: 5000,
    supplierQualityScore: 96.5,
    lots: [
      { lotNumber: 'SULF-260820', warehouse: 'ALM-RTM', location: 'PAP-C-02', quantity: 2500, unit: 'pliegos', status: 'Disponible', coaFolio: 'COA-PDP-112' },
      { lotNumber: 'SULF-260818', warehouse: 'ALM-RTM', location: 'PAP-C-01', quantity: 11500, unit: 'pliegos', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95252', client: 'Medifarma Lab', partNumber: 'MED-EMB-04', requiredDate: '09 Sep 2026', quantityRequired: 7500, unit: 'pliegos', status: 'Cubierto' },
      { opFolio: 'OP-2026-95257', client: 'Fresenius Kabi', partNumber: 'FK-EMP-09', requiredDate: '10 Sep 2026', quantityRequired: 6000, unit: 'pliegos', status: 'En riesgo' },
      { opFolio: 'OP-2026-95260', client: 'Truper Herramientas', partNumber: 'TRUP-BOX-12', requiredDate: '12 Sep 2026', quantityRequired: 5000, unit: 'pliegos', status: 'Faltante' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Inventario útil bajo (2,500 pliegos)', type: 'milestone' },
      { date: '09 Sep', title: 'OC-2026-0081', event: 'Arribo de Papelera Del Plata', type: 'supply', quantity: '+12,000 pliegos' },
      { date: '09 Sep', title: 'OP-2026-95252', event: 'Consumo Medifarma', type: 'demand', quantity: '7,500 pliegos' },
      { date: '10 Sep', title: 'OP-2026-95257', event: 'Consumo Fresenius', type: 'demand', quantity: '6,000 pliegos' },
      { date: '12 Sep', title: 'OP-2026-95260', event: 'Faltante de 4,000 pliegos para Truper', type: 'stockout', quantity: '-4,000 pliegos', alert: true },
    ],
  },

  // 5. Tinta UV Negro Flexo (Cubierto 100%)
  {
    sku: 'MP-TINT-UV01',
    name: 'Tinta UV Flexo Negro Intenso',
    category: 'Tinta',
    area: 'Flexografía',
    uom: 'kg',
    physicalStock: 185,
    committedStock: 45,
    holdStock: 0,
    usefulStock: 140,
    demandsByHorizon: {
      '7d': 35,
      '14d': 65,
      '30d': 120,
      '60d': 210,
      '90d': 290,
    },
    openPurchaseOrders: [],
    confirmedSupply: 0,
    dailyConsumption: 4.2,
    coverageDays: 33.3,
    firstNeedDate: '11 Sep 2026',
    netGapQuantity: 0,
    status: 'Cubierto',
    preferredSupplier: 'Sun Chemical México',
    supplierId: 'SUP-005',
    unitPrice: 280.0,
    currency: 'MXN',
    leadTimeDays: 3,
    moq: 20,
    supplierQualityScore: 98.9,
    lots: [
      { lotNumber: 'INK-BLK-2608-A', warehouse: 'ALM-RTM', location: 'FLX-T-01', quantity: 140, unit: 'kg', status: 'Disponible', coaFolio: 'COA-SC-9041' },
      { lotNumber: 'INK-BLK-2608-B', warehouse: 'ALM-RTM', location: 'FLX-T-01', quantity: 45, unit: 'kg', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95250', client: 'Panasonic Industrial', partNumber: '526412 | G |', requiredDate: '11 Sep 2026', quantityRequired: 18, unit: 'kg', status: 'Cubierto' },
      { opFolio: 'OP-2026-95256', client: 'Tyco Electronics', partNumber: 'IS-2420', requiredDate: '14 Sep 2026', quantityRequired: 17, unit: 'kg', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: '140 kg útiles cubren la demanda programada', type: 'milestone' },
      { date: '11 Sep', title: 'OP-2026-95250', event: 'Consumo Panasonic', type: 'demand', quantity: '18 kg' },
      { date: '14 Sep', title: 'OP-2026-95256', event: 'Consumo Tyco', type: 'demand', quantity: '17 kg' },
    ],
  },

  // 6. Tinta UV Cyan Flexo
  {
    sku: 'MP-TINT-UV02',
    name: 'Tinta UV Flexo Cyan Process',
    category: 'Tinta',
    area: 'Flexografía',
    uom: 'kg',
    physicalStock: 95,
    committedStock: 30,
    holdStock: 0,
    usefulStock: 65,
    demandsByHorizon: {
      '7d': 28,
      '14d': 52,
      '30d': 90,
      '60d': 160,
      '90d': 220,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0092',
        supplier: 'Sun Chemical México',
        quantity: 50,
        pendingQuantity: 50,
        unit: 'kg',
        promisedDate: '15 Sep 2026',
        status: 'Confirmada por proveedor',
        deliversOnTime: true,
        targetOps: ['OP-2026-95258'],
      },
    ],
    confirmedSupply: 50,
    dailyConsumption: 3.1,
    coverageDays: 20.9,
    firstNeedDate: '11 Sep 2026',
    netGapQuantity: 0,
    status: 'Cubierto',
    preferredSupplier: 'Sun Chemical México',
    supplierId: 'SUP-005',
    unitPrice: 310.0,
    currency: 'MXN',
    leadTimeDays: 3,
    moq: 20,
    supplierQualityScore: 98.9,
    lots: [
      { lotNumber: 'INK-CYN-2608', warehouse: 'ALM-RTM', location: 'FLX-T-02', quantity: 65, unit: 'kg', status: 'Disponible', coaFolio: 'COA-SC-9042' },
      { lotNumber: 'INK-CYN-2607', warehouse: 'ALM-RTM', location: 'FLX-T-02', quantity: 30, unit: 'kg', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95250', client: 'Panasonic Industrial', partNumber: '526412 | G |', requiredDate: '11 Sep 2026', quantityRequired: 14, unit: 'kg', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: '65 kg útiles', type: 'milestone' },
      { date: '11 Sep', title: 'OP-2026-95250', event: 'Consumo Panasonic', type: 'demand', quantity: '14 kg' },
      { date: '15 Sep', title: 'OC-2026-0092', event: 'Arribo de reposición Sun Chemical', type: 'supply', quantity: '+50 kg' },
    ],
  },

  // 7. Papel Couche Brillante 130g (Offset)
  {
    sku: 'MP-COUCH-130',
    name: 'Papel Couche 2 Caras Brillante 130 g/m² 61x90 cm',
    category: 'Papel Pliego',
    area: 'Offset',
    uom: 'pliegos',
    physicalStock: 32000,
    committedStock: 19000,
    holdStock: 0,
    usefulStock: 13000,
    demandsByHorizon: {
      '7d': 14000,
      '14d': 28000,
      '30d': 52000,
      '60d': 79000,
      '90d': 105000,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0088',
        supplier: 'Distribuidora Papelera Nacional',
        quantity: 20000,
        pendingQuantity: 20000,
        unit: 'pliegos',
        promisedDate: '11 Sep 2026',
        status: 'En tránsito',
        deliversOnTime: true,
        targetOps: ['OP-2026-95251'],
      },
    ],
    confirmedSupply: 20000,
    dailyConsumption: 1750,
    coverageDays: 7.4,
    firstNeedDate: '09 Sep 2026',
    netGapQuantity: 0,
    status: 'Próximo a mínimo',
    preferredSupplier: 'Distribuidora Papelera Nacional',
    supplierId: 'SUP-006',
    unitPrice: 2.10,
    currency: 'MXN',
    leadTimeDays: 4,
    moq: 10000,
    supplierQualityScore: 97.1,
    lots: [
      { lotNumber: 'CCH-260810', warehouse: 'ALM-RTM', location: 'PAP-B-01', quantity: 13000, unit: 'pliegos', status: 'Disponible', coaFolio: 'COA-DPN-881' },
      { lotNumber: 'CCH-260808', warehouse: 'ALM-RTM', location: 'PAP-B-02', quantity: 19000, unit: 'pliegos', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95251', client: 'Siemens Healthcare', partNumber: 'SM-INST-03', requiredDate: '09 Sep 2026', quantityRequired: 9000, unit: 'pliegos', status: 'Cubierto' },
      { opFolio: 'OP-2026-95259', client: 'Pentair', partNumber: 'A163833BHA', requiredDate: '14 Sep 2026', quantityRequired: 12000, unit: 'pliegos', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Stock útil 13,000 pliegos', type: 'milestone' },
      { date: '09 Sep', title: 'OP-2026-95251', event: 'Consumo Siemens', type: 'demand', quantity: '9,000 pliegos' },
      { date: '11 Sep', title: 'OC-2026-0088', event: 'Llegada de reposición DPN', type: 'supply', quantity: '+20,000 pliegos' },
    ],
  },

  // 8. Placas CTP Agfa Energy Elite (Offset)
  {
    sku: 'MP-PLACA-CTP',
    name: 'Placas CTP Térmicas Agfa Energy Elite 605x745 mm',
    category: 'Placa / Cyrel',
    area: 'Offset',
    uom: 'placas',
    physicalStock: 120,
    committedStock: 48,
    holdStock: 0,
    usefulStock: 72,
    demandsByHorizon: {
      '7d': 32,
      '14d': 64,
      '30d': 110,
      '60d': 190,
      '90d': 260,
    },
    openPurchaseOrders: [],
    confirmedSupply: 0,
    dailyConsumption: 3.8,
    coverageDays: 18.9,
    firstNeedDate: '08 Sep 2026',
    netGapQuantity: 0,
    status: 'Cubierto',
    preferredSupplier: 'Agfa Graphics México',
    supplierId: 'SUP-007',
    unitPrice: 165.0,
    currency: 'MXN',
    leadTimeDays: 2,
    moq: 50,
    supplierQualityScore: 99.5,
    lots: [
      { lotNumber: 'AGF-PL-2608', warehouse: 'ALM-RTM', location: 'PRE-CTP-01', quantity: 72, unit: 'placas', status: 'Disponible', coaFolio: 'COA-AG-302' },
      { lotNumber: 'AGF-PL-2607', warehouse: 'ALM-RTM', location: 'PRE-CTP-01', quantity: 48, unit: 'placas', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95249', client: 'Black & Decker', partNumber: 'NA472050', requiredDate: '08 Sep 2026', quantityRequired: 16, unit: 'placas', status: 'Cubierto' },
      { opFolio: 'OP-2026-95251', client: 'Siemens Healthcare', partNumber: 'SM-INST-03', requiredDate: '09 Sep 2026', quantityRequired: 8, unit: 'placas', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: '72 placas disponibles', type: 'milestone' },
      { date: '08 Sep', title: 'OP-2026-95249', event: 'Grabado CTP', type: 'demand', quantity: '16 placas' },
    ],
  },

  // 9. Clichés Fotopolímero Cyrel FAST 1.14mm (Flexo)
  {
    sku: 'MP-FOTO-CYR114',
    name: 'Planchas Fotopolímero DuPont Cyrel FAST 1.14 mm',
    category: 'Placa / Cyrel',
    area: 'Flexografía',
    uom: 'juegos',
    physicalStock: 16,
    committedStock: 12,
    holdStock: 0,
    usefulStock: 4,
    demandsByHorizon: {
      '7d': 8,
      '14d': 14,
      '30d': 26,
      '60d': 44,
      '90d': 60,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0099',
        supplier: 'DuPont México / Gráficos',
        quantity: 10,
        pendingQuantity: 10,
        unit: 'juegos',
        promisedDate: '10 Sep 2026',
        status: 'Confirmada por proveedor',
        deliversOnTime: true,
        targetOps: ['OP-2026-95250', 'OP-2026-95256'],
      },
    ],
    confirmedSupply: 10,
    dailyConsumption: 0.9,
    coverageDays: 4.4,
    firstNeedDate: '09 Sep 2026',
    netGapQuantity: 0,
    status: 'Próximo a mínimo',
    preferredSupplier: 'DuPont México / Gráficos',
    supplierId: 'SUP-008',
    unitPrice: 1250.0,
    currency: 'MXN',
    leadTimeDays: 4,
    moq: 5,
    supplierQualityScore: 98.2,
    lots: [
      { lotNumber: 'CYR-260814', warehouse: 'ALM-RTM', location: 'PRE-FLX-01', quantity: 4, unit: 'juegos', status: 'Disponible', coaFolio: 'COA-DP-502' },
      { lotNumber: 'CYR-260810', warehouse: 'ALM-RTM', location: 'PRE-FLX-01', quantity: 12, unit: 'juegos', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95250', client: 'Panasonic Industrial', partNumber: '526412 | G |', requiredDate: '09 Sep 2026', quantityRequired: 4, unit: 'juegos', status: 'Cubierto' },
      { opFolio: 'OP-2026-95256', client: 'Tyco Electronics', partNumber: 'IS-2420', requiredDate: '11 Sep 2026', quantityRequired: 4, unit: 'juegos', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Stock útil 4 juegos', type: 'milestone' },
      { date: '09 Sep', title: 'OP-2026-95250', event: 'Montaje Panasonic', type: 'demand', quantity: '4 juegos' },
      { date: '10 Sep', title: 'OC-2026-0099', event: 'Llegada reposición DuPont', type: 'supply', quantity: '+10 juegos' },
    ],
  },

  // 10. Suaje Rotativo 64 Dientes (Herramental Crítico Flexo)
  {
    sku: 'HR-SUAJE-ROT64',
    name: 'Suaje Rotativo Flexible 64D Repetición 8.0”',
    category: 'Suaje',
    area: 'Flexografía',
    uom: 'pzas',
    physicalStock: 2,
    committedStock: 1,
    holdStock: 0,
    usefulStock: 1,
    demandsByHorizon: {
      '7d': 1,
      '14d': 1,
      '30d': 2,
      '60d': 3,
      '90d': 4,
    },
    openPurchaseOrders: [],
    confirmedSupply: 0,
    dailyConsumption: 0.05,
    coverageDays: 20.0,
    firstNeedDate: '11 Sep 2026',
    netGapQuantity: 0,
    status: 'Cubierto',
    preferredSupplier: 'Kocher+Beck México',
    supplierId: 'SUP-009',
    unitPrice: 8500.0,
    currency: 'MXN',
    leadTimeDays: 10,
    moq: 1,
    supplierQualityScore: 99.8,
    lots: [
      { lotNumber: 'SUA-64D-01', warehouse: 'ALM-RTM', location: 'HERR-R-01', quantity: 1, unit: 'pzas', status: 'Disponible' },
      { lotNumber: 'SUA-64D-02', warehouse: 'ALM-RTM', location: 'HERR-R-01', quantity: 1, unit: 'pzas', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95250', client: 'Panasonic Industrial', partNumber: '526412 | G |', requiredDate: '11 Sep 2026', quantityRequired: 1, unit: 'pzas', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Herramental afilado y verificado en Calidad', type: 'milestone' },
    ],
  },

  // 11. Cajas de Cartón Corrugado Master 40x30x25 cm (Empaque)
  {
    sku: 'MP-CAJA-4030',
    name: 'Caja Corrugado Master Kraft 40x30x25 cm C-150',
    category: 'Empaque / Insumo',
    area: 'Acabados',
    uom: 'pzas',
    physicalStock: 1800,
    committedStock: 1450,
    holdStock: 0,
    usefulStock: 350,
    demandsByHorizon: {
      '7d': 620,
      '14d': 1200,
      '30d': 2400,
      '60d': 4200,
      '90d': 6000,
    },
    openPurchaseOrders: [
      {
        poFolio: 'OC-2026-0090',
        supplier: 'Cartonajes Estrella',
        quantity: 1000,
        pendingQuantity: 1000,
        unit: 'pzas',
        promisedDate: '10 Sep 2026',
        status: 'En tránsito',
        deliversOnTime: true,
        targetOps: ['OP-2026-95249', 'OP-2026-95250'],
      },
    ],
    confirmedSupply: 1000,
    dailyConsumption: 82,
    coverageDays: 4.2,
    firstNeedDate: '09 Sep 2026',
    netGapQuantity: 0,
    status: 'Próximo a mínimo',
    preferredSupplier: 'Cartonajes Estrella',
    supplierId: 'SUP-010',
    unitPrice: 18.50,
    currency: 'MXN',
    leadTimeDays: 3,
    moq: 500,
    supplierQualityScore: 97.4,
    lots: [
      { lotNumber: 'CAJ-260822', warehouse: 'ALM-RTM', location: 'EMP-A-01', quantity: 350, unit: 'pzas', status: 'Disponible' },
      { lotNumber: 'CAJ-260819', warehouse: 'ALM-RTM', location: 'EMP-A-02', quantity: 1450, unit: 'pzas', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95249', client: 'Black & Decker', partNumber: 'NA472050', requiredDate: '09 Sep 2026', quantityRequired: 240, unit: 'pzas', status: 'Cubierto' },
      { opFolio: 'OP-2026-95250', client: 'Panasonic Industrial', partNumber: '526412 | G |', requiredDate: '11 Sep 2026', quantityRequired: 180, unit: 'pzas', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Stock útil 350 cajas', type: 'milestone' },
      { date: '09 Sep', title: 'OP-2026-95249', event: 'Empaque Black & Decker', type: 'demand', quantity: '240 cajas' },
      { date: '10 Sep', title: 'OC-2026-0090', event: 'Llegada de reposición Cartonajes Estrella', type: 'supply', quantity: '+1,000 cajas' },
    ],
  },

  // 12. Cinta de Embalaje Transparente 48mm x 100m
  {
    sku: 'MP-CINTA-48100',
    name: 'Cinta Canela / Transparente Hotmelt 48 mm x 100 m',
    category: 'Empaque / Insumo',
    area: 'Acabados',
    uom: 'rollos',
    physicalStock: 240,
    committedStock: 60,
    holdStock: 0,
    usefulStock: 180,
    demandsByHorizon: {
      '7d': 45,
      '14d': 90,
      '30d': 180,
      '60d': 320,
      '90d': 450,
    },
    openPurchaseOrders: [],
    confirmedSupply: 0,
    dailyConsumption: 6.2,
    coverageDays: 29.0,
    firstNeedDate: '10 Sep 2026',
    netGapQuantity: 0,
    status: 'Cubierto',
    preferredSupplier: '3M México S.A.',
    supplierId: 'SUP-011',
    unitPrice: 28.0,
    currency: 'MXN',
    leadTimeDays: 2,
    moq: 72,
    supplierQualityScore: 99.0,
    lots: [
      { lotNumber: 'CIN-3M-2608', warehouse: 'ALM-RTM', location: 'EMP-B-01', quantity: 180, unit: 'rollos', status: 'Disponible' },
      { lotNumber: 'CIN-3M-2607', warehouse: 'ALM-RTM', location: 'EMP-B-01', quantity: 60, unit: 'rollos', status: 'Comprometido' },
    ],
    demandingOps: [
      { opFolio: 'OP-2026-95249', client: 'Black & Decker', partNumber: 'NA472050', requiredDate: '10 Sep 2026', quantityRequired: 18, unit: 'rollos', status: 'Cubierto' },
    ],
    timeline: [
      { date: '07 Sep', title: 'Hoy', event: 'Stock útil 180 rollos', type: 'milestone' },
    ],
  },
];

// ----------------------------------------------------
// SUGERENCIAS SMART DEL SISTEMA (MORADITAS)
// ----------------------------------------------------

export const INITIAL_MRP_SYSTEM_SUGGESTIONS: MrpSystemSuggestion[] = [
  {
    id: 'sug-mrp-1',
    type: 'warning',
    title: 'BOPP Blanco quedará por debajo de cobertura mínima en 4 días',
    explanation:
      'La orden de compra OC-2026-0089 (4,000 m) tiene fecha de entrega confirmada para el 13 Sep, pero la OP-2026-95250 (Panasonic) inicia producción el 11 Sep. Existe un gap temporal de 48 horas con desabasto proyectado de 1,900 m.',
    sku: 'MP-BOPP-050',
    actionLabel: 'Crear requisición complementaria',
    actionType: 'requisition',
    prefillData: {
      sku: 'MP-BOPP-050',
      productName: 'BOPP Blanco Brillante 50 micras 7”',
      brand: 'Avery Dennison',
      quantity: 2000,
      note: 'Generada desde MRP por gap temporal en OP-2026-95250. Demanda acumulada 14 días: 6,200 m; stock útil actual: 900 m; OC-2026-0089 llega con 2 días de retraso.',
      targetWarehouseId: 'ALM-RTM',
    },
  },
  {
    id: 'sug-mrp-2',
    type: 'info',
    title: 'Papel Bond 60g tiene 41 días de cobertura (Sobreinventario)',
    explanation:
      'El inventario útil actual es de 67,000 pliegos y viene en camino la OC-2026-0074 por 35,000 pliegos más. No hay demanda significativa programada después del 20 Sep. Se recomienda posponer compras subsecuentes para optimizar capital de trabajo.',
    sku: 'MP-BOND-060',
    actionLabel: 'Ver cobertura y programar diferimiento',
    actionType: 'delay_purchase',
  },
  {
    id: 'sug-mrp-3',
    type: 'warning',
    title: 'Cartulina Sulfatada tiene 3 OPs en la misma semana (Consolidar compra)',
    explanation:
      'Las órdenes OP-95252 (Medifarma), OP-95257 (Fresenius) y OP-95260 (Truper) consumen Cartulina Sulfatada 14 pts sumando 18,500 pliegos en 7 días contra un stock útil de sólo 2,500 pliegos. Aunque la OC-0081 aporta 12,000 pliegos, persiste un déficit neto de 4,000 pliegos.',
    sku: 'MP-SULF-014',
    actionLabel: 'Preparar requisición consolidada (4,000 pliegos)',
    actionType: 'consolidate',
    prefillData: {
      sku: 'MP-SULF-014',
      productName: 'Cartulina Sulfatada 1 Cara 14 pts 70x95 cm',
      brand: 'Papelera Del Plata',
      quantity: 5000,
      note: 'Requisición consolidada MRP para cubrir déficit neto en tirajes de Medifarma, Fresenius y Truper.',
      targetWarehouseId: 'ALM-RTM',
    },
  },
  {
    id: 'sug-mrp-4',
    type: 'success',
    title: 'Existe remanente compatible antes de comprar sustrato nuevo',
    explanation:
      'El remanente REM-075-014 (BOPP Blanco, 746 m en Rack R-1) fue liberado por Calidad con 100% de aptitud y puede cubrir el 26% de la necesidad inmediata de OP-2026-95250 sin generar gasto adicional.',
    sku: 'MP-BOPP-050',
    actionLabel: 'Asignar remanente a OP-2026-95250',
    actionType: 'remnant',
  },
];

// ----------------------------------------------------
// SELECTORES Y FUNCIONES DE FILTRADO
// ----------------------------------------------------

export function filterMrpMaterials(
  materials: MrpMaterialPlanningItem[],
  horizon: MrpHorizon,
  area: MrpArea,
  status: MrpStatus,
  searchTerm: string
): MrpMaterialPlanningItem[] {
  return materials.filter((item) => {
    // Filtro por Área
    if (area !== 'Todas' && item.area !== area) return false;

    // Filtro por Estado
    if (status !== 'Todos') {
      if (status === 'Riesgo' && item.status !== 'Riesgo' && item.status !== 'Cobertura insuficiente') {
        return false;
      }
      if (status === 'Faltante' && item.status !== 'Faltante') return false;
      if (status === 'Cubierto' && item.status !== 'Cubierto' && item.status !== 'Próximo a mínimo') {
        return false;
      }
      if (status === 'Sobreinventario' && item.status !== 'Sobreinventario') return false;
    }

    // Filtro por Buscador (SKU, nombre, proveedor, categoría)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        item.sku.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.preferredSupplier.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}
