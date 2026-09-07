// =====================================================================
// Impresos RTM - Mock Data Maestro de Nómina, Asistencia y Timbrado
// =====================================================================

export type ShiftType = 'Turno 1 (Matutino 07:00-15:00)' | 'Turno 2 (Vespertino 15:00-23:00)' | 'Mixto' | 'Administrativo (08:30-18:00)';
export type PayrollFrequency = 'Semanal' | 'Quincenal';
export type EmployeeStatus = 'Activo' | 'Vacaciones' | 'Incapacidad' | 'Baja temporal';
export type FiscalStatus = 'Validado SAT' | 'Requiere validación' | 'CP pendiente';

export interface Employee {
  id: string; // RTM-001
  numeroEmpleado: string;
  nombre: string;
  puesto: string;
  departamento: 'Flexografía' | 'Offset' | 'Acabado' | 'Serigrafía' | 'Almacén' | 'Mantenimiento' | 'Calidad' | 'Planeación' | 'Manufactura' | 'RH';
  turno: ShiftType;
  tipoNomina: PayrollFrequency;
  estatus: EmployeeStatus;
  estadoFiscal: FiscalStatus;
  fechaIngreso: string;
  salarioDiario: number;
  salarioDiarioIntegrado: number;
  cuentaBancaria: string;
  banco: string;
  rfc: string;
  curp: string;
  nss: string;
  codigoPostalFiscal: string;
  regimenContratacion: string;
  tipoContrato: string;
  email: string;
  telefono: string;
}

export interface DayAttendance {
  dia: 'Lun' | 'Mar' | 'Mié' | 'Jue' | 'Vie' | 'Sáb';
  fecha: string;
  entrada?: string;
  salidaComida?: string;
  regresoComida?: string;
  salida?: string;
  horasTrabajadas: number;
  horasAdicionales: number;
  retardoMinutos: number;
  tipoDia: 'ordinario' | 'falta' | 'retardo' | 'permiso_reposicion' | 'permiso_sin_goce' | 'vacaciones' | 'incapacidad' | 'checada_incompleta' | 'descanso';
  incidenciaId?: string;
  detalle?: string;
}

export interface AttendanceWeek {
  empleadoId: string;
  semana: string; // "Semana 36 (31 ago - 06 sep 2026)"
  dias: DayAttendance[];
  totalHorasOrdinarias: number;
  totalHorasAdicionales: number;
  totalRetardosMin: number;
  totalFaltas: number;
  estadoRevision: 'completo' | 'requiere_atencion' | 'checada_incompleta';
}

export type IncidentType =
  | 'falta'
  | 'retardo'
  | 'hora_adicional'
  | 'permiso_con_goce'
  | 'permiso_sin_goce'
  | 'permiso_con_reposicion'
  | 'vacaciones'
  | 'incapacidad'
  | 'bono'
  | 'descuento_autorizado'
  | 'checada_incompleta'
  | 'ajuste_manual';

export type IncidentStatus = 'detectada' | 'pendiente_revision' | 'autorizada' | 'rechazada' | 'aplicada_nomina';

export interface RepositionRecord {
  fecha: string;
  horasRepuestas: number;
  registradoPor: string;
  opRelacionada?: string;
}

export interface Incident {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  puesto: string;
  departamento: string;
  tipo: IncidentType;
  fecha: string;
  horas?: number;
  monto?: number;
  estado: IncidentStatus;
  motivo: string;
  autorizadoPor?: string;
  fechaAutorizacion?: string;
  // Particularidad RTM: Permiso con reposición
  reposicion?: {
    horasPermiso: number;
    saldoPorReponer: number;
    fechaProgramada: string;
    historial: RepositionRecord[];
  };
}

export interface ProductionReconciliation {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  puesto: string;
  departamento: string;
  fecha: string;
  horasReloj: number;
  horasProduccion: number;
  diferencia: number;
  maquina: string;
  ordenProduccion: string;
  actividad: string;
  estado: 'dentro_tolerancia' | 'requiere_revision';
  observacion: string;
}

export interface PayrollConcept {
  id: string;
  claveSat: string;
  descripcion: string;
  tipo: 'percepcion' | 'deduccion';
  importe: number;
  gravado: number;
  exento: number;
  origen?: string;
}

export interface EmployeePayroll {
  empleadoId: string;
  empleadoNombre: string;
  numeroEmpleado: string;
  puesto: string;
  departamento: string;
  tipoNomina: PayrollFrequency;
  diasTrabajados: number;
  horasOrdinarias: number;
  horasAdicionales: number;
  percepciones: PayrollConcept[];
  deducciones: PayrollConcept[];
  totalPercepciones: number;
  totalDeducciones: number;
  isrtotal: number;
  imsstotal: number;
  netoAPagar: number;
  estadoValidacion: 'listo' | 'requiere_revision' | 'bloqueado';
  motivoRevision?: string;
  validaciones: {
    checadasCompletas: boolean;
    incidenciasAutorizadas: boolean;
    netoNoNegativo: boolean;
    datosFiscalesCompletos: boolean;
    cuentaBancariaPresente: boolean;
    periodoCorrecto: boolean;
  };
  // Timbrado CFDI
  cfdiStatus: 'pendiente' | 'timbrado' | 'con_error' | 'cancelado';
  uuidSat?: string;
  fechaTimbrado?: string;
  errorTimbrado?: string;
}

export interface PayrollPeriod {
  id: string;
  codigo: string; // "SEM-2026-36"
  nombre: string; // "Semanal 31 ago – 06 sep 2026"
  tipo: PayrollFrequency;
  fechaInicio: string;
  fechaFin: string;
  fechaPago: string;
  estado: 'borrador' | 'en_revision' | 'autorizada' | 'cerrada' | 'timbrada';
  totalEmpleados: number;
  percepcionesTotales: number;
  deduccionesTotales: number;
  netoTotal: number;
  horasExtraTotales: number;
  incidenciasTotales: number;
  fechaCierre?: string;
  fechaTimbrado?: string;
  cerradoPor?: string;
  motivoReapertura?: string;
}

export interface PayrollAuditEntry {
  id: string;
  fechaHora: string;
  usuario: string;
  accion: string;
  detalle: string;
  motivo?: string;
}

// =====================================================================
// 30 EMPLEADOS SEED REALISTAS DE IMPRESOS RTM (Mayoría Operativa)
// =====================================================================

