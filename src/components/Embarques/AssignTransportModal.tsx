import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { 
  ShippingOutboundOrder, 
  MOCK_SHIPPING_VEHICLES, 
  MOCK_SHIPPING_DRIVERS,
  ShippingVehicle,
  ShippingDriver
} from '../../data/mockShippingData';
import { ModalPortal } from '../common/ModalPortal';

interface AssignTransportModalProps {
  order: ShippingOutboundOrder;
  onClose: () => void;
  onConfirm: (
    orderId: string,
    vehicleId: string,
    driverId: string,
    plannedDate: string,
    plannedTime: string,
    notes?: string
  ) => void;
}

export const AssignTransportModal: React.FC<AssignTransportModalProps> = ({
  order,
  onClose,
  onConfirm,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    order.assignedVehicleId || (MOCK_SHIPPING_VEHICLES.find((v) => v.status === 'Disponible')?.id || '')
  );
  const [selectedDriverId, setSelectedDriverId] = useState<string>(
    order.assignedDriverId || (MOCK_SHIPPING_DRIVERS.find((d) => d.status === 'Disponible')?.id || '')
  );
  const [plannedDate, setPlannedDate] = useState<string>(order.plannedDate || '28 Ago 2026');
  const [plannedTime, setPlannedTime] = useState<string>(order.plannedTime || '09:00');
  const [notes, setNotes] = useState<string>(order.notes || '');

  const selectedVehicle = MOCK_SHIPPING_VEHICLES.find((v) => v.id === selectedVehicleId);
  const selectedDriver = MOCK_SHIPPING_DRIVERS.find((d) => d.id === selectedDriverId);

  const isCapacitySufficient = selectedVehicle ? selectedVehicle.maxUnitsCapacity >= order.totalUnits : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !selectedDriverId) return;

    onConfirm(
      order.id,
      selectedVehicleId,
      selectedDriverId,
      plannedDate,
      plannedTime,
      notes.trim() || undefined
    );
  };

  return (
    <ModalPortal onClose={onClose}>
      <div className="w-full max-w-lg bg-theme-surface rounded-3xl shadow-2xl border border-theme-subtle overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-theme-subtle flex items-center justify-between bg-theme-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-rose-500/30 text-rose-600 flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-theme-main">
                  Asignar Transporte
                </h3>
                <span className="font-mono text-xs font-bold text-rose-600 px-2 py-0.5 rounded-full bg-white border border-rose-500 shadow-2xs">
                  {order.folio}
                </span>
              </div>
              <p className="text-[11px] text-theme-muted">
                {order.type} &bull; {order.totalUnits} piezas &rarr; {order.destinationName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-muted transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Order Summary Pill */}
          <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-zinc-500 uppercase">Documento Origen</span>
              <span className="font-mono font-bold text-zinc-900">{order.sourceDocumentType} {order.sourceDocumentFolio}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-zinc-500 uppercase">Remisión Amparada</span>
              <span className="font-mono font-bold text-rose-600">{order.remisionFolio}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-zinc-500 uppercase">Carga Total Requerida</span>
              <span className="font-mono font-black text-zinc-900">{order.totalUnits} unidades</span>
            </div>
          </div>

          {/* Vehicle Select */}
          <div className="space-y-1.5">
            <label className="font-black text-theme-main text-[11px] uppercase tracking-wider block">
              Unidad / Vehículo de Carga <span className="text-rose-600">*</span>
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-theme-surface border border-theme-subtle rounded-2xl px-3 py-2.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              required
            >
              <option value="">-- Seleccionar unidad vehicular --</option>
              {MOCK_SHIPPING_VEHICLES.map((veh) => (
                <option 
                  key={veh.id} 
                  value={veh.id}
                  disabled={veh.status === 'Mantenimiento'}
                >
                  {veh.name} &bull; Placas: {veh.plate} &bull; Capacidad: {veh.maxUnitsCapacity} u. ({veh.status})
                </option>
              ))}
            </select>
          </div>

          {/* Real-time Capacity Card */}
          {selectedVehicle && (
            <div className={`p-3.5 rounded-2xl bg-white border shadow-2xs space-y-2 ${
              isCapacitySufficient ? 'border-emerald-500' : 'border-amber-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-zinc-600">
                  Evaluación de Capacidad
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs bg-white ${
                  isCapacitySufficient 
                    ? 'border-emerald-600 text-emerald-700' 
                    : 'border-amber-600 text-amber-800'
                }`}>
                  {isCapacitySufficient ? 'Capacidad suficiente' : 'Capacidad excedida'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 block uppercase">Capacidad Unidad:</span>
                  <strong className="text-zinc-900 text-sm">{selectedVehicle.maxUnitsCapacity} unidades</strong>
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 block uppercase">Carga de Salida:</span>
                  <strong className="text-zinc-900 text-sm">{order.totalUnits} unidades</strong>
                </div>
              </div>

              {!isCapacitySufficient && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-semibold pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>La carga excede la capacidad estimada de esta unidad. Se sugiere asignar un vehículo de mayor porte o dividir en parcialidades.</span>
                </div>
              )}
            </div>
          )}

          {/* Driver Select */}
          <div className="space-y-1.5">
            <label className="font-black text-theme-main text-[11px] uppercase tracking-wider block">
              Chofer Asignado <span className="text-rose-600">*</span>
            </label>
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className="w-full bg-theme-surface border border-theme-subtle rounded-2xl px-3 py-2.5 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              required
            >
              <option value="">-- Seleccionar chofer --</option>
              {MOCK_SHIPPING_DRIVERS.map((drv) => (
                <option key={drv.id} value={drv.id} disabled={drv.status === 'En ruta'}>
                  {drv.name} &bull; {drv.licenseType} ({drv.status})
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-black text-theme-main text-[11px] uppercase tracking-wider block">
                Fecha Planeada
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
                <input
                  type="text"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                  placeholder="ej. 28 Ago 2026"
                  className="w-full bg-theme-surface border border-theme-subtle rounded-2xl pl-9 pr-3 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-black text-theme-main text-[11px] uppercase tracking-wider block">
                Hora Planeada
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-3 text-theme-muted" />
                <input
                  type="text"
                  value={plannedTime}
                  onChange={(e) => setPlannedTime(e.target.value)}
                  placeholder="ej. 09:30"
                  className="w-full bg-theme-surface border border-theme-subtle rounded-2xl pl-9 pr-3 py-2 text-xs text-theme-main font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-black text-theme-main text-[11px] uppercase tracking-wider block">
              Observaciones de Transporte / Ruta
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instrucciones para el chofer, maniobras o referencias de entrega..."
              rows={2}
              className="w-full bg-theme-surface border border-theme-subtle rounded-2xl p-3 text-xs text-theme-main font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/30"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-theme-subtle flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-theme-muted hover:bg-theme-subtle text-theme-main font-bold text-xs border border-theme-subtle transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedVehicleId || !selectedDriverId}
              className={`px-5 py-2 rounded-2xl font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                selectedVehicleId && selectedDriverId
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-300 dark:border-zinc-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar transporte</span>
            </button>
          </div>

        </form>

      </div>
    </ModalPortal>
  );
};
