// =====================================================================
// Impresos RTM - Mock Data Canónico de Competencias & Capacitación de Planta
// =====================================================================
// Relaciona los empleados existentes de Nómina con las máquinas y procesos
// de Producción sin duplicar catálogos.
// =====================================================================

export type CompetencyLevel =
  | 'Sin entrenamiento registrado'
  | 'En entrenamiento'
  | 'Competente'
  | 'Autorizado'
  | 'Instructor';

export type PlantArea = 'Flexografía' | 'Offset' | 'Acabados' | 'Calidad' | 'Almacén';

export type SkillCategory =
  | 'Máquina de Impresión'
  | 'Ajuste / Setup'
  | 'Inspección de Calidad'
  | 'Acabados y Conversión'
  | 'Almacén y Logística';

export interface PlantSkill {
  id: string;
  name: string;
  code: string;
  area: PlantArea;
  category: SkillCategory;
  description: string;
  criticality: 'Alta' | 'Media' | 'Básica';
}

export interface EmployeeSkillRecord {
  employeeId: string;
  skillId: string;
  level: CompetencyLevel;
  lastEvaluationDate?: string;
  evaluatorName?: string;
  internalExperienceMonths?: number;
  authorizedActivitiesCount?: number;
  totalActivitiesCount?: number;
  instructorId?: string;
  instructorName?: string;
  notes?: string;
}

export interface PlantTrainingActivity {
  id: string;
  name: string;
  completed: boolean;
  completedDate?: string;
}

export interface PlantTraining {
  id: string;
  code: string;
  title: string;
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  employeeShift: string;
  skillId: string;
  skillName: string;
  machineOrProcess: string;
  instructorId: string;
  instructorName: string;
  targetObjective: 'Operación autónoma' | 'Ajuste y preparación' | 'Inspección de calidad' | 'Respaldo operativo';
  estimatedCompletionDate: string;
  status: 'En curso' | 'Programada' | 'Completada' | 'Requiere revisión';
  activities: PlantTrainingActivity[];
  notes?: string;
  evaluationResult?: 'Competente' | 'Autorizado';
  evaluatedBy?: string;
  evaluationDate?: string;
  evaluationNotes?: string;
}

export type ShiftCoverageStatus = 'Cobertura suficiente' | 'Cobertura limitada' | 'Crítica sin respaldo';

export interface ShiftCoverageDetail {
  shift: 'Turno 1' | 'Turno 2' | 'Mixto';
  authorizedCount: number;
  competentCount: number;
  inTrainingCount: number;
  instructorCount: number;
  status: ShiftCoverageStatus;
  authorizedEmployeeIds: string[];
  competentEmployeeIds: string[];
  inTrainingEmployeeIds: string[];
  notes?: string;
}

export interface MachineShiftCoverage {
  machineId: string;
  machineName: string;
  area: PlantArea;
  turnos: ShiftCoverageDetail[];
  overallStatus: ShiftCoverageStatus;
  criticalAlert?: string;
}

export interface CompetencySystemSuggestion {
  id: string;
  type: 'capacitacion_cruzada' | 'respaldo_proceso' | 'renovacion_proxima' | 'balance_turnos';
  title: string;
  badge: string;
  description: string;
  actionLabel: string;
  secondaryActionLabel?: string;
  targetEmployeeId?: string;
  targetEmployeeName?: string;
  targetMachineId?: string;
  targetMachineName?: string;
  suggestedSkillId?: string;
  suggestedInstructorId?: string;
  suggestedInstructorName?: string;
}