export const INITIAL_MOCK_EMPLOYEES: Employee[] = [
  // Flexografía
  {
    id: 'RTM-001',
    numeroEmpleado: 'RTM-001',
    nombre: 'Carlos Mendoza Ruiz',
    puesto: 'Operador Mark Andy 830 7”',
    departamento: 'Flexografía',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2021-03-15',
    salarioDiario: 485.50,
    salarioDiarioIntegrado: 512.40,
    cuentaBancaria: '012180015498124019',
    banco: 'BBVA Bancomer',
    rfc: 'MERC890412H91',
    curp: 'MERC890412HDFNR03',
    nss: '12148901248',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'cmendoza@rtm-demo.mx',
    telefono: '899-234-1101',
  },
  {
    id: 'RTM-002',
    numeroEmpleado: 'RTM-002',
    nombre: 'José Luis Herrera Soto',
    puesto: 'Operador Mark Andy 830 10”',
    departamento: 'Flexografía',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2020-08-10',
    salarioDiario: 495.00,
    salarioDiarioIntegrado: 524.30,
    cuentaBancaria: '002180070144901822',
    banco: 'Citibanamex',
    rfc: 'HESJ840219LK2',
    curp: 'HESJ840219HDFRTL08',
    nss: '12108402195',
    codigoPostalFiscal: '88710',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'jlherrera@rtm-demo.mx',
    telefono: '899-234-1102',
  },
  {
    id: 'RTM-003',
    numeroEmpleado: 'RTM-003',
    nombre: 'Miguel Ángel Treviño',
    puesto: 'Operador Mark Andy Scout',
    departamento: 'Flexografía',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2022-01-20',
    salarioDiario: 460.00,
    salarioDiarioIntegrado: 483.20,
    cuentaBancaria: '072180020194812399',
    banco: 'Banorte',
    rfc: 'TRMA920703P82',
    curp: 'TRMA920703HDFRNG02',
    nss: '12169207031',
    codigoPostalFiscal: '88730',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'mtrevino@rtm-demo.mx',
    telefono: '899-234-1103',
  },
  {
    id: 'RTM-004',
    numeroEmpleado: 'RTM-004',
    nombre: 'Ricardo Salinas Garza',
    puesto: 'Operador Mark Andy 4120',
    departamento: 'Flexografía',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2021-11-05',
    salarioDiario: 475.00,
    salarioDiarioIntegrado: 501.10,
    cuentaBancaria: '014180562910394811',
    banco: 'Santander',
    rfc: 'SAGR871114TA4',
    curp: 'SAGR871114HDFRZD01',
    nss: '12128711148',
    codigoPostalFiscal: '88740',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'rsalinas@rtm-demo.mx',
    telefono: '899-234-1104',
  },
  {
    id: 'RTM-005',
    numeroEmpleado: 'RTM-005',
    nombre: 'Jesús Alberto Peña',
    puesto: 'Operador BGM',
    departamento: 'Flexografía',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2023-04-12',
    salarioDiario: 440.00,
    salarioDiarioIntegrado: 461.20,
    cuentaBancaria: '012180018890214810',
    banco: 'BBVA Bancomer',
    rfc: 'PEAJ940508N71',
    curp: 'PEAJ940508HDFRSC05',
    nss: '12189405084',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'jpena@rtm-demo.mx',
    telefono: '899-234-1105',
  },
  {
    id: 'RTM-006',
    numeroEmpleado: 'RTM-006',
    nombre: 'Juan Pablo Castillo',
    puesto: 'Operador BGM',
    departamento: 'Flexografía',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2022-09-01',
    salarioDiario: 440.00,
    salarioDiarioIntegrado: 461.20,
    cuentaBancaria: '072180091024859102',
    banco: 'Banorte',
    rfc: 'CAJJ951210KL3',
    curp: 'CAJJ951210HDFRRN09',
    nss: '12199512109',
    codigoPostalFiscal: '88720',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'jpcastillo@rtm-demo.mx',
    telefono: '899-234-1106',
  },
  {
    id: 'RTM-007',
    numeroEmpleado: 'RTM-007',
    nombre: 'Héctor Ramírez Luna',
    puesto: 'Operador Rotoflex',
    departamento: 'Flexografía',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Vacaciones',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2019-06-18',
    salarioDiario: 470.00,
    salarioDiarioIntegrado: 504.60,
    cuentaBancaria: '002180048102948199',
    banco: 'Citibanamex',
    rfc: 'RALH880922MN8',
    curp: 'RALH880922HDFRNT04',
    nss: '12138809221',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'hramirez@rtm-demo.mx',
    telefono: '899-234-1107',
  },
  {
    id: 'RTM-008',
    numeroEmpleado: 'RTM-008',
    nombre: 'Eduardo Villarreal Cruz',
    puesto: 'Ayudante de Flexografía',
    departamento: 'Flexografía',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Requiere validación', // DEMO: Error fiscal 2
    fechaIngreso: '2024-01-15',
    salarioDiario: 350.00,
    salarioDiarioIntegrado: 365.10,
    cuentaBancaria: '014180902849103841',
    banco: 'Santander',
    rfc: 'VICE010419XX1', // RFC demo con homoclave a revisar
    curp: 'VICE010419HDFRLD07',
    nss: '12220104192',
    codigoPostalFiscal: '88710',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'evillarreal@rtm-demo.mx',
    telefono: '899-234-1108',
  },

  // Offset
  {
    id: 'RTM-009',
    numeroEmpleado: 'RTM-009',
    nombre: 'Martín González Leal',
    puesto: 'Operador Conserver C1',
    departamento: 'Offset',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2018-05-10',
    salarioDiario: 510.00,
    salarioDiarioIntegrado: 549.80,
    cuentaBancaria: '012180029384910283',
    banco: 'BBVA Bancomer',
    rfc: 'GOLM830114KA9',
    curp: 'GOLM830114HDFRNT01',
    nss: '12098301147',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'mgonzalez@rtm-demo.mx',
    telefono: '899-234-1109',
  },
  {
    id: 'RTM-010',
    numeroEmpleado: 'RTM-010',
    nombre: 'Jorge Alberto Flores',
    puesto: 'Operador Conserver C4',
    departamento: 'Offset',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2019-11-20',
    salarioDiario: 510.00,
    salarioDiarioIntegrado: 544.50,
    cuentaBancaria: '072180039201948172',
    banco: 'Banorte',
    rfc: 'FOJJ850930P92',
    curp: 'FOJJ850930HDFRRN03',
    nss: '12118509309',
    codigoPostalFiscal: '88730',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'jflores@rtm-demo.mx',
    telefono: '899-234-1110',
  },
  {
    id: 'RTM-011',
    numeroEmpleado: 'RTM-011',
    nombre: 'Óscar Daniel Rocha',
    puesto: 'Operador DiDDE 860',
    departamento: 'Offset',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Incapacidad',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2020-02-14',
    salarioDiario: 480.00,
    salarioDiarioIntegrado: 509.30,
    cuentaBancaria: '002180092839102934',
    banco: 'Citibanamex',
    rfc: 'RODO910725LA1',
    curp: 'RODO910725HDFRCH08',
    nss: '12159107256',
    codigoPostalFiscal: '88720',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'orocha@rtm-demo.mx',
    telefono: '899-234-1111',
  },
  {
    id: 'RTM-012',
    numeroEmpleado: 'RTM-012',
    nombre: 'Luis Fernando Meza',
    puesto: 'Operador Conserver C8',
    departamento: 'Offset',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2022-03-08',
    salarioDiario: 500.00,
    salarioDiarioIntegrado: 527.20,
    cuentaBancaria: '014180482910394821',
    banco: 'Santander',
    rfc: 'MEZL931015TR8',
    curp: 'MEZL931015HDFRZS04',
    nss: '12179310154',
    codigoPostalFiscal: '88740',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'lfmeza@rtm-demo.mx',
    telefono: '899-234-1112',
  },
  {
    id: 'RTM-013',
    numeroEmpleado: 'RTM-013',
    nombre: 'Andrés Escobedo Vela',
    puesto: 'Operador Ryobi',
    departamento: 'Offset',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2021-08-25',
    salarioDiario: 470.00,
    salarioDiarioIntegrado: 494.60,
    cuentaBancaria: '012180084920194820',
    banco: 'BBVA Bancomer',
    rfc: 'EOVA900302HN4',
    curp: 'EOVA900302HDFSN09',
    nss: '12149003028',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'aescobedo@rtm-demo.mx',
    telefono: '899-234-1113',
  },
  {
    id: 'RTM-014',
    numeroEmpleado: 'RTM-014',
    nombre: 'Mario Hernández Silva',
    puesto: 'Operador Heidelberg',
    departamento: 'Offset',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2017-09-12',
    salarioDiario: 530.00,
    salarioDiarioIntegrado: 574.90,
    cuentaBancaria: '072180049281039481',
    banco: 'Banorte',
    rfc: 'HESM810811LK1',
    curp: 'HESM810811HDFRRN02',
    nss: '12078108119',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'mhernandez@rtm-demo.mx',
    telefono: '899-234-1114',
  },
  {
    id: 'RTM-015',
    numeroEmpleado: 'RTM-015',
    nombre: 'Raúl Martínez Cantú',
    puesto: 'Ayudante de Prensa',
    departamento: 'Offset',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2023-10-02',
    salarioDiario: 350.00,
    salarioDiarioIntegrado: 365.10,
    cuentaBancaria: '002180029384910482',
    banco: 'Citibanamex',
    rfc: 'MACR020614PT7',
    curp: 'MACR020614HDFRNT06',
    nss: '12230206145',
    codigoPostalFiscal: '88710',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'rmartinez@rtm-demo.mx',
    telefono: '899-234-1115',
  },

  // Acabado
  {
    id: 'RTM-016',
    numeroEmpleado: 'RTM-016',
    nombre: 'Sergio Zamora Reyes',
    puesto: 'Operador Guillotina',
    departamento: 'Acabado',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2020-04-18',
    salarioDiario: 450.00,
    salarioDiarioIntegrado: 477.50,
    cuentaBancaria: '012180039281039481',
    banco: 'BBVA Bancomer',
    rfc: 'ZARS860329TR5',
    curp: 'ZARS860329HDFRNT02',
    nss: '12118603291',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'szamora@rtm-demo.mx',
    telefono: '899-234-1116',
  },
  {
    id: 'RTM-017',
    numeroEmpleado: 'RTM-017',
    nombre: 'Ernesto Aguilar Mora',
    puesto: 'Operador Dobladora',
    departamento: 'Acabado',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2021-06-11',
    salarioDiario: 440.00,
    salarioDiarioIntegrado: 464.30,
    cuentaBancaria: '072180019284910392',
    banco: 'Banorte',
    rfc: 'AUME891104LK8',
    curp: 'AUME891104HDFRRG05',
    nss: '12158911044',
    codigoPostalFiscal: '88720',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'eaguilar@rtm-demo.mx',
    telefono: '899-234-1117',
  },
  {
    id: 'RTM-018',
    numeroEmpleado: 'RTM-018',
    nombre: 'Pedro Garza Ríos',
    puesto: 'Operador Muller Martini',
    departamento: 'Acabado',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2019-03-22',
    salarioDiario: 470.00,
    salarioDiarioIntegrado: 504.60,
    cuentaBancaria: '014180839201948172',
    banco: 'Santander',
    rfc: 'GARP841205P93',
    curp: 'GARP841205HDFRZD09',
    nss: '12108412056',
    codigoPostalFiscal: '88730',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'pgarza@rtm-demo.mx',
    telefono: '899-234-1118',
  },
  {
    id: 'RTM-019',
    numeroEmpleado: 'RTM-019',
    nombre: 'Víctor Manuel Lozano',
    puesto: 'Operador Jianguo',
    departamento: 'Acabado',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2022-07-19',
    salarioDiario: 450.00,
    salarioDiarioIntegrado: 471.80,
    cuentaBancaria: '002180019284910283',
    banco: 'Citibanamex',
    rfc: 'LOZV930410TR2',
    curp: 'LOZV930410HDFRRN04',
    nss: '12179304108',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'vlozano@rtm-demo.mx',
    telefono: '899-234-1119',
  },
  {
    id: 'RTM-020',
    numeroEmpleado: 'RTM-020',
    nombre: 'Daniel Cárdenas Ortiz',
    puesto: 'Ayudante de Acabado',
    departamento: 'Acabado',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2023-11-15',
    salarioDiario: 350.00,
    salarioDiarioIntegrado: 365.10,
    cuentaBancaria: '012180084920193849',
    banco: 'BBVA Bancomer',
    rfc: 'CAOD010819LA4',
    curp: 'CAOD010819HDFRNT07',
    nss: '12230108191',
    codigoPostalFiscal: '88710',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'dcardenas@rtm-demo.mx',
    telefono: '899-234-1120',
  },

  // Serigrafía
  {
    id: 'RTM-021',
    numeroEmpleado: 'RTM-021',
    nombre: 'Marco Antonio Tovar',
    puesto: 'Operador de Serigrafía',
    departamento: 'Serigrafía',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2021-02-18',
    salarioDiario: 440.00,
    salarioDiarioIntegrado: 464.30,
    cuentaBancaria: '072180049201948271',
    banco: 'Banorte',
    rfc: 'TOVM880914PT1',
    curp: 'TOVM880914HDFRNT03',
    nss: '12138809145',
    codigoPostalFiscal: '88720',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'mtovar@rtm-demo.mx',
    telefono: '899-234-1121',
  },
  {
    id: 'RTM-022',
    numeroEmpleado: 'RTM-022',
    nombre: 'Alan Rodríguez Soto',
    puesto: 'Operador Lawson Screen',
    departamento: 'Serigrafía',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'CP pendiente', // DEMO: Error fiscal 1
    fechaIngreso: '2022-05-14',
    salarioDiario: 440.00,
    salarioDiarioIntegrado: 461.20,
    cuentaBancaria: '014180492810394819',
    banco: 'Santander',
    rfc: 'ROSA941103LK9',
    curp: 'ROSA941103HDFRRN08',
    nss: '12189411032',
    codigoPostalFiscal: '88799', // Código postal desactualizado
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'arodriguez@rtm-demo.mx',
    telefono: '899-234-1122',
  },

  // Almacén & Mantenimiento
  {
    id: 'RTM-023',
    numeroEmpleado: 'RTM-023',
    nombre: 'Alberto Navarro Díaz',
    puesto: 'Montacarguista / Almacén',
    departamento: 'Almacén',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2020-10-15',
    salarioDiario: 410.00,
    salarioDiarioIntegrado: 433.80,
    cuentaBancaria: '002180039201948271',
    banco: 'Citibanamex',
    rfc: 'NADA901201TR8',
    curp: 'NADA901201HDFRNT01',
    nss: '12159012017',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'anavarro@rtm-demo.mx',
    telefono: '899-234-1123',
  },
  {
    id: 'RTM-024',
    numeroEmpleado: 'RTM-024',
    nombre: 'Fernando Rangel Ibarra',
    puesto: 'Técnico de Mantenimiento',
    departamento: 'Mantenimiento',
    turno: 'Mixto',
    tipoNomina: 'Semanal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2019-08-01',
    salarioDiario: 560.00,
    salarioDiarioIntegrado: 601.20,
    cuentaBancaria: '012180049281039485',
    banco: 'BBVA Bancomer',
    rfc: 'RAIF870415HN2',
    curp: 'RAIF870415HDFRNT05',
    nss: '12118704153',
    codigoPostalFiscal: '88710',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'frangel@rtm-demo.mx',
    telefono: '899-234-1124',
  },

  // Quincenales / Supervisión / Calidad / Planeación / RH
  {
    id: 'RTM-025',
    numeroEmpleado: 'RTM-025',
    nombre: 'Gabriela Torres Lozano',
    puesto: 'Auditora de Calidad',
    departamento: 'Calidad',
    turno: 'Turno 1 (Matutino 07:00-15:00)',
    tipoNomina: 'Quincenal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2021-04-01',
    salarioDiario: 520.00,
    salarioDiarioIntegrado: 549.30,
    cuentaBancaria: '072180029384910283',
    banco: 'Banorte',
    rfc: 'TOLG920814KL9',
    curp: 'TOLG920814MDFRRN01',
    nss: '12169208144',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'gtorres@rtm-demo.mx',
    telefono: '899-234-1125',
  },
  {
    id: 'RTM-026',
    numeroEmpleado: 'RTM-026',
    nombre: 'Daniela Flores Garza',
    puesto: 'Auditora de Calidad',
    departamento: 'Calidad',
    turno: 'Turno 2 (Vespertino 15:00-23:00)',
    tipoNomina: 'Quincenal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2022-10-15',
    salarioDiario: 520.00,
    salarioDiarioIntegrado: 545.10,
    cuentaBancaria: '014180392019482910',
    banco: 'Santander',
    rfc: 'FOGD950320MN4',
    curp: 'FOGD950320MDFRZD06',
    nss: '12199503208',
    codigoPostalFiscal: '88720',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'dflores@rtm-demo.mx',
    telefono: '899-234-1126',
  },
  {
    id: 'RTM-027',
    numeroEmpleado: 'RTM-027',
    nombre: 'Iván Morales Cantú',
    puesto: 'Planeador de Producción',
    departamento: 'Planeación',
    turno: 'Administrativo (08:30-18:00)',
    tipoNomina: 'Quincenal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2020-01-10',
    salarioDiario: 680.00,
    salarioDiarioIntegrado: 728.40,
    cuentaBancaria: '002180049281039482',
    banco: 'Citibanamex',
    rfc: 'MOCI861128TR1',
    curp: 'MOCI861128HDFRNT09',
    nss: '12118611282',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'imorales@rtm-demo.mx',
    telefono: '899-234-1127',
  },
  {
    id: 'RTM-028',
    numeroEmpleado: 'RTM-028',
    nombre: 'Roberto Castillo Peña',
    puesto: 'Supervisor de Producción',
    departamento: 'Manufactura',
    turno: 'Mixto',
    tipoNomina: 'Quincenal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2017-04-03',
    salarioDiario: 750.00,
    salarioDiarioIntegrado: 815.60,
    cuentaBancaria: '012180019284910394',
    banco: 'BBVA Bancomer',
    rfc: 'CAPR820519LK3',
    curp: 'CAPR820519HDFRRN04',
    nss: '12078205197',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'rcastillo@rtm-demo.mx',
    telefono: '899-234-1128',
  },
  {
    id: 'RTM-029',
    numeroEmpleado: 'RTM-029',
    nombre: 'Andrea Salazar Ruiz',
    puesto: 'Analista de Recursos Humanos',
    departamento: 'RH',
    turno: 'Administrativo (08:30-18:00)',
    tipoNomina: 'Quincenal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2021-09-01',
    salarioDiario: 600.00,
    salarioDiarioIntegrado: 633.20,
    cuentaBancaria: '072180084920193842',
    banco: 'Banorte',
    rfc: 'SARA930215MN8',
    curp: 'SARA930215MDFRNT03',
    nss: '12179302159',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'asalazar@rtm-demo.mx',
    telefono: '899-234-1129',
  },
  {
    id: 'RTM-030',
    numeroEmpleado: 'RTM-030',
    nombre: 'Paola Jiménez Lara',
    puesto: 'Analista de Nómina',
    departamento: 'RH',
    turno: 'Administrativo (08:30-18:00)',
    tipoNomina: 'Quincenal',
    estatus: 'Activo',
    estadoFiscal: 'Validado SAT',
    fechaIngreso: '2022-02-15',
    salarioDiario: 620.00,
    salarioDiarioIntegrado: 651.80,
    cuentaBancaria: '014180492810293849',
    banco: 'Santander',
    rfc: 'JILP940722TR5',
    curp: 'JILP940722MDFRRN02',
    nss: '12189407223',
    codigoPostalFiscal: '88700',
    regimenContratacion: '02 - Sueldos y salarios',
    tipoContrato: '01 - Contrato de trabajo por tiempo indeterminado',
    email: 'pjimenez@rtm-demo.mx',
    telefono: '899-234-1130',
  },
];

