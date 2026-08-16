import React from 'react';
import { 
  Gauge, 
  Layers, 
  Printer, 
  Scissors, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Activity,
  FileSpreadsheet,
  Box,
  PenTool,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { DashboardData, OrdenProduccion } from '../types';

interface HomeViewProps {
  user: { name: string; role: string; email: string };
  data: DashboardData | null;
  ordenes: OrdenProduccion[];
  onNavigate: (tab: string) => void;
  onOpenReporteModal: () => void;
  onLogout: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  data,
  ordenes,
  onNavigate,
  onOpenReporteModal,
  onLogout
}) => {
  const kpis = data?.kpis || {
    oee_global: 89.8,
    oee_offset: 88.4,
    oee_flexo: 91.2,
    merma_promedio_pct: 2.85,
    cumplimiento_entregas_pct: 96.4,
    ordenes_activas: 18,
    suajes_en_taller: 34,
    lotes_qa_aprobados_hoy: 14,
    tiempo_promedio_preparacion_min: 32.5
  };

  const maquinas = data?.resumen_maquinas || [
    { maquina: "Heidelberg CD 102 (Offset)", estado: "Operando", velocidad_actual: "9,800 pliegos/h", orden_actual: "OP-2026-881", eficiencia: "92%" },
    { maquina: "Komori Lithrone G40 (Offset)", estado: "Ajuste / CTP", velocidad_actual: "0 pliegos/h", orden_actual: "OP-2026-883", eficiencia: "78%" },
    { maquina: "Mark Andy P7 (Flexo)", estado: "Operando", velocidad_actual: "120 m/min", orden_actual: "OP-2026-882", eficiencia: "94%" },
    { maquina: "Nilpeter FA-Line (Flexo)", estado: "Lavado / Cambio", velocidad_actual: "0 m/min", orden_actual: "OP-2026-884", eficiencia: "88%" }
  ];

  return (
    <div className="home-view-wrapper">
      {/* Top Welcome & Executive Bar */}
      <div className="executive-hero-card">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="live-dot"></span>
            <span>PLANTA CENTRAL RTM • TURNO MATUTINO ACTIVO</span>
          </div>
          <h1 className="hero-greeting">
            Hola, <span className="greeting-name">{user.name}</span>
          </h1>
          <p className="hero-subtitle">
            Has ingresado con el perfil de <strong>{user.role}</strong>. Todas las líneas Offset y Flexografía se encuentran reportando telemetría en tiempo real.
          </p>
        </div>

        <div className="hero-actions">
          <div className="user-profile-badge">
            <div className="avatar-circle">
              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="user-details">
              <span className="user-name-text">{user.name}</span>
              <span className="user-role-text">{user.role}</span>
            </div>
            <button 
              className="logout-icon-btn" 
              onClick={onLogout} 
              title="Cerrar sesión y volver al Login"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid-cards home-kpi-grid">
        <div className="card highlight-card">
          <div className="card-header">
            <span className="card-title">OEE Global de Planta</span>
            <Gauge size={20} color="#38bdf8" />
          </div>
          <div className="metric-value">{kpis.oee_global}%</div>
          <div className="metric-subtext" style={{ color: 'var(--status-success)' }}>
            <TrendingUp size={14} />
            <span>+3.2% vs promedio trimestral</span>
          </div>
          <div className="mini-progress-bar">
            <div className="fill" style={{ width: `${kpis.oee_global}%` }}></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Prensas Offset (Pliegos)</span>
            <span className="badge badge-blue">Heidelberg & Komori</span>
          </div>
          <div className="metric-value">{kpis.oee_offset}%</div>
          <div className="metric-subtext">
            <span>9,800 pliegos/h en CD 102</span>
          </div>
          <div className="mini-progress-bar">
            <div className="fill" style={{ width: `${kpis.oee_offset}%`, backgroundColor: '#3b82f6' }}></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Flexografía (Bobinas)</span>
            <span className="badge badge-cyan">Mark Andy & Nilpeter</span>
          </div>
          <div className="metric-value">{kpis.oee_flexo}%</div>
          <div className="metric-subtext">
            <span>120 m/min régimen constante</span>
          </div>
          <div className="mini-progress-bar">
            <div className="fill" style={{ width: `${kpis.oee_flexo}%`, backgroundColor: '#06b6d4' }}></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Índice de Merma Total</span>
            <span className="badge badge-success">Meta &lt; 3.5%</span>
          </div>
          <div className="metric-value" style={{ color: '#10b981' }}>{kpis.merma_promedio_pct}%</div>
          <div className="metric-subtext">
            <span>Ahorro estimado: $42,500 MXN</span>
          </div>
          <div className="mini-progress-bar">
            <div className="fill" style={{ width: `28%`, backgroundColor: '#10b981' }}></div>
          </div>
        </div>
      </div>

      {/* Interactive Core Modules Launcher Grid */}
      <div className="modules-section-header">
        <h2 className="section-title">Módulos Estratégicos del Sistema</h2>
        <span className="section-desc">Selecciona un área para comenzar la demostración interactiva con RTM</span>
      </div>

      <div className="modules-deck-grid">
        <div className="module-deck-card" onClick={() => onNavigate('suajes')}>
          <div className="module-deck-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Scissors size={26} />
          </div>
          <div className="module-deck-info">
            <div className="module-tag">INGENIERÍA & COSTOS</div>
            <h3 className="module-title">Cálculo de Suajes & Imposición 2D</h3>
            <p className="module-desc">
              Algoritmo de aprovechamiento de pliego, distribución de poses $X \times Y$, margen de pinza y cotización de plecas.
            </p>
          </div>
          <div className="module-footer-link">
            <span>Abrir Simulador 2D</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="module-deck-card" onClick={() => onNavigate('produccion')}>
          <div className="module-deck-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
            <Printer size={26} />
          </div>
          <div className="module-deck-info">
            <div className="module-tag">PISO DE PLANTA</div>
            <h3 className="module-title">Programación Master Offset & Flexo</h3>
            <p className="module-desc">
              Balance de colas de máquina, monitoreo de tirajes en vivo, paros de prensa y captura de reportes de operador.
            </p>
          </div>
          <div className="module-footer-link">
            <span>Ver Cola de Prensas</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="module-deck-card" onClick={() => onNavigate('calidad')}>
          <div className="module-deck-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <ShieldCheck size={26} />
          </div>
          <div className="module-deck-info">
            <div className="module-tag">CONTROL DE CALIDAD</div>
            <h3 className="module-title">Auditorías QA & Liberación de Lote</h3>
            <p className="module-desc">
              Inspección de pre-prensa CTP, tolerancia de color $\Delta E$, adherencia de cinta 3M y lectura de código de barras.
            </p>
          </div>
          <div className="module-footer-link">
            <span>Revisar Auditorías</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="module-deck-card" onClick={() => onNavigate('diseno')}>
          <div className="module-deck-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <PenTool size={26} />
          </div>
          <div className="module-deck-info">
            <div className="module-tag">PRE-PRENSA & DISEÑO</div>
            <h3 className="module-title">Muestras Plotter PE & Fotopolímeros</h3>
            <p className="module-desc">
              Trazabilidad de maquetas estructurales cortadas en plotter de cama plana y control de placas flexográficas.
            </p>
          </div>
          <div className="module-footer-link">
            <span>Gestionar Muestras</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* Live Floor Snapshot Table */}
      <div className="card live-floor-table-card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--accent-blue-light)" />
            <h2 style={{ fontSize: '1.125rem' }}>Telemetría en Vivo de Prensas Principales</h2>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onOpenReporteModal}>
            <Zap size={14} />
            <span>Nuevo Reporte de Turno</span>
          </button>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Prensa / Equipo</th>
                <th>Estado Operativo</th>
                <th>Régimen Actual</th>
                <th>Orden de Producción (OP)</th>
                <th>Eficiencia OEE</th>
              </tr>
            </thead>
            <tbody>
              {maquinas.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{m.maquina}</td>
                  <td>
                    <span className={`badge ${
                      m.estado.includes('Operando') ? 'badge-success' : 
                      m.estado.includes('Ajuste') ? 'badge-warning' : 'badge-danger'
                    }`}>
                      <span className="live-dot" style={{ width: '6px', height: '6px' }}></span>
                      {m.estado}
                    </span>
                  </td>
                  <td className="mono-text">{m.velocidad_actual}</td>
                  <td>
                    <span className="mono-text" style={{ color: '#60a5fa', fontWeight: 700 }}>
                      {m.orden_actual}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700 }}>{m.eficiencia}</span>
                      <div className="mini-progress-bar" style={{ width: '60px', margin: 0 }}>
                        <div className="fill" style={{ width: m.eficiencia }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
