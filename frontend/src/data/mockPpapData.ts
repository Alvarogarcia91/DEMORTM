// ====================================================
// MODELOS Y DATOS MOCK: PPAP & CORE TOOLS ENTERPRISE
// AIAG PPAP 4th Ed. · APQP · PFMEA · Control Plan · MSA · SPC
// Wording humano para auditores e ingenieros de Calidad
// ====================================================

export type PpapSubmissionLevel = 1 | 2 | 3 | 4 | 5;

export type PpapStatus =
  | 'En preparación'
  | 'En revisión con Calidad'
  | 'Pendiente de información'
  | 'Pendiente del cliente'
  | 'Aprobado'
  | 'Requiere actualización';

export type PpapSubmissionReason =
  | 'Nueva parte'
  | 'Cambio de ingeniería / revisión'
  | 'Cambio de proceso'
  | 'Cambio de material'
  | 'Revalidación anual'
  | 'Otro requerimiento de cliente';

export type PpapProcessArea = 'Flexografía' | 'Offset' | 'Acabados';

export interface PpapChecklistItem {
  id: string;
  elementNumber: number;
  name: string; // Nombre formal AIAG
  humanLabel: string; // Explicación humana
  status: 'Completo' | 'Requiere actualización' | 'Pendiente' | 'No aplica';
  documentRef?: string;
  lastReviewDate?: string;
  notes?: string;
}

export interface PpapDocument {
  id: string;
  name: string;
  code: string;
  revision: string;
  category: 'Dibujo y Especificaciones' | 'Proceso y Riesgos' | 'Validación y Resultados' | 'Aprobaciones y PSW';
  status: 'Aprobado' | 'En revisión' | 'Requiere actualización' | 'Borrador' | 'Obsoleto';
  responsible: string;
  date: string;
  fileSize: string;
  warningNote?: string;
}

export interface PpapDimensionalResult {
  id: string;
  itemNumber: number;
  characteristic: string;
  specification: string;
  nominal: number;
  tolerance: string;
  measured: number;
  unit: string;
  instrument: string;
  sampleSize: number;
  inSpec: boolean;
  notes?: string;
}

export interface PpapColorVisualResult {
  id: string;
  parameter: string;
  specification: string;
  measured: string;
  deltaE?: number;
  instrument: string;
  result: 'Conforme' | 'Fuera de tolerancia' | 'En observación';
}

export interface PpapSpcMetric {
  characteristic: string;
  subgroups: number;
  sampleSize: number;
  cpk: number;
  ppk: number;
  mean: number;
  stdDev: number;
  isCapable: boolean; // Cpk >= 1.33
  demonstrativeNotice: string; // "Datos demostrativos para validación visual de proceso"
}

export interface PpapPfmeaRow {
  id: string;
  stepNumber: number;
  processStep: string;
  failureMode: string;
  failureEffect: string;
  severity: number; // 1-10
  potentialCause: string;
  occurrence: number; // 1-10
  currentControls: string;
  detection: number; // 1-10
  rpn: number; // S * O * D
  actionPriority: 'Alta' | 'Media' | 'Baja';
  recommendedAction: string;
  responsible: string;
  status: 'Implementada' | 'En proceso' | 'Requiere actualización';
  revisedRpn?: number;
}

export interface PpapControlPlanItem {
  id: string;
  stepNumber: number;
  operation: string;
  machine: string;
  characteristic: string;
  classification: 'Crítica' | 'Mayor' | 'Estándar';
  specification: string;
  measurementMethod: string;
  sampleSize: string;
  frequency: string;
  instrument: string;
  responsible: string;
  reactionPlan: string;
}

export interface PpapValidationSample {
  opFolio: string;
  runDate: string;
  producedQuantity: number;
  sampleQuantity: number;
  inspectedBy: string;
  releaseStatus: 'Liberada conforme' | 'En cuarentena' | 'Pendiente de liberación';
  lotNumber: string;
  coaFolio: string;
  notes: string;
}

export interface PpapApprovalStep {
  id: string;
  role: string;
  humanTitle: string;
  assignedTo: string;
  status: 'Pendiente' | 'Revisado' | 'Aprobado' | 'Requiere cambios';
  date?: string;
  comments?: string;
}

export interface PpapHistoryEntry {
  id: string;
  date: string;
  user: string;
  action: string;
  details: string;
  badgeTone: 'default' | 'primary' | 'success' | 'amber' | 'rose';
}

export interface PpapSystemSuggestion {
  id: string;
  caseId: string;
  title: string;
  description: string;
  recommendation: string;
  actionLabel: string;
  actionTabTarget?: string;
  tone: 'purple';
}

export interface PpapCase {
  id: string;
  folio: string;
  client: string;
  clientCode: string;
  partNumber: string;
  partName: string;
  revision: string;
  previousRevision?: string;
  processArea: PpapProcessArea;
  family: string;
  submissionLevel: PpapSubmissionLevel;
  submissionReason: PpapSubmissionReason;
  status: PpapStatus;
  completionPercentage: number;
  targetDate: string;
  lastUpdated: string;
  owner: string;
  // Vínculos cruzados
  demandingOp?: string;
  validationLot?: string;
  // PSW (Part Submission Warrant)
  pswStatus: 'Pendiente de firma' | 'Firmado internamente' | 'Aprobado por cliente' | 'Rechazado';
  pswApprovalDate?: string;
  clientContact?: string;
  // Alerta destacada para bloque "Requieren tu atención"
  attentionNote?: string;
  attentionCtaText?: string;
  // Subdatos
  checklist: PpapChecklistItem[];
  documents: PpapDocument[];
  dimensionalResults: PpapDimensionalResult[];
  colorVisualResults: PpapColorVisualResult[];
  spcMetrics?: PpapSpcMetric[];
  pfmeaRows: PpapPfmeaRow[];
  controlPlanItems: PpapControlPlanItem[];
  validationSample: PpapValidationSample;
  approvals: PpapApprovalStep[];
  history: PpapHistoryEntry[];
}

