import React, { useState, useEffect } from 'react';
import { SuajeItem, SuajeCalcParams, SuajeCalcResult } from '../types';
import { calcularSuajeAPI } from '../services/api';
import { Scissors, Calculator, LayoutGrid, Check, Sparkles, AlertCircle, Wrench, Layers } from 'lucide-react';

interface SuajesViewProps {
  suajesList: SuajeItem[];
}

export const SuajesView: React.FC<SuajesViewProps> = ({ suajesList }) => {
  const [params, setParams] = useState<SuajeCalcParams>({
    nombre_pieza: 'Caja Autoarmable Farmacéutica 120ml',
    tipo_empaque: 'Plegadiza',
    ancho_desarrollo_mm: 280,
    largo_desarrollo_mm: 390,
    ancho_pliego_mm: 720,
    largo_pliego_mm: 1020,
    margen_pinza_mm: 15,
    margen_lateral_mm: 10,
    calle_entre_piezas_mm: 5,
    tipo_suaje: 'Plano',
    tipo_pleca_corte: '2pt 23.80mm',
    tipo_pleca_doblez: '2pt 23.30mm',
    cantidad_piezas_orden: 50000
  });

  const [calculating, setCalculating] = useState(false);
  const [resultado, setResultado] = useState<SuajeCalcResult | null>(null);

  const handleCalcular = async () => {
    setCalculating(true);
    try {
      const res = await calcularSuajeAPI(params);
      setResultado(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    handleCalcular();
  }, []);

  // Parse columns and rows from distribution string e.g. "2 col x 3 filas" or "2 columnas x 3 filas"
  const parseGrid = () => {
    if (!resultado) return { cols: 2, rows: 3 };
    const match = resultado.distribucion.match(/(\d+)\s*(?:col|columnas).*?(\d+)\s*filas/i);
    if (match) {
      return { cols: parseInt(match[1], 10) || 2, rows: parseInt(match[2], 10) || 3 };
    }
    return { cols: 2, rows: Math.ceil(resultado.poses_totales_por_pliego / 2) };
  };

  const grid = parseGrid();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Ingeniería de Suajes & Aprovechamiento de Pliego</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Cálculo paramétrico de imposición de troqueles, optimización de sustrato y control de herramentales RTM.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Input Parameters Card */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} color="var(--accent-blue-light)" />
              <span>Parámetros de la Pieza & Pliego</span>
            </h2>
            <span className="badge badge-blue">RTM Estándar</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Nombre del Producto / Pieza</label>
              <input 
                type="text" 
                className="form-input" 
                value={params.nombre_pieza} 
                onChange={(e) => setParams({ ...params, nombre_pieza: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ancho Extendido (mm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={params.ancho_desarrollo_mm} 
                onChange={(e) => setParams({ ...params, ancho_desarrollo_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Largo Extendido (mm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={params.largo_desarrollo_mm} 
                onChange={(e) => setParams({ ...params, largo_desarrollo_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ancho de Pliego (mm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={params.ancho_pliego_mm} 
                onChange={(e) => setParams({ ...params, ancho_pliego_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Largo de Pliego (mm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={params.largo_pliego_mm} 
                onChange={(e) => setParams({ ...params, largo_pliego_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Margen de Pinza (mm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={params.margen_pinza_mm} 
                onChange={(e) => setParams({ ...params, margen_pinza_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calle entre Piezas (mm)</label>
              <input 
                type="number" 
                className="form-input" 
                value={params.calle_entre_piezas_mm} 
                onChange={(e) => setParams({ ...params, calle_entre_piezas_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tiraje Requerido (Piezas)</label>
              <input 
                type="number" 
                className="form-input" 
                value={params.cantidad_piezas_orden} 
                onChange={(e) => setParams({ ...params, cantidad_piezas_orden: parseInt(e.target.value, 10) || 0 })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Suaje</label>
              <select 
                className="form-select" 
                value={params.tipo_suaje} 
                onChange={(e) => setParams({ ...params, tipo_suaje: e.target.value })}
              >
                <option value="Plano">Plano (Plegadizas Offset)</option>
                <option value="Rotativo">Rotativo / Magnético (Flexo)</option>
              </select>
            </div>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }} 
            onClick={handleCalcular}
            disabled={calculating}
          >
            <Sparkles size={16} />
            <span>{calculating ? 'Calculando Optimización...' : 'Recalcular Imposición & Aprovechamiento'}</span>
          </button>
        </div>

        {/* 2D Interactive Preview & Results Card */}
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.125rem' }}>Aprovechamiento & Imposición 2D</h2>
            {resultado && (
              <span className={`badge ${resultado.aprovechamiento_pliego_pct >= 80 ? 'badge-success' : 'badge-warning'}`}>
                {resultado.aprovechamiento_pliego_pct}% Rendimiento
              </span>
            )}
          </div>

          {resultado && (
            <div>
              {/* Sheet Visualizer */}
              <div className="sheet-preview-container" style={{ marginBottom: '18px' }}>
                <div className="gripper-indicator" title="Margen de Pinza (Heidelberg / Prensa)"></div>
                
                <div 
                  className="sheet-canvas-mock"
                  style={{
                    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                    width: '85%',
                    height: '220px'
                  }}
                >
                  {Array.from({ length: resultado.poses_totales_por_pliego }).map((_, i) => (
                    <div key={i} className="sheet-pose">
                      <Scissors size={12} style={{ marginBottom: '2px', opacity: 0.8 }} />
                      <span>Pose #{i + 1}</span>
                      <span style={{ fontSize: '0.625rem', opacity: 0.75 }}>{params.ancho_desarrollo_mm}x{params.largo_desarrollo_mm}</span>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  Pliego: {params.ancho_pliego_mm} x {params.largo_pliego_mm} mm | Distribución: {resultado.distribucion}
                </div>
              </div>

              {/* Numerical breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8125rem' }}>
                <div style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Poses por Pliego:</div>
                  <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue-light)' }}>
                    {resultado.poses_totales_por_pliego} poses
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Pliegos Brutos de Compra:</div>
                  <div className="mono-text" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {resultado.pliegos_brutos_compra.toLocaleString()} hojas
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Metros Pleca (Corte/Doblez):</div>
                  <div className="mono-text" style={{ fontWeight: 700 }}>
                    {resultado.estimacion_tecnica_suaje.metros_pleca_corte}m / {resultado.estimacion_tecnica_suaje.metros_pleca_doblez}m
                  </div>
                </div>

                <div style={{ background: 'var(--bg-input)', padding: '10px 12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Costo Estimado Suaje:</div>
                  <div className="mono-text" style={{ fontWeight: 700, color: '#34d399' }}>
                    ${resultado.estimacion_tecnica_suaje.costo_estimado_fabricacion_mxn.toLocaleString()} MXN
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workshop Suajes Inventory */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} color="var(--accent-blue-light)" />
            <span>Inventario de Suajes Activos en Taller RTM</span>
          </h2>
          <span className="badge badge-secondary">{suajesList.length} Herramentales Registrados</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Código Suaje</th>
                <th>Nombre / Cliente</th>
                <th>Poses / Pliego</th>
                <th>Aprovechamiento</th>
                <th>Golpes Acumulados</th>
                <th>Ubicación Rack</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {suajesList.map((s) => (
                <tr key={s.id}>
                  <td className="mono-text" style={{ fontWeight: 700, color: '#38bdf8' }}>{s.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.cliente}</div>
                  </td>
                  <td className="mono-text">{s.poses_por_pliego} poses ({s.disposicion})</td>
                  <td>
                    <span className="badge badge-success">{s.aprovechamiento_pct}%</span>
                  </td>
                  <td className="mono-text">
                    {s.golpes_acumulados.toLocaleString()} / {s.vida_util_estimada.toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-secondary">{s.ubicacion_rack}</span>
                  </td>
                  <td>
                    <span className={`badge ${s.estado.includes('En Uso') ? 'badge-success' : 'badge-blue'}`}>
                      {s.estado}
                    </span>
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
