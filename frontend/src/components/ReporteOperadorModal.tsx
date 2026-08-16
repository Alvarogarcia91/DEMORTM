import React, { useState } from 'react';
import { postReporteOperador } from '../services/api';
import { Zap, Clock, AlertTriangle, CheckCircle, Printer } from 'lucide-react';

interface ReporteOperadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReporteOperadorModal: React.FC<ReporteOperadorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_orden: 'OP-2026-881',
    maquina: 'Heidelberg Speedmaster CD 102 (Offset)',
    tecnologia: 'Offset',
    operador: 'Carlos Mendoza',
    turno: 'Turno 1 (Matutino)',
    pliegos_impresos: 15000,
    pliegos_buenos: 14650,
    merma_hojas: 350,
    velocidad_promedio_rpm: 9800,
    tiempo_tiro_min: 195,
    tiempo_preparacion_min: 45,
    motivo_paro: 'Lavado de mantillas y ajuste de tintero',
    observaciones: 'Producción dentro de estándar de color y registro.'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postReporteOperador({
        ...formData,
        paros_motivos: [{ motivo: formData.motivo_paro, tiempo_min: 20 }]
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={20} color="var(--accent-blue-light)" />
            <span>Captura de Reporte de Turno / Operador</span>
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Orden de Producción (OP)</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.id_orden}
                onChange={(e) => setFormData({ ...formData, id_orden: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prensa / Máquina</label>
              <select 
                className="form-select"
                value={formData.maquina}
                onChange={(e) => {
                  const isOffset = e.target.value.includes('Offset');
                  setFormData({
                    ...formData,
                    maquina: e.target.value,
                    tecnologia: isOffset ? 'Offset' : 'Flexo'
                  });
                }}
              >
                <option value="Heidelberg Speedmaster CD 102 (Offset)">Heidelberg Speedmaster CD 102 (Offset)</option>
                <option value="Komori Lithrone G40 (Offset)">Komori Lithrone G40 (Offset)</option>
                <option value="Mark Andy Performance Series P7 (Flexo)">Mark Andy Performance P7 (Flexo)</option>
                <option value="Nilpeter FA-Line (Flexo)">Nilpeter FA-Line (Flexo)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Operador Responsable</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.operador}
                onChange={(e) => setFormData({ ...formData, operador: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Turno</label>
              <select 
                className="form-select"
                value={formData.turno}
                onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
              >
                <option value="Turno 1 (Matutino)">Turno 1 (Matutino: 06:00 - 14:00)</option>
                <option value="Turno 2 (Vespertino)">Turno 2 (Vespertino: 14:00 - 22:00)</option>
                <option value="Turno 3 (Nocturno)">Turno 3 (Nocturno: 22:00 - 06:00)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Total Tiraje Contabilizado</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.pliegos_impresos}
                onChange={(e) => setFormData({ ...formData, pliegos_impresos: parseInt(e.target.value, 10) || 0 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pliegos / Metros Buenos</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.pliegos_buenos}
                onChange={(e) => setFormData({ ...formData, pliegos_buenos: parseInt(e.target.value, 10) || 0 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Merma de Impresión (Hojas/m)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.merma_hojas}
                onChange={(e) => setFormData({ ...formData, merma_hojas: parseInt(e.target.value, 10) || 0 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Velocidad Régimen (rpm o m/min)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.velocidad_promedio_rpm}
                onChange={(e) => setFormData({ ...formData, velocidad_promedio_rpm: parseInt(e.target.value, 10) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tiempo de Puesta a Punto (min)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.tiempo_preparacion_min}
                onChange={(e) => setFormData({ ...formData, tiempo_preparacion_min: parseInt(e.target.value, 10) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tiempo Efectivo de Tiro (min)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.tiempo_tiro_min}
                onChange={(e) => setFormData({ ...formData, tiempo_tiro_min: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '8px' }}>
            <label className="form-label">Motivos de Paro / Incidencias Durante el Turno</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.motivo_paro}
              onChange={(e) => setFormData({ ...formData, motivo_paro: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones Adicionales</label>
            <textarea 
              className="form-textarea" 
              rows={2}
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Guardar Reporte de Operador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
