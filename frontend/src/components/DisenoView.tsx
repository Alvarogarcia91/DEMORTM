import React, { useState } from 'react';
import { MuestraDiseno } from '../types';
import { PenTool, Scissors, Box, Layers, CheckCircle2, Clock, FileCheck } from 'lucide-react';

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
      polimero_tipo: "Cyrel FAST 1.14mm (Solvente 0)",
      colores: "CMYK + Blanco Opaco + Amarillo Reflex + Barniz UV",
      anilox_recomendado: "800 lpi / 2.8 BCM",
      estado: "Grabado Listo en Prensa"
    },
    {
      id: "GRAB-FLX-089",
      cliente: "Agroindustrias del Norte",
      producto: "Etiqueta Térmica Directa 4x6''",
      lineatura: "133 LPI",
      polimero_tipo: "Flexo Standard 1.70mm",
      colores: "Negro + Pantone 356C Verde",
      anilox_recomendado: "600 lpi / 3.5 BCM",
      estado: "En Taller de Lavado / Montaje"
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Diseño Estructural, Muestras & Fotopolímeros</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Control de prototipos en Plotter de Cama Plana PE, maquetas estructurales y placas flexográficas.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Muestras Estructurales Activas</span>
            <Box size={20} color="var(--accent-blue-light)" />
          </div>
          <div className="metric-value">{muestras.length} prototipos</div>
          <div className="metric-subtext">
            Corte & Hendido Plotter PE
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Tiempo Promedio en Plotter</span>
            <Clock size={20} color="var(--status-warning)" />
          </div>
          <div className="metric-value">18.5 min</div>
          <div className="metric-subtext">
            Por maqueta estructural
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Juegos de Placas Flexo</span>
            <Layers size={20} color="var(--status-cyan)" />
          </div>
          <div className="metric-value">12 Juegos</div>
          <div className="metric-subtext">
            HD Flexo 4000 DPI
          </div>
        </div>
      </div>

      {/* Prototipos y Muestras Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h2 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scissors size={18} color="var(--accent-blue-light)" />
            <span>Control de Muestras de Empaque (Plotter PE)</span>
          </h2>
          <span className="badge badge-blue">Área de Diseño RTM</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
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
                  <td className="mono-text" style={{ fontWeight: 700, color: '#38bdf8' }}>{m.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.cliente}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{m.proyecto}</div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{m.tipo}</span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{m.material}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{m.disenador}</td>
                  <td className="mono-text">{m.tiempo_corte_plotter_min} min</td>
                  <td>
                    <span className={`badge ${m.estado.includes('Aprobada') ? 'badge-success' : 'badge-warning'}`}>
                      {m.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grabados Guía & Fotopolímeros */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-blue-light)" />
            <span>Grabados Guía & Fotopolímeros Flexográficos</span>
          </h2>
          <span className="badge badge-cyan">Flexo Prepress</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Código Grabado</th>
                <th>Cliente / Producto</th>
                <th>Lineatura (LPI)</th>
                <th>Tipo de Fotopolímero</th>
                <th>Colores / Separación</th>
                <th>Anilox Recomendado</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {grabadosGuia.map((g) => (
                <tr key={g.id}>
                  <td className="mono-text" style={{ fontWeight: 700, color: '#60a5fa' }}>{g.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{g.cliente}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.producto}</div>
                  </td>
                  <td className="mono-text" style={{ fontWeight: 700 }}>{g.lineatura}</td>
                  <td style={{ fontSize: '0.8125rem' }}>{g.polimero_tipo}</td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{g.colores}</td>
                  <td className="mono-text" style={{ fontSize: '0.8125rem' }}>{g.anilox_recomendado}</td>
                  <td>
                    <span className="badge badge-success">{g.estado}</span>
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
