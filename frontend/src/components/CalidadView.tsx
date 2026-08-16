import React, { useState } from 'react';
import { QAInspection } from '../types';
import { postInspeccionQA } from '../services/api';
import { CheckCircle2, ShieldCheck, AlertCircle, Plus, Sparkles, FileText, Check, X } from 'lucide-react';

interface CalidadViewProps {
  inspecciones: QAInspection[];
  onRefresh: () => void;
}

export const CalidadView: React.FC<CalidadViewProps> = ({ inspecciones, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id_orden: 'OP-2026-881',
    lote: 'LOT-2026-881-A',
    proceso: 'Auditoría Producto Terminado',
    inspector: 'Mariana Gómez (QA Lead)',
    delta_e_promedio: 1.25,
    registro_color: true,
    adherencia_tinta_cinta: true,
    lectura_codigo_barras: true,
    suajado_alineacion: true,
    barniz_homogeneo: true,
    resultado: 'Aprobado' as 'Aprobado' | 'Aprobado con Observación' | 'Rechazado',
    notas: 'Lote cumple con especificaciones ISO 12647 y tolerancias farmacéuticas.'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await postInspeccionQA(form);
      setShowModal(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Aseguramiento de Calidad (QA) & Liberación de Lotes</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Auditorías de pre-impresión CTP, pie de máquina y liberación de producto terminado para RTM.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          <span>Nueva Inspección QA</span>
        </button>
      </div>

      {/* QA KPI Metrics */}
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Lotes Liberados Hoy</span>
            <ShieldCheck size={20} color="var(--status-success)" />
          </div>
          <div className="metric-value">14 lotes</div>
          <div className="metric-subtext" style={{ color: 'var(--status-success)' }}>
            100% trazabilidad RTM
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Delta E Promedio (&Delta;E)</span>
            <span className="badge badge-success">&lt; 2.0 Tolerancia</span>
          </div>
          <div className="metric-value">1.28 &Delta;E</div>
          <div className="metric-subtext">
            Espectrofotometría X-Rite
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Inspección Pre-prensa CTP</span>
            <CheckCircle2 size={20} color="var(--accent-blue-light)" />
          </div>
          <div className="metric-value">99.4%</div>
          <div className="metric-subtext">
            Trampas, curvas y lineatura ok
          </div>
        </div>
      </div>

      {/* Inspections List */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.125rem' }}>Registro de Inspecciones & Auditorías QA</h2>
          <span className="badge badge-blue">{inspecciones.length} Auditorías Recientes</span>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Auditoría</th>
                <th>Orden / Lote</th>
                <th>Etapa del Proceso</th>
                <th>Inspector QA</th>
                <th>&Delta;E Color</th>
                <th>Pruebas Clave (Adherencia, Código, Suaje)</th>
                <th>Dictamen</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {inspecciones.map((insp) => (
                <tr key={insp.id}>
                  <td className="mono-text" style={{ fontWeight: 700, color: '#38bdf8' }}>{insp.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{insp.id_orden}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lote: {insp.lote}</div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{insp.proceso}</span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>{insp.inspector}</td>
                  <td className="mono-text" style={{ fontWeight: 700 }}>
                    {insp.delta_e_promedio} &Delta;E
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem' }}>
                      <span className={`badge ${insp.adherencia_tinta_cinta ? 'badge-success' : 'badge-danger'}`}>
                        {insp.adherencia_tinta_cinta ? 'Cinta OK' : 'Fallo Cinta'}
                      </span>
                      <span className={`badge ${insp.lectura_codigo_barras ? 'badge-success' : 'badge-danger'}`}>
                        {insp.lectura_codigo_barras ? 'BarCode A' : 'BarCode F'}
                      </span>
                      <span className={`badge ${insp.suajado_alineacion ? 'badge-success' : 'badge-danger'}`}>
                        {insp.suajado_alineacion ? 'Suaje OK' : 'Desfase'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      insp.resultado === 'Aprobado' ? 'badge-success' :
                      insp.resultado === 'Aprobado con Observación' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {insp.resultado}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{insp.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Inspeccion QA */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--accent-blue-light)" />
                <span>Registrar Inspección de Calidad (QA)</span>
              </h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Orden de Producción (OP)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={form.id_orden}
                    onChange={(e) => setForm({ ...form, id_orden: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lote de Fabricación</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={form.lote}
                    onChange={(e) => setForm({ ...form, lote: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Etapa de Inspección</label>
                  <select 
                    className="form-select"
                    value={form.proceso}
                    onChange={(e) => setForm({ ...form, proceso: e.target.value })}
                  >
                    <option value="Pre-impresión (CTP)">Pre-impresión (CTP / Placas)</option>
                    <option value="Pie de Máquina">Pie de Máquina (Tiro de Prensa)</option>
                    <option value="Auditoría Producto Terminado">Auditoría Producto Terminado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Inspector QA</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={form.inspector}
                    onChange={(e) => setForm({ ...form, inspector: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Delta E Promedio (&Delta;E)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-input" 
                    value={form.delta_e_promedio}
                    onChange={(e) => setForm({ ...form, delta_e_promedio: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dictamen Final</label>
                  <select 
                    className="form-select"
                    value={form.resultado}
                    onChange={(e) => setForm({ ...form, resultado: e.target.value as any })}
                  >
                    <option value="Aprobado">Aprobado para Entrega</option>
                    <option value="Aprobado con Observación">Aprobado con Observación</option>
                    <option value="Rechazado">Rechazado / Retrabajo</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes for Quality Gates */}
              <div style={{ background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-md)', margin: '14px 0', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-secondary)' }}>
                  PUNTOS CRÍTICOS DE CONTROL RTM:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8125rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.adherencia_tinta_cinta} 
                      onChange={(e) => setForm({ ...form, adherencia_tinta_cinta: e.target.checked })} 
                    />
                    <span>Prueba Adherencia Cinta (3M)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.lectura_codigo_barras} 
                      onChange={(e) => setForm({ ...form, lectura_codigo_barras: e.target.checked })} 
                    />
                    <span>Lectura Código de Barras (Grado A)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.suajado_alineacion} 
                      onChange={(e) => setForm({ ...form, suajado_alineacion: e.target.checked })} 
                    />
                    <span>Alineación de Suaje y Hendido</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.barniz_homogeneo} 
                      onChange={(e) => setForm({ ...form, barniz_homogeneo: e.target.checked })} 
                    />
                    <span>Espesor Homogéneo Barniz UV</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Observaciones y Notas de Liberación</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Liberar / Guardar Auditoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
