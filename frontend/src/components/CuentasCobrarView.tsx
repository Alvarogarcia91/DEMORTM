import React, { useState } from 'react';
import { 
  FileDown, 
  ChevronRight, 
  RotateCcw
} from 'lucide-react';

export const CuentasCobrarView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('Dashboard');

  const subTabs = ['Dashboard', 'Cobrar', 'Historial de cobros', 'Estado de cuenta'];

  return (
    <div className="erp-content-area">
      {/* Title & Action from Image 4 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Cuentas por cobrar</h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>Control de facturas, saldos, vencimientos y aplicación de pagos.</p>
        </div>

        <button className="btn-white-action">
          <FileDown size={15} />
          <span>Exportar Excel</span>
        </button>
      </div>

      {/* Sub Tabs from Image 4 */}
      <div className="subtabs-clean-bar">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              className={`subtab-clean-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Help Banner from Image 4 */}
      <div style={{ background: '#f0f9ff', border: '1px solid #e0f2fe', borderRadius: '12px', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.875rem', color: '#0284c7', fontWeight: 600, cursor: 'pointer' }}>
        <span>Ayuda — Dashboard cobranza</span>
        <ChevronRight size={16} />
      </div>

      {/* Filter Box from Image 4 */}
      <div className="clean-kpi-card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label className="input-label-clean" style={{ fontSize: '0.75rem' }}>Fecha inicio</label>
            <input type="text" className="input-clean" defaultValue="07/01/2026" style={{ padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '10px' }} />
          </div>

          <div>
            <label className="input-label-clean" style={{ fontSize: '0.75rem' }}>Fecha fin</label>
            <input type="text" className="input-clean" defaultValue="07/31/2026" style={{ padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '10px' }} />
          </div>

          <div>
            <label className="input-label-clean" style={{ fontSize: '0.75rem' }}>Cliente</label>
            <select className="input-clean" style={{ padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '10px' }}>
              <option>Todos</option>
            </select>
          </div>

          <div>
            <label className="input-label-clean" style={{ fontSize: '0.75rem' }}>Moneda</label>
            <select className="input-clean" style={{ padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '10px' }}>
              <option>Todas</option>
            </select>
          </div>

          <div>
            <label className="input-label-clean" style={{ fontSize: '0.75rem' }}>Estado</label>
            <select className="input-clean" style={{ padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '10px' }}>
              <option>Todos</option>
            </select>
          </div>

          <div>
            <label className="input-label-clean" style={{ fontSize: '0.75rem' }}>Riesgo</label>
            <select className="input-clean" style={{ padding: '8px 12px', fontSize: '0.8125rem', borderRadius: '10px' }}>
              <option>Todos</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary-blue" style={{ width: 'auto', padding: '8px 20px', fontSize: '0.875rem', borderRadius: '10px' }}>
            Actualizar
          </button>
          <button className="btn-white-action" style={{ padding: '8px 16px', borderRadius: '10px' }}>
            Limpiar
          </button>
          <button className="btn-white-action" style={{ padding: '8px 16px', borderRadius: '10px' }}>
            <FileDown size={14} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* 6 Colored Border Cards from Image 4 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div className="clean-kpi-card" style={{ border: '1.5px solid #bfdbfe', background: '#ffffff', padding: '16px' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>$700,396</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>MXN</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total facturado</div>
        </div>

        <div className="clean-kpi-card" style={{ border: '1.5px solid #a7f3d0', background: '#ecfdf5', padding: '16px' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>$469,654</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>MXN</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total cobrado</div>
        </div>

        <div className="clean-kpi-card" style={{ border: '1.5px solid #fde68a', background: '#fffbeb', padding: '16px' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#d97706' }}>$240,240</div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>MXN</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Saldo pendiente</div>
        </div>

        <div className="clean-kpi-card" style={{ border: '1.5px solid #fecaca', background: '#fef2f2', padding: '16px' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#dc2626' }}>$240,240</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>MXN</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Saldo vencido</div>
        </div>

        <div className="clean-kpi-card" style={{ border: '1.5px solid #fecaca', background: '#fff1f2', padding: '16px' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#dc2626' }}>39</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>facturas</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Facturas vencidas</div>
        </div>

        <div className="clean-kpi-card" style={{ border: '1.5px solid #fecaca', background: '#fff1f2', padding: '16px' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#dc2626' }}>5</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>clientes</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Clientes bloqueados</div>
        </div>
      </div>

      {/* Antigüedad de Cartera Horizontal Bar from Image 4 */}
      <div className="clean-kpi-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '18px' }}>
          ANTIGÜEDAD DE CARTERA
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>0 - 30 días</span>
              <strong style={{ color: '#0f172a' }}>$0.00</strong>
            </div>
            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', width: '100%' }}></div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>0%</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>31 - 60 días</span>
              <strong style={{ color: '#0f172a' }}>$43,610.00</strong>
            </div>
            <div style={{ height: '4px', background: '#f59e0b', borderRadius: '2px', width: '100%' }}></div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>18%</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>61 - 90 días</span>
              <strong style={{ color: '#0f172a' }}>$38,400.00</strong>
            </div>
            <div style={{ height: '4px', background: '#ea580c', borderRadius: '2px', width: '100%' }}></div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>16%</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>+90 días</span>
              <strong style={{ color: '#0f172a' }}>$158,230.00</strong>
            </div>
            <div style={{ height: '4px', background: '#dc2626', borderRadius: '2px', width: '100%' }}></div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>66%</div>
          </div>
        </div>
      </div>

      {/* Top Clientes Table from Image 4 */}
      <div className="clean-table-card">
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', fontWeight: 800, fontSize: '0.9375rem', color: '#0f172a' }}>
          Top clientes con mayor saldo pendiente
        </div>
        <table className="clean-erp-table">
          <thead>
            <tr>
              <th>Cliente / Razón Social</th>
              <th>RFC</th>
              <th>Facturas Vencidas</th>
              <th>Saldo Pendiente</th>
              <th>Estado de Crédito</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 700 }}>Laboratorios Farmacéuticos San Rafael S.A.</td>
              <td className="mono-text">LFS980412R33</td>
              <td style={{ color: '#dc2626', fontWeight: 700 }}>2 facturas</td>
              <td style={{ fontWeight: 800 }}>$142,500.00 MXN</td>
              <td><span className="badge-clean badge-green">Activo c/Convenio</span></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Bebidas & Jugos del Valle de México</td>
              <td className="mono-text">BJV110822T81</td>
              <td style={{ color: '#dc2626', fontWeight: 700 }}>1 factura</td>
              <td style={{ fontWeight: 800 }}>$65,740.00 MXN</td>
              <td><span className="badge-clean badge-blue">Corriente</span></td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Cosméticos Élite MX S. de R.L.</td>
              <td className="mono-text">CEM190305K12</td>
              <td style={{ color: '#dc2626', fontWeight: 700 }}>2 facturas</td>
              <td style={{ fontWeight: 800 }}>$32,000.00 MXN</td>
              <td><span className="badge-clean badge-red">Bloqueado</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