// ----------------------------------------------------
// 18 ELEMENTOS CANÓNICOS DEL PPAP (AIAG 4ta Edición)
// ----------------------------------------------------
export const DEFAULT_18_PPAP_ELEMENTS: Omit<PpapChecklistItem, 'id' | 'status' | 'documentRef' | 'lastReviewDate' | 'notes'>[] = [
  { elementNumber: 1, name: 'Design Records', humanLabel: 'Dibujo / Especificación técnica del cliente aprobada' },
  { elementNumber: 2, name: 'Engineering Change Documents', humanLabel: 'Avisos de cambio de ingeniería (ECO/ECN)' },
  { elementNumber: 3, name: 'Customer Engineering Approval', humanLabel: 'Aprobación formal de ingeniería del cliente' },
  { elementNumber: 4, name: 'Design FMEA (DFMEA)', humanLabel: 'Análisis de modos de falla de diseño (si aplica a RTM)' },
  { elementNumber: 5, name: 'Process Flow Diagrams', humanLabel: 'Diagrama de flujo del proceso de manufactura' },
  { elementNumber: 6, name: 'Process FMEA (PFMEA)', humanLabel: 'Análisis de riesgos del proceso (PFMEA)' },
  { elementNumber: 7, name: 'Control Plan', humanLabel: 'Plan de Control de manufactura (PCP)' },
  { elementNumber: 8, name: 'Measurement System Analysis (MSA)', humanLabel: 'Validación del sistema de medición (Gage R&R)' },
  { elementNumber: 9, name: 'Dimensional Results', humanLabel: 'Reporte de resultados dimensionales de corrida inicial' },
  { elementNumber: 10, name: 'Material / Performance Test Results', humanLabel: 'Certificados de material y pruebas de desempeño' },
  { elementNumber: 11, name: 'Initial Process Studies (SPC)', humanLabel: 'Estudio preliminar de capacidad de proceso (Cp/Cpk)' },
  { elementNumber: 12, name: 'Qualified Laboratory Documentation', humanLabel: 'Acreditaciones de laboratorio de pruebas y CoAs' },
  { elementNumber: 13, name: 'Appearance Approval Report (AAR)', humanLabel: 'Reporte de aprobación de apariencia y color (Delta E)' },
  { elementNumber: 14, name: 'Sample Production Parts', humanLabel: 'Muestra física de piezas representativas de corrida' },
  { elementNumber: 15, name: 'Master Sample', humanLabel: 'Muestra maestra de retención física controlada' },
  { elementNumber: 16, name: 'Checking Aids', humanLabel: 'Ayudas de inspección, plantillas y calibres go/no-go' },
  { elementNumber: 17, name: 'Customer-Specific Requirements', humanLabel: 'Cumplimiento de requisitos específicos del cliente (CSR)' },
  { elementNumber: 18, name: 'Part Submission Warrant (PSW)', humanLabel: 'Certificado de sumisión de parte (PSW firmado)' },
];

// ====================================================
// CASOS DEMO COMPLETOS COHERENTES
// ====================================================

