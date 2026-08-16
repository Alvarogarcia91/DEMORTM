import React from 'react';
import { MuestraDiseno } from '../types';
import { Box, Scissors, Layers, Clock } from 'lucide-react';

interface DisenoViewProps {
  muestras: MuestraDiseno[];
}

export const DisenoView: React.FC<DisenoViewProps> = ({ muestras }) => {
  const grabadosGuia = [
    {
      id: "GRAB-FLX-088",
      cliente: "Bebidas & Jugos del Valle",
      producto: "Etiqueta Néctar Mango 1L",
      lineatura: "150 LPI",
      polimero_tipo: "Cyrel FAST 1.14mm",
      colores: "CMYK + Blanco Opaco + Barniz UV",
      anilox_recomendado: "800 lpi / 2.8 BCM",
      estado: "Grabado Listo en Prensa"
    },
    {
      id: "GRAB-FLX-089",
      cliente: "Agroindustrias del Norte",
      producto: "Etiqueta Térmica 4x6''",
      lineatura: "133 LPI",
      polimero_tipo: "Flexo Standard 1.70mm",
      colores: "Negro + Pantone 356C Verde",
      anilox_recomendado: "600 lpi / 3.5 BCM",
      estado: "En Montaje"
    }
  ];

  return (
    <div className="erp-content-area">
      {/* Header */}
      <div className="welcome-page-header">
        <h1>Diseño Estructural, Muestras & Fotopolímeros</h1>
        <p>Control de prototipos en Plotter de Cama Plana PE, maquetas estructurales y placas flexográficas.</p>
      </div>

      {/* 3 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="clean-kpi-card">
          <div className="kpi-card-top-row">
            <div className="kpi-icon-pastel" style={{ background: '#eff6ff', color: '#0284c7' }}>
              <Box size={18} strokeWidth={2.4} />
            </div>
            <span className="badge-clean badge-blue">Plotter Activo</span>
          </div>
          <div className="kpi-value-text">{muestras.length} Prototipos en Proceso</div>
          <div className="kpi-subtext-gray">Corte y hendido en cama plana PE</div>
        </div>

        <div className="clean-kpi-card">
          <div className="kpi-card-top-row">
            <div className="kpi-icon-pastel" style={{ background: '#fffbeb', color: '#d97706' }}>
              <Clock size={18} strokeWidth={2.4} />
            </div>
            <span className="badge-clean badge-orange">Promedio</span>
          </div>
          <div className="kpi-value-text">18.5 Minutos / Maqueta</div>
          <div className="kpi-subtext-gray">Calibración y corte estructural</div>
        </div>

        <div className="clean-kpi-card">
          <div className="kpi-card-top-row">
            <div className="kpi-icon-pastel" style={{ background: '#ecfdf5', color: '#059669' }}>
              <Layers size={18} strokeWidth={2.4} />
            </div>
            <span className="badge-clean badge-green">HD Flexo</span>
          </div>
          <div className="kpi-value-text">12 Juegos de Placas</div>
          <div className="kpi-subtext-gray">Lineaturas 133 / 150 / 175 LPI</div>
        </div>
      </div>

      {/* Samples Table */}
      <div className="clean-table-card" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scissors size={18} color="#0284c7" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Control de Muestras de Empaque (Plotter PE)</h2>
          </div>
          <span className="badge-clean badge-blue">Área de Diseño RTM</span>
        </div>

        <table className="clean-erp-table">
          <thead>
            <tr>
              <th>ID Muestra</th>
              <th>Cliente / Proyecto</th>
              <th>Tipo de Maqueta</th>
              <th>Sustrato / Calibre</th>
              <th>Diseñador</th>
              <th>Tiempo Plotter</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {muestras.map((m) => (
              <tr key={m.id}>
                <td className="mono-text" style={{ fontWeight: 800, color: '#0284c7' }}>{m.id}</td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.cliente}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{m.proyecto}</div>
                </td>
                <td>
                  <span className="badge-clean badge-blue">{m.tipo}</span>
                </td>
                <td style={{ fontSize: '0.8125rem', color: '#475569' }}>{m.material}</td>
                <td style={{ fontSize: '0.8125rem', color: '#475569' }}>{m.disenador}</td>
                <td className="mono-text" style={{ fontWeight: 600 }}>{m.tiempo_corte_plotter_min} min</td>
                <td>
                  <span className={`badge-clean ${m.estado.includes('Aprobada') ? 'badge-green' : 'badge-orange'}`}>
                    {m.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clichés Table */}
      <div className="clean-table-card">
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#0284c7" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Grabados Guía & Fotopolímeros Flexográficos</h2>
          </div>
          <span className="badge-clean badge-green">Flexo Pre-prensa</span>
        </div>

        <table className="clean-erp-table">
          <thead>
            <tr>
              <th>Código Grabado</th>
              <th>Cliente / Producto</th>
              <th>Lineatura</th>
              <th>Polímero</th>
              <th>Colores / Separación</th>
              <th>Anilox Recomendado</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {grabadosGuia.map((g) => (
              <tr key={g.id}>
                <td className="mono-text" style={{ fontWeight: 800, color: '#0284c7' }}>{g.id}</td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{g.cliente}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{g.producto}</div>
                </td>
                <td className="mono-text" style={{ fontWeight: 700 }}>{g.lineatura}</td>
                <td style={{ fontSize: '0.8125rem', color: '#475569' }}>{g.polimero_tipo}</td>
                <td style={{ fontSize: '0.8125rem', color: '#64748b' }}>{g.colores}</td>
                <td className="mono-text" style={{ fontSize: '0.8125rem', color: '#0284c7' }}>{g.anilox_recomendado}</td>
                <td>
                  <span className="badge-clean badge-green">{g.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
