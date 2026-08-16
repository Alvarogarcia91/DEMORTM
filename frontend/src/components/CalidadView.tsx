import React, { useState } from 'react';
import { QAInspection } from '../types';
import { postInspeccionQA } from '../services/api';
import { ShieldCheck, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="erp-content-area">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Aseguramiento de Calidad (QA) & Liberación de Lotes</h1>
          <p style={{ fontSize: '0.9375rem', color: '#64748b' }}>Auditorías de pre-prensa CTP, pie de máquina y liberación de producto terminado para RTM.</p>
        </div>

        <button className="btn-primary-blue" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setShowModal(true)}>
          <Plus size={16} />
          <span>Nueva Inspección QA</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="clean-kpi-card">
          <div className="kpi-card-top-row">
            <div className="kpi-icon-pastel" style={{ background: '#ecfdf5', color: '#059669' }}>
              <ShieldCheck size={18} strokeWidth={2.4} />
            </div>
            <span className="badge-clean badge-green">100% Trazable</span>
          </div>
          <div className="kpi-value-text">14 Lotes Liberados</div>
          <div className="kpi-subtext-gray">Liberación RTM sin no-conformidades hoy</div>
        </div>

        <div className="clean-kpi-card">
          <div className="kpi-card-top-row">
            <div className="kpi-icon-pastel" style={{ background: '#eff6ff', color: '#0284c7' }}>
              <CheckCircle2 size={18} strokeWidth={2.4} />
            </div>
            <span className="badge-clean badge-blue">&lt; 2.0 &Delta;E Meta</span>
          </div>
          <div className="kpi-value-text">1.28 &Delta;E Promedio</div>
          <div className="kpi-subtext-gray">Espectrofotometría y densidad de tintas</div>
        </div>

        <div className="clean-kpi-card">
          <div className="kpi-card-top-row">
            <div className="kpi-icon-pastel" style={{ background: '#faf5ff', color: '#9333ea' }}>
              <ShieldCheck size={18} strokeWidth={2.4} />
            </div>
            <span className="badge-clean badge-green">99.4% Aprobado</span>
          </div>
          <div className="kpi-value-text">Pre-prensa CTP OK</div>
          <div className="kpi-subtext-gray">Trampas, sobreimpresión y textos a curvas</div>
        </div>
      </div>

      {/* Clean QA Table */}
      <div className="clean-table-card">
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Registro de Inspecciones & Auditorías QA</h2>
          <span className="badge-clean badge-blue">{inspecciones.length} Auditorías Recientes</span>
        </div>

        <table className="clean-erp-table">
          <thead>
            <tr>
              <th>ID Auditoría</th>
              <th>Orden / Lote</th>
              <th>Etapa del Proceso</th>
              <th>Inspector QA</th>
              <th>&Delta;E Color</th>
              <th>Pruebas Clave (Cinta, BarCode, Suaje)</th>
              <th>Dictamen</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {inspecciones.map((insp) => (
              <tr key={insp.id}>
                <td className="mono-text" style={{ fontWeight: 800, color: '#0284c7' }}>{insp.id}</td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{insp.id_orden}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lote: {insp.lote}</div>
                </td>
                <td>
                  <span className="badge-clean badge-blue">{insp.proceso}</span>
                </td>
                <td style={{ fontSize: '0.8125rem', color: '#475569' }}>{insp.inspector}</td>
                <td className="mono-text" style={{ fontWeight: 800 }}>
                  {insp.delta_e_promedio} &Delta;E
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="badge-clean badge-green">Cinta OK</span>
                    <span className="badge-clean badge-green">BarCode A</span>
                    <span className="badge-clean badge-green">Suaje OK</span>
                  </div>
                </td>
                <td>
                  <span className={`badge-clean ${
                    insp.resultado === 'Aprobado' ? 'badge-green' :
                    insp.resultado === 'Aprobado con Observación' ? 'badge-orange' : 'badge-red'
                  }`}>
                    {insp.resultado}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{insp.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clean QA Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-clean" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-clean">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Registrar Inspección de Calidad (QA)</h2>
              <button className="close-clean-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="input-label-clean">Orden de Producción (OP)</label>
                  <input 
                    type="text" 
                    className="input-clean" 
                    value={form.id_orden}
                    onChange={(e) => setForm({ ...form, id_orden: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label-clean">Lote de Fabricación</label>
                  <input 
                    type="text" 
                    className="input-clean" 
                    value={form.lote}
                    onChange={(e) => setForm({ ...form, lote: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label-clean">Etapa de Inspección</label>
                  <select 
                    className="input-clean"
                    value={form.proceso}
                    onChange={(e) => setForm({ ...form, proceso: e.target.value })}
                  >
                    <option value="Pre-impresión (CTP)">Pre-impresión (CTP / Placas)</option>
                    <option value="Pie de Máquina">Pie de Máquina (Tiro de Prensa)</option>
                    <option value="Auditoría Producto Terminado">Auditoría Producto Terminado</option>
                  </select>
                </div>

                <div>
                  <label className="input-label-clean">Inspector QA</label>
                  <input 
                    type="text" 
                    className="input-clean" 
                    value={form.inspector}
                    onChange={(e) => setForm({ ...form, inspector: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="input-label-clean">Delta E Promedio (&Delta;E)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="input-clean" 
                    value={form.delta_e_promedio}
                    onChange={(e) => setForm({ ...form, delta_e_promedio: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div>
                  <label className="input-label-clean">Dictamen Final</label>
                  <select 
                    className="input-clean"
                    value={form.resultado}
                    onChange={(e) => setForm({ ...form, resultado: e.target.value as any })}
                  >
                    <option value="Aprobado">Aprobado para Entrega</option>
                    <option value="Aprobado con Observación">Aprobado con Observación</option>
                    <option value="Rechazado">Rechazado / Retrabajo</option>
                  </select>
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px', margin: '16px 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                  PUNTOS CRÍTICOS DE CONTROL RTM:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8125rem' }}>
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

              <div style={{ marginBottom: '16px' }}>
                <label className="input-label-clean">Observaciones de Liberación</label>
                <textarea 
                  className="input-clean" 
                  rows={3}
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-white-action" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-blue" style={{ width: 'auto', padding: '10px 24px' }} disabled={saving}>
                  {saving ? 'Guardando...' : 'Liberar Lote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