// =====================================================================
// CATÁLOGO DE HABILIDADES Y PROCESOS DE PLANTA
// =====================================================================
export const PLANT_SKILLS: PlantSkill[] = [
  // Flexografía
  {
    id: 'SKILL-MA-830-7',
    name: 'Mark Andy 830 7”',
    code: 'FLEX-MA830-7',
    area: 'Flexografía',
    category: 'Máquina de Impresión',
    description: 'Operación de prensa flexográfica de banda angosta 7 pulgadas, tirajes pequeños y etiquetas técnicas.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-MA-830-10',
    name: 'Mark Andy 830 10”',
    code: 'FLEX-MA830-10',
    area: 'Flexografía',
    category: 'Máquina de Impresión',
    description: 'Prensa flexo de 10 pulgadas para etiquetas primarias de media velocidad con barniz UV.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-MA-SCOUT-10',
    name: 'Mark Andy Scout 10”',
    code: 'FLEX-MASCOUT-10',
    area: 'Flexografía',
    category: 'Máquina de Impresión',
    description: 'Prensa de alta precisión servo-asistida para etiquetas automotrices y farmacéuticas multicapa.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-MA-4120-17',
    name: 'Mark Andy 4120 17”',
    code: 'FLEX-MA4120-17',
    area: 'Flexografía',
    category: 'Máquina de Impresión',
    description: 'Prensa flexo de banda ancha 17 pulgadas para películas retráctiles y empaque flexible.',
    criticality: 'Media',
  },
  {
    id: 'SKILL-ROTOFLEX-1',
    name: 'Rotoflex I / Inspección',
    code: 'FLEX-ROTO-1',
    area: 'Flexografía',
    category: 'Acabados y Conversión',
    description: 'Rebobinadora e inspeccionadora bidireccional con sensor estroboscópico y corte longitudinal.',
    criticality: 'Media',
  },
  {
    id: 'SKILL-SETUP-FLEXO',
    name: 'Setup y Montaje de Cyrels',
    code: 'FLEX-SETUP',
    area: 'Flexografía',
    category: 'Ajuste / Setup',
    description: 'Montaje microscópico de placas fotopolímeras, ajuste de rasquetas doctor blade y entintado.',
    criticality: 'Alta',
  },

  // Offset
  {
    id: 'SKILL-HEIDELBERG-SM',
    name: 'Heidelberg Speedmaster',
    code: 'OFF-HEID-SM',
    area: 'Offset',
    category: 'Máquina de Impresión',
    description: 'Prensa de pliego 4 colores para empaque plegadizo, microcorrugado y catálogos de alta gama.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-OFFSET-SETUP',
    name: 'Ajustes de Arranque Offset',
    code: 'OFF-SETUP',
    area: 'Offset',
    category: 'Ajuste / Setup',
    description: 'Paginación, balance agua-tinta, registro micrométrico y calibración de tinteros CIP3.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-CONSERVER',
    name: 'Conserver / Prensa 2 Tintas',
    code: 'OFF-CONS',
    area: 'Offset',
    category: 'Máquina de Impresión',
    description: 'Prensa rápida de 2 colores para manuales instructivos y papelería corporativa.',
    criticality: 'Básica',
  },

  // Acabados
  {
    id: 'SKILL-GUILLOTINA-POLAR',
    name: 'Guillotina Polar',
    code: 'ACAB-GUIL-POL',
    area: 'Acabados',
    category: 'Acabados y Conversión',
    description: 'Corte programado computarizado de pliegos con tolerancias menores a 0.3 mm.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-STAHL-DOBLADO',
    name: 'Doblado en Stahl',
    code: 'ACAB-STAHL',
    area: 'Acabados',
    category: 'Acabados y Conversión',
    description: 'Doblado farmacéutico tipo acordeón y cruces en plegadora Stahl de alta velocidad.',
    criticality: 'Media',
  },
  {
    id: 'SKILL-MULLER-MARTINI',
    name: 'Encuadernación Muller Martini',
    code: 'ACAB-MULLER',
    area: 'Acabados',
    category: 'Acabados y Conversión',
    description: 'Alzado, grapado en caballete y refile trilateral para manuales y folletos.',
    criticality: 'Media',
  },

  // Calidad
  {
    id: 'SKILL-QA-FIRST-PIECE-FLEXO',
    name: 'Primera Pieza Flexo (QA Gate)',
    code: 'QA-1ST-FLEX',
    area: 'Calidad',
    category: 'Inspección de Calidad',
    description: 'Aprobación de tiro inicial: colorimetría SpectroEye, código de barras ISO/ANSI y desprendimiento.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-QA-FIRST-PIECE-OFFSET',
    name: 'Primera Pieza Offset (QA Gate)',
    code: 'QA-1ST-OFF',
    area: 'Calidad',
    category: 'Inspección de Calidad',
    description: 'Validación de registro CTP, densidad óptica de tinta CMYK y troquelado perimetral.',
    criticality: 'Alta',
  },
  {
    id: 'SKILL-QA-FINAL-AUDIT',
    name: 'Auditoría Final de Embarque',
    code: 'QA-FINAL-AUDIT',
    area: 'Calidad',
    category: 'Inspección de Calidad',
    description: 'Muestreo MIL-STD-105E / AQL 0.65, verificación de empaque, etiquetas Zebra y CoAs.',
    criticality: 'Alta',
  },

  // Almacén
  {
    id: 'SKILL-ALM-SURTIDO-PROD',
    name: 'Surtido de Sustrato a Producción',
    code: 'ALM-SURT-PROD',
    area: 'Almacén',
    category: 'Almacén y Logística',
    description: 'Despacho de bobinas y pliegos según OP, validación de lote útil y registro FIFO.',
    criticality: 'Media',
  },
];