// =====================================================================
// INCIDENCIAS DEL PERIODO (Con el caso especial Permiso con Reposición)
// =====================================================================

export const INITIAL_MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-001',
    empleadoId: 'RTM-001',
    empleadoNombre: 'Carlos Mendoza Ruiz',
    puesto: 'Operador Mark Andy 830 7”',
    departamento: 'Flexografía',
    tipo: 'hora_adicional',
    fecha: '2026-09-03',
    horas: 1.5,
    monto: 227.58,
    estado: 'autorizada',
    motivo: 'Tiempo extra para terminar tiraje urgente de etiquetas Pharma OP-95842.',
    autorizadoPor: 'Roberto Castillo Peña (Supervisor)',
    fechaAutorizacion: '2026-09-03 16:15',
  },
  {
    id: 'INC-2026-002',
    empleadoId: 'RTM-002',
    empleadoNombre: 'José Luis Herrera Soto',
    puesto: 'Operador Mark Andy 830 10”',
    departamento: 'Flexografía',
    tipo: 'hora_adicional',
    fecha: '2026-09-02',
    horas: 2.0,
    monto: 309.38,
    estado: 'autorizada',
    motivo: 'Calibración de rodillo anilox y preparación de línea Flexo turno vespertino.',
    autorizadoPor: 'Roberto Castillo Peña (Supervisor)',
    fechaAutorizacion: '2026-09-02 17:00',
  },
  {
    id: 'INC-2026-003',
    empleadoId: 'RTM-004',
    empleadoNombre: 'Ricardo Salinas Garza',
    puesto: 'Operador Mark Andy 4120',
    departamento: 'Flexografía',
    tipo: 'retardo',
    fecha: '2026-09-01',
    horas: 0.3,
    estado: 'pendiente_revision',
    motivo: 'Retardo de 18 min por falla mecánica en transporte de personal Ruta 4.',
  },
  {
    id: 'INC-2026-004',
    empleadoId: 'RTM-005',
    empleadoNombre: 'Jesús Alberto Peña',
    puesto: 'Operador BGM',
    departamento: 'Flexografía',
    tipo: 'permiso_con_reposicion',
    fecha: '2026-09-04',
    horas: 2.0,
    estado: 'autorizada',
    motivo: 'Permiso personal médico. Regla RTM: Sin descuento inmediato; reposición pactada en 2 sesiones.',
    autorizadoPor: 'Roberto Castillo Peña (Supervisor)',
    fechaAutorizacion: '2026-09-04 11:20',
    reposicion: {
      horasPermiso: 2.0,
      saldoPorReponer: 0.0, // Ya repuso las 2 horas en la semana
      fechaProgramada: '2026-09-09',
      historial: [
        { fecha: '2026-09-04', horasRepuestas: 0, registradoPor: 'Permiso otorgado de 2.0h' },
        { fecha: '2026-09-05', horasRepuestas: 1.0, registradoPor: 'Repuso 1.0h en turno 1 (Setup BGM)', opRelacionada: 'OP-95844' },
        { fecha: '2026-09-06', horasRepuestas: 1.0, registradoPor: 'Repuso 1.0h en turno 1 (Empaque)', opRelacionada: 'OP-95850' },
      ],
    },
  },
  {
    id: 'INC-2026-005',
    empleadoId: 'RTM-006',
    empleadoNombre: 'Juan Pablo Castillo',
    puesto: 'Operador BGM',
    departamento: 'Flexografía',
    tipo: 'checada_incompleta',
    fecha: '2026-09-04',
    estado: 'pendiente_revision',
    motivo: 'Omisión de registro de salida el viernes 04-sep. Supervisor confirmó salida normal 23:05.',
  },
  {
    id: 'INC-2026-006',
    empleadoId: 'RTM-007',
    empleadoNombre: 'Héctor Ramírez Luna',
    puesto: 'Operador Rotoflex',
    departamento: 'Flexografía',
    tipo: 'vacaciones',
    fecha: '2026-08-31',
    horas: 48,
    estado: 'autorizada',
    motivo: 'Periodo vacacional anual programado (Semana 36 completa).',
    autorizadoPor: 'Andrea Salazar Ruiz (RH)',
    fechaAutorizacion: '2026-08-20 10:00',
  },
  {
    id: 'INC-2026-007',
    empleadoId: 'RTM-009',
    empleadoNombre: 'Martín González Leal',
    puesto: 'Operador Conserver C1',
    departamento: 'Offset',
    tipo: 'hora_adicional',
    fecha: '2026-09-04',
    horas: 1.0,
    monto: 159.38,
    estado: 'autorizada',
    motivo: 'Cierre de pliegos sulfatada 14 pts para Alimentos del Norte.',
    autorizadoPor: 'Roberto Castillo Peña (Supervisor)',
    fechaAutorizacion: '2026-09-04 15:30',
  },
  {
    id: 'INC-2026-008',
    empleadoId: 'RTM-011',
    empleadoNombre: 'Óscar Daniel Rocha',
    puesto: 'Operador DiDDE 860',
    departamento: 'Offset',
    tipo: 'incapacidad',
    fecha: '2026-09-01',
    horas: 48,
    estado: 'autorizada',
    motivo: 'Incapacidad IMSS Enfermedad General Folio EG-2026-904 (Días 1 a 7).',
    autorizadoPor: 'Andrea Salazar Ruiz (RH)',
    fechaAutorizacion: '2026-09-01 09:30',
  },
  {
    id: 'INC-2026-009',
    empleadoId: 'RTM-016',
    empleadoNombre: 'Sergio Zamora Reyes',
    puesto: 'Operador Guillotina',
    departamento: 'Acabado',
    tipo: 'retardo',
    fecha: '2026-09-03',
    horas: 0.2,
    estado: 'autorizada',
    motivo: 'Retardo justificado 12 min por desvío vial en puente internacional.',
    autorizadoPor: 'Roberto Castillo Peña (Supervisor)',
    fechaAutorizacion: '2026-09-03 08:30',
  },
];