export const INITIAL_PPAP_CASES: PpapCase[] = [
  // --------------------------------------------------
  // 1. PANASONIC · 526412 · Rev H (Caso Estrella Demo)
  // --------------------------------------------------
  {
    id: 'ppap-panasonic-526412',
    folio: 'PPAP-2026-001',
    client: 'Panasonic Industrial Devices',
    clientCode: 'CL-PAN-01',
    partNumber: '526412',
    partName: 'Etiqueta autoadherible 75x50mm BOPP Blanco',
    revision: 'Rev H',
    previousRevision: 'Rev G',
    processArea: 'Flexografía',
    family: 'Etiquetas Industriales y Electrónicos',
    submissionLevel: 3,
    submissionReason: 'Cambio de ingeniería / revisión',
    status: 'En preparación',
    completionPercentage: 78,
    targetDate: '18 Sep 2026',
    lastUpdated: '07 Sep 2026 · 11:20',
    owner: 'Alicia Ramírez (Aseguramiento de Calidad)',
    demandingOp: 'OP-2026-95250',
    validationLot: 'BCH-44951',
    pswStatus: 'Pendiente de firma',
    clientContact: 'Ing. Kenji Takahashi (Quality Engineering · Panasonic)',
    attentionNote: 'El PFMEA requiere actualización técnica antes de poder enviar el expediente.',
    attentionCtaText: 'Revisar expediente',
    checklist: [
      { id: 'ck-1', elementNumber: 1, name: 'Design Records', humanLabel: 'Dibujo del cliente aprobado', status: 'Completo', documentRef: 'DIB-PAN-526412-H.pdf', lastReviewDate: '03 Sep 2026' },
      { id: 'ck-2', elementNumber: 2, name: 'Engineering Change Documents', humanLabel: 'Aviso de cambio ECN', status: 'Completo', documentRef: 'ECN-2026-084.pdf', lastReviewDate: '03 Sep 2026' },
      { id: 'ck-3', elementNumber: 3, name: 'Customer Engineering Approval', humanLabel: 'Aprobación de ingeniería cliente', status: 'Completo', documentRef: 'ENG-APP-PAN-H.pdf', lastReviewDate: '04 Sep 2026' },
      { id: 'ck-4', elementNumber: 4, name: 'Design FMEA (DFMEA)', humanLabel: 'DFMEA (Diseño de cliente)', status: 'No aplica', notes: 'RTM no diseña el producto, responsabilidad del cliente.' },
      { id: 'ck-5', elementNumber: 5, name: 'Process Flow Diagrams', humanLabel: 'Diagrama de flujo de manufactura', status: 'Completo', documentRef: 'DF-FLX-014-Rev4.pdf', lastReviewDate: '05 Sep 2026' },
      { id: 'ck-6', elementNumber: 6, name: 'Process FMEA (PFMEA)', humanLabel: 'PFMEA · Análisis de riesgos del proceso', status: 'Requiere actualización', documentRef: 'AMEF-PR-FLX-08-G.pdf', notes: 'Sigue referenciando Rev G. Requiere incorporar riesgo de curado UV en Rev H.' },
      { id: 'ck-7', elementNumber: 7, name: 'Control Plan', humanLabel: 'Plan de Control de proceso (PCP)', status: 'Completo', documentRef: 'PCP-FLX-526412-H.pdf', lastReviewDate: '05 Sep 2026' },
      { id: 'ck-8', elementNumber: 8, name: 'Measurement System Analysis (MSA)', humanLabel: 'Validación del sistema de medición (Gage R&R)', status: 'Completo', documentRef: 'MSA-MIT-042-2026.pdf', lastReviewDate: '06 Sep 2026' },
      { id: 'ck-9', elementNumber: 9, name: 'Dimensional Results', humanLabel: 'Resultados dimensionales de corrida inicial', status: 'Completo', documentRef: 'DIM-526412-BCH44951.pdf', lastReviewDate: '06 Sep 2026' },
      { id: 'ck-10', elementNumber: 10, name: 'Material / Performance Tests', humanLabel: 'Certificados de material y pruebas de adhesión', status: 'Completo', documentRef: 'COA-FASSON-BOPP-992.pdf', lastReviewDate: '06 Sep 2026' },
      { id: 'ck-11', elementNumber: 11, name: 'Initial Process Studies (SPC)', humanLabel: 'Estudio de estabilidad y capacidad (Cpk)', status: 'Completo', documentRef: 'SPC-526412-CPK.pdf', lastReviewDate: '06 Sep 2026' },
      { id: 'ck-12', elementNumber: 12, name: 'Qualified Laboratory Documentation', humanLabel: 'Documentación de laboratorio y CoAs', status: 'Completo', documentRef: 'LAB-ISO17025-RTM.pdf', lastReviewDate: '05 Sep 2026' },
      { id: 'ck-13', elementNumber: 13, name: 'Appearance Approval Report (AAR)', humanLabel: 'Reporte de apariencia y color X-Rite', status: 'Completo', documentRef: 'AAR-PAN-526412.pdf', lastReviewDate: '06 Sep 2026' },
      { id: 'ck-14', elementNumber: 14, name: 'Sample Production Parts', humanLabel: 'Muestra física de producción (300 piezas)', status: 'Completo', notes: 'Custodiada en Almacén QA · Caja M-04' },
      { id: 'ck-15', elementNumber: 15, name: 'Master Sample', humanLabel: 'Muestra maestra de retención', status: 'Completo', notes: 'Firmada por Calidad y Operador' },
      { id: 'ck-16', elementNumber: 16, name: 'Checking Aids', humanLabel: 'Ayudas visuales y calibres de verificación', status: 'Completo', documentRef: 'AV-FLX-088.pdf', lastReviewDate: '05 Sep 2026' },
      { id: 'ck-17', elementNumber: 17, name: 'Customer-Specific Requirements', humanLabel: 'Requisitos específicos Panasonic (CSR)', status: 'Completo', documentRef: 'CSR-PAN-Q-2026.pdf', lastReviewDate: '04 Sep 2026' },
      { id: 'ck-18', elementNumber: 18, name: 'Part Submission Warrant (PSW)', humanLabel: 'Certificado PSW de sumisión', status: 'Pendiente', notes: 'Pendiente firma final tras actualización del PFMEA.' },
    ],
    documents: [
      { id: 'doc-1', name: 'Dibujo Técnico Panasonic Rev H', code: 'DWG-526412-H', revision: 'H', category: 'Dibujo y Especificaciones', status: 'Aprobado', responsible: 'Ing. Kenji Takahashi', date: '03 Sep 2026', fileSize: '2.4 MB' },
      { id: 'doc-2', name: 'Diagrama de Flujo del Proceso', code: 'DF-FLX-526412', revision: '04', category: 'Proceso y Riesgos', status: 'Aprobado', responsible: 'Roberto Morales (Producción)', date: '05 Sep 2026', fileSize: '1.1 MB' },
      { id: 'doc-3', name: 'PFMEA de Prensa Flexográfica Mark Andy', code: 'AMEF-FLX-08', revision: 'G (Desfasada)', category: 'Proceso y Riesgos', status: 'Requiere actualización', responsible: 'Alicia Ramírez (Calidad)', date: '14 Ene 2026', fileSize: '850 KB', warningNote: 'Requiere actualizar a Rev H para incluir control de lámpara LED UV en sustrato sintético.' },
      { id: 'doc-4', name: 'Plan de Control de Manufactura', code: 'PCP-526412-H', revision: 'H', category: 'Proceso y Riesgos', status: 'Aprobado', responsible: 'Alicia Ramírez (Calidad)', date: '05 Sep 2026', fileSize: '1.6 MB' },
      { id: 'doc-5', name: 'Certificado de Calidad Materia Prima (Fasson BOPP)', code: 'COA-AVERY-992', revision: 'A', category: 'Validación y Resultados', status: 'Aprobado', responsible: 'Almacén MP / Avery Dennison', date: '02 Sep 2026', fileSize: '520 KB' },
      { id: 'doc-6', name: 'Estudio de R&R Sistema de Medición Micrómetro', code: 'MSA-GAGE-RR-04', revision: '01', category: 'Validación y Resultados', status: 'Aprobado', responsible: 'Laboratorio Metrología', date: '06 Sep 2026', fileSize: '980 KB' },
      { id: 'doc-7', name: 'Warrant de Sumisión de Parte (PSW borrador)', code: 'PSW-PAN-526412', revision: 'H-DRAFT', category: 'Aprobaciones y PSW', status: 'Borrador', responsible: 'Alicia Ramírez', date: '07 Sep 2026', fileSize: '340 KB' },
    ],
    dimensionalResults: [
      { id: 'dim-1', itemNumber: 1, characteristic: 'Ancho total de etiqueta', specification: '75.00 ± 0.30 mm', nominal: 75.00, tolerance: '±0.30', measured: 75.08, unit: 'mm', instrument: 'Vernier Mitutoyo Calibrado', sampleSize: 32, inSpec: true },
      { id: 'dim-2', itemNumber: 2, characteristic: 'Largo total de etiqueta', specification: '50.00 ± 0.30 mm', nominal: 50.00, tolerance: '±0.30', measured: 50.12, unit: 'mm', instrument: 'Vernier Mitutoyo Calibrado', sampleSize: 32, inSpec: true },
      { id: 'dim-3', itemNumber: 3, characteristic: 'Radio de esquinas (R)', specification: '2.00 ± 0.20 mm', nominal: 2.00, tolerance: '±0.20', measured: 1.95, unit: 'mm', instrument: 'Comparador óptico', sampleSize: 10, inSpec: true },
      { id: 'dim-4', itemNumber: 4, characteristic: 'Espesor sustrato + adhesivo', specification: '58.00 ± 4.00 µm', nominal: 58.00, tolerance: '±4.00', measured: 57.50, unit: 'µm', instrument: 'Micrómetro digital de espesores', sampleSize: 20, inSpec: true },
      { id: 'dim-5', itemNumber: 5, characteristic: 'Corte al liner (Sin penetración)', specification: '0 micras penetración en liner', nominal: 0, tolerance: 'Max 5 µm marca', measured: 0, unit: 'µm', instrument: 'Microscopio óptico 40x', sampleSize: 15, inSpec: true },
    ],
    colorVisualResults: [
      { id: 'col-1', parameter: 'Tono Negro Texto (Process Black)', specification: 'Densidad 1.65 ± 0.10', measured: '1.68', instrument: 'Espectrofotómetro X-Rite eXact', result: 'Conforme' },
      { id: 'col-2', parameter: 'Tono Azul Corporativo Panasonic (PMS 287C)', specification: 'Delta E ≤ 1.50 vs Master', measured: 'Delta E: 0.84', deltaE: 0.84, instrument: 'X-Rite eXact (D50, 2°)', result: 'Conforme' },
      { id: 'col-3', parameter: 'Registro visual de 3 tintas UV', specification: 'Descalce ≤ 0.10 mm', measured: '0.04 mm', instrument: 'Lupa cuenta hilos graduada 20x', result: 'Conforme' },
      { id: 'col-4', parameter: 'Prueba de frote químico (Alcohol 70%)', specification: 'Min 50 dobles pasadas sin sangrado', measured: '75 dobles pasadas intactas', instrument: 'Crockmeter mecánico estándar', result: 'Conforme' },
    ],
    spcMetrics: [
      {
        characteristic: 'Ancho de Etiqueta (75.00 ± 0.30 mm)',
        subgroups: 25,
        sampleSize: 125,
        mean: 75.04,
        stdDev: 0.051,
        cpk: 1.70,
        ppk: 1.64,
        isCapable: true,
        demonstrativeNotice: 'Datos demostrativos de corrida piloto preliminar (300 piezas).'
      }
    ],
    pfmeaRows: [
      {
        id: 'pfmea-1',
        stepNumber: 10,
        processStep: 'Montaje de bobina y alineador de banda',
        failureMode: 'Tensión irregular de banda',
        failureEffect: 'Desalineación de corte y burbujas en laminado',
        severity: 7,
        potentialCause: 'Desgaste en sensor ultrasónico de orilla',
        occurrence: 3,
        currentControls: 'Inspección de orilla automática en pantalla táctil',
        detection: 3,
        rpn: 63,
        actionPriority: 'Baja',
        recommendedAction: 'Verificar celda de carga antes de arrancar',
        responsible: 'Roberto Morales (Producción)',
        status: 'Implementada',
        revisedRpn: 42
      },
      {
        id: 'pfmea-2',
        stepNumber: 20,
        processStep: 'Impresión Flexográfica Tintas UV',
        failureMode: 'Curado incompleto por lámparas UV agotadas (Falta actualización en Rev H)',
        failureEffect: 'Desprendimiento de tinta en prueba de frote con Panasonic',
        severity: 8,
        potentialCause: 'Degradación de horas de vida útil de lámparas LED UV',
        occurrence: 6,
        currentControls: 'Monitoreo de horas de lámpara mensual',
        detection: 6,
        rpn: 288,
        actionPriority: 'Alta',
        recommendedAction: 'Actualizar AMEF para incluir radiómetro UV diario en línea (Req. Rev H)',
        responsible: 'Alicia Ramírez (Calidad)',
        status: 'Requiere actualización',
      },
      {
        id: 'pfmea-3',
        stepNumber: 30,
        processStep: 'Troquelado Rotativo Magnético',
        failureMode: 'Corte profundo que hiere el liner siliconado',
        failureEffect: 'Ruptura de bobina en aplicador automático de Panasonic',
        severity: 8,
        potentialCause: 'Desgaste en rodillo de apoyo o presión excesiva',
        occurrence: 3,
        currentControls: 'Prueba de tinción con plumón de penetración cada rollo',
        detection: 2,
        rpn: 48,
        actionPriority: 'Baja',
        recommendedAction: 'Registro de galgas en hoja de setup',
        responsible: 'Alberto Cruz (Prensa)',
        status: 'Implementada',
        revisedRpn: 32
      }
    ],
    controlPlanItems: [
      { id: 'cp-1', stepNumber: 10, operation: 'Recepción MP', machine: 'Almacén', characteristic: 'Ancho y gramaje de bobina', classification: 'Mayor', specification: '76 mm ± 0.5 mm / 58 µm', measurementMethod: 'Micrómetro', sampleSize: '1 muestra / rollo', frequency: 'Por lote', instrument: 'Micrómetro Mitutoyo', responsible: 'Recepción / QA', reactionPlan: 'Poner en HOLD y notificar a compras' },
      { id: 'cp-2', stepNumber: 20, operation: 'Impresión Flexo', machine: 'Mark Andy P5', characteristic: 'Tono Azul Panasonic PMS 287C', classification: 'Crítica', specification: 'Delta E ≤ 1.50 vs Master', measurementMethod: 'Espectrofotometría', sampleSize: '3 lecturas', frequency: 'Arranque y cada 2,000 m', instrument: 'X-Rite eXact', responsible: 'Operador / Inspector QA', reactionPlan: 'Ajustar viscosidad o parar tiro' },
      { id: 'cp-3', stepNumber: 20, operation: 'Curado UV', machine: 'Mark Andy P5', characteristic: 'Curado de tinta UV', classification: 'Crítica', specification: 'Sin sangrado en 50 pasadas alcohol', measurementMethod: 'Prueba de frote químico', sampleSize: '2 etiquetas', frequency: 'Inicio de turno y cambio de rollo', instrument: 'Crockmeter / Alcohol 70%', responsible: 'Inspector QA', reactionPlan: 'Revisar intensidad UV y retener material' },
      { id: 'cp-4', stepNumber: 30, operation: 'Troquelado', machine: 'Cilindro Magnético', characteristic: 'Integridad del liner', classification: 'Crítica', specification: 'Cero marcas de corte en silicona', measurementMethod: 'Prueba de tinta penetrante', sampleSize: '5 etiquetas continuas', frequency: 'Cada cambio de bobina', instrument: 'Tinta detectora roja', responsible: 'Operador de Prensa', reactionPlan: 'Ajustar presión de troquel y segregar' },
    ],
    validationSample: {
      opFolio: 'OP-2026-95250',
      runDate: '06 Sep 2026',
      producedQuantity: 15000,
      sampleQuantity: 300,
      inspectedBy: 'Alicia Ramírez (Calidad)',
      releaseStatus: 'Liberada conforme',
      lotNumber: 'BCH-44951',
      coaFolio: 'COA-2026-0891',
      notes: '300 muestras físicas en bolsa sellada con etiqueta de identificación para envío a Panasonic (Hermosillo).'
    },
    approvals: [
      { id: 'app-1', role: 'Ingeniería de Proceso', humanTitle: 'Validación Técnica de Proceso y Setup', assignedTo: 'Roberto Morales (Ing. Planta)', status: 'Aprobado', date: '05 Sep 2026', comments: 'Ruta, herramentales y velocidades estandarizadas para tiraje industrial.' },
      { id: 'app-2', role: 'Aseguramiento de Calidad', humanTitle: 'Revisión y Aprobación de Documentación QA', assignedTo: 'Alicia Ramírez (Jefa Calidad)', status: 'Requiere cambios', date: '07 Sep 2026', comments: 'Plan de control y dimensionales ok. Bloqueado hasta actualizar AMEF Rev H.' },
      { id: 'app-3', role: 'Gerencia de Operaciones', humanTitle: 'Liberación Interna para Envío de Muestras', assignedTo: 'Iván Ortega (Director Op.)', status: 'Pendiente', comments: 'En espera de visto bueno de Calidad.' },
      { id: 'app-4', role: 'Calidad Cliente Panasonic', humanTitle: 'Dictamen de Aprobación PPAP (PSW)', assignedTo: 'Ing. Kenji Takahashi', status: 'Pendiente', comments: 'Esperando recepción del paquete digital y muestras físicas.' }
    ],
    history: [
      { id: 'h-1', date: '03 Sep · 09:30', user: 'Alicia Ramírez', action: 'Expediente Aperturado', details: 'Alta de expediente PPAP Nivel 3 por cambio de ingeniería de Rev G a Rev H.', badgeTone: 'primary' },
      { id: 'h-2', date: '04 Sep · 14:15', user: 'Kenji Takahashi (Panasonic)', action: 'Dibujo Cliente Recibido', details: 'Carga de plano DWG-526412-H y especificación técnica aprobada.', badgeTone: 'default' },
      { id: 'h-3', date: '05 Sep · 11:00', user: 'Roberto Morales', action: 'Plan de Control Generado', details: 'Actualización de parámetros de troquel e inspección en prensa P5.', badgeTone: 'default' },
      { id: 'h-4', date: '06 Sep · 16:40', user: 'Alicia Ramírez', action: 'Corrida Piloto y Medición', details: 'Inspección de 32 piezas de OP-2026-95250 (Lote BCH-44951). 100% dentro de límites.', badgeTone: 'success' },
      { id: 'h-5', date: '07 Sep · 10:15', user: 'Alicia Ramírez', action: 'Revisión de Gates', details: 'Detección de PFMEA desfasado. Se marca advertencia en expediente.', badgeTone: 'amber' }
    ]
  },

  // --------------------------------------------------
  // 2. TRICO · IS-2420 · Rev I-01
  // --------------------------------------------------
  {
    id: 'ppap-trico-is2420',
    folio: 'PPAP-2026-002',
    client: 'TRICO Components México',
    clientCode: 'CL-TRI-02',
    partNumber: 'IS-2420',
    partName: 'Inserto técnico instructivo plegado caple',
    revision: 'Rev I-01',
    previousRevision: 'Rev H',
    processArea: 'Offset',
    family: 'Instructivos Automotrices',
    submissionLevel: 3,
    submissionReason: 'Cambio de ingeniería / revisión',
    status: 'En revisión con Calidad',
    completionPercentage: 92,
    targetDate: '15 Sep 2026',
    lastUpdated: '07 Sep 2026 · 09:45',
    owner: 'Alicia Ramírez (Calidad)',
    demandingOp: 'OP-2026-95249',
    validationLot: 'BCH-44948',
    pswStatus: 'Pendiente de firma',
    clientContact: 'Ing. Carlos Villalobos (SQA · TRICO)',
    attentionNote: 'Falta registrar la evidencia dimensional de plegado de la corrida inicial.',
    attentionCtaText: 'Agregar resultados',
    checklist: [
      { id: 'ck-t1', elementNumber: 1, name: 'Design Records', humanLabel: 'Dibujo del cliente aprobado', status: 'Completo', documentRef: 'DIB-TRI-IS2420-I01.pdf', lastReviewDate: '01 Sep 2026' },
      { id: 'ck-t2', elementNumber: 5, name: 'Process Flow Diagrams', humanLabel: 'Diagrama de flujo de manufactura', status: 'Completo', documentRef: 'DF-OFS-022.pdf', lastReviewDate: '02 Sep 2026' },
      { id: 'ck-t3', elementNumber: 6, name: 'Process FMEA (PFMEA)', humanLabel: 'PFMEA · Riesgos de proceso', status: 'Completo', documentRef: 'PFMEA-OFS-14.pdf', lastReviewDate: '02 Sep 2026' },
      { id: 'ck-t4', elementNumber: 7, name: 'Control Plan', humanLabel: 'Plan de Control de proceso', status: 'Completo', documentRef: 'PCP-IS2420-I01.pdf', lastReviewDate: '03 Sep 2026' },
      { id: 'ck-t5', elementNumber: 9, name: 'Dimensional Results', humanLabel: 'Resultados dimensionales de corrida inicial', status: 'Requiere actualización', notes: 'Faltan 5 mediciones de espesor de doblez final plegado.' },
      { id: 'ck-t6', elementNumber: 10, name: 'Material / Performance Tests', humanLabel: 'Certificados de papel Bond 75g', status: 'Completo', documentRef: 'COA-PAPEL-BOND-75.pdf', lastReviewDate: '04 Sep 2026' },
      { id: 'ck-t7', elementNumber: 13, name: 'Appearance Approval Report', humanLabel: 'Aprobación visual y legibilidad', status: 'Completo', documentRef: 'AAR-TRI-IS2420.pdf', lastReviewDate: '04 Sep 2026' },
      { id: 'ck-t8', elementNumber: 18, name: 'Part Submission Warrant (PSW)', humanLabel: 'PSW Warrant', status: 'Pendiente', notes: 'Listo para emitir en cuanto se capturen las 5 medidas de doblez.' },
    ],
    documents: [
      { id: 'doct-1', name: 'Plano y Especificación de Plegado TRICO', code: 'DWG-IS-2420-I01', revision: 'I-01', category: 'Dibujo y Especificaciones', status: 'Aprobado', responsible: 'TRICO Engineering', date: '01 Sep 2026', fileSize: '3.1 MB' },
      { id: 'doct-2', name: 'Plan de Control Offset Prensa Heidelberg', code: 'PCP-OFS-2420', revision: '01', category: 'Proceso y Riesgos', status: 'Aprobado', responsible: 'Roberto Morales', date: '03 Sep 2026', fileSize: '1.4 MB' },
      { id: 'doct-3', name: 'PFMEA Proceso Impresión y Dobladora Stahl', code: 'PFMEA-TRICO-INS', revision: '02', category: 'Proceso y Riesgos', status: 'Aprobado', responsible: 'Alicia Ramírez', date: '02 Sep 2026', fileSize: '1.2 MB' },
    ],
    dimensionalResults: [
      { id: 'dimt-1', itemNumber: 1, characteristic: 'Pliego extendido Ancho', specification: '210.00 ± 1.00 mm', nominal: 210.00, tolerance: '±1.00', measured: 210.20, unit: 'mm', instrument: 'Regla metálica calibrada', sampleSize: 10, inSpec: true },
      { id: 'dimt-2', itemNumber: 2, characteristic: 'Pliego extendido Largo', specification: '297.00 ± 1.00 mm', nominal: 297.00, tolerance: '±1.00', measured: 296.80, unit: 'mm', instrument: 'Regla metálica calibrada', sampleSize: 10, inSpec: true },
      { id: 'dimt-3', itemNumber: 3, characteristic: 'Tamaño doblado final', specification: '70.00 ± 1.50 mm', nominal: 70.00, tolerance: '±1.50', measured: 70.40, unit: 'mm', instrument: 'Vernier digital', sampleSize: 10, inSpec: true },
    ],
    colorVisualResults: [
      { id: 'colt-1', parameter: 'Contraste de texto tipográfico 6 pts', specification: 'Legible al 100% sin empaste', measured: 'Conforme bajo microscopio', instrument: 'Lupa 10x', result: 'Conforme' },
      { id: 'colt-2', parameter: 'Densidad tinta negra Offset', specification: '1.40 ± 0.08', measured: '1.42', instrument: 'Densitómetro X-Rite', result: 'Conforme' },
    ],
    pfmeaRows: [
      { id: 'pft-1', stepNumber: 1, processStep: 'Impresión Offset', failureMode: 'Repinte de tinta en reverso', failureEffect: 'Texto borroso o manchado en instructivo', severity: 6, potentialCause: 'Exceso de carga en pila de salida', occurrence: 2, currentControls: 'Polvo antirrepinte automático', detection: 2, rpn: 24, actionPriority: 'Baja', recommendedAction: 'Calibración de spray de polvo', responsible: 'Operador Offset', status: 'Implementada' },
      { id: 'pft-2', stepNumber: 2, processStep: 'Plegado en máquina Stahl', failureMode: 'Doblado fuera de escuadra', failureEffect: 'Instructivo no entra en caja de producto TRICO', severity: 7, potentialCause: 'Guías de alimentación flojas', occurrence: 3, currentControls: 'Calibre plantilla de doblado cada paquete', detection: 3, rpn: 63, actionPriority: 'Media', recommendedAction: 'Checklist de apriete de guías en setup', responsible: 'Mantenimiento / Operador', status: 'Implementada' }
    ],
    controlPlanItems: [
      { id: 'cpt-1', stepNumber: 1, operation: 'Corte Inicial', machine: 'Guillotina Polar', characteristic: 'Escuadra de pliego', classification: 'Mayor', specification: '90° ± 0.1°', measurementMethod: 'Escuadra de precisión', sampleSize: '1 pliego / paquete', frequency: 'Por corte', instrument: 'Escuadra Mitutoyo', responsible: 'Operador Guillotina', reactionPlan: 'Reajustar tope y reciclar scrap' },
      { id: 'cpt-2', stepNumber: 2, operation: 'Plegado', machine: 'Dobladora Stahl', characteristic: 'Grosor paquete doblado', classification: 'Crítica', specification: 'Max 3.20 mm', measurementMethod: 'Micrómetro', sampleSize: '3 piezas', frequency: 'Cada 1,000 folletos', instrument: 'Micrómetro de caras planas', responsible: 'Operador Dobladora', reactionPlan: 'Ajustar rodillos de presión' }
    ],
    validationSample: {
      opFolio: 'OP-2026-95249',
      runDate: '05 Sep 2026',
      producedQuantity: 20000,
      sampleQuantity: 200,
      inspectedBy: 'Alicia Ramírez',
      releaseStatus: 'Liberada conforme',
      lotNumber: 'BCH-44948',
      coaFolio: 'COA-2026-0887',
      notes: 'Lote piloto inspeccionado en piso Offset. Pendiente cerrar reporte de dimensionales finales.'
    },
    approvals: [
      { id: 'appt-1', role: 'Ingeniería de Proceso', humanTitle: 'Validación Técnica', assignedTo: 'Roberto Morales', status: 'Aprobado', date: '04 Sep 2026' },
      { id: 'appt-2', role: 'Aseguramiento de Calidad', humanTitle: 'Revisión Documental', assignedTo: 'Alicia Ramírez', status: 'Revisado', date: '06 Sep 2026' },
      { id: 'appt-3', role: 'Calidad Cliente TRICO', humanTitle: 'Dictamen Final SQA', assignedTo: 'Carlos Villalobos', status: 'Pendiente' }
    ],
    history: [
      { id: 'ht-1', date: '01 Sep · 10:00', user: 'Alicia Ramírez', action: 'Expediente Aperturado', details: 'Apertura de PPAP Nivel 3 por cambio de arte.', badgeTone: 'primary' },
      { id: 'ht-2', date: '05 Sep · 17:00', user: 'Alicia Ramírez', action: 'Muestras de OP Registradas', details: 'Muestras de OP-2026-95249 recibidas para inspección.', badgeTone: 'success' }
    ]
  },

  // --------------------------------------------------
  // 3. BLACK & DECKER · NA472050 · Rev 08/23
  // --------------------------------------------------
  {
    id: 'ppap-blackdecker-na472050',
    folio: 'PPAP-2026-003',
    client: 'Stanley Black & Decker',
    clientCode: 'CL-SBD-03',
    partNumber: 'NA472050',
    partName: 'Etiqueta de seguridad advertencia alta temperatura',
    revision: 'Rev 08/23',
    processArea: 'Flexografía',
    family: 'Etiquetas de Advertencia y Seguridad',
    submissionLevel: 3,
    submissionReason: 'Revalidación anual',
    status: 'Pendiente del cliente',
    completionPercentage: 100,
    targetDate: '12 Sep 2026',
    lastUpdated: '06 Sep 2026 · 16:30',
    owner: 'Roberto Morales (Ingeniería de Planta)',
    demandingOp: 'OP-2026-95256',
    validationLot: 'BCH-44955',
    pswStatus: 'Firmado internamente',
    pswApprovalDate: '06 Sep 2026',
    clientContact: 'Ing. Martha Sotomayor (SQA · Stanley Black & Decker)',
    attentionNote: 'Expediente completo y firmado internamente. Esperando acuse de recibo y firma del cliente.',
    attentionCtaText: 'Revisar para envío',
    checklist: [
      { id: 'ck-b1', elementNumber: 1, name: 'Design Records', humanLabel: 'Dibujo aprobado', status: 'Completo', documentRef: 'DWG-SBD-NA472050.pdf' },
      { id: 'ck-b2', elementNumber: 5, name: 'Process Flow Diagrams', humanLabel: 'Diagrama de flujo', status: 'Completo', documentRef: 'DF-SBD-01.pdf' },
      { id: 'ck-b3', elementNumber: 6, name: 'Process FMEA', humanLabel: 'PFMEA riesgos de proceso', status: 'Completo', documentRef: 'PFMEA-SBD-NA472.pdf' },
      { id: 'ck-b4', elementNumber: 7, name: 'Control Plan', humanLabel: 'Plan de Control', status: 'Completo', documentRef: 'PCP-SBD-NA472.pdf' },
      { id: 'ck-b5', elementNumber: 8, name: 'MSA', humanLabel: 'Estudio Gage R&R', status: 'Completo', documentRef: 'MSA-SBD-2026.pdf' },
      { id: 'ck-b6', elementNumber: 9, name: 'Dimensional Results', humanLabel: 'Dimensionales conformes', status: 'Completo', documentRef: 'DIM-SBD-100PCT.pdf' },
      { id: 'ck-b7', elementNumber: 10, name: 'Material / Tests', humanLabel: 'Certificados y UL 969', status: 'Completo', documentRef: 'UL969-CERT-2026.pdf' },
      { id: 'ck-b8', elementNumber: 18, name: 'PSW Warrant', humanLabel: 'PSW firmado por Calidad y Planta', status: 'Completo', documentRef: 'PSW-SBD-SIGNED.pdf' },
    ],
    documents: [
      { id: 'docb-1', name: 'Especificación B&D UL 969 Térmica', code: 'SPE-SBD-0823', revision: '08/23', category: 'Dibujo y Especificaciones', status: 'Aprobado', responsible: 'Martha Sotomayor', date: '15 Ago 2026', fileSize: '1.8 MB' },
      { id: 'docb-2', name: 'Plan de Control Aprobado', code: 'PCP-NA472050', revision: '03', category: 'Proceso y Riesgos', status: 'Aprobado', responsible: 'Alicia Ramírez', date: '04 Sep 2026', fileSize: '1.5 MB' },
      { id: 'docb-3', name: 'PSW Certificado de Sumisión Firmado', code: 'PSW-NA472050-SIGNED', revision: '08/23', category: 'Aprobaciones y PSW', status: 'Aprobado', responsible: 'Alicia Ramírez / Roberto Morales', date: '06 Sep 2026', fileSize: '620 KB' },
    ],
    dimensionalResults: [
      { id: 'dimb-1', itemNumber: 1, characteristic: 'Ancho etiqueta seguridad', specification: '45.00 ± 0.25 mm', nominal: 45.00, tolerance: '±0.25', measured: 45.04, unit: 'mm', instrument: 'Vernier digital Mitutoyo', sampleSize: 30, inSpec: true },
      { id: 'dimb-2', itemNumber: 2, characteristic: 'Largo etiqueta seguridad', specification: '25.00 ± 0.25 mm', nominal: 25.00, tolerance: '±0.25', measured: 25.02, unit: 'mm', instrument: 'Vernier digital Mitutoyo', sampleSize: 30, inSpec: true },
    ],
    colorVisualResults: [
      { id: 'colb-1', parameter: 'Color Amarillo Advertencia (Safety Yellow)', specification: 'Delta E ≤ 1.20 vs Pantone 012C', measured: 'Delta E: 0.65', deltaE: 0.65, instrument: 'X-Rite eXact', result: 'Conforme' },
      { id: 'colb-2', parameter: 'Resistencia térmica 150°C x 24h', specification: 'Sin desprendimiento ni deformación', measured: 'Conforme UL 969', instrument: 'Horno de envejecimiento acelerado', result: 'Conforme' },
    ],
    pfmeaRows: [
      { id: 'pfb-1', stepNumber: 1, processStep: 'Laminado Poliéster Mate', failureMode: 'Burbujas microscópicas de aire', failureEffect: 'Pérdida de adherencia a alta temperatura', severity: 7, potentialCause: 'Tensión baja en calandra de laminación', occurrence: 2, currentControls: 'Presión neumática con manómetro calibrado', detection: 2, rpn: 28, actionPriority: 'Baja', recommendedAction: 'Mantenimiento preventivo quincenal', responsible: 'Operador', status: 'Implementada' }
    ],
    controlPlanItems: [
      { id: 'cpb-1', stepNumber: 1, operation: 'Impresión y Barniz', machine: 'Prensa Flexo Mark Andy', characteristic: 'Adherencia de tinta en Poliéster', classification: 'Crítica', specification: 'Cinta 3M 610 desprendimiento 0%', measurementMethod: 'Prueba Cross-Hatch ASTM D3359', sampleSize: '1 por bobina', frequency: 'Por rollo terminado', instrument: 'Cortador de enrejado y cinta 3M', responsible: 'Inspector Calidad', reactionPlan: 'Cuarentena inmediata del lote' }
    ],
    validationSample: {
      opFolio: 'OP-2026-95256',
      runDate: '04 Sep 2026',
      producedQuantity: 50000,
      sampleQuantity: 500,
      inspectedBy: 'Alicia Ramírez',
      releaseStatus: 'Liberada conforme',
      lotNumber: 'BCH-44955',
      coaFolio: 'COA-2026-0870',
      notes: 'Expediente digital completo enviado por correo a portal SQA de Black & Decker.'
    },
    approvals: [
      { id: 'appb-1', role: 'Ingeniería de Proceso', humanTitle: 'Validación Técnica', assignedTo: 'Roberto Morales', status: 'Aprobado', date: '05 Sep 2026', comments: '100% verificado.' },
      { id: 'appb-2', role: 'Aseguramiento de Calidad', humanTitle: 'Aprobación Interna PSW', assignedTo: 'Alicia Ramírez', status: 'Aprobado', date: '06 Sep 2026', comments: 'PSW firmado y sellado.' },
      { id: 'appb-3', role: 'Calidad Cliente B&D', humanTitle: 'Aprobación Cliente (PSW)', assignedTo: 'Martha Sotomayor', status: 'Pendiente', comments: 'En proceso de dictamen en portal de proveedor.' }
    ],
    history: [
      { id: 'hb-1', date: '28 Ago · 11:00', user: 'Roberto Morales', action: 'Apertura de Revalidación', details: 'Revalidación anual de parte automotriz/seguridad.', badgeTone: 'primary' },
      { id: 'hb-2', date: '06 Sep · 16:30', user: 'Alicia Ramírez', action: 'PSW Firmado y Enviado', details: 'Expediente al 100%. Enviado a cliente.', badgeTone: 'success' }
    ]
  },

  // --------------------------------------------------
  // 4. PENTAIR · A163833BHA · Rev A
  // --------------------------------------------------
  {
    id: 'ppap-pentair-a163833',
    folio: 'PPAP-2026-004',
    client: 'Pentair Water México',
    clientCode: 'CL-PEN-04',
    partNumber: 'A163833BHA',
    partName: 'Caja plegadiza caple 24 pts para filtro de agua',
    revision: 'Rev A',
    processArea: 'Offset',
    family: 'Empaque Plegadizo Grado Industrial',
    submissionLevel: 2,
    submissionReason: 'Nueva parte',
    status: 'Pendiente de información',
    completionPercentage: 65,
    targetDate: '25 Sep 2026',
    lastUpdated: '04 Sep 2026 · 12:00',
    owner: 'Fernando Castro (Calidad Proveedores)',
    pswStatus: 'Pendiente de firma',
    clientContact: 'Ing. Daniel Morales (Pentair Procurement & QA)',
    attentionNote: 'Faltan certificados de materia prima de cartoncillo grado alimenticio del proveedor.',
    attentionCtaText: 'Revisar expediente',
    checklist: [
      { id: 'ck-p1', elementNumber: 1, name: 'Design Records', humanLabel: 'Dibujo y plano mecánico de empaque', status: 'Completo', documentRef: 'PLANO-PENTAIR-A163.pdf' },
      { id: 'ck-p2', elementNumber: 5, name: 'Process Flow Diagrams', humanLabel: 'Flujo de proceso impresión y suajado', status: 'Completo', documentRef: 'DF-CAPLE-09.pdf' },
      { id: 'ck-p3', elementNumber: 6, name: 'Process FMEA', humanLabel: 'PFMEA de plegado y pegado', status: 'Completo', documentRef: 'PFMEA-CAP-02.pdf' },
      { id: 'ck-p4', elementNumber: 7, name: 'Control Plan', humanLabel: 'Plan de Control de pegado lineal', status: 'Completo', documentRef: 'PCP-CAPLE-A163.pdf' },
      { id: 'ck-p5', elementNumber: 10, name: 'Material / Tests', humanLabel: 'Certificados de cartoncillo grado filtro', status: 'Requiere actualización', notes: 'Pendiente recibir CoA de Smurfit Kappa con pureza de pulpa.' },
      { id: 'ck-p6', elementNumber: 18, name: 'PSW Warrant', humanLabel: 'PSW Warrant', status: 'Pendiente' },
    ],
    documents: [
      { id: 'docp-1', name: 'Plano Estructural de Caja Plegadiza Pentair', code: 'CAD-A163833BHA', revision: 'A', category: 'Dibujo y Especificaciones', status: 'Aprobado', responsible: 'Daniel Morales', date: '20 Ago 2026', fileSize: '4.2 MB' },
      { id: 'docp-2', name: 'Plan de Control Guillotina, Impresión y Pegado', code: 'PCP-PENTAIR-A', revision: '01', category: 'Proceso y Riesgos', status: 'Aprobado', responsible: 'Alicia Ramírez', date: '01 Sep 2026', fileSize: '1.7 MB' },
    ],
    dimensionalResults: [
      { id: 'dimp-1', itemNumber: 1, characteristic: 'Frente caja armada', specification: '120.00 ± 1.50 mm', nominal: 120.00, tolerance: '±1.50', measured: 120.35, unit: 'mm', instrument: 'Pie de rey digital', sampleSize: 15, inSpec: true },
      { id: 'dimp-2', itemNumber: 2, characteristic: 'Fondo caja armada', specification: '80.00 ± 1.50 mm', nominal: 80.00, tolerance: '±1.50', measured: 79.80, unit: 'mm', instrument: 'Pie de rey digital', sampleSize: 15, inSpec: true },
      { id: 'dimp-3', itemNumber: 3, characteristic: 'Altura caja armada', specification: '240.00 ± 2.00 mm', nominal: 240.00, tolerance: '±2.00', measured: 240.80, unit: 'mm', instrument: 'Regla graduada', sampleSize: 15, inSpec: true },
    ],
    colorVisualResults: [
      { id: 'colp-1', parameter: 'Azul Cyan Proceso Pentair', specification: 'Densidad 1.45 ± 0.08', measured: '1.46', instrument: 'Densitómetro', result: 'Conforme' },
      { id: 'colp-2', parameter: 'Resistencia adhesivo hot melt de pestaña', specification: 'Desgarre de fibra al 100%', measured: 'Desgarre 100% comprobado', instrument: 'Prueba manual destructiva de desgarre', result: 'Conforme' },
    ],
    pfmeaRows: [
      { id: 'pfp-1', stepNumber: 1, processStep: 'Pegadora Lineal Bobst', failureMode: 'Falta de goma en solapa', failureEffect: 'Caja se abre en línea de empaque del cliente', severity: 8, potentialCause: 'Inyector de goma obstruido', occurrence: 3, currentControls: 'Detector fotoeléctrico de cola en máquina', detection: 2, rpn: 48, actionPriority: 'Baja', recommendedAction: 'Limpieza de inyectores cada 4 horas', responsible: 'Operador Pegadora', status: 'Implementada' }
    ],
    controlPlanItems: [
      { id: 'cpp-1', stepNumber: 1, operation: 'Pegado Automático', machine: 'Pegadora Lineal', characteristic: 'Fuerza de adhesión', classification: 'Crítica', specification: 'Falla por rasgado de fibra', measurementMethod: 'Prueba destructiva', sampleSize: '2 cajas', frequency: 'Cada 500 cajas', instrument: 'Inspección manual', responsible: 'Operador Pegadora', reactionPlan: 'Paro de máquina y segregación' }
    ],
    validationSample: {
      opFolio: 'OP-2026-95240',
      runDate: '02 Sep 2026',
      producedQuantity: 10000,
      sampleQuantity: 100,
      inspectedBy: 'Fernando Castro',
      releaseStatus: 'Liberada conforme',
      lotNumber: 'BCH-44930',
      coaFolio: 'COA-2026-0865',
      notes: 'Lote piloto armado en banco de pruebas. Pendiente recibir CoA de cartoncillo de proveedor.'
    },
    approvals: [
      { id: 'appp-1', role: 'Ingeniería de Proceso', humanTitle: 'Validación de Suaje y Armado', assignedTo: 'Roberto Morales', status: 'Aprobado', date: '02 Sep 2026' },
      { id: 'appp-2', role: 'Aseguramiento de Calidad', humanTitle: 'Revisión Documental', assignedTo: 'Alicia Ramírez', status: 'Pendiente', comments: 'Esperando CoA de materia prima.' }
    ],
    history: [
      { id: 'hp-1', date: '20 Ago · 15:00', user: 'Fernando Castro', action: 'Expediente Creado', details: 'Alta de PPAP Nivel 2 para nueva caja plegadiza.', badgeTone: 'primary' },
      { id: 'hp-2', date: '02 Sep · 11:30', user: 'Roberto Morales', action: 'Prueba de Suajado Aprobada', details: 'Corrida piloto en cilindro plano exitosa.', badgeTone: 'success' }
    ]
  }
];

