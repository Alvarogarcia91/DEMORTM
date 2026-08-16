import React, { useState, useEffect } from 'react';
import { SuajeItem, SuajeCalcParams, SuajeCalcResult } from '../types';
import { calcularSuajeAPI } from '../services/api';
import { Scissors, Calculator, Sparkles, Wrench } from 'lucide-react';

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

  const parseGrid = () => {
    if (!resultado) return { cols: 2, rows: 2 };
    const match = resultado.distribucion.match(/(\d+)\s*(?:col|columnas).*?(\d+)\s*filas/i);
    if (match) {
      return { cols: parseInt(match[1], 10) || 2, rows: parseInt(match[2], 10) || 2 };
    }
    return { cols: 2, rows: 2 };
  };

  const grid = parseGrid();

  return (
    <div className="erp-content-area">
      {/* View Header */}
      <div className="welcome-page-header">
        <h1>Ingeniería de Suajes & Aprovechamiento de Pliego</h1>
        <p>Cálculo paramétrico de imposición de troqueles, optimización de sustrato y control de herramentales RTM.</p>
      </div>

      {/* 2-Column Split: Form (Left) & 2D Preview (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Left: Input Parameters Card */}
        <div className="clean-kpi-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="kpi-icon-pastel" style={{ background: '#eff6ff', color: '#0284c7' }}>
                <Calculator size={18} strokeWidth={2.4} />
              </div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Parámetros de la Pieza & Pliego</h2>
            </div>
            <span className="badge-clean badge-blue">RTM Estándar</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label className="input-label-clean">Nombre del Producto / Pieza</label>
              <input 
                type="text" 
                className="input-clean" 
                value={params.nombre_pieza} 
                onChange={(e) => setParams({ ...params, nombre_pieza: e.target.value })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Ancho Extendido (mm)</label>
              <input 
                type="number" 
                className="input-clean" 
                value={params.ancho_desarrollo_mm} 
                onChange={(e) => setParams({ ...params, ancho_desarrollo_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Largo Extendido (mm)</label>
              <input 
                type="number" 
                className="input-clean" 
                value={params.largo_desarrollo_mm} 
                onChange={(e) => setParams({ ...params, largo_desarrollo_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Ancho de Pliego (mm)</label>
              <input 
                type="number" 
                className="input-clean" 
                value={params.ancho_pliego_mm} 
                onChange={(e) => setParams({ ...params, ancho_pliego_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Largo de Pliego (mm)</label>
              <input 
                type="number" 
                className="input-clean" 
                value={params.largo_pliego_mm} 
                onChange={(e) => setParams({ ...params, largo_pliego_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Margen de Pinza (mm)</label>
              <input 
                type="number" 
                className="input-clean" 
                value={params.margen_pinza_mm} 
                onChange={(e) => setParams({ ...params, margen_pinza_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Calle entre Piezas (mm)</label>
              <input 
                type="number" 
                className="input-clean" 
                value={params.calle_entre_piezas_mm} 
                onChange={(e) => setParams({ ...params, calle_entre_piezas_mm: parseFloat(e.target.value) || 0 })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Tiraje Requerido (Piezas)</label>
              <input 
                type="number" 
                className="input-clean" 
                value={params.cantidad_piezas_orden} 
                onChange={(e) => setParams({ ...params, cantidad_piezas_orden: parseInt(e.target.value, 10) || 0 })} 
              />
            </div>

            <div>
              <label className="input-label-clean">Tipo de Suaje</label>
              <select 
                className="input-clean" 
                value={params.tipo_suaje} 
                onChange={(e) => setParams({ ...params, tipo_suaje: e.target.value })}
              >
                <option value="Plano">Plano (Plegadizas Offset)</option>
                <option value="Rotativo">Rotativo (Flexo)</option>
              </select>
            </div>
          </div>

          <button 
            className="btn-primary-blue" 
            style={{ marginTop: '18px' }} 
            onClick={handleCalcular}
            disabled={calculating}
          >
            <Sparkles size={16} />
            <span>{calculating ? 'Calculando Optimización...' : 'Recalcular Imposición & Aprovechamiento'}</span>
          </button>
        </div>

        {/* Right: 2D Imposition Preview Card */}
        <div className="clean-kpi-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Aprovechamiento & Imposición 2D</h2>
              {resultado && (
                <span className={`badge-clean ${resultado.aprovechamiento_pliego_pct >= 80 ? 'badge-green' : 'badge-orange'}`}>
                  {resultado.aprovechamiento_pliego_pct}% Rendimiento
                </span>
              )}
            </div>

            {/* 2D Sheet Canvas Box */}
            <div className="sheet-visualizer-box">
              <div className="sheet-gripper-strip" title="Pinza de Prensa (Heidelberg)"></div>
              
              <div 
                className="sheet-canvas-grid"
                style={{
                  gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                  width: '85%',
                  height: '170px'
                }}
              >
                {resultado && Array.from({ length: resultado.poses_totales_por_pliego }).map((_, i) => (
                  <div key={i} className="sheet-pose-cell">
                    <Scissors size={14} style={{ marginBottom: '2px' }} />
                    <span>Pose #{i + 1}</span>
                    <span style={{ fontSize: '0.625rem', opacity: 0.8 }}>{params.ancho_desarrollo_mm}x{params.largo_desarrollo_mm}</span>
                  </div>
                ))}
              </div>

              <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.6875rem', color: '#94a3b8' }}>
                Pliego: {params.ancho_pliego_mm} x {params.largo_pliego_mm} mm | Distribución: {resultado?.distribucion}
              </div>
            </div>
          </div>

          {/* 4 Summary Stat Boxes from Reference Style */}
          {resultado && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Poses por Pliego:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284c7' }}>
                  {resultado.poses_totales_por_pliego} poses
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Pliegos Brutos de Compra:</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {resultado.pliegos_brutos_compra.toLocaleString()} hojas
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Metros Pleca (Corte/Doblez):</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#334155' }}>
                  {resultado.estimacion_tecnica_suaje.metros_pleca_corte}m / {resultado.estimacion_tecnica_suaje.metros_pleca_doblez}m
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Costo Estimado Suaje:</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#059669' }}>
                  ${resultado.estimacion_tecnica_suaje.costo_estimado_fabricacion_mxn.toLocaleString()} MXN
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inventory Table Card */}
      <div className="clean-table-card">
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} color="#0284c7" />
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Inventario de Suajes Activos en Taller RTM</h2>
          </div>
          <span className="badge-clean badge-blue">{suajesList.length} Herramentales Registrados</span>
        </div>

        <table className="clean-erp-table">
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
                <td className="mono-text" style={{ fontWeight: 700, color: '#0284c7' }}>{s.id}</td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.nombre}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.cliente}</div>
                </td>
                <td className="mono-text">{s.poses_por_pliego} poses ({s.disposicion})</td>
                <td>
                  <span className="badge-clean badge-green">{s.aprovechamiento_pct}%</span>
                </td>
                <td className="mono-text">
                  {s.golpes_acumulados.toLocaleString()} / {s.vida_util_estimada.toLocaleString()}
                </td>
                <td>
                  <span className="badge-clean badge-orange">{s.ubicacion_rack}</span>
                </td>
                <td>
                  <span className={`badge-clean ${s.estado.includes('En Uso') ? 'badge-green' : 'badge-blue'}`}>
                    {s.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