// =====================================================================
// CONCILIACIÓN ASISTENCIA VS PRODUCCIÓN (Diferenciador RTM)
// =====================================================================

export const INITIAL_MOCK_RECONCILIATIONS: ProductionReconciliation[] = [
  {
    id: 'REC-001',
    empleadoId: 'RTM-001',
    empleadoNombre: 'Carlos Mendoza Ruiz',
    puesto: 'Operador Mark Andy 830 7”',
    departamento: 'Flexografía',
    fecha: '2026-09-03',
    horasReloj: 8.25,
    horasProduccion: 7.90,
    diferencia: 0.35,
    maquina: 'Mark Andy 830 7" (Prensa 01)',
    ordenProduccion: 'OP-95842',
    actividad: 'Setup y corrida de 50k etiquetas Pharma',
    estado: 'dentro_tolerancia',
    observacion: 'Diferencia de 21 min por cambio de cliché y limpieza inicial. Dentro de la tolerancia permitida (45 min).',
  },
  {
    id: 'REC-002',
    empleadoId: 'RTM-003',
    empleadoNombre: 'Miguel Ángel Treviño',
    puesto: 'Operador Mark Andy Scout',
    departamento: 'Flexografía',
    fecha: '2026-09-02',
    horasReloj: 9.10,
    horasProduccion: 6.75,
    diferencia: 2.35,
    maquina: 'Mark Andy Scout (Prensa 03)',
    ordenProduccion: 'OP-95839',
    actividad: 'Impresión Flexo 4 tintas sustrato Bopp',
    estado: 'requiere_revision',
    observacion: 'Diferencia de 2.35 h superior a tolerancia. Auditoría confirmó paro de 2 horas por falta de tinta Pantone 485 C en andén.',
  },
  {
    id: 'REC-003',
    empleadoId: 'RTM-009',
    empleadoNombre: 'Martín González Leal',
    puesto: 'Operador Conserver C1',
    departamento: 'Offset',
    fecha: '2026-09-04',
    horasReloj: 8.50,
    horasProduccion: 8.20,
    diferencia: 0.30,
    maquina: 'Conserver C1 (Línea Offset 01)',
    ordenProduccion: 'OP-95851',
    actividad: 'Tiraje 12,000 pliegos Caple Sulfatada',
    estado: 'dentro_tolerancia',
    observacion: 'Tiempos de preparación y lavado dentro de estándar operativo.',
  },
  {
    id: 'REC-004',
    empleadoId: 'RTM-016',
    empleadoNombre: 'Sergio Zamora Reyes',
    puesto: 'Operador Guillotina',
    departamento: 'Acabado',
    fecha: '2026-09-03',
    horasReloj: 8.00,
    horasProduccion: 7.75,
    diferencia: 0.25,
    maquina: 'Guillotina Recta',
    ordenProduccion: 'OP-95846',
    actividad: 'Corte a pliego final 70x100 cm',
    estado: 'dentro_tolerancia',
    observacion: 'Operación continua. Merma y tiempo muerto dentro de rango.',
  },
];