// ====================================================
// SUGERENCIAS MORADAS DEL SISTEMA (`✦ Sugerencia del sistema`)
// ====================================================

export const INITIAL_PPAP_SUGGESTIONS: PpapSystemSuggestion[] = [
  {
    id: 'sug-ppap-01',
    caseId: 'ppap-panasonic-526412',
    title: 'Desalineación entre Dibujo Rev H y PFMEA Rev G detectada',
    description:
      'La revisión H de 526412 de Panasonic ya cuenta con dibujo, Plan de Control y mediciones dimensionales actualizadas, pero el documento PFMEA sigue referenciando la revisión anterior G.',
    recommendation:
      'Recomendación: abrir la pestaña de Riesgos / PFMEA y actualizar el modo de falla de lámparas UV antes de solicitar la firma final del PSW.',
    actionLabel: 'Revisar PFMEA y Riesgos',
    actionTabTarget: 'Riesgos',
    tone: 'purple'
  },
  {
    id: 'sug-ppap-02',
    caseId: 'ppap-trico-is2420',
    title: 'Evidencia dimensional lista para registrar en TRICO IS-2420',
    description:
      'La corrida piloto OP-2026-95249 concluyó en piso con 200 muestras liberadas, pero faltan por capturar 5 valores de espesor de doblado en el expediente.',
    recommendation:
      'Recomendación: registrar las 5 lecturas de doblado para elevar el expediente del 92% al 100% y habilitar el dictamen del cliente.',
    actionLabel: 'Completar Resultados',
    actionTabTarget: 'Resultados',
    tone: 'purple'
  },
  {
    id: 'sug-ppap-03',
    caseId: 'ppap-blackdecker-na472050',
    title: 'Expediente 100% listo para acuse formal del cliente',
    description:
      'El paquete PPAP Nivel 3 de Stanley Black & Decker cuenta con todos sus documentos aprobados y el PSW firmado internamente por Alicia Ramírez y Roberto Morales.',
    recommendation:
      'Recomendación: descargar el paquete digital oficial y registrar la fecha de recepción confirmada por la Ing. Martha Sotomayor.',
    actionLabel: 'Ver Aprobaciones y PSW',
    actionTabTarget: 'Aprobaciones',
    tone: 'purple'
  }
];

// Helper para filtrar expedientes
export function filterPpapCases(
  cases: PpapCase[],
  clientFilter: string,
  statusFilter: string,
  areaFilter: string,
  searchQuery: string
): PpapCase[] {
  return cases.filter((item) => {
    if (clientFilter !== 'Todos' && item.client !== clientFilter) return false;
    if (statusFilter !== 'Todos' && item.status !== statusFilter) return false;
    if (areaFilter !== 'Todas' && item.processArea !== areaFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.folio.toLowerCase().includes(q) ||
        item.partNumber.toLowerCase().includes(q) ||
        item.partName.toLowerCase().includes(q) ||
        item.client.toLowerCase().includes(q) ||
        item.revision.toLowerCase().includes(q) ||
        item.owner.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}