// =====================================================================
// REGISTROS DE HABILIDADES POR EMPLEADO (Mapeados a INITIAL_MOCK_EMPLOYEES)
// =====================================================================
export const EMPLOYEE_SKILL_RECORDS: EmployeeSkillRecord[] = [
  // RTM-001: Carlos Mendoza Ruiz (Operador Mark Andy 830 7”, Flexo, Turno 1)
  {
    employeeId: 'RTM-001',
    skillId: 'SKILL-MA-830-7',
    level: 'Autorizado',
    lastEvaluationDate: '12 Ago 2026',
    evaluatorName: 'Daniel Torres (Ing. Procesos)',
    internalExperienceMonths: 18,
    authorizedActivitiesCount: 5,
    totalActivitiesCount: 5,
    notes: 'Operador autónomo con excelente control de registro y desperdicio.',
  },
  {
    employeeId: 'RTM-001',
    skillId: 'SKILL-SETUP-FLEXO',
    level: 'Autorizado',
    lastEvaluationDate: '10 Jun 2026',
    evaluatorName: 'María Ríos (Instructora)',
    internalExperienceMonths: 24,
    authorizedActivitiesCount: 4,
    totalActivitiesCount: 4,
  },
  {
    employeeId: 'RTM-001',
    skillId: 'SKILL-MA-SCOUT-10',
    level: 'En entrenamiento',
    lastEvaluationDate: '28 Ago 2026',
    evaluatorName: 'María Ríos (Instructora)',
    internalExperienceMonths: 2,
    authorizedActivitiesCount: 2,
    totalActivitiesCount: 4,
    instructorId: 'RTM-003',
    instructorName: 'María Ríos Garza',
    notes: 'Capacitación cruzada en curso (CAP-2026-018). Práctica supervisada en marcha.',
  },
  {
    employeeId: 'RTM-001',
    skillId: 'SKILL-MA-830-10',
    level: 'Competente',
    lastEvaluationDate: '15 May 2026',
    evaluatorName: 'Daniel Torres',
    internalExperienceMonths: 12,
  },

  // RTM-002: Jorge Pérez Gómez (Ayudante Flexo, Flexo, Turno 1)
  {
    employeeId: 'RTM-002',
    skillId: 'SKILL-SETUP-FLEXO',
    level: 'En entrenamiento',
    lastEvaluationDate: '20 Ago 2026',
    evaluatorName: 'Carlos Mendoza Ruiz',
    internalExperienceMonths: 4,
    authorizedActivitiesCount: 2,
    totalActivitiesCount: 4,
    instructorId: 'RTM-001',
    instructorName: 'Carlos Mendoza Ruiz',
  },
  {
    employeeId: 'RTM-002',
    skillId: 'SKILL-ROTOFLEX-1',
    level: 'Competente',
    lastEvaluationDate: '05 Jul 2026',
    evaluatorName: 'María Ríos',
    internalExperienceMonths: 8,
  },

  // RTM-003: María Ríos Garza (Operadora Flexo Senior / Instructora, Flexo, Turno 1)
  {
    employeeId: 'RTM-003',
    skillId: 'SKILL-MA-SCOUT-10',
    level: 'Instructor',
    lastEvaluationDate: '15 Jul 2026',
    evaluatorName: 'Comité Técnico RTM',
    internalExperienceMonths: 48,
    notes: 'Instructora certificada de planta para prensas servo-asistidas.',
  },
  {
    employeeId: 'RTM-003',
    skillId: 'SKILL-MA-830-10',
    level: 'Instructor',
    lastEvaluationDate: '15 Jul 2026',
    evaluatorName: 'Comité Técnico RTM',
    internalExperienceMonths: 48,
  },
  {
    employeeId: 'RTM-003',
    skillId: 'SKILL-MA-830-7',
    level: 'Autorizado',
    lastEvaluationDate: '10 Jun 2026',
    internalExperienceMonths: 36,
  },
  {
    employeeId: 'RTM-003',
    skillId: 'SKILL-MA-4120-17',
    level: 'Autorizado',
    lastEvaluationDate: '18 Abr 2026',
    internalExperienceMonths: 24,
  },
  {
    employeeId: 'RTM-003',
    skillId: 'SKILL-SETUP-FLEXO',
    level: 'Instructor',
    lastEvaluationDate: '15 Jul 2026',
    internalExperienceMonths: 52,
  },

  // RTM-004: Roberto Garza Treviño (Operador Mark Andy Scout, Flexo, Turno 2)
  {
    employeeId: 'RTM-004',
    skillId: 'SKILL-MA-SCOUT-10',
    level: 'Autorizado',
    lastEvaluationDate: '18 Jul 2026',
    evaluatorName: 'Supervisor Flexografía',
    internalExperienceMonths: 22,
    authorizedActivitiesCount: 5,
    totalActivitiesCount: 5,
    notes: 'Único operador autorizado en Turno 2 para Mark Andy Scout 10”.',
  },
  {
    employeeId: 'RTM-004',
    skillId: 'SKILL-SETUP-FLEXO',
    level: 'Autorizado',
    lastEvaluationDate: '02 Feb 2026',
    internalExperienceMonths: 20,
  },
  {
    employeeId: 'RTM-004',
    skillId: 'SKILL-MA-830-10',
    level: 'Competente',
    lastEvaluationDate: '14 Nov 2025',
    internalExperienceMonths: 14,
  },

  // RTM-005: Brenda Luna Castillo (Inspección / Acabados, Flexo, Turno 2)
  {
    employeeId: 'RTM-005',
    skillId: 'SKILL-ROTOFLEX-1',
    level: 'Autorizado',
    lastEvaluationDate: '11 Ago 2026',
    evaluatorName: 'Fernando Soto Morales',
    internalExperienceMonths: 16,
  },
  {
    employeeId: 'RTM-005',
    skillId: 'SKILL-MA-SCOUT-10',
    level: 'Sin entrenamiento registrado',
  },

  // RTM-006: Fernando Soto Morales (Operador Rotoflex, Flexo, Mixto)
  {
    employeeId: 'RTM-006',
    skillId: 'SKILL-ROTOFLEX-1',
    level: 'Instructor',
    lastEvaluationDate: '05 May 2026',
    internalExperienceMonths: 32,
  },
  {
    employeeId: 'RTM-006',
    skillId: 'SKILL-MA-830-7',
    level: 'Competente',
    lastEvaluationDate: '19 Ene 2026',
    internalExperienceMonths: 10,
  },

  // RTM-007: Miguel Ángel Torres (Prensista Heidelberg Speedmaster, Offset, Turno 1)
  {
    employeeId: 'RTM-007',
    skillId: 'SKILL-HEIDELBERG-SM',
    level: 'Instructor',
    lastEvaluationDate: '22 Jul 2026',
    evaluatorName: 'Ing. Daniel Torres',
    internalExperienceMonths: 60,
    notes: 'Maestro prensista Offset. Autorizado formal para ajustes de arranque finos y curvas CIP3.',
  },
  {
    employeeId: 'RTM-007',
    skillId: 'SKILL-OFFSET-SETUP',
    level: 'Instructor',
    lastEvaluationDate: '22 Jul 2026',
    internalExperienceMonths: 60,
  },

  // RTM-008: Laura Coronado Silva (Segunda Prensa Offset, Offset, Turno 1)
  {
    employeeId: 'RTM-008',
    skillId: 'SKILL-HEIDELBERG-SM',
    level: 'Autorizado',
    lastEvaluationDate: '14 Jun 2026',
    evaluatorName: 'Miguel Ángel Torres',
    internalExperienceMonths: 19,
  },
  {
    employeeId: 'RTM-008',
    skillId: 'SKILL-OFFSET-SETUP',
    level: 'En entrenamiento',
    lastEvaluationDate: '12 Ago 2026',
    evaluatorName: 'Miguel Ángel Torres',
    internalExperienceMonths: 3,
    authorizedActivitiesCount: 2,
    totalActivitiesCount: 4,
    instructorId: 'RTM-007',
    instructorName: 'Miguel Ángel Torres',
  },
  {
    employeeId: 'RTM-008',
    skillId: 'SKILL-CONSERVER',
    level: 'Autorizado',
    lastEvaluationDate: '10 Feb 2026',
    internalExperienceMonths: 24,
  },

  // RTM-009: Andrés Benítez Lara (Prensista Offset, Offset, Turno 2)
  {
    employeeId: 'RTM-009',
    skillId: 'SKILL-HEIDELBERG-SM',
    level: 'Autorizado',
    lastEvaluationDate: '08 Mar 2026',
    evaluatorName: 'Miguel Ángel Torres',
    internalExperienceMonths: 28,
    notes: 'Opera la corrida de impresión autónomamente. No cuenta con autorización para ajustes de arranque.',
  },
  {
    employeeId: 'RTM-009',
    skillId: 'SKILL-OFFSET-SETUP',
    level: 'Competente',
    lastEvaluationDate: '20 Ene 2026',
    notes: 'Requiere evaluación práctica de curvas CIP3 para recibir autorización formal.',
  },

  // RTM-010: Pedro Infante Cavazos (Ayudante Offset, Offset, Turno 2)
  {
    employeeId: 'RTM-010',
    skillId: 'SKILL-CONSERVER',
    level: 'Competente',
    lastEvaluationDate: '12 May 2026',
    internalExperienceMonths: 10,
  },
  {
    employeeId: 'RTM-010',
    skillId: 'SKILL-HEIDELBERG-SM',
    level: 'En entrenamiento',
    lastEvaluationDate: '15 Ago 2026',
    evaluatorName: 'Andrés Benítez',
    internalExperienceMonths: 2,
    authorizedActivitiesCount: 1,
    totalActivitiesCount: 4,
    instructorId: 'RTM-009',
    instructorName: 'Andrés Benítez Lara',
  },

  // RTM-011: Diana Morales Castro (Operadora Guillotina Polar, Acabado, Turno 1)
  {
    employeeId: 'RTM-011',
    skillId: 'SKILL-GUILLOTINA-POLAR',
    level: 'Instructor',
    lastEvaluationDate: '30 Jun 2026',
    internalExperienceMonths: 40,
  },
  {
    employeeId: 'RTM-011',
    skillId: 'SKILL-STAHL-DOBLADO',
    level: 'Competente',
    lastEvaluationDate: '18 Nov 2025',
    internalExperienceMonths: 12,
  },

  // RTM-012: Héctor Valdés Peña (Operador Stahl / Doblado, Acabado, Turno 1)
  {
    employeeId: 'RTM-012',
    skillId: 'SKILL-STAHL-DOBLADO',
    level: 'Autorizado',
    lastEvaluationDate: '14 May 2026',
    internalExperienceMonths: 22,
  },
  {
    employeeId: 'RTM-012',
    skillId: 'SKILL-GUILLOTINA-POLAR',
    level: 'Competente',
    lastEvaluationDate: '04 Feb 2026',
    internalExperienceMonths: 14,
  },

  // RTM-013: Sofía Trejo Ramos (Operadora Encuadernación / Muller, Acabado, Turno 2)
  {
    employeeId: 'RTM-013',
    skillId: 'SKILL-MULLER-MARTINI',
    level: 'Autorizado',
    lastEvaluationDate: '26 Jul 2026',
    internalExperienceMonths: 26,
  },
  {
    employeeId: 'RTM-013',
    skillId: 'SKILL-GUILLOTINA-POLAR',
    level: 'Autorizado',
    lastEvaluationDate: '19 Ene 2026',
    internalExperienceMonths: 18,
  },

  // RTM-014: Javier Esparza Nieto (Ayudante Acabados, Acabado, Turno 2)
  {
    employeeId: 'RTM-014',
    skillId: 'SKILL-MULLER-MARTINI',
    level: 'En entrenamiento',
    lastEvaluationDate: '22 Ago 2026',
    evaluatorName: 'Sofía Trejo Ramos',
    internalExperienceMonths: 3,
    authorizedActivitiesCount: 2,
    totalActivitiesCount: 4,
    instructorId: 'RTM-013',
    instructorName: 'Sofía Trejo Ramos',
  },

  // RTM-015: Raúl Salinas Olvera (Almacenista MP, Almacén, Turno 1)
  {
    employeeId: 'RTM-015',
    skillId: 'SKILL-ALM-SURTIDO-PROD',
    level: 'Instructor',
    lastEvaluationDate: '18 Jul 2026',
    internalExperienceMonths: 36,
  },

  // RTM-016: Patricia Guerra Ruiz (Montacarguista, Almacén, Turno 2)
  {
    employeeId: 'RTM-016',
    skillId: 'SKILL-ALM-SURTIDO-PROD',
    level: 'Autorizado',
    lastEvaluationDate: '12 May 2026',
    internalExperienceMonths: 20,
  },

  // RTM-025: Alicia Ramírez (Inspectora QA / Auditora Líder, Calidad, Turno 1)
  {
    employeeId: 'RTM-025',
    skillId: 'SKILL-QA-FIRST-PIECE-FLEXO',
    level: 'Instructor',
    lastEvaluationDate: '10 Ago 2026',
    internalExperienceMonths: 48,
    notes: 'Auditora líder calificada ISO 9001 / IATF 16949.',
  },
  {
    employeeId: 'RTM-025',
    skillId: 'SKILL-QA-FIRST-PIECE-OFFSET',
    level: 'Instructor',
    lastEvaluationDate: '10 Ago 2026',
    internalExperienceMonths: 48,
  },
  {
    employeeId: 'RTM-025',
    skillId: 'SKILL-QA-FINAL-AUDIT',
    level: 'Instructor',
    lastEvaluationDate: '10 Ago 2026',
    internalExperienceMonths: 48,
  },

  // RTM-026: Jorge Márquez (Inspector Calidad Piso, Calidad, Turno 2)
  {
    employeeId: 'RTM-026',
    skillId: 'SKILL-QA-FIRST-PIECE-FLEXO',
    level: 'Autorizado',
    lastEvaluationDate: '15 Sep 2025', // Próxima a vencer / revisión requerida este mes
    evaluatorName: 'Alicia Ramírez',
    internalExperienceMonths: 12,
    notes: 'Entrenamiento interno de inspección de primera pieza requiere revisión este mes.',
  },
  {
    employeeId: 'RTM-026',
    skillId: 'SKILL-QA-FINAL-AUDIT',
    level: 'Autorizado',
    lastEvaluationDate: '15 Feb 2026',
    internalExperienceMonths: 14,
  },

  // RTM-027: Carmen Zavala (Laboratorista / Colorista, Calidad, Turno 1)
  {
    employeeId: 'RTM-027',
    skillId: 'SKILL-QA-FIRST-PIECE-FLEXO',
    level: 'Autorizado',
    lastEvaluationDate: '20 Jul 2026',
    internalExperienceMonths: 30,
    notes: 'Especialista en igualación de tintas y espectrofotometría.',
  },
  {
    employeeId: 'RTM-027',
    skillId: 'SKILL-QA-FIRST-PIECE-OFFSET',
    level: 'Autorizado',
    lastEvaluationDate: '20 Jul 2026',
    internalExperienceMonths: 30,
  },
];