// =====================================================================
// MATRIZ DE ASISTENCIA SEMANAL (Semana 36: 31 ago - 06 sep 2026)
// =====================================================================

export const INITIAL_MOCK_ATTENDANCE: AttendanceWeek[] = INITIAL_MOCK_EMPLOYEES.map((emp) => {
  const isVacaciones = emp.id === 'RTM-007';
  const isIncapacidad = emp.id === 'RTM-011';
  const isChecadaIncompleta = emp.id === 'RTM-006';
  const isRetardoSalinas = emp.id === 'RTM-004';
  const isRetardoZamora = emp.id === 'RTM-016';
  const isHorasExtraMendoza = emp.id === 'RTM-001';
  const isHorasExtraHerrera = emp.id === 'RTM-002';
  const isReposicionPena = emp.id === 'RTM-005';

  const dias: DayAttendance[] = [
    { dia: 'Lun', fecha: '2026-08-31', entrada: '06:58', salidaComida: '12:30', regresoComida: '13:00', salida: '15:02', horasTrabajadas: 8.0, horasAdicionales: 0, retardoMinutos: 0, tipoDia: 'ordinario' },
    { dia: 'Mar', fecha: '2026-09-01', entrada: '06:55', salidaComida: '12:30', regresoComida: '13:00', salida: '15:00', horasTrabajadas: 8.0, horasAdicionales: 0, retardoMinutos: 0, tipoDia: 'ordinario' },
    { dia: 'Mié', fecha: '2026-09-02', entrada: '06:59', salidaComida: '12:30', regresoComida: '13:00', salida: '15:05', horasTrabajadas: 8.0, horasAdicionales: 0, retardoMinutos: 0, tipoDia: 'ordinario' },
    { dia: 'Jue', fecha: '2026-09-03', entrada: '06:54', salidaComida: '12:30', regresoComida: '13:00', salida: '15:01', horasTrabajadas: 8.0, horasAdicionales: 0, retardoMinutos: 0, tipoDia: 'ordinario' },
    { dia: 'Vie', fecha: '2026-09-04', entrada: '06:58', salidaComida: '12:30', regresoComida: '13:00', salida: '15:00', horasTrabajadas: 8.0, horasAdicionales: 0, retardoMinutos: 0, tipoDia: 'ordinario' },
    { dia: 'Sáb', fecha: '2026-09-05', entrada: '06:57', salidaComida: '12:30', regresoComida: '13:00', salida: '15:00', horasTrabajadas: 8.0, horasAdicionales: 0, retardoMinutos: 0, tipoDia: 'ordinario' },
  ];

  if (isVacaciones) {
    dias.forEach((d) => {
      d.entrada = undefined;
      d.salida = undefined;
      d.horasTrabajadas = 0;
      d.tipoDia = 'vacaciones';
      d.detalle = 'Vacaciones autorizadas';
    });
  } else if (isIncapacidad) {
    dias.forEach((d) => {
      d.entrada = undefined;
      d.salida = undefined;
      d.horasTrabajadas = 0;
      d.tipoDia = 'incapacidad';
      d.detalle = 'Incapacidad IMSS EG-2026-904';
    });
  } else if (isChecadaIncompleta) {
    dias[4].salida = undefined; // Viernes sin salida
    dias[4].tipoDia = 'checada_incompleta';
    dias[4].detalle = 'Sin registro de salida';
  } else if (isRetardoSalinas) {
    dias[1].entrada = '07:18'; // Retardo 18 min
    dias[1].retardoMinutos = 18;
    dias[1].tipoDia = 'retardo';
    dias[1].detalle = 'Retardo 18 min';
  } else if (isRetardoZamora) {
    dias[3].entrada = '07:12'; // Retardo 12 min
    dias[3].retardoMinutos = 12;
    dias[3].tipoDia = 'retardo';
    dias[3].detalle = 'Retardo 12 min (justificado)';
  } else if (isHorasExtraMendoza) {
    dias[3].salida = '16:32'; // +1.5 h extra jueves
    dias[3].horasAdicionales = 1.5;
    dias[3].horasTrabajadas = 9.5;
    dias[3].detalle = '+1.5 h extra autorizada';
  } else if (isHorasExtraHerrera) {
    dias[2].salida = '17:01'; // +2.0 h extra miércoles
    dias[2].horasAdicionales = 2.0;
    dias[2].horasTrabajadas = 10.0;
    dias[2].detalle = '+2.0 h extra autorizada';
  } else if (isReposicionPena) {
    dias[4].salida = '13:00'; // Salida anticipada 2h el viernes
    dias[4].tipoDia = 'permiso_reposicion';
    dias[4].horasTrabajadas = 6.0;
    dias[4].detalle = 'Permiso 2.0 h con reposición';
    dias[5].salida = '16:00'; // Repuso 1h sábado
    dias[5].horasTrabajadas = 9.0;
    dias[5].horasAdicionales = 0; // Es reposición, no extra
    dias[5].detalle = 'Repuso 1.0 h de permiso';
  }

  const totalOrd = dias.reduce((acc, d) => acc + (d.tipoDia !== 'vacaciones' && d.tipoDia !== 'incapacidad' ? Math.min(8, d.horasTrabajadas) : 0), 0);
  const totalAdic = dias.reduce((acc, d) => acc + d.horasAdicionales, 0);
  const totalRet = dias.reduce((acc, d) => acc + d.retardoMinutos, 0);

  let estadoRevision: AttendanceWeek['estadoRevision'] = 'completo';
  if (isChecadaIncompleta) estadoRevision = 'checada_incompleta';
  else if (isRetardoSalinas || isReposicionPena) estadoRevision = 'requiere_atencion';

  return {
    empleadoId: emp.id,
    semana: 'Semana 36 (31 ago - 06 sep 2026)',
    dias,
    totalHorasOrdinarias: totalOrd,
    totalHorasAdicionales: totalAdic,
    totalRetardosMin: totalRet,
    totalFaltas: 0,
    estadoRevision,
  };
});

