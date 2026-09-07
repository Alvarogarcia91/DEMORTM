// =========================================================================
// RTM DEMO — CENTRO DE ALERTAS TRANSVERSAL
// Catálogo Maestro de Alertas Coherentes con Módulos y Datos RTM Documentados
// =========================================================================

import { NavItemKey } from '../components/Sidebar';

export type AlertPriority = 'Crítica' | 'Alta' | 'Media' | 'Informativa';
export type AlertStatus = 'Pendiente' | 'Atendida' | 'Resuelta';
export type AlertModule = 
  | 'Inventario'
  | 'Compras'
  | 'Ventas'
  | 'Órdenes de Salida'
  | 'Facturación'
  | 'Cuentas por Cobrar'
  | 'Cuentas por Pagar'
  | 'Mantenimiento'
  | 'Nómina';

export interface AlertTargetNavigation {
  tab: NavItemKey;
  targetId?: string;
  targetFolio?: string;
  secondaryActionTab?: NavItemKey;
  secondaryPrefilledItem?: {
    sku: string;
    productName: string;
    brand: string;
    quantity: number;
    targetWarehouseId?: string;
    note?: string;
  };
}

export interface DemoAlert {
  id: string;
  modulo: AlertModule;
  referencia: string; // ej. SKU, OT, Folio Factura, Máquina, etc.
  titulo: string;
  descripcion: string;
  prioridad: AlertPriority;
  fechaHora: string; // ej. 'Hace 18 min', 'Hoy 08:30', '06 Sep 2026'
  timestamp: string; // ISO or sortable
  timing: 'Hoy' | 'Próximas' | 'Pendientes';
  estado: AlertStatus;
  responsable?: string;
  ctaPrincipal: string;
  ctaSecundario?: string;
  destino: AlertTargetNavigation;
  // History resolution audit
  resolucion?: {
    resueltoPor: string;
    fecha: string;
    accionRealizada: string;
  };
}

