// ============================================================================
// FUENTE DE VERDAD FINANCIERA UNIFICADA — RTM DEMO
// Estados Financieros, Activos Fijos, Pólizas, Auxiliares y Biblioteca de Reportes
// ============================================================================

export interface FixedAssetItem {
  id: string; // Clave AF-0001
  code: string; // Código técnico de máquina OFF-01, FLX-01, etc.
  name: string;
  category: 'Maquinaria Offset' | 'Maquinaria Flexografía' | 'Acabado y Corte' | 'Servicios de Planta' | 'Equipo de Cómputo & TI' | 'Mobiliario & Transporte';
  area: 'Offset · Producción' | 'Flexografía · Producción' | 'Acabados · Producción' | 'Servicios · Planta' | 'Administración · TI' | 'Almacén · Logística';
  brand: string;
  model: string;
  serialNumber: string;
  acquisitionDate: string; // YYYY-MM-DD
  supplierName: string;
  supplierRfc: string;
  purchaseOrderFolio: string;
  supplierInvoiceFolio: string;
  historicalCost: number;
  residualValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'Línea recta (10% anual)' | 'Línea recta (5% anual)' | 'Línea recta (25% anual)' | 'Línea recta (33% anual)';
  monthlyDepreciation: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  remainingMonths: number;
  accountingAccountAsset: string; // e.g. 1201-01
  accountingAccountDep: string; // e.g. 1202-01
  accountingAccountExpense: string; // e.g. 5103 o 6104
  acquisitionPolicyFolio: string;
  lastDepreciationPolicyFolio: string;
  accountingStatus: 'Activo' | 'En proceso de baja' | 'Baja';
  operatingStatus: 'Operativo' | 'Mantenimiento' | 'Fuera de servicio';
  location: string;
  costCenter: 'CC-OFF-01 Offset' | 'CC-FLX-01 Flexo' | 'CC-ACA-01 Acabados' | 'CC-PLT-01 Servicios' | 'CC-ADM-01 Administración' | 'CC-ALM-01 Logística';
  responsibleEmployee: string;
  capexOrigin?: string;
  machineId?: string; // ID en Mantenimiento Industrial (INITIAL_MACHINES)
  documents: {
    title: string;
    type: 'Factura Proveedor' | 'Orden de Compra' | 'Póliza de Alta' | 'Pedimento de Importación' | 'Certificado de Garantía';
    folio: string;
    fileSize: string;
  }[];
  maintenanceSummary: {
    lastPreventiveDate: string;
    nextPreventiveDate: string;
    operatingHoursYtd: number;
    activeWorkOrdersCount: number;
    maintenanceCostYtd: number;
    workOrderFolios: string[];
  };
}

export interface AssetMovement {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  type: 'Alta' | 'Depreciación mensual' | 'Mantenimiento capitalizado' | 'Reubicación' | 'Baja';
  folio: string;
  amount: number;
  responsible: string;
  notes: string;
}