// =====================================================================
// PRE-NÓMINA & CÁLCULOS FISCALES MOCK DE LOS 30 EMPLEADOS
// =====================================================================

export const INITIAL_MOCK_PAYROLL_CALCULATIONS: EmployeePayroll[] = INITIAL_MOCK_EMPLOYEES.map((emp) => {
  const isMendoza = emp.id === 'RTM-001';
  const isHerrera = emp.id === 'RTM-002';
  const isVacaciones = emp.id === 'RTM-007';
  const isIncapacidad = emp.id === 'RTM-011';
  const isChecadaFaltante = emp.id === 'RTM-006';
  const isCpPendiente = emp.id === 'RTM-022'; // Error timbrado 1
  const isRfcPendiente = emp.id === 'RTM-008'; // Error timbrado 2

  const dias = isVacaciones ? 6 : isIncapacidad ? 0 : 6;
  const horasOrd = dias * 8;
  const horasAdic = isMendoza ? 1.5 : isHerrera ? 2.0 : 0;

  const sueldoBase = Math.round(emp.salarioDiario * (isIncapacidad ? 0 : 7) * 100) / 100;
  const horaExtraImporte = Math.round(((emp.salarioDiario / 8) * 2 * horasAdic) * 100) / 100;
  const bonoPuntualidad = (isMendoza || isHerrera || emp.id === 'RTM-009') ? 250.00 : 150.00;
  const primaVacacional = isVacaciones ? Math.round((emp.salarioDiario * 6 * 0.25) * 100) / 100 : 0;

  const percepciones: PayrollConcept[] = [
    { id: 'p1', claveSat: '001', descripcion: 'Sueldo Ordinario', tipo: 'percepcion', importe: sueldoBase, gravado: sueldoBase, exento: 0, origen: '7 días salario' },
  ];

  if (horasAdic > 0) {
    percepciones.push({
      id: 'p2',
      claveSat: '019',
      descripcion: 'Horas Extra Dobles',
      tipo: 'percepcion',
      importe: horaExtraImporte,
      gravado: horaExtraImporte * 0.5,
      exento: horaExtraImporte * 0.5,
      origen: `${horasAdic} h autorizadas por supervisor`,
    });
  }

  if (bonoPuntualidad > 0 && !isIncapacidad) {
    percepciones.push({
      id: 'p3',
      claveSat: '010',
      descripcion: 'Premio de Puntualidad y Asistencia',
      tipo: 'percepcion',
      importe: bonoPuntualidad,
      gravado: bonoPuntualidad,
      exento: 0,
      origen: 'Políticas RTM 100% checadas puntuales',
    });
  }

  if (primaVacacional > 0) {
    percepciones.push({
      id: 'p4',
      claveSat: '021',
      descripcion: 'Prima Vacacional 25%',
      tipo: 'percepcion',
      importe: primaVacacional,
      gravado: Math.max(0, primaVacacional - 1500),
      exento: Math.min(primaVacacional, 1500),
      origen: 'Aniversario laboral RTM (12 días)',
    });
  }

  const totalPercep = percepciones.reduce((acc, p) => acc + p.importe, 0);

  // Deducciones
  const isrMock = isIncapacidad ? 0 : Math.round(totalPercep * 0.088 * 100) / 100;
  const imssMock = isIncapacidad ? 0 : Math.round(totalPercep * 0.024 * 100) / 100;

  const deducciones: PayrollConcept[] = [
    { id: 'd1', claveSat: '002', descripcion: 'Retención de ISR (Tablas SAT Art. 96)', tipo: 'deduccion', importe: isrMock, gravado: 0, exento: 0 },
    { id: 'd2', claveSat: '001', descripcion: 'Cuota Obrera IMSS (Cesantía y Vejez)', tipo: 'deduccion', importe: imssMock, gravado: 0, exento: 0 },
  ];

  const totalDeduc = deducciones.reduce((acc, d) => acc + d.importe, 0);
  const neto = Math.round((totalPercep - totalDeduc) * 100) / 100;

  let estadoValidacion: EmployeePayroll['estadoValidacion'] = 'listo';
  let motivoRev: string | undefined = undefined;

  if (isChecadaFaltante) {
    estadoValidacion = 'requiere_revision';
    motivoRev = 'Checada de salida del viernes pendiente de confirmar';
  } else if (isCpPendiente) {
    estadoValidacion = 'requiere_revision';
    motivoRev = 'Código postal fiscal requiere validación con Constancia SAT';
  } else if (isRfcPendiente) {
    estadoValidacion = 'requiere_revision';
    motivoRev = 'Homoclave RFC requiere validación ante catálogo SAT';
  }

  return {
    empleadoId: emp.id,
    empleadoNombre: emp.nombre,
    numeroEmpleado: emp.numeroEmpleado,
    puesto: emp.puesto,
    departamento: emp.departamento,
    tipoNomina: emp.tipoNomina,
    diasTrabajados: dias,
    horasOrdinarias: horasOrd,
    horasAdicionales: horasAdic,
    percepciones,
    deducciones,
    totalPercepciones: totalPercep,
    totalDeducciones: totalDeduc,
    isrtotal: isrMock,
    imsstotal: imssMock,
    netoAPagar: neto,
    estadoValidacion,
    motivoRevision: motivoRev,
    validaciones: {
      checadasCompletas: !isChecadaFaltante,
      incidenciasAutorizadas: true,
      netoNoNegativo: neto > 0,
      datosFiscalesCompletos: !isCpPendiente && !isRfcPendiente,
      cuentaBancariaPresente: true,
      periodoCorrecto: true,
    },
    cfdiStatus: 'pendiente',
    uuidSat: undefined,
  };
});

