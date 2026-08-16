import React from 'react';
import { DashboardData } from '../types';
import { 
  Gauge, 
  Percent, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  FileSpreadsheet,
  ArrowUpRight,
  PackageCheck
} from 'lucide-react';

interface DashboardViewProps {
  data: DashboardData | null;
  onNavigate: (tab: string) => void;
  onOpenReporteModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, onNavigate, onOpenReporteModal }) => {
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

  const maquinas = data?.resumen_maquinas || [];
  const turnos = data?.produccion_por_turno || [];

  return (
    <div>
      {/* Top Banner / Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Centro de Control de Planta</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Supervisión integral de Prensas Offset, Flexografía, Taller de Suajes y Calidad QA para Impresos RTM.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => onNavigate('suajes')}>
            <FileSpreadsheet size={16} />
            <span>Calculador Suajes</span>
          </button>
          <button className="btn btn-primary" onClick={onOpenReporteModal}>
            <Zap size={16} />
            <span>Nuevo Reporte de Operador</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-cards">
        <div className="card">
          <div className="card-header">
            <span className="card-title">OEE Global Planta</span>
            <Gauge size={20} color="var(--accent-blue-light)" />
          </div>
          <div className="metric-value">{kpis.oee_global}%</div>
          <div className="metric-subtext" style={{ color: 'var(--status-success)' }}>
            <TrendingUp size={14} />
            <span>+1.4% respecto al mes anterior</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">OEE Prensas Offset</span>
            <span className="badge badge-blue">Pliegos</span>
          </div>
          <div className="metric-value">{kpis.oee_offset}%</div>
          <div className="metric-subtext">
            <span>Heidelberg & Komori en línea</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">OEE Flexografía</span>
            <span className="badge badge-cyan">Bobinas</span>
          </div>
          <div className="metric-value">{kpis.oee_flexo}%</div>
          <div className="metric-subtext">
            <span>Mark Andy & Nilpeter a régimen</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Índice de Merma</span>
            <Percent size={20} color="var(--status-warning)" />
          </div>
          <div className="metric-value" style={{ color: kpis.merma_promedio_pct < 3.5 ? 'var(--status-success)' : 'var(--status-warning)' }}>
            {kpis.merma_promedio_pct}%
          </div>
          <div className="metric-subtext">
            <span>Meta tolerancia: &lt; 3.50%</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">OTD (A Tiempo)</span>
            <PackageCheck size={20} color="var(--status-success)" />
          </div>
          <div className="metric-value">{kpis.cumplimiento_entregas_pct}%</div>
          <div className="metric-subtext">
            <span>18 órdenes activas programadas</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Machine Live Status & Shift Production */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Machine Status Card */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.125rem' }}>Estado de Prensas en Vivo</h2>
            <span className="badge badge-blue">4 Equipos Principales</span>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Máquina</th>
                  <th>Estado</th>
                  <th>Velocidad</th>
                  <th>Orden Actual</th>
                  <th>Eficiencia</th>
                </tr>
              </thead>
              <tbody>
                {maquinas.map((m, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{m.maquina}</td>
                    <td>
                      <span className={`badge ${
                        m.estado.includes('Operando') ? 'badge-success' : 
                        m.estado.includes('Ajuste') ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {m.estado}
                      </span>
                    </td>
                    <td className="mono-text" style={{ fontSize: '0.8125rem' }}>{m.velocidad_actual}</td>
                    <td>
                      <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.8125rem' }}>
                        {m.orden_actual}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{m.eficiencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift Production Summary */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.125rem' }}>Rendimiento por Turno (Hoy)</h2>
            <Clock size={18} color="var(--text-secondary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            {turnos.map((t, idx) => (
              <div key={idx} style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 700 }}>{t.turno}</span>
                  <span className="badge badge-warning">Merma: {t.merma_pct}%</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Offset: </span>
                    <strong className="mono-text">{t.offset_pliegos.toLocaleString()} pliegos</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Flexo: </span>
                    <strong className="mono-text">{t.flexo_metros.toLocaleString()} metros</strong>
                  </div>
                </div>
                <div className="progress-track" style={{ marginTop: '10px' }}>
                  <div className="progress-bar" style={{ width: `${Math.min(100, (t.offset_pliegos / 50000) * 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