// =====================================================================
// COBERTURAS POR MÁQUINA / PROCESO Y TURNO
// =====================================================================
export const INITIAL_MACHINE_COVERAGES: MachineShiftCoverage[] = [
  {
    machineId: 'SKILL-MA-SCOUT-10',
    machineName: 'Mark Andy Scout 10”',
    area: 'Flexografía',
    overallStatus: 'Cobertura limitada',
    criticalAlert: 'Turno 2 depende de 1 solo operador autorizado (Roberto Garza). Ausencia detendría la máquina.',
    turnos: [
      {
        shift: 'Turno 1',
        authorizedCount: 3,
        competentCount: 0,
        inTrainingCount: 1,
        instructorCount: 1,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-001', 'RTM-003'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: ['RTM-001'],
        notes: '3 autorizados (incluye instructora María Ríos). Carlos Mendoza en entrenamiento de práctica.',
      },
      {
        shift: 'Turno 2',
        authorizedCount: 1,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura limitada',
        authorizedEmployeeIds: ['RTM-004'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
        notes: 'Solo Roberto Garza. No cuenta con respaldo disponible en el turno.',
      },
      {
        shift: 'Mixto',
        authorizedCount: 0,
        competentCount: 1,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura limitada',
        authorizedEmployeeIds: [],
        competentEmployeeIds: ['RTM-006'],
        inTrainingEmployeeIds: [],
        notes: 'Fernando Soto con experiencia general pero no autorizado en esta prensa.',
      },
    ],
  },
  {
    machineId: 'SKILL-HEIDELBERG-SM',
    machineName: 'Heidelberg Speedmaster',
    area: 'Offset',
    overallStatus: 'Cobertura suficiente',
    criticalAlert: '2 operadores pueden ejecutar la impresión, pero solo 1 tiene autorización interna para ajustes de arranque.',
    turnos: [
      {
        shift: 'Turno 1',
        authorizedCount: 2,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 1,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-007', 'RTM-008'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
        notes: 'Miguel Ángel Torres (Instructor) y Laura Coronado (Autorizada).',
      },
      {
        shift: 'Turno 2',
        authorizedCount: 1,
        competentCount: 1,
        inTrainingCount: 1,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-009'],
        competentEmployeeIds: ['RTM-009'],
        inTrainingEmployeeIds: ['RTM-010'],
        notes: 'Andrés Benítez opera tiraje. Pedro Infante en entrenamiento básico.',
      },
      {
        shift: 'Mixto',
        authorizedCount: 0,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 1,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: [],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
        notes: 'Daniel Torres (Manufactura/Procesos) puede supervisar arranques complejos.',
      },
    ],
  },
  {
    machineId: 'SKILL-MA-830-7',
    machineName: 'Mark Andy 830 7”',
    area: 'Flexografía',
    overallStatus: 'Cobertura suficiente',
    turnos: [
      {
        shift: 'Turno 1',
        authorizedCount: 2,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-001', 'RTM-003'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
      },
      {
        shift: 'Turno 2',
        authorizedCount: 1,
        competentCount: 1,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-004'],
        competentEmployeeIds: ['RTM-004'],
        inTrainingEmployeeIds: [],
      },
      {
        shift: 'Mixto',
        authorizedCount: 0,
        competentCount: 1,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: [],
        competentEmployeeIds: ['RTM-006'],
        inTrainingEmployeeIds: [],
      },
    ],
  },
  {
    machineId: 'SKILL-GUILLOTINA-POLAR',
    machineName: 'Guillotina Polar',
    area: 'Acabados',
    overallStatus: 'Cobertura suficiente',
    turnos: [
      {
        shift: 'Turno 1',
        authorizedCount: 1,
        competentCount: 1,
        inTrainingCount: 0,
        instructorCount: 1,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-011'],
        competentEmployeeIds: ['RTM-012'],
        inTrainingEmployeeIds: [],
        notes: 'Diana Morales (Instructora) y Héctor Valdés como respaldo competente.',
      },
      {
        shift: 'Turno 2',
        authorizedCount: 1,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-013'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
        notes: 'Sofía Trejo capacitada para cortes del turno vespertino.',
      },
      {
        shift: 'Mixto',
        authorizedCount: 0,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: [],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
      },
    ],
  },
  {
    machineId: 'SKILL-QA-FIRST-PIECE-FLEXO',
    machineName: 'Primera Pieza Flexo (QA Gate)',
    area: 'Calidad',
    overallStatus: 'Cobertura limitada',
    criticalAlert: '2 inspectores habilitados; uno tiene renovación de entrenamiento requerida este mes (Jorge Márquez).',
    turnos: [
      {
        shift: 'Turno 1',
        authorizedCount: 2,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 1,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-025', 'RTM-027'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
        notes: 'Alicia Ramírez (Instructora) y Carmen Zavala (Colorimetría).',
      },
      {
        shift: 'Turno 2',
        authorizedCount: 1,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura limitada',
        authorizedEmployeeIds: ['RTM-026'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
        notes: 'Jorge Márquez requiere evaluación de renovación anual durante septiembre.',
      },
      {
        shift: 'Mixto',
        authorizedCount: 0,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: [],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
      },
    ],
  },
  {
    machineId: 'SKILL-ROTOFLEX-1',
    machineName: 'Rotoflex I / Inspección',
    area: 'Flexografía',
    overallStatus: 'Cobertura suficiente',
    turnos: [
      {
        shift: 'Turno 1',
        authorizedCount: 1,
        competentCount: 1,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-003'],
        competentEmployeeIds: ['RTM-002'],
        inTrainingEmployeeIds: [],
      },
      {
        shift: 'Turno 2',
        authorizedCount: 1,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 0,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-005'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
      },
      {
        shift: 'Mixto',
        authorizedCount: 1,
        competentCount: 0,
        inTrainingCount: 0,
        instructorCount: 1,
        status: 'Cobertura suficiente',
        authorizedEmployeeIds: ['RTM-006'],
        competentEmployeeIds: [],
        inTrainingEmployeeIds: [],
        notes: 'Fernando Soto como instructor de rebobinado.',
      },
    ],
  },
];

// =====================================================================
// PLAN DE CAPACITACIONES (En curso, programadas y completadas)
// =====================================================================
export const INITIAL_PLANT_TRAININGS: PlantTraining[] = [
  {
    id: 'CAP-2026-018',
    code: 'CAP-2026-018',
    title: 'Operación Mark Andy Scout 10”',
    employeeId: 'RTM-001',
    employeeName: 'Carlos Mendoza Ruiz',
    employeeDepartment: 'Flexografía',
    employeeShift: 'Turno 1 (Matutino)',
    skillId: 'SKILL-MA-SCOUT-10',
    skillName: 'Mark Andy Scout 10”',
    machineOrProcess: 'Mark Andy Scout 10” · Flexografía',
    instructorId: 'RTM-003',
    instructorName: 'María Ríos Garza',
    targetObjective: 'Operación autónoma',
    estimatedCompletionDate: '14 Sep 2026',
    status: 'En curso',
    activities: [
      { id: 'act-1', name: 'Seguridad de prensa servo y paro de emergencia', completed: true, completedDate: '22 Ago 2026' },
      { id: 'act-2', name: 'Enhebrado de banda y tensión electrónica de sustrato', completed: true, completedDate: '28 Ago 2026' },
      { id: 'act-3', name: 'Setup supervisado de cilindros anilox y rasquetas', completed: false },
      { id: 'act-4', name: 'Corrida práctica y evaluación de registro continuo', completed: false },
    ],
    notes: 'Capacitación para brindar respaldo en Turno 1 y eventual apoyo en Turno 2 si se requiere intercambio.',
  },
  {
    id: 'CAP-2026-019',
    code: 'CAP-2026-019',
    title: 'Ajustes de Arranque y Calibración CIP3 Offset',
    employeeId: 'RTM-008',
    employeeName: 'Laura Coronado Silva',
    employeeDepartment: 'Offset',
    employeeShift: 'Turno 1 (Matutino)',
    skillId: 'SKILL-OFFSET-SETUP',
    skillName: 'Ajustes de Arranque Offset',
    machineOrProcess: 'Heidelberg Speedmaster · Offset',
    instructorId: 'RTM-007',
    instructorName: 'Miguel Ángel Torres',
    targetObjective: 'Ajuste y preparación',
    estimatedCompletionDate: '18 Sep 2026',
    status: 'En curso',
    activities: [
      { id: 'act-1', name: 'Revisión de curvas de entintado CIP3 en consola', completed: true, completedDate: '25 Ago 2026' },
      { id: 'act-2', name: 'Montaje de láminas térmicas CTP con registro previo', completed: true, completedDate: '30 Ago 2026' },
      { id: 'act-3', name: 'Ajuste de humectación y balance agua-tinta fino', completed: false },
      { id: 'act-4', name: 'Aprobación de primera tirada conforme a estándar ISO 12647', completed: false },
    ],
    notes: 'Permitirá que Laura pueda liberar arranques sin esperar al maestro prensista.',
  },
  {
    id: 'CAP-2026-020',
    code: 'CAP-2026-020',
    title: 'Renovación de Criterios de Aprobación Primera Pieza Flexo',
    employeeId: 'RTM-026',
    employeeName: 'Jorge Márquez',
    employeeDepartment: 'Calidad',
    employeeShift: 'Turno 2 (Vespertino)',
    skillId: 'SKILL-QA-FIRST-PIECE-FLEXO',
    skillName: 'Primera Pieza Flexo (QA Gate)',
    machineOrProcess: 'Mesa QA / Espectrofotómetro SpectroEye',
    instructorId: 'RTM-025',
    instructorName: 'Alicia Ramírez',
    targetObjective: 'Inspección de calidad',
    estimatedCompletionDate: '11 Sep 2026',
    status: 'Requiere revisión',
    activities: [
      { id: 'act-1', name: 'Calibración diaria de espectrofotómetro con blanco cerámico', completed: true, completedDate: '01 Sep 2026' },
      { id: 'act-2', name: 'Medición de Delta E y tolerancias CMC automotrices', completed: false },
      { id: 'act-3', name: 'Pruebas de adhesión ASTM D3359 en sustratos tratados', completed: false },
      { id: 'act-4', name: 'Liberación formal digital en módulo de Calidad RTM', completed: false },
    ],
    notes: 'Renovación anual obligatoria para personal de inspección de piso vespertino.',
  },
  {
    id: 'CAP-2026-021',
    code: 'CAP-2026-021',
    title: 'Operación y Plegado Farmacéutico en Stahl',
    employeeId: 'RTM-014',
    employeeName: 'Javier Esparza Nieto',
    employeeDepartment: 'Acabados',
    employeeShift: 'Turno 2 (Vespertino)',
    skillId: 'SKILL-STAHL-DOBLADO',
    skillName: 'Doblado en Stahl',
    machineOrProcess: 'Plegadora Stahl · Acabados',
    instructorId: 'RTM-012',
    instructorName: 'Héctor Valdés Peña',
    targetObjective: 'Operación autónoma',
    estimatedCompletionDate: '25 Sep 2026',
    status: 'Programada',
    activities: [
      { id: 'act-1', name: 'Ajuste de bolsas de doblado y rodillos de presión', completed: false },
      { id: 'act-2', name: 'Alimentación de sustrato delgado 60g sin doble pliegue', completed: false },
      { id: 'act-3', name: 'Verificación de paralelismo con cuenta hilos', completed: false },
    ],
    notes: 'Capacitación programada para fortalecer el turno 2 en prospectos farmacéuticos.',
  },
  {
    id: 'CAP-2026-015',
    code: 'CAP-2026-015',
    title: 'Operación Autónoma Rotoflex e Inspección de Bobina',
    employeeId: 'RTM-005',
    employeeName: 'Brenda Luna Castillo',
    employeeDepartment: 'Flexografía',
    employeeShift: 'Turno 2 (Vespertino)',
    skillId: 'SKILL-ROTOFLEX-1',
    skillName: 'Rotoflex I / Inspección',
    machineOrProcess: 'Rotoflex I · Flexografía',
    instructorId: 'RTM-006',
    instructorName: 'Fernando Soto Morales',
    targetObjective: 'Operación autónoma',
    estimatedCompletionDate: '11 Ago 2026',
    status: 'Completada',
    activities: [
      { id: 'act-1', name: 'Ajuste de navajas de corte y sensores de etiqueta faltante', completed: true, completedDate: '02 Ago 2026' },
      { id: 'act-2', name: 'Calibración de estroboscopio y tensión de rebobinado', completed: true, completedDate: '06 Ago 2026' },
      { id: 'act-3', name: 'Empaque de rollos con etiqueta Zebra de producto terminado', completed: true, completedDate: '10 Ago 2026' },
      { id: 'act-4', name: 'Evaluación práctica de velocidad y precisión de empalme', completed: true, completedDate: '11 Ago 2026' },
    ],
    notes: 'Capacitación concluida exitosamente con dictamen de Autorizado.',
    evaluationResult: 'Autorizado',
    evaluatedBy: 'Daniel Torres (Ing. Procesos) y Fernando Soto',
    evaluationDate: '11 Ago 2026',
    evaluationNotes: 'Demostró destreza sobresaliente en el empalme de bobinas y detección de defectos ópticos.',
  },
];

// =====================================================================
// SUGERENCIAS SMART DEL SISTEMA (✦ Sugerencias del sistema)
// =====================================================================
export const COMPETENCY_SYSTEM_SUGGESTIONS: CompetencySystemSuggestion[] = [
  {
    id: 'SUGG-COMP-01',
    type: 'capacitacion_cruzada',
    title: 'Capacitación cruzada para Mark Andy Scout',
    badge: 'Riesgo de parada por ausencia',
    description:
      'El Turno 2 depende de una sola persona autorizada para Mark Andy Scout 10” (Roberto Garza). Capacitar a un operador de Mark Andy 830 mejoraría sustancialmente la cobertura del turno.',
    actionLabel: 'Ver candidatos para entrenamiento',
    secondaryActionLabel: 'Ver cobertura de Scout',
    targetMachineId: 'SKILL-MA-SCOUT-10',
    targetMachineName: 'Mark Andy Scout 10”',
  },
  {
    id: 'SUGG-COMP-02',
    type: 'respaldo_proceso',
    title: 'Candidato idóneo de respaldo detectado',
    badge: 'Candidato con base técnica afín',
    description:
      'Carlos Mendoza ya domina impresión flexográfica en prensas 830 y cuenta con entrenamiento en curso al 50%. Concluir su práctica supervisada habilitará el respaldo necesario para la familia Scout.',
    actionLabel: 'Ver perfil del colaborador',
    secondaryActionLabel: 'Registrar avance de práctica',
    targetEmployeeId: 'RTM-001',
    targetEmployeeName: 'Carlos Mendoza Ruiz',
    suggestedSkillId: 'SKILL-MA-SCOUT-10',
    suggestedInstructorId: 'RTM-003',
    suggestedInstructorName: 'María Ríos Garza',
  },
  {
    id: 'SUGG-COMP-03',
    type: 'renovacion_proxima',
    title: 'Renovación de entrenamiento próxima a vencer',
    badge: 'Calidad · Criterio Gate',
    description:
      'El entrenamiento interno de inspección de primera pieza de Jorge Márquez requiere revisión este mes para mantener la habilitación formal en Turno 2.',
    actionLabel: 'Revisar capacitación',
    secondaryActionLabel: 'Ver perfil del inspector',
    targetEmployeeId: 'RTM-026',
    targetEmployeeName: 'Jorge Márquez',
    suggestedSkillId: 'SKILL-QA-FIRST-PIECE-FLEXO',
  },
  {
    id: 'SUGG-COMP-04',
    type: 'balance_turnos',
    title: 'Desbalance de cobertura en arranques Offset',
    badge: 'Dependencia técnica',
    description:
      'Turno 1 concentra el 100% de la capacidad de ajustes de arranque (CIP3). Turno 2 puede imprimir tiraje pero requiere apoyo si hay cambio de trabajo complejo.',
    actionLabel: 'Comparar cobertura de turnos',
    secondaryActionLabel: 'Programar capacitación',
    targetMachineId: 'SKILL-HEIDELBERG-SM',
    targetMachineName: 'Heidelberg Speedmaster',
  },
];