// =====================================================================
// PERIODO DEMO PRINCIPAL Y HISTÓRICO
// =====================================================================

export const INITIAL_MOCK_PAYROLL_PERIODS: PayrollPeriod[] = [
  {
    id: 'per-2026-36',
    codigo: 'SEM-2026-36',
    nombre: 'Semanal · 31 ago – 06 sep 2026 · Planta Reynosa',
    tipo: 'Semanal',
    fechaInicio: '2026-08-31',
    fechaFin: '2026-09-06',
    fechaPago: '2026-09-07',
    estado: 'en_revision',
    totalEmpleados: 30,
    percepcionesTotales: 144580.40,
    deduccionesTotales: 16120.05,
    netoTotal: 128460.35,
    horasExtraTotales: 41.5,
    incidenciasTotales: 5,
  },
  {
    id: 'per-2026-35',
    codigo: 'SEM-2026-35',
    nombre: 'Semanal · 24 ago – 30 ago 2026 · Planta Reynosa',
    tipo: 'Semanal',
    fechaInicio: '2026-08-24',
    fechaFin: '2026-08-30',
    fechaPago: '2026-08-31',
    estado: 'timbrada',
    totalEmpleados: 30,
    percepcionesTotales: 142100.00,
    deduccionesTotales: 15890.20,
    netoTotal: 126209.80,
    horasExtraTotales: 38.0,
    incidenciasTotales: 4,
    fechaCierre: '2026-08-30 18:30',
    fechaTimbrado: '2026-08-31 10:15',
    cerradoPor: 'Paola Jiménez Lara (Nóminas)',
  },
  {
    id: 'per-2026-34',
    codigo: 'SEM-2026-34',
    nombre: 'Semanal · 17 ago – 23 ago 2026 · Planta Reynosa',
    tipo: 'Semanal',
    fechaInicio: '2026-08-17',
    fechaFin: '2026-08-23',
    fechaPago: '2026-08-24',
    estado: 'timbrada',
    totalEmpleados: 30,
    percepcionesTotales: 139800.50,
    deduccionesTotales: 15420.00,
    netoTotal: 124380.50,
    horasExtraTotales: 34.0,
    incidenciasTotales: 3,
    fechaCierre: '2026-08-23 19:00',
    fechaTimbrado: '2026-08-24 09:40',
    cerradoPor: 'Paola Jiménez Lara (Nóminas)',
  },
  {
    id: 'per-2026-33',
    codigo: 'SEM-2026-33',
    nombre: 'Semanal · 10 ago – 16 ago 2026 · Planta Reynosa',
    tipo: 'Semanal',
    fechaInicio: '2026-08-10',
    fechaFin: '2026-08-16',
    fechaPago: '2026-08-17',
    estado: 'timbrada',
    totalEmpleados: 30,
    percepcionesTotales: 145300.00,
    deduccionesTotales: 16210.80,
    netoTotal: 129089.20,
    horasExtraTotales: 44.0,
    incidenciasTotales: 6,
    fechaCierre: '2026-08-16 18:45',
    fechaTimbrado: '2026-08-17 11:20',
    cerradoPor: 'Paola Jiménez Lara (Nóminas)',
  },
  {
    id: 'per-2026-Q16',
    codigo: 'QN-2026-16',
    nombre: 'Quincenal · 16 ago – 31 ago 2026 · Planta Reynosa',
    tipo: 'Quincenal',
    fechaInicio: '2026-08-16',
    fechaFin: '2026-08-31',
    fechaPago: '2026-08-31',
    estado: 'timbrada',
    totalEmpleados: 6, // Administrativos / Supervisión
    percepcionesTotales: 58900.00,
    deduccionesTotales: 7820.00,
    netoTotal: 51080.00,
    horasExtraTotales: 0,
    incidenciasTotales: 1,
    fechaCierre: '2026-08-31 16:00',
    fechaTimbrado: '2026-08-31 16:45',
    cerradoPor: 'Paola Jiménez Lara (Nóminas)',
  },
];