export const INITIAL_MOCK_ALERTS: DemoAlert[] = [
  {
    id: 'alt-inv-001',
    modulo: 'Inventario',
    referencia: 'NEWSPRINT_45',
    titulo: 'NEWSPRINT_45 por debajo del mínimo de seguridad',
    descripcion: 'Disponible: 8,200 pliegos (Mínimo: 15,000). Cobertura estimada: 2.3 días para tirajes de manuales.',
    prioridad: 'Crítica',
    fechaHora: 'Hace 18 min',
    timestamp: '2026-09-07T08:15:00',
    timing: 'Hoy',
    estado: 'Pendiente',
    responsable: 'Ing. Carlos Mendoza (Jefe Almacén)',
    ctaPrincipal: 'Ver inventario',
    ctaSecundario: 'Crear requisición',
    destino: {
      tab: 'inventario',
      targetId: 'NEWSPRINT_45',
      secondaryActionTab: 'requisiciones',
      secondaryPrefilledItem: {
        sku: 'NEWSPRINT_45',
        productName: 'Papel Periódico Newsprint 45g 70x95 cm',
        brand: 'RTM / Papelera Nacional',
        quantity: 30000,
        targetWarehouseId: 'alm-rtm-mp',
        note: 'Reabastecimiento urgente por quiebre de stock mínimo (Consumo tiraje DCS382/DCD777)'
      }
    }
  },
  {
    id: 'alt-cxc-001',
    modulo: 'Cuentas por Cobrar',
    referencia: 'FAC-RTM-2026-0045',
    titulo: 'Factura vencida de cliente con saldo pendiente',
    descripcion: 'TRICO TECHNOLOGIES CORPORATION presenta factura vencida con 12 días de mora. Saldo: $89,450.00 MXN.',
    prioridad: 'Crítica',
    fechaHora: 'Hoy 07:45',
    timestamp: '2026-09-07T07:45:00',
    timing: 'Hoy',
    estado: 'Pendiente',
    responsable: 'Lic. Mariana Garza (Crédito y Cobranza)',
    ctaPrincipal: 'Ver cuenta',
    ctaSecundario: 'Registrar pago',
    destino: {
      tab: 'cxc',
      targetId: 'cxc-0045',
      targetFolio: 'FAC-RTM-2026-0045'
    }
  },
  {
    id: 'alt-cxp-001',
    modulo: 'Cuentas por Pagar',
    referencia: 'FP-BIO-4412',
    titulo: 'Factura proveedor con diferencia en validación',
    descripcion: 'BioFlex Solutions: Factura de tintas flexo excede en +$3,420.00 MXN el costo pactado en OC-2026-0078.',
    prioridad: 'Alta',
    fechaHora: 'Hoy 08:05',
    timestamp: '2026-09-07T08:05:00',
    timing: 'Hoy',
    estado: 'Pendiente',
    responsable: 'Lic. Gerardo Morales (Cuentas por Pagar)',
    ctaPrincipal: 'Ver validación',
    destino: {
      tab: 'cxp',
      targetId: 'cxp-004',
      targetFolio: 'FP-BIO-4412'
    }
  },
  {
    id: 'alt-mtto-001',
    modulo: 'Mantenimiento',
    referencia: 'EQ-FLX-01',
    titulo: 'Mark Andy 830 10" — Mantenimiento preventivo vence mañana',
    descripcion: 'Plan MP-FLX-01 (Inspección de tinteros, engranes anilox y tensión de banda flexográfica programada).',
    prioridad: 'Alta',
    fechaHora: 'Hoy 06:30',
    timestamp: '2026-09-07T06:30:00',
    timing: 'Próximas',
    estado: 'Pendiente',
    responsable: 'Ing. Fernando Ortiz (Líder Mtto)',
    ctaPrincipal: 'Ver máquina',
    ctaSecundario: 'Ver plan preventivo',
    destino: {
      tab: 'mantenimiento',
      targetId: 'EQ-FLX-01'
    }
  },
  {
    id: 'alt-mtto-002',
    modulo: 'Mantenimiento',
    referencia: 'OT-2026-0039',
    titulo: 'Conserver DiDDE 860 — OT correctiva abierta por registro',
    descripcion: 'Desalineación en registro de 2do cuerpo offset detectado en corrida NA472050. En espera de ajuste de rodillo.',
    prioridad: 'Crítica',
    fechaHora: 'Ayer 18:20',
    timestamp: '2026-09-06T18:20:00',
    timing: 'Pendientes',
    estado: 'Pendiente',
    responsable: 'Ing. Fernando Ortiz (Líder Mtto)',
    ctaPrincipal: 'Ver OT',
    destino: {
      tab: 'mantenimiento',
      targetId: 'OT-2026-0039'
    }
  },
  {
    id: 'alt-ped-001',
    modulo: 'Ventas',
    referencia: 'PED-2026-0410',
    titulo: 'Pedido con compromiso próximo y reserva pendiente',
    descripcion: 'BLACK & DECKER: 35,000 millares Manual NA472050 (DCS382) con fecha de entrega compromiso en 48 horas.',
    prioridad: 'Alta',
    fechaHora: 'Hoy 07:15',
    timestamp: '2026-09-07T07:15:00',
    timing: 'Próximas',
    estado: 'Pendiente',
    responsable: 'Lic. Laura Martínez (Ventas Industriales)',
    ctaPrincipal: 'Ver pedido',
    destino: {
      tab: 'pedidos',
      targetFolio: 'PED-2026-0410'
    }
  },
  {
    id: 'alt-fac-001',
    modulo: 'Facturación',
    referencia: 'FAC-RTM-2026-0048',
    titulo: 'Factura borrador lista para timbrado SAT CFDI 4.0',
    descripcion: 'TRICO TECHNOLOGIES: Remisión REM-2026-0061 validada por $148,480.00 MXN. Requiere timbrado fiscal.',
    prioridad: 'Media',
    fechaHora: 'Hoy 08:10',
    timestamp: '2026-09-07T08:10:00',
    timing: 'Hoy',
    estado: 'Pendiente',
    responsable: 'C.P. Mónica Sánchez (Facturación Fiscal)',
    ctaPrincipal: 'Ver factura',
    destino: {
      tab: 'facturacion',
      targetFolio: 'FAC-RTM-2026-0048'
    }
  },
  {
    id: 'alt-nom-001',
    modulo: 'Nómina',
    referencia: 'INC-2026-W36-02',
    titulo: 'Checada incompleta sin resolver antes de pre-nómina',
    descripcion: 'Operador Prensa Offset (RTM-004 Marco Treviño): Checada de salida omitida el viernes en Turno 1.',
    prioridad: 'Media',
    fechaHora: 'Hoy 08:00',
    timestamp: '2026-09-07T08:00:00',
    timing: 'Hoy',
    estado: 'Pendiente',
    responsable: 'Lic. Sofia Ramos (Recursos Humanos)',
    ctaPrincipal: 'Ver incidencias',
    destino: {
      tab: 'nomina',
      targetId: 'INC-2026-W36-02'
    }
  },
  {
    id: 'alt-log-001',
    modulo: 'Órdenes de Salida',
    referencia: 'REM-2026-0062',
    titulo: 'Remisión de salida lista para despacho en andén EMB-01',
    descripcion: 'TYCO (Johnson Controls): Instructivo e-Force liberado por QA en tarimas, pendiente de validación y carga.',
    prioridad: 'Media',
    fechaHora: 'Hace 45 min',
    timestamp: '2026-09-07T07:35:00',
    timing: 'Hoy',
    estado: 'Pendiente',
    responsable: 'Valeria Torres (Despacho PT)',
    ctaPrincipal: 'Ver salida',
    destino: {
      tab: 'logistica',
      targetFolio: 'REM-2026-0062'
    }
  },
  {
    id: 'alt-cmp-001',
    modulo: 'Compras',
    referencia: 'REQ-2026-0029',
    titulo: 'Requisición urgente de barniz UV mate pendiente de compra',
    descripcion: 'Taller Flexo requiere 8 cubetas de Barniz UV Mate para corrida BISSELL. Sin orden de compra emitida.',
    prioridad: 'Alta',
    fechaHora: 'Hoy 07:50',
    timestamp: '2026-09-07T07:50:00',
    timing: 'Hoy',
    estado: 'Pendiente',
    responsable: 'Ing. Carlos Mendoza (Compras & Almacén)',
    ctaPrincipal: 'Ver requisición',
    destino: {
      tab: 'requisiciones',
      targetFolio: 'REQ-2026-0029'
    }
  },
  {
    id: 'alt-res-001',
    modulo: 'Inventario',
    referencia: 'BOND-75-B17',
    titulo: 'Reabastecimiento de Bond 75g Bobina completado',
    descripcion: 'Recepción en rampa de 4 bobinas Bond 75g (2,400 kg) de Copamex. Stock restablecido a niveles óptimos.',
    prioridad: 'Media',
    fechaHora: '06 Sep 2026 · 16:30',
    timestamp: '2026-09-06T16:30:00',
    timing: 'Pendientes',
    estado: 'Resuelta',
    responsable: 'Ing. Carlos Mendoza',
    ctaPrincipal: 'Ver inventario',
    destino: {
      tab: 'inventario',
      targetId: 'BOND-75-B17'
    },
    resolucion: {
      resueltoPor: 'Ing. Carlos Mendoza (Jefe Almacén)',
      fecha: '06 Sep 2026 · 16:30',
      accionRealizada: 'Entrada de mercancía OC-2026-0072 confirmada en almacén MP.'
    }
  },
  {
    id: 'alt-res-002',
    modulo: 'Cuentas por Pagar',
    referencia: 'FP-COP-1092',
    titulo: 'Pago programado a Copamex Industrial dispersado',
    descripcion: 'Factura liquidada por $142,500.00 MXN mediante transferencia SPEI Banregio.',
    prioridad: 'Informativa',
    fechaHora: '05 Sep 2026 · 14:00',
    timestamp: '2026-09-05T14:00:00',
    timing: 'Pendientes',
    estado: 'Resuelta',
    responsable: 'Lic. Gerardo Morales',
    ctaPrincipal: 'Ver CxP',
    destino: {
      tab: 'cxp',
      targetFolio: 'FP-COP-1092'
    },
    resolucion: {
      resueltoPor: 'Lic. Gerardo Morales (Cuentas por Pagar)',
      fecha: '05 Sep 2026 · 14:00',
      accionRealizada: 'Comprobante SPEI validado y conciliado con tesorería.'
    }
  }
];