// ----------------------------------------------------------------------------
// 1. CATÁLOGO MAESTRO DE ACTIVOS FIJOS (20 ACTIVOS COHERENTES CON RTM)
// Totales calibrados:
// Costo Histórico: $14,850,000 MXN
// Depreciación Acumulada: $5,920,000 MXN
// Valor Neto en Libros: $8,930,000 MXN
// Depreciación Mensual: $115,400 MXN
// ----------------------------------------------------------------------------
export const INITIAL_FIXED_ASSETS: FixedAssetItem[] = [
  // --- OFFSET ---
  {
    id: 'AF-0001',
    code: 'OFF-01',
    name: 'Prensa Heidelberg Speedmaster SM 74',
    category: 'Maquinaria Offset',
    area: 'Offset · Producción',
    brand: 'Heidelberg',
    model: 'Speedmaster SM 74-4-P',
    serialNumber: 'HS-744P-2018-9102',
    acquisitionDate: '2018-03-15',
    supplierName: 'Heidelberg México S.A. de C.V.',
    supplierRfc: 'HME920412KL9',
    purchaseOrderFolio: 'OC-2018-0412',
    supplierInvoiceFolio: 'FP-882194',
    historicalCost: 3200000,
    residualValue: 320000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 24000,
    accumulatedDepreciation: 1968000,
    netBookValue: 1232000,
    remainingMonths: 18,
    accountingAccountAsset: '1201-01 Maquinaria Offset',
    accountingAccountDep: '1202-01 Deprec. Acum. Maquinaria Offset',
    accountingAccountExpense: '5103-01 Depreciación Fabril Offset',
    acquisitionPolicyFolio: 'PAF-2018-001',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 1 · Bahía Offset Principal',
    costCenter: 'CC-OFF-01 Offset',
    responsibleEmployee: 'Ing. Roberto Garza',
    capexOrigin: 'CAPEX Modernización Planta 2018',
    machineId: 'maq-01',
    documents: [
      { title: 'Factura Comercial Heidelberg', type: 'Factura Proveedor', folio: 'FP-882194', fileSize: '2.4 MB' },
      { title: 'Orden de Compra Aprobada', type: 'Orden de Compra', folio: 'OC-2018-0412', fileSize: '850 KB' },
      { title: 'Póliza Contable de Activación', type: 'Póliza de Alta', folio: 'PAF-2018-001', fileSize: '320 KB' },
      { title: 'Pedimento Aduanal Definitivo A1', type: 'Pedimento de Importación', folio: 'PED-18-4082', fileSize: '1.8 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '01 Sep 2026',
      nextPreventiveDate: '01 Oct 2026',
      operatingHoursYtd: 2840,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 42500,
      workOrderFolios: ['OT-MANT-2026-088']
    }
  },
  {
    id: 'AF-0002',
    code: 'OFF-02',
    name: 'Prensa Rotativa Harris 4 Colores',
    category: 'Maquinaria Offset',
    area: 'Offset · Producción',
    brand: 'Harris Graphics',
    model: 'M-110 Web Press',
    serialNumber: 'HG-110W-2016-5541',
    acquisitionDate: '2016-07-20',
    supplierName: 'Graphic Systems USA Corp',
    supplierRfc: 'GSU980311US1',
    purchaseOrderFolio: 'OC-2016-0189',
    supplierInvoiceFolio: 'FP-441092',
    historicalCost: 1950000,
    residualValue: 195000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 14625,
    accumulatedDepreciation: 1447875,
    netBookValue: 502125,
    remainingMonths: 22,
    accountingAccountAsset: '1201-01 Maquinaria Offset',
    accountingAccountDep: '1202-01 Deprec. Acum. Maquinaria Offset',
    accountingAccountExpense: '5103-01 Depreciación Fabril Offset',
    acquisitionPolicyFolio: 'PAF-2016-014',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 1 · Bahía Offset 2',
    costCenter: 'CC-OFF-01 Offset',
    responsibleEmployee: 'Martín Escobedo',
    capexOrigin: 'CAPEX Expansión Offset 2016',
    machineId: 'maq-02',
    documents: [
      { title: 'Factura Proveedor Harris', type: 'Factura Proveedor', folio: 'FP-441092', fileSize: '1.9 MB' },
      { title: 'Orden de Compra Importación', type: 'Orden de Compra', folio: 'OC-2016-0189', fileSize: '640 KB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '10 Ago 2026',
      nextPreventiveDate: '10 Sep 2026',
      operatingHoursYtd: 3120,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 38200,
      workOrderFolios: ['OT-MANT-2026-074']
    }
  },
  {
    id: 'AF-0003',
    code: 'OFF-03',
    name: 'Prensa DiDDE Web Press 860',
    category: 'Maquinaria Offset',
    area: 'Offset · Producción',
    brand: 'DiDDE',
    model: 'Glaser 860',
    serialNumber: 'DG-860-2017-3310',
    acquisitionDate: '2017-04-10',
    supplierName: 'Equipos Gráficos de Monterrey S.A.',
    supplierRfc: 'EGM940510A88',
    purchaseOrderFolio: 'OC-2017-0205',
    supplierInvoiceFolio: 'FP-551980',
    historicalCost: 1400000,
    residualValue: 140000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 10500,
    accumulatedDepreciation: 987000,
    netBookValue: 413000,
    remainingMonths: 26,
    accountingAccountAsset: '1201-01 Maquinaria Offset',
    accountingAccountDep: '1202-01 Deprec. Acum. Maquinaria Offset',
    accountingAccountExpense: '5103-01 Depreciación Fabril Offset',
    acquisitionPolicyFolio: 'PAF-2017-009',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 1 · Bahía Offset 3',
    costCenter: 'CC-OFF-01 Offset',
    responsibleEmployee: 'Martín Escobedo',
    capexOrigin: 'CAPEX Continuo 2017',
    machineId: 'maq-03',
    documents: [
      { title: 'Factura DiDDE Web Press', type: 'Factura Proveedor', folio: 'FP-551980', fileSize: '1.2 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '15 Ago 2026',
      nextPreventiveDate: '15 Sep 2026',
      operatingHoursYtd: 2650,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 21900,
      workOrderFolios: ['OT-MANT-2026-061']
    }
  },
  {
    id: 'AF-0004',
    code: 'OFF-04',
    name: 'Prensa Conserver 8 Colores Rotativa',
    category: 'Maquinaria Offset',
    area: 'Offset · Producción',
    brand: 'Conserver',
    model: 'Rotary 8C Pro',
    serialNumber: 'CR-8CP-2021-0042',
    acquisitionDate: '2021-02-18',
    supplierName: 'Representaciones Gráficas Industriales',
    supplierRfc: 'RGI030419TT2',
    purchaseOrderFolio: 'OC-2021-0062',
    supplierInvoiceFolio: 'FP-772901',
    historicalCost: 2100000,
    residualValue: 210000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 15750,
    accumulatedDepreciation: 708750,
    netBookValue: 1391250,
    remainingMonths: 53,
    accountingAccountAsset: '1201-01 Maquinaria Offset',
    accountingAccountDep: '1202-01 Deprec. Acum. Maquinaria Offset',
    accountingAccountExpense: '5103-01 Depreciación Fabril Offset',
    acquisitionPolicyFolio: 'PAF-2021-003',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 1 · Bahía Offset Central',
    costCenter: 'CC-OFF-01 Offset',
    responsibleEmployee: 'Ing. Roberto Garza',
    capexOrigin: 'CAPEX Modernización Offset 2021',
    machineId: 'maq-04',
    documents: [
      { title: 'Factura Conserver 8C', type: 'Factura Proveedor', folio: 'FP-772901', fileSize: '2.1 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '28 Ago 2026',
      nextPreventiveDate: '28 Sep 2026',
      operatingHoursYtd: 3400,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 29000,
      workOrderFolios: ['OT-MANT-2026-079']
    }
  },
  {
    id: 'AF-0005',
    code: 'OFF-05',
    name: 'Prensa Pliego Ryobi 524 HE',
    category: 'Maquinaria Offset',
    area: 'Offset · Producción',
    brand: 'Ryobi MHI',
    model: '524 HE 4-Color',
    serialNumber: 'RY-524-2015-1892',
    acquisitionDate: '2015-11-05',
    supplierName: 'Ryobi Mexicana de Artes Gráficas',
    supplierRfc: 'RMA950821M99',
    purchaseOrderFolio: 'OC-2015-0320',
    supplierInvoiceFolio: 'FP-310892',
    historicalCost: 950000,
    residualValue: 95000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 7125,
    accumulatedDepreciation: 855000,
    netBookValue: 95000,
    remainingMonths: 2,
    accountingAccountAsset: '1201-01 Maquinaria Offset',
    accountingAccountDep: '1202-01 Deprec. Acum. Maquinaria Offset',
    accountingAccountExpense: '5103-01 Depreciación Fabril Offset',
    acquisitionPolicyFolio: 'PAF-2015-019',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 1 · Bahía Offset Pliegos Cortos',
    costCenter: 'CC-OFF-01 Offset',
    responsibleEmployee: 'Martín Escobedo',
    capexOrigin: 'Activo Inicial Planta',
    machineId: 'maq-05',
    documents: [
      { title: 'Factura Ryobi', type: 'Factura Proveedor', folio: 'FP-310892', fileSize: '1.1 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '12 Ago 2026',
      nextPreventiveDate: '12 Sep 2026',
      operatingHoursYtd: 1980,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 14200,
      workOrderFolios: ['OT-MANT-2026-054']
    }
  },

  // --- FLEXOGRAFÍA ---
  {
    id: 'AF-0006',
    code: 'FLX-01',
    name: 'Prensa Flexográfica Mark Andy 830 7"',
    category: 'Maquinaria Flexografía',
    area: 'Flexografía · Producción',
    brand: 'Mark Andy',
    model: '830 7-Inch 3-Color',
    serialNumber: 'MA-8307-2019-1144',
    acquisitionDate: '2019-05-12',
    supplierName: 'Mark Andy Print Products México',
    supplierRfc: 'MAP050318KP1',
    purchaseOrderFolio: 'OC-2019-0115',
    supplierInvoiceFolio: 'FP-601924',
    historicalCost: 1100000,
    residualValue: 110000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 8250,
    accumulatedDepreciation: 594000,
    netBookValue: 506000,
    remainingMonths: 32,
    accountingAccountAsset: '1201-02 Maquinaria Flexografía',
    accountingAccountDep: '1202-02 Deprec. Acum. Flexografía',
    accountingAccountExpense: '5103-02 Depreciación Fabril Flexo',
    acquisitionPolicyFolio: 'PAF-2019-005',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 2 · Línea Flexo 1',
    costCenter: 'CC-FLX-01 Flexo',
    responsibleEmployee: 'Julio Morales (Flexo)',
    capexOrigin: 'CAPEX Etiquetas Banda Estrecha 2019',
    machineId: 'maq-06',
    documents: [
      { title: 'Factura Mark Andy 830', type: 'Factura Proveedor', folio: 'FP-601924', fileSize: '1.7 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '02 Sep 2026',
      nextPreventiveDate: '02 Oct 2026',
      operatingHoursYtd: 3340,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 31000,
      workOrderFolios: ['OT-MANT-2026-085']
    }
  },
  {
    id: 'AF-0007',
    code: 'FLX-02',
    name: 'Prensa Flexográfica Mark Andy 830 10"',
    category: 'Maquinaria Flexografía',
    area: 'Flexografía · Producción',
    brand: 'Mark Andy',
    model: '830 10-Inch 4-Color',
    serialNumber: 'MA-83010-2018-8821',
    acquisitionDate: '2018-09-25',
    supplierName: 'Mark Andy Print Products México',
    supplierRfc: 'MAP050318KP1',
    purchaseOrderFolio: 'OC-2018-0382',
    supplierInvoiceFolio: 'FP-590112',
    historicalCost: 1350000,
    residualValue: 135000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 10125,
    accumulatedDepreciation: 810000,
    netBookValue: 540000,
    remainingMonths: 24,
    accountingAccountAsset: '1201-02 Maquinaria Flexografía',
    accountingAccountDep: '1202-02 Deprec. Acum. Flexografía',
    accountingAccountExpense: '5103-02 Depreciación Fabril Flexo',
    acquisitionPolicyFolio: 'PAF-2018-012',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 2 · Línea Flexo 2',
    costCenter: 'CC-FLX-01 Flexo',
    responsibleEmployee: 'Julio Morales (Flexo)',
    capexOrigin: 'CAPEX Flexografía 2018',
    machineId: 'maq-07',
    documents: [
      { title: 'Factura Mark Andy 10"', type: 'Factura Proveedor', folio: 'FP-590112', fileSize: '1.8 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '20 Ago 2026',
      nextPreventiveDate: '20 Sep 2026',
      operatingHoursYtd: 3600,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 28400,
      workOrderFolios: ['OT-MANT-2026-072']
    }
  },
  {
    id: 'AF-0008',
    code: 'FLX-03',
    name: 'Prensa Flexográfica Mark Andy Scout 10"',
    category: 'Maquinaria Flexografía',
    area: 'Flexografía · Producción',
    brand: 'Mark Andy',
    model: 'Scout 10" Servo',
    serialNumber: 'MA-SCT-2022-4401',
    acquisitionDate: '2022-06-14',
    supplierName: 'Mark Andy Print Products México',
    supplierRfc: 'MAP050318KP1',
    purchaseOrderFolio: 'OC-2022-0199',
    supplierInvoiceFolio: 'FP-811090',
    historicalCost: 1750000,
    residualValue: 175000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 13125,
    accumulatedDepreciation: 525000,
    netBookValue: 1225000,
    remainingMonths: 69,
    accountingAccountAsset: '1201-02 Maquinaria Flexografía',
    accountingAccountDep: '1202-02 Deprec. Acum. Flexografía',
    accountingAccountExpense: '5103-02 Depreciación Fabril Flexo',
    acquisitionPolicyFolio: 'PAF-2022-008',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 2 · Bahía Servo Flexo',
    costCenter: 'CC-FLX-01 Flexo',
    responsibleEmployee: 'Julio Morales (Flexo)',
    capexOrigin: 'CAPEX Modernización Flexo 2022',
    machineId: 'maq-08',
    documents: [
      { title: 'Factura Mark Andy Scout', type: 'Factura Proveedor', folio: 'FP-811090', fileSize: '2.5 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '05 Sep 2026',
      nextPreventiveDate: '05 Oct 2026',
      operatingHoursYtd: 3890,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 34000,
      workOrderFolios: ['OT-MANT-2026-091']
    }
  },
  {
    id: 'AF-0009',
    code: 'FLX-04',
    name: 'Prensa Flexo Mark Andy 4120 17" Banda Ancha',
    category: 'Maquinaria Flexografía',
    area: 'Flexografía · Producción',
    brand: 'Mark Andy',
    model: '4120 17-Inch 8-Color UV',
    serialNumber: 'MA-4120-2020-0982',
    acquisitionDate: '2020-10-18',
    supplierName: 'Mark Andy Print Products México',
    supplierRfc: 'MAP050318KP1',
    purchaseOrderFolio: 'OC-2020-0250',
    supplierInvoiceFolio: 'FP-720194',
    historicalCost: 2450000,
    residualValue: 245000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 18375,
    accumulatedDepreciation: 1102500,
    netBookValue: 1347500,
    remainingMonths: 49,
    accountingAccountAsset: '1201-02 Maquinaria Flexografía',
    accountingAccountDep: '1202-02 Deprec. Acum. Flexografía',
    accountingAccountExpense: '5103-02 Depreciación Fabril Flexo',
    acquisitionPolicyFolio: 'PAF-2020-011',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 2 · Bahía Flexo Pesada',
    costCenter: 'CC-FLX-01 Flexo',
    responsibleEmployee: 'Julio Morales (Flexo)',
    capexOrigin: 'CAPEX Expansión Capacidad Flexo 2020',
    machineId: 'maq-09',
    documents: [
      { title: 'Factura Mark Andy 4120', type: 'Factura Proveedor', folio: 'FP-720194', fileSize: '2.8 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '18 Ago 2026',
      nextPreventiveDate: '18 Sep 2026',
      operatingHoursYtd: 4120,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 46200,
      workOrderFolios: ['OT-MANT-2026-068']
    }
  },
  {
    id: 'AF-0010',
    code: 'FLX-05',
    name: 'Prensa Rotativa Allied Gear 10"',
    category: 'Maquinaria Flexografía',
    area: 'Flexografía · Producción',
    brand: 'Allied Gear',
    model: 'Flexomaster 250',
    serialNumber: 'AG-FM250-2016-1029',
    acquisitionDate: '2016-04-15',
    supplierName: 'Sistemas Flexográficos del Norte',
    supplierRfc: 'SFN990115PL0',
    purchaseOrderFolio: 'OC-2016-0098',
    supplierInvoiceFolio: 'FP-392018',
    historicalCost: 850000,
    residualValue: 85000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 6375,
    accumulatedDepreciation: 701250,
    netBookValue: 148750,
    remainingMonths: 15,
    accountingAccountAsset: '1201-02 Maquinaria Flexografía',
    accountingAccountDep: '1202-02 Deprec. Acum. Flexografía',
    accountingAccountExpense: '5103-02 Depreciación Fabril Flexo',
    acquisitionPolicyFolio: 'PAF-2016-004',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 2 · Bahía Flexo 3',
    costCenter: 'CC-FLX-01 Flexo',
    responsibleEmployee: 'Julio Morales (Flexo)',
    capexOrigin: 'Activo Inicial Flexo',
    machineId: 'maq-10',
    documents: [
      { title: 'Factura Allied Gear', type: 'Factura Proveedor', folio: 'FP-392018', fileSize: '1.4 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '14 Ago 2026',
      nextPreventiveDate: '14 Sep 2026',
      operatingHoursYtd: 2400,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 18900,
      workOrderFolios: ['OT-MANT-2026-059']
    }
  },
  {
    id: 'AF-0011',
    code: 'FLX-06',
    name: 'Rebobinadora e Inspeccionadora Rotoflex I',
    category: 'Maquinaria Flexografía',
    area: 'Flexografía · Producción',
    brand: 'Rotoflex',
    model: 'VSI 330 Optical',
    serialNumber: 'RF-VSI-2021-3301',
    acquisitionDate: '2021-08-10',
    supplierName: 'Rotoflex Finishing Solutions',
    supplierRfc: 'RFS120610LL8',
    purchaseOrderFolio: 'OC-2021-0288',
    supplierInvoiceFolio: 'FP-802194',
    historicalCost: 650000,
    residualValue: 65000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 4875,
    accumulatedDepreciation: 253500,
    netBookValue: 396500,
    remainingMonths: 59,
    accountingAccountAsset: '1201-02 Maquinaria Flexografía',
    accountingAccountDep: '1202-02 Deprec. Acum. Flexografía',
    accountingAccountExpense: '5103-02 Depreciación Fabril Flexo',
    acquisitionPolicyFolio: 'PAF-2021-015',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 2 · Área de Inspección Final',
    costCenter: 'CC-FLX-01 Flexo',
    responsibleEmployee: 'Carlos Ramos (Calidad Flexo)',
    capexOrigin: 'CAPEX Inspección 100% 2021',
    machineId: 'maq-11',
    documents: [
      { title: 'Factura Rotoflex VSI', type: 'Factura Proveedor', folio: 'FP-802194', fileSize: '1.6 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '01 Sep 2026',
      nextPreventiveDate: '01 Oct 2026',
      operatingHoursYtd: 3100,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 12500,
      workOrderFolios: ['OT-MANT-2026-082']
    }
  },
  {
    id: 'AF-0012',
    code: 'FLX-07',
    name: 'Rebobinadora de Alta Velocidad BGM 2',
    category: 'Maquinaria Flexografía',
    area: 'Flexografía · Producción',
    brand: 'Bar Graphic Machinery',
    model: 'Elite 410 Re-winder',
    serialNumber: 'BGM-EL410-2023-019',
    acquisitionDate: '2023-03-22',
    supplierName: 'Bar Graphic Machinery Ltd / Impresoras del Valle',
    supplierRfc: 'IDV140220991',
    purchaseOrderFolio: 'OC-2023-0081',
    supplierInvoiceFolio: 'FP-914021',
    historicalCost: 720000,
    residualValue: 72000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 5400,
    accumulatedDepreciation: 189000,
    netBookValue: 531000,
    remainingMonths: 78,
    accountingAccountAsset: '1201-02 Maquinaria Flexografía',
    accountingAccountDep: '1202-02 Deprec. Acum. Flexografía',
    accountingAccountExpense: '5103-02 Depreciación Fabril Flexo',
    acquisitionPolicyFolio: 'PAF-2023-004',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 2 · Área de Rebobinado 2',
    costCenter: 'CC-FLX-01 Flexo',
    responsibleEmployee: 'Julio Morales (Flexo)',
    capexOrigin: 'CAPEX Cuello de Botella Rebobinado 2023',
    machineId: 'maq-12',
    documents: [
      { title: 'Factura BGM Elite', type: 'Factura Proveedor', folio: 'FP-914021', fileSize: '1.9 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '25 Ago 2026',
      nextPreventiveDate: '25 Sep 2026',
      operatingHoursYtd: 2900,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 15400,
      workOrderFolios: ['OT-MANT-2026-077']
    }
  },

  // --- ACABADOS & CORTE ---
  {
    id: 'AF-0013',
    code: 'ACA-01',
    name: 'Guillotina Programable Polar 115 X',
    category: 'Acabado y Corte',
    area: 'Acabados · Producción',
    brand: 'Polar Mohr',
    model: 'Polar 115 X Plus',
    serialNumber: 'PL-115X-2017-6629',
    acquisitionDate: '2017-09-18',
    supplierName: 'Heidelberg México S.A. de C.V.',
    supplierRfc: 'HME920412KL9',
    purchaseOrderFolio: 'OC-2017-0341',
    supplierInvoiceFolio: 'FP-588190',
    historicalCost: 880000,
    residualValue: 88000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 6600,
    accumulatedDepreciation: 646800,
    netBookValue: 233200,
    remainingMonths: 12,
    accountingAccountAsset: '1201-03 Maquinaria Acabado y Corte',
    accountingAccountDep: '1202-03 Deprec. Acum. Acabados',
    accountingAccountExpense: '5103-03 Depreciación Fabril Acabados',
    acquisitionPolicyFolio: 'PAF-2017-018',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 1 · Bahía de Corte',
    costCenter: 'CC-ACA-01 Acabados',
    responsibleEmployee: 'Gonzalo Treviño',
    capexOrigin: 'CAPEX Corte y Desbaste 2017',
    machineId: 'maq-13',
    documents: [
      { title: 'Factura Guillotina Polar', type: 'Factura Proveedor', folio: 'FP-588190', fileSize: '1.5 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '10 Ago 2026',
      nextPreventiveDate: '10 Sep 2026',
      operatingHoursYtd: 2780,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 22100,
      workOrderFolios: ['OT-MANT-2026-064']
    }
  },
  {
    id: 'AF-0014',
    code: 'ACA-02',
    name: 'Plegadora Automática Stahlfolder Ti-52',
    category: 'Acabado y Corte',
    area: 'Acabados · Producción',
    brand: 'Heidelberg Stahl',
    model: 'Ti-52 4/4 Tremat',
    serialNumber: 'ST-TI52-2019-0419',
    acquisitionDate: '2019-11-20',
    supplierName: 'Heidelberg México S.A. de C.V.',
    supplierRfc: 'HME920412KL9',
    purchaseOrderFolio: 'OC-2019-0422',
    supplierInvoiceFolio: 'FP-688192',
    historicalCost: 780000,
    residualValue: 78000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 5850,
    accumulatedDepreciation: 432900,
    netBookValue: 347100,
    remainingMonths: 38,
    accountingAccountAsset: '1201-03 Maquinaria Acabado y Corte',
    accountingAccountDep: '1202-03 Deprec. Acum. Acabados',
    accountingAccountExpense: '5103-03 Depreciación Fabril Acabados',
    acquisitionPolicyFolio: 'PAF-2019-019',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Mantenimiento',
    location: 'Nave 1 · Bahía de Plegado',
    costCenter: 'CC-ACA-01 Acabados',
    responsibleEmployee: 'Gonzalo Treviño',
    capexOrigin: 'CAPEX Acabados 2019',
    machineId: 'maq-14',
    documents: [
      { title: 'Factura Stahlfolder Ti-52', type: 'Factura Proveedor', folio: 'FP-688192', fileSize: '1.4 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '03 Sep 2026',
      nextPreventiveDate: '03 Oct 2026',
      operatingHoursYtd: 3150,
      activeWorkOrdersCount: 1,
      maintenanceCostYtd: 34800,
      workOrderFolios: ['OT-MANT-2026-092']
    }
  },
  {
    id: 'AF-0015',
    code: 'ACA-03',
    name: 'Tren de Encuadernación Muller Martini Precioso',
    category: 'Acabado y Corte',
    area: 'Acabados · Producción',
    brand: 'Muller Martini',
    model: 'Precioso 6 Estaciones + Trilateral',
    serialNumber: 'MM-PRC-2018-7714',
    acquisitionDate: '2018-04-12',
    supplierName: 'Muller Martini Maquinaria México',
    supplierRfc: 'MMM010415AA2',
    purchaseOrderFolio: 'OC-2018-0155',
    supplierInvoiceFolio: 'FP-511082',
    historicalCost: 1450000,
    residualValue: 145000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 10875,
    accumulatedDepreciation: 902625,
    netBookValue: 547375,
    remainingMonths: 19,
    accountingAccountAsset: '1201-03 Maquinaria Acabado y Corte',
    accountingAccountDep: '1202-03 Deprec. Acum. Acabados',
    accountingAccountExpense: '5103-03 Depreciación Fabril Acabados',
    acquisitionPolicyFolio: 'PAF-2018-005',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Nave 1 · Bahía de Encuadernado y Grapa',
    costCenter: 'CC-ACA-01 Acabados',
    responsibleEmployee: 'Gonzalo Treviño',
    capexOrigin: 'CAPEX Revista y Encuadernado 2018',
    machineId: 'maq-15',
    documents: [
      { title: 'Factura Muller Martini', type: 'Factura Proveedor', folio: 'FP-511082', fileSize: '2.2 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '15 Ago 2026',
      nextPreventiveDate: '15 Sep 2026',
      operatingHoursYtd: 2200,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 26500,
      workOrderFolios: ['OT-MANT-2026-062']
    }
  },

  // --- SERVICIOS DE PLANTA & LOGÍSTICA ---
  {
    id: 'AF-0016',
    code: 'PLT-01',
    name: 'Compresor de Tornillo Kaeser CSD 105',
    category: 'Servicios de Planta',
    area: 'Servicios · Planta',
    brand: 'Kaeser Kompressoren',
    model: 'CSD 105 SFC VSD',
    serialNumber: 'KS-CSD105-2020-0081',
    acquisitionDate: '2020-06-15',
    supplierName: 'Kaeser Compresores de México S. de R.L.',
    supplierRfc: 'KCM951110T88',
    purchaseOrderFolio: 'OC-2020-0144',
    supplierInvoiceFolio: 'FP-701920',
    historicalCost: 520000,
    residualValue: 52000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 3900,
    accumulatedDepreciation: 253500,
    netBookValue: 266500,
    remainingMonths: 45,
    accountingAccountAsset: '1201-04 Servicios e Infraestructura Planta',
    accountingAccountDep: '1202-04 Deprec. Acum. Servicios Planta',
    accountingAccountExpense: '5103-04 Servicios Generales Fabriles',
    acquisitionPolicyFolio: 'PAF-2020-007',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Cuarto de Máquinas y Servicios',
    costCenter: 'CC-PLT-01 Servicios',
    responsibleEmployee: 'Ing. Fernando Valdés',
    capexOrigin: 'CAPEX Aire Comprimido Libre de Aceite 2020',
    machineId: 'maq-16',
    documents: [
      { title: 'Factura Kaeser', type: 'Factura Proveedor', folio: 'FP-701920', fileSize: '1.5 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '01 Sep 2026',
      nextPreventiveDate: '01 Dic 2026',
      operatingHoursYtd: 5800,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 18200,
      workOrderFolios: ['OT-MANT-2026-081']
    }
  },
  {
    id: 'AF-0017',
    code: 'ALM-01',
    name: 'Montacargas Eléctrico Hombre Sentado Yale 2.5 Ton',
    category: 'Mobiliario & Transporte',
    area: 'Almacén · Logística',
    brand: 'Yale',
    model: 'ERP050VL Electric Forklift',
    serialNumber: 'YL-ERP050-2021-9921',
    acquisitionDate: '2021-03-10',
    supplierName: 'Equipos y Maquinaria de Carga S.A.',
    supplierRfc: 'EMC040812JA1',
    purchaseOrderFolio: 'OC-2021-0078',
    supplierInvoiceFolio: 'FP-765012',
    historicalCost: 480000,
    residualValue: 48000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 3600,
    accumulatedDepreciation: 219600,
    netBookValue: 260400,
    remainingMonths: 54,
    accountingAccountAsset: '1201-05 Equipo de Transporte y Almacén',
    accountingAccountDep: '1202-05 Deprec. Acum. Transporte',
    accountingAccountExpense: '6105-01 Gastos de Almacén',
    acquisitionPolicyFolio: 'PAF-2021-006',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Almacén General y Andenes',
    costCenter: 'CC-ALM-01 Logística',
    responsibleEmployee: 'Ramón Castillo',
    capexOrigin: 'CAPEX Maniobras Almacén 2021',
    documents: [
      { title: 'Factura Yale', type: 'Factura Proveedor', folio: 'FP-765012', fileSize: '1.3 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '15 Ago 2026',
      nextPreventiveDate: '15 Nov 2026',
      operatingHoursYtd: 1800,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 12000,
      workOrderFolios: ['OT-MANT-2026-065']
    }
  },

  // --- EQUIPO DE CÓMPUTO & TI ---
  {
    id: 'AF-0018',
    code: 'TI-01',
    name: 'Servidor Central de Planta Dell PowerEdge R750',
    category: 'Equipo de Cómputo & TI',
    area: 'Administración · TI',
    brand: 'Dell Technologies',
    model: 'PowerEdge R750 2U Dual Xeon',
    serialNumber: 'DELL-PE750-2022-5501',
    acquisitionDate: '2022-09-08',
    supplierName: 'Soluciones Empresariales de TI Monterrey',
    supplierRfc: 'SET080911KP4',
    purchaseOrderFolio: 'OC-2022-0310',
    supplierInvoiceFolio: 'FP-841920',
    historicalCost: 180000,
    residualValue: 0,
    usefulLifeYears: 3,
    depreciationMethod: 'Línea recta (33% anual)',
    monthlyDepreciation: 5000,
    accumulatedDepreciation: 180000,
    netBookValue: 0,
    remainingMonths: 0,
    accountingAccountAsset: '1201-06 Equipo de Cómputo',
    accountingAccountDep: '1202-06 Deprec. Acum. Cómputo',
    accountingAccountExpense: '6103-02 Gastos TI y Cómputo',
    acquisitionPolicyFolio: 'PAF-2022-014',
    lastDepreciationPolicyFolio: 'PDF-2025-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Site de Servidores · Edificio Administrativo',
    costCenter: 'CC-ADM-01 Administración',
    responsibleEmployee: 'Ing. Alejandro Peña (TI)',
    capexOrigin: 'CAPEX Infraestructura TI 2022',
    documents: [
      { title: 'Factura Servidor Dell', type: 'Factura Proveedor', folio: 'FP-841920', fileSize: '980 KB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '01 Jun 2026',
      nextPreventiveDate: '01 Dic 2026',
      operatingHoursYtd: 5900,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 4500,
      workOrderFolios: ['OT-TI-2026-012']
    }
  },
  {
    id: 'AF-0019',
    code: 'TI-02',
    name: 'UPS Industrial Trifásico APC Symmetra PX 40kW',
    category: 'Equipo de Cómputo & TI',
    area: 'Administración · TI',
    brand: 'Schneider Electric / APC',
    model: 'Symmetra PX 40kVA All-In-One',
    serialNumber: 'APC-SY40K-2021-0812',
    acquisitionDate: '2021-10-14',
    supplierName: 'Energía Continua del Norte S.A.',
    supplierRfc: 'ECN030718AB1',
    purchaseOrderFolio: 'OC-2021-0390',
    supplierInvoiceFolio: 'FP-790118',
    historicalCost: 260000,
    residualValue: 26000,
    usefulLifeYears: 5,
    depreciationMethod: 'Línea recta (20% anual)' as any,
    monthlyDepreciation: 3900,
    accumulatedDepreciation: 187200,
    netBookValue: 72800,
    remainingMonths: 11,
    accountingAccountAsset: '1201-06 Equipo de Cómputo y Respaldo',
    accountingAccountDep: '1202-06 Deprec. Acum. Cómputo',
    accountingAccountExpense: '6103-02 Gastos TI y Cómputo',
    acquisitionPolicyFolio: 'PAF-2021-018',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Site de Servidores · Edificio Administrativo',
    costCenter: 'CC-ADM-01 Administración',
    responsibleEmployee: 'Ing. Alejandro Peña (TI)',
    capexOrigin: 'CAPEX Protección Eléctrica Site 2021',
    documents: [
      { title: 'Factura UPS APC', type: 'Factura Proveedor', folio: 'FP-790118', fileSize: '1.2 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '15 Jul 2026',
      nextPreventiveDate: '15 Ene 2027',
      operatingHoursYtd: 5900,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 8200,
      workOrderFolios: ['OT-TI-2026-015']
    }
  },
  {
    id: 'AF-0020',
    code: 'PLT-02',
    name: 'Transformador Eléctrico de Subestación 500 kVA',
    category: 'Servicios de Planta',
    area: 'Servicios · Planta',
    brand: 'Prolec GE',
    model: '500 kVA Tipo Pedestal Radial',
    serialNumber: 'PGE-500K-2016-0911',
    acquisitionDate: '2016-02-10',
    supplierName: 'Prolec GE Distribución S.A. de C.V.',
    supplierRfc: 'PGD950212TT4',
    purchaseOrderFolio: 'OC-2016-0045',
    supplierInvoiceFolio: 'FP-355120',
    historicalCost: 310000,
    residualValue: 31000,
    usefulLifeYears: 10,
    depreciationMethod: 'Línea recta (10% anual)',
    monthlyDepreciation: 2325,
    accumulatedDepreciation: 295425,
    netBookValue: 14575,
    remainingMonths: 5,
    accountingAccountAsset: '1201-04 Servicios e Infraestructura Planta',
    accountingAccountDep: '1202-04 Deprec. Acum. Servicios Planta',
    accountingAccountExpense: '5103-04 Servicios Generales Fabriles',
    acquisitionPolicyFolio: 'PAF-2016-002',
    lastDepreciationPolicyFolio: 'PDF-2026-009',
    accountingStatus: 'Activo',
    operatingStatus: 'Operativo',
    location: 'Subestación Eléctrica Exterior',
    costCenter: 'CC-PLT-01 Servicios',
    responsibleEmployee: 'Ing. Fernando Valdés',
    capexOrigin: 'Infraestructura Inicial Planta',
    documents: [
      { title: 'Factura Subestación Prolec', type: 'Factura Proveedor', folio: 'FP-355120', fileSize: '1.8 MB' }
    ],
    maintenanceSummary: {
      lastPreventiveDate: '10 Feb 2026',
      nextPreventiveDate: '10 Feb 2027',
      operatingHoursYtd: 5900,
      activeWorkOrdersCount: 0,
      maintenanceCostYtd: 9500,
      workOrderFolios: ['OT-MANT-2026-018']
    }
  }
];

// ----------------------------------------------------------------------------
// 2. HISTORIAL Y BITÁCORA DE MOVIMIENTOS DE ACTIVOS
// ----------------------------------------------------------------------------
export const INITIAL_ASSET_MOVEMENTS: AssetMovement[] = [
  {
    id: 'MOV-2026-0901',
    date: '01 Sep 2026',
    assetId: 'AF-0001',
    assetName: 'Prensa Heidelberg Speedmaster SM 74',
    type: 'Depreciación mensual',
    folio: 'PDF-2026-009',
    amount: 24000,
    responsible: 'C.P. Mónica Villarreal',
    notes: 'Póliza automática de depreciación fabril ordinaria de septiembre 2026.'
  },
  {
    id: 'MOV-2026-0902',
    date: '01 Sep 2026',
    assetId: 'AF-0008',
    assetName: 'Prensa Flexográfica Mark Andy Scout 10"',
    type: 'Depreciación mensual',
    folio: 'PDF-2026-009',
    amount: 13125,
    responsible: 'C.P. Mónica Villarreal',
    notes: 'Póliza automática de depreciación fabril ordinaria de septiembre 2026.'
  },
  {
    id: 'MOV-2026-0903',
    date: '03 Sep 2026',
    assetId: 'AF-0014',
    assetName: 'Plegadora Automática Stahlfolder Ti-52',
    type: 'Mantenimiento capitalizado',
    folio: 'OT-MANT-2026-092',
    amount: 18500,
    responsible: 'Ing. Roberto Garza',
    notes: 'Reemplazo de rodamientos axiales y servomotores con extensión de vida útil.'
  },
  {
    id: 'MOV-2026-0815',
    date: '15 Ago 2026',
    assetId: 'AF-0012',
    assetName: 'Rebobinadora de Alta Velocidad BGM 2',
    type: 'Reubicación',
    folio: 'REUB-2026-044',
    amount: 0,
    responsible: 'Julio Morales',
    notes: 'Reubicación de nave 1 a nave 2 para optimizar flujo con prensas Flexo.'
  },
  {
    id: 'MOV-2026-0801',
    date: '01 Ago 2026',
    assetId: 'AF-0009',
    assetName: 'Prensa Flexo Mark Andy 4120 17"',
    type: 'Depreciación mensual',
    folio: 'PDF-2026-008',
    amount: 18375,
    responsible: 'C.P. Mónica Villarreal',
    notes: 'Póliza de depreciación mensual agosto 2026.'
  }
];

// ----------------------------------------------------------------------------
// 3. ESTADOS FINANCIEROS Y MODELO CONTABLE MATEMÁTICAMENTE COHERENTE
// ----------------------------------------------------------------------------

export interface FinancialLine {
  id: string;
  code?: string;
  label: string;
  currentAmount: number;
  previousAmount: number;
  varianceAmount: number;
  variancePercent: number;
  isHeader?: boolean;
  isTotal?: boolean;
  indent?: number;
  category: 'ingresos' | 'costos' | 'gastos' | 'activo_circulante' | 'activo_no_circulante' | 'pasivo_circulante' | 'pasivo_no_circulante' | 'capital';
  accountRef?: string;
  drillDownType?: 'cuentas' | 'activos' | 'cxc' | 'cxp' | 'bancos' | 'polizas';
}

export interface IncomeStatementData {
  periodLabel: string;
  previousPeriodLabel: string;
  lines: FinancialLine[];
  totals: {
    totalRevenue: number;
    grossProfit: number;
    operatingProfit: number;
    netProfit: number;
    grossMarginPct: number;
    operatingMarginPct: number;
    netMarginPct: number;
  };
}

export interface BalanceSheetData {
  periodLabel: string;
  lines: FinancialLine[];
  summary: {
    totalCurrentAssets: number;
    totalNonCurrentAssets: number;
    totalAssets: number;
    totalCurrentLiabilities: number;
    totalNonCurrentLiabilities: number;
    totalLiabilities: number;
    totalEquity: number;
    totalLiabilitiesAndEquity: number;
    isBalanced: boolean;
    fixedAssetsNet: number; // $8,930,000 EXACT
  };
}

export interface CashFlowData {
  periodLabel: string;
  lines: FinancialLine[];
  summary: {
    initialCash: number;
    operatingCashFlow: number;
    investingCashFlow: number;
    financingCashFlow: number;
    netChangeInCash: number;
    finalCash: number;
  };
}

// ESTADO DE SITUACIÓN FINANCIERA (BALANCE GENERAL)
export const MOCK_BALANCE_SHEET: BalanceSheetData = {
  periodLabel: 'Septiembre 2026 (Al 07 de Septiembre)',
  lines: [
    // ACTIVO
    { id: 'b-01', label: 'ACTIVO CIRCULANTE', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'activo_circulante' },
    { id: 'b-02', code: '1101', label: 'Efectivo y Equivalentes (Bancos Operativos)', currentAmount: 1485200, previousAmount: 1390000, varianceAmount: 95200, variancePercent: 6.8, indent: 1, category: 'activo_circulante', accountRef: '1101', drillDownType: 'bancos' },
    { id: 'b-03', code: '1102', label: 'Clientes y Cuentas por Cobrar Comerciales', currentAmount: 1280450, previousAmount: 1195000, varianceAmount: 85450, variancePercent: 7.2, indent: 1, category: 'activo_circulante', accountRef: '1102', drillDownType: 'cxc' },
    { id: 'b-04', code: '1103', label: 'Inventarios (Materia Prima, WIP y PT)', currentAmount: 2450000, previousAmount: 2380000, varianceAmount: 70000, variancePercent: 2.9, indent: 1, category: 'activo_circulante', accountRef: '1103', drillDownType: 'cuentas' },
    { id: 'b-05', code: '1104', label: 'Impuestos Acreditables y a Favor (IVA)', currentAmount: 194500, previousAmount: 182000, varianceAmount: 12500, variancePercent: 6.9, indent: 1, category: 'activo_circulante', accountRef: '1104', drillDownType: 'cuentas' },
    { id: 'b-06', label: 'TOTAL ACTIVO CIRCULANTE', currentAmount: 5410150, previousAmount: 5147000, varianceAmount: 263150, variancePercent: 5.1, isTotal: true, category: 'activo_circulante' },

    { id: 'b-07', label: 'ACTIVO NO CIRCULANTE (PROPIEDAD, PLANTA Y EQUIPO)', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'activo_no_circulante' },
    { id: 'b-08', code: '1201', label: 'Maquinaria y Equipo Industrial (Costo Histórico)', currentAmount: 14850000, previousAmount: 14850000, varianceAmount: 0, variancePercent: 0.0, indent: 1, category: 'activo_no_circulante', accountRef: '1201', drillDownType: 'activos' },
    { id: 'b-09', code: '1202', label: 'Menos: Depreciación Acumulada de Maquinaria', currentAmount: -5920000, previousAmount: -5804600, varianceAmount: -115400, variancePercent: 2.0, indent: 1, category: 'activo_no_circulante', accountRef: '1202', drillDownType: 'activos' },
    { id: 'b-10', label: 'Activo Fijo Fabril Neto (Valor en Libros)', currentAmount: 8930000, previousAmount: 9045400, varianceAmount: -115400, variancePercent: -1.3, indent: 2, isTotal: true, category: 'activo_no_circulante', drillDownType: 'activos' },
    { id: 'b-11', code: '1205', label: 'Otros Activos No Circulantes y Depósitos', currentAmount: 420000, previousAmount: 420000, varianceAmount: 0, variancePercent: 0.0, indent: 1, category: 'activo_no_circulante', accountRef: '1205', drillDownType: 'cuentas' },
    { id: 'b-12', label: 'TOTAL ACTIVO NO CIRCULANTE', currentAmount: 9350000, previousAmount: 9465400, varianceAmount: -115400, variancePercent: -1.2, isTotal: true, category: 'activo_no_circulante' },
    { id: 'b-13', label: 'TOTAL DEL ACTIVO', currentAmount: 14760150, previousAmount: 14612400, varianceAmount: 147750, variancePercent: 1.0, isTotal: true, category: 'activo_no_circulante' },

    // PASIVO
    { id: 'b-14', label: 'PASIVO CIRCULANTE (CORTO PLAZO)', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'pasivo_circulante' },
    { id: 'b-15', code: '2101', label: 'Proveedores Nacionales y Extranjeros (CxP)', currentAmount: 1840650, previousAmount: 1795000, varianceAmount: 45650, variancePercent: 2.5, indent: 1, category: 'pasivo_circulante', accountRef: '2101', drillDownType: 'cxp' },
    { id: 'b-16', code: '2102', label: 'Impuestos por Pagar y Retenciones (SAT)', currentAmount: 435200, previousAmount: 420000, varianceAmount: 15200, variancePercent: 3.6, indent: 1, category: 'pasivo_circulante', accountRef: '2102', drillDownType: 'cuentas' },
    { id: 'b-17', code: '2103', label: 'Nóminas y Provisiones Laborales por Pagar', currentAmount: 384300, previousAmount: 375000, varianceAmount: 9300, variancePercent: 2.5, indent: 1, category: 'pasivo_circulante', accountRef: '2103', drillDownType: 'cuentas' },
    { id: 'b-18', label: 'TOTAL PASIVO CIRCULANTE', currentAmount: 2660150, previousAmount: 2590000, varianceAmount: 70150, variancePercent: 2.7, isTotal: true, category: 'pasivo_circulante' },

    { id: 'b-19', label: 'PASIVO A LARGO PLAZO', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'pasivo_no_circulante' },
    { id: 'b-20', code: '2201', label: 'Créditos Refaccionarios Maquinaria (Banorte / BBVA)', currentAmount: 2100000, previousAmount: 2220000, varianceAmount: -120000, variancePercent: -5.4, indent: 1, category: 'pasivo_no_circulante', accountRef: '2201', drillDownType: 'cuentas' },
    { id: 'b-21', label: 'TOTAL DEL PASIVO', currentAmount: 4760150, previousAmount: 4810000, varianceAmount: -49850, variancePercent: -1.0, isTotal: true, category: 'pasivo_no_circulante' },

    // CAPITAL CONTABLE
    { id: 'b-22', label: 'CAPITAL CONTABLE', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'capital' },
    { id: 'b-23', code: '3101', label: 'Capital Social Aportado', currentAmount: 6500000, previousAmount: 6500000, varianceAmount: 0, variancePercent: 0.0, indent: 1, category: 'capital', accountRef: '3101' },
    { id: 'b-24', code: '3201', label: 'Utilidades Acumuladas de Ejercicios Anteriores', currentAmount: 2450000, previousAmount: 2450000, varianceAmount: 0, variancePercent: 0.0, indent: 1, category: 'capital', accountRef: '3201' },
    { id: 'b-25', code: '3301', label: 'Resultado del Ejercicio Actual (2026 YTD)', currentAmount: 1050000, previousAmount: 852400, varianceAmount: 197600, variancePercent: 23.2, indent: 1, category: 'capital', accountRef: '3301' },
    { id: 'b-26', label: 'TOTAL CAPITAL CONTABLE', currentAmount: 10000000, previousAmount: 9802400, varianceAmount: 197600, variancePercent: 2.0, isTotal: true, category: 'capital' },

    { id: 'b-27', label: 'TOTAL PASIVO + CAPITAL CONTABLE', currentAmount: 14760150, previousAmount: 14612400, varianceAmount: 147750, variancePercent: 1.0, isTotal: true, category: 'capital' }
  ],
  summary: {
    totalCurrentAssets: 5410150,
    totalNonCurrentAssets: 9350000,
    totalAssets: 14760150,
    totalCurrentLiabilities: 2660150,
    totalNonCurrentLiabilities: 2100000,
    totalLiabilities: 4760150,
    totalEquity: 10000000,
    totalLiabilitiesAndEquity: 14760150,
    isBalanced: true,
    fixedAssetsNet: 8930000
  }
};

// ESTADO DE RESULTADOS
export const MOCK_INCOME_STATEMENT: IncomeStatementData = {
  periodLabel: 'Septiembre 2026 (Mensual YTD)',
  previousPeriodLabel: 'Agosto 2026',
  lines: [
    { id: 'is-01', label: 'INGRESOS POR VENTAS', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'ingresos' },
    { id: 'is-02', code: '4101', label: 'Ventas Línea Offset (Manuales, Folletos, Plegadizos)', currentAmount: 2150000, previousAmount: 2040000, varianceAmount: 110000, variancePercent: 5.4, indent: 1, category: 'ingresos', accountRef: '4101', drillDownType: 'cuentas' },
    { id: 'is-03', code: '4102', label: 'Ventas Línea Flexografía (Etiquetas, Rollos, BoPP)', currentAmount: 1520000, previousAmount: 1410000, varianceAmount: 110000, variancePercent: 7.8, indent: 1, category: 'ingresos', accountRef: '4102', drillDownType: 'cuentas' },
    { id: 'is-04', code: '4103', label: 'Otros Servicios Gráficos y Acabados Especiales', currentAmount: 180000, previousAmount: 175000, varianceAmount: 5000, variancePercent: 2.9, indent: 1, category: 'ingresos', accountRef: '4103', drillDownType: 'cuentas' },
    { id: 'is-05', label: 'TOTAL DE VENTAS NETAS', currentAmount: 3850000, previousAmount: 3625000, varianceAmount: 225000, variancePercent: 6.2, isTotal: true, category: 'ingresos' },

    { id: 'is-06', label: 'COSTO DE VENTAS (PRODUCCIÓN FABRIL)', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'costos' },
    { id: 'is-07', code: '5101', label: 'Materia Prima Consumida (Papel, Bobinas, Tintas, Barniz)', currentAmount: 1290000, previousAmount: 1220000, varianceAmount: 70000, variancePercent: 5.7, indent: 1, category: 'costos', accountRef: '5101', drillDownType: 'cuentas' },
    { id: 'is-08', code: '5102', label: 'Mano de Obra Directa (Operadores, Prensa, Prensistas)', currentAmount: 580000, previousAmount: 565000, varianceAmount: 15000, variancePercent: 2.7, indent: 1, category: 'costos', accountRef: '5102', drillDownType: 'cuentas' },
    { id: 'is-09', code: '5103', label: 'Depreciación Fabril de Maquinaria y Equipo', currentAmount: 106500, previousAmount: 106500, varianceAmount: 0, variancePercent: 0.0, indent: 1, category: 'costos', accountRef: '5103', drillDownType: 'activos' },
    { id: 'is-10', code: '5104', label: 'Costos Indirectos de Fabricación (Energía, Placas, Suajes)', currentAmount: 253500, previousAmount: 242000, varianceAmount: 11500, variancePercent: 4.8, indent: 1, category: 'costos', accountRef: '5104', drillDownType: 'cuentas' },
    { id: 'is-11', label: 'TOTAL COSTO DE VENTAS', currentAmount: 2230000, previousAmount: 2133500, varianceAmount: 96500, variancePercent: 4.5, isTotal: true, category: 'costos' },
    { id: 'is-12', label: 'UTILIDAD BRUTA', currentAmount: 1620000, previousAmount: 1491500, varianceAmount: 128500, variancePercent: 8.6, isTotal: true, category: 'costos' },

    { id: 'is-13', label: 'GASTOS DE OPERACIÓN', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'gastos' },
    { id: 'is-14', code: '6101', label: 'Gastos de Venta y Comercialización', currentAmount: 245000, previousAmount: 238000, varianceAmount: 7000, variancePercent: 2.9, indent: 1, category: 'gastos', accountRef: '6101' },
    { id: 'is-15', code: '6102', label: 'Gastos de Administración y Dirección', currentAmount: 310000, previousAmount: 302000, varianceAmount: 8000, variancePercent: 2.6, indent: 1, category: 'gastos', accountRef: '6102' },
    { id: 'is-16', code: '6103', label: 'Depreciación No Fabril (TI, Oficinas, Mobiliario)', currentAmount: 8900, previousAmount: 8900, varianceAmount: 0, variancePercent: 0.0, indent: 1, category: 'gastos', accountRef: '6103', drillDownType: 'activos' },
    { id: 'is-17', code: '6104', label: 'Mantenimiento General de Planta y Servicios', currentAmount: 135100, previousAmount: 128000, varianceAmount: 7100, variancePercent: 5.5, indent: 1, category: 'gastos', accountRef: '6104', drillDownType: 'cuentas' },
    { id: 'is-18', label: 'TOTAL GASTOS DE OPERACIÓN', currentAmount: 699000, previousAmount: 676900, varianceAmount: 22100, variancePercent: 3.3, isTotal: true, category: 'gastos' },
    { id: 'is-19', label: 'UTILIDAD DE OPERACIÓN (EBIT)', currentAmount: 921000, previousAmount: 814600, varianceAmount: 106400, variancePercent: 13.1, isTotal: true, category: 'gastos' },

    { id: 'is-20', code: '7101', label: 'Gastos Financieros Netos (Intereses Crédito Maquinaria)', currentAmount: -45000, previousAmount: -47500, varianceAmount: 2500, variancePercent: -5.3, indent: 1, category: 'gastos', accountRef: '7101' },
    { id: 'is-21', label: 'UTILIDAD ANTES DE IMPUESTOS', currentAmount: 876000, previousAmount: 767100, varianceAmount: 108900, variancePercent: 14.2, isTotal: true, category: 'gastos' },
    { id: 'is-22', code: '8101', label: 'Provisión ISR y PTU (30% Estimado)', currentAmount: -262800, previousAmount: -230130, varianceAmount: -32670, variancePercent: 14.2, indent: 1, category: 'gastos', accountRef: '8101' },
    { id: 'is-23', label: 'UTILIDAD NETA DEL PERIODO', currentAmount: 613200, previousAmount: 536970, varianceAmount: 76230, variancePercent: 14.2, isTotal: true, category: 'gastos' }
  ],
  totals: {
    totalRevenue: 3850000,
    grossProfit: 1620000,
    operatingProfit: 921000,
    netProfit: 613200,
    grossMarginPct: 42.1,
    operatingMarginPct: 23.9,
    netMarginPct: 15.9
  }
};

// ESTADO DE FLUJO DE EFECTIVO
export const MOCK_CASH_FLOW: CashFlowData = {
  periodLabel: 'Septiembre 2026 (Mensual YTD)',
  lines: [
    { id: 'cf-01', label: 'ACTIVIDADES DE OPERACIÓN', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'activo_circulante' },
    { id: 'cf-02', label: 'Cobros a Clientes por Venta de Impresos', currentAmount: 3450000, previousAmount: 3280000, varianceAmount: 170000, variancePercent: 5.2, indent: 1, category: 'activo_circulante', drillDownType: 'cxc' },
    { id: 'cf-03', label: 'Pagos a Proveedores de Sustratos y Químicos', currentAmount: -1780000, previousAmount: -1690000, varianceAmount: -90000, variancePercent: 5.3, indent: 1, category: 'activo_circulante', drillDownType: 'cxp' },
    { id: 'cf-04', label: 'Pagos de Nómina Fabril y Administrativa', currentAmount: -820000, previousAmount: -795000, varianceAmount: -25000, variancePercent: 3.1, indent: 1, category: 'activo_circulante' },
    { id: 'cf-05', label: 'Pagos de Impuestos y Servicios de Operación', currentAmount: -415000, previousAmount: -398000, varianceAmount: -17000, variancePercent: 4.3, indent: 1, category: 'activo_circulante' },
    { id: 'cf-06', label: 'Flujo Neto de Actividades de Operación', currentAmount: 435000, previousAmount: 397000, varianceAmount: 38000, variancePercent: 9.6, isTotal: true, category: 'activo_circulante' },

    { id: 'cf-07', label: 'ACTIVIDADES DE INVERSIÓN', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'activo_no_circulante' },
    { id: 'cf-08', label: 'Adquisición y Mejoras de Maquinaria (CAPEX)', currentAmount: -220000, previousAmount: -180000, varianceAmount: -40000, variancePercent: 22.2, indent: 1, category: 'activo_no_circulante', drillDownType: 'activos' },
    { id: 'cf-09', label: 'Flujo Neto de Actividades de Inversión', currentAmount: -220000, previousAmount: -180000, varianceAmount: -40000, variancePercent: 22.2, isTotal: true, category: 'activo_no_circulante' },

    { id: 'cf-10', label: 'ACTIVIDADES DE FINANCIAMIENTO', currentAmount: 0, previousAmount: 0, varianceAmount: 0, variancePercent: 0, isHeader: true, category: 'pasivo_no_circulante' },
    { id: 'cf-11', label: 'Amortización de Créditos Bancarios de Maquinaria', currentAmount: -120000, previousAmount: -120000, varianceAmount: 0, variancePercent: 0.0, indent: 1, category: 'pasivo_no_circulante' },
    { id: 'cf-12', label: 'Flujo Neto de Actividades de Financiamiento', currentAmount: -120000, previousAmount: -120000, varianceAmount: 0, variancePercent: 0.0, isTotal: true, category: 'pasivo_no_circulante' },

    { id: 'cf-13', label: 'INCREMENTO NETO DE EFECTIVO', currentAmount: 95200, previousAmount: 97000, varianceAmount: -1800, variancePercent: -1.9, isTotal: true, category: 'activo_circulante' },
    { id: 'cf-14', label: 'Efectivo y Equivalentes al Inicio del Periodo', currentAmount: 1390000, previousAmount: 1293000, varianceAmount: 97000, variancePercent: 7.5, isTotal: true, category: 'activo_circulante' },
    { id: 'cf-15', label: 'EFECTIVO Y EQUIVALENTES AL CIERRE DEL PERIODO', currentAmount: 1485200, previousAmount: 1390000, varianceAmount: 95200, variancePercent: 6.8, isTotal: true, category: 'activo_circulante', drillDownType: 'bancos' }
  ],
  summary: {
    initialCash: 1390000,
    operatingCashFlow: 435000,
    investingCashFlow: -220000,
    financingCashFlow: -120000,
    netChangeInCash: 95200,
    finalCash: 1485200
  }
};

// ----------------------------------------------------------------------------
// 4. BIBLIOTECA MAESTRA DE REPORTES (CARDS)
// ----------------------------------------------------------------------------
export type ReportCategory = 'comercial' | 'finanzas' | 'compras' | 'inventarios' | 'activos';

export interface ReportDefinition {
  id: string;
  title: string;
  category: ReportCategory;
  categoryLabel: string;
  description: string;
  frequency: 'Mensual' | 'Semanal' | 'Diario' | 'A demanda';
  targetRole: 'Dirección General' | 'Finanzas & Contraloría' | 'Operaciones & Planta' | 'Compras';
  iconName: string; // Lucide icon identifier
  isKeyReport?: boolean;
}

export const REPORT_DEFINITIONS: ReportDefinition[] = [
  // Comercial / Ventas
  {
    id: 'rep-ventas-periodo',
    title: 'Ventas por Período',
    category: 'comercial',
    categoryLabel: 'Comercial & Ventas',
    description: 'Facturación mensual comparativa vs año anterior, desglose por línea de negocio Offset y Flexo.',
    frequency: 'Mensual',
    targetRole: 'Dirección General',
    iconName: 'TrendingUp',
    isKeyReport: true
  },
  {
    id: 'rep-rentabilidad-cliente',
    title: 'Rentabilidad por Cliente',
    category: 'comercial',
    categoryLabel: 'Comercial & Ventas',
    description: 'Ventas netas, costo estimado de producción, margen de contribución y utilidad por cuenta clave.',
    frequency: 'Mensual',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'Users'
  },
  {
    id: 'rep-rentabilidad-producto',
    title: 'Rentabilidad por Artículo / Familia',
    category: 'comercial',
    categoryLabel: 'Comercial & Ventas',
    description: 'Análisis de margen bruto en folletos, manuales farmacéuticos y etiquetas adhesivas en rollo.',
    frequency: 'Mensual',
    targetRole: 'Operaciones & Planta',
    iconName: 'Package'
  },
  {
    id: 'rep-facturas-pendientes',
    title: 'Facturas Pendientes y Excepciones',
    category: 'comercial',
    categoryLabel: 'Comercial & Ventas',
    description: 'Documentos pendientes de timbrar, notas de crédito por conciliar y complementos de pago.',
    frequency: 'Semanal',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'FileText'
  },

  // Finanzas & Contabilidad
  {
    id: 'rep-estado-resultados',
    title: 'Estado de Resultados (P&L)',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Ingresos, costo fabril, utilidad bruta, gastos operativos y utilidad neta con comparativo mensual.',
    frequency: 'Mensual',
    targetRole: 'Dirección General',
    iconName: 'BarChart3',
    isKeyReport: true
  },
  {
    id: 'rep-situacion-financiera',
    title: 'Estado de Situación Financiera',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Balance General cuadrado: activo circulante, activos fijos fabriles, pasivo y capital contable.',
    frequency: 'Mensual',
    targetRole: 'Dirección General',
    iconName: 'Scale',
    isKeyReport: true
  },
  {
    id: 'rep-flujo-efectivo',
    title: 'Estado de Flujo de Efectivo',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Flujos generados y aplicados en operación, inversión de activos fijos y financiamiento bancario.',
    frequency: 'Mensual',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'DollarSign',
    isKeyReport: true
  },
  {
    id: 'rep-antiguedad-cxc',
    title: 'Antigüedad de Cartera (CxC)',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Distribución de saldos por cobrar en buckets reales: corriente, 1–30, 31–60, 61–90 y más de 90 días.',
    frequency: 'Semanal',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'Clock',
    isKeyReport: true
  },
  {
    id: 'rep-antiguedad-cxp',
    title: 'Antigüedad de Proveedores (CxP)',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Obligaciones pendientes con proveedores de sustratos, tintas y servicios por vencer o vencidos.',
    frequency: 'Semanal',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'CreditCard'
  },
  {
    id: 'rep-balanza-comprobacion',
    title: 'Balanza de Comprobación',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Saldos iniciales, movimientos deudor/acreedor y saldos finales cuadrados al centavo.',
    frequency: 'Mensual',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'BookOpen'
  },
  {
    id: 'rep-mayor-auxiliares',
    title: 'Mayor Contable y Auxiliares',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Trazabilidad de pólizas por cuenta: bancos, proveedores, ventas y depreciación de planta.',
    frequency: 'A demanda',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'FileSpreadsheet'
  },
  {
    id: 'rep-presupuesto-real',
    title: 'Presupuesto vs Real (Centros de Costo)',
    category: 'finanzas',
    categoryLabel: 'Finanzas & Contabilidad',
    description: 'Consumo y variación presupuestal de Offset, Flexografía, Acabados, Mantenimiento y Calidad.',
    frequency: 'Mensual',
    targetRole: 'Dirección General',
    iconName: 'PieChart'
  },

  // Compras & Abastecimiento
  {
    id: 'rep-oc-abiertas',
    title: 'Órdenes de Compra Abiertas',
    category: 'compras',
    categoryLabel: 'Compras & Abastecimiento',
    description: 'Seguimiento a pedidos de bobinas de papel, películas BoPP, tintas UV y refacciones en tránsito.',
    frequency: 'Diario',
    targetRole: 'Compras',
    iconName: 'ShoppingBag'
  },
  {
    id: 'rep-compras-proveedor',
    title: 'Compras por Proveedor y Concentración',
    category: 'compras',
    categoryLabel: 'Compras & Abastecimiento',
    description: 'Volumen de compra, frecuencia de entrega, cumplimiento de lead time y condiciones comerciales.',
    frequency: 'Mensual',
    targetRole: 'Compras',
    iconName: 'Building'
  },
  {
    id: 'rep-facturas-excepcion',
    title: 'Facturas de Proveedor con Excepción',
    category: 'compras',
    categoryLabel: 'Compras & Abastecimiento',
    description: 'Discrepancias de precio y cantidad detectadas por 3-Way Match pendientes de resolución.',
    frequency: 'Semanal',
    targetRole: 'Compras',
    iconName: 'AlertTriangle'
  },

  // Inventarios & Operaciones
  {
    id: 'rep-valuacion-inventario',
    title: 'Valuación de Inventario',
    category: 'inventarios',
    categoryLabel: 'Inventarios & Operaciones',
    description: 'Valor monetario en libros de papel, sustratos sintéticos, tintas, WIP y producto terminado.',
    frequency: 'Mensual',
    targetRole: 'Operaciones & Planta',
    iconName: 'Archive'
  },
  {
    id: 'rep-ajustes-inventario',
    title: 'Ajustes de Inventario y Mermas',
    category: 'inventarios',
    categoryLabel: 'Inventarios & Operaciones',
    description: 'Bitácora de diferencias de conteo físico, descalificaciones de calidad y mermas de arranque.',
    frequency: 'Semanal',
    targetRole: 'Operaciones & Planta',
    iconName: 'Shuffle'
  },
  {
    id: 'rep-rotacion-inventario',
    title: 'Rotación y Lento Movimiento',
    category: 'inventarios',
    categoryLabel: 'Inventarios & Operaciones',
    description: 'Identificación de bobinas y materias primas sin movimiento por más de 60 días para reaprovechamiento.',
    frequency: 'Mensual',
    targetRole: 'Operaciones & Planta',
    iconName: 'Repeat'
  },
  {
    id: 'rep-ciclo-documentos',
    title: 'Ciclo de Vida de Documentos',
    category: 'inventarios',
    categoryLabel: 'Inventarios & Operaciones',
    description: 'Trazabilidad de punta a punta: Pedido ➔ OP ➔ Producción ➔ Liberación QA ➔ Remisión ➔ Factura ➔ Cobro.',
    frequency: 'A demanda',
    targetRole: 'Dirección General',
    iconName: 'GitMerge'
  },

  // Activos / CAPEX
  {
    id: 'rep-activos-catalogo',
    title: 'Catálogo y Valuación de Activos Fijos',
    category: 'activos',
    categoryLabel: 'Activos & CAPEX',
    description: 'Inventario físico y contable de prensas, plegadoras, guillotinas y equipos auxiliares de RTM.',
    frequency: 'Mensual',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'Building2',
    isKeyReport: true
  },
  {
    id: 'rep-depreciacion-periodo',
    title: 'Depreciación del Período y Fiscal',
    category: 'activos',
    categoryLabel: 'Activos & CAPEX',
    description: 'Cálculo de depreciación lineal contable ($115,400/mes) y deducción de inversiones ISR.',
    frequency: 'Mensual',
    targetRole: 'Finanzas & Contraloría',
    iconName: 'Calculator'
  },
  {
    id: 'rep-capex-presupuesto',
    title: 'CAPEX vs Presupuesto de Inversión',
    category: 'activos',
    categoryLabel: 'Activos & CAPEX',
    description: 'Inversión en modernización de planta: presupuesto autorizado ($2.8M), ejercido y saldo disponible.',
    frequency: 'Mensual',
    targetRole: 'Dirección General',
    iconName: 'Coins'
  },
  {
    id: 'rep-mantenimiento-activo',
    title: 'Costo de Mantenimiento por Activo',
    category: 'activos',
    categoryLabel: 'Activos & CAPEX',
    description: 'Gasto acumulado en refacciones y mano de obra de mantenimiento industrial cruzado por máquina.',
    frequency: 'Mensual',
    targetRole: 'Operaciones & Planta',
    iconName: 'Wrench'
  }
];

// ----------------------------------------------------------------------------
// 5. HELPER PARA AGING CXC Y CXP COHERENTE CON MOCKFINANZASDATA
// ----------------------------------------------------------------------------
export interface AgingBucketSummary {
  name: string;
  label: string;
  amount: number;
  count: number;
  percentage: number;
  colorClass: string;
  bgLightClass: string;
  textClass: string;
}

export function calculateRealAgingBuckets(items: Array<{ saldoPendiente: number; bucket?: string; diasMora?: number; status?: string }>): AgingBucketSummary[] {
  const buckets: Record<string, { amount: number; count: number }> = {
    vigente: { amount: 0, count: 0 },
    '1_30': { amount: 0, count: 0 },
    '31_60': { amount: 0, count: 0 },
    '61_90': { amount: 0, count: 0 },
    mas_90: { amount: 0, count: 0 }
  };

  for (const item of items) {
    if (!item.saldoPendiente || item.saldoPendiente <= 0) continue;

    let bKey = 'vigente';
    if (item.bucket) {
      bKey = item.bucket;
    } else if (item.diasMora && item.diasMora > 0) {
      if (item.diasMora <= 30) bKey = '1_30';
      else if (item.diasMora <= 60) bKey = '31_60';
      else if (item.diasMora <= 90) bKey = '61_90';
      else bKey = 'mas_90';
    } else if (item.status === 'vencida') {
      bKey = '1_30';
    }

    if (buckets[bKey]) {
      buckets[bKey].amount += item.saldoPendiente;
      buckets[bKey].count += 1;
    } else {
      buckets.vigente.amount += item.saldoPendiente;
      buckets.vigente.count += 1;
    }
  }

  const totalAmount = Object.values(buckets).reduce((sum, b) => sum + b.amount, 0) || 1;

  return [
    {
      name: 'vigente',
      label: 'Al Corriente / Vigente',
      amount: buckets.vigente.amount,
      count: buckets.vigente.count,
      percentage: Math.round((buckets.vigente.amount / totalAmount) * 1000) / 10,
      colorClass: 'bg-emerald-500',
      bgLightClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
      textClass: 'text-emerald-700 dark:text-emerald-400'
    },
    {
      name: '1_30',
      label: '1 a 30 días',
      amount: buckets['1_30'].amount,
      count: buckets['1_30'].count,
      percentage: Math.round((buckets['1_30'].amount / totalAmount) * 1000) / 10,
      colorClass: 'bg-blue-500',
      bgLightClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
      textClass: 'text-blue-700 dark:text-blue-400'
    },
    {
      name: '31_60',
      label: '31 a 60 días',
      amount: buckets['31_60'].amount,
      count: buckets['31_60'].count,
      percentage: Math.round((buckets['31_60'].amount / totalAmount) * 1000) / 10,
      colorClass: 'bg-amber-500',
      bgLightClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
      textClass: 'text-amber-700 dark:text-amber-400'
    },
    {
      name: '61_90',
      label: '61 a 90 días',
      amount: buckets['61_90'].amount,
      count: buckets['61_90'].count,
      percentage: Math.round((buckets['61_90'].amount / totalAmount) * 1000) / 10,
      colorClass: 'bg-orange-500',
      bgLightClass: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
      textClass: 'text-orange-700 dark:text-orange-400'
    },
    {
      name: 'mas_90',
      label: 'Más de 90 días',
      amount: buckets.mas_90.amount,
      count: buckets.mas_90.count,
      percentage: Math.round((buckets.mas_90.amount / totalAmount) * 1000) / 10,
      colorClass: 'bg-rose-500',
      bgLightClass: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
      textClass: 'text-rose-700 dark:text-rose-400'
    }
  ];
}