// =====================================================================
// AUDITORÍA Y TRAZABILIDAD SEED
// =====================================================================

export const INITIAL_MOCK_AUDIT_LOG: PayrollAuditEntry[] = [
  {
    id: 'aud-001',
    fechaHora: '2026-09-06 14:32',
    usuario: 'Paola Jiménez Lara (Analista de Nómina)',
    accion: 'Ajuste de horas adicionales',
    detalle: 'Ajustó incidencia de 1.0 h a 1.5 h para Carlos Mendoza Ruiz (RTM-001)',
    motivo: 'Corrección de captura de tiempo extra autorizada por supervisor de producción.',
  },
  {
    id: 'aud-002',
    fechaHora: '2026-09-06 11:15',
    usuario: 'Andrea Salazar Ruiz (Recursos Humanos)',
    accion: 'Autorización de Permiso con Reposición',
    detalle: 'Autorizó permiso de 2.0 h para Jesús Alberto Peña (RTM-005)',
    motivo: 'Cita médica particular con compromiso de reposición de horas en fin de semana.',
  },
  {
    id: 'aud-003',
    fechaHora: '2026-09-05 16:40',
    usuario: 'Roberto Castillo Peña (Supervisor de Producción)',
    accion: 'Conciliación de horas reloj vs producción',
    detalle: 'Registró justificación operativa para Miguel Ángel Treviño (RTM-003)',
    motivo: 'Paro técnico de 2.35 h por falta de sustrato en andén de materias primas.',
  },
  {
    id: 'aud-004',
    fechaHora: '2026-09-04 18:00',
    usuario: 'Paola Jiménez Lara (Analista de Nómina)',
    accion: 'Importación de checadas reloj biométrico',
    detalle: 'Procesamiento de archivo ZKTeco_Reynosa_W36.dat · 1,284 registros procesados',
    motivo: 'Carga semanal programada de asistencia de planta.',
  },
  {
    id: 'aud-005',
    fechaHora: '2026-08-31 10:20',
    usuario: 'Sistema Timbrado PAC Demo (CFDI 4.0)',
    accion: 'Timbrado de nómina semana 35',
    detalle: '30 comprobantes fiscales generados exitosamente con UUID SAT',
    motivo: 'Dispersión y cumplimiento fiscal de nómina semanal.',
  },
];
