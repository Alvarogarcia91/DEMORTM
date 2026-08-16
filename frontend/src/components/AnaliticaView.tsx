import React from 'react';
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  FileSpreadsheet, 
  AlertCircle,
  RotateCcw,
  FileDown,
  FileText
} from 'lucide-react';

export const AnaliticaView: React.FC = () => {
  return (
    <div className="erp-content-area">
      {/* Title & Action Buttons from Image 3 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Analítica Comercial</h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>Centro de inteligencia estratégica y comportamiento de mercado</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-white-action" title="Recargar">
            <RotateCcw size={15} />
          </button>
          <button className="btn-white-action">
            <FileDown size={15} />
            <span>EXPORTAR EXCEL</span>
          </button>
          <button className="btn-dark-pdf">
            <FileText size={15} />
            <span>REPORTE PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Strip from Image 3 */}
      <div className="filter-strip-card">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="filter-chip-btn">
            <span>📅 JULIO 2026</span>
          </div>
          <div className="filter-chip-btn">
            <span>Vendedor ▾</span>
          </div>
          <div className="filter-chip-btn">
            <span>Cliente ▾</span>
          </div>
          <div className="filter-chip-btn">
            <span>Familia ▾</span>
          </div>
          <div className="filter-chip-btn">
            <span>Moneda ▾</span>
          </div>
        </div>

        <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
          ÚLTIMO CIERRE: <strong style={{ color: '#059669' }}>06 Jul 2026, 23:59</strong>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards from Image 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div className="clean-kpi-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="kpi-icon-pastel" style={{ background: '#eff6ff', color: '#2563eb', width: '32px', height: '32px' }}>
              <DollarSign size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>+13.2%</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>VENTA YTD</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>$33.05M</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>vs $29.2M 2025</div>
        </div>

        <div className="clean-kpi-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="kpi-icon-pastel" style={{ background: '#faf5ff', color: '#9333ea', width: '32px', height: '32px' }}>
              <Target size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>En meta</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>PRESUPUESTO YTD</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>$32.3M</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Meta acumulada</div>
        </div>

        <div className="clean-kpi-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="kpi-icon-pastel" style={{ background: '#fffbeb', color: '#d97706', width: '32px', height: '32px' }}>
              <TrendingUp size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>-2.1%</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>AVANCE</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>80.3%</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Meta mensual Jul</div>
        </div>

        <div className="clean-kpi-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="kpi-icon-pastel" style={{ background: '#ecfdf5', color: '#059669', width: '32px', height: '32px' }}>
              <Users size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>+8</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>CLIENTES ACTIVOS</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>142</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Con compra YTD</div>
        </div>

        <div className="clean-kpi-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="kpi-icon-pastel" style={{ background: '#eff6ff', color: '#0284c7', width: '32px', height: '32px' }}>
              <FileSpreadsheet size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>18 críticas</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>COTIZACIONES OPEN</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>34</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>$3.42M total</div>
        </div>

        <div className="clean-kpi-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div className="kpi-icon-pastel" style={{ background: '#fef2f2', color: '#dc2626', width: '32px', height: '32px' }}>
              <AlertCircle size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>Urgente</span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 700 }}>CLIENTES EN CAÍDA</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>8</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>-15% vs prev</div>
        </div>
      </div>

      {/* 2 Charts Split Row from Image 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Chart 1: Venta MXP Mensual */}
        <div className="clean-kpi-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>1. VENTA MXP MENSUAL</h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Comparativo vs 2025 y Presupuesto</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
              <span style={{ color: '#0284c7' }}>● 2026</span>
              <span style={{ color: '#cbd5e1' }}>● 2025</span>
              <span style={{ color: '#818cf8' }}>● BGT</span>
            </div>
          </div>

          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
            {[
              { m: 'Ene', v26: 70, v25: 60 },
              { m: 'Feb', v26: 78, v25: 65 },
              { m: 'Mar', v26: 85, v25: 72 },
              { m: 'Abr', v26: 82, v25: 70 },
              { m: 'May', v26: 90, v25: 75 },
              { m: 'Jun', v26: 94, v25: 80 },
              { m: 'Jul', v26: 88, v25: 78 },
            ].map((bar, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '180px' }}>
                  <div style={{ width: '18px', height: `${bar.v26}%`, background: '#0284c7', borderRadius: '4px 4px 0 0' }}></div>
                  <div style={{ width: '18px', height: `${bar.v25}%`, background: '#e2e8f0', borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Acumulado YTD */}
        <div className="clean-kpi-card" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>2. ACUMULADO YTD</h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Desempeño acumulado vs histórico</span>
          </div>

          <div style={{ height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>$34M</span>
            </div>
            <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%', height: '4px', background: 'linear-gradient(90deg, #0284c7, #38bdf8)', borderRadius: '2px' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>$17M</span>
              <span style={{ color: '#059669', fontWeight: 700 }}>+13.2% Crecimiento constante</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
